import test from 'node:test';
import assert from 'node:assert/strict';
import { mapEventToActivity, mapToolToActivity } from '../dist/mapper.js';

test('Mapper - maps only real Pi read and write tool names', () => {
  assert.equal(mapToolToActivity('read'), 'reading');
  assert.equal(mapToolToActivity('write'), 'writing');
  assert.equal(mapToolToActivity('edit'), 'writing');
  assert.equal(mapToolToActivity('patch'), 'writing');
  assert.equal(mapToolToActivity('unknown_custom_tool'), 'thinking');
});

test('Mapper - classifies shell tools as testing only for test-like commands', () => {
  for (const command of ['npm test', 'npm run lint', 'npm run build', 'pytest -q', 'cargo check']) {
    assert.equal(mapToolToActivity('bash', { command }), 'testing', command);
  }

  for (const command of ['ls -la', 'git status', 'echo hello']) {
    assert.equal(mapToolToActivity('bash', { command }), 'thinking', command);
  }

  assert.equal(mapToolToActivity('terminal', { command: 'npm test' }), 'testing');
  assert.equal(mapToolToActivity('cmd', { command: 'dir' }), 'thinking');
});

test('Mapper - maps real tool execution payloads conservatively', () => {
  assert.equal(
    mapEventToActivity({ type: 'tool_execution_start', toolName: 'read', args: { path: 'README.md' } }),
    'reading',
  );
  assert.equal(
    mapEventToActivity({ type: 'tool_execution_start', toolName: 'bash', args: { command: 'npm test' } }),
    'testing',
  );
  assert.equal(
    mapEventToActivity({ type: 'tool_execution_start', toolName: 'bash', args: { command: 'git status' } }),
    'thinking',
  );
  assert.equal(
    mapEventToActivity({ type: 'tool_execution_end', toolName: 'read', result: {}, isError: false }),
    'success',
  );
  assert.equal(
    mapEventToActivity({ type: 'tool_execution_end', toolName: 'read', result: {}, isError: true }),
    'warning',
  );
});

test('Mapper - maps supported lifecycle events without inventing idle events', () => {
  assert.equal(mapEventToActivity('before_agent_start'), 'thinking');
  assert.equal(mapEventToActivity('agent_start'), 'thinking');
  assert.equal(mapEventToActivity('turn_start'), 'thinking');
  assert.equal(mapEventToActivity('agent_settled'), 'success');
  assert.equal(mapEventToActivity('turn_end'), 'success');
  assert.equal(mapEventToActivity('session_idle'), 'idle');
});
