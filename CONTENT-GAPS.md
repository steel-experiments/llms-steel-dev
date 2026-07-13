# Content Gap Analysis & Roadmap

A living checklist of content work for `answers.steel.dev`, derived from a multi-agent
research + adversarial-verification pass against the existing library and Steel's public
surface (Launch Week v3, changelog #033, docs, and the competitive landscape).

- **Last analyzed:** 2026-07-13
- **Method:** 121 raw research items → 66 candidate gaps → ~50 verified gaps after
  adversarial dedup (covered-elsewhere / duplicate / weak candidates dropped).
- **Inventory at time of analysis:** 42 articles (10 published cornerstones + 32 editorial
  drafts) + 23 glossary terms.
- **How to use:** work top-down by tier. Tick the boxes as articles ship. Add newly
  discovered gaps at the bottom under "New candidates."

---

## Editorial rules (read before writing)

These keep a 50+ article library from fragmenting. Every new article follows them.

1. **Glossary = canonical concept; articles link, never re-explain.** When an article
   touches sessions / CDP / lifecycle / profiles / credentials / stealth, link the glossary
   term instead of restating the definition.
2. **One canonical lifecycle reference.** "Create → connect → run → release" lives once in
   the *Getting Started* article (P1) and the Session Lifecycle glossary. Integration
   articles link it; they do not re-derive it.
3. **Unique canonical question per article.** No two articles share a
   `canonical_questions` value, and an `(entity, intent)` pair should be unique. Enforce
   with the check in `scripts/check-canonical-questions` (or the grep one-liner at the
   bottom of this file).
4. **Scope statement in every intro.** Name what the article covers *and* what it
   deliberately does not, with a link to the sibling that does cover it.
5. **Keep idiomatic code; kill duplicated prose.** Repeating the per-tool CDP-connect
   snippet across integration articles is correct (the API differs per tool). Repeating
   the *same explanatory paragraph* is not — extract a shortcode or link instead.
6. **New content enters as draft.** Front matter `status: "draft"` + `draft: true`.
   Publication is a deliberate `draft: false` flip (see "Publication model" below).

---

## Publication model (important)

Zola/Ansorum gate publication on the **`draft:`** field, not `status:`.

- `draft: true`  → excluded from production builds (HTML, `page.md`, JSON-LD, retrieval).
- `draft: false` → published.
- `status:` is descriptive and is kept consistent with `draft:` by tooling.

To actually publish the 32 existing editorial drafts (and any new article), flip
`draft: true` → `draft: false` (and `status:` → `"published"`). This is a deliberate,
outward-facing action — confirm before doing it broadly.

---

## P0 — must ship (Launch Week v3 + changelog #033, zero coverage today)

### Articles

- [ ] **Stealth Browser vs Vanilla Chromium: Anti-Detection for Browser Agents**
  — `comparison` — LW v3 Day 1 (Jun 22). Steel's own Chromium fork, fingerprint work moved
  into the browser source. *(draft written this pass: `articles/stealth-browser-vs-vanilla-chromium.md`)*
- [ ] **Steel Pricing Explained: Launch, Scale, and Enterprise Tiers**
  — `reference` — LW v3 Day 5 (Jun 26). Metered pricing, three tiers. Highest commercial intent.
- [ ] **Steel Billing, Metered Usage, and the Real-Time Spend Dashboard**
  — `reference` — changelog #033 (Jul 10). Console metered-usage/balance/concurrency/scrape-cost.
- [ ] **Dedicated IPs for Browser Agents: Solving the Impossible-Travel Problem**
  — `reference` — LW v3 Day 2 (Jun 23). Stable egress IP per session/profile ($5/IP/mo, up to 25).
- [ ] **Driving Steel From Go** — `reference` — LW v3 Day 3. Official typed Go SDK. *(split from combined Rust+Go)*
- [ ] **Driving Steel From Rust** — `reference` — LW v3 Day 3. Official typed Rust SDK. *(split from combined Rust+Go)*
- [ ] **Atlas: A Self-Hostable Deep-Research Harness on Steel**
  — `concept` — LW v3 Day 4 (Jun 25). Open-sourced `@steel-dev/atlas`, DRACO-evaluated.
- [ ] **How Steel's Browser Agent Leaderboards Rank Computer-Use Models**
  — `reference` — changelog #033. OSWorld 2.0 + partial-score re-ranking; WebChallenger/WebArena/Mind2Web/HealthAdminBench methodology.
- [ ] **The Steel Scrape API: One-Call, LLM-Ready Web Scraping**
  — `reference` — `/v1/scrape` (Markdown + Readability + JSON-LD + screenshot/PDF); scrape cost now in billing. Competes with Firecrawl/Jina (neither named anywhere today).

### Glossary terms

- [x] **Stealth Browser** — the Chromium-fork product. *(written this pass: `glossary/stealth-browser.md`)*
- [ ] **Dedicated IP** — stable network identity; distinct from `Proxies` (rotation).
- [ ] **Metered usage** — the consumption billing model (browser hours, proxy GB, captcha solves, /scrape).
- [ ] **Concurrency limits** — the per-plan session caps that are the primary plan differentiator.
- [ ] **Scrape cost** — the /scrape billing meter surfaced in changelog #033.

---

## P1 — should ship

### Onboarding & commercial (the biggest structural hole)
- [ ] Getting Started with Steel: Your First Cloud Browser Session — `concept` — the missing quickstart; becomes the canonical lifecycle reference.
- [ ] Estimating Steel Costs: Calculating Spend for Real Agent Workloads — `reference` — the ROI/calculator piece.
- [ ] Bring Your Own Proxy: Routing Steel Through Your Proxy Provider — `reference` — BYOP works on every plan incl. free.

### Agent-framework integrations (all have first-party Steel docs, none have articles)
- [ ] Connecting Claude Code, Cursor, and Codex to Steel — coding-agent/editor wiring.
- [ ] Steel Skills: Giving Coding Agents a Cloud Browser — the skills catalog.
- [ ] Claude Agent SDK with Steel
- [ ] OpenAI Agents SDK with Steel
- [ ] Vercel AI SDK with Steel
- [ ] LangGraph with Steel
- [ ] CrewAI with Steel
- [ ] Building an MCP Server on Top of Steel
- [ ] Running Steel Browser Jobs in Durable Workflows (Temporal / Trigger.dev / Restate / Convex)

### Comparisons & migrations (new competitors undefended; no migration guides exist)
- [ ] Migrate Browserbase to Steel — Browserbase's Jun-30 "Agents GA + Director" shift is the trigger.
- [ ] Hyperbrowser vs Steel — closest category match ("Web Infra for AI Agents").
- [ ] Vercel agent-browser vs Steel — Rust CLI, ~38k stars.
- [ ] obscura vs Steel — Rust antidetect headless browser, ~19k stars.
- [ ] Steel vs Apify — cloud browsers vs a scraping/automation platform.
- [ ] Steel Scrape API vs Firecrawl, Jina Reader, and Markdown Scraping APIs

### Vertical playbooks (only healthcare + public-records exist today)
- [ ] Browser Automation for Fintech and Banking
- [ ] Browser Automation for Travel and Booking
- [ ] Browser Automation for E-Commerce Price Monitoring
- [ ] Browser Automation for Social Media and LinkedIn
- [ ] Browser Automation for Recruiting and Job Boards
- [ ] Browser Automation for Real Estate and Property Listings

### Emerging / supporting
- [ ] Browser Fingerprinting for Automation: How Sites Detect Bots — foundational; underpins Stealth Browser.
- [ ] x402 Pay-Per-Use Browsing: Crypto Payments for Browser Agents
- [ ] **Browser fingerprint** (glossary) — most-searched "what is" term in bot detection; absent today.

---

## P2 — nice to have

- [ ] Pydantic AI with Steel
- [ ] Projects and Project-Scoped API Keys in Steel — changelog #029 multi-tenancy.
- [ ] Automating Passkey and WebAuthn Logins with Steel — Playwright 1.61 virtual authenticator; verify it works over CDP to a Steel session first.
- [ ] Self-Hosting Steel at Scale: Clustering and HA — **demoted:** no docs confirm Steel Local supports multi-node HA. Revisit if Steel ships official HA.
- [ ] What Is WebMCP? Browser-Native AI Agents Explained — standardization trend; early-mover value.
- [ ] The 2026 Rust-Rewrite Wave in Browser Agents — thought-leadership; thin evidence.
- [ ] Mastra, Google ADK, and Microsoft Agent Framework with Steel
- [ ] Migrate Browser Use to Steel: From the OSS Agent to Managed Browser Infra
- [ ] Self-Hosted Steel Session Timeouts: Diagnosing the `timeout:0` Daemon Bug
- [ ] **Deep research harness** (glossary) — supporting term for Atlas.

---

## Updates to existing articles (refresh, don't rewrite)

- [ ] **#12 Browser Traces, Replay, and Debugging** — predates the full Agent Traces product. Add: timeline + video-sync, markdown/JSON/ZIP exports, `GET /v1/sessions/{id}/agent-traces`, Console Logs + Network tabs, per-session network capture (changelog #032).
- [ ] **Stealth glossary** — cross-link the new `Stealth Browser` product term; add the changelog #033 CDP input-event stealth layer and Chromium 150 bump. *(partially addressed this pass)*
- [ ] **#37 Stagehand With Steel** — refresh for 2026 Stagehand changes.
- [ ] **#14 Browserbase vs Steel** *(regressed in verification — manual refresh)* — reflect Browserbase's Jun-30 "Agents GA + Director" repositioning (it now sells a managed agent, not just browser infra).
- [ ] **#3 Why Browser Automation Gets Expensive at Scale** *(regressed — manual refresh)* — cross-link the new Pricing / Billing / Cost-Estimation articles; stop telling users to build their own monitoring now that the console surfaces it.

---

## Dropped candidates (verified as not needed — do not write)

These were proposed then cut by adversarial verification. Recorded so we don't re-propose them:

- **Impossible travel (glossary)** — belongs as a section inside the *Dedicated IP* term, not standalone.
- **Diagnosing Anti-Bot Blocks via Session Logs** — triangulated by #42 + #12 + #1; too narrow to stand alone.
- **Update Skyvern vs Steel (#36)** — no Skyvern 2.0 in 2026 (v1.0.46, incremental); #36 still accurate.
- **Which Claude Model Is Best for Browser Automation?** — model lineup rots quarterly; absorb a short note into #17 instead.
- **Session ID / Managed browser (glossary)** — covered by existing Sessions / Cloud Browser terms.

---

## Thematic coverage gaps

1. **Launch Week v3 blackout** — all five flagship launches + changelog #033 surfaces uncovered.
2. **No pricing or ROI content** — tier breakdown, billing dashboard, cost calculator are three distinct commercial gaps.
3. **No start-here quickstart** — every article assumes the reader already creates sessions and connects over CDP.
4. **Missing agent-framework layer** — Claude Agent SDK, OpenAI Agents SDK, Vercel AI SDK, LangGraph, CrewAI, MCP, coding-agent wiring all have docs, none have articles.
5. **No migration guides** — a perennial high-intent format; none exist.
6. **Thin vertical coverage** — fintech/travel/e-commerce/social/recruiting/real-estate all missing.
7. **New competitors undefended** — Hyperbrowser, Vercel agent-browser, obscura, Apify have no comparison pages.
8. **`/scrape` unpositioned** — competes with Firecrawl/Jina but has no article or head-to-head.

---

## New candidates

*(Append freshly-discovered gaps here as they come up. Include a one-line rationale and a source.)*

---

## Handy checks

```bash
# Canonical-question uniqueness (rule 3) — should print each question once
grep -rh '^canonical_questions:' content/ | sort | uniq -d

# Count drafts vs published (publication model)
grep -rh '^draft:' content/ | sort | uniq -c

# Find articles that repeat a given prose block (rule 5 smell test)
grep -rn 'some shared phrase' content/articles/
```
