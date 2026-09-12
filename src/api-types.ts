import type {
  ExtensionAPI,
  ExtensionCommandContext,
  ExtensionContext,
  ExtensionUIContext,
} from '@earendil-works/pi-coding-agent';

export type { ExtensionAPI, ExtensionCommandContext, ExtensionContext, ExtensionUIContext };

/** The only UI methods used by Phase 1. */
export type MascotUIContext = Pick<
  ExtensionUIContext,
  'notify' | 'setStatus' | 'setWidget'
>;

/** The smallest real Pi context shape needed by the mascot. */
export type MascotContext = Pick<ExtensionContext, 'ui'>;

export interface CommandDefinition {
  description: string;
  handler: (args: string, ctx: ExtensionCommandContext) => Promise<void> | void;
}
