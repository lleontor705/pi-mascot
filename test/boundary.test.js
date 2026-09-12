import test from 'node:test';
import assert from 'node:assert/strict';
import { PiCompatibilityBoundary } from '../dist/boundary.js';

test('Boundary - registers commands through ExtensionAPI without inventing UI capabilities', () => {
  const commands = [];
  const boundary = new PiCompatibilityBoundary({
    registerCommand: (name, definition) => commands.push({ name, definition }),
  });

  assert.equal(boundary.registerCommandSafe('mascot', { description: 'Gestiona la mascota', handler: () => {} }), true);
  assert.equal(commands[0].name, 'mascot');
});

test('Boundary - writes status, widget, and notifications through the supplied context UI', () => {
  const statuses = [];
  const widgets = [];
  const notices = [];
  const ctx = {
    ui: {
      setStatus: (key, text) => statuses.push({ key, text }),
      setWidget: (key, lines) => widgets.push({ key, lines }),
      notify: (text, level) => notices.push({ text, level }),
    },
  };
  const boundary = new PiCompatibilityBoundary({});

  assert.equal(boundary.renderSafe(ctx, 'Perrogato [idle]'), true);
  assert.equal(boundary.notifySafe(ctx, 'Mascota activa', 'info'), true);
  assert.deepEqual(statuses, [{ key: 'pi-mascot', text: 'Perrogato [idle]' }]);
  assert.deepEqual(widgets, [{ key: 'pi-mascot', lines: ['Perrogato [idle]'] }]);
  assert.deepEqual(notices, [{ text: 'Mascota activa', level: 'info' }]);
});

test('Boundary - clears both UI slots through the supplied context', () => {
  const statuses = [];
  const widgets = [];
  const boundary = new PiCompatibilityBoundary({});
  const ctx = {
    ui: {
      setStatus: (key, text) => statuses.push({ key, text }),
      setWidget: (key, lines) => widgets.push({ key, lines }),
    },
  };

  assert.equal(boundary.clearSafe(ctx), true);
  assert.deepEqual(statuses, [{ key: 'pi-mascot', text: undefined }]);
  assert.deepEqual(widgets, [{ key: 'pi-mascot', lines: undefined }]);
});
