import type { MascotActivity, FrameOptions } from './types.js';

export const PERROGATO_ACTIVITIES: readonly MascotActivity[] = [
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

interface ActivityFrames {
  unicode: string[];
  unicodeReduced: string;
  unicodeCompact: string;
  ascii: string[];
  asciiReduced: string;
  asciiCompact: string;
}

const PERROGATO_FRAMES: Record<MascotActivity, ActivityFrames> = {
  idle: {
    unicode: [
      '( ^.ᴥ.^ )~',
      '( ^.ᴥ.^ )~~',
      '~( ^.ᴥ.^ )',
    ],
    unicodeReduced: '( ^.ᴥ.^ )',
    unicodeCompact: '[^.ᴥ.^~]',
    ascii: [
      '( ^..^ )~',
      '( ^..^ )~~',
      '~( ^..^ )',
    ],
    asciiReduced: '( ^..^ )',
    asciiCompact: '[^..^~]',
  },
  thinking: {
    unicode: [
      '( ?..ᴥ ) ?',
      '( ᴥ..? ) ¿',
      '( ?..ᴥ ) ..',
    ],
    unicodeReduced: '( ?..ᴥ ) ?',
    unicodeCompact: '[?^.ᴥ.^]',
    ascii: [
      '( ?..^ ) ?',
      '( ^..? ) ?',
      '( ?..^ ) ..',
    ],
    asciiReduced: '( ?..^ ) ?',
    asciiCompact: '[?^..^]',
  },
  reading: {
    unicode: [
      '[📖]( ⌐■.ᴥ.■ )',
      '[📄]( ⌐■.ᴥ.■ )',
    ],
    unicodeReduced: '[📖]( ⌐■.ᴥ.■ )',
    unicodeCompact: '[R^.ᴥ.^]',
    ascii: [
      '[R]( ^..^ )',
      '[=]( ^..^ )',
    ],
    asciiReduced: '[R]( ^..^ )',
    asciiCompact: '[R^..^]',
  },
  writing: {
    unicode: [
      '( ^.ᴥ.^ )/✎',
      '( ^.ᴥ.^ )_✍',
    ],
    unicodeReduced: '( ^.ᴥ.^ )/✎',
    unicodeCompact: '[W^.ᴥ.^]',
    ascii: [
      '( ^..^ )/w',
      '( ^..^ )_w',
    ],
    asciiReduced: '( ^..^ )/w',
    asciiCompact: '[W^..^]',
  },
  testing: {
    unicode: [
      '( ⚙.ᴥ.⚙ ) *',
      '( ⚙.ᴥ.⚙ ) +',
    ],
    unicodeReduced: '( ⚙.ᴥ.⚙ )',
    unicodeCompact: '[T^.ᴥ.^]',
    ascii: [
      '( *..* ) [T]',
      '( +..+ ) [T]',
    ],
    asciiReduced: '( *..* ) [T]',
    asciiCompact: '[T^..^]',
  },
  success: {
    unicode: [
      '★( ^.ᴥ.^ )★',
      '✨( ^.ᴥ.^ )✨',
    ],
    unicodeReduced: '★( ^.ᴥ.^ )★',
    unicodeCompact: '[*^.ᴥ.^*]',
    ascii: [
      '*( ^..^ )*',
      '!( ^..^ )!',
    ],
    asciiReduced: '*( ^..^ )*',
    asciiCompact: '[*^..^*]',
  },
  warning: {
    unicode: [
      '!( !.ᴥ.! )/!\\',
      '/( !.ᴥ.o )/!\\',
    ],
    unicodeReduced: '!( !.ᴥ.! )/!\\',
    unicodeCompact: '[!^.ᴥ.^!]',
    ascii: [
      '!( !..!) /!\\',
      '/( !..o) /!\\',
    ],
    asciiReduced: '!( !..!) /!\\',
    asciiCompact: '[!^..^!]',
  },
  blocked: {
    unicode: [
      '[X]( x.ᴥ.x )',
      '[X]( X.ᴥ.X )',
    ],
    unicodeReduced: '[X]( X.ᴥ.X )',
    unicodeCompact: '[X^.ᴥ.^X]',
    ascii: [
      '[X]( x..x )',
      '[X]( X..X )',
    ],
    asciiReduced: '[X]( X..X )',
    asciiCompact: '[X^..^X]',
  },
  resting: {
    unicode: [
      '( -.ᴥ.- ) zZ',
      '( -.ᴥ.- ) Zz',
    ],
    unicodeReduced: '( -.ᴥ.- ) zZ',
    unicodeCompact: '[z^.ᴥ.^z]',
    ascii: [
      '( -..- ) zZ',
      '( -..- ) Zz',
    ],
    asciiReduced: '( -..- ) zZ',
    asciiCompact: '[z^..^z]',
  },
};

export function getPerrogatoFrame(
  activity: MascotActivity,
  frameIndex: number = 0,
  options: FrameOptions = {}
): string {
  const frames = PERROGATO_FRAMES[activity] ?? PERROGATO_FRAMES.idle;
  const useUnicode = options.useUnicode !== false;
  const isReduced = options.motion === 'reduced';

  if (isReduced) {
    return useUnicode ? frames.unicodeReduced : frames.asciiReduced;
  }

  const frameList = useUnicode ? frames.unicode : frames.ascii;
  const normalizedIndex = Math.abs(frameIndex) % frameList.length;
  return frameList[normalizedIndex];
}

export function getPerrogatoCompact(
  activity: MascotActivity,
  options: FrameOptions = {}
): string {
  const frames = PERROGATO_FRAMES[activity] ?? PERROGATO_FRAMES.idle;
  const useUnicode = options.useUnicode !== false;
  return useUnicode ? frames.unicodeCompact : frames.asciiCompact;
}
