import test from 'node:test';
import assert from 'node:assert/strict';
import { MascotController } from '../dist/mascot.js';

test('Controller - initializes Perrogato without starting an animation loop', () => {
  const controller = new MascotController();
  assert.deepEqual(
    { mascot: controller.getState().mascot, activity: controller.getState().activity, enabled: controller.getState().enabled },
    { mascot: 'perrogato', activity: 'idle', enabled: true },
  );
  controller.dispose();
});

test('Controller - commands and visible text are Spanish', () => {
  const notices = [];
  const controller = new MascotController();
  const ctx = { ui: { notify: (text, level) => notices.push({ text, level }) } };

  assert.match(controller.handleCommand('status', ctx), /Estado de Perrogato/);
  assert.match(controller.handleCommand('off', ctx), /desactivada/i);
  assert.match(controller.handleCommand('motion turbo', ctx), /modo de movimiento no válido/i);
  assert.match(controller.handleCommand('help', ctx), /Uso y comandos/i);
  assert.equal(notices.length, 4);
  controller.dispose();
});

test('Controller - ticks only while enabled and disposes idempotently', () => {
  const controller = new MascotController();
  controller.setMotion('full');
  controller.tick();
  assert.equal(controller.getState().frameIndex, 1);
  controller.disable();
  controller.tick();
  assert.equal(controller.getState().frameIndex, 1);
  controller.dispose();
  controller.dispose();
  assert.equal(controller.isDisposed(), true);
});
