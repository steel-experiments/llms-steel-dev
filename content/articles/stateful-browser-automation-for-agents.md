---
title: "Persist Browser State Across Agent Runs"
id: "stateful-browser-automation-for-agents"
summary: "Use Steel profiles to carry cookies, storage, extensions, credentials, and browser settings from one released session into the next."
description: "Use Steel profiles to carry cookies, storage, extensions, credentials, and browser settings from one released session into the next."
canonical_questions: ["how do i persist browser state across agent runs"]
retrieval_aliases: ["stateful browser automation", "reuse steel profile"]
intent: "reference"
entity: "browser-infrastructure"
audience: "developer"
schema_type: "TechArticle"
visibility: "public"
ai_visibility: "public"
llms_priority: "core"
token_budget: "full"
date: "2026-07-13"
updated: "2026-07-13"
review_by: "2026-10-13"
owner: "editorial"
related: ["profiles", "sessions", "credentials-api-for-browser-agents", "human-in-the-loop-browser-agents"]
external_refs:
  - "https://docs.steel.dev/overview/profiles-api/overview"
  - "https://docs.steel.dev/overview/sessions-api/session-lifecycle"
type: "article"
status: "published"
draft: false
canonical_url: "https://answers.steel.dev/articles/stateful-browser-automation-for-agents/"
created: "2026-04-01"
modified: "2026-07-13"
tags: [profiles, state, authentication]
immutable: false
---
Steel profiles persist a browser's user-data directory across sessions. Use them when separate agent runs need the same cookies, local storage, extensions, credentials, or browser settings.

## Create and reuse a profile

```ts
const first = await client.sessions.create({
  persistProfile: true,
});

// Complete the initial browser work, then persist its state.
await client.sessions.release(first.id);

const resumed = await client.sessions.create({
  profileId: first.profileId,
  persistProfile: true,
});

try {
  // Continue with the restored browser context.
} finally {
  await client.sessions.release(resumed.id);
}
```

Steel creates the profile during the first session and saves its user-data directory when that session is released. Pass `profileId` into a later session to restore it. Add `persistProfile: true` again when changes from the later session should update the stored profile.

## Choose the right state boundary

Use one profile per identity and environment. A production account, staging account, and separate customer should not share a profile.

Keep these identifiers in your own data model:

- profile ID;
- account or actor that owns it;
- environment and permitted origins;
- creation and last-use timestamps;
- rotation or revocation status.

A profile can contain authenticated state. Access to its ID should follow the same authorization rules as access to the underlying account.

## Respect profile limits

Steel documents a 300 MB profile limit and deletes profiles after 30 days without use. A failed upload leaves the profile in a failed state.

Keep downloaded reports, videos, and datasets in the [Files API](@/glossary/files-api.md), not in browser state. Profiles work best when they contain only the data Chrome needs to restore context.

## Profiles and credentials solve different problems

A profile restores browser state after a successful login. The [Credentials API](@/articles/credentials-api-for-browser-agents.md) stores and injects login secrets.

Use credentials when a session must authenticate from a clean state. Use a profile when the target relies on remembered devices, cookies, or local storage. Some workflows use both: credentials establish access, and the released session persists the resulting browser state.

## Failure handling

Do not assume a restored profile guarantees that authentication is still valid. The target application can expire a session, request MFA, revoke a device, or change its login flow.

Detect the authenticated landing state explicitly. If validation fails, route the run through reauthentication or human review instead of retrying the same profile indefinitely.

Follow the [Profiles API overview](https://docs.steel.dev/overview/profiles-api/overview), seed one profile, release it, and confirm a second session restores the expected state.
