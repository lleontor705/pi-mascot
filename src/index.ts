import type { ExtensionAPI } from './api-types.js';
import { MascotController } from './mascot.js';
import { mapEventToActivity } from './mapper.js';

export * from './types.js';
export * from './api-types.js';
export * from './reducer.js';
export * from './mapper.js';
export * from './frames.js';
export * from './renderer.js';
export * from './boundary.js';
export * from './mascot.js';

/** Pi extension entry point. Resource ownership begins at session_start. */
export default function piMascotExtension(pi: ExtensionAPI): MascotController {
  const controller = new MascotController(pi);
  const boundary = controller.getBoundary();

  boundary.registerCommandSafe('mascot', {
    description: 'Gestiona a Perrogato: status, on, off, motion y select.',
    handler: async (args, ctx) => {
      controller.handleCommand(args, ctx);
    },
  });

  pi.on('session_start', (_event, ctx) => {
    controller.initialize(ctx);
  });

  pi.on('session_shutdown', (_event, ctx) => {
    controller.dispose(ctx);
  });

  pi.on('before_agent_start', (event, ctx) => {
    controller.setActivity(mapEventToActivity(event), undefined, ctx);
  });
  pi.on('agent_start', (event, ctx) => {
    controller.setActivity(mapEventToActivity(event), undefined, ctx);
  });
  pi.on('agent_end', (event, ctx) => {
    controller.setActivity(mapEventToActivity(event), undefined, ctx);
  });
  pi.on('agent_settled', (event, ctx) => {
    controller.setActivity(mapEventToActivity(event), undefined, ctx);
  });
  pi.on('turn_start', (event, ctx) => {
    controller.setActivity(mapEventToActivity(event), undefined, ctx);
  });
  pi.on('turn_end', (event, ctx) => {
    controller.setActivity(mapEventToActivity(event), undefined, ctx);
  });
  pi.on('tool_execution_start', (event, ctx) => {
    controller.setActivity(mapEventToActivity(event), undefined, ctx);
  });
  pi.on('tool_execution_update', (event, ctx) => {
    controller.setActivity(mapEventToActivity(event), undefined, ctx);
  });
  pi.on('tool_execution_end', (event, ctx) => {
    controller.setActivity(mapEventToActivity(event), undefined, ctx);
  });

  return controller;
}
