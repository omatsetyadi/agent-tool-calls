# agent-tool-calls

Generic, reusable tool implementations with **no AI-framework or Timmy dependency**. Each package is a plain library — give it credentials/args, it does the thing. Usable in any project (CLIs, cron jobs, other agents).

Published to npm under the **`@agent-tool-calls`** scope (public). Timmy consumes these via thin `timmy-plugin-*` adapters — the logic lives here, not in the plugins.

## Packages

| Package | Status | Description |
|---|---|---|
| `@agent-tool-calls/machine` | scaffold | Cross-platform OS ops (open app, media, files, processes) — **Phase 3** |
| `@agent-tool-calls/slack` | planned | Slack client, messaging, OAuth |
| `@agent-tool-calls/github` | planned | Octokit wrapper — PR/issue/branch helpers |
| `@agent-tool-calls/gmail` | planned | OAuth, read/send/label |
| `@agent-tool-calls/spotify` | planned | Spotify API, URI handling, playback |
| `@agent-tool-calls/web-search` | planned | Web search + scraping |

## Rule

Simple, stateless, general utility → here. Complex/stateful/needs-infrastructure (streaming, multi-provider, daemons) → its own repo.

## Develop

```bash
npm install
npm run build
```

Requires Node.js 24+ (current LTS — see `.nvmrc`; run `nvm use`).
