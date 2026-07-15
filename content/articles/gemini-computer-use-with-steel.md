---
title: "Gemini Computer Use With Steel"
id: "gemini-computer-use-with-steel"
summary: "Connect Gemini Computer Use to Steel sessions for managed browsers, replay-grade observability, and anti-bot help without rebuilding your agent loop today."
canonical_questions: ["gemini computer use with steel"]
intent: "reference"
entity: "integration"
audience: "developer"
schema_type: "Article"
visibility: "public"
ai_visibility: "public"
llms_priority: "core"
token_budget: "medium"
date: "2026-04-01"
updated: "2026-04-01"
related: []
external_refs: []
type: "article"
status: "published"
draft: false
canonical_url: "https://steel.dev/blog/gemini-computer-use-with-steel"
description: "Connect Gemini Computer Use to Steel sessions for managed browsers, replay-grade observability, and anti-bot help without rebuilding your agent loop today."
created: "2026-04-01"
modified: "2026-04-01"
tags: [gemini, computer-use, integration, ai-answers]
immutable: false
---
Keep Gemini [Computer Use](@/glossary/computer-use.md) exactly as it is and hand its browser actions to Steel. Create one Steel session, feed that Computer API into Gemini's normalized coordinate loop, and you get sub-second startup on average (in-region), long-running sessions (up to 24 hours on Enterprise plans; 15 minutes on Launch and 1 hour on Scale), and deterministic evidence without touching your prompts or orchestrator.

Steel adds what Gemini leaves to you: live viewer links, [replay](@/glossary/replay.md)-ready screenshots, CAPTCHA routing, [proxy](@/glossary/proxies.md) management, and a cleanup contract that frees concurrency the second a run ends. Pair the Gemini 3 Computer Use reasoning stack with Steel sessions so you can watch each action, rerun failures with evidence, and keep your task queue honest.

## What stays the same
| Gemini concern | What you keep | Notes |
| --- | --- | --- |
| Task prompts and reasoning | Same `gemini-3-flash-preview` model, same system prompt, same task payload | Steel never touches your Google credentials or conversation state |
| Tool contract | Gemini's single computer-use tool with normalized 0-1000 coordinates stays exactly as provided | You only replace the backend that translates coordinates into browser actions |
| Safety gating | Existing safety confirmations and reviewer prompts | Steel just surfaces the viewer link so reviewers can watch the action they are approving |
| Queue + hosting | Your Python or Node loop, cron, or worker stack | Steel is another API client sitting next to `google-genai` |

## What Steel adds
| Steel surface | Why it matters for Computer Use | How to wire it |
| --- | --- | --- |
| Session lifecycle | Fast startup and long session caps (up to 24 hours on Enterprise) keep Gemini loops running without relaunching Chrome | `session = client.sessions.create({dimensions:{width:1280,height:800}, blockAds:true, sessionTimeout:900000})` then `client.sessions.release(session.id)` in `finally` |
| Observability | Viewer URL, replay, and session events make every click reviewable | Log `session.session_viewer_url`, store it beside the Gemini response ID, and pull `client.sessions.events(session.id)` after runs |
| Computer API | Deterministic mapping for `click`, `type`, `scroll`, `wait`, `navigate`, and `take_screenshot` responses | Forward each Gemini `function_call` to `client.sessions.computer(session.id, body)` and return the base64 PNG back to Gemini |
| Anti-bot and CAPTCHA tooling | Managed proxies plus CAPTCHA queue prevents loops from stalling on login walls | Set `useProxy`, `region`, and poll `client.sessions.captchas.status(session.id)` when the response flags a challenge |
| Release discipline | Releasing sessions publishes the replay, frees plan-cap slots, and locks observability records | Treat release success as a metric; call `sessions.release` during happy and unhappy paths |

## Minimal integration path
1. Install the official SDKs: `npm install steel-sdk @google/genai dotenv` or `pip install steel-sdk google-genai python-dotenv` plus your TypeScript or Python runtime deps.
2. Load `.env` values for `STEEL_API_KEY`, `GEMINI_API_KEY`, and a default `TASK`. Keep the quickstart's `MODEL = "gemini-3-flash-preview"` constant so both runtimes stay aligned (`gemini-2.5-computer-use-preview-10-2025` still works if you are pinned to 2.5).
3. Create a Steel client and session. Gemini emits coordinates in a normalized 0-1000 grid that Steel scales to whatever viewport you pick (the docs example uses 1280x800):
   ```ts
   import { Steel } from "steel-sdk";
   const steel = new Steel({ steelAPIKey: process.env.STEEL_API_KEY! });
   const session = await steel.sessions.create({
     dimensions: { width: 1280, height: 800 },
     blockAds: true,
     sessionTimeout: 900_000,
   });
   console.log(`Viewer: ${session.sessionViewerUrl}`);
   ```
4. Mirror the helper from the docs: keep `MAX_COORDINATE = 1000`, add `denormalizeX` and `denormalizeY` functions, and normalize Gemini key combos before handing them to Steel's Computer API.
5. In your Gemini loop, capture every `function_call`, translate it through the helper, and invoke `steel.sessions.computer(session.id, actionPayload)` so each action returns a PNG screenshot and optional URL back to Gemini.
6. Wrap execution in `try/finally` so `sessions.release(session.id)` always runs. Print both the viewer link and replay link for humans who need to verify the outcome.

## Mirror the helper structure in TypeScript and Python
- **System prompt**: Keep the same `<BROWSER_ENV>` block from the quickstarts so Gemini knows it is driving a Steel-managed Chromium instance with internet access.
- **Coordinate helpers**: The TS `denormalizeX`/`denormalizeY` methods and the Python `denormalize_x`/`denormalize_y` pair both map normalized coordinates to the 1280x800 viewport. Reuse them verbatim.
- **Action router**: Copy the switch/if ladder from `agent.ts` or `agent.py`. Gemini emits its own vocabulary (`click_at`, `type_text_at`, `scroll_document`, `navigate`, `drag_and_drop`, `wait_5_seconds`); your router maps each onto a Steel `sessions.computer` action (`click`, `type`, `scroll`, `take_screenshot`, ...). Keep the screenshot flag on so observability stays in sync.
- **Logging**: The helper prints each action and logs the viewer link. Extend that log with your job IDs so you can correlate Gemini reasoning, Steel evidence, and downstream approvals.

## Pair Gemini Computer Use with Steel observability
| Signal | Steel hook | Why it matters |
| --- | --- | --- |
| Live viewer | `session.session_viewer_url` | Share with operators to watch Gemini's reasoning in real time and pause high risk actions |
| Replay | Same viewer URL after release | Gives you a permanent artifact to debug or escalate without rerunning a flaky task |
| Session events | `client.sessions.events(session.id)` | Store log excerpts next to Gemini transcripts so you can diff retries and see why a click misfired |
| CAPTCHA status | `client.sessions.captchas.status(session.id)` | Pause Gemini actions until Steel clears the challenge, then resume with context |
| Release metrics | Track `sessions.release` success per job | Prevent orphaned sessions from soaking concurrency limits and keep plan usage auditable |

## Fit and trade-offs
**Works best for**
- Teams already calling Gemini Computer Use who just need a reliable browser backend with replay evidence.
- Agents that require human approvals, post mortems, or escalations; Steel's viewer and logs make that evidence one click away.
- Workloads where normalized coordinates need zero changes but the Chrome runtime keeps crashing under load.

**Not yet ideal when**
- You need a desktop app surface outside Chromium; Steel only supplies browsers today.
- Runs exceed your plan's session cap (15 minutes on Launch, 1 hour on Scale, up to 24 hours on Enterprise) or need more concurrency than your Steel plan currently offers.
- Your org cannot enable the `gemini-3-flash-preview` computer-use capability yet; Steel cannot sidestep Google's access controls.

## Go-live checklist
- `.env` checked into your secrets store with Steel and Gemini keys plus the default `TASK` and viewport settings.
- Action router tested in both TS and Python quickstarts from `docs.steel.dev/integrations/gemini-computer-use` so future edits stay grounded in live code.
- Logs capture session ID, viewer URL, replay URL, Gemini response ID, and a `release_success` flag.
- CAPTCHA routing tested on at least one high friction site so your queue does not stall when Gemini hits a challenge.
- Observability review ritual in place: operators watch the viewer for sensitive steps and replay failed jobs before re-queuing them.

Next step: run the cookbook sample once, keep the viewer link in your logs, and layer CAPTCHA monitoring before scaling the queue. Humans use Chrome. Agents use Steel.
