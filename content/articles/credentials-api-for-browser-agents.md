---
title: "Keep Login Secrets Out of Browser-Agent Prompts"
id: "credentials-api-for-browser-agents"
summary: "Store credentials by origin and namespace, then let Steel inject them into a browser session without placing raw values in the agent prompt."
description: "Store credentials by origin and namespace, then let Steel inject them into a browser session without placing raw values in the agent prompt."
canonical_questions: ["how do i keep passwords out of browser agent prompts"]
retrieval_aliases: ["steel credentials api", "browser agent credential injection"]
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
related: ["credentials-api", "profiles", "stateful-browser-automation-for-agents", "human-in-the-loop-browser-agents"]
external_refs:
  - "https://docs.steel.dev/overview/credentials-api/overview"
type: "article"
status: "published"
draft: false
canonical_url: "https://answers.steel.dev/articles/credentials-api-for-browser-agents/"
created: "2026-04-01"
modified: "2026-07-13"
tags: [credentials, security, authentication]
immutable: false
---
Steel's Credentials API stores login values separately from the agent and injects matching credentials into a browser session. The agent can navigate to a login page without receiving the raw username, password, or TOTP secret.

The Credentials API is currently documented as beta. Treat its interface and behavior as versioned infrastructure, and review the current documentation before each production rollout.

## Store credentials for an origin

```ts
await client.credentials.create({
  origin: "https://app.example.com",
  namespace: "production-operator",
  value: {
    username: process.env.APP_USERNAME,
    password: process.env.APP_PASSWORD,
  },
});
```

Use namespaces to separate credentials for the same origin. The namespace used during session creation must match the stored credential.

## Enable injection for a session

```ts
const session = await client.sessions.create({
  namespace: "production-operator",
  credentials: {
    autoSubmit: false,
    blurFields: true,
    exactOrigin: true,
  },
});
```

Steel's documented defaults enable `autoSubmit`, `blurFields`, and `exactOrigin` when `credentials: {}` is supplied. Set the fields explicitly when the security policy depends on them.

Disabling automatic submission creates a useful approval boundary. The service can fill the form while your application verifies the origin and asks an operator or policy engine whether submission is allowed.

## Enforce the boundary in your application

Credential injection reduces secret exposure, but it does not replace authorization. Your application should still:

- authorize which actor may use each namespace;
- restrict sessions to expected origins;
- avoid logging credential request bodies;
- protect live viewer access;
- revoke stored credentials when account access changes;
- record which task requested credential use.

Treat screenshots and page content as potentially sensitive after login. Blurring input fields protects the injected values; it does not make the rest of the authenticated page public.

## Combine credentials with profiles carefully

Credentials establish or restore authentication. [Profiles](@/glossary/profiles.md) persist browser state such as cookies and local storage.

A common flow is:

1. create a session with a credential namespace and `persistProfile: true`;
2. verify that login succeeded;
3. release the session so the profile is saved;
4. use the profile for later runs;
5. fall back to credential injection when the saved login expires.

This reduces repeated logins without turning one browser profile into a shared identity.

Use the [Credentials API overview](https://docs.steel.dev/overview/credentials-api/overview) to create a test credential under a non-production namespace before enabling injection for real accounts.
