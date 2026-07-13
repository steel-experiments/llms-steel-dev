---
title: "Connect Playwright to Steel"
id: "playwright-with-steel"
summary: "Create a Steel session, attach Playwright over CDP, reuse the existing page, and release the session when the run ends."
description: "Create a Steel session, attach Playwright over CDP, reuse the existing page, and release the session when the run ends."
canonical_questions: ["how do i use playwright with steel"]
retrieval_aliases: ["connect playwright to steel", "steel playwright cdp"]
intent: "reference"
entity: "integration"
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
related: ["cdp", "sessions", "profiles", "why-browser-agents-fail-in-production"]
external_refs:
  - "https://docs.steel.dev/integrations/playwright"
  - "https://docs.steel.dev/overview/sessions-api/quickstart"
type: "article"
status: "published"
draft: false
canonical_url: "https://answers.steel.dev/articles/playwright-with-steel/"
created: "2026-04-01"
modified: "2026-07-13"
tags: [playwright, integration, cdp]
immutable: false
---
Steel exposes each browser session through the Chrome DevTools Protocol. Playwright can attach with `chromium.connectOverCDP()`, so locators, navigation, assertions, and tracing stay in your Playwright process.

## Minimal TypeScript connection

```ts
import { chromium } from "playwright";
import Steel from "steel-sdk";

const apiKey = process.env.STEEL_API_KEY!;
const client = new Steel({ steelAPIKey: apiKey });
const session = await client.sessions.create({
  timeout: 900_000,
});

let browser;

try {
  browser = await chromium.connectOverCDP(
    `${session.websocketUrl}&apiKey=${apiKey}`,
  );

  const context = browser.contexts()[0];
  const page = context.pages()[0];

  await page.goto("https://example.com");
  console.log(await page.title());
} finally {
  if (browser) await browser.close();
  await client.sessions.release(session.id);
}
```

Install the runtime packages with `npm install steel-sdk playwright`. Store `STEEL_API_KEY` outside source control.

Steel returns a browser context with a page already open. Reusing `browser.contexts()[0].pages()[0]` avoids creating an unnecessary second page and matches the current integration guide.

## Add session options deliberately

Session creation is where you choose infrastructure behavior:

```ts
const session = await client.sessions.create({
  timeout: 1_800_000,
  useProxy: true,
  solveCaptcha: true,
});
```

Use only the options required by the workflow. Proxy traffic and CAPTCHA solving have policy and cost implications, and a longer timeout holds capacity for longer. The default session timeout is five minutes.

For authenticated workflows, create or reuse a [profile](@/glossary/profiles.md) instead of copying cookies between unrelated runs:

```ts
const first = await client.sessions.create({
  persistProfile: true,
});

// After releasing first, use first.profileId in a later session.
const resumed = await client.sessions.create({
  profileId: first.profileId,
  persistProfile: true,
});
```

Release the first session before loading its persisted profile. Steel saves the profile when the session ends.

## Keep ownership boundaries clear

Playwright still owns selectors, waits, assertions, and application-specific retry logic. Steel owns the remote browser session and the infrastructure options selected at creation.

Log `session.id` with the queue or request ID that created it. Keep `session.sessionViewerUrl` available to operators during the run, but treat it as an access-bearing URL.

Close the Playwright connection and release the Steel session in `finally`. Explicit cleanup makes concurrency usage predictable and gives each run a clear lifecycle.

Run the [official Playwright integration](https://docs.steel.dev/integrations/playwright) once unchanged before adding profiles, proxies, or CAPTCHA handling.
