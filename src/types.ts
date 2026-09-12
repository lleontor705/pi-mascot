/**
 * Core type definitions for pi-mascot extension.
 */

export type MascotType = 'perrogato';

export const SUPPORTED_MASCOTS: readonly MascotType[] = ['perrogato'] as const;

export type MascotActivity =
  | 'idle'
  | 'thinking'
  | 'reading'
  | 'writing'
  | 'testing'
  | 'success'
  | 'warning'
  | 'blocked'
  | 'resting';

export const MASCOT_ACTIVITIES: readonly MascotActivity[] = [
  'idle',
  'thinking',
  'reading',
  'writing',
  'testing',
  'success',
  'warning',
  'blocked',
  'resting',
] as const;

export type MotionMode = 'auto' | 'full' | 'reduced' | 'off';

export const MOTION_MODES: readonly MotionMode[] = [
  'auto',
  'full',
  'reduced',
  'off',
] as const;

export interface MascotState {
  mascot: MascotType;
  activity: MascotActivity;
  previousActivity: MascotActivity | null;
  enabled: boolean;
  motion: MotionMode;
  frameIndex: number;
  message?: string;
  lastUpdated: number;
}

export type MascotAction =
  | { type: 'SET_ACTIVITY'; activity: MascotActivity; message?: string }
  | { type: 'TICK' }
  | { type: 'SET_ENABLED'; enabled: boolean }
  | { type: 'SET_MOTION'; motion: MotionMode }
  | { type: 'SET_MASCOT'; mascot: string }
  | { type: 'RESET' };

export interface FrameOptions {
  compact?: boolean;
  useUnicode?: boolean;
  motion?: MotionMode;
}

export interface RenderOptions {
  compact?: boolean;
  useUnicode?: boolean;
  motion?: MotionMode;
  terminalWidth?: number;
}

export interface RenderedMascot {
  art: string;
  compact: string;
  badge: string;
  line: string;
  activity: MascotActivity;
  message?: string;
  enabled: boolean;
  motion: MotionMode;
}

export interface AgentEvent {
  type: string;
  tool?: string;
  command?: string;
  error?: string | unknown;
  status?: string;
  message?: string;
}
