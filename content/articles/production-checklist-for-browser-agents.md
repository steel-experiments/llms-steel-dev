---
title: "Production Checklist for Browser Agents"
id: "production-checklist-for-browser-agents"
summary: "Define session ownership, authentication, action policy, evidence, retries, cleanup, and data retention before a browser agent handles production work."
description: "Define session ownership, authentication, action policy, evidence, retries, cleanup, and data retention before a browser agent handles production work."
canonical_questions: ["production checklist for browser agents"]
retrieval_aliases: ["browser agent go live checklist", "production browser automation checklist"]
intent: "reference"
entity: "operations"
audience: "developer"
schema_type: "HowTo"
visibility: "public"
ai_visibility: "public"
llms_priority: "core"
token_budget: "full"
date: "2026-07-13"
updated: "2026-07-13"
review_by: "2026-09-13"
owner: "editorial"
related: ["sessions", "credentials-api-for-browser-agents", "human-in-the-loop-browser-agents", "why-browser-agents-fail-in-production"]
external_refs:
  - "https://docs.steel.dev/overview/sessions-api/session-lifecycle"
  - "https://docs.steel.dev/overview/credentials-api/overview"
  - "https://docs.steel.dev/overview/sessions-api/human-in-the-loop"
type: "article"
status: "published"
draft: false
canonical_url: "https://answers.steel.dev/articles/production-checklist-for-browser-agents/"
created: "2026-04-01"
modified: "2026-07-13"
tags: [production, checklist, operations]
immutable: false
---
A production browser agent needs explicit ownership for the session, identity, permitted actions, evidence, and cleanup. Complete this checklist for one workflow before increasing traffic.

## Session lifecycle

- [ ] Every session is tied to a task and owner.
- [ ] The timeout is set to the shortest useful duration.
- [ ] Session creation failures use bounded backoff.
- [ ] The worker releases the session in a `finally` path.
- [ ] Stale-session cleanup is monitored separately from task success.

## Authentication and state

- [ ] Credentials are stored outside prompts and source control.
- [ ] Credential namespaces separate identities and environments.
- [ ] Profile IDs are authorized like authenticated browser state.
- [ ] The workflow verifies a logged-in marker before acting.
- [ ] Expired authentication routes to reauthentication or review.

## Action policy

- [ ] Allowed actions are defined independently of the prompt.
- [ ] External or destructive actions require explicit approval.
- [ ] Model-produced coordinates and values are validated.
- [ ] Untrusted page text cannot change system-level policy.
- [ ] Each action has a success assertion.

## Evidence and debugging

- [ ] Task, model-response, and Steel session IDs are stored together.
- [ ] Operators can access the live viewer through authenticated tooling.
- [ ] Failed runs retain replay, action logs, and relevant files.
- [ ] Evidence access and retention match the data classification.
- [ ] Retries remain linked to the original attempt.

## Reliability

- [ ] Metrics separate session, navigation, authentication, action, and output failures.
- [ ] Completion without retry is tracked by workflow.
- [ ] Human intervention has structured reason codes.
- [ ] Concurrency and request limits are monitored from current account configuration.
- [ ] A retry changes a known condition or stops.

## Data handling

- [ ] Uploaded and downloaded files are scoped to a task or tenant.
- [ ] Sensitive screenshots and recordings have an owner and retention period.
- [ ] Secrets and access-bearing viewer URLs are redacted from logs.
- [ ] Deletion covers profiles, credentials, files, and copied evidence.
- [ ] Target-site authorization and usage policy have been reviewed.

## Go-live test

Run one representative task through four outcomes:

1. normal completion;
2. target-site or navigation failure;
3. authentication expiry;
4. human rejection at an approval boundary.

The workflow is ready when each outcome ends with a released session, a stable result state, and enough evidence to explain what happened.

Use the [session lifecycle guide](https://docs.steel.dev/overview/sessions-api/session-lifecycle) to verify the create, timeout, and release behavior in your implementation.
