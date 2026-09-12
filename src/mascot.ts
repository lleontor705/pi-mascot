import type { ExtensionAPI, ExtensionCommandContext, MascotContext } from './api-types.js';
import type { MascotState, MascotActivity, MotionMode, RenderedMascot } from './types.js';
import { initialMascotState, mascotReducer } from './reducer.js';
import { PiCompatibilityBoundary } from './boundary.js';
import { renderMascot } from './renderer.js';

export class MascotController {
  private state: MascotState = { ...initialMascotState };
  private readonly boundary: PiCompatibilityBoundary;
  private animationTimer: NodeJS.Timeout | null = null;
  private disposed = false;
  private latestContext: MascotContext | undefined;

  constructor(pi: ExtensionAPI) {
    this.boundary = new PiCompatibilityBoundary(pi);
  }

  public getState(): MascotState {
    return { ...this.state };
  }

  public getBoundary(): PiCompatibilityBoundary {
    return this.boundary;
  }

  public isDisposed(): boolean {
    return this.disposed;
  }

  public initialize(ctx: MascotContext): void {
    if (this.disposed) return;
    this.setContext(ctx);
    this.syncStatus();
    this.startAnimationLoop(2500);
  }

  public setContext(ctx: MascotContext): void {
    this.latestContext = ctx;
  }

  public setActivity(activity: MascotActivity, message?: string, ctx?: MascotContext): void {
    if (this.disposed) return;
    if (ctx) this.setContext(ctx);
    this.state = mascotReducer(this.state, { type: 'SET_ACTIVITY', activity, message });
    this.syncStatus();
  }

  public enable(): void {
    if (this.disposed) return;
    this.state = mascotReducer(this.state, { type: 'SET_ENABLED', enabled: true });
    this.syncStatus();
  }

  public disable(): void {
    if (this.disposed) return;
    this.state = mascotReducer(this.state, { type: 'SET_ENABLED', enabled: false });
    this.syncStatus();
  }

  public setMotion(mode: MotionMode): void {
    if (this.disposed) return;
    this.state = mascotReducer(this.state, { type: 'SET_MOTION', motion: mode });
    this.syncStatus();
  }

  public selectMascot(name: string): void {
    if (this.disposed) return;
    this.state = mascotReducer(this.state, { type: 'SET_MASCOT', mascot: name });
    this.syncStatus();
  }

  public tick(): void {
    if (this.disposed || !this.state.enabled) return;
    this.state = mascotReducer(this.state, { type: 'TICK' });
    this.syncStatus();
  }

  public startAnimationLoop(intervalMs = 2000): void {
    if (this.disposed || this.animationTimer) return;
    this.animationTimer = setInterval(() => this.tick(), intervalMs);
    this.animationTimer.unref?.();
  }

  public stopAnimationLoop(): void {
    if (this.animationTimer !== null) {
      clearInterval(this.animationTimer);
      this.animationTimer = null;
    }
  }

  public dispose(ctx?: MascotContext): void {
    if (this.disposed) return;
    if (ctx) this.setContext(ctx);
    this.stopAnimationLoop();
    if (this.latestContext) this.boundary.clearSafe(this.latestContext);
    this.disposed = true;
  }

  public render(terminalWidth?: number): RenderedMascot {
    return renderMascot(this.state, { terminalWidth });
  }

  public syncStatus(ctx?: MascotContext): void {
    if (this.disposed) return;
    if (ctx) this.setContext(ctx);
    if (this.latestContext) this.boundary.renderSafe(this.latestContext, this.render().line);
  }

  public handleCommand(args: string, ctx: ExtensionCommandContext): string {
    this.setContext(ctx);
    const parts = args.trim().split(/\s+/).filter(Boolean);
    const subCommand = parts[0]?.toLowerCase() || 'status';
    let result: string;

    switch (subCommand) {
      case 'status': {
        const rendered = this.render();
        result = [
          '🐾 Estado de Perrogato:',
          `  Actividad: ${this.state.activity}${this.state.message ? ` (${this.state.message})` : ''}`,
          `  Activa:    ${this.state.enabled ? 'Sí' : 'No'}`,
          `  Movimiento: ${this.state.motion}`,
          `  Visual:    ${rendered.line}`,
        ].join('\n');
        break;
      }
      case 'on':
        this.enable();
        result = '🐾 Perrogato activada.';
        break;
      case 'off':
        this.disable();
        result = '🐾 Perrogato desactivada.';
        break;
      case 'motion': {
        const mode = parts[1]?.toLowerCase();
        if (mode === 'auto' || mode === 'full' || mode === 'reduced' || mode === 'off') {
          this.setMotion(mode);
          result = `🐾 Modo de movimiento de Perrogato: "${mode}".`;
        } else {
          result = `⚠️ Modo de movimiento no válido: "${mode ?? ''}". Usa auto, full, reduced u off.`;
        }
        break;
      }
      case 'select': {
        const mascot = parts[1]?.toLowerCase();
        if (mascot === 'perrogato') {
          this.selectMascot('perrogato');
          result = '🐾 Perrogato seleccionada.';
        } else {
          result = `⚠️ En la Fase 1 solo está disponible Perrogato: "${mascot ?? ''}".`;
        }
        break;
      }
      case 'help':
        result = [
          '🐾 Uso y comandos de pi-mascot:',
          '  /mascot status            - Muestra el estado actual',
          '  /mascot on|off            - Activa o desactiva la mascota',
          '  /mascot motion <modo>     - auto, full, reduced u off',
          '  /mascot select perrogato  - Selecciona Perrogato',
        ].join('\n');
        break;
      default:
        result = `⚠️ Comando desconocido: "${subCommand}". Usa "/mascot help".`;
    }

    this.boundary.notifySafe(ctx, result, result.startsWith('⚠️') ? 'warning' : 'info');
    return result;
  }
}
