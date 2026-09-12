import test from 'node:test';
import assert from 'node:assert/strict';
import piMascotExtension from '../dist/index.js';

function createContext() {
  const statuses = [];
  const widgets = [];
  const notifications = [];
  return {
    statuses,
    widgets,
    notifications,
    ui: {
      setStatus: (key, text) => statuses.push({ key, text }),
      setWidget: (key, lines) => widgets.push({ key, lines }),
      notify: (text, level) => notifications.push({ text, level }),
    },
  };
}

test('Extension - registers only supported Pi events and does not start a factory timer', () => {
  const events = new Map();
  const commands = new Map();
  const originalSetInterval = global.setInterval;
  let timerStarts = 0;
  global.setInterval = (...args) => {
    timerStarts += 1;
    return originalSetInterval(...args);
  };

  try {
    const controller = piMascotExtension({
      registerCommand: (name, definition) => commands.set(name, definition),
      on: (name, handler) => events.set(name, handler),
    });

    assert.equal(timerStarts, 0);
    assert.ok(commands.has('mascot'));
    assert.deepEqual([...events.keys()].sort(), [
      'agent_end',
      'agent_settled',
      'agent_start',
      'before_agent_start',
      'session_shutdown',
      'session_start',
      'tool_execution_end',
      'tool_execution_start',
      'tool_execution_update',
      'turn_end',
      'turn_start',
    ]);

    events.get('session_start')({ type: 'session_start', reason: 'startup' }, createContext());
    assert.equal(timerStarts, 1);
    controller.dispose();
  } finally {
    global.setInterval = originalSetInterval;
  }
});

test('Extension - renders using the latest real event or command context', async () => {
  const events = new Map();
  const commands = new Map();
  const controller = piMascotExtension({
    registerCommand: (name, definition) => commands.set(name, definition),
    on: (name, handler) => events.set(name, handler),
  });
  const startContext = createContext();
  const readContext = createContext();
  const commandContext = createContext();

  events.get('session_start')({ type: 'session_start', reason: 'startup' }, startContext);
  assert.deepEqual(startContext.statuses.at(-1).key, 'pi-mascot');
  assert.deepEqual(startContext.widgets.at(-1).key, 'pi-mascot');

  events.get('tool_execution_start')(
    { type: 'tool_execution_start', toolCallId: '1', toolName: 'read', args: { path: 'README.md' } },
    readContext,
  );
  assert.equal(controller.getState().activity, 'reading');
  assert.match(readContext.statuses.at(-1).text, /reading/);
  assert.equal(startContext.statuses.length, 1);

  await commands.get('mascot').handler('off', commandContext);
  assert.match(commandContext.statuses.at(-1).text, /desactivada/i);
  assert.deepEqual(commandContext.widgets.at(-1).lines, [commandContext.statuses.at(-1).text]);
  assert.equal(commandContext.notifications.at(-1).level, 'info');
  controller.dispose();
});

test('Extension - session shutdown clears UI and disposes the controller', () => {
  const events = new Map();
  const controller = piMascotExtension({ on: (name, handler) => events.set(name, handler) });
  const context = createContext();

  events.get('session_start')({ type: 'session_start', reason: 'startup' }, context);
  events.get('session_shutdown')({ type: 'session_shutdown', reason: 'quit' }, context);

  assert.equal(controller.isDisposed(), true);
  assert.deepEqual(context.statuses.at(-1), { key: 'pi-mascot', text: undefined });
  assert.deepEqual(context.widgets.at(-1), { key: 'pi-mascot', lines: undefined });
});
