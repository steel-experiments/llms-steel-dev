---
title: "Stealth Browser vs Vanilla Chromium: Anti-Detection for Browser Agents"
id: "stealth-browser-vs-vanilla-chromium"
summary: "Steel Stealth Browser is a Chromium fork that does fingerprint evasion inside the browser source, reading GPU, WebGL, media-device, and OS-level signals that injected JavaScript and vanilla headless cannot reach."
canonical_questions: ["how does steel stealth browser avoid bot detection"]
intent: "comparison"
entity: "browser-automation"
audience: "developer"
schema_type: "Article"
visibility: "public"
ai_visibility: "public"
llms_priority: "core"
token_budget: "medium"
date: "2026-07-13"
updated: "2026-07-13"
related: []
external_refs: ["https://steel.dev/blog/stealth-browser"]
type: "article"
status: "published"
draft: false
canonical_url: "https://steel.dev/blog/stealth-browser"
description: "Steel Stealth Browser is a Chromium fork that does fingerprint evasion inside the browser source, reading GPU, WebGL, media-device, and OS-level signals that injected JavaScript and vanilla headless cannot reach."
created: "2026-07-13"
modified: "2026-07-13"
tags: [stealth-browser, anti-bot, comparison, launch-week]
immutable: false
---
Steel [Stealth Browser](@/glossary/stealth-browser.md) is a Chromium fork, hardened at the source, that moves fingerprint evasion out of injected JavaScript and into the browser itself. It is the answer to a specific failure mode: script-level stealth loses because it races the page's own code.

This article compares the three approaches an agent team can take — vanilla headless, script-patched headless, and Stealth Browser — and explains why hardening at the source changes what anti-bot systems can see. For the broader anti-bot playbook (network, behavior, CAPTCHA layers), see [How to Reduce Anti-Bot False Positives for Legit Automation](@/articles/anti-bot-false-positives-for-legit-automation.md). For the concept behind the product, see the [stealth](@/glossary/stealth.md) glossary term.

## Short answer

- Script-level stealth patches `navigator`, canvas, and the user agent from injected JavaScript. Anti-bot scripts read those same surfaces and routinely win the race.
- Stealth Browser reads and repairs browser-level signals a page script cannot reach — GPU and WebGL fingerprints, media devices, OS-level details — before page JavaScript runs.
- Because evasion happens at the fingerprint level, user-permissioned agents often clear anti-bot systems entirely, with no challenge left to solve.
- Stealth Browser is an enterprise feature, included at no additional cost; access is opened deliberately. It is not a bypass for sites that bind actions to hardware you do not control.

## Why script-level stealth loses

The conventional stealth recipe is a stack of patches: start Chrome, change the user agent, add a proxy, inject JavaScript to clean up the obvious fingerprint surfaces. Each patch runs inside the page context, alongside the anti-bot code it is trying to fool.

That is a race the patch usually loses. Injected scripts must execute before the page's own detection code, and any slip exposes them. The moment a native function is overridden, `Function.toString` and stack traces leak the patch. Worse, injected scripts cannot reach browser-level signals at all — they only see what the page sees — so GPU, WebGL, and media-device fingerprints are left in their raw, inconsistent state for the challenge to read.

## What hardening at the source changes

Stealth Browser does the fingerprint work in Chromium itself, not on top of it. Because the evasion lives in the browser source, it can read and normalize the signals that sit below the page boundary: GPU and WebGL fingerprints, media devices, and OS-level details. The page never observes an inconsistency to flag.

Forking Chromium also let Steel strip the browser down, removing surfaces that headless Chromium inherits by default but real users never expose. The result is a consistent identity between what the browser reports and what the anti-bot stack can independently measure.

## Three approaches compared

| Approach | Where evasion runs | What it can reach | Weakness |
| --- | --- | --- | --- |
| Vanilla headless Chromium | nowhere | nothing | datacenter user agent and automation flags; flagged on first request |
| Script-patched headless (injected JS) | page context | `navigator`, canvas, user agent | races page code; `Function.toString` leaks; cannot reach browser-level signals |
| Steel Stealth Browser (Chromium fork) | browser source | GPU, WebGL, media devices, OS-level details | enterprise feature; request access |

Stealth Browser does not replace Steel's other stealth controls — [proxies](@/glossary/proxies.md), [CAPTCHA solving](@/glossary/captcha-solving.md), and realistic persistent profiles still matter. It removes the fingerprint layer that those controls cannot reach.

## What Stealth Browser does not do

Stealth Browser is built for user-permissioned agents, not for defeating site policy. It will not override a site that locks every action to a vendor-managed device, and it does not exempt a workflow from robots rules, terms of service, or regional law. Where a site exposes a supported API, prefer that path over scraping.

## When to use it

Reach for Stealth Browser when fingerprint detection — not network identity or selectors — is the blocker. If your runs fail CAPTCHA loops that persist after proxies and pacing, or if detection scripts flag the browser before any challenge appears, the fingerprint layer is the likely cause and the browser source is the only place to fix it.

## Next step

Run the same workflow twice: once on standard Steel stealth sessions, once with Stealth Browser. Compare soft-block and challenge rates from the replay evidence, and keep the change only where it reduces intervention.

- [Stealth Browser launch post](https://steel.dev/blog/stealth-browser)
- [Steel stealth overview](https://docs.steel.dev/overview/stealth/proxies)

Humans use Chrome. Agents use Steel.
