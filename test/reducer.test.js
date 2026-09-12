import test from 'node:test';
import assert from 'node:assert/strict';
import {
  mascotReducer,
  initialMascotState,
} from '../dist/reducer.js';

test('Mascot Reducer - Initial State', () => {
  assert.equal(initialMascotState.mascot, 'perrogato');
  assert.equal(initialMascotState.activity, 'idle');
  assert.equal(initialMascotState.previousActivity, null);
  assert.equal(initialMascotState.enabled, true);
  assert.equal(initialMascotState.motion, 'auto');
  assert.equal(initialMascotState.frameIndex, 0);
});

test('Mascot Reducer - Activity Transitions for all 9 states', () => {
  const activities = [
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

  let state = initialMascotState;
  for (const activity of activities) {
    const prev = state.activity;
    state = mascotReducer(state, {
      type: 'SET_ACTIVITY',
      activity,
      message: `Doing ${activity}`,
    });

    assert.equal(state.activity, activity);
    assert.equal(state.message, `Doing ${activity}`);
    if (prev !== activity) {
      assert.equal(state.previousActivity, prev);
      assert.equal(state.frameIndex, 0); // Frame resets on activity change
    }
  }
});

test('Mascot Reducer - TICK advances frames in auto/full motion', () => {
  let state = { ...initialMascotState, motion: 'full', frameIndex: 0 };
  state = mascotReducer(state, { type: 'TICK' });
  assert.equal(state.frameIndex, 1);

  state = mascotReducer(state, { type: 'TICK' });
  assert.equal(state.frameIndex, 2);
});

test('Mascot Reducer - TICK does NOT advance frames when motion is reduced or off', () => {
  let stateReduced = { ...initialMascotState, motion: 'reduced', frameIndex: 0 };
  stateReduced = mascotReducer(stateReduced, { type: 'TICK' });
  assert.equal(stateReduced.frameIndex, 0);

  let stateOff = { ...initialMascotState, motion: 'off', frameIndex: 0 };
  stateOff = mascotReducer(stateOff, { type: 'TICK' });
  assert.equal(stateOff.frameIndex, 0);
});

test('Mascot Reducer - Toggle enabled', () => {
  let state = mascotReducer(initialMascotState, { type: 'SET_ENABLED', enabled: false });
  assert.equal(state.enabled, false);

  state = mascotReducer(state, { type: 'SET_ENABLED', enabled: true });
  assert.equal(state.enabled, true);
});

test('Mascot Reducer - Motion mode switching', () => {
  for (const mode of ['auto', 'full', 'reduced', 'off']) {
    const state = mascotReducer(initialMascotState, { type: 'SET_MOTION', motion: mode });
    assert.equal(state.motion, mode);
  }
});

test('Mascot Reducer - Select mascot accepts perrogato and rejects others', () => {
  const state = mascotReducer(initialMascotState, { type: 'SET_MASCOT', mascot: 'perrogato' });
  assert.equal(state.mascot, 'perrogato');

  assert.throws(() => {
    mascotReducer(initialMascotState, { type: 'SET_MASCOT', mascot: 'doge' });
  }, /Only Perrogato mascot is supported in Phase 1/);
});

test('Mascot Reducer - RESET action returns to initial state', () => {
  let state = mascotReducer(initialMascotState, { type: 'SET_ACTIVITY', activity: 'writing' });
  state = mascotReducer(state, { type: 'SET_ENABLED', enabled: false });
  state = mascotReducer(state, { type: 'RESET' });

  assert.equal(state.activity, 'idle');
  assert.equal(state.enabled, true);
  assert.equal(state.frameIndex, 0);
});
