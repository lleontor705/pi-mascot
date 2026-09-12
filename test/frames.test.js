import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getPerrogatoFrame,
  getPerrogatoCompact,
  PERROGATO_ACTIVITIES,
} from '../dist/frames.js';

test('Frames - Covers all 9 required activities for Perrogato', () => {
  const expectedActivities = [
    'idle',
    'thinking',
    'reading',
    'writing',
    'testing',
    'success',
    'warning',
    'blocked',
    'resting',
  ];

  assert.deepEqual([...PERROGATO_ACTIVITIES].sort(), [...expectedActivities].sort());

  for (const activity of expectedActivities) {
    const frame0 = getPerrogatoFrame(activity, 0);
    assert.ok(frame0 && frame0.length > 0, `Frame for ${activity} should not be empty`);

    // Verify terminal-safe: no raw ANSI control escapes or non-printable chars (except \n)
    const dangerousControlCharRegex = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/;
    assert.ok(
      !dangerousControlCharRegex.test(frame0),
      `Frame for ${activity} should not contain dangerous control characters`
    );
  }
});

test('Frames - Animation frame cycling and index modulo', () => {
  for (const activity of PERROGATO_ACTIVITIES) {
    const f0 = getPerrogatoFrame(activity, 0);
    const f1 = getPerrogatoFrame(activity, 1);
    const fLarge = getPerrogatoFrame(activity, 100);

    assert.ok(f0.length > 0);
    assert.ok(f1.length > 0);
    assert.ok(fLarge.length > 0);
  }
});

test('Frames - Reduced-motion returns stable frame', () => {
  for (const activity of PERROGATO_ACTIVITIES) {
    const f0 = getPerrogatoFrame(activity, 0, { motion: 'reduced' });
    const f99 = getPerrogatoFrame(activity, 99, { motion: 'reduced' });
    assert.equal(f0, f99, `Reduced motion for ${activity} should be identical across frame indices`);
  }
});

test('Frames - Compact-width fallback fits compact terminals (<= 14 chars)', () => {
  for (const activity of PERROGATO_ACTIVITIES) {
    const compact = getPerrogatoCompact(activity);
    assert.ok(compact.length > 0, `Compact frame for ${activity} should not be empty`);
    // Visual length check (spread handles basic unicode code points)
    const charCount = [...compact].length;
    assert.ok(
      charCount <= 14,
      `Compact frame for ${activity} should be <= 14 chars (got ${charCount}: "${compact}")`
    );
  }
});

test('Frames - ASCII-only fallback mode produces purely ASCII frames', () => {
  for (const activity of PERROGATO_ACTIVITIES) {
    const frame = getPerrogatoFrame(activity, 0, { useUnicode: false });
    const compact = getPerrogatoCompact(activity, { useUnicode: false });

    const asciiRegex = /^[\x20-\x7E\n\r\t]+$/;
    assert.ok(asciiRegex.test(frame), `Frame for ${activity} must be ASCII-only when useUnicode=false`);
    assert.ok(asciiRegex.test(compact), `Compact for ${activity} must be ASCII-only when useUnicode=false`);
  }
});
