import type {
  AgentSettledEvent,
  BeforeAgentStartEvent,
  ToolExecutionEndEvent,
  ToolExecutionStartEvent,
  ToolExecutionUpdateEvent,
} from '@earendil-works/pi-coding-agent';
import type { MascotActivity } from './types.js';

const TEST_COMMAND = /(?:^|\s)(?:test|tests|lint|build|check|pytest|vitest|jest|mocha|ava|cargo)(?:\s|$)|npm\s+(?:run\s+)?(?:test|lint|build|check)/i;

export type MascotEvent =
  | ToolExecutionStartEvent
  | ToolExecutionUpdateEvent
  | ToolExecutionEndEvent
  | BeforeAgentStartEvent
  | AgentSettledEvent
  | { type: 'agent_start' | 'agent_end' | 'turn_start' | 'turn_end' };

export function mapToolToActivity(toolName: string, args?: Record<string, unknown>): MascotActivity {
  const normalized = toolName.trim().toLowerCase();

  if (normalized === 'read') return 'reading';
  if (normalized === 'write' || normalized === 'edit' || normalized === 'patch') return 'writing';

  if (normalized === 'bash' || normalized === 'terminal' || normalized === 'cmd') {
    const command = typeof args?.command === 'string' ? args.command : '';
    return TEST_COMMAND.test(command) ? 'testing' : 'thinking';
  }

  return 'thinking';
}

export function mapEventToActivity(event: string | MascotEvent): MascotActivity {
  if (typeof event === 'string') return mapLifecycleEvent(event);

  switch (event.type) {
    case 'tool_execution_start':
    case 'tool_execution_update':
      return mapToolToActivity(event.toolName, event.args as Record<string, unknown>);
    case 'tool_execution_end':
      return event.isError ? 'warning' : 'success';
    default:
      return mapLifecycleEvent(event.type);
  }
}

function mapLifecycleEvent(event: string): MascotActivity {
  switch (event) {
    case 'before_agent_start':
    case 'agent_start':
    case 'agent_end':
    case 'turn_start':
      return 'thinking';
    case 'agent_settled':
    case 'turn_end':
      return 'success';
    default:
      return 'idle';
  }
}
