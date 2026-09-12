import test from 'node:test';
import assert from 'node:assert/strict';
import { renderMascot } from '../dist/renderer.js';
import { initialMascotState } from '../dist/reducer.js';

test('Renderer - Renders normal active mascot state', () => {
  const rendered = renderMascot(initialMascotState);
  assert.equal(rendered.enabled, true);
  assert.equal(rendered.activity, 'idle');
  assert.ok(rendered.art.length > 0);
  assert.ok(rendered.compact.length > 0);
  assert.ok(rendered.line.length > 0);
  assert.match(rendered.line, /idle/i);
});

test('Renderer - Handles disabled mascot state', () => {
  const disabledState = { ...initialMascotState, enabled: false };
  const rendered = renderMascot(disabledState);
  assert.equal(rendered.enabled, false);
  assert.match(rendered.line, /desactivada/i);
  assert.match(rendered.compact, /off|zzz|-/i);
});

test('Renderer - Respects motion mode "off" and "reduced"', () => {
  const stateFull = { ...initialMascotState, motion: 'full', frameIndex: 1 };
  const stateOff = { ...initialMascotState, motion: 'off', frameIndex: 1 };
  const stateReduced = { ...initialMascotState, motion: 'reduced', frameIndex: 1 };

  const rFull = renderMascot(stateFull);
  const rOff = renderMascot(stateOff);
  const rReduced = renderMascot(stateReduced);

  assert.equal(rOff.motion, 'off');
  assert.equal(rReduced.motion, 'reduced');
  assert.ok(rOff.art.length > 0);
  assert.ok(rReduced.art.length > 0);
});

test('Renderer - Compact width fallback for narrow terminals (< 40 cols)', () => {
  const renderedWide = renderMascot(initialMascotState, { terminalWidth: 100 });
  const renderedNarrow = renderMascot(initialMascotState, { terminalWidth: 35 });

  assert.ok(renderedWide.art.length > 0);
  // Narrow should prioritize compact line
  assert.ok(renderedNarrow.line.length <= 35, `Rendered line in 35-col width should fit (${renderedNarrow.line.length})`);
});

test('Renderer - Formats status with custom message', () => {
  const stateWithMessage = {
    ...initialMascotState,
    activity: 'reading',
    message: 'Analyzing package.json',
  };

  const rendered = renderMascot(stateWithMessage);
  assert.match(rendered.line, /reading/i);
  assert.match(rendered.line, /Analyzing package\.json/);
});
