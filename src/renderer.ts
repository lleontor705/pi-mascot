import type { MascotState, RenderOptions, RenderedMascot, MotionMode, FrameOptions } from './types.js';
import { getPerrogatoFrame, getPerrogatoCompact } from './frames.js';

export function resolveMotionMode(
  preferredMode: MotionMode,
  overrideMode?: MotionMode
): MotionMode {
  const mode = overrideMode ?? preferredMode;
  if (mode === 'auto') {
    const envReduced =
      process.env.REDUCED_MOTION === '1' ||
      process.env.REDUCED_MOTION === 'true' ||
      process.env.TERM === 'dumb';
    return envReduced ? 'reduced' : 'full';
  }
  return mode;
}

export function renderMascot(
  state: MascotState,
  options: RenderOptions = {}
): RenderedMascot {
  const effectiveMotion = resolveMotionMode(state.motion, options.motion);
  const isCompact =
    options.compact === true ||
    (typeof options.terminalWidth === 'number' && options.terminalWidth < 40);

  const frameOpts: FrameOptions = {
    compact: isCompact,
    useUnicode: options.useUnicode,
    motion: effectiveMotion,
  };

  if (!state.enabled) {
    const disabledLine = 'Perrogato está desactivada (usa /mascot on para activarla)';
    const compactDisabled = '[-off-]';
    return {
      art: '( -..- ) [off]',
      compact: compactDisabled,
      badge: '[off]',
      line: isCompact ? compactDisabled : disabledLine,
      activity: state.activity,
      message: state.message,
      enabled: false,
      motion: effectiveMotion,
    };
  }

  const effectiveFrameIndex = effectiveMotion === 'off' ? 0 : state.frameIndex;
  const art = getPerrogatoFrame(state.activity, effectiveFrameIndex, frameOpts);
  const compact = getPerrogatoCompact(state.activity, frameOpts);
  const badge = `[${state.activity}]`;

  let line = '';
  if (isCompact) {
    const msg = state.message ? ` ${state.message}` : '';
    line = `${compact} ${badge}${msg}`;
    if (options.terminalWidth && line.length > options.terminalWidth) {
      line = `${compact} ${badge}`.slice(0, options.terminalWidth);
    }
  } else {
    const msg = state.message ? ` - ${state.message}` : '';
    line = `${art} ${badge}${msg}`;
    if (options.terminalWidth && line.length > options.terminalWidth) {
      line = `${compact} ${badge}${msg}`.slice(0, options.terminalWidth);
    }
  }

  return {
    art,
    compact,
    badge,
    line,
    activity: state.activity,
    message: state.message,
    enabled: true,
    motion: effectiveMotion,
  };
}
