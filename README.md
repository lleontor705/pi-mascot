# pi-mascot

> 🐾 Terminal companion mascot extension for **Pi Coding Agent** featuring **Perrogato** (the dog-cat hybrid companion).

`pi-mascot` provides real-time, terminal-safe visual status and feedback as your Pi Coding Agent works through plans, file inspections, code generation, testing, and error recovery.

---

## Features (Phase 1 MVP)

- 🐶🐱 **Perrogato Mascot**: Expressive ASCII & Unicode companion blending feline agility and canine loyalty.
- 🔄 **State Reducer & Activity Mapper**: Maps agent lifecycle events and tool calls directly into 9 well-defined states:
  1. `idle` - Waiting for user instructions
  2. `thinking` - Reasoning, planning, or generating tokens
  3. `reading` - Inspecting files, reading URLs, ripgrep / fd searches
  4. `writing` - Creating or editing source files
  5. `testing` - Running test suites and CLI commands
  6. `success` - Completed steps and task resolution
  7. `warning` - Warnings, lint errors, or retries
  8. `blocked` - Waiting on user confirmations or approval
  9. `resting` - Extended inactivity and rest
- ♿ **Motion Accessibility & Fallbacks**:
  - `auto`: Automatically adapts to terminal capabilities and `REDUCED_MOTION` environment variable.
  - `full`: Multi-frame animation loops.
  - `reduced`: Calm, static single-frame rendering.
  - `off`: Static rendering with animation timers stopped.
- 📱 **Compact-Width Mode**: Auto-scales to compact single-line badges for terminals narrower than 40 columns or constrained status areas.
- 🛡️ **Defensive Pi Compatibility Boundary**:
  - Isolates all host API assumptions in [`src/api-types.ts`](file:///Volumes/Archivos/github_repositories/lleontor705/pi-mascot/src/api-types.ts).
  - Tolerates missing host APIs without throwing or crashing the agent session.
- 🧹 **Lifecycle Cleanup**:
  - Automatically clears all interval timers on `session_shutdown` or explicit `dispose()`.
  - Zero memory leaks or dangling processes.

---

## Phase 1 Scope & Boundaries

Phase 1 is strictly scoped as a lightweight, zero-dependency visual companion:

- ✅ **Included**: In-memory state machine, tool activity mapper, terminal-safe frames, compact mode, motion controls, Pi slash commands, lifecycle cleanup.
- ❌ **Excluded (Phase 1)**:
  - No persistent disk storage or SQLite databases.
  - No Git execution or branch manipulations.
  - No network calls, telemetry, or external integrations.
  - No autonomous code mutations or file modifications.

---

## 🔒 Privacy Promise

1. **Zero Network Activity**: `pi-mascot` performs zero HTTP/WebSocket requests, collects zero telemetry, and contacts zero external servers.
2. **Zero Persistent Data**: All mascot states are held strictly in memory for the duration of the agent session. No logs, history, or agent prompts are written to disk.
3. **Zero Code Telemetry**: File names, code contents, and command arguments analyzed by the activity mapper are never cached, leaked, or sent anywhere.

---

## Installation & Setup

### Prerequisites

- Node.js >= 18.0.0
- Pi Coding Agent

### Local Development Setup

```bash
# Clone the repository
git clone https://github.com/lleontor705/pi-mascot.git
cd pi-mascot

# Install development dependencies
npm install

# Build TypeScript to dist/
npm run build

# Run behavior tests
npm test
```

### Loading in Pi

In your Pi configuration or `extensions` list, add `pi-mascot`:

```json
{
  "extensions": [
    "/path/to/pi-mascot/src/index.ts"
  ]
}
```

Or install directly via npm when published:

```bash
npm install -g pi-mascot
```

---

## Commands

`pi-mascot` registers the `/mascot` command defensively with Pi:

| Command | Description |
| :--- | :--- |
| `/mascot status` | Displays the current mascot, active state, motion mode, and rendered frame |
| `/mascot on` | Enables mascot visualization |
| `/mascot off` | Disables mascot visualization |
| `/mascot motion auto` | Automatic motion detection (respects `REDUCED_MOTION`) |
| `/mascot motion full` | Enables multi-frame animation loops |
| `/mascot motion reduced` | Enables static, single-frame display |
| `/mascot motion off` | Disables animation ticks |
| `/mascot select perrogato` | Selects Perrogato (the only mascot supported in Phase 1) |
| `/mascot help` | Shows usage instructions and available commands |

---

## Architecture & Module Layout

```
pi-mascot/
├── src/
│   ├── api-types.ts   # Pi host extension API contracts & assumptions
│   ├── types.ts       # Core mascot models, actions, activities, options
│   ├── reducer.ts     # Pure state reducer and transition rules
│   ├── mapper.ts      # Tool name & host event activity mapper
│   ├── frames.ts      # Terminal-safe Unicode and ASCII frames for Perrogato
│   ├── renderer.ts    # String and status renderer with compact fallbacks
│   ├── boundary.ts    # Defensive Pi API compatibility bridge
│   ├── mascot.ts      # MascotController orchestrator and command dispatcher
│   └── index.ts       # Extension entrypoint for Pi
├── test/
│   ├── boundary.test.js    # Compatibility boundary tests
│   ├── controller.test.js  # Controller and command tests
│   ├── extension.test.js   # Extension lifecycle and host wiring tests
│   ├── frames.test.js      # Frame correctness and safety tests
│   ├── mapper.test.js      # Tool & event mapping tests
│   ├── reducer.test.js     # State reducer transition tests
│   └── renderer.test.js    # Rendering and fallback tests
├── tsconfig.json
├── package.json
└── LICENSE
```

---

## Testing & Quality Assurance

All behavior tests use Node.js built-in test runner (`node:test` and `node:assert/strict`), requiring zero external test frameworks:

```bash
npm test
```

Sample output:
```
✔ Boundary - Safe initialization with undefined or empty object
✔ Controller - Initialization
✔ Controller - Command: status
✔ Controller - Command: on / off
✔ Frames - Covers all 9 required activities for Perrogato
✔ Frames - Compact-width fallback fits compact terminals (<= 14 chars)
✔ Mapper - Maps reading tools
✔ Mapper - Maps writing tools
✔ Mascot Reducer - Activity Transitions for all 9 states
✔ Mascot Reducer - Select mascot accepts perrogato and rejects others
✔ Renderer - Compact width fallback for narrow terminals (< 40 cols)
...
ℹ tests 40
ℹ pass 40
ℹ fail 0
```

---

## Roadmap

- **Phase 1 (Current)**: Perrogato MVP, in-memory state reducer, terminal-safe frames, motion modes, compact width fallback, defensive Pi bridge.
- **Phase 2**: Additional mascots (e.g. Capybara, Robo-Owl, Axolotl), customizable ASCII color palettes (ANSI truecolor/256-color), optional status-bar widget slot integration.
- **Phase 3**: Sound/haptic cues (optional bell/audio hooks), interactive mood reactions based on build success rates, session statistics summaries.

---

## License

MIT © Luis Leon
