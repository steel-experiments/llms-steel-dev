---
title: "Run OpenAI Computer Use in a Steel Session"
id: "openai-computer-use-with-steel"
summary: "Route OpenAI computer-use actions through Steel's Computer API while Steel manages the browser session, viewer, and replay."
description: "Route OpenAI computer-use actions through Steel's Computer API while Steel manages the browser session, viewer, and replay."
canonical_questions: ["how do i use openai computer use with steel"]
retrieval_aliases: ["openai computer use steel", "steel computer api openai"]
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
review_by: "2026-09-13"
owner: "editorial"
related: ["computer-use", "sessions", "human-in-the-loop-browser-agents", "replay"]
external_refs:
  - "https://docs.steel.dev/integrations/openai-computer-use"
  - "https://docs.steel.dev/overview/sessions-api/session-lifecycle"
type: "article"
status: "published"
draft: false
canonical_url: "https://answers.steel.dev/articles/openai-computer-use-with-steel/"
created: "2026-04-01"
modified: "2026-07-13"
tags: [openai, computer-use, integration]
immutable: false
---
OpenAI Computer Use decides which browser action to take. Steel's Computer API takes screenshots and executes those actions inside a managed browser session.

The integration loop has three parts:

1. capture a screenshot through Steel;
2. send the screenshot and task state to OpenAI;
3. route the returned action to `steel.sessions.computer()`.

## Start a browser session

```ts
import Steel from "steel-sdk";

const steel = new Steel({
  steelAPIKey: process.env.STEEL_API_KEY,
});

const session = await steel.sessions.create({
  dimensions: { width: 1024, height: 768 },
  timeout: 900_000,
});

try {
  const screenshot = await steel.sessions.computer(session.id, {
    action: "take_screenshot",
  });

  console.log(screenshot.base64_image);
  // Send the image to OpenAI and route its returned action back
  // through steel.sessions.computer(session.id, action).
} finally {
  await steel.sessions.release(session.id);
}
```

This snippet establishes the Steel side of the loop. Use the current OpenAI Responses API schema from OpenAI's documentation when constructing the model request; model names and tool payloads change independently of Steel.

## Map actions explicitly

Keep a small adapter between model output and Steel:

- validate the action type before execution;
- reject coordinates outside the configured viewport;
- require approval for destructive or externally visible actions;
- return the next screenshot to the model after execution;
- stop after a bounded number of steps or elapsed time.

Do not forward arbitrary model output directly into the Computer API. The adapter is where your application enforces policy and records which model response requested each browser action.

## Preserve evidence

Store these identifiers together:

- your task or queue ID;
- the OpenAI response and computer-call IDs;
- the Steel `session.id`;
- the Steel viewer URL;
- the final release status.

The live viewer lets an operator inspect the same browser while it runs. After release, Steel's session recording supports post-run review. Neither replaces application logs: keep the model decision, validated action, and execution result as structured events.

## Handle consequential actions

Computer-use models can encounter login pages, payment controls, messages, and untrusted page content. Use a human approval boundary before actions such as submitting a form, sending a message, changing permissions, or confirming a purchase.

Treat page text as untrusted input. A browser session isolates execution, but it does not decide whether an instruction found in the page should override your task policy.

## Versioning limits

Avoid pinning an article to one OpenAI model name unless the article is updated with every model release. The stable Steel contract is the session and `sessions.computer` interface; the model-side tool schema belongs to OpenAI.

Follow the [current Steel integration guide](https://docs.steel.dev/integrations/openai-computer-use) for the complete action mapping, then add your approval and logging policy before running against authenticated sites.
