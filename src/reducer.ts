import type { MascotState, MascotAction, MotionMode } from './types.js';
import { MOTION_MODES } from './types.js';

export const initialMascotState: MascotState = {
  mascot: 'perrogato',
  activity: 'idle',
  previousActivity: null,
  enabled: true,
  motion: 'auto',
  frameIndex: 0,
  lastUpdated: 0,
};

export function mascotReducer(
  state: MascotState = initialMascotState,
  action: MascotAction
): MascotState {
  switch (action.type) {
    case 'SET_ACTIVITY': {
      const isDifferent = state.activity !== action.activity;
      return {
        ...state,
        activity: action.activity,
        previousActivity: isDifferent ? state.activity : state.previousActivity,
        frameIndex: isDifferent ? 0 : state.frameIndex,
        message: action.message,
        lastUpdated: Date.now(),
      };
    }

    case 'TICK': {
      if (!state.enabled || state.motion === 'off' || state.motion === 'reduced') {
        return state;
      }
      return {
        ...state,
        frameIndex: state.frameIndex + 1,
      };
    }

    case 'SET_ENABLED': {
      return {
        ...state,
        enabled: action.enabled,
        lastUpdated: Date.now(),
      };
    }

    case 'SET_MOTION': {
      if (!MOTION_MODES.includes(action.motion as MotionMode)) {
        return state;
      }
      return {
        ...state,
        motion: action.motion,
        frameIndex: action.motion === 'reduced' || action.motion === 'off' ? 0 : state.frameIndex,
        lastUpdated: Date.now(),
      };
    }

    case 'SET_MASCOT': {
      if (action.mascot.toLowerCase() !== 'perrogato') {
        throw new Error(
          `Only Perrogato mascot is supported in Phase 1. Unknown mascot: "${action.mascot}"`
        );
      }
      return {
        ...state,
        mascot: 'perrogato',
        lastUpdated: Date.now(),
      };
    }

    case 'RESET': {
      return {
        ...initialMascotState,
        lastUpdated: Date.now(),
      };
    }

    default:
      return state;
  }
}
