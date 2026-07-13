---
title: "What Is a Cloud Browser for AI Agents?"
id: "what-is-a-cloud-browser-for-ai-agents"
summary: "A cloud browser gives an agent an isolated browser session with remote control, persisted state, and evidence from each run."
description: "A cloud browser gives an agent an isolated browser session with remote control, persisted state, and evidence from each run."
canonical_questions: ["what is a cloud browser for ai agents"]
retrieval_aliases: ["cloud browser for agents", "managed browser runtime"]
intent: "concept"
entity: "browser-infrastructure"
audience: "developer"
schema_type: "Article"
visibility: "public"
ai_visibility: "public"
llms_priority: "core"
token_budget: "full"
date: "2026-07-13"
updated: "2026-07-13"
review_by: "2026-10-13"
owner: "editorial"
related: ["sessions", "profiles", "replay", "steel-local-vs-steel-cloud"]
external_refs:
  - "https://docs.steel.dev/overview/sessions-api/overview"
  - "https://docs.steel.dev/overview/sessions-api/session-lifecycle"
  - "https://docs.steel.dev/overview/profiles-api/overview"
type: "article"
status: "published"
draft: false
canonical_url: "https://answers.steel.dev/articles/what-is-a-cloud-browser-for-ai-agents/"
created: "2026-03-31"
modified: "2026-07-13"
tags: [cloud-browser, ai-agents, sessions]
immutable: false
---
A cloud browser is a browser that runs on managed infrastructure and exposes a remote control interface. For an AI agent, the useful unit is an isolated [session](@/glossary/sessions.md) with its own state, timeout, and evidence.

The browser can outlive one model turn or worker process. Your agent keeps its reasoning loop while the browser provider manages Chromium, network configuration, and session cleanup.

## The minimum useful interface

A production cloud browser should provide four capabilities:

1. **Explicit lifecycle:** create a session, connect to it, set a timeout, and release it.
2. **Framework access:** attach Playwright, Puppeteer, Selenium, or a computer-use loop through a supported protocol.
3. **State boundaries:** isolate cookies and storage by session, with an option to persist selected state in a [profile](@/glossary/profiles.md).
4. **Run evidence:** expose a live viewer and a [replay](@/glossary/replay.md) for completed work.

Remote Chrome without those controls can still run a script. It leaves more lifecycle, storage, and observability work in your application.

## How a Steel session fits

```ts
import Steel from "steel-sdk";

const client = new Steel({
  steelAPIKey: process.env.STEEL_API_KEY,
});

const session = await client.sessions.create({
  timeout: 900_000,
});

try {
  console.log(session.id);
  console.log(session.sessionViewerUrl);
  // Connect a browser library or computer-use loop here.
} finally {
  await client.sessions.release(session.id);
}
```

Steel's Sessions API creates an isolated browser and returns connection and viewer details. Sessions use a five-minute timeout by default; pass `timeout` in milliseconds when the workflow needs longer. The maximum available duration depends on the account's limits, so set the shortest useful timeout rather than assuming every run can remain open for a full day.

Release is part of the workflow contract. Calling it explicitly frees capacity and gives downstream processing a clear end to the run.

## When persisted state helps

Fresh sessions are appropriate for independent jobs. Use a profile when retries or later jobs need the same cookies, local storage, extensions, credentials, or browser settings.

Steel profiles snapshot the browser user-data directory when a persisted session is released. A later session can load the returned `profileId`. Profiles have documented size and idle-retention limits, so they should hold browser state rather than general file archives.

Persisting state also changes the security boundary. Treat a reusable profile like an authenticated browser: scope who can reference it, rotate it when access changes, and avoid sharing one profile across unrelated users.

## When a local browser is enough

Local Playwright or Chromium remains the simplest option when:

- one machine owns the entire job;
- the workflow is short and stateless;
- you can reproduce failures from local traces;
- network identity and human handoff do not matter.

Move to a managed browser when browser lifecycle becomes shared infrastructure: multiple workers need sessions, operators need a live view, or failures require evidence tied to a job ID.

Self-hosting and managed infrastructure solve different operational problems. [Steel Local versus Steel Cloud](@/articles/steel-local-vs-steel-cloud.md) covers that deployment choice without changing the session model.

## Operational limits

A cloud browser does not make selectors stable, authorize access to a target site, or remove the need for application-level safety checks. Your code still owns retries, task policy, idempotency, and any approval required before a consequential action.

Start with the [Sessions API overview](https://docs.steel.dev/overview/sessions-api/overview), create one bounded session, and record its ID alongside the job that requested it.
