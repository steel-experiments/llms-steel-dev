---
title: "Diagnose Browser-Agent Failures in Production"
id: "why-browser-agents-fail-in-production"
summary: "Separate session, navigation, authentication, action, and evidence failures before changing the model or prompt."
description: "Separate session, navigation, authentication, action, and evidence failures before changing the model or prompt."
canonical_questions: ["why do browser agents fail in production"]
retrieval_aliases: ["debug browser agent failures", "browser automation production failures"]
intent: "troubleshooting"
entity: "reliability"
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
related: ["sessions", "profiles", "replay", "playwright-with-steel"]
external_refs:
  - "https://docs.steel.dev/overview/sessions-api/session-lifecycle"
  - "https://docs.steel.dev/overview/profiles-api/overview"
  - "https://docs.steel.dev/overview/sessions-api/embed-sessions"
type: "article"
status: "published"
draft: false
canonical_url: "https://answers.steel.dev/articles/why-browser-agents-fail-in-production/"
created: "2026-03-31"
modified: "2026-07-13"
tags: [reliability, debugging, browser-agents]
immutable: false
---
Browser-agent failures usually belong to one of five layers: session creation, navigation, authentication, browser action, or evidence capture. Classify the failure before changing the model or prompt.

## Capture one run identifier

Store the Steel `session.id` beside the queue job, model response, and application trace. Every log, screenshot, replay, and retry should point back to that pair.

Without a shared identifier, a retry can look like the original run and hide which browser state actually failed.

## Classify the first failed boundary

| Boundary | Evidence to inspect | Typical application response |
| --- | --- | --- |
| Session creation | API status, timeout, account capacity | back off, release stale sessions, retry creation |
| Navigation | URL, response state, console and network events | verify region, proxy, redirect, and page readiness |
| Authentication | expected logged-in marker, profile ID, credential namespace | reauthenticate or route to review |
| Browser action | locator or coordinates, page state before action | improve the action contract or page assertion |
| Evidence | viewer, replay, file and log export status | repair instrumentation before another production run |

Record the first failed boundary rather than the final exception. A task timeout may begin with a login redirect several minutes earlier.

## Reproduce the session configuration

Capture the options that affect browser behavior:

- dimensions and user agent;
- region and proxy configuration;
- profile ID;
- credential namespace;
- session timeout;
- automation library version.

Reproduction requires the same configuration, not only the same URL and prompt.

## Make retries state-aware

A clean retry and a profile-based retry answer different questions. Use a clean session to test whether stored state caused the failure. Reuse a profile when the workflow legitimately depends on authenticated context.

Bound retries by count and reason. Repeating a rejected login or missing selector without changing state consumes capacity and erases useful evidence.

## Preserve the failed run

Do not release or replace the failed session until your application has saved the identifiers needed for review. The live viewer supports inspection during the run; recorded sessions support later replay.

Evidence should include what the browser saw, what action was requested, and what result the application expected. A video alone cannot explain the model decision.

Start with one failing workflow and add a structured `failure_boundary` field before changing its prompt.
