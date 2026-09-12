import type { CommandDefinition, ExtensionAPI, MascotContext } from './api-types.js';

const MASCOT_UI_KEY = 'pi-mascot';

/**
 * Small boundary around the real, context-scoped Pi UI API.
 * Pi exposes UI on the context passed to commands and event handlers, never on ExtensionAPI.
 */
export class PiCompatibilityBoundary {
  constructor(private readonly pi: ExtensionAPI) {}

  public registerCommandSafe(name: string, command: CommandDefinition): boolean {
    try {
      this.pi.registerCommand(name, {
        description: command.description,
        handler: async (args, ctx) => {
          try {
            await command.handler(args, ctx);
          } catch (error: unknown) {
            this.notifySafe(ctx, `[pi-mascot] ${error instanceof Error ? error.message : String(error)}`, 'error');
          }
        },
      });
      return true;
    } catch {
      return false;
    }
  }

  public notifySafe(
    ctx: MascotContext,
    message: string,
    level: 'info' | 'warning' | 'error' = 'info',
  ): boolean {
    try {
      ctx.ui.notify(message, level);
      return true;
    } catch {
      return false;
    }
  }

  public renderSafe(ctx: MascotContext, line: string): boolean {
    let rendered = false;
    try {
      ctx.ui.setStatus(MASCOT_UI_KEY, line);
      rendered = true;
    } catch {
      // UI is unavailable in non-interactive modes.
    }
    try {
      ctx.ui.setWidget(MASCOT_UI_KEY, [line]);
      rendered = true;
    } catch {
      // Status may still be available when widgets are not.
    }
    return rendered;
  }

  public clearSafe(ctx: MascotContext): boolean {
    let cleared = false;
    try {
      ctx.ui.setStatus(MASCOT_UI_KEY, undefined);
      cleared = true;
    } catch {
      // UI is unavailable in non-interactive modes.
    }
    try {
      ctx.ui.setWidget(MASCOT_UI_KEY, undefined);
      cleared = true;
    } catch {
      // Status may still be available when widgets are not.
    }
    return cleared;
  }
}
