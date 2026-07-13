---
title: "Add Human Approval to a Browser-Agent Session"
id: "human-in-the-loop-browser-agents"
summary: "Pause the agent, give an authorized reviewer the live Steel viewer, record the decision, and resume the same browser session."
description: "Pause the agent, give an authorized reviewer the live Steel viewer, record the decision, and resume the same browser session."
canonical_questions: ["how do i add human approval to a browser agent"]
retrieval_aliases: ["human in the loop steel", "browser session handoff"]
intent: "reference"
entity: "security"
audience: "developer"
schema_type: "TechArticle"
visibility: "public"
ai_visibility: "public"
llms_priority: "core"
token_budget: "full"
date: "2026-07-13"
updated: "2026-07-13"
review_by: "2026-09-13"
owner: "editorial"
related: ["human-in-the-loop", "session-viewer", "sessions", "openai-computer-use-with-steel"]
external_refs:
  - "https://docs.steel.dev/overview/sessions-api/human-in-the-loop"
  - "https://docs.steel.dev/overview/sessions-api/embed-sessions"
type: "article"
status: "published"
draft: false
canonical_url: "https://answers.steel.dev/articles/human-in-the-loop-browser-agents/"
created: "2026-04-01"
modified: "2026-07-13"
tags: [human-in-the-loop, approvals, session-viewer]
immutable: false
---
A human-in-the-loop browser workflow pauses automation at a defined boundary and lets an authorized reviewer inspect or control the same session. The browser state stays in place while your application records the decision.

## Embed an interactive viewer

```tsx
<iframe
  src={`${session.debugUrl}?interactive=true&showControls=true`}
  title="Browser approval session"
  style={{ width: "100%", height: 600, border: 0 }}
/>
```

Steel documents `interactive=true` for browser input and `showControls=true` for navigation controls. A read-only review should omit interactive access.

Treat the debug URL as an access-bearing capability. Serve it only to an authenticated reviewer, avoid placing it in public logs, and expire your application's approval link when the task ends.

## Define approval as application state

The iframe is only the control surface. Your workflow needs an explicit state machine:

1. the agent reaches a gated action;
2. the worker stops issuing browser commands;
3. an approval record is created with session and task IDs;
4. the reviewer inspects or controls the session;
5. the reviewer approves, rejects, or requests a retry;
6. the worker resumes only after validating that decision.

Store the reviewer, timestamp, reason, and browser state checkpoint. A Slack message or open viewer tab is not an approval record.

## Choose boundaries before execution

Useful approval points include:

- submitting a form with external effects;
- sending a message;
- changing account permissions;
- confirming a purchase or transfer;
- accepting terms;
- handling an unexpected authentication challenge.

Avoid asking for approval after the browser has already performed the action. The worker should stop before the final click or request.

## Handle session timeouts

An approval queue can outlive the browser timeout. Set a bounded timeout that covers the expected review window, show the deadline to the reviewer, and define what happens when it expires.

On timeout, fail closed. Start a new session only after deciding whether the previous state can be restored safely through a profile.

Use the [human-in-the-loop guide](https://docs.steel.dev/overview/sessions-api/human-in-the-loop) to embed one test session, then verify that automation cannot continue without a recorded decision.
