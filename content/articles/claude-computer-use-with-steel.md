---
title: "Claude Computer Use With Steel"
id: "claude-computer-use-with-steel"
summary: "Keep Claude Computer Use prompts untouched; Steel supplies reliable sessions, viewer links, replay evidence, CAPTCHA helpers, and disciplined cleanup."
canonical_questions: ["claude computer use with steel"]
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
canonical_url: "https://steel.dev/blog/claude-computer-use-with-steel"
description: "Keep Claude Computer Use prompts untouched; Steel supplies reliable sessions, viewer links, replay evidence, CAPTCHA helpers, and disciplined cleanup."
created: "2026-04-01"
modified: "2026-04-01"
tags: [claude, computer-use, integration, ai-answers]
immutable: false
---
Keep Claude's [Computer Use](@/glossary/computer-use.md) loop exactly as it is and hand the `computer_20251124` tool a Steel session. You keep the prompts, planning, and review loop you already tuned while Steel owns the Chromium runtime, evidence, and cleanup.

Steel adds the boring but critical parts: sub-second-to-seconds session startup with a lifetime that scales with your plan (15 min on Launch, 1 hour on Scale, up to 24 hours on Enterprise), live viewer and [replay](@/glossary/replay.md) links for every run, CAPTCHA and [proxy](@/glossary/proxies.md) controls for hostile sites, and explicit release calls so your queue never starves.

## What stays the same
| Computer Use concern | What you keep | Notes |
| --- | --- | --- |
| Prompting and reasoning | Same Claude system prompt plus single natural language task | Steel never touches your Anthropic credentials or betas |
| Tool contract | `computer_20251124` remains the only tool in `tools` | You just swap the backend that powers mouse, key, scroll, and screenshot actions |
| Safety workflow | Existing human approvals or safety acknowledgements | Keep whichever reviewer UI or policy you already wired around Claude |
| Orchestration | Your Python or Node worker, queues, and Anthropic SDK usage | Steel is an extra API client that sits beside `anthropic` |

## What Steel adds
| Steel surface | Why it matters for Claude Computer Use | How to wire it |
| --- | --- | --- |
| Session lifecycle | Fast startup with a tiered lifetime (15 min Launch / 1 hour Scale / up to 24 hours Enterprise) prevents Chromium restarts mid reasoning | `session = steel.sessions.create({dimensions:{width:1280,height:768},blockAds:true,timeout:900000})` then always release |
| Observability | Live viewer plus replay keeps every action reviewable and easy to forward | Log `session.sessionViewerUrl` or `session.session_viewer_url` with each Anthropic response ID |
| Computer API bridge | Translates Claude's `left_click`/`type`/`key`/`scroll`/`screenshot` into Steel's `click_mouse`/`type_text`/`press_key`/`scroll`/`take_screenshot` (the two vocabularies do not match) | Switch on Claude's action name, build the Steel action body, call `steel.sessions.computer(session.id, body)`, then return the screenshot data URI |
| Anti-bot stack | Managed proxies and CAPTCHA solving cut the sites that stall Claude's loop | Set `useProxy`, `region`, and wire the CAPTCHAs API before high-friction domains |
| Human-in-loop evidence | Viewer link, agent traces, and replay export prove what happened before approvals | Pair every sensitive tool call with the viewer URL so reviewers can stop or resume confidently |

## Minimal integration path
1. Install `steel-sdk`, `anthropic`, and `dotenv` or `python-dotenv`, then load `STEEL_API_KEY`, `ANTHROPIC_API_KEY`, and `TASK` from `.env` just like the docs quickstarts.
2. Create a Steel client and session once per job. Keep the viewport synced with the `display_width_px` and `display_height_px` you pass to the `computer` tool.
3. When Claude returns a `tool_use` block for `computer`, translate its `action` payload (mouse, type, scroll, wait, screenshot) into the matching Steel Computer API call.
4. Wrap the Computer API response as a base64 PNG: `data:image/png;base64,<resp.base64_image>` and push it back through a `tool_result` block so Claude sees the latest frame.
5. Watch `session.sessionViewerUrl` during the run for live validation, then call `steel.sessions.release(session.id)` in `finally`. If a worker dies mid run, retry the release with the stored session ID before starting a new job.

## Example TypeScript loop
```ts
import { Steel } from "steel-sdk";
import Anthropic from "@anthropic-ai/sdk";

const steel = new Steel({ steelAPIKey: process.env.STEEL_API_KEY! });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const session = await steel.sessions.create({
  dimensions: { width: 1280, height: 768 },
  blockAds: true,
  timeout: 900_000,
});
console.log(`Live viewer: ${session.sessionViewerUrl}`);

const tools = [
  {
    type: "computer_20251124",
    name: "computer",
    display_width_px: 1280,
    display_height_px: 768,
    display_number: 1,
  },
];

// Claude and Steel use different action vocabularies, so translate before calling the Computer API.
// The canonical full starter is `steel forge claude-computer-use-ts` (docs.steel.dev/cookbook/claude-computer-use).
const KEY_MAP: Record<string, string> = {
  ctrl: "Control", alt: "Alt", shift: "Shift", meta: "Meta",
  esc: "Escape", up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight",
};
const normalizeKey = (key: string) => KEY_MAP[key.toLowerCase()] ?? key;

function buildSteelAction(input: any) {
  switch (input.action) {
    case "left_click":
    case "right_click":
    case "middle_click":
    case "double_click":
    case "triple_click": {
      // Steel collapses every click variant into click_mouse with button + numClicks.
      const numClicks = /triple/.test(input.action) ? 3 : /double/.test(input.action) ? 2 : 1;
      const button = /right/.test(input.action) ? "right" : /middle/.test(input.action) ? "middle" : "left";
      return { action: "click_mouse", button, numClicks, coordinates: input.coordinate, screenshot: true };
    }
    case "type":
      return { action: "type_text", text: input.text, screenshot: true };
    case "key":
    case "hold_key":
      return { action: "press_key", text: normalizeKey(input.text), screenshot: true };
    case "scroll":
      // Steel takes a pixel delta; Claude sends a unit count, so scale it.
      return { action: "scroll", coordinates: input.coordinate, delta_y: (input.scroll_amount ?? 1) * 100, screenshot: true };
    case "screenshot":
      return { action: "take_screenshot" };
    default:
      throw new Error(`Unhandled Computer Use action: ${input.action}`);
  }
}

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-6",
  messages: [{ role: "user", content: process.env.TASK! }],
  tools,
  betas: ["computer-use-2025-11-24"],
});

for (const block of response.content) {
  if (block.type !== "tool_use") continue;
  const screenshot = await steel.sessions.computer(session.id, buildSteelAction(block.input));

  await anthropic.beta.messages.create({
    model: "claude-sonnet-4-6",
    messages: [
      { role: "assistant", content: [block] },
      {
        role: "user",
        content: [
          {
            type: "tool_result",
            tool_use_id: block.id,
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: "image/png",
                  data: screenshot.base64_image,
                },
              },
            ],
          },
        ],
      },
    ],
    tools,
  });
}

await steel.sessions.release(session.id);
```

## Example Python loop
```python
from anthropic import Anthropic
from steel import Steel

steel = Steel(steel_api_key=os.environ["STEEL_API_KEY"])
anthropic = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

session = steel.sessions.create(
    dimensions={"width": 1280, "height": 768},
    block_ads=True,
    api_timeout=900000,
)
print(f"Live viewer: {session.session_viewer_url}")

tools = [
    {
        "type": "computer_20251124",
        "name": "computer",
        "display_width_px": 1280,
        "display_height_px": 768,
        "display_number": 1,
    }
]

# Claude and Steel use different action vocabularies, so translate before calling the Computer API.
# The canonical full starter is `steel forge claude-computer-use-py` (docs.steel.dev/cookbook/claude-computer-use).
KEY_MAP = {
    "ctrl": "Control", "alt": "Alt", "shift": "Shift", "meta": "Meta",
    "esc": "Escape", "up": "ArrowUp", "down": "ArrowDown", "left": "ArrowLeft", "right": "ArrowRight",
}

def normalize_key(key: str) -> str:
    return KEY_MAP.get(key.lower(), key)

def build_steel_action(block_input: dict) -> dict:
    action = block_input["action"]
    if action in ("left_click", "right_click", "middle_click", "double_click", "triple_click"):
        # Steel collapses every click variant into click_mouse with button + numClicks.
        num_clicks = 3 if "triple" in action else 2 if "double" in action else 1
        button = "right" if "right" in action else "middle" if "middle" in action else "left"
        return {"action": "click_mouse", "button": button, "numClicks": num_clicks, "coordinates": block_input.get("coordinate"), "screenshot": True}
    if action == "type":
        return {"action": "type_text", "text": block_input["text"], "screenshot": True}
    if action in ("key", "hold_key"):
        return {"action": "press_key", "text": normalize_key(block_input["text"]), "screenshot": True}
    if action == "scroll":
        # Steel takes a pixel delta; Claude sends a unit count, so scale it.
        return {"action": "scroll", "coordinates": block_input.get("coordinate"), "delta_y": block_input.get("scroll_amount", 1) * 100, "screenshot": True}
    if action == "screenshot":
        return {"action": "take_screenshot"}
    raise ValueError(f"Unhandled Computer Use action: {action}")

messages = [
    {"role": "user", "content": BROWSER_SYSTEM_PROMPT},
    {"role": "user", "content": TASK},
]

while True:
    response = anthropic.beta.messages.create(
        model="claude-sonnet-4-6",
        messages=messages,
        tools=tools,
        betas=["computer-use-2025-11-24"],
    )

    took_action = False
    for block in response.content:
        if block.type != "tool_use":
            messages.append({"role": "assistant", "content": block.text})
            continue

        took_action = True
        resp = steel.sessions.computer(session.id, build_steel_action(block.input))
        messages.extend(
            [
                {"role": "assistant", "content": [block]},
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": [
                                {
                                    "type": "image",
                                    "source": {
                                        "type": "base64",
                                        "media_type": "image/png",
                                        "data": resp.base64_image,
                                    },
                                }
                            ],
                        }
                    ],
                },
            ]
        )
    if not took_action:
        break

steel.sessions.release(session.id)
```

Anthropic ships a new computer-use tool version per model family — confirm the tool, beta, and model pairing at Anthropic's computer-use docs before swapping models. The viewport above (1280x768, ~0.98 MP) stays safely under the resolution limits for both `computer_20251124` and earlier tool versions.

## Pair Computer Use with Steel observability
| Signal | Steel hook | Why it matters |
| --- | --- | --- |
| Live viewer | `session.sessionViewerUrl` | Let reviewers watch the run or stop it mid flight without SSH |
| Replay evidence | Same viewer URL after release plus downloadable MP4/HLS | Share proof when Claude says it completed a task |
| Agent traces | `GET /v1/sessions/{id}/agent-traces` (with `steel-api-key` header) | Store the browser-activity timeline (click, input, navigate, scroll, drag, error events) beside Anthropic transcripts |
| CAPTCHA status | `steel.sessions.captchas.status(session.id)` | Poll `captchas.status()`, then call `captchas.solve(sessionId)` (or enable `solveCaptcha` at create) to clear the challenge before resuming Claude |
| Session health | `steel.sessions.release(session.id)` metrics + `sessions.retrieve` status | Catch orphaned sessions before they burn your plan caps |

## Fit and trade-offs
**Works best for**
- Teams already live on Claude Computer Use that just need a managed browser runtime with observability.
- Multi-step workflows where viewer links, replays, and logs must be auditable for humans before resuming.
- Queues that keep hitting anti-bot walls or flaky local Chrome when Claude loops more than a few minutes.

**Not yet ideal when**
- You need desktop apps or offline contexts—Steel is Chrome in the cloud only.
- Runs exceed Steel's 24 hour session ceiling or concurrency budget for your plan tier without Enterprise increases.
- Your Anthropic org does not yet have `computer-use-2025-11-24` access; Steel cannot grant that beta.

## Go-live checklist
- `.env` checked into your secrets manager with valid Steel and Anthropic keys plus a default `TASK`.
- Logging includes Steel session ID, viewer URL, Anthropic response ID, and whether `sessions.release` succeeded.
- Dimensions, proxy settings, and CAPTCHA helpers aligned with your site list before letting agents loose.
- Manual reviewers know they can open the Steel viewer URL to approve, pause, or resume sensitive actions.
- `docs.steel.dev/integrations/claude-computer-use` covers setup and the connection model; the full TypeScript and Python starters at `docs.steel.dev/cookbook/claude-computer-use` run end to end so future edits stay grounded.

Next step: run one Claude Computer Use task through a Steel session, review the replay, then wire CAPTCHA helpers before scaling the queue. Humans use Chrome. Agents use Steel.
