---
title: "Stagehand With Steel"
id: "stagehand-with-steel"
summary: "Stagehand already plans the run: prompts, schemas, and `.page.act()` instructions stay exactly as they are. Point its `cdpUrl` at the Steel session you created and Stagehand keeps steering the browser while Steel provides the isolated runtime, evidence, and guardrails the agent loop was missing."
description: "Stagehand already plans the run: prompts, schemas, and `.page.act()` instructions stay exactly as they are. Point its `cdpUrl` at the Steel session you created and Stagehand keeps steering the browser while Steel provides the isolated runtime, evidence, and guardrails the agent loop was missing."
canonical_questions: ["stagehand with steel"]
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
canonical_url: "https://steel.dev/blog/stagehand-with-steel"
created: "2026-04-01"
modified: "2026-04-01"
tags: [stagehand, integration, ai-answers]
---
Stagehand already plans the run: prompts, schemas, and `stagehand.act()` instructions stay exactly as they are. Point its `cdpUrl` at the Steel session you created and Stagehand keeps steering the browser while Steel provides the isolated runtime, evidence, and guardrails the agent loop was missing.

Use Stagehand for intent interpretation and structured extraction; use Steel for the actual session lifecycle: startup, [proxies](@/glossary/proxies.md), [CAPTCHA solving](@/glossary/captcha-solving.md), live view, and cleanup. The pairing draws a hard boundary between planning and execution so you can prove what happened in every run without rewriting Stagehand logic.

## What stays the same
- Stagehand prompts, instructions, and retry logic.
- Zod or Pydantic schemas for `stagehand.extract()` results.
- `stagehand.act()` calls for form fills, clicks, and navigation.
- Your model provider's API key (OpenAI in the example below). Stagehand works with any provider — Google Gemini, Anthropic, Azure, Ollama, and more — so use whichever key your run configures.
- Local dev flow: Stagehand continues to run from your Node or Python process.

## What Steel adds
| Job | Before Steel | With Steel |
| --- | --- | --- |
| Session startup | Local Chrome spun up per run, seconds of warmup | On-demand Steel Cloud sessions created via `sessions.create()` and exposed over CDP through `session.websocketUrl` |
| State continuity | Browser dies when your laptop or CI job ends | Managed sessions that run from 15 minutes (Launch) up to 24 hours (Enterprise), preserving auth until you call `release()` |
| Anti-bot handling | DIY proxies and CAPTCHA plugins | `sessions.create({ useProxy, solveCaptcha })` plus managed fingerprints and residential IPs |
| Evidence | Console logs only | `session.sessionViewerUrl`, live WebRTC viewer, and HLS replay after the run |
| Scale discipline | One session per machine | Plan-based concurrent browser sessions — 10 on Launch, 100 on Scale, 1,000+ on Enterprise — with SDK-level release discipline |

## Where Stagehand plans and Steel executes
| Step | Stagehand owns | Steel owns |
| --- | --- | --- |
| Intent + schema | `Stagehand` objects, `StoriesSchema`/`Stories` models, `stagehand.extract()` parsing | Not applicable; Steel just provides the browser surface |
| Browser control loop | `stagehand.act()` instructions, `page.goto()` targets, retries | Maintains the actual Chromium instance your CDP socket connects to |
| Environment config | `env: "LOCAL"`, OpenAI key, caching choices | Session size, proxies, CAPTCHA solving, user agents via `sessions.create()` |
| Observability | Stagehand logs in your app | Session viewer URL, Agent Traces, HLS replay, Files API exports |
| Cleanup | Closing the Stagehand client | `client.sessions.release(session.id)` so the slot frees instantly |

Stagehand keeps thinking. Steel keeps the browser alive, recorded, and recoverable.

## Minimal integration path
1. Load `STEEL_API_KEY` and `OPENAI_API_KEY` from `.env` alongside your Stagehand config.
2. Use the Steel SDK (`steel-sdk` for Node, `steel` for Python) to call `client.sessions.create({ useProxy, solveCaptcha, timeout })` — `timeout` is in milliseconds, e.g. `600000` for 10 minutes — and capture the returned `session.sessionViewerUrl` for debugging.
3. Pass Stagehand a `cdpUrl` built from `session.websocketUrl` plus `&apiKey=${STEEL_API_KEY}` while leaving `env: "LOCAL"` so Stagehand keeps running beside your code.
4. Run `page.goto()`, `stagehand.extract()`, and `stagehand.act()` as usual; Stagehand still turns your instructions plus schemas into actions.
5. Close Stagehand, then call `client.sessions.release(session.id)` so Steel exports the replay, frees the slot, and logs the run under your plan.

Use this default path when Stagehand’s natural-language planning matters more than low-level Playwright scripts but you still need Steel’s reliability envelope.

## Example code
### TypeScript
```ts
import Steel from "steel-sdk";
import { Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod";
import "dotenv/config";

const StoriesSchema = z.object({
  stories: z.array(z.object({ title: z.string(), rank: z.number() }))
});

async function run() {
  const client = new Steel({ steelAPIKey: process.env.STEEL_API_KEY });
  const session = await client.sessions.create({ useProxy: true, solveCaptcha: true });

  const stagehand = new Stagehand({
    env: "LOCAL",
    model: { modelName: "openai/gpt-5", apiKey: process.env.OPENAI_API_KEY },
    localBrowserLaunchOptions: {
      cdpUrl: `${session.websocketUrl}&apiKey=${process.env.STEEL_API_KEY}`
    }
  });

  await stagehand.init();
  const page = stagehand.context.pages()[0];
  await page.goto("https://news.ycombinator.com");
  const result = await stagehand.extract(
    "extract the first 5 titles and ranks",
    StoriesSchema
  );
  console.log(result.stories);

  await stagehand.close();
  await client.sessions.release(session.id);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

### Python
```python
import asyncio, os
from dotenv import load_dotenv
from pydantic import BaseModel
from stagehand import StagehandConfig, Stagehand
from steel import Steel

load_dotenv()

class Story(BaseModel):
    title: str
    rank: int

class Stories(BaseModel):
    stories: list[Story]

async def run():
    client = Steel(steel_api_key=os.getenv("STEEL_API_KEY"))
    session = client.sessions.create(use_proxy=True, solve_captcha=True)

    config = StagehandConfig(
        env="LOCAL",
        model_name="gpt-4o-mini",
        model_api_key=os.getenv("OPENAI_API_KEY"),
        local_browser_launch_options={
            "cdp_url": f"{session.websocket_url}&apiKey={os.getenv('STEEL_API_KEY')}"
        }
    )

    stagehand = Stagehand(config)
    await stagehand.init()
    await stagehand.page.goto("https://news.ycombinator.com")
    stories = await stagehand.page.extract(
        "extract the first 5 story titles and ranks",
        schema=Stories
    )
    print(stories.stories)

    await stagehand.close()
    client.sessions.release(session.id)

if __name__ == "__main__":
    asyncio.run(run())
```

## Trade-offs and constraints
- Stagehand still consumes your chosen model provider's quota (OpenAI, Anthropic, Google, or whichever you configure); Steel does not change the LLM spend.
- Steel’s managed browsers inherit your session timeout (default 5 minutes) unless you request longer when calling `sessions.create()`; release them manually in long queues so plan caps stay healthy.
- CAPTCHA solving, proxies, and multi-region runs require Steel Cloud; Steel Local mirrors the integration pattern but without those managed surfaces (Credentials API, Files API, CAPTCHA solving, and the dedicated Stealth Browser are Cloud-only; Steel Local is capped at concurrency 1).
- Structured extraction is only as reliable as the schema you define; Stagehand will throw validation errors when a site drifts. Keep `stagehand.extract()` schemas small and add retries where it matters.

## Works best for
- Teams that already standardized on Stagehand prompts and schemas but need more reliable browsers.
- Agent workflows where structured data has to be replayable and auditable.
- Developers who want to use the Stagehand cookbook starters but deploy them against Steel’s fleets.

## Not yet a fit for
- Runs that must stay fully offline; Steel Cloud is a remote managed runtime, so air-gapped workloads can't reach it. (Stagehand itself can drive local models like Ollama, but the Steel session is hosted.)
- Workloads that only need headless snapshots or static scraping; Steel Browser Tools (/scrape, /screenshot, /pdf) may be simpler.

## Next step
Start from the Steel + Stagehand quickstarts (Node or Python), connect via `session.websocketUrl`, and push the run into your queue once you can see it in the Steel [session viewer](@/glossary/session-viewer.md). Humans use Chrome. Agents use Steel.

## References
- [Steel + Stagehand integration](https://docs.steel.dev/integrations/stagehand) — canonical pairing guide and source for both code samples.
- [Steel Session Lifecycle](https://docs.steel.dev/overview/sessions-api/session-lifecycle) — `timeout` and `inactivityTimeout` params, default 5-minute timeout, plan-based session ceilings.
- [Steel Pricing & Limits](https://docs.steel.dev/overview/pricinglimits) — Launch/Scale/Enterprise concurrency, session lengths, and metered rates.
- [Stagehand v3 docs](https://docs.stagehand.dev/first-steps/introduction) — `act`/`extract`/`observe` primitives and multi-provider model config.
