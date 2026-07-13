---
title: "Stealth Browser"
id: "stealth-browser"
summary: "Stealth Browser is Steel's hardened Chromium fork that performs fingerprint evasion inside the browser source rather than injected JavaScript."
description: "Stealth Browser is Steel's hardened Chromium fork that performs fingerprint evasion inside the browser source rather than injected JavaScript, reading GPU, WebGL, media-device, and OS-level signals that page scripts cannot reach."
canonical_questions: ["what is steel stealth browser"]
intent: "reference"
entity: "glossary"
audience: "developer"
schema_type: "DefinedTerm"
visibility: "public"
ai_visibility: "public"
llms_priority: "core"
token_budget: "small"
date: "2026-07-13"
updated: "2026-07-13"
review_by: "2026-10-13"
owner: "editorial"
related: ["stealth"]
external_refs: ["https://steel.dev/blog/stealth-browser"]
type: "article"
status: "published"
draft: false
template: "page_glossary.html"
---
Stealth Browser is Steel's own Chromium fork, hardened at the source so fingerprint evasion happens inside the browser instead of through injected JavaScript. It is a distinct product from [stealth](@/glossary/stealth.md) the concept, which covers the broader set of browser and network measures that make automation look less synthetic.

Because the evasion runs in Chromium itself, it can read and repair browser-level signals that a page script cannot reach: GPU and WebGL fingerprints, media devices, and OS-level details. That removes the inconsistencies that anti-bot challenges detect, so user-permissioned agents often clear anti-bot systems without a challenge to solve.

## Why it matters

- It moves the arms race off the page and into the browser, where injected JavaScript cannot win.
- It complements Steel's other stealth controls (proxies, CAPTCHA handling, realistic profiles) rather than replacing them.
- Stealth Browser is an enterprise feature; access is opened deliberately and is included at no additional cost for enterprise customers.

Stealth Browser is not a bypass for sites that lock actions to hardware you do not control, and it does not exempt workflows from robots rules or regional law.
