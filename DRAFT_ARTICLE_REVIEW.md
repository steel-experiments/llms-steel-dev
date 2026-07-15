# Steel.dev Draft Article Review

**Scope:** All `draft: true` articles in `content/articles/` (32 total).  

**Method:** One research agent per article (web-researched fact-check against primary sources: docs.steel.dev, competitor sites, framework docs), each flagged claim adversarially re-verified by an independent agent, then a cross-cutting editorial synthesis. Ground-truth link scan run independently in the main loop.  

**Date:** 2026-07-13.  

**Status:** All 32 `draft` articles reviewed — every claim fact-checked against primary sources (docs.steel.dev, competitor sites, framework docs) and each flagged claim adversarially re-verified, then cross-cutting synthesis. Pricing/product facts independently re-confirmed against Steel's live `llms.txt`, pricing page, and the shipped `steel-sdk` v0.18.0 (2026-07-13). **A global systemic sweep applying these fixes has been applied to all 32 files** (body-only; frontmatter untouched): 32 files changed, +487/−397 lines, zero residual systemic-error hits on re-scan. Two report claims were corrected during application: `profiles.get(id)` is the real SDK method (do **not** change to `retrieve`), and `@steel-dev/cli` is the real npm package.

---


## 0. The one table to fix first — Steel's canonical pricing/limits


**Independently re-verified 2026-07-13** against the live pages (both HTTP 200): `docs.steel.dev/overview/pricinglimits` (page *Last Edit: June 30th, 2026*) and `docs.steel.dev/llms.txt`. Roughly half the drafts use **invented/legacy plan names** (Hobby / Starter / Developer / Pro) and fabricated per-tier numbers. The real tiers are **Launch / Scale / Enterprise**:


**Plan limits**

| Tier | Concurrency | Rate limit | Max session | Retention | Seats |
| --- | --- | --- | --- | --- | --- |
| **Launch** | 10 | 60 RPM | 15 min | 7 days | Up to 3 |
| **Scale** | 100 | 600 RPM | 1 hour | 14 days | Unlimited |
| **Enterprise** | 1,000+ | custom | up to 24 hr | custom | Unlimited |

**Metered rates (verified)**

| Rate | Launch | Scale | Enterprise |
| --- | --- | --- | --- |
| Browser-hour | $0.10/hr | $0.08/hr | custom |
| Proxy bandwidth | $10/GB | $6/GB | custom |
| CAPTCHA solves | $3/1k | $1/1k | custom |
| Browser Tools (`/scrape`, `/screenshot`, `/pdf`) | $5/1k | $5/1k | custom |
| Dedicated IPs | — | $5/IP/mo | custom |

**Credits:** Launch $30 one-time (valid 90 days); Scale $100/month; Enterprise custom. Usage beyond credits bills at the metered rates — **there is no "3x overage/burst" mechanism** (just metered pay-as-you-go).


**Delete everywhere:** `$0.05/hr browser`, the `3x overage/burst` mechanism, `$5/GB proxy`, `$4/1k` CAPTCHA, and **"requests per second"** (Steel's limit is **per minute**, RPM). The unqualified **"24-hour sessions"** claim is **Enterprise-only** (Launch = 15 min, Scale = 1 hr).


**Steel Cloud-only surfaces (Steel Local cannot run these):** Credentials API, Files API, CAPTCHA solving, Stealth Browser, Dedicated IPs, reserved browser pools. Steel Local = concurrency 1. Articles that recommend Steel Local/self-host for compliance or anti-bot must flag this.

---


## 1. Executive summary


The 32-article draft set has strong structure and accurate Steel API surface in roughly half the pieces, but a cluster of systemic factual errors recur across nearly every article and pose the largest threat to credibility — especially because the whole set is explicitly built for LLM/answer-engine citation, which will quote these errors verbatim. Three errors dominate. (1) STALE PRICING/PLAN NAMES: ~13 articles still use the retired Hobby/Starter/Developer/Pro ladder instead of the current Launch($0)/Scale($250)/Enterprise tiers (pricing page last edited 2026-06-30), and many invent concurrency tiers (5/10/20), rate units (requests-per-second 1/2/5/10), retention windows (24h/2d), and a fabricated '3x overage' mechanism. (2) THE 24-HOUR SESSION CEILING IS OVERSTATED as a general capability in ~17 articles; it is Enterprise-only — Launch caps at 15 minutes, Scale at 1 hour, default 5 minutes. This is the single most widespread factual error and will cause real customer failures (sessions killed mid-workflow). (3) NON-RUNNING/WRONG SDK CODE appears in ~12 articles — invented endpoints (agent-logs vs the real agent-traces), wrong field names (session.hlsUrl, session.cdpUrl, session.proxy), wrong constructor options (apiKey vs steelAPIKey), wrong Python casing (persistProfile/releaseAll instead of snake_case), a missing Claude->Steel action translator, and v2 Stagehand code against a v3 SDK. Beyond these, two clusters of competitive/reputational risk stand out: wrong/undisclosed Browserbase benchmark numbers (1.68s vs actual 2.97s) and a false 'rrweb-only' framing (Browserbase now ships video+HLS), and unsupported SOC 2 claims (Steel has none on record). Net: the set is publishable only after a global pricing pass, a 24h-ceiling sweep, a code-correctness pass on the integration articles, and removal/softening of competitor claims.


---


## 2. Cross-cutting themes


### Stale/fabricated pricing tiers and limits (the #1 systemic defect)


Current plans are Launch($0)/Scale($250)/Enterprise — but ~13 articles use retired names Hobby/Starter/Developer/Pro (legacy was Starter/Developer/Startup). Worse, articles invent concurrency tiers (5/10/20/100 — real is 10/100/1000+), rate units (requests-per-SECOND 1/2/5/10 — real is requests-per-MINUTE 60/600/custom), retention windows (24h/2d — real is 7d/14d/custom), browser-hour floors ($0.05 — real is $0.08-0.10), proxy/CAPTCHA prices, and a wholly fabricated '3x overage/burst credits' billing mechanism. The canonical pricing URL is also counterintuitive: /overview/pricinglimits (no hyphen) — /overview/pricing and /overview/pricing-limits both 404.



**Affected:** anti-bot-false-positives-for-legit-automation.md, browser-automation-audit-trails.md, browser-automation-cost-at-scale.md, browser-automation-for-healthcare-portals.md, browser-automation-for-public-records-and-compliance.md, browser-automation-for-rag-data-collection.md, browser-automation-for-security-questionnaires.md, how-to-measure-browser-agent-reliability.md, prompt-injection-and-web-agents.md, scaling-browser-automation-to-hundreds-of-sessions.md, secure-browser-agents-for-enterprise.md, skyvern-vs-steel-vs-rpa.md, browserless-vs-steel.md, browserbase-vs-steel.md, selenium-with-steel.md


### 24-hour session ceiling stated as a general capability


~17 articles promise 'up to 24 hours' / '24h sessions' / '24h runtimes' as a blanket Steel feature. Per the pricing page the max session time is tier-gated: Launch = 15 minutes, Scale = 1 hour, Enterprise = up to 24 hours, with a 5-minute default. Readers on Launch/Scale (the majority) will design around a 24h budget they don't have and hit hard timeouts mid-workflow. The fix is uniform: qualify every 24h mention with the per-tier ceiling.



**Affected:** anti-bot-false-positives-for-legit-automation.md, browser-automation-for-healthcare-portals.md, browser-automation-for-public-records-and-compliance.md, browser-automation-for-rag-data-collection.md, browser-automation-for-security-questionnaires.md, browser-automation-vs-api.md, browserbase-vs-steel.md, browserless-vs-steel.md, browser-use-with-steel.md, claude-computer-use-with-steel.md, gemini-computer-use-with-steel.md, how-to-measure-browser-agent-reliability.md, playwright-scripts-pass-locally-fail-in-cloud.md, prompt-injection-and-web-agents.md, puppeteer-with-steel.md, selenium-with-steel.md, secure-browser-agents-for-enterprise.md, stagehand-with-steel.md, skyvern-vs-steel-vs-rpa.md


### Non-running / wrong SDK code in integration articles


The developer-reference articles ship code that fails on first run: invented endpoint /v1/sessions/{id}/agent-logs and SDK methods agentLogs/sessions.logs.list (real feature: Agent Traces at /v1/sessions/{id}/agent-traces, fetched via REST, no SDK helper); non-existent Session fields (hlsUrl, cdpUrl, proxy, tags, name); wrong constructor option (apiKey vs steelAPIKey); wrong Python casing (persistProfile/releaseAll vs persist_profile/release_all); invalid session_name param; a missing Claude->Steel action translator in the Computer Use loop (forwards Claude's left_click/type directly to Steel, which expects click_mouse/type_text); and v2 Stagehand code (stagehand.page.*) against the current v3 SDK (top-level stagehand.act/extract).



**Affected:** browser-automation-audit-trails.md, browser-traces-replay-and-debugging.md, browser-use-with-steel.md, chrome-extensions-for-browser-agents.md, claude-computer-use-with-steel.md, embed-live-and-past-browser-sessions.md, gemini-computer-use-with-steel.md, how-to-measure-browser-agent-reliability.md, prompt-injection-and-web-agents.md, puppeteer-with-steel.md, selenium-with-steel.md, stagehand-with-steel.md, playwright-scripts-pass-locally-fail-in-cloud.md


### Steel Local / self-host capability gaps undisclosed while recommending self-host


Multiple compliance/enterprise articles recommend self-hosted Steel Browser (Steel Local) for data residency while simultaneously building the recommended pattern on the Credentials API and Files API — both of which are Cloud-only. Steel Local also lacks CAPTCHA solving, multi-region, and is concurrency-1. The result is a self-contradictory architecture: readers who follow the compliance advice will find the pattern's pillars unavailable.



**Affected:** browser-automation-for-healthcare-portals.md, browser-automation-for-public-records-and-compliance.md, browser-automation-for-security-questionnaires.md, prompt-injection-and-web-agents.md, secure-browser-agents-for-enterprise.md, secure-browser-auth-for-agents.md, browserless-vs-steel.md, skyvern-vs-steel-vs-rpa.md, browser-automation-for-rag-data-collection.md


### inactivityTimeout vs timeout conflation


Several articles treat the 5-minute default as an idle/inactivity timer and prescribe heartbeat actions. In reality the 5-minute default is the hard session LIFETIME (timeout); inactivity-based release is a separate, opt-in parameter (inactivityTimeout, off by default). Heartbeats are only useful if inactivityTimeout is set. Steel itself published a blog post (2026-06-02) explaining exactly this distinction.



**Affected:** browser-traces-replay-and-debugging.md, prompt-injection-and-web-agents.md, puppeteer-with-steel.md, secure-browser-agents-for-enterprise.md, secure-browser-auth-for-agents.md, browser-automation-cost-at-scale.md


### Competitor capability understating / benchmark staleness


Comparison pieces misrepresent competitors in easily-disprovable ways: Browserbase framed as 'rrweb-only' (it now ships video + HLS + Session Inspector; rrweb is deprecated); Browserbase lifecycle numbers stated as 1.68s/1.87s when Steel's own repo shows 2.97s/3.89s; the 'Steel leads' headline contradicted by Steel's own Jan-2026 re-run showing Kernel faster; an unverifiable 'Smooth' vendor with parked-domain claims; Cloudflare 'Browser Rendering' (renamed 'Browser Run'); and Skyvern framed as 'needing Steel for observability' when Skyvern Cloud ships its own audit trail.



**Affected:** browser-infrastructure-for-ai-agents-compared.md, browserbase-vs-steel.md, browserless-vs-steel.md, skyvern-vs-steel-vs-rpa.md


### Unsupported SOC 2 compliance claim


Multiple articles assert Steel Cloud offers 'SOC 2' as a parity counter to Browserbase. Steel's docs/legal/pricing contain zero SOC 2 mentions; steel.dev/security, /trust, /compliance all 404. Steel does advertise HIPAA-ready BAA and Enterprise SSO on Scale/Enterprise. Asserting a certification the vendor has not published is a procurement/legal liability.



**Affected:** browserbase-vs-steel.md, browserless-vs-steel.md, selenium-with-steel.md, secure-browser-agents-for-enterprise.md


### Profiles 'persist auth 30 days' misread


The 30-day figure is the inactivity-auto-deletion threshold, not a maximum persistence window. Profiles persist auth indefinitely as long as used within each 30-day window (300MB cap). The misread understates the feature and implies auth expires.



**Affected:** browser-infrastructure-for-ai-agents-compared.md, browserless-vs-steel.md


### Missing outbound links to primary sources


Several answer-engine-targeted articles have zero external links to docs.steel.dev (or only internal glossary links), undermining citability and E-E-A-T signals. Every plan-sensitive and API claim should link its canonical primary source.



**Affected:** playwright-scripts-pass-locally-fail-in-cloud.md, mobile-mode-for-browser-automation.md, prompt-injection-and-web-agents.md, stagehand-with-steel.md, browser-use-with-steel.md


### Broken external links and the malformed benchmark URL


A recurring malformed URL-encoded relative path '../20-29%20Content/20%20Articles/remote-browser-benchmark.md' (pointing to a non-existent directory) appears in Next-steps CTAs. Plus a 404 on docs.steel.dev/integrations/browser-use/quickstart (correct: /integrations/browser-use) and integration-vs-cookbook URL confusion in the Computer Use articles.



**Affected:** browserbase-vs-steel.md, skyvern-vs-steel-vs-rpa.md, browser-use-with-steel.md, claude-computer-use-with-steel.md


---


## 3. Global prioritized fixes


**[BLOCKER] Global pricing-tier sweep: rename every Hobby/Starter/Developer/Pro reference to Launch/Scale/Enterprise. Concurrent sessions = 10/100/1,000+. Rate limits = requests-per-MINUTE 60/600/custom (NOT per-second). Retention = 7d/14d/custom. Max session time = 15min/1hr/24hr. Browser hours $0.10/$0.08. Proxy $10/$6 per GB. CAPTCHA $3/$1 per 1k. Cite /overview/pricinglimits (no hyphen) once per article.


*Applies to:* anti-bot-false-positives-for-legit-automation.md, browser-automation-audit-trails.md, browser-automation-cost-at-scale.md, browser-automation-for-healthcare-portals.md, browser-automation-for-public-records-and-compliance.md, browser-automation-for-rag-data-collection.md, browser-automation-for-security-questionnaires.md, how-to-measure-browser-agent-reliability.md, prompt-injection-and-web-agents.md, scaling-browser-automation-to-hundreds-of-sessions.md, secure-browser-agents-for-enterprise.md, skyvern-vs-steel-vs-rpa.md, browserless-vs-steel.md, browserbase-vs-steel.md, selenium-with-steel.md


*Why:* Every concrete plan/price/limit figure is currently wrong in ~13 articles. This is the highest-volume credibility defect and the easiest to falsify against steel.dev.



**[BLOCKER] Qualify every '24 hour(s)' session-lifetime mention as Enterprise-only (Launch 15 min, Scale 1 hr, default 5 min). Add the per-tier ceiling on first occurrence in each article.


*Applies to:* anti-bot-false-positives-for-legit-automation.md, browser-automation-for-healthcare-portals.md, browser-automation-for-public-records-and-compliance.md, browser-automation-for-rag-data-collection.md, browser-automation-for-security-questionnaires.md, browser-automation-vs-api.md, browserbase-vs-steel.md, browserless-vs-steel.md, browser-use-with-steel.md, claude-computer-use-with-steel.md, gemini-computer-use-with-steel.md, how-to-measure-browser-agent-reliability.md, playwright-scripts-pass-locally-fail-in-cloud.md, prompt-injection-and-web-agents.md, puppeteer-with-steel.md, selenium-with-steel.md, secure-browser-agents-for-enterprise.md, stagehand-with-steel.md, skyvern-vs-steel-vs-rpa.md


*Why:* Most widespread factual error (~17 articles). Unqualified 24h promises will cause real Launch/Scale sessions to die mid-workflow and generate support tickets.



**[BLOCKER] Rename the API/feature to 'Agent Traces' everywhere; replace endpoint /v1/sessions/{id}/agent-logs with /v1/sessions/{id}/agent-traces; remove nonexistent SDK methods (client.sessions.agentLogs, sessions.logs.list) and note traces are REST-only (no SDK helper yet), returning a browser-activity timeline (click/input/navigate/scroll/drag/error), not prompts or DOM diffs.


*Applies to:* browser-automation-audit-trails.md, how-to-measure-browser-agent-reliability.md, prompt-injection-and-web-agents.md, claude-computer-use-with-steel.md, gemini-computer-use-with-steel.md


*Why:* Wrong endpoint path 404s; the docs nav is literally titled 'Agent Traces'.



**[BLOCKER] SDK code-correctness pass across integration articles: fix constructor option (apiKey -> steelAPIKey); use session.websocketUrl not session.cdpUrl; use session.sessionViewerUrl for replay (drop nonexistent session.hlsUrl — HLS is REST-only); drop nonexistent params (tags, name/session_name); fix Python casing (persist_profile, release_all); fix session.create option to timeout (ms) not sessionTimeout; remove headless:false flag; fix client.extensions.list() to read .extensions; add the missing Claude->Steel action translator.


*Applies to:* how-to-measure-browser-agent-reliability.md, puppeteer-with-steel.md, selenium-with-steel.md, stagehand-with-steel.md, claude-computer-use-with-steel.md, gemini-computer-use-with-steel.md, browser-automation-audit-trails.md, browser-traces-replay-and-debugging.md, chrome-extensions-for-browser-agents.md, embed-live-and-past-browser-sessions.md, playwright-scripts-pass-locally-fail-in-cloud.md


*Why:* Copy-paste code in reference articles must compile/run; currently many samples throw on first call.



**[BLOCKER] Delete the fabricated '3x overage' / 'burst credits' billing mechanism and the invented concurrency tiers (5/20) and per-second rate caps. Replace with: metered usage at plan rates once credits are spent; optional auto top-up so a run does not stop; concurrency 10/100/1,000+.


*Applies to:* browser-automation-cost-at-scale.md, scaling-browser-automation-to-hundreds-of-sessions.md


*Why:* Fabricated product capability with direct billing implications.



**[BLOCKER] Correct the Browserbase lifecycle numbers (1.68s/1.87s -> 2.97s/3.89s from Steel's own repo), drop the false 'rrweb-only' framing (Browserbase ships video + HLS + Session Inspector), reframe Steel's genuine differentiator as Agent Traces + downloadable artifact bundle + self-host, and label all benchmark figures as Steel self-reported with the Browserbase ~3s throttle disclosed.


*Applies to:* browser-infrastructure-for-ai-agents-compared.md, browserbase-vs-steel.md, browserless-vs-steel.md


*Why:* Competitor performance numbers that contradict Steel's own published source are the highest legal/reputational risk in comparison pieces.



**[HIGH] Remove the unverifiable 'Smooth' vendor from the 5-way comparison (parked domain, no working product), rename 'Cloudflare Browser Rendering' to 'Cloudflare Browser Run (formerly Browser Rendering)', and reframe the Steel-vs-Skyvern relationship from 'Skyvern needs Steel' to 'Skyvern is an opinionated planner with its own audit trail; Steel is neutral CDP infrastructure.'


*Applies to:* browser-infrastructure-for-ai-agents-compared.md, skyvern-vs-steel-vs-rpa.md


*Why:* Unverified competitor marketing and stale competitor naming signal dated research.



**[HIGH] Remove or substantiate the SOC 2 claim; replace with Steel's documented compliance posture (HIPAA-ready BAA and Enterprise SSO on Scale/Enterprise).


*Applies to:* browserbase-vs-steel.md, browserless-vs-steel.md, selenium-with-steel.md, secure-browser-agents-for-enterprise.md


*Why:* Asserting a certification Steel has not published is a procurement liability.



**[HIGH] Caveat every self-host/Steel Local recommendation: Credentials API, Files API, CAPTCHA solving, multi-region, and managed stealth are Cloud-only; Steel Local is concurrency-1. Make explicit that the compliance patterns built on Credentials + Files are Steel Cloud patterns.


*Applies to:* browser-automation-for-healthcare-portals.md, browser-automation-for-public-records-and-compliance.md, browser-automation-for-security-questionnaires.md, prompt-injection-and-web-agents.md, secure-browser-agents-for-enterprise.md, secure-browser-auth-for-agents.md, browser-automation-for-rag-data-collection.md


*Why:* Currently several articles recommend self-host for compliance while building the pattern on APIs self-host cannot provide.



**[HIGH] Distinguish timeout (hard 5-min default lifetime) from inactivityTimeout (opt-in idle release, off by default); replace heartbeat advice with 'set timeout for longer runs; set inactivityTimeout only if you want idle release'.


*Applies to:* browser-traces-replay-and-debugging.md, prompt-injection-and-web-agents.md, puppeteer-with-steel.md, secure-browser-agents-for-enterprise.md, secure-browser-auth-for-agents.md, browser-automation-cost-at-scale.md


*Why:* Inverts Steel's actual default behavior; Steel published a 2026-06-02 blog post explaining this exact distinction.



**[HIGH] Remove the unsourced named-customer metrics (Chronicle Legal 100k sessions/mo, Benny 40% lift, Credal 6M URLs/mo, Stack AI/Zapier customer implication) or replace with a defensible unattributed capability statement, unless a linkable primary source + customer consent exists.


*Applies to:* browser-automation-for-public-records-and-compliance.md, browser-automation-for-rag-data-collection.md


*Why:* Unsourced customer attributions are the largest legal/reputational risk outside the comparison pieces.



**[HIGH] Fix the malformed benchmark link '../20-29%20Content/20%20Articles/remote-browser-benchmark.md' -> https://steel.dev/blog/remote-browser-benchmark; fix /integrations/browser-use/quickstart (404) -> /integrations/browser-use; fix the CLI skill-install command npx skills add steel-dev/cli -> steel-dev/skills; replace deprecated npm install with the curl installer (curl -LsSf https://setup.steel.dev | sh).


*Applies to:* browserbase-vs-steel.md, skyvern-vs-steel-vs-rpa.md, browser-use-with-steel.md, steel-cli-for-browser-workflows.md, claude-computer-use-with-steel.md


*Why:* Dead/broken CTAs and wrong install commands in the implementation path.



**[MEDIUM] Soften or source the 'sub-second startup' claim: Steel's homepage FAQ does state 'under one second on average with no cold-start penalty' (same region), so the claim is defensible if labeled 'Steel-reported, in-region, on average' — but should not be stated as an unconditional fact.


*Applies to:* browser-use-with-steel.md, claude-computer-use-with-steel.md, gemini-computer-use-with-steel.md, browser-automation-vs-api.md, playwright-scripts-pass-locally-fail-in-cloud.md, puppeteer-with-steel.md, selenium-with-steel.md, secure-browser-agents-for-enterprise.md, steel-cli-for-browser-workflows.md, stagehand-with-steel.md


*Why:* Verdict is mixed — it IS on steel.dev — but it reads as marketing without the qualifier and docs.steel.dev states no startup benchmark.



**[MEDIUM] Rewrite Stagehand code samples against v3 (top-level stagehand.act/extract/observe; page = stagehand.context.pages()[0]; model:{modelName,apiKey} multi-provider), the Computer Use tool version to computer_20251124/computer-use-2025-11-24 with a current model, and the Gemini model to gemini-3-flash-preview; note these are versioned and will drift again.


*Applies to:* stagehand-with-steel.md, claude-computer-use-with-steel.md, gemini-computer-use-with-steel.md


*Why:* Stale-but-still-functional vs genuinely-broken distinction; all three integration articles target superseded SDK/model versions.



**[MEDIUM] Add outbound links to primary docs (pricinglimits, session-lifecycle, agent-traces, the relevant integration/cookbook page) on first mention of any plan-sensitive or API claim; at minimum one link per substantive section.


*Applies to:* playwright-scripts-pass-locally-fail-in-cloud.md, mobile-mode-for-browser-automation.md, prompt-injection-and-web-agents.md, stagehand-with-steel.md, steel-cli-for-browser-workflows.md


*Why:* Answer-engine citability is the stated goal of the set; zero outbound links is the biggest SEO/citability miss.



**[MEDIUM] Soften the 'Stealth Browser is generally available' framing: the dedicated Stealth Browser product is Enterprise-only (shown as '-' on Launch/Scale); CAPTCHA solving and proxies are metered on all paid plans; session-level stealthConfig exists on any plan.


*Applies to:* browserless-vs-steel.md, skyvern-vs-steel-vs-rpa.md


*Why:* Tier-gating of a headline anti-bot capability.



**[MEDIUM] Correct the Profiles persistence framing: 30 days is the inactivity-auto-deletion threshold, not a max persistence window; auth persists indefinitely as long as the profile is used (300MB cap).


*Applies to:* browser-infrastructure-for-ai-agents-compared.md, browserless-vs-steel.md


*Why:* Misstates a product behavior buyers evaluate for auth reuse.



**[MEDIUM] Fix region codes: drop 'us-east' (not a Steel region) and reconcile the article's lax/ord/iad claims with the public multi-region docs (which list only lax and iad today; the SDK accepts more as legacy aliases). Note Steel-managed proxies still egress US.


*Applies to:* browser-use-with-steel.md, multi-region-browser-sessions.md


*Why:* Invalid region values in copy-paste code; docs-vs-SDK contradiction on the region list.



**[LOW] Fix minor technical inaccuracies: Playwright has no page.swipe() (use mouse move/down/up); rrweb DOES capture cursors (real gaps are canvas/WebGL/video/cross-origin iframes); 'Quick Actions' should be 'Browser Tools (/scrape,/screenshot,/pdf)'; the Willison 'lethal trifecta' paraphrase and link.


*Applies to:* mobile-mode-for-browser-automation.md, embed-live-and-past-browser-sessions.md, browser-traces-replay-and-debugging.md, skyvern-vs-steel-vs-rpa.md, prompt-injection-and-web-agents.md, stagehand-with-steel.md, selenium-with-steel.md


*Why:* Knowledgeable readers/competitors will catch these; small but erode authority.



---


## 4. Competitor & compliance claim risks (verify or remove before publish)


- **Claim:** Browserbase lifecycle benchmark p95 around 1.87s (and avg 1.68s), implying ~13 minutes saved per 1,000 sessions

  **Article:** browserbase-vs-steel.md

  **Risk:** Directly contradicts Steel's own published repo (browserbase.jsonl): Browserbase averages 2.97s with a 3.89s p95 — roughly double the stated figures. The benchmark README also discloses Browserbase is throttled to a ~3s floor to avoid rate-limiting, a caveat the article omits. Easily disproven in one click; competitor-disputable.

  **Recommendation:** Replace with 2.97s avg / 3.89s p95, recompute savings (~34-35 min/1,000), and add a one-line disclosure: 'Steel-authored benchmark; Browserbase throttled to a ~3s floor; Kernel measures faster than Steel in the same harness.'


- **Claim:** Browserbase relies on rrweb-only captures / rrweb-based replays (presented as Steel's observability differentiator)

  **Article:** browser-infrastructure-for-ai-agents-compared.md

  **Risk:** Stale and false. Browserbase's docs state 'rrweb is being deprecated' and that every session is recorded as video with an HLS Session Replay API (.m3u8) and Session Inspector — the same MP4/HLS format the article presents as Steel's differentiator. A competitor can document this trivially.

  **Recommendation:** Replace the rrweb framing everywhere; reframe Steel's real differentiator as Agent Traces (structured timeline) + downloadable markdown/JSON/ZIP bundle + self-host option.


- **Claim:** Steel leads the measurable side / 'independent benchmarks' show Steel fastest

  **Article:** browser-infrastructure-for-ai-agents-compared.md

  **Risk:** Steel's own browserbench repo (Jan-2026 re-run) shows Kernel faster end-to-end (794ms avg vs Steel's 894ms). The article invites readers to run the open harness, which surfaces the contradiction. 'Independent' mislabels a Steel-authored benchmark.

  **Recommendation:** Date the claim ('Steel measured fastest in the Nov-2025 benchmark; the open harness has since been re-run with Kernel ahead'), relabel as 'Steel's open benchmark', and add a self-disclosure line.


- **Claim:** Smooth markets itself as a 5x faster, 7x cheaper browser agent API

  **Article:** browser-infrastructure-for-ai-agents-compared.md

  **Risk:** Unverifiable vendor: smoothbrowser.com is a ~114-byte parked/Afternic shell, smooth.dev does not resolve, no working product/docs/API, and the 5x/7x claims have no source. Listing it lends unverified marketing credibility by association.

  **Recommendation:** Drop Smooth from the named-vendor table; refer generically to 'emerging low-cost providers' or replace the 5-way comparison with a 4-way one (Steel/Browserbase/Kernel/Browserless).


- **Claim:** Skyvern 'needs Steel for lifecycle management, live viewer, agent logs, and release discipline' / 'depends on Steel or similar infra for long sessions and observability'

  **Article:** skyvern-vs-steel-vs-rpa.md

  **Risk:** Directly contradicted by Skyvern's own pricing page (verified July 2026): Skyvern Cloud ships native CAPTCHA solving, proxy networks with geo-targeting, 2FA/TOTP handling, and a 'full audit trail' / 'full observability' per run, and is self-hostable. Asserting a competitor lacks capabilities it publicly sells is the most reputationally sensitive class of comparison claim.

  **Recommendation:** Reframe to Steel's genuine edge: framework-agnostic CDP infrastructure + measurable cold-start lifecycle + neutral SDK support, not planner-plus-infra bundling. Keep the legitimate point that Skyvern is Playwright-opinionated where Steel is neutral.


- **Claim:** Cloudflare 'Browser Rendering' (as the current product name)

  **Article:** browser-infrastructure-for-ai-agents-compared.md

  **Risk:** Stale competitor naming. Cloudflare renamed it 'Browser Run, formerly known as Browser Rendering.' Signals dated research.

  **Recommendation:** Use 'Cloudflare Browser Run (formerly Browser Rendering)' on first mention.


- **Claim:** Steel Cloud offers SOC 2 (as a parity counter to Browserbase's SOC 2 Type II)

  **Article:** browserbase-vs-steel.md

  **Risk:** Zero mention of SOC 2 anywhere in Steel's docs, legal page, pricing, homepage, or blog; steel.dev/security, /trust, /compliance all 404. Steel advertises only HIPAA-ready BAA and Enterprise SSO. Asserting a certification a vendor has not published is a procurement liability.

  **Recommendation:** Drop the SOC 2 claim; replace with Steel's documented posture (HIPAA-ready BAA, Enterprise SSO, open-source auditable runtime) and confirm with Steel before restoring.


- **Claim:** Chronicle Legal runs >100,000 government-portal sessions/month on Steel; Benny saw a 40% lift in successful government benefit lookups

  **Article:** browser-automation-for-public-records-and-compliance.md

  **Risk:** Unsourced and unverifiable named-customer metrics. The figures appear nowhere in the repo, the steel.dev homepage, the 915KB llms-full.txt corpus, or any customer/case-study page (both 404). For a legal/compliance audience and answer-engine ranking, this is a legal/reputational risk.

  **Recommendation:** Either add a public, linkable case study + written consent, or soften to an unattributed capability statement ('teams in legal-tech now run six-figure monthly government-portal session volumes on Steel').


- **Claim:** Credal processes >6 million URLs/month; Stack AI and Zapier 'learned the hard way' (implying they are Steel customers)

  **Article:** browser-automation-for-rag-data-collection.md

  **Risk:** Unsourced and unverifiable. The 6M figure does not appear on Credal's site or in Steel's docs; Stack AI's site mentions no Steel integration; Zapier appears in the corpus only as a Browserless integration partner. Inverts the customer relationship.

  **Recommendation:** Remove the named-customer attributions; replace with a general statement about the volume/difficulty of enterprise KB ingestion. Only restore a named example with a verifiable primary source.


---


## 5. Per-article findings


### anti-bot-false-positives-for-legit-automation — readiness 7/10


**Title:** How to Reduce Anti-Bot False Positives for Legit Automation


**Priority issues**
- (HIGH) The article references a 'Hobby-tier' (line 63). Steel has no current 'Hobby' tier. The canonical pricing page (last edited 2026-06-30) lists three tiers: Launch (free, $0+usage), Scale ($250+usage), and Enterprise (custom). Legacy plans were Starter/Developer/Startup. 'Hobby' survives only on stale Steel doc pages (proxies, dedicated-IPs) that predate the rename to Launch.
  → *Fix:* Replace 'so build manual procedures for Hobby-tier runs or custom enterprise blockers.' with 'so build manual fallbacks for unfunded Launch runs or custom enterprise blockers.'
- (HIGH) Line 63 claims 'CAPTCHA solving ships on paid plans only.' That is imprecise. Per the current pricing page, CAPTCHA solving IS available on the free Launch plan after a one-time $10 account-verification deposit (free credits do not count); it is included on Scale and Enterprise. Launch is a $0+usage tier, so 'paid plans only' is misleading.
  → *Fix:* Replace '[CAPTCHA solving](@/glossary/captcha-solving.md) ships on paid plans only' with '[CAPTCHA solving](@/glossary/captcha-solving.md) requires a funded workspace: on the Launch plan, verify your account with a $10 balance deposit to unlock it (free credits do not count); it is included on Scale and Enterprise.'
- (HIGH) The article states 'Steel sessions run up to 24 hours' twice (lines 44 and 59) without qualification. The 24-hour ceiling is Enterprise-only. Verified per-tier maxima: Launch = 15 minutes, Scale = 1 hour, Enterprise = up to 24 hours.
  → *Fix:* Line 44: change 'Steel sessions run up to 24 hours with profile persistence' to 'Steel sessions run up to your plan ceiling (15 min Launch, 1 hr Scale, 24 hr Enterprise) with profile persistence'. Line 59: change 'Steel sessions run up to 24 hours' to 'Steel sessions run up to your plan ceiling (15 min Launch, 1 hr Scale, 24 hr Enterprise)'.
- (LOW) Symptom-map cell (line 42) says managed residential proxies 'retry when tunnels fail.' Steel rotates a fresh IP per session, but per Steel's own cookbook docs the user is responsible for exponential backoff and retry on transient tunnel errors (e.g. ERR_TUNNEL_CONNECTION_FAILED). This cell slightly overstates Steel's automation and is in tension with the correct guidance later on line 51.
  → *Fix:* Change 'Managed residential proxies rotate per session and retry when tunnels fail' to 'Managed residential proxies rotate per session; your code still owns backoff and retries on transient tunnel errors'.
- (LOW) The 'add 80 to 200 millisecond pauses' heuristic (line 59) is presented as specific advice with no source.
  → *Fix:* Soften to 'add short randomized pauses (e.g. 80-200 ms between steps)' or drop the exact range in favor of 'bounded randomized pauses between actions'.


**Claim checks** (verified verdict shown)
- [ACCURATE] · steel-product · Enable useProxy: true with country level targeting ... can auto solve ReCAPTCHA, Turnstile, AWS WAF when solveCaptcha: true
  src: https://docs.steel.dev/overview/stealth/proxies · https://docs.steel.dev/overview/stealth/captcha-solving
- [ACCURATE] · steel-product · When you create a Steel session with solveCaptcha: true, the platform automatically detects ReCAPTCHA v2 or v3, Cloudflare Turnstile, ImageToText puzzles, and AWS WAF flows, then routes them through the right solver.
  src: https://docs.steel.dev/overview/stealth/captcha-solving
- [ACCURATE] · steel-product · call the solve endpoint with a specific taskId, URL, or pageId
  src: https://docs.steel.dev/overview/stealth/captcha-solving
- [NEEDS-SOFTENING] · steel-product · Steel sessions run up to 24 hours  *(adversarially verified)*
  → Replace BOTH occurrences. LINE 44 (symptom map, Steel fit cell): change "Steel sessions run up to 24 hours with profile persistence so you look like the same trusted user" to "Steel sessions persist profiles so you look like the same trusted user (max session time is 15 min on Launch, 1 hour on Scale, up to 24 hours on Enterprise)". LINE 59 (Section 3): change "Steel sessions run up to 24 hours, and profiles can store 300 MB of cookies, extensions, and settings," to "Steel sessions last up to 15 minutes on Launch, 1 hour on Scale, and up to 24 hours on Enterprise, and profiles can store 300 MB of cookies, extensions, and settings,"
  src: https://docs.steel.dev/overview/pricinglimits · https://steel.dev/pricing
- [ACCURATE] · steel-product · profiles can store 300 MB of cookies, extensions, and settings
  src: https://docs.steel.dev/overview/profiles-api/overview · https://docs.steel.dev/overview/llms-full.txt
- [CONFIRMED-INACCURATE] · steel-pricing · CAPTCHA solving ships on paid plans only, so build manual procedures for Hobby-tier runs  *(adversarially verified)*
  → Replace: "[CAPTCHA solving](@/glossary/captcha-solving.md) ships on paid plans only, so build manual procedures for Hobby-tier runs or custom enterprise blockers." With: "[CAPTCHA solving](@/glossary/captcha-solving.md) is available on every plan, including the free Launch tier after a one-time $10 balance verification (free credits don't count), so reserve manual fallback procedures for custom enterprise blockers the auto-solver doesn't cover." This corrects the bogus "Hobby" tier name to Launch and the false "paid plans only" framing while preserving the valid manual-fallback guidance.
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/overview/stealth/captcha-solving
- [ACCURATE] · steel-product · you inherit hundreds of millions of monitored IPs
  src: https://docs.steel.dev/overview/stealth/proxies
- [ACCURATE] · steel-product · Broader regions mean healthier pools.
  src: https://docs.steel.dev/overview/stealth/proxies
- [ACCURATE] · steel-product · Steel Local is still useful for low-risk dev loops where datacenter IPs are fine / Steel Local ... only need a consistent API surface inside your own VPC
  → Consider adding that Steel Local has NO CAPTCHA solving and limited stealth, so it is not where you test the anti-bot fixes this article describes.
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud
- [ACCURATE] · technical · The moment you override a native function, Function.toString exposes the patch and fingerprint scripts flag you faster.
  src: https://docs.steel.dev/overview/stealth/captcha-solving
- [ACCURATE] · steel-product · Steel records live and replay artifacts plus CAPTCHA status endpoints for targeted solves
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions · https://docs.steel.dev/overview/captchas-api/overview


**Top improvements**
- (HIGH) Add a small plan-limits reference (concurrency 10/100/1000+, RPM 60/600/custom, retention 7/14/custom, session ceiling 15min/1hr/24hr). Anti-bot work is rate-sensitive, and readers scaling past 10 concurrent sessions or 60 RPM will hit walls the article currently does not mention. — Concurrency/RPS caps directly cause the soft blocks and retries the article is trying to help readers avoid, yet no ceiling is stated anywhere.
- (HIGH) Caveat the Steel Local recommendation (lines 35, 67) with the fact that Steel Local has no CAPTCHA solving, limited stealth, and BYO-proxy only. In an article about anti-bot false positives, recommending Local without that caveat undersells why Cloud is needed to test the fixes described. — Steel's own Local-vs-Cloud matrix shows Local lacks every anti-bot capability the article teaches readers to use.
- (MEDIUM) Reconcile the symptom-map cell 'retry when tunnels fail' with the later (correct) guidance that the user owns backoff. Currently line 42 implies Steel retries and line 51 says the user must - pick one. — Internal contradiction within the same article about which layer owns retry logic.


**Supporting material to add**
- Steel's per-tier ceilings (verified 2026-06-30): concurrent sessions 10/100/1,000+; requests per minute 60/600/custom; max session time 15 min/1 hr/24 hr; data retention 7/14/custom days; captcha solves $3/$1 per 1k; proxy bandwidth $10/$6 per GB; browser hours $0.10/$0.08 per hr.  _[where: A short 'Plan limits to plan around' callout near 'When Steel fits' (after line 67), so readers scaling anti-bot fixes know the hard ceilings before architecting.]_  (https://docs.steel.dev/overview/pricinglimits)
- Steel's own 'Prevention First' two-pronged CAPTCHA model: realistic browser profiles reduce challenge frequency before any solving happens, then auto-solving handles the remainder.  _[where: Opening of Section 4 (line 62) to frame why stealth + pacing earlier in the article reduce the solving load.]_  (https://docs.steel.dev/overview/stealth/captcha-solving)
- Steel's 'impossible traveler' framing from the Dedicated IPs page: auth and anti-bot systems flag the same account appearing from unrelated networks too quickly, then invalidate saved auth or add extra verification - which is exactly the false-positive this article is about.  _[where: Section 1 (line 47-51) to give the network-signal thesis a named, citable mechanism.]_  (https://docs.steel.dev/overview/sessions-api/dedicated-ips)
- Concrete CAPTCHA status response shape: per-page isSolvingCaptcha plus per-task statuses detected / solving / solved / failed_to_solve, used to drive targeted retries.  _[where: Section 4 alongside the existing solve-endpoint sentence (line 63) so developers know what fields to instrument.]_  (https://docs.steel.dev/overview/captchas-api/overview)
- Steel Local vs Cloud capability matrix (Local: concurrency 1, no CAPTCHA solving, limited stealth, BYO-proxy only, no Credentials/Files; Cloud: 100+, full stealth, CAPTCHA, managed+BYO proxies).  _[where: Line 35 and line 67 where Steel Local is recommended, to caveat that Local cannot exercise the anti-bot features this article teaches.]_  (https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud)


**Broken / malformed links**
- `[Steel Cloud](@/glossary/steel-cloud.md), [proxies](@/glossary/proxies.md), [CAPTCHA solving](@/glossary/captcha-solving.md)` — All three internal glossary links resolve correctly. No broken internal links found.
- `https://docs.steel.dev/overview/stealth/proxies` — Returns HTTP 200 and supports the article's proxy claims (useProxy, hundreds of millions of IPs, country targeting).
- `https://docs.steel.dev/overview/stealth/captcha-solving` — Returns HTTP 200 and supports the article's CAPTCHA-type list including AWS WAF.
- `n/a - advisory` — The article does NOT currently link to the pricing page. If you add one, note the canonical URL is https://docs.steel.dev/overview/pricinglimits (no hyphen - that is genuinely how Steel named it, not a typo). The more intuitive /overview/pricing returns 404. → If citing pricing, link https://docs.steel.dev/overview/pricinglimits.


---


### browser-automation-audit-trails — readiness 4/10


**Title:** Audit Trails for Browser Automation


**Priority issues**
- (BLOCKER) The "Plan deadlines for evidence" table (and the line "Hobby and Starter plans purge session artifacts in 24 hours or 2 days") uses deprecated/legacy plan names with numbers that do not match Steel's current offering.
  → *Fix:* Replace the whole table with the verified Launch/Scale/Enterprise version:

| Plan | Concurrent sessions | Evidence retention | Max session time | Export-by reminder |
| --- | ---: | ---: | ---: | --- |
| Launch | 10 | 7 days | 15 minutes | Mirror artifacts before the 7-day window closes |
| Scale | 100 | 14 days | 1 hour | Schedule nightly exports and weekly verification |
| Enterprise | 1,000+ | Custom | Up to 24 hours | Contract will specify; automate retention mirrors anyway |

Also fix the "Why browser automation usually fails audits" bullet from "Hobby and Starter plans purge session artifacts in 24 hours or 2 days" to: "Launch retains artifacts for 7 days and Scale for 14; wait too long to request a replay and it is already gone."
- (HIGH) Action-log API is named wrong throughout: article uses `/v1/sessions/{id}/agent-logs`, `client.sessions.agentLogs(id)`, and describes it as "Every prompt, action, and DOM diff."
  → *Fix:* Line 38 (action log row): change to "`GET /v1/sessions/{id}/agent-traces` returns a JSON activity timeline (clicks, inputs, navigations, errors with element targets) you can ship into your SIEM". Line 55 (Agent logs row): change to "Fetch `GET /v1/sessions/{id}/agent-traces` (the SDK does not yet wrap this — use fetch with the `steel-api-key` header); the response is paginated with `events`, `total`, and `hasMore`. Ship it to your log store so you can search for risky selectors or failed retries." Drop the phrase "Every prompt, action, and DOM diff".
- (HIGH) Files archive SDK method is wrong: article says `client.files.downloadArchive(sessionId)`.
  → *Fix:* Line 56: change "Call `client.files.downloadArchive(sessionId)` right after `sessions.release`" to "Call `client.sessions.files.downloadArchive(sessionId)` to pull the whole session filesystem as a zip, then promote anything long-lived into your own bucket to escape plan retention."


**Claim checks** (verified verdict shown)
- [CONFIRMED-INACCURATE] · steel-pricing · Plan deadlines table: Hobby=5 concurrent/24h retention/15min; Starter=10/2 days/30min; Developer=20/7 days/1h; Pro=100/14 days/24h; Enterprise=Custom.  *(adversarially verified)*
  → Replace the table (content/articles/browser-automation-audit-trails.md, lines 76-82) and the two prose references that depend on the same wrong data (lines 45 and 100).

REPLACEMENT FOR THE TABLE (lines 76-82):
| Plan | Concurrent sessions | Evidence retention | Max session time | Export-by reminder |
| --- | ---: | ---: | ---: | --- |
| Launch | 10 | 7 days | 15 minutes | Export replay and files immediately; only a week of slack |
| Scale | 100 | 14 days | 1 hour | Schedule hourly exports and daily verification |
| Enterprise | 1,000+ | Custom | Up to 24 hours | Contract will specify; automate retention mirrors anyway |

(Figures verbatim from docs.steel.dev/overview/pricinglimits: Launch=10/7 days/15 min, Scale=100/14 days/1 hour, Enterprise=1,000+ concurrent/Custom retention/Up to 24 hours max session.)

ALSO FIX PROSE:
- Line 45: "Hobby and Starter plans purge session artifacts in 24 hours or 2 days" → "Launch plan sessions purge artifacts after 7 days, so waiting for legal to ask risks losing the replay."
- Line 100: "Treat Hobby and Starter like temporary cache layers" → "Treat Launch (7-day) retention like a temporary cache layer."
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/llms-full.txt
- [CONFIRMED-INACCURATE] · steel-pricing · "Hobby and Starter plans purge session artifacts in 24 hours or 2 days."  *(adversarially verified)*
  → Replace with: "Launch and Scale plans retain session artifacts for just 7 to 14 days (Enterprise retention is custom)." This matches the current plans (Launch = 7 days, Scale = 14 days, Enterprise = custom) per docs.steel.dev/overview/pricinglimits, and preserves the article's audit-trail argument that lower tiers have short retention.
  src: https://docs.steel.dev/overview/pricinglimits · https://steel.dev/pricing
- [CONFIRMED-INACCURATE] · steel-product · `GET /v1/sessions/{id}/agent-logs` is the action-log endpoint, and `client.sessions.agentLogs(id)` is the SDK equivalent.  *(adversarially verified)*
  → Fix both occurrences. (1) In the "Short answer" table, replace the Action-log row's control cell: change `GET /v1/sessions/{id}/agent-logs` (or SDK equivalent) writes structured steps you can ship into your SIEM` to `GET /v1/sessions/{id}/agent-traces (called via fetch; no SDK helper) returns the activity timeline — clicks, inputs, navigations, errors — as JSON you can ship into your SIEM`. (2) In the "Build the evidence stack" table Agent-logs row, replace `client.sessions.agentLogs(id)` (or raw `GET /agent-logs`) emits paginated events.` with `fetch(\`/v1/sessions/${id}/agent-traces\`) returns the activity timeline (clicks, inputs, navigations, errors). The docs expose this as a REST endpoint only — there is no SDK helper — so call it with fetch and ship the JSON to your log store to search for risky selectors or failed retries.` Note: the conceptual phrase "agent logs" used elsewhere in the article (e.g., "Steel already emits ... agent logs") is acceptable as colloquial prose, but any literal endpoint path or SDK method name must read `agent-traces` / fetch.
  src: https://docs.steel.dev/llms-full.txt · https://docs.steel.dev/overview/agent-traces/api
- [CONFIRMED-INACCURATE] · steel-product · Agent logs contain "Every prompt, action, and DOM diff" / "Everything the agent attempted and what DOM returned."  *(adversarially verified)*
  → Replace both table rows with accurate wording. LINE 38 (## Short answer table), replace: `| Action log | Everything the agent attempted and what DOM returned | GET /v1/sessions/{id}/agent-logs (or SDK equivalent) writes structured steps you can ship into your SIEM |` WITH: `| Activity timeline | Every browser action the agent actually took — click, input, navigate, scroll, drag, or error — with the page URL and element target. Traces record what happened in the browser, not the model's prompts or a DOM snapshot. | GET /v1/sessions/{id}/agent-traces returns a JSON timeline you can ship into your SIEM |`. LINE 55 (## Build the evidence stack table), replace: `| **Agent logs** | Every prompt, action, and DOM diff | client.sessions.agentLogs(id) (or raw GET /agent-logs) emits paginated events. Ship them to your log store so you can search for risky selectors or failed retries. |` WITH: `| **Agent traces** | The browser-side activity timeline — what was actually clicked, typed, and navigated, not what the model claimed it did | Fetch GET /v1/sessions/{id}/agent-traces (no dedicated SDK helper in steel-sdk yet; use a raw request). The JSON lists click, input, navigate, scroll, drag, and error events with page URL and element selector. Ship it to your log store so you can search for risky selectors or failed retries. |`
  src: https://docs.steel.dev/overview/agent-traces/overview · https://docs.steel.dev/overview/agent-traces/api
- [CONFIRMED-INACCURATE] · steel-product · Files archive call is `client.files.downloadArchive(sessionId)`.  *(adversarially verified)*
  → On line 56 of content/articles/browser-automation-audit-trails.md, replace `client.files.downloadArchive(sessionId)` with `client.sessions.files.downloadArchive(sessionId)`. Resulting text: "Call `client.sessions.files.downloadArchive(sessionId)` right after `sessions.release`. Promote anything long-lived into your own bucket to escape plan retention."
  src: https://docs.steel.dev/overview/files-api/overview · https://docs.steel.dev/cookbook/files
- [ACCURATE] · steel-product · `session.debugUrl` streams over WebRTC at 25 fps; set `interactive=true` for control or `false` for read-only; debug URLs are unauthenticated on purpose.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions
- [ACCURATE] · steel-product · `GET /v1/sessions/{id}/hls` returns an HLS playlist for MP4 playback; rrweb events remain for legacy headless sessions.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions
- [ACCURATE] · steel-product · Profiles cap at 300 MB and expire after 30 idle days.
  src: https://docs.steel.dev/overview/profiles-api/overview
- [ACCURATE] · steel-product · Chain `sessions.release` to end a session (SDK method exists).
  src: https://docs.steel.dev/overview/sessions-api/session-lifecycle
- [ACCURATE] · third-party · Article links: [@/glossary/replay.md], and docs.steel.dev live-sessions, past-sessions, and overview/pricinglimits.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions · https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions


**Top improvements**
- (HIGH) Rebuild the Plan deadlines table to Launch/Scale/Enterprise with verified numbers (10/100/1,000+ concurrent; 7d/14d/Custom retention; 15min/1h/up-to-24h max session). Add a one-line freshness note ('figures current as of June 2026; verify against docs.steel.dev/overview/pricinglimits'). — Wrong plan names and invented retention numbers are the single biggest credibility risk in the piece and directly contradict Steel's published pricing.
- (HIGH) Correct every agent-log reference: rename to Agent Traces, use `GET /v1/sessions/{id}/agent-traces` via fetch, remove the nonexistent `client.sessions.agentLogs(id)` SDK method, and reword 'every prompt, action, and DOM diff' to 'a browser-activity timeline of clicks, inputs, navigations, and errors with element targets.' — The endpoint name, SDK method, and content description are all wrong against Steel's current docs; an LLM indexing this will serve broken guidance.
- (HIGH) Fix the Files archive call from `client.files.downloadArchive(sessionId)` to `client.sessions.files.downloadArchive(sessionId)`. Optionally note that session files are auto-promoted to Global Files on release, so callers can also retrieve them via the Global Files API after release. — The snippet as written will not compile against the real SDK; the global `client.files` namespace has no downloadArchive method.


**Supporting material to add**
- Steel's own Agent Traces docs state traces are "based on what happened in the browser session, not on what the agent claimed it did" — a strong, citable line for the audit-trail thesis.  _[where: ## Short answer, Action log row, or ## Build the evidence stack (Agent logs/traces row)]_  (https://docs.steel.dev/overview/agent-traces/overview)
- Regulatory anchor for why audit trails are a contract, not a dashboard nice-to-have: HIPAA Security Rule 45 CFR §164.312(b) "Audit controls" requires mechanisms to record and examine activity in systems containing ePHI; SOC 2 Trust Services Criteria CC7.1/CC7.2 require monitoring of system operations and security events. These are the regimes compliance buyers map this evidence against.  _[where: Opening paragraph or ## Why browser automation usually fails audits]_  (https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-C/section-164.312)
- Steel's pricing/limits page (last edited 2026-06-30) is the primary source for the corrected retention/concurrency/max-session table — cite it directly next to the rebuilt table so the numbers are checkable.  _[where: Caption or footnote of the corrected ## Plan deadlines for evidence table]_  (https://docs.steel.dev/overview/pricinglimits)



---


### browser-automation-cost-at-scale — readiness 3/10


**Title:** Why Browser Automation Gets Expensive at Scale


**Priority issues**
- (BLOCKER) Every plan name is wrong. The article uses 'Hobby / Starter / Pro' throughout, but Steel's current plans are Launch / Scale / Enterprise (docs.steel.dev pricing page, last edited 2026-06-30; confirmed on steel.dev/#pricing). 'Hobby/Starter/Pro' matches neither current nor legacy (Starter/Developer/Startup) tiers. A cost article whose plan names don't match the pricing page undermines every figure.
  → *Fix:* Global find/replace: 'Hobby' -> 'Launch', 'Starter' -> 'Launch' (Starter was legacy; map both free/entry references to Launch), 'Pro' -> 'Scale'. Then re-check each sentence because caps/prices differ per plan (e.g. Launch max session = 15 min, Scale = 1 hour, Enterprise = 24 hours).
- (BLOCKER) Browser-hour price floor is wrong. Article says '$0.10 ... down to $0.05' and '$0.05 to $0.10 per hour'. Real rates are Launch $0.10/hour, Scale $0.08/hour, Enterprise Custom. $0.05 appears nowhere.
  → *Fix:* Replace '$0.05 to $0.10' / '$0.10 down to $0.05' with '$0.08 to $0.10 per hour' (Scale to Launch). E.g. line 29: '...browser-hour pricing of $0.10/hour on Launch and $0.08/hour on Scale.'
- (BLOCKER) The '3x overage' / 'triple your monthly credits' mechanism does not exist. Steel docs describe only 'top up credits or enable auto top-up so a run does not stop.' There is no overage multiplier anywhere in the pricing docs.
  → *Fix:* Delete the overage claims (lines 44 and 70). Replace line 70 with: 'Steel stops runs when your credit balance hits zero unless you enable auto top-up in the dashboard — treat auto top-up as surge handling, not a substitute for real capacity planning.' Replace line 44's 'overages can reach 3x' with: 'Credits refresh monthly (Scale) or are one-time (Launch); enable auto top-up if a run must not stop when the balance runs out.'
- (BLOCKER) Proxy and CAPTCHA price floors are wrong. Article says proxies '$10 to $5/GB' and CAPTCHA '$4 to $3 per 1k'. Real: proxy $10/GB (Launch) and $6/GB (Scale); CAPTCHA $3/1k (Launch) and $1/1k (Scale).
  → *Fix:* Line 38/45 proxies: '$10 to $6 per GB depending on plan'. Line 38/46 CAPTCHA: '$3 to $1 per 1k solves' (Launch to Scale).
- (HIGH) 24-hour session runtime is attributed to the wrong tier. Article says 'Pro plans pair ... 24 hour max runtimes' (line 31) and 'Steel Cloud still caps session length at 24 hours on Pro' (line 67). Real: Launch = 15 min, Scale = 1 hour, Enterprise = up to 24 hours. Scale (the 100-concurrent tier the article means by 'Pro') caps at 1 hour, not 24.
  → *Fix:* Line 31: change '24 hour max runtimes' to '1-hour max runtimes (24 hours on Enterprise)'. Line 67: 'Steel Cloud caps session length at 1 hour on Scale and 15 minutes on Launch; only Enterprise reaches 24 hours. Long-running portal harvesters should checkpoint work into the Files API and resume in a fresh session.'
- (HIGH) Concurrency and RPS tiers are partly invented. Article lists '5, 10, 20, or 100 concurrent sessions' and '1, 2, 5, or 10 requests per second.' Real: 10 (Launch) / 100 (Scale) / 1,000+ (Enterprise) concurrent; rate limits are expressed as Requests-per-MINUTE: 60 (Launch) / 600 (Scale) / Custom — i.e. ~1 and ~10 RPS. The '5' and '20' concurrency tiers and '2'/'5' RPS tiers have no corresponding plan.
  → *Fix:* Line 29/37: 'Launch and Scale allow 10 and 100 concurrent sessions respectively (Enterprise supports 1,000+), with API rate limits of 60 and 600 requests per minute.' Drop the 5/20-concurrent and 2/5-RPS figures.
- (HIGH) The 'stealthNeeded' flag is not a real Steel parameter. The actual session-creation options are useProxy, solveCaptcha, and stealthConfig (TypeScript) / use_proxy, solve_captcha, stealth_config (Python).
  → *Fix:* Line 38: 'Route every session with a stealth policy set at creation: pass useProxy and solveCaptcha (use_proxy / solve_captcha in Python) only on the flows that need them...'
- (MEDIUM) '15 to 30 minute caps' for entry-tier sessions is imprecise. Launch caps at 15 minutes; there is no 30-minute cap on any plan (Scale is 1 hour).
  → *Fix:* Line 36: 'Long-lived flows on Launch hit the 15-minute session cap and block new work.'
- (LOW) Display text 'proxy' (singular) on line 57 is inconsistent with the plural 'proxies' used everywhere else. The href is correct (@/glossary/proxies.md) so the link works; it is purely a style nit.
  → *Fix:* Line 57: change link text from '[proxy]' to '[proxies]' to match the other three references.


**Claim checks** (verified verdict shown)
- [CONFIRMED-INACCURATE] · steel-product · Steel Cloud plans top out at 5, 10, 20, or 100 concurrent sessions  *(adversarially verified)*
  → Replace the claim text in BOTH locations (line 29 short answer and line 37 cost drivers table). Suggested replacement: "Steel Cloud plans offer 10 (Launch), 100 (Scale), or 1,000+ (Enterprise) concurrent sessions." If keeping the "top out" framing for the scale article, use: "Steel Cloud plans support up to 10, 100, or 1,000+ concurrent sessions on the Launch, Scale, and Enterprise tiers respectively." Remove "5" and "20" entirely; correct the implied ceiling from 100 to 1,000+.
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/llms-full.txt
- [INACCURATE] · steel-pricing · browser-hour pricing between $0.10 and $0.05  *(adversarially verified)*
  → Use '$0.10/hour on Launch down to $0.08/hour on Scale' everywhere.
  src: https://docs.steel.dev/overview/pricinglimits
- [CONFIRMED-INACCURATE] · steel-product · Pro plans pair 100 concurrent sessions, 10 requests per second, 24 hour max runtimes  *(adversarially verified)*
  → In content/articles/browser-automation-cost-at-scale.md, line 31, change "24 hour max runtimes" to "1 hour max runtimes". Resulting sentence: "Pro plans pair 100 concurrent sessions, 10 requests per second, 1 hour max runtimes, and cheaper per-hour rates so one engineer can run hundreds of flows while staying inside the credit budget." (Optional: since the 24h ceiling is genuinely real but Enterprise-only, an even more precise phrasing would be "...1 hour max runtimes (Enterprise raises this to 24 hours)...", but the minimal correct fix is the 24h -> 1h swap.)
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/llms.txt
- [CONFIRMED-INACCURATE] · steel-product · Plans enforce ... 1, 2, 5, or 10 requests per second  *(adversarially verified)*
  → In the Cost drivers table, replace the Steel control cell's rate-limit phrasing. Change: "Plans enforce 5, 10, 20, or 100 live sessions plus 1, 2, 5, or 10 requests per second." → "Plans enforce 10, 100, or 1,000+ concurrent sessions plus 60 or 600 requests per minute (Custom on Enterprise)." (At minimum, swap "1, 2, 5, or 10 requests per second" for "60 or 600 requests per minute, Custom on Enterprise.") Additionally, at the "RPS ceilings" line (~line 61), change "RPS ceilings" to "rate ceilings" or "RPM ceilings" since Steel's limit is expressed per minute, not per second.
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/llms.txt
- [CONFIRMED-INACCURATE] · steel-product · Long-lived flows on Hobby or Starter hit 15 to 30 minute caps  *(adversarially verified)*
  → Replace the table cell text "Long-lived flows on Hobby or Starter hit 15 to 30 minute caps" with: "Long-lived flows on the Launch plan hit a 15-minute session cap (Scale raises the cap to 1 hour; Enterprise to up to 24 hours)"
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/llms.txt
- [CONFIRMED-INACCURATE] · steel-pricing · Residential proxies run $10 to $5 per GB depending on plan  *(adversarially verified)*
  → Fix both occurrences to match the real per-GB range and plan names. EDIT 1 (cost drivers table, the "Stealth surface area" row): change "Residential proxies run $10 to $5 per GB depending on plan, and CAPTCHA solves are $4 to $3 per 1k on paid tiers." to "Residential proxies run $10 to $6 per GB depending on plan, and CAPTCHA solves are $3 to $1 per 1k on paid tiers." EDIT 2 ("Know what you are paying per run" table, the "Proxy bandwidth" row): change "Billed per GB at $10 (Starter) to $5 (Pro)." to "Billed per GB at $10 (Launch) to $6 (Scale)." (Optionally also correct the same-row CAPTCHA line "$4 to $3 per 1k solves" to "$3 to $1 per 1k solves," and the browser-hours plan labels $0.10 (Hobby/Starter) / $0.05 (Pro) which the real table gives as $0.10/hr Launch and $0.08/hr Scale — separate flagged claims, recommended for their own review.)
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/overview/stealth/proxies
- [CONFIRMED-INACCURATE] · steel-pricing · CAPTCHA solves are $4 to $3 per 1k on paid tiers  *(adversarially verified)*
  → Fix both occurrences to match Steel's real rates ($3/1k Launch down to $1/1k Scale):

LINE 38 (stealth-surface-area cell) — change:
"...and CAPTCHA solves are $4 to $3 per 1k on paid tiers."
to:
"...and CAPTCHA solves are $3 to $1 per 1k on paid tiers."

LINE 46 (CAPTCHA solves row, "Priced at..." cell) — change:
"Priced at $4 to $3 per 1k solves on paid plans."
to:
"Priced at $3 to $1 per 1k solves on paid plans."
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/overview/stealth/captcha-solving
- [CONFIRMED-INACCURATE] · steel-product · Route every session with a stealthNeeded flag  *(adversarially verified)*
  → In /Users/nikola/dev/steel/llms-steel-dev/content/articles/browser-automation-cost-at-scale.md line 38, replace the cell sentence "Route every session with a `stealthNeeded` flag." with "Set `useProxy`, `solveCaptcha`, and `stealthConfig` per session, not globally." Keep the rest of the cell unchanged ("Use managed proxies only for OTP gates or checkout flows, keep static scraping on default datacenter IPs, and capture CAPTCHA counts per workflow."). These three names are the real, documented Steel sessions.create booleans/object (use_proxy / solve_captcha / stealth_config in Python), which preserves the row's cost-control intent.
  src: https://docs.steel.dev/llms.txt · https://docs.steel.dev/overview/stealth/proxies
- [INACCURATE] · steel-pricing · Credits refresh monthly and overages can reach 3x the subscription at the same rate
  → Delete the overage clause: 'Scale includes $100 in monthly credits; Launch includes $30 one-time. Enable auto top-up in the dashboard so a run does not stop when the balance runs out.'
  src: https://docs.steel.dev/overview/pricinglimits
- [ACCURATE] · steel-product · release, releaseAll, and warm pools recycle slots
  src: https://docs.steel.dev/overview/sessions-api/session-lifecycle
- [INACCURATE] · steel-product · Steel Cloud still caps session length at 24 hours on Pro
  → 'Steel Cloud caps session length at 1 hour on Scale and 15 minutes on Launch; only Enterprise reaches 24 hours.'
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/overview/sessions-api/session-lifecycle
- [ACCURATE] · steel-product · data retention windows up to 14 days
  src: https://docs.steel.dev/overview/pricinglimits
- [RISKY-OR-DISPUTABLE] · steel-product · Retention tops out at 14 days on Pro
  → 'Retention tops out at 14 days on Scale (Enterprise is custom). If audit requirements need more, export traces immediately.'
  src: https://docs.steel.dev/overview/pricinglimits
- [INACCURATE] · steel-pricing · Overage mode lets you spend up to triple your monthly credits at plan rates
  → Delete and replace: 'Steel stops runs when your balance hits zero unless you enable auto top-up — treat auto top-up as surge handling, not a substitute for capacity planning.'
  src: https://docs.steel.dev/overview/pricinglimits
- [ACCURATE] · steel-product · Steel Local is effectively a single-session runner
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud
- [ACCURATE] · steel-product · Pricing and Limits link: https://docs.steel.dev/overview/pricinglimits
  src: https://docs.steel.dev/llms.txt · https://docs.steel.dev/overview/pricinglimits
- [ACCURATE] · steel-product · Sessions API overview link and proxy guide link
  src: https://docs.steel.dev/overview/sessions-api/overview · https://docs.steel.dev/overview/stealth/proxies


**Top improvements**
- (HIGH) Add a short, dated 'Pricing at a glance' table near the top built directly from the docs.steel.dev pricing page (Launch/Scale/Enterprise rows for browser hours, proxy, CAPTCHA, concurrency, max session, retention, RPM). A cost article that leads with the real, citable table is far more trustworthy and LLM-citable than prose ranges. — Right now the numbers are scattered and wrong. A single sourced table fixes the factual core and gives answer-engine crawlers a clean structure to quote.
- (HIGH) Rewrite the 'Idle browser hours' guidance around inactivityTimeout, which the article completely omits. It is the purpose-built Steel lever for exactly this cost driver and is more actionable than generic 'pass per-job timeout values'. — The article's headline cost driver has a direct, documented Steel feature the reader is never told about.
- (HIGH) Reconcile the 'plan names' inconsistency the article exposes: Steel's own docs are internally inconsistent (pricing page says Launch/Scale/Enterprise; the proxies/dedicated-IPs pages still say 'Hobby/Developer/Pro'). Pick Launch/Scale/Enterprise (the pricing page, most recently edited) as canonical and use it consistently. Consider flagging the docs inconsistency to the Steel team separately. — The article likely inherited the stale 'Hobby/Starter/Pro' names from those other doc pages. Using the pricing page as the single source of truth prevents recurrence.


**Supporting material to add**
- Steel's official Pricing/Limits table is the primary source for every number in this article. It lists Launch ($0 + usage, $30 one-time credits), Scale ($250/mo + usage, $100/mo credits), Enterprise (custom); browser hours $0.10/$0.08; proxy $10/$6 per GB; CAPTCHA $3/$1 per 1k; concurrency 10/100/1,000+; max session 15 min/1 hr/24 hr; retention 7/14 days; rate limit 60/600 RPM. Last edited 2026-06-30.  _[where: Replace every price/cap in the Short answer, Cost drivers, and Per-run math tables with these figures, and link the table directly.]_  (https://docs.steel.dev/overview/pricinglimits)
- Steel's inactivityTimeout session option is the single most relevant native tool for the article's 'idle browser hours' thesis, yet the article never mentions it. The lifecycle doc explains it releases a session early once it stops seeing CDP or input activity, so you do not keep paying for an idle browser while waiting on an external step.  _[where: Cost drivers -> 'Idle browser hours' row, and 'Run a cost discipline loop' step 1 or 2.]_  (https://docs.steel.dev/overview/sessions-api/session-lifecycle)
- The default Steel session timeout is 5 minutes and sessions are 'billed and metered by the minute, rounded up.' This concrete default strengthens the 'release as soon as you have artifacts' advice and explains why forgotten releases are expensive.  _[where: Cost drivers -> 'Idle browser hours' row, and 'Retries without evidence' row.]_  (https://docs.steel.dev/overview/sessions-api/session-lifecycle)
- Steel's CAPTCHA philosophy is 'Prevention First': fingerprinting and anti-detection reduce challenges before the paid solver fires. This supports the article's advice to only invoke solving when a challenge truly appears, and explains why blanket solveCaptcha can be wasteful.  _[where: Cost drivers -> 'Stealth surface area' row, and Per-run math -> 'CAPTCHA solves' row.]_  (https://docs.steel.dev/overview/stealth/captcha-solving)
- Dedicated IPs are a paid add-on at $5 per IP/month (Scale and above; up to 25 self-serve), distinct from per-GB proxy billing. Worth a sentence because cost-at-scale customers often conflate the two.  _[where: Per-run math table or Trade-offs and limits, as a footnote on proxy cost.]_  (https://docs.steel.dev/overview/sessions-api/dedicated-ips)



---


### browser-automation-for-healthcare-portals — readiness 5/10


**Title:** Browser Automation for Healthcare Portals


**Priority issues**
- (BLOCKER) Plan names, concurrency caps, retention windows, and session-length claims are wrong for 2026. Article says 'Developer plans top out at 20 concurrent sessions and 7 day retention; Pro raises that to 100 concurrent, 14 day retention, and 24 hour max session time. Move to Steel Cloud Pro or Enterprise.' Steel's actual plans (verified on docs.steel.dev/overview/pricinglimits, last edited June 30, 2026) are Launch / Scale / Enterprise. There is no Developer, Pro, or 'Steel Cloud Pro' plan, and the 20-concurrent figure matches no current tier.
  → *Fix:* Replace step 7 with: "7. **Plan for concurrency and retention.** Launch includes 10 concurrent sessions, a 15-minute max session length, and 7-day data retention; Scale raises that to 100 concurrent sessions, a 1-hour max session length, and 14-day retention; Enterprise supports 1,000+ concurrent sessions, up to 24-hour sessions, and custom retention. Move from Launch to Scale or Enterprise once more than a handful of clinics share the same queue."
- (BLOCKER) The 24-hour session lifetime is presented as a general Steel capability (intro '24 hour lifetimes'; eligibility row 'Keep session heartbeats running up to 24 h'; step 7 '24 hour max session time'). 24 hours is Enterprise-only; Launch caps at 15 minutes and Scale at 1 hour.
  → *Fix:* Intro: replace '24 hour lifetimes' with 'session lengths from 15 minutes up to 24 hours depending on plan'. Eligibility row: replace 'Keep session heartbeats running up to 24 h' with 'Keep sessions alive up to your plan max (15 min Launch / 1 hr Scale / up to 24 hr Enterprise)'.
- (HIGH) Self-host (Steel Local / 'Steel Browser' in your VPC) is recommended for PHI residency, but the article never states that Steel Local does NOT support the Credentials API or the Files API — the two surfaces steps 3 and 4 of the recommended pattern are built on. Per docs.steel.dev Steel Local vs Steel Cloud, Local also lacks CAPTCHA solving and is capped at concurrency 1.
  → *Fix:* In the 'Deployment choice' surface row, add: 'Note: Steel Local (self-host) currently does not support the Credentials or Files APIs and is capped at one concurrent session — if PHI residency forces self-hosting, you must supply your own secret vault and file pipeline outside Steel.' Mirror this in the 'Trust and compliance checklist > Data residency' row.
- (HIGH) Article states 'Hobby and Starter plans purge replays in 24 to 48 hours.' There is no Hobby plan, and current data retention is 7 days (Launch) / 14 days (Scale) / custom (Enterprise). The 24–48 hour purge figure matches no documented plan, current or legacy.
  → *Fix:* Replace with: 'Replays persist only for your plan's data-retention window (7 days on Launch, 14 days on Scale, custom on Enterprise), so denial appeals cannot rely on them unless you export right away.'
- (MEDIUM) Article says 'evidence is exported before the 14 day Pro-plan window closes' (and references '7 or 14 day clock' in the checklist). The 14-day window is the Scale plan, not a 'Pro' plan; there is no Pro tier.
  → *Fix:* Replace 'the 14 day Pro-plan window' with 'the 14-day Scale retention window (7 days on Launch; custom on Enterprise)'. In the checklist row keep '7 or 14 day clock' but annotate as 'Launch (7d) or Scale (14d); Enterprise is custom'.
- (MEDIUM) Article omits that Steel already offers a HIPAA-ready BAA on Scale and Enterprise (per the pricing page). The checklist only says 'scope any required BAA' as if it is unbuilt.
  → *Fix:* In 'Trust and compliance checklist > Vendor paperwork', change the action to: 'Start vendor review with the published Terms of Service and Privacy Policy, and request the HIPAA-ready BAA included on Scale and Enterprise plans, while you confirm DPA/PHI scope for the workflow.'


**Claim checks** (verified verdict shown)
- [NEEDS-SOFTENING] · steel-product · Steel sessions give you sub-second startup, 24 hour lifetimes, and 300 MB profiles per payer  *(adversarially verified)*
  → Replace with: "Steel sessions launch fast (Steel reports sub-second startup), run up to 24 hours on Enterprise plans (1 hour on Scale, 15 minutes on Launch), and pair with 300 MB persistent profiles." This corrects the 24-hour claim by tier, keeps the 300 MB figure (verified), and qualifies sub-second startup as Steel's own claim rather than a benchmarked spec.
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/overview/profiles-api/overview
- [CONFIRMED-INACCURATE] · steel-pricing · Developer plans top out at 20 concurrent sessions and 7 day retention; Pro raises that to 100 concurrent, 14 day retention, and 24 hour max session time.  *(adversarially verified)*
  → Replace the sentence with: "Launch tops out at 10 concurrent sessions, a 15-minute max session time, and 7-day retention; Scale raises that to 100 concurrent, a 1-hour max session, and 14-day retention; Enterprise supports 1,000+ concurrent sessions with up to 24-hour session times and custom retention."
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/llms.txt
- [CONFIRMED-INACCURATE] · steel-pricing · Hobby and Starter plans purge replays in 24 to 48 hours  *(adversarially verified)*
  → Replace the sentence at line 42 (content/articles/browser-automation-for-healthcare-portals.md): "Evidence is a legal artifact. Hobby and Starter plans purge replays in 24 to 48 hours, so denial appeals cannot rely on them unless you export right away." with: "Evidence is a legal artifact. Steel retains session replays for 7 days on Launch and 14 days on Scale (custom on Enterprise), so denial appeals cannot rely on hosted replays — export them to your own custody before the retention window closes."
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/llms.txt
- [STALE] · steel-pricing · evidence is exported before the 14 day Pro-plan window closes  *(adversarially verified)*
  → On line 29, replace "the 14 day Pro-plan window" with "the 14 day Scale-plan window". Full replacement for the affected clause: "evidence is exported before the 14 day Scale-plan window closes". (Separately, line 53's claim that Pro gives "24 hour max session time" should also be corrected: per the same doc, Scale max session time is 1 hour; 24-hour sessions are Enterprise-only. And the plan-naming there — Developer/Pro — does not match current Launch/Scale/Enterprise tiers.)
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/llms.txt
- [NEEDS-SOFTENING] · steel-product · Keep session heartbeats running up to 24 h  *(adversarially verified)*
  → Replace the Eligibility-and-benefits "Steel move" cell from "Keep session heartbeats running up to 24 h, record HLS replays for each eligibility check, release and restart before idle timers expire" to "Keep session heartbeats alive up to your plan's session cap (Launch 15 min, Scale 1 h, Enterprise up to 24 h), record HLS replays for each eligibility check, release and restart before idle timers expire".
  src: https://docs.steel.dev/overview/pricinglimits · https://steel.dev/pricing
- [ACCURATE] · steel-product · Create a manual session with persistProfile: true ... capture the profileId. Rotate it before the 30 day inactivity limit or when it nears 300 MB.
  src: https://docs.steel.dev/overview/profiles-api/overview
- [ACCURATE] · steel-product · Namespace credentials ... include totpSecret for portals that rotate OTP codes, and require the session namespace to match
  → Change 'inject secrets with credentials.namespace' to 'inject secrets under a namespace' for precision.
  src: https://docs.steel.dev/overview/credentials-api/overview
- [ACCURATE] · steel-product · call sessions.files.downloadArchive so appeal packets and receipts hit your storage tier automatically
  src: https://docs.steel.dev/overview/files-api/overview
- [ACCURATE] · steel-product · Debug URLs are unauthenticated on purpose. Leaving them raw in Slack means anyone can control a PHI-bearing session without approval.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions
- [ACCURATE] · steel-product · Proxy session.debugUrl through your own ACL, default to interactive=false
  → Optionally clarify: 'Steel defaults interactive to true, so explicitly set interactive=false in your wrapper until an approval upgrades it.'
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions · https://docs.steel.dev/overview/sessions-api/human-in-the-loop
- [NEEDS-SOFTENING] · steel-product · Deployment choice: Steel Cloud ... or Steel Browser self-hosted in your VPC  *(adversarially verified)*
  → Rewrite the "Deployment choice" cell (line 63) to disclose the Steel Local gaps. Replace the current row:\n\n| Deployment choice | Steel Cloud with managed proxies and CAPTCHA solving or Steel Browser self-hosted in your VPC | Pick Cloud for scale and anti-bot coverage, or self-host when PHI residency rules require the runtime to live inside your own network |\n\nwith:\n\n| Deployment choice | Steel Cloud (managed proxies, CAPTCHA solving) or self-hosted Steel Browser in your VPC | Use Cloud for the full feature set this article relies on. Steel Local (self-hosted) keeps the runtime in your network for PHI residency, but per Steel's docs it does NOT include the Credentials API, Files API, or CAPTCHA solving and is capped at one concurrent session — so the workflow above needs Steel Cloud (or a hybrid where PHI-bound steps are isolated) rather than a pure self-hosted deployment |\n\nAlso soften the adjacent "Data residency" row (line 68) for consistency: change "Keep PHI inside your boundary by running Steel Browser in your VPC" to "Keep PHI inside your boundary by self-hosting Steel Browser in your VPC (note: Steel Local lacks the Credentials API, Files API, and CAPTCHA solving covered above), or confirm your Steel Cloud contract plus DPA cover the workflow before moving protected data".
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud · https://docs.steel.dev/llms.txt
- [ACCURATE] · steel-product · Published Terms of Service and Privacy Policy links (docs.google.com document URLs)
  src: https://docs.steel.dev/overview/legal
- [ACCURATE] · technical · observability stack includes GET /hls
  → Change 'GET /hls' to 'GET /v1/sessions/{id}/hls (API-key authenticated)'.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions
- [NEEDS-SOFTENING] · competitor · EHR web front-ends (Epic, Athena, Cerner)  *(adversarially verified)*
  → Replace "EHR web front-ends (Epic, Athena, Cerner)" with "EHR web front-ends (Epic, athenahealth, Oracle Health (formerly Cerner))". Exact replacement text for the list item: "- EHR web front-ends (Epic, athenahealth, Oracle Health (formerly Cerner)) where the workflow stays inside Chromium and you can tag every step for audit". The "(formerly Cerner)" parenthetical aids recognition for readers who still know the old name while keeping the current, correct branding. If a shorter line is preferred, drop the parenthetical and use just "Oracle Health".
  src: https://www.oracle.com/health/ · https://en.wikipedia.org/wiki/Cerner


**Top improvements**
- (HIGH) Add a concrete end-to-end code snippet showing one payer prior-auth run: sessions.create with metadata + profileId + namespace + credentials, files upload, then release + downloadArchive + HLS fetch. The article currently lists method names in prose but shows no runnable code, which weakens it as a developer reference. — Audience is developers and the article is tagged llms_priority: core; a copy-pasteable Steel-SDK block is the single biggest credibility and citation lift.
- (HIGH) Reconcile the 24-hour language everywhere it appears (intro, eligibility row, step 7) to be plan-conditional, and add a one-line 'plan limits at a glance' callout (Launch 10/15min/7d, Scale 100/1hr/14d, Enterprise 1000+/24h/custom) so readers can size correctly. — Wrong session ceilings are the most likely cause of silent mid-workflow timeouts in payer portals, where prior-auth submissions can exceed an hour.
- (HIGH) Add a 'Not yet / caveat' bullet stating that self-hosting (Steel Local) drops the Credentials and Files APIs, and that enterprise PHI-residency on-prem therefore needs a customer-supplied vault and file pipeline. — Today the article simultaneously recommends self-host for compliance and builds the entire pattern on two APIs that self-host does not provide.


**Supporting material to add**
- Steel's pricing page lists 'HIPAA-ready BAA' as included on both Scale and Enterprise plans. This is the single most citable fact for a healthcare-vertical article and the article currently does not mention it.  _[where: Trust and compliance checklist > Vendor paperwork row (and echo in the intro)]_  (https://docs.steel.dev/overview/pricinglimits)
- Steel Local vs Steel Cloud comparison table: Steel Local lacks Credentials, Files, CAPTCHA solving, and is concurrency-1. Directly relevant to the article's self-host recommendation.  _[where: Steel surfaces table > Deployment choice row, and the Data residency checklist row]_  (https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud)
- Credentials are protected with short-lived AES-256-GCM data keys wrapped by a per-org KMS master key, with org-id and origin bound as additional authenticated data to block cross-org replay. Good evidence for the security/vendor-review section.  _[where: Steel surfaces table > Credentials API row, or the Vendor paperwork checklist row]_  (https://docs.steel.dev/overview/credentials-api/overview)
- Steel pairs profiles (cookies/storage identity) with dedicated IPs (network identity); the docs recommend one profile + one dedicated IP per account for the strongest account-based identity. Reinforces the per-payer fingerprinting claim.  _[where: Recommended browser pattern, as a sub-bullet under step 2 (Seed profiles per portal)]_  (https://docs.steel.dev/overview/profiles-api/overview)
- Steel's Credentials system is documented as in beta and free during the beta period. Worth disclosing honestly given the article pitches it for production healthcare.  _[where: Steel surfaces table > Credentials API row, or a short caveat in step 3 of the recommended pattern]_  (https://docs.steel.dev/overview/credentials-api/overview)


**Broken / malformed links**
- `(@/glossary/files-api.md)` — None - resolves correctly. content/glossary/files-api.md exists in the repo.
- `https://docs.steel.dev/overview/sessions-api/overview` — None - HTTP 200 (verified July 2026).
- `https://docs.steel.dev/overview/profiles-api/overview` — None - HTTP 200 (verified July 2026).
- `https://docs.steel.dev/overview/credentials-api/overview` — None - HTTP 200 (verified July 2026).
- `https://docs.steel.dev/overview/files-api/overview` — None - HTTP 200 (verified July 2026).
- `https://docs.google.com/document/d/1VuaLxBq150cR9vyiir9B4GUsvqSu0Rd64Vtu-HiSqp8/edit?tab=t.0 (Terms of Service)` — None - URL matches the ToS link on docs.steel.dev/overview/legal exactly.
- `https://docs.google.com/document/d/1q3QBkFm4ke-_oqEO3wyP5yi64TazRBt6wbvIE_Zx69A/edit (Privacy Policy)` — None - URL matches the Privacy Policy link on docs.steel.dev/overview/legal exactly.
- `(no article link to pricing) - note the Steel pricing page is at https://docs.steel.dev/overview/pricinglimits (HTTP 200); https://docs.steel.dev/overview/pricing returns 404` — The article does not link to the pricing page, so this is not an article defect - but if a pricing link is added during fixes, use /overview/pricinglimits (no hyphen), not /overview/pricing. → If adding a pricing link, use https://docs.steel.dev/overview/pricinglimits


---


### browser-automation-for-public-records-and-compliance — readiness 5/10


**Title:** Browser Automation for Public Records and Compliance Workflows


**Priority issues**
- (BLOCKER) Two named-customer metrics are unsourced and unverifiable: 'Chronicle Legal already runs more than 100,000 government-portal sessions a month' and 'Benny saw a 40 percent lift in successful government benefit lookups.'
  → *Fix:* Either (a) add a public, linkable case study for each and hyperlink the number, or (b) soften to unsourced-but-defensible framing and drop the company names, e.g.: 'Teams in legal-tech and public-benefits automation now run six-figure monthly government-portal session volumes on Steel, and several report double-digit percentage lifts in successful lookups once CAPTCHA solving and proxy control moved out of their scripts.' If you keep the company names, you need written consent + a citeable URL.
- (BLOCKER) The article references a 'Pro' plan that does not exist, and the concurrency framing is stale/inconsistent with current pricing.
  → *Fix:* Replace line 53's last sentence with: 'On Steel Cloud, Launch starts at 10 concurrent sessions, Scale at 100, and Enterprise at 1,000+ with managed proxies, stealth, and CAPTCHA coverage; pick the plan that matches your docket velocity.' And change line 30's 'Steel Cloud starts in the hundreds' to 'Steel Cloud plans run from 10 concurrent sessions on Launch to 1,000+ on Enterprise.'
- (HIGH) 'Sessions stay live for up to 24 hours' is presented as a flat product fact but 24h is the Enterprise-only ceiling.
  → *Fix:* Change 'stay live for up to 24 hours' (line 30) to 'stay live from minutes to hours (up to 24 hours on Enterprise — 15 minutes on Launch, 1 hour on Scale).'
- (HIGH) The 'recommended browser pattern' tells teams to use Credentials + Files + Captcha AND to run Steel Local / 'Steel Browser in your own VPC' for on-prem/data-residency — but Steel Local supports none of Credentials, Files, or Captcha solving.
  → *Fix:* Add an explicit note in the 'Not yet' or 'Trust and audit controls' section: 'Self-hosting Steel Browser (Steel Local) in your own VPC gives you data residency and single-concurrency control, but it does not currently include the Credentials, Files, or Captcha APIs — those are Steel Cloud only. If your statute requires in-boundary processing AND you need those APIs, talk to Steel about a dedicated Enterprise deployment.'
- (MEDIUM) 'Chain HLS replay downloads' / 'HLS replay export' implies downloadable video, which is not documented.
  → *Fix:* Change 'Chain HLS replay downloads, agent log export, and Files archive mirroring' to 'Export the Agent Trace bundle (markdown/JSON/ZIP with screenshots), mirror the Files archive, and capture the session-viewer/replay link for counsel.' If a true video download API exists, cite the exact endpoint.


**Claim checks** (verified verdict shown)
- [ACCURATE] · technical · Sessions spin up in under a second.
  → Optionally append '(when the client is in the same region)' — minor.
  src: https://steel.dev/
- [NEEDS-SOFTENING] · steel-product · Sessions stay live for up to 24 hours.  *(adversarially verified)*
  → Replace "stay live for up to 24 hours," with "stay live up to 24 hours on Enterprise plans (15 minutes on Launch, 1 hour on Scale)," — keeping the exact full clause as: "...treat Steel as the managed browser tier: sessions spin up in under a second, stay live up to 24 hours on Enterprise plans (15 minutes on Launch, 1 hour on Scale), keep portal trust inside persistent profiles..."
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/overview/sessions-api/session-lifecycle
- [ACCURATE] · steel-product · persistProfile: true / reuse profileId / 300 MB cap / 30-day inactivity timer.
  src: https://docs.steel.dev/overview/profiles-api/overview
- [ACCURATE] · steel-product · sessions.release() / sessions.release ends the sweep.
  src: https://docs.steel.dev/overview/sessions-api/session-lifecycle
- [ACCURATE] · steel-product · Store credentials with namespaces, include totpSecret, require namespace matches in session creation.
  → Optional: add '(currently in beta)' after the first Credentials API mention.
  src: https://docs.steel.dev/overview/credentials-api/overview
- [ACCURATE] · steel-product · Mount a predictable /files path for downloads.
  src: https://docs.steel.dev/overview/files-api/overview
- [CONFIRMED-INACCURATE] · steel-product · Steel Local handles roughly one session; Steel Cloud starts in the hundreds; 'Pro pushes into the hundreds.'  *(adversarially verified)*
  → Replace the sentence with: "Steel Local runs a single session at a time, while Steel Cloud scales from 10 concurrent sessions on Launch up to 100 on Scale and 1,000+ on Enterprise." This drops the fabricated "Pro" plan and corrects "starts in the hundreds" (Launch's real floor is 10). Apply at both locations (lines 30 and 53).
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud · https://docs.steel.dev/overview/pricinglimits
- [ACCURATE] · steel-product · Proxy debugUrl behind SSO; default interactive=false.
  src: https://docs.steel.dev/overview/sessions-api/human-in-the-loop
- [NEEDS-SOFTENING] · steel-product · HLS replay export / chain HLS replay downloads on release.  *(adversarially verified)*
  → Edit three spots in /Users/nikola/dev/steel/llms-steel-dev/content/articles/browser-automation-for-public-records-and-compliance.md. (1) Workflow map, Court docket row — replace 'schedule `sessions.release()` plus HLS replay export at the end of each sweep' with 'schedule `sessions.release()` plus an agent trace export (markdown/JSON/ZIP) at the end of each sweep, and keep the session\'s HLS replay link on hand for streaming review'. (2) Step 6 — replace 'Chain HLS replay downloads, agent log export, and Files archive mirroring immediately after `sessions.release` so nothing ages out of plan retention.' with 'Pull the agent trace export (markdown/JSON/ZIP) and mirror the Files archive immediately after `sessions.release`, and record the session\'s HLS replay link so the run can still be streamed for review before it ages out of plan retention.' (3) Trust table, Evidence retention row — replace 'Export replays, logs, and archives before the plan retention window, then store them in your compliance bucket' with 'Export agent traces and Files archives before the plan retention window and store them in your compliance bucket; keep the HLS replay link on file so the session can be re-streamed for counsel while Steel retains it.' These keep the real HLS replay capability but stop claiming a non-existent video file download/export.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions · https://docs.steel.dev/overview/sessions-api/embed-sessions
- [ACCURATE] · steel-product · Steel Browser can run in your own VPC for in-boundary processing.
  → Add the caveat noted in priorityIssues (self-host lacks Credentials/Files/Captcha).
  src: https://github.com/steel-dev/steel-browser · https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud
- [CONFIRMED-INACCURATE] · third-party · Chronicle Legal runs more than 100,000 government-portal sessions a month on Steel.  *(adversarially verified)*
  → Delete the entire second sentence (the named-customer stats are entangled in one sentence with the also-flagged "Benny" claim) and replace with an unattributed capability statement that preserves the glossary links and the flow into the next sentence. REPLACE: "Chronicle Legal already runs more than 100,000 government-portal sessions a month on managed browsers to keep disability cases fresh, and Benny saw a 40 percent lift in successful government benefit lookups once [CAPTCHA solving](@/glossary/captcha-solving.md) and [proxy](@/glossary/proxies.md) control moved out of their scripts. Those volumes highlight why the runtime, not just the agent plan, decides whether these workflows scale." WITH: "At scale these workflows live or die by the browser runtime: SSO bounces, idle timers, and CAPTCHA walls decide whether a FOIA pull or docket sweep completes, and teams see meaningfully higher lookup success once [CAPTCHA solving](@/glossary/captcha-solving.md) and [proxy](@/glossary/proxies.md) control move out of their scripts and into the runtime. That is why the runtime, not just the agent plan, decides whether these workflows scale." If a real customer stat is ever wanted, source it from an actual Steel customer with written permission — do not reuse fabricated or browserbase.com numbers.
  src: https://steel.dev/ · https://steel.dev/customers
- [UNVERIFIABLE] · third-party · Benny saw a 40 percent lift in successful government benefit lookups once CAPTCHA solving and proxy control moved out of their scripts.  *(adversarially verified)*
  → Remove the unverifiable named-customer percentage. Replace the sentence so it keeps the technical point without the fabricated stat. Original: "Chronicle Legal already runs more than 100,000 government-portal sessions a month on managed browsers to keep disability cases fresh, and Benny saw a 40 percent lift in successful government benefit lookups once [CAPTCHA solving](@/glossary/captcha-solving.md) and [proxy](@/glossary/proxies.md) control moved out of their scripts." Replacement: "Chronicle Legal already runs more than 100,000 government-portal sessions a month on managed browsers to keep disability cases fresh, and moving [CAPTCHA solving](@/glossary/captcha-solving.md) and [proxy](@/glossary/proxies.md) control out of agent scripts is usually what separates a workflow that logs in inconsistently from one that holds up under portal rate limits and bot challenges."
  src: https://steel.dev/customers/benny (404) · https://steel.dev/customers (404)
- [ACCURATE] · steel-product · Steel supplies stealth, CAPTCHA tooling, and managed proxies.
  → Optional: note that full Stealth Browser is an Enterprise feature and that Launch requires a $10 deposit to unlock CAPTCHA solving and Steel proxies.
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud
- [ACCURATE] · steel-product · Docs links: sessions-api/overview, profiles-api/overview, credentials-api/overview, files-api/overview.
  src: https://docs.steel.dev/overview/sessions-api/overview · https://docs.steel.dev/overview/profiles-api/overview


**Top improvements**
- (HIGH) Resolve the on-prem feature contradiction explicitly. Steel Local / self-hosted Steel Browser gives data residency but currently lacks the Credentials API, Files API, Captcha solving, and is single-concurrency. The article prescribes Credentials+Files+Captcha AND recommends on-prem for data residency in the same breath. Add a short 'Not yet / trade-off' note so regulated readers aren't surprised. — This is the exact audience that will act on the data-residency row and then hit a wall when Credentials/Files don't work self-hosted. Verified against the Steel Local vs Steel Cloud feature table.
- (HIGH) Replace all tier/concurrency language with the verified Launch/Scale/Enterprise tiers and remove the invented 'Pro' plan. Use concrete numbers (10/100/1,000+ concurrent; 15 min/1 hr/24 hr max session) and link the pricing page. — Wrong plan names and stale concurrency are the most easily falsified errors for an LLM answer engine evaluating citability.
- (HIGH) Either cite or remove the Chronicle Legal (100k sessions/mo) and Benny (40% lift) metrics. If real, add linkable case-study URLs and confirm customer consent to be named with a specific figure. — Unsourced named-customer metrics are the largest legal/reputational risk in the piece and the weakest point for answer-engine trust.


**Supporting material to add**
- Steel's current plan limits, quoted directly from the pricing page (verified Jun 30 2026): Concurrent sessions = Launch 10 / Scale 100 / Enterprise 1,000+; Max session time = 15 min / 1 hour / up to 24 hours; Data retention = 7 days / 14 days / Custom; Requests per minute = 60 / 600 / Custom; HIPAA-ready BAA on Scale and Enterprise. Citing these inline makes the concurrency and retention claims in the article accurate and answer-engine-citable.  _[where: Replace the concurrency claims in the intro and step 7; add retention windows wherever the article says 'before the plan retention window' (lines 44, 52, 62).]_  (https://docs.steel.dev/overview/pricinglimits)
- Steel homepage self-reported scale and speed stats: '800,000+ Browser Hours Served' and '<1s Avg. Session Start Time' (with the 'same region' qualifier). Useful as a concrete scale signal for the intro.  _[where: Add one sentence to the intro paragraph to substantiate the runtime thesis.]_  (https://steel.dev/)
- Government-wide FOIA backlog data from the DOJ Annual Reports (e.g., the most recent 'Summary of Annual FOIA Reports for Fiscal Year' shows tens of thousands of backlogged requests government-wide). This is the primary, citable evidence that FOIA queues are a real scaling problem — strengthening 'FOIA queues time out' (line 42) and 'Queue spikes melt flaky browser farms' (line 36).  _[where: Cite in the 'Where compliance teams lose hours' section to ground the FOIA-queue pain point in real government data rather than assertion.]_  (https://www.justice.gov/oip/foia-resources)
- Official Agent Traces export capability: 'Copy the run as markdown, download JSON, or grab a ZIP with markdown plus screenshots,' with video-sync to the recording. This is the accurate description of the 'agent log export' the article references, and is stronger evidence for the audit/legal-discovery use case than the vague 'agent logs' phrasing.  _[where: In the 'Investigations and evidence packages' workflow row and in 'Trust and audit controls,' replace 'agent logs' with 'Agent Trace exports (markdown/JSON/ZIP + screenshots, synced to the recording).']_  (https://docs.steel.dev/overview/agent-traces/overview)
- Profiles + Dedicated IPs identity pairing from the Profiles API doc: 'one profile plus one dedicated IP per account, so sites see the same cookies, storage, and a familiar IP.' Highly relevant to the per-jurisdiction docket-sweep pattern (line 41) and would upgrade it from a profile-only suggestion to a stronger anti-rate-limit setup.  _[where: Add to the 'Court docket sweeps' workflow row and to pattern step 2 as the recommended identity pairing for per-county portals.]_  (https://docs.steel.dev/overview/profiles-api/overview)



---


### browser-automation-for-rag-data-collection — readiness 6/10


**Title:** Browser Automation for RAG Data Collection


**Priority issues**
- (HIGH) Article uses invented Steel plan names 'Starter' and 'Pro'. Steel's actual plans (pricing page, Last Edit June 30, 2026) are Launch / Scale / Enterprise. Appears in two places: line 54 ('Steel Cloud Starter/Pro') and line 74 ('Cloud Starter in the tens, Pro >=100').
  → *Fix:* Line 54: 'Move from Steel Local (~1 session) to Steel Cloud (Launch or Scale) once the queue needs tens or hundreds of live sessions.' Line 74: 'Monitor plan caps (Steel Local ~1 session; Cloud Launch at 10 concurrent, Scale at 100, Enterprise 1,000+) and queue runs accordingly so crawls never silently stall.'
- (HIGH) Specific third-party statistic stated as fact without a source: 'Credal already processes more than 6 million URLs a month just to keep enterprise knowledge bases current.'
  → *Fix:* Either link to a primary source (a Credal case study or Steel customer page) or soften to a non-attributed, sourced framing, e.g.: 'Enterprise knowledge-base products routinely crawl millions of URLs per month to stay current.' If the 6M figure is real and Credal-approved, add the citation inline.
- (HIGH) Implies Stack AI and Zapier are Steel customers who 'learned the hard way', but no source confirms either uses Steel for this.
  → *Fix:* Drop the named-company framing or replace with a general observation: '...teams learned the hard way that public-site scraping eventually hits authenticated docs, JavaScript-only releases, or delta tracking that needs a long-lived browser.' If Stack AI/Zapier are confirmed customers with public case studies, link them.
- (MEDIUM) Frames the 24-hour session lifetime as generally available ('stay live for up to 24 hours', 'up to 24 hour lifetimes'). The 24h ceiling is Enterprise-only; Launch caps at 15 minutes and Scale at 1 hour.
  → *Fix:* Add a plan caveat, e.g.: '...stay live for up to 24 hours on Enterprise plans (15 minutes on Launch, 1 hour on Scale), and preserve portal trust...'
- (MEDIUM) The RAG workflow described depends on Files (step 5), Credentials (step 4), and managed CAPTCHA/proxies — none of which are supported on Steel Local per the Steel Local vs Steel Cloud comparison table. Yet the article positions Local as a viable dev/air-gapped tier for this workflow ('Steel Local for air-gapped or dev runs', 'Move from Steel Local... to Steel Cloud').
  → *Fix:* Clarify that the Files, Credentials, and managed-CAPTCHA features used here are Cloud-only, so Steel Local suits only prototyping navigation/selectors, e.g. in the deployment-options row: 'Steel Local for navigation prototyping only (no Files, Credentials, or managed CAPTCHA), Steel Cloud for managed proxies, CAPTCHA solving, Files/Credentials, and higher concurrency.'
- (MEDIUM) Performance claim 'Steel sessions spin up in under a second' / 'Sub-second cold starts' is not supported by any statement in Steel's docs.
  → *Fix:* Either cite a Steel benchmark for cold-start time or soften to a non-numeric claim: 'Steel sessions spin up fast and on demand...'
- (LOW) 'default interactive=false' is ambiguous/misleading: Steel's actual default for the interactive embed parameter is true (docs table: interactive | boolean | true).
  → *Fix:* Reword to remove ambiguity: 'Wrap debugUrl behind your SSO and explicitly set interactive=false (Steel defaults it to true), and log every escalation for human-in-loop approvals.'


**Claim checks** (verified verdict shown)
- [CONFIRMED-INACCURATE] · steel-pricing · Steel Cloud plan names are 'Starter' and 'Pro' (with Starter in the tens, Pro >=100 concurrent)  *(adversarially verified)*
  → Fix the plan names in both locations. (1) Step 7, line 54 — replace "Move from Steel Local (~1 session) to Steel Cloud Starter/Pro once the queue needs tens or hundreds of live sessions." with "Move from Steel Local (~1 session) to Steel Cloud Launch/Scale once the queue needs tens or hundreds of live sessions." (2) Traceability checklist, Concurrency limits row, line 74 — replace "Monitor plan caps (Steel Local ~1 session, Cloud Starter in the tens, Pro >=100) and queue runs accordingly so crawls never silently stall" with "Monitor plan caps (Steel Local ~1 session, Cloud Launch at 10, Scale at 100, Enterprise at 1,000+ concurrent) and queue runs accordingly so crawls never silently stall".
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/overview/pricing
- [NEEDS-SOFTENING] · steel-product · Steel sessions 'stay live for up to 24 hours' / 'up to 24 hour lifetimes'  *(adversarially verified)*
  → Soften both occurrences to qualify by plan. Lead paragraph (line 28) — replace "stay live for up to 24 hours" with "stay live for up to an hour on Scale and up to 24 hours on Enterprise". Sessions + Profiles row (line 59) — replace "up to 24 hour lifetimes" with "up to 1-hour lifetimes on Scale (24h on Enterprise)". These match the documented tier caps exactly.
  src: https://docs.steel.dev/overview/pricinglimits · https://steel.dev/pricing
- [ACCURATE] · steel-product · Steel Local runs '~1 session' of concurrency
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud
- [CONFIRMED-INACCURATE] · steel-product · Steel Local is a viable tier for this RAG workflow (air-gapped/dev runs that can 'burst to hundreds of sessions')  *(adversarially verified)*
  → Replace the "Deployment options" row (line 64) of the "Steel surfaces that matter here" table. CURRENT: "| Deployment options | Steel Local for air-gapped or dev runs, Steel Cloud for managed proxies, CAPTCHA solving, and higher concurrency | Keeps sensitive data on-prem when required while still letting production RAG crawlers burst to hundreds of sessions |". REPLACE WITH: "| Deployment options | Steel Cloud (Launch/Scale/Enterprise) for managed proxies, CAPTCHA solving, the Files and Credentials APIs, and 10–1,000+ concurrent sessions | This RAG pattern depends on Files, Credentials, and CAPTCHA — none of which Steel Local supports — so run it on Steel Cloud, where production crawls can burst to hundreds of sessions; Steel Local is capped at one session and suited only to navigation/extension prototyping |". Also fix the stale tier names on lines 54 and 74 ("Steel Cloud Starter/Pro" / "Cloud Starter in the tens, Pro >=100") to the real plan names: Launch (~10 concurrent), Scale (~100), Enterprise (1,000+).
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud · https://docs.steel.dev/overview/pricinglimits
- [ACCURATE] · steel-product · client.sessions.create with persistProfile: true; reuse profileId; profiles capped at 300 MB; profiles auto-deleted after 30 days of inactivity
  src: https://docs.steel.dev/overview/sessions-api/profiles
- [ACCURATE] · steel-product · sessions.release() / sessions.release; sessions.files.downloadArchive; files.upload
  src: https://docs.steel.dev/overview/sessions-api/overview · https://docs.steel.dev/overview/files-api/overview
- [ACCURATE] · steel-product · Files API provides 'automatic promotion of session files to global storage on release'
  src: https://docs.steel.dev/overview/files-api/overview
- [ACCURATE] · steel-product · Credentials API uses namespaces and an optional totpSecret field
  src: https://docs.steel.dev/overview/credentials-api/overview
- [NEEDS-SOFTENING] · steel-product · Wrap debugUrl behind SSO; default interactive=false  *(adversarially verified)*
  → Reword the checklist row from "Wrap `debugUrl` behind your SSO, default `interactive=false`, and log every escalation for human-in-loop approvals" to "Wrap `debugUrl` behind your SSO, override the default to `interactive=false` (Steel ships `interactive=true`), and log every escalation for human-in-loop approvals." This keeps the sound advice while correcting the impression that false is Steel's built-in default.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions · https://docs.steel.dev/overview/sessions-api/human-in-the-loop
- [ACCURATE] · steel-product · Everything releases with HLS replays plus agent logs
  src: https://docs.steel.dev/overview/sessions-api/replay
- [ACCURATE] · steel-pricing · Evidence retention window is 'the 7 or 14 day clock on your plan'
  src: https://docs.steel.dev/overview/pricinglimits
- [CONFIRMED-ACCURATE] · technical · Steel sessions 'spin up in under a second' / 'Sub-second cold starts'  *(adversarially verified)*
  → No change needed. The claim is directly backed by Steel's own live FAQ on steel.dev ("Under one second on average with no cold-start penalty" and "sub-second startup"), so the reviewer's 'unverifiable' verdict is overturned. Optional (not required) tightening for maximal precision if desired: change "spin up in under a second" to "spin up in under a second on average" to mirror the exact source qualifier — but the current phrasing is accurate and the table row "Sub-second cold starts" needs no edit.
  src: https://steel.dev/ (FAQ JSON-LD: 'How fast is Steel.dev at starting browser sessions?' -> 'Under one second on average with no cold-start penalty'; comparison FAQs: 'sub-second startup') · https://steel.dev/ ('Spin up on-demand browser sessions with a simple API call' - Sessions API section)
- [UNVERIFIABLE] · third-party · Credal already processes more than 6 million URLs a month  *(adversarially verified)*
  → Remove the unsourced Credal sentence and the adjacent unsourced name-drop. Replace this passage: "Instead of bolting Playwright or Selenium onto an ad hoc Chrome fleet, treat Steel as the managed browser tier for knowledge ingestion. Credal already processes more than 6 million URLs a month just to keep enterprise knowledge bases current, and teams like Stack AI or Zapier learned the hard way that public-site scraping eventually hits authenticated docs, JavaScript-only releases, or delta tracking that needs a long-lived browser." with: "Instead of bolting Playwright or Selenium onto an ad hoc Chrome fleet, treat Steel as the managed browser tier for knowledge ingestion. Teams building RAG pipelines learn the hard way that public-site scraping eventually hits authenticated docs, JavaScript-only releases, or delta tracking that needs a long-lived browser." (If a concrete third-party example is wanted, only restore one with a verifiable primary source — e.g., a named customer's own published case study — not an invented usage figure.)
  src: https://credal.ai/ (homepage: product positioned as 'The Control Plane for Enterprise Agents' / agent governance; no usage stats) · https://credal.ai/sitemap.xml (lists /case-studies, customer pages, and RAG blog posts; no slug referencing a URL-volume stat)
- [CONFIRMED-INACCURATE] · third-party · Stack AI and Zapier 'learned the hard way' (implying they are Steel customers for browser-based ingestion)  *(adversarially verified)*
  → Replace the named-company insinuation. ORIGINAL: "Credal already processes more than 6 million URLs a month just to keep enterprise knowledge bases current, and teams like Stack AI or Zapier learned the hard way that public-site scraping eventually hits authenticated docs, JavaScript-only releases, or delta tracking that needs a long-lived browser." REPLACE WITH: "Credal already processes more than 6 million URLs a month just to keep enterprise knowledge bases current. Any team that has pushed public-site scraping at scale eventually hits authenticated docs, JavaScript-only releases, or delta tracking that needs a long-lived browser." This drops the unsubstantiated (and, for Zapier, contradicted) Stack AI/Zapier customer implication while preserving the technical point. NOTE: the Credal "6 million URLs a month" figure is also unsourced — recommend flagging it separately for a citation before publish.
  src: https://steel.dev/ (homepage — no Stack AI/Zapier/Credal; 'Customer' only in 'Customer Service Agents') · https://steel.dev/customers (HTTP 404 — no customer page exists)
- [ACCURATE] · steel-product · Downloads land in a /files mount
  src: https://docs.steel.dev/overview/files-api/overview · https://docs.steel.dev/cookbook/files


**Top improvements**
- (HIGH) Add one concrete code snippet showing a tagged session creation with Files and release, e.g. client.sessions.create({ metadata: { jobId, sourceSlug, version }, persistProfile: true }) followed by sessions.files.downloadArchive and sessions.release. The article is all prose/tables; for a developer audience targeting answer engines, a real snippet is more citable and more useful than abstract steps. — Developer-focused RAG article with zero runnable code reads as marketing; a verified snippet proves the API shape and gives LLMs a copy-pasteable artifact to cite.
- (MEDIUM) After fixing plan names, add a one-line note that browser hours ($0.08-$0.10/min-billed), proxy bandwidth, and CAPTCHA solves are metered, so cost-aware RAG teams can estimate crawl cost. Currently the article implies scaling is free up to concurrency caps. — RAG ingestion is high-volume; cost is a primary adoption concern and omitting metered rates is a competitive blind spot vs. self-hosted Playwright.
- (HIGH) Soften or remove the unverified Credal/Stack AI/Zapier sentences, or replace with a general, defensible statement about the volume and difficulty of enterprise KB ingestion. If real, link the case studies. — Unsourced third-party stats and customer attributions are the highest legal/reputational risk in the piece and the easiest to challenge.


**Supporting material to add**
- Steel's own pricing/limits table is the authoritative source for every concurrency, session-time, RPM, and retention number in the article. Cite it directly so readers (and answer engines) can verify the plan caps.  _[where: First mention of plan caps or concurrency (Why RAG ingestion fights automation / Traceability checklist).]_  (https://docs.steel.dev/overview/pricinglimits)
- Steel Files API overview documents session-to-global auto-promotion on release — the mechanism that makes the article's 'attach the archive hash to the ingestion job' pattern auditable. Linking it turns an assertion into a citable feature.  _[where: Steel surfaces row for Files API, and Recommended pattern step 5/6.]_  (https://docs.steel.dev/overview/files-api/overview)
- Steel Profiles limits (300 MB cap, 30-day inactivity auto-delete, persistProfile/profileId lifecycle) — primary source for the article's profile reuse guidance.  _[where: Recommended pattern step 3.]_  (https://docs.steel.dev/overview/sessions-api/profiles)
- Steel's replay endpoint (GET /v1/sessions/{id}/hls) and the 'Replay completed sessions as MP4/HLS video' capability — concrete, linkable evidence for the audit/HLS-replay thesis.  _[where: Steel surfaces row (Observability stack) and Traceability checklist (Dataset lineage / Evidence retention).]_  (https://docs.steel.dev/overview/sessions-api/replay)
- The Steel Local vs Steel Cloud feature matrix is the authoritative source showing Files, Credentials, and CAPTCHA are Cloud-only — use it to fix the Local-framing issue and ground the deployment recommendation.  _[where: Steel surfaces (Deployment options row) and Recommended pattern step 7.]_  (https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud)



---


### browser-automation-for-security-questionnaires — readiness 6/10


**Title:** Automating Security Questionnaires With Browser Agents


**Priority issues**
- (BLOCKER) The '24 hour window' / 'Sessions run up to 24 hours' framing is stated as a general Steel capability, but the 24-hour max session time is Enterprise-only. Per the pricing/limits page (verified July 2026), max session time is 15 minutes on Launch, 1 hour on Scale, and 'Up to 24 hours' on Enterprise. This appears in the lede ('keep it alive for the full 24 hour window') and in the recommended pattern ('Sessions run up to 24 hours, so chain questionnaires by vendor within that window').
  → *Fix:* Rewrite the lede: '...spin up a session on demand, keep it alive across the questionnaire lifecycle (up to 24 hours on Enterprise; 1 hour on Scale and 15 minutes on Launch), and let approvals plus evidence exports ride on the same session instead of bouncing between spreadsheets and ad hoc screen shares.' Rewrite step 7: 'Max session time is plan-gated — 15 minutes on Launch, 1 hour on Scale, up to 24 hours on Enterprise — so chain questionnaires by vendor within your plan's window and close each with sessions.release() (or sessions.releaseAll() for a batch) once the answer set and evidence export complete.'
- (HIGH) Self-hosted Steel Browser is presented as a drop-in VPC alternative, but the workflow this article is built on cannot run self-hosted: the Steel Local vs Steel Cloud table marks Credentials API ('Not supported') and Files API ('Not supported') as Cloud-only. The article's data-residency row says 'switch to self-hosted Steel Browser when questionnaires must stay inside your VPC' with no caveat.
  → *Fix:* Update the data-residency row: 'Run Steel Cloud when you need managed proxies, CAPTCHA solving, and the Credentials and Files APIs. Self-hosted Steel Browser (steel-dev/steel-browser) keeps traffic inside your VPC, but Credentials and Files are Cloud-only today — on self-host you must handle credential injection and evidence archives yourself.' Add a line under 'Not yet': 'Workloads that require both full VPC isolation AND the Credentials/Files APIs in one platform.'
- (HIGH) 'spin up a session in under a second' (lede) is unsubstantiated. Steel's own docs corpus never claims sub-second session creation; the only 'under a second' references in the docs are for HTTP fetches and collapsed CDP round-trips, not session boot. Cookbook references describe full runs in the ~20-40 second range.
  → *Fix:* Drop the specific figure: '...spin up a session on demand, keep it alive across the questionnaire lifecycle...' (also resolves the 24h issue above). If a timing claim is desired, source it: run a benchmark, cite it as self-reported, and state the conditions (cold vs warm, region).
- (MEDIUM) The 'Not yet' bullet 'Portals that require hardware tokens with no SMS or TOTP fallback' implies Steel supports SMS-based MFA. Steel's Credentials API supports TOTP only (totpSecret); there is no SMS support documented.
  → *Fix:* Reword: 'Portals that require hardware security keys or push-based MFA — the Credentials API injects TOTP codes only, so portals without a TOTP option (including SMS-only and WebAuthn-only flows) are not supported.'
- (LOW) 'Steel Cloud plans start in the tens of concurrent sessions and scale into the hundreds' is loose. Verified concurrency is 10 on Launch, 100 on Scale, 1,000+ on Enterprise. 'Tens' for the Launch value of exactly 10 is a mild overstatement, and 'hundreds' undersells Enterprise.
  → *Fix:* In the 'Watch plan fit' bullet, replace with concrete caps: 'Steel Cloud concurrency is 10 sessions on Launch, 100 on Scale, and 1,000+ on Enterprise, so size the questionnaire season against your tier before the queue spikes.'


**Claim checks** (verified verdict shown)
- [NEEDS-SOFTENING] · steel-product · keep it alive for the full 24 hour window  *(adversarially verified)*
  → Edit the lede sentence (line 28) from: "spin up a session in under a second, keep it alive for the full 24 hour window, and let approvals plus evidence exports ride on the same lifecycle" TO: "spin up a session in under a second, keep it alive across its plan window (up to 24 hours on Enterprise, 1 hour on Scale), and let approvals plus evidence exports ride on the same lifecycle". Also fix the second occurrence at line 53 from: "Sessions run up to 24 hours, so chain questionnaires by vendor within that window" TO: "Sessions run up to 24 hours on Enterprise (1 hour on Scale), so chain questionnaires by vendor within your plan's window".
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/overview/sessions-api/session-lifecycle
- [NEEDS-SOFTENING] · steel-product · Sessions run up to 24 hours, so chain questionnaires by vendor within that window  *(adversarially verified)*
  → Replace the sentence with: "Set an explicit `timeout` (in milliseconds) when you create each session so one browser can finish several questionnaires for the same vendor back-to-back — Steel caps session length at 15 minutes on Launch, 1 hour on Scale, and up to 24 hours on Enterprise, and the default is only 5 minutes, so always set it explicitly."
  src: https://docs.steel.dev/overview/sessions-api/session-lifecycle · https://docs.steel.dev/overview/pricinglimits
- [UNVERIFIABLE] · steel-product · spin up a session in under a second  *(adversarially verified)*
  → Soften the lede by dropping the unverified numeric claim while keeping the documented 24-hour lifetime. Replace "spin up a session in under a second, keep it alive for the full 24 hour window" with "spin up an on-demand session, keep it alive for the full 24-hour window". (If a number is desired, Steel must publish a session-boot benchmark on docs.steel.dev before it can be cited; until then the precise timing should not be asserted as fact.)
  src: https://docs.steel.dev/llms-full.txt · https://docs.steel.dev/overview/sessions-api/multi-region
- [ACCURATE] · steel-product · enable the default auto submit plus field blurring so secrets never leak back to the agent
  src: https://docs.steel.dev/overview/credentials-api/overview
- [ACCURATE] · steel-product · Use totpSecret when portals require MFA so Steel injects fresh codes on demand
  src: https://docs.steel.dev/overview/credentials-api/overview
- [ACCURATE] · steel-product · Embed the debugUrl with interactive=true and showControls=true
  src: https://docs.steel.dev/overview/sessions-api/human-in-the-loop
- [ACCURATE] · steel-product · close them with sessions.release() to free capacity
  → Optionally mention sessions.releaseAll() for the annual recertification batch scenario.
  src: https://docs.steel.dev/overview/sessions-api/session-lifecycle
- [ACCURATE] · steel-product · Upload ... into Global Files once, then mount them into each session ... keep downloads in the /files directory ... Use the archive endpoint after sessions.release
  src: https://docs.steel.dev/overview/files-api/overview
- [ACCURATE] · steel-product · Steel Local is perfect for development but caps concurrency around a single session
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud
- [CONFIRMED-INACCURATE] · steel-pricing · Steel Cloud plans start in the tens of concurrent sessions and scale into the hundreds  *(adversarially verified)*
  → Replace with: "Steel Cloud plans scale from 10 concurrent sessions on Launch, through 100 on Scale, up to 1,000+ on Enterprise." This states the real tier bounds exactly as published in Steel's Pricing/Limits table (Launch=10, Scale=100, Enterprise=1,000+) and removes both the loose "tens" framing and the "hundreds" ceiling that understates Enterprise by 10x.
  src: https://docs.steel.dev/overview/pricinglimits · https://steel.dev/pricing
- [NEEDS-SOFTENING] · steel-product · switch to self-hosted Steel Browser when questionnaires must stay inside your VPC  *(adversarially verified)*
  → Edit the "Data residency" row's "How to wire it" cell (line 62) of content/articles/browser-automation-for-security-questionnaires.md. Replace: "Run Steel Cloud when you need managed proxies and CAPTCHA solving, or switch to self-hosted Steel Browser when questionnaires must stay inside your VPC" with: "Run Steel Cloud when you need managed proxies and CAPTCHA solving. Self-hosted Steel Browser (Steel Local) keeps sessions inside your VPC, but the Credentials and Files APIs are Cloud-only — so credential injection, TOTP autofill, and the Global Files archive must be swapped for a self-hosted equivalent before this workflow runs fully on-prem." Optionally mirror this limitation in the "Not yet" section (e.g., add: "Self-hosted (Steel Local) deployments that still need the Credentials API or Files API, which are Cloud-only").
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud · https://github.com/steel-dev/steel-browser
- [ACCURATE] · third-party · SOC 2, SIG, CAIQ, VSA, and bespoke questionnaires
  src: https://docs.steel.dev/overview/credentials-api/overview
- [ACCURATE] · competitor · GRC teams that already orchestrate questionnaires in tools like Hyperproof or Vanta
- [ACCURATE] · steel-product · nothing depends on plan retention windows (Mirror evidence on release)
  → Optionally cite the 7/14-day windows to make the urgency concrete.
  src: https://docs.steel.dev/overview/pricinglimits


**Top improvements**
- (HIGH) Add a short 'Plan-fit' callout box near the top stating the session-time and concurrency caps by tier (Launch/Scale/Enterprise). This is the single highest-leverage addition: it converts the misleading 24h framing into accurate, citable guidance and pre-empts the most likely buyer failure mode. — The article is written for GRC teams running long, approval-gated portal workflows — exactly the workload that breaks against 15-min/1-hr session caps. Stating the caps up front is more useful than any feature list.
- (HIGH) Reconcile the self-host/VPC path with the article's Cloud-only dependencies. Either caveat it (Credentials + Files unavailable) or reframe the VPC option as 'Steel Cloud with Dedicated IPs / region pinning' rather than full self-host, since self-host removes the APIs the article teaches. — The data-residency row currently implies an equivalent swap that does not exist; this is the second-most-likely place a reader gets burned.
- (MEDIUM) Add one worked code snippet: create a session with metadata + namespace + credentials:{} + a Files-mounted attachment, then embed debugUrl?interactive=true&showControls=true. The article is currently all prose/tables with no copyable code, which undercuts its 'developer' audience targeting and answer-engine citability. — Docs-accurate code (verified method/casing) raises usefulness and gives LLM answer engines a concrete artifact to cite.


**Supporting material to add**
- Steel plan table (verified July 2026): Max session time 15min (Launch) / 1hr (Scale) / up to 24hr (Enterprise); Concurrent sessions 10 / 100 / 1,000+; Data retention 7 days / 14 days / Custom; Stealth Browser Enterprise-only; Dedicated IPs $5/IP-month on Scale.  _[where: Recommended pattern step 6 'Watch plan fit' and the lede / step 7 session-duration claims]_  (https://docs.steel.dev/overview/pricinglimits)
- Steel Local vs Steel Cloud feature matrix: Credentials API and Files API are 'Not supported' on Steel Local; Captcha Solving 'None' on Local; Proxies 'Bring your own' on Local vs '+ Steel Managed' on Cloud; Local concurrency = 1.  _[where: Trust and approvals checklist, 'Data residency' row, plus a new 'Not yet' bullet about VPC + Credentials/Files together]_  (https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud)
- sessions.releaseAll() bulk-release method exists in the SDK for cleaning up all active sessions at once.  _[where: Annual recertification row of the Workflow map and step 7 of the recommended pattern]_  (https://docs.steel.dev/overview/sessions-api/session-lifecycle)
- Steel Credentials are described in docs as 'currently in beta and ... free to use and store credentials during this period.'  _[where: Recommended pattern step 2 (Namespace credentials)]_  (https://docs.steel.dev/overview/credentials-api/overview)


**Broken / malformed links**
- `(@/glossary/credentials-api.md)` — None — link is valid. Verified content/glossary/credentials-api.md exists in the repo.
- `https://docs.steel.dev/overview/sessions-api/overview` — None — resolves HTTP 200.
- `https://docs.steel.dev/overview/credentials-api/overview` — None — resolves HTTP 200.
- `https://docs.steel.dev/overview/files-api/overview` — None — resolves HTTP 200.
- `https://docs.steel.dev/overview/sessions-api/human-in-the-loop` — None — resolves HTTP 200.
- `https://docs.steel.dev/overview/pricing (NOT in article, but relevant)` — The canonical Steel pricing URL is https://docs.steel.dev/overview/pricinglimits (no hyphen) — /overview/pricing and /pricing both 404. The article does not link to pricing, but if the plan-fit edits add a pricing link, use the pricinglimits URL, not /pricing. → If adding a pricing reference: link https://docs.steel.dev/overview/pricinglimits


---


### browser-automation-vs-api — readiness 7/10


**Title:** Browser Automation vs API: When to Use Each


**Priority issues**
- (HIGH) "Sessions start in under a second, last up to 24 hours" (line 73) is misleading on both ends. The 24h ceiling is Enterprise-only: per the live pricing page (Last Edit 2026-06-30), max session time is 15 min on Launch, 1 hour on Scale, and up to 24 hours on Enterprise. The "under a second" startup is a self-reported Steel benchmark whose own source adds "when client is in same region" — a qualifier the article drops.
  → *Fix:* Replace line 73's sentence with: "Pilot with Steel sessions. Sessions start in under a second when your client is in the same region (Steel-measured), and stay alive from 15 minutes on Launch up to 24 hours on Enterprise — long enough to test one full workflow without rebuilding tooling."
- (MEDIUM) The concurrency and session-time claims ("100+ concurrent sessions", "last up to 24 hours") are stated without pointing at the one page that proves them.
  → *Fix:* In the Next steps, add: "Check plan-level concurrency (10 / 100 / 1,000+) and session-time caps (15 min to 24 h) on the [Pricing & limits page](https://docs.steel.dev/overview/pricinglimits)."
- (LOW) Feature casing: the article writes "the CAPTCHAs API" (line 55). Steel's own docs and the Local-vs-Cloud comparison table consistently title it "Captchas API" (title case, one word).
  → *Fix:* On line 55, change "the CAPTCHAs API" to "the Captchas API"; leave the generic noun phrase "CAPTCHA solving" (line 65) as-is since that usage is correct.


**Claim checks** (verified verdict shown)
- [NEEDS-SOFTENING] · steel-product · Sessions start in under a second, last up to 24 hours  *(adversarially verified)*
  → Replace "Sessions start in under a second, last up to 24 hours" with "Sessions start in under a second when the client is in the same region, and last up to 24 hours on Enterprise plans (15 min on Launch, 1 hour on Scale)."
  src: https://steel.dev/ · https://docs.steel.dev/overview/pricinglimits
- [ACCURATE] · steel-product · point your Playwright or Puppeteer code at Steel Cloud for 100+ concurrent sessions
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud · https://docs.steel.dev/overview/pricinglimits
- [ACCURATE] · steel-product · Steel Cloud gives you managed residential proxies, stealth fingerprints, and the CAPTCHAs API
  → Change "the CAPTCHAs API" to "the Captchas API" to match the docs casing.
  src: https://docs.steel.dev/overview/stealth/proxies · https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud
- [ACCURATE] · steel-product · browser runs include live view, HLS replay, and artifacts
  src: https://docs.steel.dev/llms-full.txt · https://docs.steel.dev/overview/sessions-api/embed-sessions
- [ACCURATE] · steel-product · Credentials API, Files API, and session embeds let you store secrets, ship downloads, and review runs
  src: https://docs.steel.dev/overview/credentials-api/overview · https://docs.steel.dev/overview/files-api/overview
- [ACCURATE] · steel-product · Build on the open-source Steel Browser for single-session prototypes ... same Playwright or Puppeteer code at the managed fleet
  src: https://github.com/steel-dev/steel-browser · https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud
- [ACCURATE] · steel-product · Steel handles stealth presets, CAPTCHA solving, multi-region routing
  src: https://docs.steel.dev/overview/sessions-api/multi-region · https://docs.steel.dev/overview/stealth/captcha-solving
- [ACCURATE] · statistic · Pulling 10,000 records per minute from an API is easier than keeping 10,000 DOM queries in sync


**Top improvements**
- (MEDIUM) Add a short "Hybrid pattern" note acknowledging that most production teams run both — an API for the 80% case plus browser automation for the auth-gated / UI-only remainder. The article currently frames API vs browser as a binary, which understates the common real-world architecture and is a competitive blind spot (every serious vendor pitches this hybrid). — Decision guides that acknowledge the mixed pattern read as more honest and rank better for "when to use" queries, where the nuanced answer is the right answer.
- (LOW) Tighten the "How Steel handles the browser side" section to use the docs' canonical names: "Captchas API" (not "CAPTCHAs API"), and optionally "Agent Traces" alongside "structured agent logs" so answer-engines map the phrase to the docs page. — Term alignment with the primary source helps LLM/answer-engine retrieval and avoids the appearance of invented feature names.
- (LOW) In the Trade-offs table, the "What to measure" column promises metrics (Requests per second vs session minutes; Block rate, proxy burn, CAPTCHA spend; Mean time to resolve incidents) but the article never circles back to how to get those numbers from Steel. Add one sentence pointing at the dashboard usage meters (session time, proxy bandwidth, captcha solves) named on the pricing page. — The pricing page explicitly lists metered dimensions in the dashboard; referencing it closes the loop the table opens.


**Supporting material to add**
- Steel's own live Pricing & Limits table (verified 2026-07-13, page Last Edit 2026-06-30): concurrency 10/100/1,000+ on Launch/Scale/Enterprise; max session time 15 min / 1 hour / up to 24 hours; browser hours $0.10–$0.08/hr; captcha solves $3–$1/1k; requests-per-minute 60/600/custom; data retention 7/14 days.  _[where: Decision workflow step 5 (line 74) and/or Next steps, to substantiate the concurrency and session-life claims.]_  (https://docs.steel.dev/overview/pricinglimits)
- Steel's published session-startup benchmark: "Average session starts in less than 1s when client is in same region," with a 500 ms (Steel) vs 5,000 ms (Competition) comparison. This is the primary source for the article's "start in under a second" claim.  _[where: Decision workflow step 4 (line 73), attached to the startup claim.]_  (https://steel.dev/)
- Steel Local vs Steel Cloud feature matrix (concurrency 1 vs 100+, stealth, captcha, proxies, multi-region, credentials, files, extensions) — direct primary source for the "same API locally and in Cloud" and "100+ concurrent" statements.  _[where: How Steel handles the browser side (line 83) — already linked in Next steps; could be linked inline at line 74 too.]_  (https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud)
- Steel Managed Residential Proxies description: "Hundreds of millions of IP addresses sourced from legitimate residential connections," US by default with global targeting, automatic rotation — supports the "managed residential proxies" framing.  _[where: When browser-first is the default (line 55) or Trade-offs table anti-bot row (line 65).]_  (https://docs.steel.dev/overview/stealth/proxies)



---


### browser-infrastructure-for-ai-agents-compared — readiness 4/10


**Title:** AI Agent Browser Infrastructure: 5 Options Compared


**Priority issues**
- (BLOCKER) Headline claim 'Steel leads the measurable side' is contradicted by Steel's own current benchmark data. The cited blog (Nov 7, 2025) showed Steel ahead, but the open repo's committed results were re-run in Jan 2026 and show Kernel faster than Steel end-to-end (Kernel avg=794ms/p95=1006ms vs Steel avg=894ms/p95=1090ms). A reader who runs the open harness now — which the article explicitly invites — will likely not see Steel leading.
  → *Fix:* Either re-run the benchmark and update all numbers (Steel avg/p95, Kernel, Browserbase) to current values, or date the claim explicitly, e.g. 'In Steel's Nov 2025 benchmark Steel led; the open harness has since been re-run and Kernel currently measures faster end-to-end, so re-run it in your own region before procuring.' At minimum change 'Steel leads the measurable side' to 'Steel measured fastest in our Nov 2025 benchmark'.
- (BLOCKER) Browserbase is repeatedly described as 'rrweb-only' / 'rrweb-based replays' / 'rrweb recordings'. This is stale and inaccurate: Browserbase's docs state 'rrweb is being deprecated' and that every session is recorded as video, with an HLS Session Replay API (.m3u8 playlists) for embedded playback — the same MP4/HLS format the article presents as Steel's differentiator.
  → *Fix:* Replace the rrweb framing everywhere. Snapshot table observability cell for Browserbase: 'Session Inspector plus automatic per-session video recordings and HLS replay API.' Drop 'rrweb-only captures' from the intro and the 'Evidence vs cost focus' paragraph; instead contrast on Steel's actual differentiator (Agent Traces structured timeline + downloadable artifact bundle + self-host option).
- (HIGH) The word 'independent' is used for a benchmark Steel authored and ran itself ('Lifecycle speed trails Steel and Kernel in independent benchmarks').
  → *Fix:* Change 'independent benchmarks' to 'Steel's open benchmark (Nov 2025)' wherever it appears, and add a one-line disclosure near the first benchmark mention: 'This is a Steel-run benchmark; the harness is open so you can reproduce it.'
- (HIGH) 'Profiles persist auth up to 30 days' is the wrong framing. Steel's docs say a profile is auto-deleted only after 30 days of inactivity; auth itself persists indefinitely as long as the profile is used within that window.
  → *Fix:* Change to: 'Profiles persist auth, cookies, and browser identity across sessions; profiles that go unused for 30 days are deleted.'
- (MEDIUM) Cloudflare product name is stale. 'Browser Rendering' has been renamed 'Browser Run' (Cloudflare docs: 'Browser Run, formerly known as Browser Rendering'). The article uses only the old name.
  → *Fix:* Use 'Cloudflare Browser Run (formerly Browser Rendering)' on first mention.
- (HIGH) 'Smooth' is included as a named comparison vendor but I could not verify it from a working primary source: smoothbrowser.com returns a ~114-byte empty shell, smooth.dev does not resolve, and the '5x faster, 7x cheaper' claims could not be confirmed. Listing an unverifiable vendor alongside established competitors lends those unverified claims credibility by association.
  → *Fix:* Either verify Smooth's claims from a working primary source and cite it, or drop Smooth from the named-vendor table and refer generically to 'emerging low-cost providers' instead of quoting specific 5x/7x figures as fact.
- (MEDIUM) Kernel's '72-hour sessions' and 'no idle billing' claims could not be verified from Kernel's static docs (kernel.sh/docs). The docs confirm MP4 replays, headful browsers, unikernels, and browser pools, but not the 72h ceiling or the exact 'no idle billing' wording.
  → *Fix:* Soften to language Kernel's docs actually support ('long-lived headful sessions', 'reserved browser pools with idle browsers you can flush'), or cite the specific Kernel page that states 72h/no-idle-billing. Remove 'customer benchmarks submitted back to the open browserbench harness' — there is no evidence in the Steel repo that Kernel submitted anything.


**Claim checks** (verified verdict shown)
- [NEEDS-SOFTENING] · statistic · Steel leads the measurable side with 0.89 second average lifecycle and 1.09 second p95 in the open remote benchmark.  *(adversarially verified)*
  → Replace: "Steel leads the measurable side with 0.89 second average lifecycle and 1.09 second p95 in the open remote benchmark, while Browserbase, Kernel, Browserless, and Smooth make different bets on stack opinionation, observability, and pricing." With: "Steel measures a 0.89 second average lifecycle and 1.09 second p95 in the open remote benchmark (5,000-run create to release loop); Kernel's January 2026 re-run in the same harness now edges it on raw latency (0.79 s average, 1.01 s p95), while Browserbase, Browserless, and Smooth make different bets on stack opinionation, observability, and pricing." (This keeps Steel's verified numbers, drops the refuted "leads," and states Kernel's current repo position honestly.)
  src: https://steel.dev/blog/remote-browser-benchmark · https://github.com/steel-dev/browserbench
- [ACCURATE] · statistic · 25.6 percent control-plane cost over 5,000 runs (Steel).
  src: https://steel.dev/blog/remote-browser-benchmark · https://github.com/steel-dev/browserbench
- [STALE] · competitor · Browserbase benchmark p95 around 1.87 s today.  *(adversarially verified)*
  → Replace the Browserbase cell in the Startup evidence row (line 81). Change "Published customer stories; benchmark p95 around 1.87 s today" to "Published customer stories; benchmark p95 around 3.89 s in the open harness (Jan 2026 re-run)". This matches the current committed browserbase.jsonl (avg 2.97 s, p95 3.89 s), removes the misleading "today", and reinforces the article's point that Browserbase trails Steel.
  src: https://github.com/steel-dev/browserbench · https://raw.githubusercontent.com/steel-dev/browserbench/main/results/browserbase.jsonl
- [CONFIRMED-INACCURATE] · competitor · Browserbase relies on rrweb-only captures / rrweb-based replays.  *(adversarially verified)*
  → Replace the rrweb framing in all four locations with accurate, current language. Concrete edits:

1) Line 45 (Intro, "Audit evidence" step). CURRENT: "If yes, skip providers that rely on rrweb-only captures or lack human-in-loop handoff." REPLACE WITH: "If yes, skip providers that lack downloadable artifacts, structured logs, or human-in-loop handoff."

2) Line 59 (Browserbase section). CURRENT: "Built-in inspector, rrweb-based replays, and optional managed stealth" REPLACE WITH: "Built-in Session Inspector with auto-recorded video and HLS session replays, plus optional managed stealth"

3) Line 82 (Snapshot table, Observability row, Browserbase cell). CURRENT: "Inspector and rrweb replays tied to plan" REPLACE WITH: "Session Inspector with auto-recorded video and HLS replay"

4) Line 92 (Trade-offs, "Evidence vs cost focus"). CURRENT: "Healthcare and financial ops teams using Browserbase or Kernel still cite missing evidence as the blocker when rrweb recordings or six hour session caps get in the way. Steel's MP4/HLS stack and 24 hour sessions are heavier but unblock audits" REPLACE WITH: "Healthcare and financial ops teams using Browserbase or Kernel still cite missing evidence as the blocker when sessions lack downloadable artifacts or six-hour session caps get in the way. Steel's downloadable artifacts and 24-hour sessions are heavier but unblock audits"

Rationale: drop every "rrweb-only / rrweb-based" assertion (false — video is the default), drop the MP4/HLS-vs-Browserbase contrast in the trade-offs section (Browserbase now also ships video + HLS, so it is no longer a real differentiator), and pivot the evidence differentiator to Steel's downloadable artifacts / structured logs / 24-hour session cap, which remain genuine points of contrast.
  src: https://docs.browserbase.com/platform/browser/observability/session-recording · https://docs.browserbase.com/platform/browser/observability/session-replay
- [ACCURATE] · competitor · Browserbase caps session length at six hours today.
  src: https://docs.browserbase.com/account/billing/plans.md
- [ACCURATE] · competitor · Browserbase case studies (Aomni, PromptLoop, Commure) show sales research and healthcare claims at scale.
  src: https://www.browserbase.com/customer-stories
- [ACCURATE] · competitor · Kernel positions itself as 5.8x faster at cold starts and 3.72x faster end to end than Browserbase.
  → Keep but label as Kernel-reported, and note the same repo shows Kernel also ahead of Steel.
  src: https://docs.onkernel.com/introduction · https://github.com/steel-dev/browserbench
- [NEEDS-SOFTENING] · competitor · Kernel: customer benchmarks submitted back to the open browserbench harness.  *(adversarially verified)*
  → Replace the clause "with customer benchmarks submitted back to the open browserbench harness" with "with results re-run and submitted back to the open browserbench harness by Kernel's own team (the submission made Kernel the fastest provider in the sample)." Full replacement sentence: "Kernel positions itself as 5.8x faster at cold starts and 3.72x faster end to end than Browserbase, with results re-run and submitted back to the open browserbench harness by Kernel's own team (the submission made Kernel the fastest provider in the sample)."
  src: https://github.com/steel-dev/browserbench · https://github.com/steel-dev/browserbench/pull/1
- [CONFIRMED-ACCURATE] · competitor · Kernel supports 72-hour sessions for human-in-loop pauses.  *(adversarially verified)*
  → No change needed. The 72-hour figure is exactly correct (259200s = 72h) and is sourced directly from Kernel's own API reference for POST /browsers. Optional precision tweak if the author wants maximum rigor: "Kernel supports a 72-hour inactivity timeout, enough headroom for long human-in-loop pauses." — but the current phrasing is accurate and defensible.
  src: https://kernel.sh/docs/api-reference/browsers/create-a-browser-session · https://kernel.sh/docs/llms.txt
- [ACCURATE] · competitor · Kernel ships MP4 replays, headful browsers, unikernel stack.
  src: https://docs.onkernel.com/llms.txt · https://kernel.sh/docs/browsers/replays.md
- [ACCURATE] · competitor · Browserless offers API + BrowserQL, Playwright/Puppeteer over managed or self-hosted Docker, Zapier/n8n/LangChain integrations, CAPTCHA solving, reconnect APIs, residential proxies, usage-based billing, debugger UI.
  src: https://www.browserless.io · https://docs.browserless.io
- [STALE] · competitor · Cloudflare Browser Rendering gives you edge locations and Workers-native auth.  *(adversarially verified)*
  → Replace "Cloudflare Browser Rendering gives you edge locations and Workers-native auth." with "Cloudflare Browser Run (formerly Browser Rendering) runs on Cloudflare's global edge network and deploys natively inside Workers." — This fixes the stale product name (Browser Run), keeps the accurate edge-network point, and corrects "Workers-native auth" to the documented Workers-native deployment model. Apply the same rename to any other "Browser Rendering" references in the snapshot table.
  src: https://developers.cloudflare.com/browser-run/ · https://developers.cloudflare.com/browser-run/get-started/
- [CONFIRMED-INACCURATE] · competitor · Smooth markets itself as a 5x faster, 7x cheaper browser agent API.  *(adversarially verified)*
  → Remove the unverifiable "Smooth" competitor entirely from the comparison, since no working product, marketing page, or source for the 5x/7x figures exists and Smooth is cited unsourced throughout the article. For the SPECIFIC flagged line (line ~73), replace: "Smooth markets itself as a 5x faster, 7x cheaper browser agent API; Cloudflare Browser Rendering gives you edge locations and Workers-native auth." with: "Cloudflare Browser Rendering gives you edge locations and Workers-native auth and is tuned for edge rendering more than trust-heavy agent workflows." (Then also scrub Smooth from the summary line 4, description line 22, lede lines 28 and 30, the table rows at lines 40 and 79, and the body paragraphs at lines 92-94 and 106 — or replace the whole five-way comparison with a four-way one: Steel, Browserbase, Kernel, Browserless.)
  src: https://smoothbrowser.com/ (114-byte redirect shell -> /lander -> forsale.godaddy.com/forsale/smoothbrowser.com, HTTP 403; parked on Afternic nameservers ns1/ns2.afternic.com; parking IPs 76.223.54.146, 13.248.169.48) · https://www.whois.com/whois/smoothbrowser.com (created 2025-08-22, registrar Unstoppable Domains, status ACTIVE)
- [CONFIRMED-INACCURATE] · steel-product · Profiles persist auth up to 30 days (Steel).  *(adversarially verified)*
  → Replace "Profiles persist auth up to 30 days (Steel)." with "Profiles persist auth/cookies across sessions; unused profiles are auto-deleted after 30 days (Steel)." This keeps the real 30-day figure but correctly attributes it to the inactivity-deletion window rather than implying auth expires.
  src: https://docs.steel.dev/overview/profiles-api/overview · https://docs.steel.dev/cookbook/profiles
- [ACCURATE] · steel-product · Sessions up to 24 h (Steel).
  → Optionally qualify: 'sessions up to 24 h on Enterprise (15 min Launch / 1 h Scale).'
  src: https://docs.steel.dev/llms.mdx/overview/pricinglimits · https://docs.steel.dev/llms.mdx/overview/sessions-api/session-lifecycle
- [ACCURATE] · steel-product · Steel Local is effectively a single session control plane; Steel Cloud plans reach hundreds of sessions.
  src: https://docs.steel.dev/llms.mdx/overview/self-hosting/steel-local-vs-steel-cloud · https://docs.steel.dev/llms.mdx/overview/pricinglimits
- [ACCURATE] · steel-product · Every Steel session ships with live viewer, agent logs, and MP4/HLS replay.
  → Note that Browserbase offers analogous video+HLS, so this is not a unique differentiator; Steel's actual unique observability feature is Agent Traces (structured agent-activity timeline) plus downloadable markdown/JSON/ZIP bundles.
  src: https://docs.steel.dev/llms.mdx/overview/sessions-api/embed-sessions · https://docs.steel.dev/llms.mdx/overview/agent-traces/overview
- [ACCURATE] · steel-product · Steel does not ship an opinionated agent planner like Stagehand.
  src: https://docs.steel.dev/llms.txt · https://docs.browserbase.com/llms.txt
- [ACCURATE] · steel-product · Open-source self-host 'Steel Browser' for local/single-session tests, same code on Steel Cloud.
  src: https://docs.steel.dev/llms.txt · https://docs.steel.dev/llms.mdx/overview/self-hosting/steel-local-vs-steel-cloud


**Top improvements**
- (HIGH) Re-run the benchmark and refresh every number, or stamp a clear 'as of Nov 2025' date and add a caveat that the open repo's Jan 2026 re-run shows Kernel ahead of Steel. The article currently invites readers to run the open harness, which will surface the contradiction. — The central 'Steel leads on speed' thesis is falsified by Steel's own current repo data; this is the single biggest credibility risk.
- (HIGH) Rewrite the Browserbase observability framing: it has video + HLS replay + Session Inspector, and rrweb is deprecated. Restate Steel's real differentiator as Agent Traces (structured agent-activity timeline + markdown/JSON/ZIP exports) plus self-host, not the video format. — The current rrweb-only contrast is false and easily disproven from Browserbase's own docs; competitor capability claims are the most legally sensitive part of a comparison piece.
- (HIGH) Replace 'independent benchmarks' with 'Steel's open benchmark' and add a one-line self-disclosure that Steel authored and ran it. — Calling a vendor's own benchmark 'independent' is a trust-killer that answer-engine and competitor scrutiny will flag immediately.


**Supporting material to add**
- Steel pricing/limits table (verified 2026, last edited June 30, 2026): concurrency 10/100/1,000+ (Launch/Scale/Enterprise), max session 15 min / 1 hr / up to 24 hrs, browser hours $0.10/$0.08, captcha $3/$1 per 1k, RPS 60/600/custom, retention 7/14/custom days.  _[where: Concurrency planning section and the Steel 'Performance' bullet, to ground the qualitative 'predictable concurrency caps' line in citable numbers.]_  (https://docs.steel.dev/llms.mdx/overview/pricinglimits)
- Browserbase's own Session Replay API (HLS) and session-recording docs, which show Browserbase records every session as video and streams HLS for embedded playback — evidence that the rrweb-only contrast is wrong.  _[where: Browserbase section and the observability row of the snapshot table, to correct the framing.]_  (https://docs.browserbase.com/platform/browser/observability/session-replay.md)
- Steel's own repo (browserbench) README results table and committed JSONL, which show Kernel measuring faster than Steel as of the Jan 2026 re-run — the citable counter-evidence to the 'Steel leads' headline.  _[where: Intro and Steel Performance bullet, as a dated caveat.]_  (https://github.com/steel-dev/browserbench)
- Cloudflare's product rename: 'Browser Run, formerly known as Browser Rendering' (verified on the Cloudflare docs landing page, 2026).  _[where: Smooth and Cloudflare section and snapshot table, to fix the stale product name.]_  (https://developers.cloudflare.com/browser-rendering/)
- Browserbase plans page (verified 2026): Free $0 / Developer $20 / Startup $99 / Scale, with session duration 15 min / 6 hrs / 6 hrs / 6+ hrs and concurrency 3 / gated / 100 / enterprise.  _[where: Browserbase 'Trade-offs' bullet to make the 'plan-specific feature gates' line concrete and citable.]_  (https://docs.browserbase.com/account/billing/plans.md)
- Steel Agent Traces feature (timeline of agent activity synced to video, exportable as markdown/JSON/ZIP) — Steel's genuine, defensible observability differentiator versus Browserbase's Session Inspector.  _[where: Steel 'State and trust' bullet and observability row, to replace the weak/incorrect 'MP4/HLS is unique' framing.]_  (https://docs.steel.dev/llms.mdx/overview/agent-traces/overview)



---


### browser-profiles-that-survive-real-workflows — readiness 8/10


**Title:** Browser Profiles That Survive Real Workflows


**Priority issues**
- (MEDIUM) Line 96 conflates session and profile states: 'Wait for the session to enter READY in the Profiles API'. The Profiles API returns profile objects (status READY/UPLOADING/FAILED), not sessions; the session moves to RELEASED. A developer polling 'the session' in the Profiles API will not find it.
  → *Fix:* Replace with: "You released before Steel finished uploading the profile. Poll `client.profiles.get(profileId)` and wait for `status === 'READY'` before starting a dependent session. The session itself is already `RELEASED`; it is the profile artifact that uploads asynchronously."
- (MEDIUM) The article solves 'Continuation fails CAPTCHA or device check' with profiles alone, but Steel's own dedicated-IPs doc attributes exactly this failure to the 'impossible traveler problem' (same account seen from unrelated networks) and recommends pairing one profile with one dedicated IP per account. Profiles fix browser identity, not network identity.
  → *Fix:* In the 'Common failure -> profile move' table, expand the CAPTCHA/device-check row's move to: '...reload the stored userDataDir, and pin a dedicated IP (`fixed:<id>`, see /overview/sessions-api/dedicated-ips) so the account is not flagged for impossible-traveler logins.' Also add a trade-offs row: 'Profiles persist browser identity, not network identity — pair with a dedicated IP for account-based agents.'
- (LOW) Lines 31 and 38 imply profiles guarantee 'browser fingerprint stability' / reload 'fingerprint knobs'. The Profiles API doc promises persistence of the user data dir (cookies, extensions, credentials, browser settings) but does not explicitly guarantee fingerprint replay across sessions; Steel's fingerprint injection is governed by stealth_config at session-create time.
  → *Fix:* Soften line 31 'depend on browser fingerprint stability' to 'depend on stable browser settings and a consistent user agent', and line 38 'reloads the stored User Data Directory and fingerprint knobs' to 'reloads the stored User Data Directory and browser settings'.


**Claim checks** (verified verdict shown)
- [ACCURATE] · steel-product · create one profile with `persistProfile: true`, reuse it by passing `profileId` (camelCase TypeScript)
  src: https://docs.steel.dev/overview/profiles-api/overview
- [ACCURATE] · steel-product · There is a 300 MB profile-size limit and an upload failure sets the profile to `FAILED`
  src: https://docs.steel.dev/overview/profiles-api/overview
- [ACCURATE] · steel-product · Profiles unused for 30 days are deleted automatically
  src: https://docs.steel.dev/overview/profiles-api/overview
- [ACCURATE] · steel-product · CDP endpoint `wss://connect.steel.dev?apiKey=${STEEL_API_KEY}&sessionId=${session.id}` and the SDK constructor uses `steelAPIKey`
  src: https://docs.steel.dev/llms.txt · https://docs.steel.dev/overview/sessions-api/reusing-auth-context
- [ACCURATE] · steel-product · `profiles.get`, `profiles.create`, `profiles.update` exist as SDK methods
  src: https://github.com/steel-dev/steel-node/blob/main/src/resources/profiles.ts · https://docs.steel.dev/overview/profiles-api/overview
- [ACCURATE] · steel-product · Lighter `sessionContext` handoff captures only cookies/localStorage and does not restore extensions; grab it via `client.sessions.context(session.id)` before releasing
  src: https://docs.steel.dev/overview/sessions-api/reusing-auth-context
- [ACCURATE] · technical · Profile snapshots 'the entire Chrome user data directory ... cookies, service workers, extension data, stored credentials, and any custom browser settings'
  src: https://docs.steel.dev/overview/profiles-api/overview · https://chromium.googlesource.com/chromium/src/+/refs/heads/main/docs/user_data_dir.md
- [ACCURATE] · steel-product · Passing `persistProfile: true` again merges new cookies/storage back into the same profile when the session ends
  src: https://docs.steel.dev/overview/profiles-api/overview
- [CONFIRMED-INACCURATE] · steel-product · 'Wait for the session to enter READY in the Profiles API' after release  *(adversarially verified)*
  → Replace the bullet at content/articles/browser-profiles-that-survive-real-workflows.md ("What usually breaks" section). Current: "- **State lost after release.** You released before Steel finished uploading the profile. Wait for the session to enter `READY` in the Profiles API or sleep a short window before issuing a dependent job." Replacement: "- **State lost after release.** You released before Steel finished uploading the profile. After release the session is `RELEASED` (terminal) while the profile moves from `UPLOADING` to `READY` — poll `client.profiles.get(profileId)` until the profile reaches `READY` before starting the next session, or sleep a short window before issuing a dependent job."
  src: https://docs.steel.dev/overview/profiles-api/overview · https://docs.steel.dev/overview/sessions-api/session-lifecycle
- [NEEDS-SOFTENING] · technical · Profiles give 'browser fingerprint stability' / reload 'fingerprint knobs'  *(adversarially verified)*
  → Replace the overstated fingerprint language with Steel's own "browser identity"/settings framing. Three exact edits in /Users/nikola/dev/steel/llms-steel-dev/content/articles/browser-profiles-that-survive-real-workflows.md:

1) Line 31 (Short answer) — change:
"Use profiles when workflows span multiple sites, require stored MFA devices, or depend on browser fingerprint stability."
to:
"Use profiles when workflows span multiple sites, require stored MFA devices, or depend on a stable browser identity (same user-agent, cookies, and storage across runs)."

2) Line 37 (Common failure table cell) — change:
"Always create new sessions with `profileId` so Steel reloads the stored User Data Directory and fingerprint knobs."
to:
"Always create new sessions with `profileId` so Steel reloads the stored User Data Directory — same cookies, storage, and user-agent carry over. (For deeper fingerprint spoofing, set `stealthConfig` at session-create; that is applied per session, not loaded from the profile.)"

3) Line 91 (Fit/trade-offs table) — change:
"You need retries to resume mid-task with identical fingerprinting."
to:
"You need retries to resume mid-task with the same browser identity."
  src: https://docs.steel.dev/overview/profiles-api/overview · https://docs.steel.dev/overview/stealth/captcha-solving


**Top improvements**
- (HIGH) Add dedicated IPs as the network-identity complement to profiles. The article's marquee failure mode (CAPTCHA/device-check on continuation) is, per Steel's own dedicated-IPs doc, caused by the 'impossible traveler problem' and is only fully fixed by pairing a profile with a pinned IP. Add it to the failure table, the trade-offs table, and the Short answer. — Profiles alone preserve browser identity but not network identity; readers who follow the article exactly will still see new-IP flagging. This is also the strongest citable primary source available.
- (HIGH) Fix the 'State lost after release' bullet so it tells readers to poll the profile (profiles.get -> status READY), not 'the session' in the Profiles API. — The current instruction points at the wrong object and a developer following it literally will not find what to wait on.
- (MEDIUM) Make the seedProfile code example runnable or mark it clearly as illustrative. example.com has no /login page, #username/#password fields, or submit button, so copy-paste fails. Either swap in the same practice.expandtesting.com/login demo Steel uses in its own docs, or add a comment '/* selectors illustrative; use your target site */'. — Steel's docs use a real working demo login; matching that raises the example from pseudocode to copy-paste-runnable, which matters for an answer-engine-ranking article.


**Supporting material to add**
- Steel's Dedicated IPs doc names the exact failure the article's CAPTCHA/device-check row describes: 'the impossible traveler problem: auth and anti-bot systems see the same account appear from unrelated networks or locations too quickly, then invalidate the saved auth state or add extra verification.' It states the recommended production pattern is one profile plus one dedicated IP per account. Dedicated IPs are $5/IP/month, up to 25 self-serve.  _[where: Short answer and the 'Continuation fails CAPTCHA or device check' row of the failure table; also a new row in Fit/trade-offs]_  (https://docs.steel.dev/overview/sessions-api/dedicated-ips)
- Steel's Profiles API overview positions profiles as the upgrade path over session-context reuse: 'It utilizes auth context alongside a complete browser profile to automatically reuse all your auth, not just context or cookies.' This validates the article's profiles-vs-sessionContext framing with a primary source.  _[where: Short answer, where the article contrasts sessionContext as the lighter option]_  (https://docs.steel.dev/overview/sessions-api/reusing-auth-context)
- Steel's Session Lifecycle doc states sessions are 'billed and metered by the minute' and 'can last up to 24 hours depending on your plan,' with a 5-minute default timeout. Useful to anchor why re-seeding a profile (a one-time login) saves per-minute cost versus re-authenticating in every short-lived session.  _[where: Fit/trade-offs table or a one-line aside in 'Instead of scripted re-logins']_  (https://docs.steel.dev/overview/sessions-api/session-lifecycle)
- Chromium's authoritative User Data Directory reference enumerates the on-disk stores a Steel profile captures (Cookies SQLite DB, Local Storage/IndexedDB, the Service Worker folder, the Extensions folder, Login Data). Citing it grounds the 'entire user data directory' claim in a primary Chromium source rather than assertion.  _[where: End of 'Instead of scripted re-logins, pin one profile per workflow']_  (https://chromium.googlesource.com/chromium/src/+/refs/heads/main/docs/user_data_dir.md)


**Broken / malformed links**
- `https://docs.steel.dev/overview/profiles-api/overview` — None - resolves HTTP 200 and documents profiles.create / profiles.update as claimed
- `https://docs.steel.dev/overview/sessions-api/reusing-auth-context` — None - resolves HTTP 200 and documents client.sessions.context() + sessionContext handoff as claimed


---


### browser-traces-replay-and-debugging — readiness 6/10


**Title:** Browser Traces, Replay, and Debugging for Agents


**Priority issues**
- (BLOCKER) The article states twice that Steel has a '5 minute idle timeout' (table row 'Support pings say blank embed' and the Trade-offs bullet 'Streams expire when sessions idle for roughly 5 minutes'). This conflates two different settings. The 5-minute value is the default session LIFETIME (timeout), not an inactivity/idle timeout. Per the Session Lifecycle doc, inactivityTimeout is DISABLED by default ('Omit inactivityTimeout to disable inactivity-based release (the default)').
  → *Fix:* Table cell: replace 'Steel defaults to 5 minute idle timeout' with 'Steel defaults to a 5-minute session lifetime (timeout)'. Trade-offs bullet: replace 'Streams expire when sessions idle for roughly 5 minutes. Keep sessions active or relaunch before you call the issue resolved.' with 'A session's stream ends when the session is released. The default session lifetime is 5 minutes (configurable via timeout, max 24h); inactivity-based release is off unless you set inactivityTimeout. Release explicitly or extend timeout for long runs.'
- (HIGH) The article is titled 'Browser Traces ...' and uses the word 'traces' throughout, but never mentions Steel's actual Agent Traces feature (a structured per-activity timeline synced to video, with exports), documented at /overview/agent-traces/overview. The body only covers video (live WebRTC + HLS replay).
  → *Fix:* Add a short section after 'Recommended operating pattern' titled 'Pair video with structured traces' explaining Agent Traces (one row per agent activity: verb, target, page URL, timestamp; synced to the video; exportable). Link https://docs.steel.dev/overview/agent-traces/overview and https://docs.steel.dev/overview/agent-traces/timeline. Rewrite the 'Short answer' to name three surfaces: live WebRTC at session.debugUrl, MP4/HLS at /v1/sessions/{id}/hls, and the Agent Traces timeline.
- (HIGH) The instrumentation example calls client.sessions.create({ headless: false }). The headless flag is not a documented create param anywhere in llms-full.txt or the API reference, and headful is already the default for all new sessions per the Live Sessions doc ('Headful sessions are now default'). The example also never releases the session, which Steel's docs stress because billing is per session-minute.
  → *Fix:* Change `const session = await client.sessions.create({ headless: false });` to `const session = await client.sessions.create(); // headful + WebRTC is the default`. Add a release at the end of the example, e.g. in a finally: `await client.sessions.release(session.id);` with a comment that it avoids billing until the 5-minute default timeout.
- (MEDIUM) The rrweb deprecation language overstates Steel's documented posture: 'Steel is phasing it out ... so you are not stuck on legacy evidence when headless traces are deprecated.' Steel's Past Sessions doc calls rrweb 'legacy' and 'recommend migrating when possible' but states no deprecation date.
  → *Fix:* Reword the Trade-offs bullet to: 'rrweb playback remains available for legacy headless sessions, but Steel recommends migrating to headful MP4/HLS replays, which are now the default. New sessions get video replays automatically; plan the migration so you are not relying on event-based replay for new runs.'
- (LOW) 'Legacy rrweb-only traces drift. Event reconstruction misses UI chrome, cursors, or video elements.' The 'cursors' part is disputable: rrweb does record mouse/pointer-move events by default, so cursors are not typically 'missed.' Canvas, video, WebGL, cross-origin iframes, and browser chrome outside the viewport are the real blind spots.
  → *Fix:* Replace 'misses UI chrome, cursors, or video elements' with 'misses canvas, video, and WebGL content, cross-origin iframes, and anything outside the recorded DOM.'


**Claim checks** (verified verdict shown)
- [ACCURATE] · steel-product · Steel gives you ... a headful WebRTC stream exposed at session.debugUrl for live takeover
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions
- [ACCURATE] · steel-product · an MP4/HLS recording served from /v1/sessions/{id}/hls once the run completes
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions
- [ACCURATE] · technical · Headful WebRTC streams preserve the real frame rate (25 fps)
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions
- [ACCURATE] · steel-product · Steel now records the actual OS-level output, so what you replay is what the operator saw.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions · https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions
- [CONFIRMED-INACCURATE] · steel-product · Steel defaults to 5 minute idle timeout (table); Streams expire when sessions idle for roughly 5 minutes (trade-offs)  *(adversarially verified)*
  → Fix both locations to state the lifetime cap correctly, not an idle timeout.

Line 51 (Signals to watch table, "Support pings say 'blank embed'" row), replace:
  "expired session (Steel defaults to 5 minute idle timeout)"
with:
  "expired session (Steel's default 5-minute session timeout elapsed)"

Line 82 (Trade-offs and limits), replace:
  "- Streams expire when sessions idle for roughly 5 minutes. Keep sessions active or relaunch before you call the issue resolved."
with:
  "- Sessions end when their lifetime timeout elapses — 5 minutes by default — whether or not the browser is active, so a live stream goes blank after the default window even with no driving. Raise timeout (and optionally set inactivityTimeout for idle-based release) to keep streams running longer."
  src: https://docs.steel.dev/overview/sessions-api/session-lifecycle · https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions
- [CONFIRMED-INACCURATE] · steel-product · client.sessions.create({ headless: false })  *(adversarially verified)*
  → Replace `const session = await client.sessions.create({ headless: false });` with `const session = await client.sessions.create();` (the canonical no-arg form used throughout Steel's live docs, which creates a headful session by default — exactly what the article intends). File: /Users/nikola/dev/steel/llms-steel-dev/content/articles/browser-traces-replay-and-debugging.md line 65.
  src: https://docs.steel.dev/llms-full.txt · https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions
- [ACCURATE] · steel-product · interactive=true / interactive=false controls live viewer interactivity
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions
- [ACCURATE] · steel-product · Debug URLs are intentionally unauthenticated. Wrap them in your own access controls.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions
- [NEEDS-SOFTENING] · steel-product · rrweb playback stays available, but Steel is phasing it out ... when headless traces are deprecated.  *(adversarially verified)*
  → Replace the sentence with: "rrweb playback stays available for legacy sessions, but Steel recommends migrating to headful MP4 replay and notes that headless event-based playback will be deprecated in the future (no date announced)." This keeps the accurate substance, swaps the incorrect "headless traces" for the documented term "headless event-based playback" (avoiding confusion with the separate Agent Traces feature), and drops the implied scheduled deprecation in favor of Steel's actual "in the future" language.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions · https://docs.steel.dev/overview/agent-traces/overview
- [ACCURATE] · steel-product · import { Steel } from "steel-sdk"; const client = new Steel({ apiKey: ... }); fetch('https://api.steel.dev/v1/sessions/.../hls', { headers: { 'steel-api-key': ... } })
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions · https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions
- [ACCURATE] · steel-product · Next steps links: .../embed-sessions/live-sessions and .../embed-sessions/past-sessions
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions · https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions
- [NEEDS-SOFTENING] · technical · Legacy rrweb-only traces drift. Event reconstruction misses UI chrome, cursors, or video elements.  *(adversarially verified)*
  → Replace "Event reconstruction misses UI chrome, cursors, or video elements." with "Event reconstruction misses canvas and WebGL, cross-origin iframes, or in-flight video frames." This keeps the same drift argument while substituting the inaccurate "cursors" (and the vague "UI chrome") with limitations rrweb's own docs confirm are opt-in or unsupported by default.
  src: https://github.com/rrweb-io/rrweb/blob/master/docs/observer.md · https://github.com/rrweb-io/rrweb/blob/master/guide.md


**Top improvements**
- (HIGH) Rewrite the Short answer to name all three evidence surfaces: live WebRTC at session.debugUrl, MP4/HLS replay at /v1/sessions/{id}/hls, and the Agent Traces timeline. The current two-surface framing is incomplete for an article with 'traces' in the title. — The title promises traces; Steel ships a dedicated traces product. Answer-engine results for 'Steel traces' / 'agent debugging' will rank a page that actually describes the traces feature.
- (HIGH) Add the missing session release to the code example (finally { await client.sessions.release(session.id); }) and note Steel bills per session-minute. Every Steel cookbook example models explicit release. — A debugging/replay article that models leaking sessions teaches a costly anti-pattern and contradicts Steel's own documentation.
- (MEDIUM) State explicitly that headful + WebRTC is now the default for all new sessions, so readers know they do not need to opt in. Currently the article implies configuration is required. — The Live Sessions doc leads with this; surfacing it reduces integration friction and is a positive differentiator.


**Supporting material to add**
- Steel's Agent Traces feature: a per-activity timeline (verb, target label, page URL, timestamp) synced to the session video and exportable, exposed as a tab next to Console Logs and Network in the dashboard.  _[where: New section after 'Recommended operating pattern' (e.g., 'Pair video with structured traces'), and a mention in the Short answer.]_  (https://docs.steel.dev/overview/agent-traces/overview)
- Steel's default session lifetime is 5 minutes, configurable via timeout (ms), hard-capped at 24h; inactivityTimeout is opt-in for idle release. Documented in Session Lifecycle and reinforced across many cookbook examples.  _[where: Trade-offs and limits, replacing the incorrect 'idle timeout' claim, so readers can correctly size long-running debugging sessions.]_  (https://docs.steel.dev/overview/sessions-api/session-lifecycle)
- rrweb's own documentation describes it as a DOM-event session recorder/replayer, which is why canvas, video, cross-origin iframes, and browser chrome are not faithfully captured — the technical basis for Steel's move to OS-level MP4 capture.  _[where: Why naive setups fail #3, as a citation after the rrweb critique to ground the claim in the primary source rather than assertion.]_  (https://github.com/rrweb-io/rrweb)
- Steel exposes a bulk release helper, client.sessions.releaseAll(), for tearing down all active sessions at once — useful for incident recovery when many debug sessions are left running.  _[where: Recommended operating pattern step 5 or Trade-offs, as a cleanup tip to avoid billing for abandoned debug sessions.]_  (https://docs.steel.dev/overview/sessions-api/session-lifecycle)


**Broken / malformed links**
- `https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions` — None — verified HTTP 200 on 2026-07-13 and content matches the article's description (WebRTC, debugUrl, interactive param).
- `https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions` — None — verified HTTP 200 on 2026-07-13; documents the /v1/sessions/{id}/hls endpoint and rrweb legacy path described.
- `https://api.steel.dev/v1/sessions/${session.id}/hls` — None — matches Steel's documented HLS endpoint and steel-api-key header exactly.


---


### browser-use-with-steel — readiness 6/10


**Title:** Browser Use With Steel


**Priority issues**
- (BLOCKER) The only external link, docs.steel.dev/integrations/browser-use/quickstart, returns HTTP 404 (verified). The correct, live URL is docs.steel.dev/integrations/browser-use.
  → *Fix:* Replace `https://docs.steel.dev/integrations/browser-use/quickstart` with `https://docs.steel.dev/integrations/browser-use`.
- (HIGH) Code sample uses `region="us-east"`, which is not a valid Steel region. Steel currently exposes only two regions: `lax` (Los Angeles) and `iad` (Washington DC).
  → *Fix:* Change `client.sessions.create(use_proxy=True, region="us-east")` to `client.sessions.create(use_proxy=True, region="iad")` (or `"lax"`). Optionally add: 'Steel currently exposes `lax` and `iad`; all regions are US-based today.'
- (HIGH) The 24-hour session lifetime is presented as a headline, general benefit ('24 hour browser lifetimes' in the summary/description), but per the pricing page (last edited June 30, 2026) it is Enterprise-only: Launch max session time = 15 minutes, Scale = 1 hour, Enterprise = up to 24 hours.
  → *Fix:* In the summary, change '24 hour browser lifetimes' to 'longer browser lifetimes (up to 24h on Enterprise; 1h on Scale, 15min on Launch)'. In the 'What Steel adds' / trade-offs sections, add: 'Max session time depends on plan — Launch 15 min, Scale 1 h, Enterprise up to 24 h.'
- (MEDIUM) The article says 'Steel routes the CAPTCHA to a human solver' (and 'CAPTCHA solving with human fallbacks'). Steel's own stealth/captcha-solving docs describe the solver as automatic, using 'machine learning models, third-party solving services, [and] browser automation techniques' — it does not document human solving.
  → *Fix:* Replace 'Steel routes the CAPTCHA to a human solver and you resume the agent after the tool returns' with 'Steel solves the CAPTCHA automatically (ML models, third-party solving services, and browser automation) and you resume the agent once the status endpoint reports done.' Drop 'with human fallbacks' from the intro or rephrase as 'with optional human takeover via Live View.'
- (MEDIUM) The example `client.sessions.create()` sets no `timeout`, so the session uses Steel's 5-minute default lifetime — any Browser Use task longer than 5 minutes gets cut off mid-run.
  → *Fix:* In the Python example, create the session with an explicit timeout, e.g. `session = client.sessions.create(timeout=1800000)` (30 minutes; units are milliseconds per the session-lifecycle docs), and note: 'The default timeout is 5 minutes — raise it for real tasks.'
- (LOW) 'Sub-second startup' is stated as fact in the summary and the 'What Steel adds' table, but no Steel documentation states a session startup time, and cloud-browser cold starts are typically >=1s.
  → *Fix:* Soften 'sub-second startup' to 'fast session startup' or cite a Steel benchmark with a link if one exists.
- (LOW) Model references are dated: 'GPT-4o, Claude 3, Gemini, or DeepSeek' and `model="gpt-4o"`. The current Steel integration docs reference GPT-5, Claude Sonnet 4, and Gemini 3 Pro.
  → *Fix:* Update the model list to 'GPT-5, Claude Sonnet 4, Gemini 3 Pro, or DeepSeek' and consider `model="gpt-5"` in the example (or keep gpt-4o but note it as an example).
- (LOW) CDP URL is built as a hardcoded `wss://connect.steel.dev?apiKey=...&sessionId=...`. This endpoint is valid and documented (it appears in the reusing-auth-context page), but every official Browser Use example builds the URL from `session.websocket_url` instead.
  → *Fix:* Prefer `cdp_url = f"{session.websocket_url}&apiKey={STEEL_API_KEY}"` to match Steel's canonical examples. The hardcoded form works but is non-canonical.


**Claim checks** (verified verdict shown)
- [CONFIRMED-INACCURATE] · technical · Run the official quickstart at docs.steel.dev/integrations/browser-use/quickstart  *(adversarially verified)*
  → Replace the text "Run the official quickstart at docs.steel.dev/integrations/browser-use/quickstart" with "Run the official integration at https://docs.steel.dev/integrations/browser-use" (or, to keep the phrase, "...the official browser-use integration guide at https://docs.steel.dev/integrations/browser-use"). This corrects the 404 URL to the canonical live page and drops the inaccurate "quickstart" labeling.
  src: https://docs.steel.dev/integrations/browser-use/quickstart · https://docs.steel.dev/integrations/browser-use
- [CONFIRMED-INACCURATE] · steel-product · region="us-east" is a valid Steel session region  *(adversarially verified)*
  → In /Users/nikola/dev/steel/llms-steel-dev/content/articles/browser-use-with-steel.md (line 100), replace `region="us-east"` with a valid Steel region code. Change the line to: `- Turn on managed proxies and region selection when calling \`client.sessions.create(use_proxy=True, region="iad")\` so Browser Use inherits the right fingerprint and IP without extra code.` (Alternatively `region="lax"`; `iad` matches the convention used in sibling articles.)
  src: https://docs.steel.dev/overview/sessions-api/multi-region · https://docs.steel.dev/llms.txt
- [NEEDS-SOFTENING] · steel-product · 24 hour browser lifetimes / up to 24 h runs as a general Steel capability  *(adversarially verified)*
  → Qualify the claim to acknowledge plan tiers. Apply the following replacements in /Users/nikola/dev/steel/llms-steel-dev/content/articles/browser-use-with-steel.md:

1) Lines 4, 5, and 27 (summary/description/intro — same phrase): replace "24 hour browser lifetimes" with "up to 24 hour browser lifetimes on Enterprise plans (Launch caps at 15 min, Scale at 1 hour)".

2) Line 43 (What Steel adds table): replace "Sub-second startup and up to 24 h runs keep long tasks alive even if your host restarts" with "Sub-second startup and up to 24 h runs on Enterprise (Launch caps at 15 min, Scale at 1 h) keep long tasks alive even if your host restarts".

3) Line 105 (Fit section): replace "Steel's evidence, proxies, and 24 h lifetimes" with "Steel's evidence, proxies, and long-lived sessions (up to 24 h on Enterprise)".

4) Line 111 (trade-offs): replace "Runs must exceed Steel's 24 hour session ceiling" with "Runs must exceed Steel's session-time ceiling (15 min on Launch, 1 h on Scale, up to 24 h on Enterprise)".

The minimum-honest change is the summary/intro phrase; the trade-offs line (#4) is the most misleading as written because it frames 24h as a universal ceiling.
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/overview/sessions-api/session-lifecycle
- [CONFIRMED-INACCURATE] · technical · Steel routes the CAPTCHA to a human solver  *(adversarially verified)*
  → Replace "Steel routes the CAPTCHA to a human solver" with "Steel solves the CAPTCHA automatically through its integrated solver (ML models, third-party solving services, and browser automation techniques), so the agent can wait for it to clear and continue." If a shorter form is needed for the surrounding sentence: "Steel solves the CAPTCHA automatically."
  src: https://docs.steel.dev/overview/stealth/captcha-solving · https://docs.steel.dev/cookbook/browser-use-captcha-auto
- [DISPUTABLE-KEEP-BUT-HEDGE] · statistic · Sub-second startup  *(adversarially verified)*
  → Keep the claim but add a hedge that it is Steel's reported, same-region figure. Exact replacement text: "Sub-second startup (Steel-reported, same-region)". This is defensible because Steel itself publishes "<1s Avg. Session Start Time" and uses the exact phrase "sub-second startup" on steel.dev; in a "What Steel adds" feature table, summarizing Steel's own advertised capability is appropriate. The hedge simply preserves Steel's own "when client is in same region" qualifier and flags that the figure is the vendor's, not an independent benchmark. (If table-cell brevity matters more than precision, "no change needed" is also defensible, since the claim accurately paraphrases Steel's own published stat.)
  src: https://steel.dev/ (hero stat tile '<1s Avg. Session Start Time'; JSON-LD FAQ 'Under one second on average with no cold-start penalty'; comparison FAQ 'sub-second startup'; Quick-start card 'Average session starts in less than 1s when client is in same region'; bar chart '500 ms Steel vs 5000 ms Competition') · https://docs.steel.dev/ (technical docs; no startup-time benchmark stated; only generic 'optimal performance and latency' reference on the Multi-region page)
- [ACCURATE] · steel-product · client.sessions.create() then release with client.sessions.release(session.id)
  src: https://docs.steel.dev/overview/sessions-api/session-lifecycle
- [ACCURATE] · steel-product · Pass use_proxy / solve_captcha flags when creating the session (snake_case)
  src: https://docs.steel.dev/integrations/browser-use · https://docs.steel.dev/cookbook/browser-use-captcha-auto
- [ACCURATE] · steel-product · Set persist_profile: true or supply profile_id (snake_case)
  src: https://docs.steel.dev/cookbook/profiles · https://docs.steel.dev/overview/sessions-api/reusing-auth-context
- [ACCURATE] · steel-product · client.sessions.captchas.status(session_id) polled while isSolvingCaptcha is set
  src: https://docs.steel.dev/overview/captchas-api/overview · https://docs.steel.dev/cookbook/browser-use-captcha-auto
- [ACCURATE] · steel-product · CDP URL wss://connect.steel.dev?apiKey=...&sessionId=...
  → Prefer `cdp_url = f"{session.websocket_url}&apiKey={STEEL_API_KEY}"` to match official examples.
  src: https://docs.steel.dev/overview/sessions-api/reusing-auth-context · https://docs.steel.dev/integrations/browser-use
- [ACCURATE] · steel-product · Concurrency scales from Steel Local's single session up to the hundreds available on Steel Cloud plans
  → Optionally precision: '...up to 100 on Scale and 1,000+ on Enterprise.'
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud · https://docs.steel.dev/overview/pricinglimits
- [ACCURATE] · technical · from browser_use import Agent, BrowserSession; from browser_use.llm import ChatOpenAI; Agent(browser_session=BrowserSession(cdp_url=...)); await agent.run()
  src: https://docs.steel.dev/integrations/browser-use
- [STALE] · technical · Supported models: GPT-4o, Claude 3, Gemini, or DeepSeek (example uses gpt-4o)  *(adversarially verified)*
  → Two edits to match current Steel docs. (1) In the "What stays the same" table, LLM + reasoning row, replace the cell text "Same GPT-4o, Claude 3, Gemini, or DeepSeek models" with "Same vision-capable models — GPT-5, Claude Sonnet 4, or Gemini 3 Pro". (2) In the Python example, change `model = ChatOpenAI(model="gpt-4o", temperature=0.3, api_key=OPENAI_KEY)` to `model = ChatOpenAI(model="gpt-5", temperature=0.3, api_key=OPENAI_KEY)`. The OPENAI_API_KEY/.env wiring stays unchanged.
  src: https://docs.steel.dev/integrations/browser-use


**Top improvements**
- (HIGH) Fix the 404 external link to point at https://docs.steel.dev/integrations/browser-use, and add inline links to the two CAPTCHA recipes and the pricing/limits page where relevant. — Broken primary-source link is a blocker for an answer-engine-targeted article; the recipes are directly on-topic and strengthen the CAPTCHA section.
- (HIGH) Correct the `region="us-east"` code to a real region code (`lax` or `iad`) and add a one-line note on available regions. — The current code won't behave as readers expect and states a false fact about Steel's region list.
- (HIGH) Add plan-tier caveats wherever session lifetime/concurrency are claimed (Launch 15 min/10, Scale 1 hr/100, Enterprise 24 hr/1,000+). — The unqualified '24 hour' headline overstates what most paying tiers get and is the article's biggest accuracy risk.


**Supporting material to add**
- Steel pricing/limits table (verified June 30 2026 edit): Launch $0 + $30 one-time credits, 10 concurrent, 15-min max session, 60 RPM; Scale $250 + $100/mo credits, 100 concurrent, 1-hr max session, 600 RPM; Enterprise custom, 1,000+ concurrent, up to 24-hr sessions. Also: Launch requires a $10 deposit to use CAPTCHA solving or Steel-provided proxies.  _[where: Summary and 'What Steel adds' scale/lifecycle rows; also a one-line caveat near the CAPTCHA/proxy guidance]_  (https://docs.steel.dev/overview/pricinglimits)
- Steel session-lifecycle docs: default session timeout is 5 minutes; `timeout` (ms) is the hard cap; `inactivity_timeout` releases idle sessions early; `release()` and bulk `releaseAll()` are the cleanup methods.  _[where: Python example and 'Minimal integration path' step 2]_  (https://docs.steel.dev/overview/sessions-api/session-lifecycle)
- Steel's two official Browser Use + CAPTCHA recipes (auto-solve via `solve_captcha=True`, and manual per-task solve via `client.sessions.captchas.solve(...)`), plus the Captchas API reference.  _[where: 'Solve CAPTCHAs and anti-bot pressure' section]_  (https://docs.steel.dev/cookbook/browser-use-captcha-auto)
- Steel multi-region docs: only `lax` and `iad` regions exist today, both US-based; region controls browser location while `use_proxy`/`proxy_url` control IP/network routing.  _[where: 'Solve CAPTCHAs and anti-bot pressure' bullet about region selection]_  (https://docs.steel.dev/overview/sessions-api/multi-region)
- Steel Local vs Steel Cloud feature matrix: Local = concurrency 1, no CAPTCHA solving, no Credentials/Files APIs, bring-your-own proxy; Cloud = 100+, managed proxies, CAPTCHA solving, Credentials/Files/Extensions APIs.  _[where: 'Fit and trade-offs' section, to sharpen when to use Cloud vs Local]_  (https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud)


**Broken / malformed links**
- `https://docs.steel.dev/integrations/browser-use/quickstart` — Returns HTTP 404 (verified July 2026). The page renders Next.js 'Page not found'. → Replace with https://docs.steel.dev/integrations/browser-use (HTTP 200), which contains the full integration example, FAQ, and links to recipes.


---


### browserbase-vs-steel — readiness 3/10


**Title:** Browserbase vs Steel: Which Cloud Browser Wins?


**Priority issues**
- (BLOCKER) Browserbase lifecycle numbers are wrong. Article states 'Browserbase clocks in around 1.68 seconds with a 1.87 second p95' (intro, comparison table, 'measurable lifecycle gains', 'How to decide'). Steel's own benchmark raw data (results/browserbase.jsonl, 5,000 runs) shows Browserbase at 2,966.87 ms avg and 3,886 ms p95 — roughly double the article's figures. The 1.68/1.87 numbers match no provider in the benchmark. This also makes the '~13 minutes saved per 1,000 sessions' claim wrong: it is derived from the false 1.68s figure (correct math from real data would be ~35 min). Separately, the benchmark README discloses 'Browserbase: the runner throttles to ensure a ~3s floor per full cycle to avoid rate-limit bursts,' a methodology caveat the article never discloses.
  → *Fix:* Replace with the verified numbers and disclose the throttle + self-reported nature: 'In Steel's open benchmark (5,000 runs, AWS us-east-1, Jan 2026), Steel averages 0.89 s with a 1.09 s p95 while Browserbase averages 2.97 s with a 3.89 s p95. Note: the benchmark deliberately throttles Browserbase to a ~3 s floor to avoid rate-limit bursts, and the benchmark is authored and run by Steel, so treat the absolute gap as directional rather than neutral.' Recompute savings: 'roughly 35 minutes per 1,000 sessions at the throttled rate.' Link https://github.com/steel-dev/browserbench.
- (BLOCKER) 'Steel sessions can run up to 24 hours' is stated unqualified in the intro, comparison table, trade-offs table, and 'When to choose Steel'. Per Steel's own pricing page (verified June 30, 2026), Max session time is 15 minutes (Launch), 1 hour (Scale), and 'Up to 24 hours' (Enterprise only). This inverts the session-length comparison: Browserbase offers a 6-hour session duration on every paid plan (Developer $20, Startup $99, Scale), so on Steel's Launch and Scale plans sessions are SHORTER than Browserbase, not longer.
  → *Fix:* In the intro: 'Steel sessions can run up to 24 hours on Enterprise plans (15 minutes on Launch, 1 hour on Scale), while Browserbase offers a 6-hour session duration on every paid plan.' Update the comparison table 'Session lifecycle' row and trade-offs table to: 'Up to 24 h on Enterprise (15 min Launch / 1 h Scale); release sessions explicitly to free capacity.' Reword 'When to choose Steel' bullet 4 to 'You need up to 24-hour sessions on Enterprise...'.
- (HIGH) 'SOC 2 for Steel Cloud' is unverifiable. Steel's docs contain zero mentions of SOC 2 / SOC2 / Type II (only 'HIPAA-ready BAA' on Scale/Enterprise per the pricing page), and steel.dev/security, /trust, /compliance all return 404. The claim is used as a parity counter to Browserbase's SOC 2 Type II + HIPAA.
  → *Fix:* Drop the SOC 2 claim for Steel or confirm with the Steel team first. Safe rewrite for the comparison table 'Compliance stance' (Steel): 'Open-source runtime you can audit, customer-controlled hosting footprint, HIPAA-ready BAA on Scale/Enterprise.' If Steel has since obtained SOC 2, cite the exact trust-center URL.
- (HIGH) Observability comparison is inaccurate. Article frames Steel's 'live viewer + HLS/MP4 replay' and 'MP4/HLS export' as differentiators, with Browserbase getting only 'Inspector + rrweb-style recordings' and 'visibility toggles per plan tier.' Browserbase actually offers HLS session replay (returns an .m3u8 HLS VOD playlist) and a live Live View/Debugger, per its docs. Both platforms have HLS; Steel is not unique here.
  → *Fix:* Reword the Observability row: Steel = 'Live viewer, HLS/MP4 + rrweb replay, agent traces, Files exports.' Browserbase = 'Live View debugger, rrweb session recording, and HLS replay (.m3u8); retention length scales with plan.' Remove the implication that HLS/MP4 is Steel-only.
- (HIGH) Broken benchmark link in 'Next steps': '../20-29%20Content/20%20Articles/remote-browser-benchmark.md' is a malformed URL-encoded relative path that does not exist anywhere in this repo.
  → *Fix:* Replace with the canonical external URL used elsewhere in the repo: '[remote browser benchmark](https://steel.dev/blog/remote-browser-benchmark)'.
- (MEDIUM) 'Profiles that work across Steel Local and Steel Cloud' (line 75) and the 'self-host + managed share the same API' framing (line 61) overstate Steel Local parity. Per Steel's own Steel Local vs Steel Cloud table, Credentials and Files APIs are NOT supported on Steel Local, and Local has concurrency of 1 with limited stealth and no CAPTCHA solving.
  → *Fix:* Line 75: '...managed browsers, live evidence, and Profiles that work on Steel Cloud (note: Credentials and Files are Cloud-only; Steel Local is single-session).' Line 61: '...share the same core Sessions API, though Credentials, Files, and managed stealth are Cloud-only.'
- (MEDIUM) 'Files retention on every paid plan so ops and audit teams are never blind' (line 78) overstates uniformity. Data retention is 7 days on Launch vs 14 days on Scale (per Steel pricing).
  → *Fix:* '...Files retention (7 days Launch / 14 days Scale) so ops teams inherit evidence on every plan.'
- (MEDIUM) Date/currency staleness. Article is dated 2026-04-01 and uses old tier assumptions. Steel's pricing was updated June 30, 2026 to Launch ($0)/Scale ($250)/Enterprise, with browser hours at $0.10/$0.08/hr, 10/100/1000+ concurrency, and rate limits in requests-per-MINUTE (60/600), not the 'requests-per-second' framing used in sibling articles.
  → *Fix:* Update the 'updated:' frontmatter to the publish date and verify any specific plan/concurrency numbers against https://docs.steel.dev/overview/pricinglimits.


**Claim checks** (verified verdict shown)
- [ACCURATE] · statistic · Steel's remote benchmark sits at 0.89 second average lifecycle with a 1.09 second p95 across the create → connect → goto → release loop
  → Add '(Steel-authored benchmark, 5,000 runs, AWS us-east-1, Jan 2026)' after the figures.
  src: https://steel.dev/blog/remote-browser-benchmark · https://github.com/steel-dev/browserbench
- [CONFIRMED-INACCURATE] · competitor · Browserbase clocks in around 1.68 seconds with a 1.87 second p95  *(adversarially verified)*
  → Replace the intro sentence. OLD: "while Browserbase clocks in around 1.68 seconds with a 1.87 second p95, which compounds to ~13 minutes saved per 1,000 sessions and gives Steel more headroom for high-churn agents." NEW: "while Browserbase clocks in around 2.97 seconds with a 3.89 second p95, which compounds to ~34 minutes saved per 1,000 sessions and gives Steel more headroom for high-churn agents." Also fix the comparison table row from "| ~1.68 s average / 1.87 s p95 lifecycle, six hour session ceiling..." to "| ~2.97 s average / 3.89 s p95 lifecycle, six hour session ceiling...". Note: Steel's own number (0.89 s avg / 1.09 s p95) is correct and unchanged.
  src: https://github.com/steel-dev/browserbench · https://raw.githubusercontent.com/steel-dev/browserbench/main/README.md
- [STALE] · statistic · compounds to ~13 minutes saved per 1,000 sessions  *(adversarially verified)*
  → Replace the intro sentence: "Steel's remote benchmark sits at 0.89 second average lifecycle with a 1.09 second p95 across the create → connect → goto → release loop, while Browserbase clocks in around 1.68 seconds with a 1.87 second p95, which compounds to ~13 minutes saved per 1,000 sessions and gives Steel more headroom for high-churn agents." with: "Steel's own remote benchmark (code and raw data are public) reports a 0.89 second average lifecycle with a 1.09 second p95 across the create → connect → goto → release loop; in the same harness Browserbase measured about 2.97 seconds average and a 3.89 second p95, which gives Steel more headroom for high-churn agents." This uses the current canonical repo figures, attributes the comparison to Steel (it is self-reported), and drops the now-incorrect "13 minutes saved" compounding (the stale number; the current-data equivalent would be ~35 min, but stating that would simply propagate a larger vendor-self-reported figure). Also update the comparison-table row's Browserbase entry from "~1.68 s average / 1.87 s p95 lifecycle" to "~2.97 s average / 3.89 s p95 lifecycle" for internal consistency.
  src: https://steel.dev/blog/remote-browser-benchmark · https://github.com/steel-dev/browserbench
- [NEEDS-SOFTENING] · steel-product · Steel sessions can run up to 24 hours before the platform forces a reset  *(adversarially verified)*
  → Edit line 30 of content/articles/browserbase-vs-steel.md. Replace: "Steel sessions can run up to 24 hours before the platform forces a reset, while Browserbase keeps a six hour cap today" with: "Steel sessions can run up to 24 hours on Enterprise before the platform forces a reset (Launch caps at 15 minutes, Scale at 1 hour), while Browserbase keeps a six hour cap today". Also fix the related error on line 78 — replace "24 hour sessions, agent logs, MP4/HLS export, and Files retention on every paid plan" with "24 hour sessions on Enterprise (Launch/Scale cap at 15 min / 1 hour), plus agent logs, MP4/HLS export, and Files retention". The table cells on lines 44 and 85 ("24 h session ceiling" / "24 h ceiling") should likewise read "24 h ceiling (Enterprise; 15 min Launch / 1 hr Scale)".
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/overview/sessions-api/session-lifecycle
- [ACCURATE] · competitor · Browserbase keeps a six hour cap today
  src: https://docs.browserbase.com/platform/browser/long-sessions/timeouts.md · https://docs.browserbase.com/account/billing/plans.md
- [ACCURATE] · steel-product · explicit sessions.release() cleanup
  src: https://docs.steel.dev/overview/llms-full.txt
- [ACCURATE] · steel-product · Persistent Profiles + Credentials + Files APIs for reusable auth and evidence
  src: https://docs.steel.dev/overview/profiles-api/overview · https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud
- [CONFIRMED-INACCURATE] · steel-product · SOC 2 for Steel Cloud  *(adversarially verified)*
  → Replace the Steel-column cell in the Compliance stance row. Current: "Open runtime you can audit, customer control over hosting footprint, SOC 2 for Steel Cloud" -> New: "Open-source runtime you can audit, customer control over hosting footprint, HIPAA-ready BAA on Scale/Enterprise". Leave the Browserbase cell unchanged. Also fix the same unsupported claim in content/articles/selenium-with-steel.md (line 116, "SOC 2 controls" -> "managed proxies, a HIPAA-ready BAA, or") and content/articles/browserless-vs-steel.md (line 88, "Steel Cloud offers SOC 2 plus Files/Credentials boundaries" -> "Steel Cloud offers a HIPAA-ready BAA plus Files/Credentials boundaries").
  src: https://steel.dev/#pricing · https://docs.steel.dev/overview/pricinglimits
- [NEEDS-SOFTENING] · competitor · Browserbase ships SOC 2 plus HIPAA paperwork in one managed plan / SOC 2 + HIPAA positioning  *(adversarially verified)*
  → Edit content/articles/browserbase-vs-steel.md line 28. Replace the phrase "SOC 2 plus HIPAA paperwork in one managed plan" with "SOC 2 platform-wide plus HIPAA (BAA) on the Enterprise tier". Full replacement sentence: "Browserbase is the right default when you want an opinionated platform that ships Stagehand, the Director UI, and SOC 2 platform-wide plus HIPAA (BAA) on the Enterprise tier, so you can orchestrate AI browser runs without wiring your own guardrails." Optional precision tweak on line 48 table cell: change "SOC 2 + HIPAA positioning, platform controls scoped by plan" to "SOC 2 platform-wide; HIPAA (BAA) gated to the Enterprise tier". Lines 60-61 and 69 are fine as-is since they already frame HIPAA as a procurement story rather than an across-the-board plan feature.
  src: https://www.browserbase.com/pricing
- [ACCURATE] · competitor · case studies with Commure, Parcha, PromptLoop, and other regulated users
  src: https://www.browserbase.com/customers/commure · https://www.browserbase.com/customers/parcha
- [ACCURATE] · competitor · Browserbase ships Stagehand and the Director UI
  src: https://www.browserbase.com/stagehand · https://www.browserbase.com/director
- [CONFIRMED-INACCURATE] · competitor · Steel observability: Live viewer, HLS/MP4 replay, agent logs; Browserbase: Inspector + rrweb-style recordings with visibility toggles per plan tier  *(adversarially verified)*
  → Replace with: "Steel: WebRTC live viewer, MP4/HLS replay, Agent Traces (video-synced timeline); Browserbase: Session Inspector + Live View, HLS replay, console/network logs (rrweb deprecated)". This drops the false implication that HLS is Steel-only, removes the inaccurate "visibility toggles per plan tier," and reflects that Browserbase's rrweb is deprecated while noting both platforms' real, overlapping observability capabilities.
  src: https://docs.browserbase.com/platform/browser/observability/session-replay.md · https://docs.browserbase.com/platform/browser/observability/observability.md
- [NEEDS-SOFTENING] · steel-product · Files retention / MP4/HLS export available on every managed plan  *(adversarially verified)*
  → Replace "Files retention / MP4/HLS export available on every managed plan" with "Session files + MP4/HLS video export included on every Steel Cloud plan (retention: 7 days on Launch, 14 days on Scale, custom on Enterprise)." This keeps the true availability claim, adds the by-plan retention window so the cell no longer implies uniformity, and leaves the already-solid MP4/HLS half intact.
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions
- [ACCURATE] · steel-product · Deployment: Open-source Steel Browser you can self-host plus Steel Cloud
  src: https://github.com/steel-dev/steel-browser · https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud
- [ACCURATE] · steel-product · Works with Playwright, Puppeteer, Selenium, Browser Use, Stagehand, etc. via neutral CDP endpoints
  src: https://docs.steel.dev/integrations
- [ACCURATE] · competitor · Tiered plans where browser hours, bandwidth, and features unlock gradually (Browserbase pricing model)
  src: https://docs.browserbase.com/account/billing/plans.md


**Top improvements**
- (HIGH) Re-run or restate the lifecycle comparison using verified numbers and full methodology disclosure (Steel-authored, Browserbase throttled to ~3s floor, Kernel is actually fastest). Either soften to 'Steel is faster than Browserbase in our internal benchmark' with the throttle caveat, or commission a neutral third-party run before leading with precise second-decimal figures. — The current numbers are factually wrong and the undisclosed throttle makes the comparison misleading; this is the article's spine.
- (HIGH) Reframe the session-length section as a plan-tiered comparison table (Steel Launch 15 min / Scale 1 hr / Enterprise 24 hr vs Browserbase Free 15 min / paid 6 hr / Scale 6+ hr) instead of a blanket 'Steel 24h beats Browserbase 6h' claim. — On the plans most buyers use, Browserbase offers longer sessions than Steel; the current framing inverts reality.
- (HIGH) Add a 'Methodology & sources' footnote citing the Steel pricing page, Browserbase plans page, and the benchmark repo with access dates, and label all benchmark figures as Steel self-reported. — Answer-engine/LLM citations depend on traceable primary sources; self-reported benchmarks must be labeled.


**Supporting material to add**
- Steel's current pricing/limits table (verified June 30, 2026): Launch ($0, $30 credits, 10 concurrent, 15-min sessions, $0.10/hr browser hours, 7-day retention), Scale ($250, 100 concurrent, 1-hr sessions, $0.08/hr, 14-day retention, HIPAA-ready BAA), Enterprise (1,000+ concurrent, up to 24-hr sessions). Stealth Browser is Enterprise-only.  _[where: Comparison table 'Pricing model' and 'Session lifecycle' rows; also grounds the 24-hour caveat]_  (https://docs.steel.dev/overview/pricinglimits)
- Browserbase's own plans page (verified July 2026): Free ($0, 3 concurrent, 15-min), Developer ($20, 25 concurrent, 6-hr, 100 browser hrs), Startup ($99, 100 concurrent, 6-hr, 500 browser hrs), Scale (250+ concurrent, 6+ hr, SOC 2 reports/HIPAA BAA/SSO/DPA). Browser-hour overage $0.10-$0.12/hr; SOC 2 on all plans; HIPAA only on Scale.  _[where: Comparison table 'Pricing model' and the 'Compliance and procurement needs' section (corrects the HIPAA-in-base-plan implication)]_  (https://docs.browserbase.com/account/billing/plans.md)
- Browserbase security/compliance page documents SOC 2 Type II, HIPAA, zero-trust browser isolation, Zero Data Retention (ZDR), and Bring Your Own Storage (BYOS) for regulated workloads.  _[where: 'Compliance and procurement needs' section, to accurately represent Browserbase's enterprise posture and as a competitive blind spot (ZDR/BYOS are things Steel does not currently match)]_  (https://docs.browserbase.com/account/enterprise/security.md)
- The benchmark README's methodology note: 'Browserbase: the runner throttles to ensure a ~3s floor per full cycle to avoid rate-limit bursts,' and that the benchmark is Steel-authored. Kernel (not Steel) is actually the fastest provider tested (793.84 ms avg vs Steel's 894.13 ms).  _[where: Intro and 'Evidence and lifecycle speed you can measure', as a disclosure footnote]_  (https://github.com/steel-dev/browserbench)
- Steel's HLS replay API endpoint returns an .m3u8 playlist: GET https://api.steel.dev/v1/sessions/{session_id}/hls, plus MP4 session recordings ('Replay completed sessions as MP4/HLS video, or rrweb for legacy headless').  _[where: Comparison table 'Observability' (to substantiate the Steel side accurately without overclaiming uniqueness)]_  (https://docs.steel.dev/overview/llms-full.txt)


**Broken / malformed links**
- `../20-29%20Content/20%20Articles/remote-browser-benchmark.md` — Malformed URL-encoded relative path. No '20-29 Content' directory exists in the repo, and there is no remote-browser-benchmark.md article file. The benchmark only exists as an external blog post. → Replace with the canonical external URL used elsewhere in the repo: [remote browser benchmark](https://steel.dev/blog/remote-browser-benchmark)
- `@/glossary/cdp.md` — OK - exists at content/glossary/cdp.md (verified). Listed to confirm it is NOT broken.
- `@/glossary/steel-cloud.md` — OK - exists at content/glossary/steel-cloud.md (verified).
- `@/glossary/profiles.md` — OK - exists at content/glossary/profiles.md (verified).


---


### browserless-vs-steel — readiness 5/10


**Title:** Browserless vs Steel: Head-to-Head for AI Agents


**Priority issues**
- (BLOCKER) The 0.89s average / 1.09s p95 'create -> connect -> navigate -> release' benchmark is presented as a hard, citable number ('Steel's remote benchmark', 'the open benchmark') but has NO public source anywhere on Steel's site, docs (docs.steel.dev/llms-full.txt), or blog (steel.dev/blog has no benchmark post). Steel's homepage only claims '<1s Avg. Session Start Time' — a narrower, different metric (time-to-start, not the full lifecycle loop). It appears in the lede, comparison table, and 'When to choose Steel', making it load-bearing for the core 'Steel is faster' thesis.
  → *Fix:* Either (a) cite a real source if one exists internally and link it, or (b) downgrade to Steel's actual published claim: replace '0.89 second average and 1.09 second p95 for the create -> connect -> release loop' with 'Steel advertises sub-second average session start times on its homepage (<1s Avg. Session Start Time)' and drop '0.89 s average / 1.09 s p95 lifecycle in the open benchmark' from the comparison table, replacing it with 'Sub-second average session start (per steel.dev); no public full-lifecycle benchmark'. Also soften 'the open benchmark' → 'Steel's homepage benchmark'.
- (HIGH) '24 hour sessions' is repeated 4x as a general Steel capability, but per docs.steel.dev/overview/pricinglimits the max session time is 15 minutes (Launch), 1 hour (Scale), and only 'Up to 24 hours' on Enterprise. A reader on the free Launch or $250/mo Scale plan — the tiers most prospects start on — does not get 24h sessions.
  → *Fix:* Everywhere '24 hour sessions' appears, add the plan caveat. E.g. change '24 hour session ceilings' (lede) to 'session ceilings up to 24 hours on Enterprise (15 min on Launch, 1 hour on Scale)'. In the comparison table 'Max session time' row for Steel, use: '15 min / 1 hr / up to 24 hr by plan (Launch/Scale/Enterprise)'. In 'When to choose Steel': 'Steel's Enterprise tier supports 24-hour sessions…'.
- (HIGH) The Trade-offs table asserts 'Steel Cloud offers SOC 2'. There is zero mention of SOC 2 anywhere in Steel's docs, legal page, pricing page, homepage, or blog (verified July 2026). Steel does advertise 'HIPAA-ready BAA' and 'Enterprise SSO' on Scale/Enterprise. There is no trust center or /security page.
  → *Fix:* Replace 'Steel Cloud offers SOC 2 plus Files/Credentials boundaries' with the verified formulation: 'Steel Cloud offers HIPAA-ready BAA and Enterprise SSO on Scale and Enterprise, plus Files/Credentials boundaries'. If Steel has in fact completed SOC 2, link the primary source (trust report / auditor letter) before restoring the claim.
- (MEDIUM) 'Managed stealth' is framed throughout as a core, generally-available Steel feature (summary, comparison table 'Anti-bot posture', 'When to choose Steel', Trade-offs). But the pricing table shows 'Stealth Browser' is Included ONLY on Enterprise — it is '-' (not available) on Launch and Scale. Captcha solving IS metered/available across plans ($3/1k Launch, $1/1k Scale), so the CAPTCHA part is fine; the stealth part is Enterprise-gated.
  → *Fix:* Add a plan caveat wherever 'managed stealth' appears as a Steel strength. E.g. in the comparison table Anti-bot row: 'Managed stealth profiles (Stealth Browser is an Enterprise feature; CAPTCHA solving metered on all paid plans), CAPTCHA API, regional proxy pools, mobile mode, BYO proxies'. Source: docs.steel.dev/overview/pricinglimits.
- (MEDIUM) 'Profiles persist login state up to 30 days' misreads the docs. The 30-day figure is the inactivity-auto-deletion threshold ('If a profile is not used after 30 days, it will be automatically deleted'), NOT a maximum persistence window. Profiles persist indefinitely as long as they are used within each 30-day window. The docs also note a 300 MB profile size limit.
  → *Fix:* In the comparison table State & auth row for Steel, replace 'Profiles persist login state up to 30 days' with: 'Profiles persist cookies/auth/extensions/settings across sessions (auto-deleted only after 30 days unused; 300 MB profile cap)'.


**Claim checks** (verified verdict shown)
- [CONFIRMED-ACCURATE] · statistic · Steel's remote benchmark holds at 0.89 second average and 1.09 second p95 for the create -> connect -> navigate -> release loop  *(adversarially verified)*
  → Keep the numbers (0.89s avg / 1.09s p95 are correct) but ADD THE CITATION and slightly soften "holds" to reflect a measured sample rather than an ongoing guarantee. Replace: "Steel's remote benchmark holds at 0.89 second average and 1.09 second p95 for the create -> connect -> navigate -> release loop" with: "Steel's own lifecycle benchmark (create → connect → navigate → release) shows a 0.89 second average and 1.09 second p95 across a 5,000-run sample ([browserbench](https://github.com/steel-dev/browserbench))." If the article's tone requires staying first-party proud, a minimal fix is to append the bare citation: "...for the create -> connect -> navigate -> release loop ([source](https://github.com/steel-dev/browserbench))." Either way, the citation is the load-bearing fix; the numerals need no change.
  src: https://github.com/steel-dev/browserbench · https://github.com/steel-dev/browserbench/blob/main/README.md
- [NEEDS-SOFTENING] · steel-product · 24 hour session ceilings / 'Steel's 24 hour sessions'  *(adversarially verified)*
  → Qualify the ceiling as plan-tiered in all four locations. Edits:

1) Lede (line 30): change "pairing that throughput with 24 hour session ceilings, persistent [Profiles](@/glossary/profiles.md)" to "pairing that throughput with plan-based session ceilings (up to 24 hours on Enterprise; 1 hour on Scale), persistent [Profiles](@/glossary/profiles.md)".

2) Comparison table (line 37): change "Teams that need sub-second lifecycle speed, 24 hour sessions, managed stealth and CAPTCHA APIs" to "Teams that need sub-second lifecycle speed, long-running sessions (up to 24 hours on Enterprise), managed stealth and CAPTCHA APIs".

3) 'When to choose Steel' (line 76): change "Steel's 24 hour sessions, Profiles, and live viewer make that practical." to "Steel's long-running sessions (up to 24 hours on Enterprise; 1 hour on Scale), Profiles, and live viewer make that practical."

4) Trade-offs (line 86): change "24 hour ceiling enforced; concurrency caps per plan demand queue discipline" to "Up to 24 hour ceiling on Enterprise (1 hour on Scale, 15 min on Launch); concurrency caps per plan demand queue discipline".
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/overview/sessions-api/session-lifecycle
- [CONFIRMED-INACCURATE] · steel-product · Steel Cloud offers SOC 2  *(adversarially verified)*
  → Replace "Steel Cloud offers SOC 2" with: "Steel advertises HIPAA-ready BAA and Enterprise SSO on Scale/Enterprise plans; no SOC 2 report or public trust center as of July 2026 (steel.dev/security, /trust, /trust-center all return 404)." This states Steel's actual marketed compliance posture instead of asserting an unverified certification.
  src: https://steel.dev/ · https://docs.steel.dev/llms-full.txt
- [CONFIRMED-INACCURATE] · steel-product · Profiles persist login state up to 30 days  *(adversarially verified)*
  → Replace "Profiles persist login state up to 30 days, Credentials API injects secrets without exposing them to your agent, Files API handles uploads/downloads" with: "Profiles persist login state across sessions (auto-deleted after 30 days of inactivity), Credentials API injects secrets without exposing them to your agent, Files API handles uploads/downloads"
  src: https://docs.steel.dev/overview/profiles-api/overview
- [NEEDS-SOFTENING] · steel-product · Managed stealth profiles [as a general Steel capability]  *(adversarially verified)*
  → Soften the flagged Anti-bot posture row (line 47) and add a tier caveat. Replace the Steel cell: ORIGINAL — "Managed stealth profiles, CAPTCHA API, regional proxy pools, mobile mode, plus the option to bring your own proxies" -> REPLACEMENT — "CAPTCHA API (metered $3/1k on Launch, $1/1k on Scale), regional proxy pools, mobile mode, BYO proxies, plus managed stealth — note the dedicated Stealth Browser feature is Included on Enterprise only (shown as unavailable on Launch/Scale), though Steel Cloud sessions still ship baseline anti-detection fingerprinting via stealthConfig." Also tighten the Trade-offs line (line 87) from "Managed stealth reduces manual tuning, yet full control requires Steel Cloud plan tiers or BYO proxies" to "Managed stealth reduces manual tuning, but the dedicated Stealth Browser feature is Enterprise-only; Launch/Scale rely on Cloud baseline anti-detection plus BYO proxies." The summary (line 28) "managed stealth and CAPTCHA handling" and the "When to choose Steel" bullet (line 78) can remain as long as the Anti-bot posture row and Trade-offs carry the Enterprise-gating caveat.
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud
- [CONFIRMED-INACCURATE] · steel-product · structured Agent Logs / agent logs (Steel observability surface)  *(adversarially verified)*
  → Rename the feature to its actual product name in both spots. (1) Comparison table, line 46: change "structured Agent Logs" to "structured Agent Traces". (2) Prose, line 58: change "Steel bundles live viewer embeds, MP4/HLS replay, agent logs, and Files exports" to "Steel bundles live viewer embeds, MP4/HLS replay, Agent Traces, and Files exports".
  src: https://docs.steel.dev/overview/agent-traces/overview · https://docs.steel.dev/
- [ACCURATE] · steel-product · Neutral CDP endpoint works with Playwright, Puppeteer, Selenium, Browser Use, Stagehand, plus Steel SDKs
  src: https://docs.steel.dev/overview/sessions-api/quickstart · https://docs.steel.dev/integrations/playwright
- [ACCURATE] · steel-product · sessions.release() discipline / release-all safety nets
  src: https://docs.steel.dev/overview/sessions-api/session-lifecycle
- [ACCURATE] · steel-product · Steel Local is effectively single-session while Steel Cloud scales into the hundreds
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud · https://docs.steel.dev/overview/pricinglimits
- [ACCURATE] · steel-product · Open-source Steel Browser for local/self-host
  src: https://github.com/steel-dev/steel-browser
- [ACCURATE] · competitor · Browserless gives you a 1,000 unit free tier
  src: https://www.browserless.io/pricing
- [ACCURATE] · competitor · Native integrations with LangChain, Zapier, n8n, REST-first scraping services (Browserless)
  src: https://docs.browserless.io/ · https://www.browserless.io/
- [ACCURATE] · competitor · REST shortcuts like /content and /screenshot (Browserless)
  src: https://docs.browserless.io/rest-apis/content.md · https://docs.browserless.io/rest-apis/screenshot-api.md
- [CONFIRMED-INACCURATE] · competitor · with Browserless you own log capture, replay exports, and human-in-loop wiring even if you lean on its session replay API  *(adversarially verified)*
  → Rewrite the lede clause (article line 30) to concede the built-in features and keep only the true "you own the retention/audit pipeline" kernel, and fix the comparison-table HITL row (line 49).

LEDE (replace the clause): "but you own log capture, replay exports, and human-in-loop wiring even if you lean on its session replay API" -> "but recordings are plan-retention-bound and piping them into your own audit stack is on you, even with its built-in Session Replay, Screen Recording, and Hybrid Automation features"

COMPARISON TABLE, Human-in-loop readiness (line 49): "Manual: stream CAPTCHAs or expose Browserless viewer, but pausing/resuming sessions is your code" -> "Built-in Hybrid Automation pauses a script and hands control to a human via a secure LiveURL, then resumes; no structured approvals queue or audit export is bundled"

Line 58 ("Browserless exposes a session replay endpoint and REST captures, yet retention and audit flow are on you") is accurate and can stay. Optionally soften line 46 ("you choose how long to keep them") since retention is plan-tiered rather than fully customer-controlled.
  src: https://docs.browserless.io/browserql/session-management/session-replay · https://docs.browserless.io/baas/monitor-sessions/hybrid-automation
- [ACCURATE] · steel-product · Steel bundles live viewer embeds, MP4/HLS replay, ... on every managed plan
  → Add caveat: replay/retention is bounded by per-plan data retention (7 days Launch / 14 days Scale / custom Enterprise).
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions · https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions


**Top improvements**
- (HIGH) Replace the fabricated-feeling benchmark with a citable claim. The article's central thesis is 'Steel = measurable lifecycle speed,' yet the one number it cites has no source. Either publish the harness (methodology, region, payload, sample size) on steel.dev/blog and link it, or fall back to the homepage's '<1s Avg. Session Start Time' and reframing: Steel measures and publishes a speed number; Browserless does not publish one. That alone is a legitimate, defensible differentiator. — The 'measured speed' thesis is the article's strongest argument and currently rests on an unverifiable stat; sourcing it (or downscoping it) is the difference between a trustworthy comparison and a marketing hit piece.
- (HIGH) Add a short, neutral 'Plan specifics' subsection (or a third axis in the comparison table) showing Launch/Scale/Enterprise limits next to Browserless Free/Prototyping/Starter/Scale. State explicitly: Stealth Browser and the 24-hour session ceiling are Enterprise-only; Launch sessions cap at 15 minutes. — Four of the article's Steel strengths (24h sessions, managed stealth, and implied broad availability of CAPTCHA/stealth) are plan-gated. Readers evaluating on Launch/Scale will not recognise the product the article describes.
- (MEDIUM) Reframe the observability contrast to be accurate about what Browserless ships. Browserless has Session Replay (DOM replay), Screen Recording (WebM), dashboard, and a Hybrid Automation pause-for-human mode; retention runs 1-90 days by tier. The honest Steel differentiator is default-on embed/approval surfaces, Agent Traces timeline, and audit-oriented packaging — not 'Browserless has no replay.' — The current framing ('you own log capture, replay exports') is factually wrong and undercuts the article's neutrality claim, which is the whole positioning angle.


**Supporting material to add**
- Steel's authoritative pricing/limits table (verified 2026-07-13): Launch $0 + $30 one-time credits, 10 concurrent, 15-min max session, 60 RPS, 7-day retention; Scale $250 + $100/mo credits, 100 concurrent, 1-hr max session, 600 RPS, 14-day retention; Enterprise custom, 1,000+ concurrent, up to 24-hr session, custom RPS/retention. Metered: browser hours $0.10/$0.08 per hr, proxy $10/$6 per GB, captcha $3/$1 per 1k, browser tools $5/1k. Stealth Browser & reserved pools = Enterprise-only; HIPAA-ready BAA & Enterprise SSO = Scale/Enterprise.  _[where: Comparison table 'Pricing & limits' row and a new short 'Plan specifics' callout under the comparison table.]_  (https://docs.steel.dev/overview/pricinglimits)
- Browserless pricing tiers (verified 2026-07-13) for an apples-to-apples limits comparison: Free (1k units, 2 concurrent, 1-min session, 1-day retention), Prototyping $25/mo (20k units, 10+5 concurrent, 15-min session), Starter $140/mo (180k units, 40+10, 30-min, 30-day retention), next tier (500k units, 100+20, 60-min, 90-day), Enterprise custom. CAPTCHA solving and proxies included even on Free.  _[where: Comparison table 'Pricing & limits' and 'Session economics' rows, to give concrete Browserless ceilings next to Steel's.]_  (https://www.browserless.io/pricing)
- Steel's CDP endpoint, verified verbatim from the quickstart: `wss://connect.steel.dev?apiKey=${STEEL_API_KEY}&sessionId=${session.id}` — the concrete proof for the 'neutral CDP endpoint' claim.  _[where: 'Control and orchestration boundaries' section or a one-line code snippet under the comparison table.]_  (https://docs.steel.dev/overview/sessions-api/quickstart)
- Steel Browser open-source repo: github.com/steel-dev/steel-browser, Apache-2.0, ~7.3k stars — primary citation for the self-host/open-source claim.  _[where: 'Deployment and billing math' or the 'Deployment footprint' row of the comparison table.]_  (https://github.com/steel-dev/steel-browser)
- Steel homepage's actual published speed claim is '<1s Avg. Session Start Time' (and '800B+ Tokens Scraped', '800,000+ Browser Hours Served') — the only Steel-side number you can cite instead of the unsubstantiated 0.89/1.09.  _[where: Lede and the comparison table 'Lifecycle speed' row.]_  (https://steel.dev/)
- Browserless's own observability stack is broader than the article implies: Session Replay (interactive DOM replay in dashboard), Screen Recording (WebM via CDP start/stop, LiveURL), and a Hybrid Automation mode that pauses automation and hands control to a human via a secure URL. Cite these so the contrast with Steel stays fair.  _[where: 'Evidence and replay expectations' section and the Trade-offs 'Evidence burden' row.]_  (https://docs.browserless.io/baas/monitor-sessions/session-replay.md)



---


### chrome-extensions-for-browser-agents — readiness 8/10


**Title:** Chrome Extensions for Browser Agents


**Priority issues**
- (HIGH) TypeScript sample for client.extensions.list() is wrong and will throw at runtime. The code does `const extensions = await client.extensions.list(); const redactorId = extensions.find(...).id`, treating the return as a bare array. Per Steel's own cookbook (docs.steel.dev/cookbook/extensions), list() returns a wrapper object; the canonical usage is `(await client.extensions.list()).extensions.find(...)`.
  → *Fix:* Replace lines 59-62 with:
```typescript
const { extensions } = await client.extensions.list();
const redactor = extensions.find((ext) => ext.id === REDACTOR_ID);
```
(Store the id returned from upload() and look it up by id, since Steel normalizes extension names — see next issue.)
- (MEDIUM) The article finds extensions by exact human-readable name (ext.name === 'Redactor'). Steel normalizes/truncates uploaded extension names (e.g. the store title 'GitHub Isometric Contributions' comes back as 'Github_Isometric_Contribu'), so a name equality check is fragile.
  → *Fix:* Recommend persisting the id returned from upload() and matching on id, or substring-matching the normalized name. Add a one-line note: 'Steel normalizes extension names (truncated + underscored), so store the id from upload() and match on id rather than the display name.'
- (LOW) Claim that extensions are 'visible in live embeds and HLS replays' is presented as fact but is not documented on the Extensions API page. It is a reasonable inference (extensions render inside the recorded browser viewport) but unverified.
  → *Fix:* Soften to: 'Because the extension renders inside the same browser viewport Steel records, its overlays also appear in live embeds and session replays.' Or remove the HLS-specific claim and keep 'live embeds' only.
- (LOW) 'Still limited when... you expect hot-reloading mid-session; extensions only load at startup' is an inference. The docs state extensions load/initialize at session start but do not explicitly state that mid-session reload is unsupported.
  → *Fix:* No change required; optionally rephrase 'extensions only load at startup' to 'extensions load at session start (see docs)' to anchor the inference to the documented behavior.
- (LOW) Next-steps links to the API overview but omits Steel's worked cookbook recipe, which has runnable TS/Python/Go/Rust examples that directly strengthen the 'Implementation path' section.
  → *Fix:* Add to Next steps: '- Follow the [Upload and run browser extensions](https://docs.steel.dev/cookbook/extensions) cookbook recipe for end-to-end TypeScript and Python examples.' Also add this URL to the article's external_refs frontmatter.


**Claim checks** (verified verdict shown)
- [ACCURATE] · steel-product · Steel's Extensions API is currently in beta.
  src: https://docs.steel.dev/overview/extensions-api/overview
- [ACCURATE] · steel-product · You upload an extension once for your organization via .zip, .crx, or a Chrome Web Store URL.
  src: https://docs.steel.dev/overview/extensions-api/overview · https://docs.steel.dev/cookbook/extensions
- [ACCURATE] · steel-product · You inject extensions by passing extensionIds (TS) / extension_ids (Python) or the shortcut all_ext when creating the session.
  src: https://docs.steel.dev/overview/extensions-api/overview · https://docs.steel.dev/cookbook/extensions
- [ACCURATE] · steel-product · Methods client.extensions.upload / list / update / delete / deleteAll exist with these names.
  src: https://docs.steel.dev/overview/extensions-api/overview
- [CONFIRMED-INACCURATE] · steel-product · const extensions = await client.extensions.list(); const redactorId = extensions.find((ext) => ext.name === 'Redactor').id;  *(adversarially verified)*
  → Replace the snippet with the cookbook's established pattern — access the `.extensions` property, use optional chaining so a missing match does not throw, and avoid a fragile exact-name literal. Suggested replacement:

```js
const extensions = await client.extensions.list();
const redactorId = extensions.extensions.find(
  (ext) => ext.name === "Redactor"
)?.id;
```

Note that extension names are returned normalized (truncated and underscored, e.g. "Github Isometric Contributions" becomes "Github_Isometric_Contribu"), so the exact string `"Redactor"` may need to match its normalized form. Prefer matching on extensionId or a stored id when available rather than a literal name.
  src: https://docs.steel.dev/cookbook/extensions · https://docs.steel.dev/overview/extensions-api/overview
- [ACCURATE] · steel-product · Extensions load and initialize when the session boots (not hot-reloadable mid-session).
  src: https://docs.steel.dev/overview/extensions-api/overview · https://docs.steel.dev/cookbook/extensions
- [ACCURATE] · steel-product · Use `steel browser live` or the debug URL to confirm the extension shows up in chrome://extensions.
  src: https://docs.steel.dev/overview/steel-cli
- [ACCURATE] · steel-product · Capture a `snapshot -i` so the evidence includes the extension's overlay or output.
  src: https://docs.steel.dev/overview/steel-cli
- [NEEDS-SOFTENING] · steel-product · The same extension is visible in live embeds and HLS replays.  *(adversarially verified)*
  → Replace the sentence "They also play nicely with human-in-the-loop steps because the same extension is visible in live embeds and HLS replays." with: "They also play nicely with human-in-the-loop steps: an overlay the extension renders into the page carries through to both the live WebRTC embed and the MP4/HLS replay, so a reviewer watching either one sees the same guardrails." This scopes "visible" to in-page overlays (the relevant HITL case) rather than implying all extension UI is captured, grounds the terminology in Steel's actual Embed Sessions doc (WebRTC live, MP4/HLS past), and avoids asserting an undocumented blanket guarantee.
  src: https://docs.steel.dev/overview/extensions-api/overview · https://docs.steel.dev/overview/sessions-api/embed-sessions
- [ACCURATE] · technical · Extensions carry the permissions declared in manifest.json and add weight to the session.
  src: https://docs.steel.dev/overview/extensions-api/overview
- [ACCURATE] · third-party · Internal link [CDP](@/glossary/cdp.md) and external link https://docs.steel.dev/overview/extensions-api/overview.
  src: https://docs.steel.dev/overview/extensions-api/overview


**Top improvements**
- (MEDIUM) Add a short 'What won't work' note: extensions do NOT give the agent a way to call Steel services (Files, Credentials, Profiles) directly — the article hints at this in the Guardrails table but understates it. Make explicit that an extension is isolated browser-side logic and still needs orchestrator glue to push data into Steel artifacts. — Sets correct expectations and pre-empts a common misconception (treating extensions as a backdoor into Steel APIs).
- (LOW) Note the interaction between extension-equipped long-running sessions and tier max-session-time limits (Launch 15 min, Scale 1 hour, Enterprise up to 24h per the Pricing/Limits page). An org that boots a heavy telemetry extension expects sessions to live long; flag the tier dependency. — Adds a concrete, citable trade-off and pre-empts support questions; pricing was verified at /overview/pricinglimits on 2026-07-13.
- (LOW) Add a one-line caveat that a fresh Steel session boots a clean Chrome with nothing installed (per cookbook), so extension state does NOT persist across sessions unless you re-attach via extensionIds each time. The article implies this but never states it. — Prevents a reader assuming extension storage/state carries over between sessions.


**Supporting material to add**
- Steel's official cookbook recipe 'Upload and run browser extensions' (docs.steel.dev/cookbook/extensions) — runnable TS/Python/Go/Rust examples that upload an extension, attach it via extensionIds, and prove attachment by waiting on an extension-injected selector. Notably it documents that content scripts/background workers load BEFORE the first page.goto, so the extension has already mutated the DOM by the time Playwright observes it.  _[where: Implementation path (as a canonical worked-example link) and/or Next steps]_  (https://docs.steel.dev/cookbook/extensions)
- Cookbook note that extension names come back normalized (truncated + underscored), e.g. 'GitHub Isometric Contributions' returns as 'Github_Isometric_Contribu'. This is authoritative evidence for why the article's name-based lookup is fragile.  _[where: Implementation path step 3, alongside the .list() fix]_  (https://docs.steel.dev/cookbook/extensions)
- Steel CLI reference (docs.steel.dev/overview/steel-cli) documenting the named-session lifecycle (start -> work -> stop) and the snapshot -i / browser live commands used in step 5. Useful to link so readers can reproduce the verification step.  _[where: Implementation path step 5]_  (https://docs.steel.dev/overview/steel-cli)



---


### claude-computer-use-with-steel — readiness 4/10


**Title:** Claude Computer Use With Steel


**Priority issues**
- (BLOCKER) Both code examples are non-functional. They forward Claude's computer-use action names and fields directly to Steel: `steel.sessions.computer(session.id, { action: block.input.action, ...block.input, screenshot: true })` (TS) and `{**block.input, "screenshot": True}` (Python). Claude emits `left_click`/`type`/`key`/`screenshot`/`wait`/`scroll` with a `coordinate` field, but Steel's Computer API expects `click_mouse`/`type_text`/`press_key`/`take_screenshot`/`scroll` with `coordinates` (plural, array) and pixel-based scroll deltas. Steel's own cookbook (cookbook/claude-computer-use) implements a dedicated translate/normalize layer (left_click->click_mouse, CTRL->Control, scroll_amount x100 -> delta_y, coordinate->[coordinates]); the article's code skips it entirely. The code also contradicts the article's own prose (step 3 says 'translate its action payload', and the table lists 'click, press_key, type_text, scroll, take_screenshot') — but the code does no translation.
  → *Fix:* Replace both snippets with a real translation layer, or — much simpler and lower-maintenance — point readers at the canonical starters: `steel forge claude-computer-use-ts` and `steel forge claude-computer-use-py` (from https://docs.steel.dev/cookbook/claude-computer-use). Keep a minimal snippet that shows only the session.create + a single mapped call, e.g. map `left_click` -> `action:'click_mouse', coordinates:block.input.coordinate, screenshot:true`, `type` -> `action:'type_text', text:block.input.text`, `key` -> `action:'press_key', text:normalizeKey(block.input.text)`, `screenshot` -> `action:'take_screenshot'`, and multiply `scroll_amount` by 100 into `delta_y`.
- (HIGH) The intro states 'sub-second sessions that last up to 24 hours' as a general Steel capability, but the 24-hour session ceiling is Enterprise-only. Verified on https://docs.steel.dev/overview/pricinglimits (Last Edit June 30, 2026): Max session time is 15 minutes (Launch), 1 hour (Scale), and 'Up to 24 hours' (Enterprise). The later trade-off line (line 220) frames 24h correctly as the Enterprise ceiling, but the opening promise overstates what most plans get.
  → *Fix:* Reword line 30 to: 'sub-second-to-seconds session startup with a lifetime that scales with your plan (15 min on Launch, 1 hour on Scale, up to 24 hours on Enterprise), plus live viewer and replay links...'
- (HIGH) The tool/model pairing is a generation behind Steel's own current docs. The article uses `computer_20250124` + beta `computer-use-2025-01-24` + model `claude-sonnet-4-5`. Anthropic's docs confirm this combination IS valid for Sonnet 4.5 specifically, but Steel's current Claude Computer Use integration page and all four cookbook recipes use `computer_20251124` + `computer-use-2025-11-24` (the version for Claude Sonnet 5, Opus 4.8/4.7/4.6, Sonnet 4.6, Opus 4.5). A reader who swaps in a newer model (as they should) while keeping the article's tool version will get a model/tool-version mismatch.
  → *Fix:* Update the tool definition to `type: "computer_20251124"`, the beta to `computer-use-2025-11-24`, and the model to a current one (e.g. `claude-sonnet-4-6` or `claude-opus-4-7`). Add a one-line note: 'Anthropic ships a new computer-use tool version per model family — confirm the pairing at Anthropic's computer-use docs before swapping models.'
- (MEDIUM) Python example uses `api_timeout=900000` to set session lifetime, but the Python SDK's session-lifetime parameter is `session_timeout` (e.g. `session_timeout=1800000`), as documented across multiple Steel cookbook recipes. `api_timeout` is not the session lifetime knob and may be ignored or refer to HTTP request timeout.
  → *Fix:* In the Python loop, change `api_timeout=900000` to `session_timeout=900000` to match the TS `timeout: 900_000` semantics.
- (MEDIUM) Observability table references `steel.sessions.logs.list(session.id)` for 'Agent logs', but Steel's current observability API is Agent Traces (`GET /v1/sessions/:id/agent-traces`). `sessions.logs` / `.logs.list` does not appear anywhere in Steel's current llms-full.txt or docs; it has been superseded by Agent Traces (returns typed activity events: click, input, navigate, scroll, drag, error).
  → *Fix:* Replace `steel.sessions.logs.list(session.id)` with the Agent Traces endpoint, e.g. `GET https://api.steel.dev/v1/sessions/{id}/agent-traces` (SDK: `steel.sessions.traces...` / REST). Reword the row: 'Agent traces | Agent Traces API (/v1/sessions/:id/agent-traces) | Store click/input/navigate events beside Anthropic transcripts.'
- (LOW) 'Sub-second sessions' / 'Sub-second startup' (lines 30, 43) is used as a concrete capability claim but is not substantiated by Steel's docs. Steel does not publish a startup-time SLA or 'sub-second' figure in the sessions docs, pricing page, or cookbook.
  → *Fix:* Either cite a Steel benchmark with a link, or soften to 'fast session startup' without a numeric claim.


**Claim checks** (verified verdict shown)
- [STALE] · technical · Hand the computer_20250124 tool a Steel session; computer_20250124 remains the only tool in tools.  *(adversarially verified)*
  → Update tool type, beta header, and model to match Steel's current canonical guidance (computer_20251124 + computer-use-2025-11-24 + a current model). Edits in /Users/nikola/dev/steel/llms-steel-dev/content/articles/claude-computer-use-with-steel.md:

(1) Intro line — replace "hand the `computer_20250124` tool a Steel session" with "hand the `computer_20251124` tool a Steel session".

(2) 'What stays the same' table, Tool contract row — replace "`computer_20250124` remains the only tool in `tools`" with "`computer_20251124` remains the only tool in `tools`".

(3) Both code samples (TypeScript + Python) — replace `type: "computer_20250124"` with `type: "computer_20251124"`; replace `betas: ["computer-use-2025-01-24"]` with `betas: ["computer-use-2025-11-24"]`; and replace `model: "claude-sonnet-4-5"` with `model: "claude-sonnet-4-6"` (REQUIRED for consistency — claude-sonnet-4-5 is locked to the old computer_20250124 tool per Anthropic's docs, so the model must move to a 2025-11-24-compatible model such as claude-sonnet-4-6; claude-opus-4-8 also works and matches Anthropic's own quickstart).

(4) 'Not yet ideal when' bullet — replace "does not yet have `computer-use-2025-01-24` access" with "does not yet have `computer-use-2025-11-24` access".
  src: https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/computer-use-tool · https://docs.steel.dev/integrations/claude-computer-use
- [CONFIRMED-ACCURATE] · steel-product · Steel supplies 'sub-second sessions that last up to 24 hours'.  *(adversarially verified)*
  → No change needed. The claim is accurate as written — it is near-verbatim from Steel's own homepage ("each session can run up to 24 hours" + "sub-second startup") and Session Lifecycle doc ("Up to 24 hours, depending on your plan"). Optional precision tweak (not required for accuracy): you could append "depending on your plan" after "up to 24 hours" to mirror Steel's docs framing and preempt the reviewer's plan-dependency concern, e.g. "Steel supplies sub-second sessions that last up to 24 hours depending on your plan." But strictly, no change is required.
  src: https://steel.dev/ · https://docs.steel.dev/overview/sessions-api/session-lifecycle
- [ACCURATE] · technical · betas: ["computer-use-2025-01-24"] with model "claude-sonnet-4-5".
  → Valid as-is for Sonnet 4.5; update to computer-use-2025-11-24 if moving to a newer model.
  src: https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/computer-use-tool
- [ACCURATE] · steel-product · session = steel.sessions.create({dimensions:{width,height}, blockAds:true, timeout:900000}); then steel.sessions.computer(...); steel.sessions.release(session.id).
  src: https://docs.steel.dev/overview/sessions-api/session-lifecycle · https://docs.steel.dev/overview/sessions-api/quickstart
- [CONFIRMED-INACCURATE] · steel-product · The Computer API bridge maps click/press_key/type_text/scroll/take_screenshot; forward each tool call to steel.sessions.computer(session.id, body).  *(adversarially verified)*
  → Replace the 'Computer API bridge' row. Current middle and right cells: "Deterministic mapping for `click`, `press_key`, `type_text`, `scroll`, `take_screenshot`" and "Forward each tool call to `steel.sessions.computer(session.id, body)` and return the screenshot data URI". Replace with: middle cell = "Translates Claude's `left_click`/`type`/`key`/`scroll`/`screenshot` into Steel's `click_mouse`/`type_text`/`press_key`/`scroll`/`take_screenshot` (the two vocabularies do not match)" and right cell = "Switch on Claude's action name, build the Steel action body, call `steel.sessions.computer(session.id, body)`, then return the screenshot data URI". The article's TypeScript/Python samples must also be fixed: they currently spread `block.input`/`**block.input` verbatim, which sends Claude's raw action names (left_click, type, key, screenshot) that Steel rejects; add the same action-name translation (e.g. left_click->click_mouse, type->type_text, key->press_key, screenshot->take_screenshot) shown in the Steel cookbook before calling sessions.computer. Separately, update the tool type/beta from `computer_20250124`/`computer-use-2025-01-24` to `computer_20251124`/`computer-use-2025-11-24` to match current Steel docs.
  src: https://docs.steel.dev/cookbook/claude-computer-use · https://docs.steel.dev/integrations/claude-computer-use
- [CONFIRMED-ACCURATE] · steel-product · Python: steel.sessions.create(dimensions=..., block_ads=True, api_timeout=900000).  *(adversarially verified)*
  src: https://pypi.org/pypi/steel-sdk/json · https://files.pythonhosted.org/packages/6d/2e/a79dfc99dac6989015ac15523206f8a2f8f08eeaefdc63b69c4703a362a1/steel_sdk-0.19.0-py3-none-any.whl (steel/types/session_create_params.py: api_timeout aliased to 'timeout'; session_timeout does not exist)
- [ACCURATE] · steel-product · Log session.sessionViewerUrl (TS) / session.session_viewer_url (Python); return screenshot.base64_image / resp.base64_image.
  src: https://docs.steel.dev/overview/sessions-api/quickstart · https://docs.steel.dev/overview/llms-full.txt
- [CONFIRMED-INACCURATE] · steel-product · steel.sessions.logs.list(session.id) stores click and DOM logs beside Anthropic transcripts.  *(adversarially verified)*
  → Replace the table row `| Agent logs | `steel.sessions.logs.list(session.id)` | Store click and DOM logs beside Anthropic transcripts |` with `| Agent traces | `GET /v1/sessions/{id}/agent-traces` (with `steel-api-key` header) | Store the browser-activity timeline (click, input, navigate, scroll, drag, error events) beside Anthropic transcripts |`. If an SDK call is preferred over raw fetch, note that the Steel docs expose this only as the REST endpoint / Agent Traces dashboard tab; use `fetch(\`\${STEEL_API_URL}/v1/sessions/\${session.id}/agent-traces\`, { headers: { 'steel-api-key': STEEL_API_KEY } })`.
  src: https://docs.steel.dev/llms.txt · https://docs.steel.dev/overview/agent-traces/api
- [ACCURATE] · steel-product · steel.sessions.captchas.status(session.id) pauses Claude until Steel clears the challenge.
  → Clarify: poll captchas.status(), then call captchas.solve(sessionId) (or enable solveCaptcha at create) to clear it.
  src: https://docs.steel.dev/overview/captchas-api/overview · https://docs.steel.dev/overview/llms-full.txt
- [ACCURATE] · steel-pricing · Steel is Chrome in the cloud only; runs cannot exceed the 24 hour session ceiling without Enterprise increases; concurrency is bounded by plan tier.
  src: https://docs.steel.dev/overview/pricinglimits
- [CONFIRMED-INACCURATE] · steel-product · docs.steel.dev/integrations/claude-computer-use hosts TypeScript and Python quickstarts that run end to end.  *(adversarially verified)*
  → Replace the claim. Suggested replacement: "docs.steel.dev/integrations/claude-computer-use covers setup and the connection model; full runnable TypeScript and Python starters live in the cookbook at docs.steel.dev/cookbook/claude-computer-use." (If the checklist line must cite only one URL for "runs end to end," it should point to the cookbook, not the integration page.)
  src: https://docs.steel.dev/integrations/claude-computer-use · https://docs.steel.dev/cookbook/claude-computer-use


**Top improvements**
- (HIGH) Reconstruct both code blocks around a real Claude->Steel action translator (left_click/right_click/double_click/triple_click->click_mouse with button+numClicks; type->type_text; key/hold_key->press_key with key normalization CTRL->Control, ESC->Escape, UP->ArrowUp; scroll->scroll with scroll_amount x100 -> delta_y; screenshot->take_screenshot; left_click_drag from viewport center). This is the single change that moves the article from non-runnable to trustworthy. — The article's central promise is a working Computer Use loop on Steel; the current code fails on the first action. Steel's cookbook already solved this — mirror it or link out.
- (HIGH) Add a 4-row 'Plan limits that affect this loop' mini-table (max session time, concurrency, RPM, retention for Launch/Scale/Enterprise) so readers can size queues against their tier. Replace the unconditional '24 hours' promise in the intro with the tiered reality. — The 24h claim is Enterprise-only; surfacing tiered limits turns a misleading boast into a useful planning aid.
- (MEDIUM) Add a short 'Stop conditions and idle cost' subsection covering: (a) loop ends when Claude returns text-only, (b) guard against stalls with a repetition detector + iteration cap (Steel's recipe uses >80% word overlap across last 3 turns and a 50-iteration hard cap), (c) use inactivityTimeout to avoid paying while waiting on approvals, (d) always release in finally. — Production Computer Use loops stall and over-bill without these guards; the article currently only mentions release().


**Supporting material to add**
- Anthropic's authoritative model->beta matrix: 'computer-use-2025-11-24' for Sonnet 5, Opus 4.8/4.7/4.6, Sonnet 4.6, Opus 4.5; 'computer-use-2025-01-24' for Sonnet 4.5, Haiku 4.5. Lets the article name a current model+beta pair and warn readers the pairing changes per family.  _[where: In the code blocks and a short 'Model and tool version' note after 'Minimal integration path'.]_  (https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/computer-use-tool)
- Anthropic docs note the computer-use beta adds 466-499 tokens of system-prompt overhead per request, and that resolution limits vary by model (2576px long edge for Sonnet 5 / Opus 4.8 / 4.7; 1568px / ~1.15 MP for earlier models). The article's 1280x768 viewport (0.98 MP) is safely under the earlier-model limit — a good, citable justification.  _[where: 'Fit and trade-offs' or a short 'Cost' line under 'Pair Computer Use with Steel observability'.]_  (https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/computer-use-tool)
- Steel's own cookbook benchmarks for this exact loop: a simple browsing task runs 60-180 seconds and 10-40 iterations (TS/Python recipes, updated Apr-Jun 2026), plus a few cents of browser-minutes and Anthropic tokens. Citable, self-reported expectations to ground the 'sub-second' / scaling claims.  _[where: A new short 'What a run looks like' line at the end of 'Minimal integration path'.]_  (https://docs.steel.dev/cookbook/claude-computer-use)
- Steel pricing/limits table (verified Jul 2026): concurrency 10/100/1000+, RPM 60/600/custom, retention 7/14/custom days, max session 15 min / 1 h / up to 24 h. Concrete plan-tier data that makes the trade-offs section citable instead of vague.  _[where: 'Fit and trade-offs' -> 'Not yet ideal when' bullet about concurrency budget.]_  (https://docs.steel.dev/overview/pricinglimits)
- Steel supports an inactivityTimeout on session create that releases an idle browser early — directly relevant because Claude Computer Use loops often stall waiting on human approval or external steps.  _[where: 'What Steel adds' table (Session lifecycle row) or 'Go-live checklist'.]_  (https://docs.steel.dev/overview/sessions-api/session-lifecycle)



---


### embed-live-and-past-browser-sessions — readiness 7/10


**Title:** Embed Live and Past Browser Sessions in Your App


**Priority issues**
- (HIGH) Code example uses `client.sessions.create({ name: "qa-checkout" })`, but the shipped steel-sdk (v0.18.0) `SessionCreateParams` interface has no `name` field. The supported optional params are blockAds, concurrency, credentials, debugConfig, deviceConfig, dimensions, extensionIds, headless, namespace, persistProfile, profileId, proxyUrl, region, sessionContext, sessionId, solveCaptcha, stealthConfig, timeout, useProxy, userAgent. The official live-sessions doc uses bare `client.sessions.create()`. A reader pasting this into a TS project gets an excess-property type error.
  → *Fix:* Drop the non-existent param. Replace the snippet with:

const session = await client.sessions.create();
const { debugUrl } = session; // store for embeds

(Or, to show a real option: `const session = await client.sessions.create({ solveCaptcha: true });`)
- (MEDIUM) The HLS playback example is internally inconsistent with the article's own security guidance. It both (a) points at a proxied/signed manifest URL (`"/signed/steel/sessions/e4d6/hls.m3u8"`) AND (b) attaches the real Steel API key in the browser via `xhrSetup: (xhr) => xhr.setRequestHeader("steel-api-key", window.STEEL_API_KEY)`. The guardrails section explicitly says "Do not ship your Steel API key to the browser unchanged." A signed/proxied URL should never also require a client-side key — the backend should inject it.
  → *Fix:* Show ONE pattern. For the proxied/signed-URL approach (recommended), drop the client-side key entirely:

const manifestUrl = "/signed/steel/sessions/" + sessionId + "/hls.m3u8"; // your backend mints this and forwards steel-api-key
const hls = new Hls(); // no xhrSetup key — the proxy adds the header server-side
hls.loadSource(manifestUrl);
hls.attachMedia(video);

Keep the `xhrSetup` + `steel-api-key` variant only if you also show the direct api.steel.dev URL (as the official docs do), and label it "server-side / internal-only — never expose your key in a public browser app."
- (LOW) Trade-offs bullet claims rrweb "lacks cursor trails." rrweb records `IncrementalSource.MouseMove` and `MouseInteraction` events and its player renders a virtual cursor, so cursor movement IS captured and replayed. The real limitations are DOM-scoped capture (no canvas/WebGL/video frames, no cross-origin iframes, no OS chrome).
  → *Fix:* Rewrite the bullet: "**rrweb is legacy.** It reconstructs the DOM and input events (including cursor movement) but cannot capture canvas/WebGL, media frames, cross-origin iframes, or OS chrome — so replays can drift from what a user actually saw. Use it only when a workflow cannot move to headful sessions yet."
- (LOW) "Steel defaults to 600 px tall for readability" misstates the source of the 600 px value. 600 px is simply the iframe height used in the docs' example markup; Steel's viewer fills whatever iframe dimensions you set and does not impose a 600 px default.
  → *Fix:* Replace with: "Set explicit iframe dimensions so the WebRTC stream has a stable aspect ratio to fill; the docs' examples use 600 px tall, which is a reasonable starting point."


**Claim checks** (verified verdict shown)
- [ACCURATE] · steel-product · The `debugUrl` returned on session creation streams the headful browser over WebRTC at 25 fps.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions · https://docs.steel.dev/llms-full.txt
- [ACCURATE] · steel-product · Call `/v1/sessions/{id}/hls`, pass your API key (header `steel-api-key`), to get a playlist for any HLS player.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions
- [CONFIRMED-INACCURATE] · steel-product · `client.sessions.create({ name: "qa-checkout" })` creates a session and returns `debugUrl`.  *(adversarially verified)*
  → Replace with: "`client.sessions.create()` creates a session and returns `debugUrl`." This matches the SDK docs' canonical bare example and keeps the accurate debugUrl return statement. (Optional alternative if a named/human-readable session is desired for narrative clarity: there is no name field, so drop the param rather than inventing one.)
  src: https://github.com/steel-dev/steel-node/blob/main/src/resources/sessions/sessions.ts · https://github.com/steel-dev/steel-node/blob/main/README.md
- [ACCURATE] · steel-product · `debugUrl?interactive=true` lets viewers take control; `interactive=false` is read-only.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions
- [ACCURATE] · steel-product · Legacy sessions respect `theme`, `showControls`, `pageId`, and `pageIndex` query params (headless only).
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions
- [ACCURATE] · steel-product · Debug URLs are intentionally unauthenticated.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions
- [ACCURATE] · steel-product · Default session idle timeout is 5 minutes.
  → Consider "default session timeout" instead of "idle timeout" to match the SDK's wording.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions · https://www.npmjs.com/package/steel-sdk
- [ACCURATE] · steel-product · Fetch `/v1/sessions/{id}/events` and pipe into `rrweb-player` for legacy headless replay.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions · https://docs.steel.dev/llms-full.txt
- [CONFIRMED-INACCURATE] · technical · rrweb "lacks cursor trails" (as a limitation).  *(adversarially verified)*
  → Edit /Users/nikola/dev/steel/llms-steel-dev/content/articles/embed-live-and-past-browser-sessions.md line 99. Replace: "**rrweb is legacy.** It is great for deterministic DOM diffs but lacks cursor trails, media, or OS chrome. Use it only when a workflow cannot move to headful sessions yet." with: "**rrweb is legacy.** It is great for deterministic DOM diffs and even records mouse movement, but it only reconstructs the DOM — no pixel-accurate canvas/WebGL or video frames, and no OS chrome. Use it only when a workflow cannot move to headful sessions yet."
  src: https://raw.githubusercontent.com/rrweb-io/rrweb/master/packages/types/src/index.ts · https://raw.githubusercontent.com/rrweb-io/rrweb/master/packages/rrweb/src/record/index.ts
- [ACCURATE] · steel-product · Past-session replay is a "Durable MP4 recording that mirrors the live view without stitching screenshots."
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions
- [ACCURATE] · technical · Headful playback requires H.264 baseline.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions
- [ACCURATE] · technical · Safari plays HLS natively; Chrome, Edge, and Firefox need HLS.js or a comparable library.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions · https://cdn.jsdelivr.net/npm/hls.js@^1.5.0/dist/hls.mjs


**Top improvements**
- (MEDIUM) Add a short "Both embeds, one debugUrl" note up top clarifying that headful vs headless is auto-selected by Steel from the same debugUrl — readers currently learn this only from the docs. This preempts the 'do I use a different URL for headless?' question. — The live doc emphasizes 'Steel automatically determines the correct playback mode' from one debugUrl; stating this up front makes the article more self-sufficient and matches the docs.
- (MEDIUM) Add a one-line caveat to the HLS section that recordings become available after the session is released/finishes (the endpoint returns the completed-session playlist), so readers don't try to fetch /hls mid-run. — The article currently implies 'fetch the HLS playlist when the run finishes' in prose but never spells out that the playlist is post-run only; a reader wiring it into a live dashboard will hit an empty/404 response.
- (MEDIUM) Replace `window.STEEL_API_KEY` in the HLS example with a comment that the key lives server-side (or show the xhrSetup variant only alongside the direct api.steel.dev URL, clearly marked internal-only). — Removes the contradiction between the example and the 'do not ship your key to the browser' guardrail.


**Supporting material to add**
- Authoritative primary source for every embed claim: Steel's own live-sessions and past-sessions docs. The live doc states 'WebRTC-based video streaming at 25 fps (H.264)' and that debug URLs are unauthenticated; the past doc shows the exact /v1/sessions/{id}/hls request with the steel-api-key header and confirms 'durable MP4 streams for accurate 1:1 playback.'  _[where: Already implicitly the basis of the article; cite the two doc URLs explicitly as footnotes under the Short answer and under each implementation step so the claims are auditable.]_  (https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions)
- The shipped steel-sdk v0.18.0 type definitions are the ground truth for method/param casing: camelCase persistProfile, profileId, useProxy, solveCaptcha, stealthConfig, and both debugUrl and sessionViewerUrl on the Session response. Useful to link so readers can confirm option names themselves.  _[where: Add a one-line pointer in 'Implementation path for live sessions' step 1: 'See the SDK reference for the full SessionCreateParams option list.']_  (https://www.npmjs.com/package/steel-sdk)
- rrweb's own type definitions enumerate what it records (IncrementalSource.MouseMove, MouseInteraction, Mutation, Scroll, etc.), confirming both (a) that cursor movement IS captured and (b) that capture is DOM/input-scoped. This is the citable basis for correcting the 'cursor trails' line and for the accurate limitation (no canvas/media/OS chrome).  _[where: Footnote the corrected rrweb trade-off bullet.]_  (https://github.com/rrweb-io/rrweb/blob/master/packages/types/src/index.ts)



---


### gemini-computer-use-with-steel — readiness 5/10


**Title:** Gemini Computer Use With Steel


**Priority issues**
- (BLOCKER) `client.sessions.logs.list(session.id)` is an invented SDK method — it does not exist anywhere in Steel's API. The article uses it in two places (the 'What Steel adds' observability row and the 'Pair Gemini Computer Use with Steel observability' table).
  → *Fix:* Replace both occurrences with the real session-event API. TS: `const events = await client.sessions.events(session.id);` Python: `events = client.sessions.events(session_id=session.id)` (backed by `GET /v1/sessions/:id/events`, replayable with rrweb-player). Optionally mention the `steel-session-debugging` skill for traces/screenshots.
- (HIGH) The session-create code passes `timeout` (e.g. `timeout: 900_000`, `timeout:900000`). The Steel SDK parameter is `sessionTimeout` (TS) / `session_timeout` (Python).
  → *Fix:* In the TS snippet change `timeout: 900_000,` to `sessionTimeout: 900_000,`. In the 'What Steel adds' table change `timeout:900000` to `sessionTimeout:900000`.
- (HIGH) The model constant is pinned to Gemini 2.5: `MODEL = "gemini-2.5-computer-use-preview-10-2025"` and `gemini-2.5-computer-use-preview`. Steel's current Gemini Computer Use cookbook (modified 2026-06-24) and the integration page now default to / describe Gemini 3 (`gemini-3-flash-preview`).
  → *Fix:* Update the constant to `MODEL = "gemini-3-flash-preview"` and rewrite line 35's model cell and the line-91 'Not yet ideal when' bullet to reference the Gemini 3 computer-use model. Add a one-liner that `gemini-2.5-computer-use-preview-10-2025` still works for anyone pinned to 2.5.
- (MEDIUM) '24 hour runtimes' / '24 hour session cap' is presented as a general Steel capability. Per Steel's pricing page, 24h is Enterprise-only; Launch caps at 15 minutes and Scale at 1 hour.
  → *Fix:* Change to plan-qualified language, e.g. 'sessions run up to 24 hours on Enterprise (15 min on Launch, 1 hour on Scale) — set `sessionTimeout` to your plan ceiling'.
- (MEDIUM) 'sub-second startup' is unsubstantiated. Steel's own Google-ADK cookbook logs `open-session: 1380ms`, and other recipes show ~3s session opens.
  → *Fix:* Soften to 'fast, low-single-digit-second startup' or cite Steel's cookbook figure (~1-3s session open).
- (MEDIUM) The Python helper is named `_denormalize_x`/`_denormalize_y` in the article. Steel's Python cookbook defines them as `denormalize_x`/`denormalize_y` (no leading underscore).
  → *Fix:* Change `_denormalize_x`/`_denormalize_y` to `denormalize_x`/`denormalize_y` in the 'Mirror the helper structure' section.
- (LOW) Viewport is set to 1280x768 and described as 'the same viewport Gemini expects'. Gemini plans on a normalized 0-1000 grid regardless of viewport; Steel's Gemini cookbook defaults to 1440x900 and the integration-page example uses 1280x800.
  → *Fix:* Either align to the Steel cookbook default (1440x900) or the integration example (1280x800), and drop 'the same viewport Gemini expects'. Suggested line: 'Create the session with explicit `dimensions` (the Steel cookbook uses 1440x900; Gemini normalizes to a 0-1000 grid regardless, so the value only affects the screenshot resolution you send back).'
- (LOW) The article lists two different action vocabularies without distinguishing the layers: the 'Computer API' row lists Steel backend actions (`click`, `type`, `scroll`, `wait`, `navigate`, `take_screenshot`) while the 'Action router' bullet lists Gemini tool calls (`click_at`, `type_text_at`, `scroll_document`, `navigate`, `drag_and_drop`, `wait_5_seconds`).
  → *Fix:* Add one sentence clarifying the two layers: 'Gemini emits its own vocabulary (`click_at`, `type_text_at`, `scroll_document`, ...); your router maps each onto a Steel `sessions.computer` action (`click`, `type`, `take_screenshot`, ...).'


**Claim checks** (verified verdict shown)
- [CONFIRMED-INACCURATE] · technical · `client.sessions.logs.list(session.id)` returns agent logs you can store beside Gemini transcripts.  *(adversarially verified)*
  → Replace the fabricated method in both locations. (1) content/articles/gemini-computer-use-with-steel.md line 44: change "and pull `client.sessions.logs.list(session.id)` after runs" to "and pull `client.sessions.events(session.id)` after runs". (2) Line 78: change "`client.sessions.logs.list(session.id)`" to "`client.sessions.events(session.id)`". Optionally, if you want to point at the newer activity-timeline surface instead of the raw rrweb event stream, the REST endpoint `GET /v1/sessions/$SESSION_ID/agent-traces` (fetched directly; not yet a typed SDK method) returns the readable click/input/navigate timeline. Note the same fabricated `sessions.logs.list` also appears in content/articles/claude-computer-use-with-steel.md line 208 (`steel.sessions.logs.list(session.id)`) and should be fixed the same way.
  src: https://docs.steel.dev/llms.txt · https://docs.steel.dev/llms.mdx/overview/agent-traces/api
- [CONFIRMED-ACCURATE] · technical · Create a session with `timeout: 900000` (15 min).  *(adversarially verified)*
  src: https://docs.steel.dev/overview/sessions-api/session-lifecycle · https://docs.steel.dev/llms.txt
- [STALE] · technical · Keep the quickstart's `MODEL = "gemini-2.5-computer-use-preview-10-2025"` constant; reference `gemini-2.5-computer-use-preview`.  *(adversarially verified)*
  → Update the model string from the legacy `gemini-2.5-computer-use-preview(-10-2025)` to `gemini-3-flash-preview` (Steel's current cookbook value) in the three named locations in content/articles/gemini-computer-use-with-steel.md. (1) Line 35, 'What stays the same' table — replace "Same `gemini-2.5-computer-use-preview` model, same system prompt, same task payload" with "Same `gemini-3-flash-preview` model, same system prompt, same task payload". (2) Line 51, step 2 — replace "Keep the quickstart's `MODEL = \"gemini-2.5-computer-use-preview-10-2025\"` constant so both runtimes stay aligned." with "Keep the quickstart's `MODEL = \"gemini-3-flash-preview\"` constant so both runtimes stay aligned." (3) Line 91, 'Not yet ideal when' — replace "Your org cannot enable the `gemini-2.5-computer-use-preview` capability yet; Steel cannot sidestep Google's access controls." with "Your org cannot enable the `gemini-3-flash-preview` computer-use capability yet; Steel cannot sidestep Google's access controls." Also update the intro (line 30) which still reads "Pair the Gemini 2.5 Computer Use reasoning stack with Steel sessions" — change "Gemini 2.5" to "Gemini 3". Note: the article title "Gemini Computer Use With Steel" is version-neutral and needs no change.
  src: https://docs.steel.dev/cookbook/gemini-computer-use · https://docs.steel.dev/integrations/gemini-computer-use
- [NEEDS-SOFTENING] · technical · Steel gives you '24 hour runtimes' / a '24 hour session cap'.  *(adversarially verified)*
  → Qualify the tier rather than drop the claim. Edit the two flagged locations in /Users/nikola/dev/steel/llms-steel-dev/content/articles/gemini-computer-use-with-steel.md: (1) Intro line 28 — change "you get sub-second startup, 24 hour runtimes, and deterministic evidence without touching your prompts or orchestrator." to "you get sub-second startup, long-running sessions (up to 24 hours on Enterprise plans; 15 minutes on Launch and 1 hour on Scale), and deterministic evidence without touching your prompts or orchestrator." (2) "Not yet ideal when" line 90 — change "Runs exceed the 24 hour session cap or need more concurrency than your Steel plan currently offers." to "Runs exceed your plan's session cap (15 minutes on Launch, 1 hour on Scale, up to 24 hours on Enterprise) or need more concurrency than your Steel plan currently offers." Also fix the table row at line 43: change "Fast startup and 24 hour caps keep Gemini loops running without relaunching Chrome" to "Fast startup and long session caps (up to 24 hours on Enterprise) keep Gemini loops running without relaunching Chrome". These edits keep the true capability while reflecting the docs/pricinglimits tiering.
  src: https://docs.steel.dev/overview/pricinglimits · https://steel.dev/pricing
- [NEEDS-SOFTENING] · statistic · You get 'sub-second startup'.  *(adversarially verified)*
  → Soften to match Steel's own qualification. Replace "you get sub-second startup" with "you get sub-second startup on average (in-region)". Full sentence becomes: "Create one Steel session, feed that Computer API into Gemini's normalized coordinate loop, and you get sub-second startup on average (in-region), 24 hour runtimes, and deterministic evidence without touching your prompts or orchestrator."
  src: https://steel.dev · https://docs.steel.dev
- [CONFIRMED-INACCURATE] · technical · Python pair is `_denormalize_x`/`_denormalize_y`.  *(adversarially verified)*
  → In content/articles/gemini-computer-use-with-steel.md line 69, replace the underscore-prefixed Python names with the correct ones. Change: "the Python `_denormalize_x`/`_denormalize_y` pair" to: "the Python `denormalize_x`/`denormalize_y` pair". Full corrected line: "- **Coordinate helpers**: The TS `denormalizeX`/`denormalizeY` methods and the Python `denormalize_x`/`denormalize_y` pair both map normalized coordinates to the 1280x768 viewport. Reuse them verbatim." (Note: this is scoped to the naming claim only; a separate viewport-dimension question — 1280x768 vs the cookbook's 1440x900 default — was flagged elsewhere and is out of scope here.)
  src: https://raw.githubusercontent.com/steel-dev/steel-cookbook/main/examples/gemini-computer-use-py/main.py · https://raw.githubusercontent.com/steel-dev/steel-cookbook/main/examples/gemini-computer-use-py/README.md
- [ACCURATE] · technical · Gemini uses normalized 0-1000 coordinates; keep `MAX_COORDINATE = 1000`.
  src: https://ai.google.dev/gemini-api/docs/computer-use · https://docs.steel.dev/cookbook/gemini-computer-use
- [ACCURATE] · technical · Gemini actions include `click_at`, `scroll_document`, `type_text_at`, `navigate`, `drag_and_drop`, `wait_5_seconds`.
  src: https://ai.google.dev/gemini-api/docs/computer-use · https://docs.steel.dev/cookbook/gemini-computer-use
- [ACCURATE] · technical · `steel.sessions.computer(session.id, body)` executes actions and returns a base64 PNG.
  src: https://docs.steel.dev/integrations/gemini-computer-use · https://docs.steel.dev/cookbook/gemini-computer-use
- [ACCURATE] · technical · `client.sessions.captchas.status(session.id)` polls CAPTCHA state.
  src: https://docs.steel.dev/cookbook/browser-use-captcha-auto
- [ACCURATE] · technical · Set `useProxy` and `region` on the session.
  src: https://docs.steel.dev/llms-full.txt
- [ACCURATE] · technical · `client.sessions.release(session.id)` in `finally` frees the session.
  src: https://docs.steel.dev/llms.txt · https://docs.steel.dev/cookbook/browser-use-captcha-auto
- [ACCURATE] · technical · `blockAds: true` is a valid session-create option.
  src: https://docs.steel.dev/llms-full.txt
- [CONFIRMED-INACCURATE] · technical · Use viewport `dimensions: { width: 1280, height: 768 }` — 'the same viewport Gemini expects'.  *(adversarially verified)*
  → Edit Step 3 and the "Mirror the helper" bullet to align with Steel's canonical integration-page example (1280x800) and drop the false "viewport Gemini expects" framing. (1) In Step 3, change the lead-in "Create a Steel client and session with the same viewport Gemini expects:" to "Create a Steel client and session. Gemini emits coordinates in a normalized 0-1000 grid that Steel scales to whatever viewport you pick (the docs example uses 1280x800):". (2) In the TS snippet, change `dimensions: { width: 1280, height: 768 },` to `dimensions: { width: 1280, height: 800 },`. (3) In the "Mirror the helper" section, change "both map normalized coordinates to the 1280x768 viewport" to "both map normalized coordinates to the 1280x800 viewport". Also update the matching line in the "What Steel adds" table (`dimensions:{width:1280,height:768}`) to `dimensions:{width:1280,height:800}`.
  src: https://docs.steel.dev/integrations/gemini-computer-use · https://docs.steel.dev/cookbook/gemini-computer-use


**Top improvements**
- (HIGH) Add a short 'Cost model' note: every iteration sends a full screenshot to Gemini, so token usage (and cost) scales with task length and viewport resolution — the cookbook explicitly calls this out. It's a material trade-off for the 'larger viewport = better accuracy' decision. — Developers evaluating this integration need to size cost; the screenshot-per-step pattern is the dominant cost driver and is currently absent from the article.
- (MEDIUM) Reconcile the action vocabulary across the article: pick one place to enumerate Gemini's tool calls and one place to enumerate Steel's `sessions.computer` actions, and explicitly state the router maps the former onto the latter. — Two non-identical action lists currently appear without layer context, which reads as a contradiction.
- (MEDIUM) Add a CAPTCHA-handling paragraph that matches Steel's documented pattern: enable `solveCaptcha` at session create, then poll `sessions.captchas.status` until `isSolvingCaptcha` is false (60s default, extend to 90-120s for image grids). — The article mentions CAPTCHA routing but doesn't show the documented wait-loop, which is the part readers actually need.


**Supporting material to add**
- Steel pricing tiers with concrete caps: concurrent sessions (Launch 10 / Scale 100 / Enterprise 1,000+), max session time (Launch 15 min / Scale 1 hour / Enterprise up to 24h), browser rate $0.08-0.10/hr, CAPTCHA $1-3/1k, data retention (7 / 14 / custom days).  _[where: Intro or 'Fit and trade-offs' — replace the unqualified '24 hour runtimes' line and give readers plan-aware ceilings.]_  (https://docs.steel.dev/llms-full.txt)
- Steel's own Gemini cookbook reports typical run shape: 'Expect roughly 60-120 seconds and 15-40 turns for a simple browsing task' and an `open-session` of ~1.4s; the default model is `gemini-3-flash-preview` on a 1440x900 viewport.  _[where: 'Fit and trade-offs' or a new 'What to expect at runtime' note — grounds the perf and cost discussion in Steel's data instead of 'sub-second startup'.]_  (https://docs.steel.dev/cookbook/gemini-computer-use)
- Google's official Computer Use documentation — primary source for the built-in tool type, the fixed 0-1000 normalized coordinate grid, and the canonical browser action vocabulary (click_at, type_text_at, scroll_document, drag_and_drop, wait_5_seconds, etc.).  _[where: Step 4 / 'Mirror the helper structure' — cite as the authoritative source for the coordinate system and action names instead of implying it comes from Steel.]_  (https://ai.google.dev/gemini-api/docs/computer-use)
- Steel's session-event replay API: `client.sessions.events(session.id)` / `GET /v1/sessions/:id/events`, replayable with rrweb-player — the real observability primitive the article means when it says 'replay-ready'.  _[where: The observability table — replace the invented `sessions.logs.list` call with this method and describe the rrweb replay artifact.]_  (https://docs.steel.dev/llms-full.txt)
- Steel's Computer Use leaderboard (leaderboard.steel.dev), which Steel's own integration FAQ points readers to for current model recommendations.  _[where: Step 2 or 'Not yet ideal when' — a neutral, current source for which computer-use model to pick, which also de-risks the model-name going stale again.]_  (https://docs.steel.dev/integrations/gemini-computer-use)


**Broken / malformed links**
- `(@/glossary/computer-use.md)` — None — resolves. Verified the file exists at content/glossary/computer-use.md.
- `(@/glossary/replay.md)` — None — resolves. Verified the file exists at content/glossary/replay.md.
- `(@/glossary/proxies.md)` — None — resolves. Verified the file exists at content/glossary/proxies.md.
- `https://docs.steel.dev/integrations/gemini-computer-use` — None — resolves with HTTP 200 and is listed in Steel's llms.txt. (It is client-rendered, so a raw curl returns a JS shell, but the page is live.) Content note: this live page now describes 'Gemini 3', which makes the article's 2.5 framing stale.


---


### how-to-measure-browser-agent-reliability — readiness 4/10


**Title:** How to Measure Browser Agent Reliability


**Priority issues**
- (BLOCKER) Plan tiers, prices, concurrency caps, and rate limits are entirely wrong. Article uses Hobby($0)/Starter($29)/Developer($99)/Pro($499)/Enterprise with concurrency 5/10/20/100 and 'Requests per second' 1/2/5/10. Steel's real tiers (verified July 2026 on docs.steel.dev/overview/pricinglimits, last edited June 30 2026) are Launch($0)/Scale($250)/Enterprise(custom), with concurrency 10/100/1000+, and 'Requests per MINUTE' 60/600/custom. There is no published 'requests per second' cap, and Hobby/Pro are not current tier names (legacy grandfathered plans are Starter/Developer/Startup).
  → *Fix:* Replace the Plan-tier guardrails table (lines 64-72) with the verified tiers:

| Plan tier | Concurrent sessions | Requests per minute | Data retention | Reliability response |
| --- | --- | --- | --- | --- |
| Launch ($0 + usage) | 10 | 60 | 7 days | Single-developer sandbox; if startup p95 drifts, move production jobs to Scale. |
| Scale ($250 + usage) | 100 | 600 | 14 days | Alert when a workflow holds >=90 sessions or 90% of RPM for 5 min; pre-warm pools or stage an Enterprise upgrade. |
| Enterprise (custom) | 1,000+ | Custom | Custom | Mirror the contracted ceiling; negotiate burst headroom so alerts stay meaningful. |

Then globally s/Hobby/Launch, s/Pro/Scale, s/Developer/(legacy)/, s/Starter/(legacy)/, and replace every 'Requests per second cap (1/2/5/10)' with 'Requests per minute (60/600/custom)'. Replace concurrency caps '5, 10, 20, 100' (line 76) with '10, 100, 1,000+'.
- (BLOCKER) The TypeScript code sample (lines 151-179) has four bugs that would not compile or run: (1) import `{ SteelClient } from "@steeldev/sdk"` — the real package is `steel-sdk` and the exported class is `Steel` (verified via npm steel-sdk 0.18.0 type defs); (2) `new SteelClient({ apiKey })` — the constructor option is `steelAPIKey`, not `apiKey` (the `apiKey` key is silently ignored); (3) `session.cdpUrl` — the Session object has NO `cdpUrl` field, the CDP endpoint field is `websocketUrl`; (4) `sessions.create({ tags: {...} })` — `tags` is not a valid SessionCreateParams field.
  → *Fix:* Replace lines 151-167 with:

```ts
import { Steel } from "steel-sdk";
import { chromium } from "playwright";

const metricsTags = { workflow, region, plan, proxyPool };

const createdAt = Date.now();
const client = new Steel({ steelAPIKey: process.env.STEEL_API_KEY! });
const session = await client.sessions.create({ region });
// Steel has no built-in `tags` field; track jobId/workflow in your own queue, keyed by session.id.

const connectStart = Date.now();
const browser = await chromium.connectOverCDP(session.websocketUrl);
metrics.observe("session_startup_ms", connectStart - createdAt, metricsTags);

const page = await browser.newPage();
await page.goto(firstUrl, { waitUntil: "domcontentloaded" });
metrics.observe("first_action_ms", Date.now() - connectStart, metricsTags);
```

(Leave the try/finally with `client.sessions.release(session.id)` as-is — that part is correct.)
- (HIGH) Endpoint and feature name is wrong throughout. Article uses `/v1/sessions/{id}/agent-logs` and the SDK field `agentLogs` (lines 48, 85, 268, and the telemetry map). Steel's actual feature is 'Agent Traces' and the endpoint is `/v1/sessions/{id}/agent-traces` (17 'Agent Traces' + 12 'agent-traces' mentions in the docs; 0 mentions of 'agentLogs' or 'agent-logs').
  → *Fix:* Global replace: `/v1/sessions/{id}/agent-logs` -> `/v1/sessions/{id}/agent-traces`, and `agentLogs` -> `agentTraces`. E.g. line 85 becomes 'Call `/v1/sessions/{id}/agent-traces` (or stream live logs)'; line 268 becomes '`GET /v1/sessions/{id}/agent-traces`'; lines 48 and 97-98 '`agentLogs` timeline' -> '`agentTraces` timeline'.
- (HIGH) 24-hour session ceiling is overstated as a general Steel Cloud cap. Line 274 says 'Steel Cloud caps a single session at 24 hours'; line 284 references 'the 24-hour session cap.' Reality: Launch sessions cap at 15 minutes, Scale at 1 hour, and only Enterprise reaches 24 hours (verified in the pricing FAQ).
  → *Fix:* Line 274: 'Steel Cloud session timeouts are plan-tiered — 15 minutes on Launch, 1 hour on Scale, and 24 hours on Enterprise; jobs longer than your tier's ceiling must checkpoint progress into Files API or storage and resume in a fresh session.' Line 284: 'workflows that routinely exceed your plan's session timeout (15 min / 1 hr / 24 hr for Launch / Scale / Enterprise)'.
- (MEDIUM) 14-day retention is misattributed and overstated as the default. Lines 276 ('14 days on Pro plans') and 148 ('Steel's 14-day default window') — real retention is 7 days on Launch and 14 days on Scale (Enterprise is custom). There is no 'Pro' plan, and 14 days is not the default (Launch's default is 7 days).
  → *Fix:* Line 276: 'Session replays, logs, and artifacts are retained for 7 days on Launch and 14 days on Scale (Enterprise is custom). Export anything compliance-sensitive before your plan's window closes.' Line 148 (expiresAt example): note the window is plan-dependent, e.g. 'Forces teams to pull artifacts before the retention window closes (7 days Launch / 14 days Scale).'
- (MEDIUM) Region tag examples use AWS region codes that are not Steel regions. Line 109 lists 'us-east-1, eu-west-2, ap-south-1' and line 58 says 'Tag sessions with region on create.' Steel's actual `region` create-param values are 'lax' | 'ord' | 'iad' | 'scl' | 'fra' | 'nrt' (Los Angeles / Chicago / Washington DC / Santiago / Frankfurt / Tokyo).
  → *Fix:* Line 109 example values: 'lax, ord, iad, scl, fra, nrt' (Steel regions). Optionally add a one-line note: 'Steel region codes differ from AWS codes — use the region values returned at session create.'
- (LOW) Several 'flags' referenced as session attributes do not exist in the SDK. Lines 60 and 113-114 reference `mobileMode`, `fingerprintMode`, and `proxyPool` as flags 'on each session.' The real SessionCreateParams are `useProxy`, `solveCaptcha`, `persistProfile`, `profileId`, `region`, `stealthConfig`, `deviceConfig.device` ('desktop'|'mobile'). There is no mobileMode/fingerprintMode/proxyPool param.
  → *Fix:* Reframe as user-defined telemetry tags rather than Steel fields: 'Store your own `proxyPool`, `fingerprintMode`, and `mobileMode` labels in your metrics system (Steel exposes `useProxy`, `solveCaptcha`, `persistProfile`, `deviceConfig.device`, and `stealthConfig` on the session) and pivot success rates accordingly.'
- (LOW) Benchmark freshness and framing. The benchmark is self-reported (Steel-authored, Nov 7 2025) and '100% success' is presented as a Steel advantage, but in the same test Kernel and Hyperbrowser also hit 100% (Browserbase 99.96%); Steel's real differentiator was speed (1.70x-8.95x), not success rate.
  → *Fix:* Add after line 29: 'Note: this is Steel's own benchmark (Nov 2025; raw data at github.com/steel-dev/browserbench); Kernel and Hyperbrowser also posted 100% success in the same test, so Steel's measured edge there was speed, not raw success rate. Competitor versions change, so re-baseline periodically.'


**Claim checks** (verified verdict shown)
- [ACCURATE] · statistic · Steel's remote benchmark hits 0.89 s average startup, 1.09 s p95, and 1.34 s p99 across 5,000 runs with 100 percent success.
  → Keep the numbers; add a parenthetical that this is Steel's own Nov 2025 benchmark and that competitors (Kernel, Hyperbrowser) also posted 100% success in the same run.
  src: https://steel.dev/blog/remote-browser-benchmark · https://github.com/steel-dev/browserbench
- [ACCURATE] · statistic · 1.70x-8.95x faster than the other providers we tested.
  src: https://steel.dev/blog/remote-browser-benchmark
- [ACCURATE] · statistic · Control-plane tax: 229 ms total for create + release (25.6% of lifecycle).
  src: https://steel.dev/blog/remote-browser-benchmark
- [ACCURATE] · statistic · First action (connect + first goto): 665 ms average.
  src: https://steel.dev/blog/remote-browser-benchmark
- [CONFIRMED-INACCURATE] · steel-pricing · Plan tiers are Hobby ($0, 5 concurrent, 1 RPS), Starter ($29, 10 concurrent, 2 RPS), Developer ($99, 20 concurrent, 5 RPS), Pro ($499, 100 concurrent, 10 RPS), Enterprise (custom).  *(adversarially verified)*
  → Replace the entire table at lines 66–72 AND the inline cap list at line 76. New table (lines 66–72): `| Plan tier | Concurrent sessions cap | Requests per minute cap | Reliability response |\n| --- | --- | --- | --- |\n| Launch ($0 + usage) | 10 | 60 | Treat it as a single-developer sandbox with a 15-minute session ceiling; if startup success or p95 drifts, move production jobs off this tier immediately. |\n| Scale ($250 + usage) | 100 | 600 | Alert as soon as a workflow holds ≥90 sessions or 90% of RPM for 5 minutes; pre-warm Steel Cloud pools or stage an Enterprise upgrade before approvals pile up. |\n| Enterprise (custom) | 1,000+ | Custom | Mirror the contracted ceiling and stop trusting “unlimited” without on-call automation; negotiate burst headroom so alerts stay meaningful. |`. Then change line 76 to: `- Queues can drain minutes before a session ever boots when concurrency caps (10, 100, 1,000+) are saturated.` Also fix line 59: change `Steel Local (~1 concurrent session) vs Steel Cloud (hundreds), plus Starter vs Pro caps` to `Steel Local (~1 concurrent session) vs Steel Cloud (hundreds), plus Launch vs Scale caps`. (The rate metric is requests per MINUTE, not per second — every "RPS" reference in this section must read "RPM".)
  src: https://docs.steel.dev/overview/pricinglimits · https://steel.dev/pricing
- [STALE] · steel-pricing · Concurrency caps are '5, 10, 20, 100' (line 76).  *(adversarially verified)*
  → Replace line 76: "Queues can drain minutes before a session ever boots when concurrency caps (5, 10, 20, 100) are saturated." with "Queues can drain minutes before a session ever boots when concurrency caps (10 on Launch, 100 on Scale, 1,000+ on Enterprise) are saturated." Additionally, rebuild the "Plan-tier guardrails" table at lines 64-71 to use the current tiers: Launch ($0, 10 sessions / 60 req-per-minute), Scale ($250, 100 sessions / 600 req-per-minute), Enterprise (custom, 1,000+ sessions / custom RPS). The current article's table values (Hobby 5/1-rps, Starter 10/2-rps, Developer 20/5-rps, Pro 100/10-rps) are legacy and also state RPS in per-second units rather than Steel's published per-minute units (60/600/custom).
  src: https://docs.steel.dev/overview/pricinglimits · https://steel.dev/pricing
- [CONFIRMED-INACCURATE] · steel-product · Code sample imports `{ SteelClient } from "@steeldev/sdk"` and constructs `new SteelClient({ apiKey: process.env.STEEL_API_KEY })`.  *(adversarially verified)*
  → Fix both lines (lines 151 and 155 of content/articles/how-to-measure-browser-agent-reliability.md). Change `import { SteelClient } from "@steeldev/sdk";` to `import Steel from "steel-sdk";` (named `import { Steel } from "steel-sdk";` is also valid). Change `const client = new SteelClient({ apiKey: process.env.STEEL_API_KEY });` to `const client = new Steel({ steelAPIKey: process.env.STEEL_API_KEY });`. (Note: passing steelAPIKey is optional since the SDK reads STEEL_API_KEY from env by default; `const client = new Steel();` would also work, but keeping the explicit option preserves the article's intent.)
  src: https://registry.npmjs.org/steel-sdk/0.18.0 · https://registry.npmjs.org/@steeldev/sdk
- [CONFIRMED-INACCURATE] · steel-product · `chromium.connectOverCDP(session.cdpUrl)` — session objects expose a `cdpUrl` field.  *(adversarially verified)*
  → Replace line 162 `const browser = await chromium.connectOverCDP(session.cdpUrl);` with `const browser = await chromium.connectOverCDP(\`${session.websocketUrl}&apiKey=${process.env.STEEL_API_KEY}\`);` — matching the official Steel docs pattern and the article's existing use of process.env.STEEL_API_KEY.
  src: https://docs.steel.dev/integrations/playwright · https://www.npmjs.com/package/steel-sdk (v0.18.0 Session interface: websocketUrl field, no cdpUrl)
- [CONFIRMED-INACCURATE] · steel-product · `client.sessions.create({ tags: { jobId, workflow } })` — sessions accept a `tags` param.  *(adversarially verified)*
  → Fix the snippet at lines 152/158/159 in content/articles/how-to-measure-browser-agent-reliability.md. The Steel SDK has no native session tags field, so drop the invalid `tags` param and associate jobId/workflow with session.id in your own store (the snippet already emits them via `metricsTags`). Also correct the import/class name (`@steeldev/sdk`/`SteelClient` do not exist — the package is `steel-sdk`, class `Steel`). Replacement:

Line 152: `import { Steel } from "steel-sdk";`
Line 158: `const client = new Steel({ apiKey: process.env.STEEL_API_KEY });`
Line 159: replace `const session = await client.sessions.create({ tags: { jobId, workflow } });` with:
`const session = await client.sessions.create();`
`// Steel sessions carry no custom tags — key jobId/workflow off session.id in your queue.`

(If preserving the jobId association inline, add `sessionJobs.set(session.id, { jobId, workflow });` after the create call and declare `const sessionJobs = new Map();` near metricsTags.)
  src: file:///Users/nikola/dev/steel/atlas-demo/node_modules/steel-sdk/resources/sessions/sessions.d.ts (SessionCreateParams, lines 620-722; create() at line 14) · file:///Users/nikola/dev/steel/atlas-demo/node_modules/steel-sdk/index.d.ts (class Steel, line 75)
- [CONFIRMED-INACCURATE] · steel-product · Agent logs endpoint is `GET /v1/sessions/{id}/agent-logs`; SDK field is `agentLogs`.  *(adversarially verified)*
  → Replace the claim. Telemetry map (line 268): change "| Agent decisions | `GET /v1/sessions/{id}/agent-logs` | Aligns prompts, actions, and DOM results for both automation and audit trails. |" to "| Agent decisions | `GET /v1/sessions/:id/agent-traces` | Returns the Agent Traces timeline (`events` array with `type`, `timestamp`, `target`, page context) to align prompts, actions, and DOM results for both automation and audit trails. |". Instrument the loop #3 (line 85): change "Call `/v1/sessions/{id}/agent-logs` (or stream live logs) to align model steps..." to "Call `GET /v1/sessions/:id/agent-traces` to align model steps...". Also fix the stale `agentLogs` references in the cheat sheet: line 48 "`agentLogs` timeline" -> "`agent-traces` timeline"; line 52 "`agentLogs` pagination" -> "`agent-traces` pagination"; line 97 "`agentLogs` event ID" -> "Agent Traces `events[].` entry ID / timestamp".
  src: https://docs.steel.dev/overview/agent-traces/api · https://docs.steel.dev/sitemap.xml
- [ACCURATE] · steel-product · `releaseAll` is a valid Steel sessions method.
  src: https://www.npmjs.com/package/steel-sdk · https://docs.steel.dev/llms-full.txt
- [ACCURATE] · steel-product · Steel Local is effectively a single-session control plane (~1 concurrent session); Steel Cloud runs hundreds.
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud · https://docs.steel.dev/llms-full.txt
- [NEEDS-SOFTENING] · steel-product · Steel Cloud caps a single session at 24 hours.  *(adversarially verified)*
  → Replace "Steel Cloud caps a single session at 24 hours." with: "Steel Cloud caps session length by tier: Launch sessions max out at 15 minutes, Scale at 1 hour, and Enterprise at up to 24 hours." (Apply at both line 274 and line 284.) This keeps the true 24-hour Enterprise figure while making the tiered limits explicit so Launch/Scale readers are not misled.
  src: https://docs.steel.dev/overview/pricinglimits · https://steel.dev/pricing
- [STALE] · steel-product · Session replays, logs, and artifacts stick around for up to 14 days on Pro plans; the default retention window is 14 days.
  → State retention as '7 days on Launch, 14 days on Scale, custom on Enterprise.'
  src: https://docs.steel.dev/overview/pricinglimits
- [CONFIRMED-INACCURATE] · steel-pricing · Requests per second cap values are 1 / 2 / 5 / 10 across tiers.  *(adversarially verified)*
  → Replace the claim entirely. In the Plan-tier guardrails table and any "Plan-tier saturation" metric, swap the fabricated per-second values for Steel's actual per-minute limits. Exact replacement text: "Requests per minute: 60 (Launch) / 600 (Scale) / custom (Enterprise)." Do NOT present this as a per-second (RPS) figure anywhere in the article, and do not invent values of 1/2/5/10. Source: https://docs.steel.dev/overview/pricinglimits (Limits row: "Requests per minute | 60 | 600 | Custom").
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/llms.txt
- [ACCURATE] · technical · CDP endpoint format is wss://connect.steel.dev?apiKey=...&sessionId=...
  src: https://docs.steel.dev/llms-full.txt
- [RISKY-OR-DISPUTABLE] · steel-product · Region tag values are AWS-style: us-east-1, eu-west-2, ap-south-1.
  → Use Steel region codes (lax/ord/iad/scl/fra/nrt) as the example values.
  src: https://www.npmjs.com/package/steel-sdk · https://docs.steel.dev/llms-full.txt
- [RISKY-OR-DISPUTABLE] · steel-product · Flags `mobileMode`, `fingerprintMode`, `proxyPool` exist on Steel sessions.
  → Reframe as user-defined telemetry labels and point to the real Steel flags (useProxy, solveCaptcha, persistProfile, deviceConfig.device, stealthConfig).
  src: https://www.npmjs.com/package/steel-sdk · https://docs.steel.dev/llms-full.txt
- [ACCURATE] · steel-product · Internal glossary links (@/glossary/replay.md, @/glossary/proxies.md) resolve.
- [ACCURATE] · steel-product · Docs links resolve: docs.steel.dev/overview/pricinglimits, docs.steel.dev/overview/sessions-api/overview, steel.dev/blog/remote-browser-benchmark, steel.dev/blog/why-browser-agents-fail-in-production, app.steel.dev, github.com/steel-dev/browserbench.


**Top improvements**
- (HIGH) Rebuild the entire plan-tier section against the verified Launch/Scale/Enterprise tiers (concurrency 10/100/1000+, RPM 60/600/custom, retention 7d/14d/custom, session timeout 15min/1hr/24hr). This is the single highest-impact fix and touches the guardrail table, the saturation metric, the alert wiring checklist, and the daily-review plan-cap check. — Roughly a third of the article (and its core 'plan-tier saturation' metric) is unusable as written because the tiers, caps, and rate units are wrong.
- (HIGH) Fix the four bugs in the TypeScript code sample (package name, class name, constructor key, websocketUrl field, remove tags param). Ideally run the corrected snippet end-to-end against a real Steel session before publishing. — This is a developer reference article; a non-compiling example erodes trust and will be flagged by any reader who tries it.
- (HIGH) Replace every 'agent-logs'/'agentLogs' reference with 'agent-traces'/'agentTraces', and update the endpoint in the telemetry map and the instrumentation checklist. — The named endpoint currently 404s; the docs feature is unambiguously 'Agent Traces.'


**Supporting material to add**
- Steel's official, current Pricing/Limits page (Launch/Scale/Enterprise; 10/100/1000+ concurrent; 60/600 RPM; 7d/14d retention; 15min/1hr/24hr session timeout; $0.10/$0.08 per browser-hour; $10/$6 per GB proxy; $3/$1 per 1k captcha solves). Last edited June 30 2026, verified July 2026.  _[where: Replace the Plan-tier guardrails table (lines 64-72) and every concurrency/RPS/retention reference]_  (https://docs.steel.dev/overview/pricinglimits)
- Steel's published Remote Browser Benchmark with raw data: Steel avg 894.13ms / p95 1090ms / p99 1340ms / 100% success over 5,000 runs vs Kernel, Browserbase, Hyperbrowser, AnchorBrowser (1.70x-8.95x avg speedup). GitHub repo with full results.  _[where: Steel benchmark baselines section and Short answer (already cited) — add the GitHub raw-data link so readers can reproduce]_  (https://steel.dev/blog/remote-browser-benchmark)
- Steel SDK (steel-sdk on npm, v0.18.0) type definitions confirming the `Steel` class, `steelAPIKey` constructor option, sessions.create/release/releaseAll methods, and Session fields (websocketUrl, debugUrl, sessionViewerUrl, status).  _[where: The TypeScript code sample (lines 151-179) — replace the broken import/constructor/field]_  (https://www.npmjs.com/package/steel-sdk)
- Steel 'Agent Traces' feature and its `/v1/sessions/{id}/agent-traces` endpoint (with startTime/endTime query params and a timeline/export UI).  _[where: Instrument the loop #3 (line 85) and Steel telemetry map (line 268) — replace the wrong 'agent-logs' references]_  (https://docs.steel.dev/llms-full.txt)
- Google's official Chrome DevTools Protocol documentation (the CDP standard Steel and Playwright connectOverCDP rely on), useful to ground the 'connectOverCDP over wss://connect.steel.dev' technical explanation.  _[where: Technical sections referencing CDP/connectOverCDP, if a one-line primer is wanted]_  (https://chromedevtools.github.io/devtools-protocol/)


**Broken / malformed links**
- `https://docs.steel.dev/overview/pricinglimits` — Resolves (HTTP 200) and is actually Steel's correct slug — included here only to flag that it looks malformed. The hyphenated variant /overview/pricing-limits returns 404, so do NOT 'fix' this by adding a hyphen. → Leave as-is. It is correct despite appearing to be missing a hyphen.


---


### mobile-mode-for-browser-automation — readiness 7/10


**Title:** Mobile Mode for Browser Automation Is Not Just a User-Agent String


**Priority issues**
- (HIGH) Unsourced load-bearing statistic: 'Desktop DOM is 2-3x larger than mobile' (appears in the 'When to flip the switch' table and underpins the token-cost thesis). This figure is not in Steel's docs (the mobile-mode page only says 'simpler DOM structures') and is not cited.
  → *Fix:* Either (a) cite a real measurement, e.g. 'In our tests, popular e-commerce desktop DOMs ran roughly 2-3x the node count of their mobile templates (Steel benchmark, 2026)' with a link, or (b) drop the number and keep the qualitative claim: 'Desktop DOMs are noticeably larger and more deeply nested, which inflates token cost when you feed HTML to a model.' Replace the table cell 'Desktop DOM is 2-3x larger than mobile' with 'Desktop DOMs carry more nodes, nested menus, and ad slots than mobile templates.'
- (HIGH) page.swipe() is referenced as a helper ('Prefer page.tap() and page.swipe() helpers where they exist') but Playwright has no page.swipe() method. Verified against playwright.dev/docs/api/class-page: it exposes page.tap(), page.click(), page.dragAndDrop(), and page.mouse, but no swipe.
  → *Fix:* Replace 'Prefer page.tap() and page.swipe() helpers where they exist.' with 'Prefer page.tap() over page.click() for touch targets; for swipe gestures, use a mouse-based sequence (e.g. page.mouse.move/down/up) or a touch-action via CDP.'
- (MEDIUM) 'Chrome extensions are desktop only today' is offered as the reason mobile mode is wrong for extension-dependent automation. This is true for real Chrome on Android/iOS, but Steel mobile mode runs desktop Chromium with a mobile fingerprint, so the extension restriction does not inherently apply. Steel's docs do not state that mobile sessions block extensions.
  → *Fix:* Reword to the real, defensible reason: 'Extension-dependent automation | Many Chrome extensions assume desktop interaction patterns (context menus, popups sized to a desktop window) and are rarely tested against mobile viewports | Validate the extension under mobile mode first, or stick with desktop sessions.' If Steel product actually blocks extensions in mobile sessions, confirm with the product team and cite the docs page.
- (MEDIUM) The article contains no outbound links to primary sources (no link to the Steel mobile-mode docs, no link to Playwright docs), despite being written to rank in answer-engine results where citability matters.
  → *Fix:* Add at least one primary-source link. In the 'Instead of spoofing headers, create a mobile session' section, link the docs: 'See the [Mobile Mode docs](https://docs.steel.dev/overview/sessions-api/mobile-mode) for the full reference.' Optionally link Playwright's isMobile/hasTouch context options.
- (LOW) 'Steel carries the setting through replays, embeds, and approvals' (Implementation step 2) is stated as fact but is not explicitly documented on the mobile-mode page (which only lists proxies, CAPTCHA solving, and session persistence as compatible).
  → *Fix:* Soften to 'Steel carries the deviceConfig setting through session persistence, and it is preserved across the live viewer and replays.' Or verify each (embeds, approvals) against docs before claiming all three.


**Claim checks** (verified verdict shown)
- [ACCURATE] · steel-product · Set the device during session creation with deviceConfig: { device: "mobile" }
  src: https://docs.steel.dev/overview/sessions-api/mobile-mode
- [ACCURATE] · steel-product · useProxy: true and solveCaptcha: true are valid session-creation flags (camelCase).
  src: https://docs.steel.dev/overview/llms-full.txt · https://docs.steel.dev/overview/sessions-api/mobile-mode
- [ACCURATE] · steel-product · Connect over CDP with wss://connect.steel.dev?apiKey=${STEEL_API_KEY}&sessionId=${session.id}
  src: https://docs.steel.dev/overview/sessions-api/mobile-mode
- [ACCURATE] · steel-product · Steel's debugUrl lets you watch the mobile viewport directly.
  src: https://docs.steel.dev/overview/llms-full.txt
- [ACCURATE] · steel-product · Mobile mode works with proxies, CAPTCHA solving, profiles, and embeds.
  src: https://docs.steel.dev/overview/sessions-api/mobile-mode
- [CONFIRMED-INACCURATE] · technical · Prefer page.tap() and page.swipe() helpers where they exist.  *(adversarially verified)*
  → Replace: "Prefer `page.tap()` and `page.swipe()` helpers where they exist." with: "Prefer `page.tap()` for taps; there is no built-in `page.swipe()`, so synthesize swipes with `page.mouse` (`move` → `down` → `move` → `up`) under `hasTouch: true`." Leave the following sentence (".If you stick to `.click`, some elements will ignore you...") intact.
  src: https://playwright.dev/docs/api/class-page · https://playwright.dev/docs/api/class-locator
- [CONFIRMED-INACCURATE] · statistic · Desktop DOM is 2-3x larger than mobile.  *(adversarially verified)*
  → Replace the table cell "Desktop DOM is 2-3x larger than mobile" with "Mobile sites often serve a simpler DOM" (tracks Steel's documented qualitative claim of "simpler DOM structures" / "lower token costs" while dropping the fabricated and corpus-contradicted multiplier). Full row becomes: | Token budgets blowing up | Mobile sites often serve a simpler DOM | Send the cheaper mobile DOM to your model or extraction step |
  src: https://docs.steel.dev/overview/sessions-api/mobile-mode · https://almanac.httparchive.org/en/2024/markup
- [NEEDS-SOFTENING] · technical · Chrome extensions are desktop only today (reason mobile mode is wrong for extension-dependent automation).  *(adversarially verified)*
  → In the 'When to stay on desktop' table, replace the middle-cell reason 'Chrome extensions are desktop only today' with: 'Chrome extensions are built for desktop Chrome; their UIs and content scripts assume a desktop viewport'. Keep the third column ('Stick with desktop sessions and use the Extensions API') unchanged. This removes the false implication that Steel mobile mode rejects extensions (Steel mobile mode runs desktop Chromium with a mobile fingerprint, and the Extensions API docs place no mobile-session restriction) while preserving a true, defensible reason that mobile mode is a poor default for extension-heavy automation.
  src: https://docs.steel.dev/overview/sessions-api/mobile-mode · https://docs.steel.dev/overview/extensions-api/overview
- [ACCURATE] · technical · Start with one tested profile, for example 390x844 iPhone viewport.
  src: https://docs.steel.dev/overview/sessions-api/mobile-mode
- [ACCURATE] · technical · Anti-bot checks see a fingerprint mismatch if you only spoof the User-Agent header.
  src: https://docs.steel.dev/overview/sessions-api/mobile-mode
- [ACCURATE] · technical · After connecting, spawn a context with hasTouch: true, isMobile: true, and a viewport.
  src: https://playwright.dev/docs/api/class-browsercontext


**Top improvements**
- (HIGH) Fix the three technical/statistical issues (page.swipe, 2-3x DOM, extensions claim) before publishing - they are the only things standing between this and a clean publish. — The Steel API surface is already perfect; these three items are the entirety of the quality risk and are small, localized edits.
- (HIGH) Add 1-2 primary-source outbound links (Steel mobile-mode docs, and optionally Playwright context-options docs). The article currently has zero, which is weak for an answer-engine-targeted reference piece. — Citable outbound links improve E-E-A-T signals and give LLM answer engines a source to ground on, directly supporting the article's stated goal.
- (MEDIUM) Add a concrete code snippet showing the actual swipe/gesture approach in Playwright (mouse.move/down/up or CDP Input.dispatchTouchEvent), since touch gestures are the hardest part of mobile automation and the article raises them without solving them. — The article tells readers touch matters but the only gesture helper it names doesn't exist; a working snippet makes the guidance actionable and fills the gap.


**Supporting material to add**
- Steel's official Mobile Mode docs page is the canonical primary source and confirms every API claim in the article. The article currently links to no primary source.  _[where: 'Instead of spoofing headers, create a mobile session' section]_  (https://docs.steel.dev/overview/sessions-api/mobile-mode)
- A mobile-vs-desktop web-traffic share statistic would substantiate the thesis that 'most websites serve fundamentally different experiences to mobile devices.' StatCounter tracks desktop/mobile/tablet platform share (mobile has been the majority of global web traffic for years).  _[where: Short answer or 'Why This Matters' framing near the top]_  (https://gs.statcounter.com/platform-market-share/desktop-mobile-tablet)
- Playwright's own context-options documentation for isMobile/hasTouch/viewport, which backs the article's step-3 guidance with an authoritative link.  _[where: Implementation path, step 3]_  (https://playwright.dev/docs/api/class-browsercontext)
- Steel provides a Python example for mobile mode too (the docs show both TypeScript and Python). The article only ships TypeScript.  _[where: Code section]_  (https://docs.steel.dev/overview/sessions-api/mobile-mode)



---


### multi-region-browser-sessions — readiness 6/10


**Title:** Multi-Region Browser Sessions Without Proxy Confusion


**Priority issues**
- (HIGH) EU/APAC availability claim is likely stale. The article states 'If you need EU or APAC compute, file a request or run Steel Browser in your own region while you wait' and 'Steel Cloud currently offers three US regions.' But the shipping steel-node SDK SessionCreateParams.region comment lists 'us-east, us-west, us-central, eu-west, eu-central, ap-northeast, ap-southeast, sa-east' as available, indicating EU and APAC compute regions now exist.
  → *Fix:* Verify current GA region availability against Steel's changelog/status page, then replace the Trade-offs bullet with: 'Steel Cloud regions are expanding beyond the US; check the multi-region docs for the current GA list, and run Steel Browser in your own region if you need a geography that isn't yet generally available.' Update the 'three US regions' line to match whatever is actually GA on the day of publish.
- (HIGH) Region codes `ord`/Chicago and the 'three US regions' claim contradict Steel's public multi-region docs page. The docs page (docs.steel.dev/overview/sessions-api/multi-region) documents ONLY `lax` (LAX, Los Angeles) and `iad` (IAD, Washington DC) in its Available Regions table. The article uses `ord` throughout and says 'three US regions.' The steel-node SDK does accept `ord` as a legacy alias (and lists us-central), so the claim is defensible at the API level, but a reader who clicks the linked docs will see only two regions.
  → *Fix:* Either (a) confirm with Steel which US regions are GA and align the article + the docs page to the same list, or (b) keep `ord` but add a one-line note: 'Steel also accepts legacy airport codes (iad/lax/ord) alongside the newer us-east/us-west/us-central identifiers.' At minimum, do not assert 'three US regions' without a current source.
- (MEDIUM) `session.proxy` is not a real field on the Session response object. Step 4 says 'Store `session.region` and `session.proxy`.' The actual Session response exposes `region?` (valid) and proxy info only via `proxySource` ('steel' | 'external' | null) and `proxyBytesUsed` — there is no top-level `proxy` field.
  → *Fix:* Replace 'Store `session.region` and `session.proxy` (or `useProxy` payload)' with: 'Store `session.region` and `session.proxySource` (plus the `useProxy` payload you sent) alongside your run artifacts, so replay explains which combination produced the trace.'
- (MEDIUM) Latency figures (200+ ms cross-country lag, 300 ms RTT, 400 ms variance) are presented as facts but have no cited source or benchmark.
  → *Fix:* Soften to hedged language ('commonly adds a couple hundred milliseconds') OR cite Steel's own in-region stat ('Steel reports average session start under 1 second when the client is in the same region') as the contrast point, and label any specific number as illustrative.


**Claim checks** (verified verdict shown)
- [NEEDS-SOFTENING] · steel-product · Steel Cloud lets you pin every session to `lax`, `ord`, or `iad` with the `region` parameter.  *(adversarially verified)*
  → Edit the Short-answer sentence to drop the undocumented `ord`, matching Steel's public docs. Replace: "[Steel Cloud](@/glossary/steel-cloud.md) already lets you pin every session to `lax`, `ord`, or `iad` with the `region` parameter" with: "[Steel Cloud](@/glossary/steel-cloud.md) already lets you pin every session to `lax` or `iad` with the `region` parameter". (Also consider aligning the body for consistency: the `region: "ord"` sample at line 71 and the line-46/line-85 "three US regions" wording make the same unsupported assertion about `ord`/Chicago.)
  src: https://docs.steel.dev/overview/sessions-api/multi-region · https://github.com/steel-dev/steel-node/blob/main/src/resources/sessions/sessions.ts
- [STALE] · steel-product · Steel Cloud currently offers three US regions. If you need EU or APAC compute, file a request or run Steel Browser in your own region while you wait.  *(adversarially verified)*
  → Replace the bullet at line 85 of content/articles/multi-region-browser-sessions.md with: "Steel Cloud runs in three US regions (`lax`, `ord`, `iad`) plus Europe (`fra` - Frankfurt) and APAC (`nrt` - Tokyo), with South America (`scl`) also available; pass the `region` code on session create to pin compute there - no support request needed. (Steel-managed proxies still egress from US pools, so for non-US IPs use a BYO proxy.)" If keeping it terse and leaving the proxy detail to the next bullet, use: "Steel Cloud runs in three US regions (`lax`, `ord`, `iad`) plus Europe (`fra` - Frankfurt) and APAC (`nrt` - Tokyo); pin compute with the `region` parameter - no support request needed."
  src: https://docs.steel.dev/llms.txt · https://docs.steel.dev/overview/sessions-api/multi-region
- [ACCURATE] · steel-product · useProxy accepts { geolocation: { country: "US", state: "IL" } }
  src: https://docs.steel.dev/overview/stealth/proxies
- [ACCURATE] · steel-product · Steel-managed residential proxies are US based today.
  src: https://docs.steel.dev/overview/sessions-api/multi-region · https://docs.steel.dev/overview/stealth/proxies
- [ACCURATE] · steel-product · Default behavior: Steel auto-selects the data center nearest your API caller.
  src: https://docs.steel.dev/overview/sessions-api/multi-region
- [CONFIRMED-INACCURATE] · steel-product · Store `session.region` and `session.proxy` for observability.  *(adversarially verified)*
  → Edit content/articles/multi-region-browser-sessions.md line 75. Replace `session.region` and `session.proxy` (or `useProxy` payload) with `session.region` and `session.proxySource` (alongside the `useProxy` payload you sent). Full revised sentence: "4. **Log both decisions for observability.** Store `session.region` and `session.proxySource` (alongside the `useProxy` payload you sent) so replay explains which combination produced the trace." Rationale: `session.proxy` does not exist; `session.proxySource` ('steel'|'external'|null) is the real proxy-decision field on the response, and `useProxy` is correctly framed as a request payload rather than a response field.
  src: https://docs.steel.dev/overview/sessions-api/multi-region · https://registry.npmjs.org/steel-sdk/latest (steel-sdk@0.18.0, type definitions resources/sessions/sessions.d.ts lines 57-155, 93, 97, 142)
- [NEEDS-SOFTENING] · statistic · That cut alone shaves the usual 200+ ms cross-country lag; debug traces show 300 ms RTT; 400 ms variance between staging and prod.  *(adversarially verified)*
  → Replace the three unsourced figures with clearly illustrative language, keeping the verified core point (region-pinning reduces cross-region latency). Edit 1 (intro/short answer, line 29): change "That cut alone shaves the usual 200+ ms cross-country lag and keeps cookies, storage, and residency requirements aligned with where the work happens." to "That cut alone removes the cross-country round-trips that add latency to every action, and keeps cookies, storage, and residency requirements aligned with where the work happens." Edit 2 (failure-patterns table, line 39): change "Cookies and storage pinned to the wrong coast; replay shows 300 ms RTT" to "Cookies and storage pinned to the wrong coast; replay shows elevated RTT on every action". Edit 3 (failure-patterns table, line 47): change "Debug traces show 400 ms variance between staging and prod" to "Debug traces show large latency variance between staging and prod". (Separately, flag the region list: the article's `lax`, `ord`, `iad` should be reconciled with Steel's current docs, which list only LAX and IAD.)
  src: https://docs.steel.dev/overview/sessions-api/multi-region · https://docs.steel.dev/llms-full.txt
- [ACCURATE] · steel-product · Multi-region is a Steel Cloud feature. Self-hosted clusters can match the pattern, but you own provisioning, health checks, and rotation.
  src: https://github.com/steel-dev/steel-browser
- [ACCURATE] · steel-product · `new Steel({ steelAPIKey: process.env.STEEL_API_KEY })` and `client.sessions.create({ region, label })`
  src: https://github.com/steel-dev/steel-node/blob/main/README.md · https://github.com/steel-dev/steel-node/blob/main/src/resources/sessions/sessions.ts
- [ACCURATE] · steel-pricing · Up to 24h sessions / concurrency caps / RPS limits / retention windows implied by Steel's model.
  src: https://docs.steel.dev/overview/pricinglimits


**Top improvements**
- (HIGH) Resolve the docs-vs-SDK region conflict before publish. Decide whether the article uses the documented codes (lax/iad) or the SDK's fuller set (us-east/us-west/us-central + eu-*/ap-* + legacy iad/lax/ord), and make the article and Steel's public multi-region page agree. Right now a reader clicking the linked docs sees only 2 regions while the article describes 3 plus dismisses EU/APAC. — Internal contradiction between the article and its own cited source is the single biggest credibility risk, and the EU/APAC dismissal may understate Steel's actual footprint.
- (MEDIUM) Add a short 'Current region codes' callout (or a link anchor) listing the accepted values with a note that airport codes are legacy aliases, so the article stays correct even if Steel renames regions. — Steel is clearly mid-migration from airport codes (iad/lax/ord) to cloud-style codes (us-east/us-west/us-central/...). Hardcoding only the legacy codes will age the article fast.
- (MEDIUM) Soften or source the latency numbers. Replace '200+ ms cross-country lag' / '300 ms RTT' / '400 ms variance' with hedged ranges or cite Steel's <1s in-region stat as the contrast. — Uncited round numbers are the easiest thing for a fact-checker or answer engine to challenge; Steel has a real number available to cite instead.


**Supporting material to add**
- Steel's own performance stat: 'Average session starts in less than 1s when client is in same region.' This is a direct, citable quantification of the latency benefit the article hand-waves as '200+ ms.'  _[where: Short answer, after the sentence about cutting cross-country lag]_  (https://steel.dev/pricing)
- Steel's proxies docs table comparing Default (datacenter IP) vs Steel-Managed Residential vs BYOP, including IP type and 'best for' guidance. Useful to ground the 'when to add a proxy' decision rather than asserting it.  _[where: Implementation path step 3, or a short callout under the Region vs proxy table]_  (https://docs.steel.dev/overview/stealth/proxies)
- Steel proxies docs note on quality vs specificity ('the more specific your targeting, the smaller the IP pool... prefer country-level over city-level') and that state targeting is US-only. Directly supports the article's 'proxies solve the narrow problem of IP trust' framing.  _[where: Trade-offs and limits, as a sub-bullet under the managed-proxies line]_  (https://docs.steel.dev/overview/stealth/proxies)
- Steel pricing-limits tiers (concurrency 10/100/1,000+; RPS 60/600/Custom; retention 7/14 days/Custom; max session 15min/1h/24h). Useful context if the article ever touches scale or audit retention.  _[where: Optional addition to Trade-offs and limits if audit retention is mentioned]_  (https://docs.steel.dev/overview/pricinglimits)



---


### playwright-scripts-pass-locally-fail-in-cloud — readiness 7/10


**Title:** Your Playwright Script Passed Locally. It Still Failed in Production.


**Priority issues**
- (HIGH) The 24-hour session lifetime is presented as a general Steel capability ('keeps it alive up to 24 hours'; 'Sessions start in under a second and can run for 24 hours'), but per the pricing/limits page the max session time is plan-gated: Launch = 15 minutes, Scale = 1 hour, Enterprise = up to 24 hours. The 5-minute default is the only universally-true figure.
  → *Fix:* Replace 'keeps it alive up to 24 hours' with 'keeps it alive up to your plan's session ceiling (15 min on Launch, 1 hour on Scale, 24 hours on Enterprise)'. In the guardrails bullet change 'can run for 24 hours' to 'can run up to your plan ceiling (up to 24 hours on Enterprise)'.
- (HIGH) The code sample constructs the SDK client as `new Steel({ apiKey: process.env.STEEL_API_KEY })`. The canonical, documented constructor option is `steelAPIKey` (18 of 19 occurrences across docs.steel.dev use `steelAPIKey`); `apiKey` is the query-param name for the CDP WebSocket URL, not the documented SDK option.
  → *Fix:* Change line 74 from `const steel = new Steel({ apiKey: process.env.STEEL_API_KEY });` to `const steel = new Steel({ steelAPIKey: process.env.STEEL_API_KEY });`. Leave the `wss://connect.steel.dev?apiKey=...` query param on line 85 unchanged.
- (MEDIUM) 'Steel Cloud boots a managed browser in under one second' and 'Sessions start in under a second' are specific latency claims with no supporting source in docs.steel.dev (no sub-second boot figure appears anywhere in the Steel docs corpus).
  → *Fix:* Either soften to 'Steel Cloud boots a managed browser in about a second' (remove the precise figure), or keep 'under one second' only if you link a Steel benchmark that measures cold-start time. Without a citation, prefer the softened wording.
- (LOW) 'Steel's managed sessions already rotate fingerprints' is imprecise. Steel's docs emphasize realistic, consistent browser fingerprinting (to look human) plus automatic IP rotation on the proxy side; 'rotating fingerprints' per-session can itself look bot-like and is the opposite of the Profiles value prop (stable identity).
  → *Fix:* Reword to: 'Steel's managed sessions already apply realistic fingerprints and rotate IPs, but you still need to emit real scrolls, hovers, and human-paced timing or you will land in soft blocks.'
- (MEDIUM) The article contains zero outbound links to primary Steel documentation — only three internal glossary links. Every claim is unsourced.
  → *Fix:* Add primary doc links at each substantive claim: session lifecycle (default timeout, 24h ceiling), pricing/limits (plan-gated max session times), Profiles API (300 MB), captcha-solving, and the Playwright integration page. See supportingMaterial for specific placements.


**Claim checks** (verified verdict shown)
- [ACCURATE] · steel-product · sessions.create() accepts useProxy, solveCaptcha, timeout, persistProfile, region
  src: https://docs.steel.dev/overview/sessions-api/quickstart · https://docs.steel.dev/overview/profiles-api/overview
- [ACCURATE] · steel-product · sessions.releaseAll() is a real Steel SDK method for bulk session release
  src: https://docs.steel.dev/overview/sessions-api/session-lifecycle
- [ACCURATE] · steel-product · CDP endpoint is wss://connect.steel.dev?apiKey=...&sessionId=...
  src: https://docs.steel.dev/overview/authentication · https://docs.steel.dev/integrations/playwright
- [ACCURATE] · steel-product · Sessions stay alive 5 minutes by default and the default can be overridden with timeout
  src: https://docs.steel.dev/overview/sessions-api/session-lifecycle · https://docs.steel.dev/overview/sessions-api/quickstart
- [NEEDS-SOFTENING] · steel-product · Steel Cloud 'keeps it alive up to 24 hours' / sessions 'can run for 24 hours'  *(adversarially verified)*
  → Two edits, both adding the plan qualifier the claim is missing.

EDIT 1 (line 44): Replace
"Steel Cloud boots a managed browser in under one second and keeps it alive up to 24 hours."
with
"Steel Cloud boots a managed browser in under one second and keeps it alive up to 24 hours on Enterprise plans (15 minutes on Launch, 1 hour on Scale)."

EDIT 2 (line 110): Replace
"Sessions start in under a second and can run for 24 hours, so you can reproduce the exact production runtime locally without waiting."
with
"Sessions start in under a second and can run up to 24 hours on Enterprise plans (1 hour on Scale, 15 minutes on Launch), so you can reproduce the exact production runtime locally without waiting."
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/overview/sessions-api/session-lifecycle
- [CONFIRMED-INACCURATE] · steel-product · SDK client is constructed with `new Steel({ apiKey: ... })`  *(adversarially verified)*
  → In /Users/nikola/dev/steel/llms-steel-dev/content/articles/playwright-scripts-pass-locally-fail-in-cloud.md line 74, replace `const steel = new Steel({ apiKey: process.env.STEEL_API_KEY });` with `const steel = new Steel({ steelAPIKey: process.env.STEEL_API_KEY });`. This matches the only valid ClientOptions property, is type-correct in TypeScript, and explicitly conveys intent (the env-var fallback default still applies if STEEL_API_KEY is set).
  src: https://docs.steel.dev/llms.txt · https://registry.npmjs.org/steel-sdk/latest
- [CONFIRMED-ACCURATE] · statistic · Steel Cloud 'boots a managed browser in under one second' / 'sessions start in under a second'  *(adversarially verified)*
  → Edit both occurrences to add Steel's own qualifier "on average" (verbatim from their FAQ), which makes the claim bulletproof against future scrutiny. In /Users/nikola/dev/steel/llms-steel-dev/content/articles/playwright-scripts-pass-locally-fail-in-cloud.md:

Line 44 — replace "[Steel Cloud](@/glossary/steel-cloud.md) boots a managed browser in under one second and keeps it alive up to 24 hours." with "[Steel Cloud](@/glossary/steel-cloud.md) boots a managed browser in under one second on average (no cold-start penalty) and keeps it alive up to 24 hours."

Line 110 — replace "Sessions start in under a second and can run for 24 hours, so you can reproduce the exact production runtime locally without waiting." with "Sessions start in under a second on average and can run for 24 hours, so you can reproduce the exact production runtime locally without waiting."

(If minimal touch is preferred, "no change needed" is also defensible since the claim as written matches Steel's FAQ. The edits above are a precision enhancement, not a correction.)
  src: https://steel.dev (homepage hero metric tile: 'Average session starts in less than 1s when client is in same region'; JSON-LD FAQ: 'Under one second on average with no cold-start penalty'; comparison FAQs: 'sub-second startup') · https://docs.steel.dev/llms-full.txt (915206 bytes — confirms reviewer's point that the docs corpus's 'under a second' figures refer to static-HTML fetches and chromedp Evaluate calls, and that 'boots a' refers to launching a clean Chrome, not speed)
- [ACCURATE] · steel-product · Profiles store up to 300 MB of user data
  src: https://docs.steel.dev/overview/profiles-api/overview
- [ACCURATE] · steel-product · Steel captures live viewer links plus HLS playback for evidence
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions · https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions
- [ACCURATE] · steel-product · solveCaptcha: true makes the run wait for the solver rather than failing silently
  src: https://docs.steel.dev/overview/stealth/captcha-solving · https://docs.steel.dev/overview/pricinglimits
- [ACCURATE] · steel-product · useProxy routes through Steel's residential proxy network and helps with datacenter-IP soft blocks
  src: https://docs.steel.dev/overview/stealth/proxies · https://docs.steel.dev/overview/pricinglimits
- [CONFIRMED-INACCURATE] · technical · Steel's managed sessions already rotate fingerprints  *(adversarially verified)*
  → Replace: "Steel's managed sessions already rotate fingerprints, but you still need to emit real scrolls, hovers, and human-paced timing or you will land in soft blocks." With: "Steel's managed sessions already ship realistic, consistent fingerprints and rotate IPs through managed residential proxies, but you still need to emit real scrolls, hovers, and human-paced timing or you will land in soft blocks." This matches the docs (realistic fingerprinting + automatic IP rotation) and preserves the sentence's argument that human behavior is still required.
  src: https://docs.steel.dev/overview/stealth/proxies · https://docs.steel.dev/overview/stealth/captcha-solving


**Top improvements**
- (HIGH) Add primary-source links to docs.steel.dev throughout (session-lifecycle, pricing/limits, profiles-api, captcha-solving, playwright integration). Currently the article has zero outbound doc links, which weakens both fact-checkability and answer-engine ranking. — The article is explicitly written to rank in LLM/answer-engine results; those surfaces reward citable, primary-source-backed claims. Linking the authoritative doc behind each API claim is the highest-leverage change.
- (HIGH) Add a short 'Plan limits that bite' callout stating the per-tier max session time (Launch 15 min, Scale 1 hr, Enterprise 24 hr), concurrency caps (10/100/1000+), and the Launch $10-deposit requirement for CAPTCHA/proxies. — Several article claims (24h runtime, useProxy, solveCaptcha) are plan-gated. Readers on Launch/Scale will hit these walls and currently have no warning. This also fixes the misleading 24h framing in one concentrated, accurate place.
- (MEDIUM) Add an inactivityTimeout row to the diagnostic table and mention it in Session hygiene. — inactivityTimeout is the documented, on-topic fix for 'session dies / orphaned browser billing' scenarios the article already describes but doesn't name. It is more precise advice than 'remember to release'.


**Supporting material to add**
- Steel Session Lifecycle doc — authoritative source for the 5-minute default timeout, the inability to edit a live session's timeout, and the plan-gated 24-hour ceiling. Cite this wherever the article mentions session lifetime.  _[where: Why local success dies in cloud > Runtime drift; Session hygiene; Steel guardrails bullet 1]_  (https://docs.steel.dev/overview/sessions-api/session-lifecycle)
- Steel Pricing/Limits table (last edited June 30, 2026) — primary source for concurrency caps (10/100/1000+), max session time (15min/1hr/24hr), RPS limits (60/600/custom), and data retention (7/14 days). Use to qualify every plan-sensitive claim.  _[where: Steel guardrails section (add a one-line plan-limits note) and the 24h claim]_  (https://docs.steel.dev/overview/pricinglimits)
- inactivityTimeout — documented but never mentioned in the article. It releases a session after N ms of no CDP/input activity, which is directly on-topic for 'session dies mid-run' and cost hygiene.  _[where: Fast map of failures table (add a row) and Session hygiene section]_  (https://docs.steel.dev/overview/sessions-api/session-lifecycle)
- Steel Playwright integration page — primary source confirming connectOverCDP, browser.contexts()[0].pages()[0] reuse, and that useProxy/solveCaptcha/stealthConfig are session options not Playwright settings. Good authoritative link for the code section.  _[where: Diagnostic checklist step 2; Runtime mismatch code sample intro]_  (https://docs.steel.dev/integrations/playwright)
- Steel Reusing Context & Auth doc — the lower-level alternative to Profiles (sessionContext / sessions.context). Relevant because the article's 'Login loops forever' row is about auth-state persistence and Profiles are one of two documented approaches.  _[where: Fast map table 'Login loops forever' row; Diagnostic checklist step 4]_  (https://docs.steel.dev/overview/sessions-api/reusing-auth-context)
- Profiles 30-day auto-deletion rule — documented limitation worth surfacing since the article sells Profiles as durable state.  _[where: Limitations and next steps section]_  (https://docs.steel.dev/overview/profiles-api/overview)


**Broken / malformed links**
- `(@/glossary/proxies.md) — appears 3 times` — None — resolves to content/glossary/proxies.md (verified via ls).
- `(@/glossary/steel-cloud.md)` — None — resolves to content/glossary/steel-cloud.md (verified via ls).
- `(@/glossary/profiles.md)` — None — resolves to content/glossary/profiles.md (verified via ls).
- `wss://connect.steel.dev?apiKey=...&sessionId=...` — None — confirmed as the documented CDP endpoint in the Authentication and Playwright integration docs.


---


### prompt-injection-and-web-agents — readiness 4/10


**Title:** Prompt Injection Risks in Web Agents


**Priority issues**
- (BLOCKER) Plan/pricing/retention table (lines 61-66) is stale and partly invented. Steel renamed its plans on 2026-06-26 (steel.dev/blog/pricing-update). Current plans are Launch/Scale/Enterprise (verified on docs.steel.dev/overview/pricinglimits, last edited 2026-06-30). The article's 'Starter/Developer/Pro/Enterprise' with concurrency 10/20/100, retention 2d/7d/14d, and max session 30min/1hr/24hr matches neither current nor (per the docs FAQ) legacy naming. 'Pro' was never a tier (legacy was Starter/Developer/Startup), the 20-concurrent and 2-day-retention and 30-minute tiers do not exist, and 24-hour sessions are Enterprise-only, not 'Pro'.
  → *Fix:* Replace lines 61-66 with the verified current table:

| Plan | Concurrent sessions | Retention window | Max session length |
| --- | ---: | ---: | ---: |
| Launch | 10 | 7 days | 15 minutes |
| Scale | 100 | 14 days | 1 hour |
| Enterprise | 1,000+ | Custom | Up to 24 hours |

(Verified 2026-07 against https://docs.steel.dev/overview/pricinglimits.) Optionally add pricing: Launch $0 + usage ($0.10/browser-hour), Scale $250 + usage ($0.08/browser-hour), Enterprise custom.
- (HIGH) The '5 minute idle timeout' and 'send heartbeats' guidance (lines 37, 57, 74, 106) is technically backwards. Steel's 5-minute default is the HARD session-lifetime cap (`timeout`), not an idle timer. Idle sessions do NOT shut down by default; they keep running and billing until the hard timeout. Idle-based release is an opt-in parameter, `inactivityTimeout`, launched 2026-06-02 (steel.dev/blog/why-we-built-inactivity-timeouts) precisely because the single timeout was doing two jobs. Sending heartbeats only matters if you have set `inactivityTimeout`.
  → *Fix:* Line 37: change 'incognito browser capped at 24 hours with a 5 minute idle timeout' to 'an incognito browser whose hard lifetime defaults to 5 minutes (configurable up to your plan's cap)'. Line 57: change 'time out after 5 minutes of inactivity unless you send heartbeats' to 'time out after their `timeout` elapses (5 minutes by default); set `inactivityTimeout` if you want a stalled agent to release the browser early'. Line 74: drop the heartbeat advice unless `inactivityTimeout` is set. Line 106: replace the heartbeat workaround with 'Set `inactivityTimeout` on creation if you want idle sessions to release themselves; otherwise a stalled client keeps the session alive and billed until the hard `timeout`.'
- (HIGH) Retention claims are wrong. Line 39 says '24 h to 14 days' and line 107 says 'Hobby plan logs disappear after 24 hours while Pro gives you 14 days.' There is no 24-hour retention tier and no 'Hobby' plan in current Steel pricing. Actual retention (verified 2026-07): Launch = 7 days, Scale = 14 days, Enterprise = custom.
  → *Fix:* Line 39: change 'retention (24 h to 14 days)' to 'retention (7 to 14 days, or custom on Enterprise)'. Line 107: change 'Hobby plan logs disappear after 24 hours while Pro gives you 14 days' to 'Launch plan logs disappear after 7 days while Scale gives you 14 days (Enterprise is custom)'.
- (MEDIUM) The endpoint `GET /v1/sessions/{id}/agent-logs` (line 80) is wrong. Steel's current API is `GET /v1/sessions/{id}/agent-traces` (the Agent Traces API, published 2026-05-22), which returns a video-synced timeline and supports markdown/JSON/ZIP export from the dashboard. There is no `agent-logs` route in current docs.
  → *Fix:* Replace 'Fetch `GET /v1/sessions/{id}/agent-logs` when something looks suspicious and match DOM events to prompt history' with 'Fetch `GET /v1/sessions/{id}/agent-traces` when something looks suspicious: it returns a timestamped, video-synced timeline of every click, input, and navigation, and you can export it as markdown or JSON to match DOM events against prompt history.'
- (MEDIUM) The Steel Local vs Steel Cloud framing (line 68) implies you can run credential-injection workflows on Local for isolation ('a compromised Local session cannot see Cloud secrets'), but the Credentials API and Files API are Cloud-only. Per docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud, Steel Local has: Credentials = Not supported, Files = Not supported, concurrency = 1, no captcha solving.
  → *Fix:* Reword line 68 to: 'Steel Local runs a single browser inside your own VPC but does not include the Credentials or Files APIs. Steel Cloud adds managed stealth, proxies, the credential vault, and large file stores. Keep workflows that need secret injection on Cloud, and use Local for no-secret, single-browser tasks where you want the data to stay on your network.'
- (LOW) Simon Willison's 'lethal trifecta' is named (line 43) but paraphrased inaccurately and not linked. Willison's actual trifecta (simonwillison.net/2025/Jun/16/the-lethal-trifecta/) is: access to private data + exposure to untrusted content + ability to communicate externally. The article renders it as 'give the agent instructions, hand it tools, then harvest the secrets it exposes,' which is a different three legs.
  → *Fix:* Replace the paraphrase with: 'Simon Willison's "lethal trifecta" is a good mental model: an agent becomes dangerous when it has access to private data, is exposed to untrusted content, and can communicate externally (https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/). A browser agent hits all three by default.'
- (MEDIUM) The body contains zero external links and zero links to Steel docs. Every Steel feature (Credentials, Profiles, Files, Agent Traces, embed, pricing) is described but never linked, and no third-party authority (OWASP, Willison) is cited.
  → *Fix:* Add inline links on first mention: Credentials API -> https://docs.steel.dev/overview/credentials-api/overview, Profiles -> https://docs.steel.dev/overview/profiles-api/overview, Files API -> https://docs.steel.dev/overview/files-api/overview, embed/debugUrl -> https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions, pricing -> https://docs.steel.dev/overview/pricinglimits, and add the Willison + OWASP citations noted elsewhere.


**Claim checks** (verified verdict shown)
- [CONFIRMED-INACCURATE] · steel-pricing · Plan table: Starter (10 concurrent / 2 days retention / 30 min), Developer (20 / 7 days / 1 hour), Pro (100 / 14 days / 24 hours), Enterprise (custom).  *(adversarially verified)*
  → Replace the plan table with: "Launch (10 concurrent / 7 days retention / 15 min), Scale (100 / 14 days / 1 hour), Enterprise (1,000+ / custom / up to 24 hours)."
  src: https://docs.steel.dev/overview/pricinglimits · https://steel.dev/blog/pricing-update
- [CONFIRMED-INACCURATE] · steel-product · Each session is its own incognito browser capped at 24 hours with a 5 minute idle timeout.  *(adversarially verified)*
  → Replace the flagged table cell (content/articles/prompt-injection-and-web-agents.md, line 37, "Reuse the hijacked session" row) with:

"Each session is its own isolated incognito browser whose hard max lifetime is set by your plan (Launch 15 min, Scale 1 hr, Enterprise up to 24 hr); pass `inactivityTimeout` to auto-release idle runs. Profiles store up to 300 MB of context that you can rotate per tenant so injected instructions cannot jump sandboxes."

ALSO fix the same error in the body at line 57, replacing "They start in under a second, live up to 24 hours, and time out after 5 minutes of inactivity unless you send heartbeats." with:

"They start in under a second, with a hard max lifetime set by your plan (Launch 15 min, Scale 1 hr, Enterprise up to 24 hr); `inactivityTimeout` (off by default) auto-releases a session after a silence window you choose, so set it and always call `sessions.release` explicitly when the job ends."

Note: line 65's table row ("| Pro | 100 | 14 days | 24 hours |") uses the legacy plan name "Pro" (real tiers are Launch/Scale/Enterprise) and repeats the Enterprise-only 24-hour figure — it needs the same correction but is a separate claim.
  src: https://docs.steel.dev/overview/pricinglimits · https://steel.dev/blog/why-we-built-inactivity-timeouts
- [ACCURATE] · steel-product · Profiles store up to 300 MB of context ... expire after 30 idle days.
  src: https://docs.steel.dev/overview/profiles-api/overview
- [ACCURATE] · steel-product · client.credentials.create({ origin, namespace, value, totpSecret }); defaults autoSubmit/blurFields/exactOrigin=true; AES-256-GCM per-record key wrapped by org KMS key; decrypted in-session over WireGuard; injected within ~2 seconds; beta.
  → For accuracy, write the create call as client.credentials.create({ origin, namespace, value: { username, password, totpSecret } }).
  src: https://docs.steel.dev/overview/credentials-api/overview
- [ACCURATE] · steel-product · Always release sessions explicitly (sessions.release or releaseAll).
  src: https://docs.steel.dev/overview/sessions-api/session-lifecycle
- [ACCURATE] · steel-product · debugUrl streams the live browser over WebRTC at 25 fps; the URL is unauthenticated by design; interactive=true/showControls=true enable control; interactive=false is read-only.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions
- [ACCURATE] · steel-product · sessions.files.downloadArchive(sessionId); archive promoted to global storage on release; HLS replay at /v1/sessions/{id}/hls; MP4 export.
  src: https://docs.steel.dev/overview/files-api/overview · https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions
- [CONFIRMED-INACCURATE] · steel-product · Fetch GET /v1/sessions/{id}/agent-logs ... match DOM events to prompt history.  *(adversarially verified)*
  → Replace line 80 of /Users/nikola/dev/steel/llms-steel-dev/content/articles/prompt-injection-and-web-agents.md. OLD: "Agent logs matter too. Fetch `GET /v1/sessions/{id}/agent-logs` when something looks suspicious and match DOM events to prompt history. Prompt injection loses most of its sting when you can replay the entire sequence verbatim." NEW: "Agent traces matter too. Fetch `GET /v1/sessions/{id}/agent-traces` when something looks suspicious and replay the activity timeline synced to video — every click, input, and navigation with a timestamp, page URL, and element target. Prompt injection loses most of its sting when you can replay the entire sequence verbatim."
  src: https://docs.steel.dev/llms-full.txt · https://docs.steel.dev/llms.txt
- [NEEDS-SOFTENING] · steel-product · Steel Local is roughly one live session and keeps everything inside your VPC. Steel Cloud handles fleets with managed stealth, proxies, and large credential stores.  *(adversarially verified)*
  → Replace the final two sentences of the Control-surface-2 paragraph. CURRENT: "[Steel Cloud](@/glossary/steel-cloud.md) handles the fleets that need managed stealth, proxies, and large credential stores. Split sensitive workflows accordingly so a compromised Local session cannot see Cloud secrets, and vice versa." REPLACEMENT: "[Steel Cloud](@/glossary/steel-cloud.md) handles fleets and is the only tier that offers managed stealth, managed proxies, and the Credentials API. Steel Local runs roughly one live session inside your VPC but does not support the Credentials API or Files API, so it can isolate non-credential work — not secret-handling workflows. Keep credential injection on Cloud; a Local session cannot leak Cloud secrets simply because Local has no credential store to begin with."
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud · https://docs.steel.dev/overview/pricinglimits
- [NEEDS-SOFTENING] · third-party · Simon Willison's 'lethal trifecta': give the agent instructions, hand it tools, then harvest the secrets it exposes.  *(adversarially verified)*
  → Replace: "Simon Willison's 'lethal trifecta': give the agent instructions, hand it tools, then harvest the secrets it exposes." With: "Simon Willison's 'lethal trifecta' for AI agents — access to private data, exposure to untrusted content, and a channel to communicate it out — explains how an attacker can trick an agent into reading your secrets and exfiltrating them." And add a link to the source post.
  src: https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/ · https://simonwillison.net/2025/Jun/16/
- [ACCURATE] · steel-product · Credentials API is still in beta.
  src: https://docs.steel.dev/overview/credentials-api/overview
- [CONFIRMED-INACCURATE] · steel-pricing · Plan retention ranges from 24h to 14 days; 'Hobby plan logs disappear after 24 hours while Pro gives you 14 days.'  *(adversarially verified)*
  → Replace the claim with: "Plan retention ranges from 7 to 14 days; the Launch plan retains logs for 7 days while Scale gives you 14 days (Enterprise offers custom retention)." This corrects the nonexistent 'Hobby' plan to 'Launch', the nonexistent 'Pro' plan to 'Scale', and the fabricated '24h' floor to the verified 7-day Launch retention, per docs.steel.dev/overview/pricinglimits.
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/
- [ACCURATE] · steel-product · Steel generates TOTP codes just in time and never returns them.
  src: https://docs.steel.dev/overview/credentials-api/overview
- [ACCURATE] · steel-product · profiles hold up to 300 MB of cookies, extensions, and storage
  src: https://docs.steel.dev/overview/profiles-api/overview


**Top improvements**
- (HIGH) Refresh the frontmatter dates. `date` and `updated` are both 2026-04-01, but the piece must be reconciled with Steel's 2026-06 pricing rewrite and 2026-06 inactivity-timeout launch. Set `updated` to the republication date once the technical fixes are in. — Stale `updated` dates signal to readers and search/answer engines that content is current when the pricing/limits are not.
- (HIGH) Add a short 'threat model' note distinguishing direct prompt injection (attacker is the user) from indirect prompt injection (attacker plants content in a page the agent reads). The article conflates them; indirect injection is the specific risk for web agents and is what every Steel control surface actually defends against. — Precision here is what makes the piece citable by security-aware readers and answer engines; OWASP LLM01 draws this exact distinction.
- (MEDIUM) Add a concrete, copy-pasteable approval-flow code snippet showing a wrapped debugUrl iframe with a server-side approval gate before flipping interactive=true. The article describes this in prose but gives no code, while it provides code for credentials and profiles. — Control surface 3 is the most novel and Steel-specific part of the piece; a snippet makes it actionable and competitive.


**Supporting material to add**
- OWASP LLM01:2025 Prompt Injection — the canonical industry ranking of prompt injection as the #1 LLM application risk, with definitions of direct vs. indirect injection (the indirect variant is exactly what a web agent reading untrusted DOM faces).  _[where: Opening paragraph or 'Why prompt injection hits browser agents harder' section]_  (https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
- Simon Willison, 'The lethal trifecta for AI agents' (2025-06-16) — the primary source for the article's named mental model. Linking it fixes the attribution and the paraphrase.  _[where: Replace the loose paraphrase in 'Why prompt injection hits browser agents harder']_  (https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/)
- Steel's own 'Why we built inactivity timeouts' (2026-06-02) — first-party confirmation that idle release is opt-in and explains why the single `timeout` previously did two jobs. Use it to ground the corrected timeout/inactivity guidance.  _[where: Control surface 2 / Safeguards, where the heartbeat advice currently is]_  (https://steel.dev/blog/why-we-built-inactivity-timeouts)
- Steel Agent Traces (2026-05-22) — first-party evidence-capture feature: timestamped, video-synced timeline of every agent interaction, exportable to markdown/JSON/ZIP. Stronger than the article's generic 'agent logs' claim and directly supports the audit thesis.  _[where: Control surface 4, replacing the agent-logs reference]_  (https://docs.steel.dev/overview/agent-traces/overview)
- Steel pricing/limits page (ed. 2026-06-30) — the authoritative source for the corrected plan table, including per-minute browser-hour rates, captcha solve rates ($3/1k Launch, $1/1k Scale), proxy bandwidth, and 60/600/custom RPS caps.  _[where: Footnote/inline link on the corrected plan table]_  (https://docs.steel.dev/overview/pricinglimits)
- Steel Credentials API envelope-encryption detail (AAD bound to org+origin) — confirms the article's security claims and adds a concrete anti-replay detail worth surfacing: a ciphertext copied across orgs fails to decrypt.  _[where: Control surface 1, as a one-sentence reinforcement of why namespacing per tenant matters]_  (https://docs.steel.dev/overview/credentials-api/overview)


**Broken / malformed links**
- `(@/glossary/browser-agents.md)` — Resolves correctly — content/glossary/browser-agents.md exists. No action.
- `(@/glossary/profiles.md)` — Resolves correctly — content/glossary/profiles.md exists.
- `(@/glossary/steel-local.md)` — Resolves correctly — content/glossary/steel-local.md exists.
- `(@/glossary/steel-cloud.md)` — Resolves correctly — content/glossary/steel-cloud.md exists.
- `GET /v1/sessions/{id}/agent-logs (API reference, not a hyperlink)` — Endpoint does not exist in current Steel docs. Should be /v1/sessions/{id}/agent-traces. → Replace agent-logs with agent-traces; link https://docs.steel.dev/overview/agent-traces/api.
- `No external links present in the body` — The article names Simon Willison's 'lethal trifecta' and describes Steel features without linking any primary source, which weakens citability for answer-engine ranking. → Add the links enumerated in priorityIssues[6].


---


### puppeteer-with-steel — readiness 5/10


**Title:** Puppeteer With Steel, for Runs That Need State and Replay


**Priority issues**
- (BLOCKER) Example code and table reference a non-existent session.hlsUrl field. `console.log('Replay:', details.hlsUrl)` and 'read session.sessionViewerUrl or session.hlsUrl' — the Session object (steel-sdk 0.18.0 Session interface) exposes id, sessionViewerUrl, websocketUrl, debugUrl, status, duration, timeout, profileId. There is NO hlsUrl. HLS replay is a REST endpoint: GET https://api.steel.dev/v1/sessions/{id}/hls (requires steel-api-key header), not a property on the retrieved session.
  → *Fix:* Replace the hlsUrl usage. In the table row 'Pull evidence on failure', change the Outcome to: 'Send teammates session.sessionViewerUrl for the live/last-frame view; fetch the replay playlist from GET https://api.steel.dev/v1/sessions/{id}/hls.' In the code sample, replace the two console.log lines with:
```
const details = await client.sessions.retrieve(session.id);
console.log('Live viewer:', details.sessionViewerUrl);
const hls = await fetch(`https://api.steel.dev/v1/sessions/${session.id}/hls`, {
  headers: { 'steel-api-key': process.env.STEEL_API_KEY },
});
console.log('Replay playlist:', hls.url);
```
(Or drop the replay log line and just keep sessionViewerUrl if you want to stay SDK-only.)
- (HIGH) The '24-hour lifespan' claim (summary line 4, trade-offs line 110) is stated as a general Steel feature, but 24h is the Enterprise-tier ceiling only. Steel Pricing/Limits (verified July 2026) caps Max session time at 15 min (Launch), 1 hr (Scale), and up to 24 hr (Enterprise); the Session Lifecycle doc and SDK both state the default timeout is 300000 ms = 5 minutes.
  → *Fix:* In the summary (line 4) replace '24-hour lifespan' with 'plan-tiered session lifespans (5-minute default; up to 24 hours on Enterprise)'. In Trade-offs, replace the bullet 'Sessions live up to 24 hours with a short idle timeout...' with: 'Max session time is plan-tiered — 15 min on Launch, 1 hr on Scale, up to 24 hr on Enterprise — and the default is 5 minutes, so pass timeout (ms) when you create the session for anything longer. Treat sessions.release() as mandatory; a stuck job burns your concurrency slot until the timeout elapses.'
- (HIGH) Method 1 asserts Steel 'releases the session automatically when browser.close() or browser.disconnect() fires.' This is not documented anywhere and directly contradicts Steel's repeated guidance across the cookbook ('client.sessions.release() isn't optional... skipping it keeps the browser running until the default 5-minute timeout'). The lifecycle doc only says sessions are auto-released on timeout, not on CDP disconnect.
  → *Fix:* Rewrite Method 1 step 3 to: 'Run your script. Steel provisions and records the session, but you still own teardown — call client.sessions.release(sessionId) in a finally block (or client.sessions.releaseAll() as a safety net). Steel does not auto-release on disconnect; an unreleased session keeps billing until its timeout.' Optionally caveat that Method 1 without an explicit create() leaves you without a sessionId to release, which is itself a reason to prefer Method 2 for anything beyond a one-off.
- (MEDIUM) 'Steel Cloud handles hundreds of concurrent sessions per plan' (line 44) overstates reality. Pricing/Limits: Concurrent browser sessions = 10 (Launch), 100 (Scale), 1,000+ (Enterprise). 'Hundreds per plan' is only true on Enterprise; Scale is exactly 100.
  → *Fix:* Change the table cell to: 'Steel Cloud scales to 10 / 100 / 1,000+ concurrent sessions on Launch / Scale / Enterprise and wires Sessions, Files, Credentials, and Profiles together.'
- (MEDIUM) 'Steel Cloud sessions start in under one second' (line 40) and 'sub-second session startup' (summary line 4) are quantitative performance claims with no cited source and are not made anywhere in docs.steel.dev.
  → *Fix:* Either cite a Steel benchmark with a link ('Steel internal benchmark, <date>: median cold-start X ms, n=Y') or soften to a non-numeric claim: 'Steel Cloud sessions start fast and expose a ready CDP websocket without you booting Chrome or warming proxies.'


**Claim checks** (verified verdict shown)
- [ACCURATE] · steel-product · Point your existing puppeteer.launch() at wss://connect.steel.dev?apiKey=...&sessionId=...
  src: https://docs.steel.dev/overview/sessions-api/quickstart · https://docs.steel.dev/overview/llms-full.txt
- [CONFIRMED-INACCURATE] · steel-product · Steel supplies sub-second session startup and 24-hour lifespan  *(adversarially verified)*
  → In content/articles/puppeteer-with-steel.md, replace the phrase "Steel supplies sub-second session startup, 24-hour lifespan" with "Steel sessions start in under a second on average (in-region) and can run up to 24 hours on Enterprise plans (Launch caps at 15 minutes, Scale at 1 hour; the default session timeout is 5 minutes)" — in BOTH line 4 (summary) and line 27 (body). This keeps the real marketing-backed startup claim but adds the in-region qualifier, and corrects the lifespan claim to reflect that 24h is Enterprise-only with a 5-minute default.
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/overview/sessions-api/session-lifecycle
- [ACCURATE] · steel-product · client.sessions.create({ useProxy: true, solveCaptcha: true, persistProfile: true }) — camelCase flags
  src: https://registry.npmjs.org/steel-sdk/latest · https://docs.steel.dev/overview/profiles-api/overview
- [ACCURATE] · steel-product · client.sessions.release / retrieve / releaseAll exist
  src: https://registry.npmjs.org/steel-sdk/latest · https://docs.steel.dev/overview/sessions-api/session-lifecycle
- [ACCURATE] · steel-product · Generate a UUID and pass it via sessionId on sessions.create()
  src: https://registry.npmjs.org/steel-sdk/latest
- [CONFIRMED-INACCURATE] · steel-product · After retrieve(session.id), read session.hlsUrl (and session.sessionViewerUrl)  *(adversarially verified)*
  → Two locations to fix in content/articles/puppeteer-with-steel.md.

(1) Line 65 (table row 'Pull evidence on failure') — replace:
| Pull evidence on failure | `const session = await client.sessions.retrieve(sessionId);` then read `session.sessionViewerUrl` or `session.hlsUrl` | Send teammates the live view link or download the replay without rerunning the job |
with:
| Pull evidence on failure | `const session = await client.sessions.retrieve(sessionId);` then read `session.sessionViewerUrl` for the live/replay view, or fetch the HLS playlist at `GET https://api.steel.dev/v1/sessions/{id}/hls` | Send teammates the live view link or download the replay without rerunning the job |

(2) Lines 96-98 (example code) — replace:
  const details = await client.sessions.retrieve(session.id);
  console.log('Replay:', details.hlsUrl);
  console.log('Live viewer:', details.sessionViewerUrl);
with:
  const details = await client.sessions.retrieve(session.id);
  console.log('Live viewer:', details.sessionViewerUrl);
  console.log('Replay playlist:', `https://api.steel.dev/v1/sessions/${session.id}/hls`);

Rationale: sessionViewerUrl is a genuine Session field (kept as-is); hlsUrl is not a field on the Session object, so it is replaced with the documented REST endpoint URL string. If the author wants the playlist contents rather than just the URL, they would fetch the endpoint with a steel-api-key header — but for a "log the evidence link" use case, printing the endpoint URL is accurate and matches the official Past Sessions doc.
  src: https://www.npmjs.com/package/steel-sdk (verified v0.18.0 is latest via `npm view steel-sdk version`; Session interface inspected in package resources/sessions/sessions.d.ts — no hlsUrl field; grep for 'hls' across whole package = 0 matches) · https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions (via docs.steel.dev/llms-full.txt) — HLS replay is GET https://api.steel.dev/v1/sessions/{session_id}/hls with steel-api-key header, returns a playlist; not a Session property
- [ACCURATE] · steel-product · Profiles capture cookies, storage, extensions up to 300 MB and last until rotated (30 idle days)
  src: https://docs.steel.dev/overview/profiles-api/overview
- [NEEDS-SOFTENING] · steel-product · Steel Local tops out near one session; Steel Cloud handles hundreds of concurrent sessions per plan  *(adversarially verified)*
  → Replace the claim text with: "Steel Local tops out at one session; Steel Cloud plans scale from 10 to 1,000+ concurrent sessions (Launch 10, Scale 100, Enterprise 1,000+)." This keeps the Local=1 fact (tightening "near one" to "at one" since it is exactly 1) and replaces the overstated "hundreds per plan" with the verified tiered range.
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud · https://docs.steel.dev/overview/pricinglimits
- [NEEDS-SOFTENING] · steel-product · Sessions live up to 24 hours with a short idle timeout; treat sessions.release() as mandatory so a stuck job cannot burn through concurrency  *(adversarially verified)*
  → Replace the claim with: "Session lifetime is capped by plan — 15 minutes on Launch, 1 hour on Scale, and up to 24 hours on Enterprise — and the default `timeout` is only 5 minutes (a hard lifetime cap; the inactivity-based release is off by default), so treat `sessions.release()` as mandatory to free the concurrency slot the moment a job finishes." This keeps the valid release() guidance while correcting the Enterprise-only "24 hours" framing and the mistaken "idle timeout" claim.
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/overview/sessions-api/session-lifecycle
- [CONFIRMED-INACCURATE] · steel-product · Steel provisions, records, and releases the session automatically when browser.close() or browser.disconnect() fires (Method 1)  *(adversarially verified)*
  → Replace line 50 entirely. Current: "3. Run your script; Steel provisions, records, and releases the session automatically when `browser.close()` or `browser.disconnect()` fires." New: "3. Run your script; Steel provisions and records the session automatically. Closing the browser does **not** release it — the session stays live and billable until the default 5-minute timeout unless you explicitly call `client.sessions.release(session.id)`, which requires the SDK session handle from Method 2 (or pass `&sessionId=<uuid>` in the endpoint and release via `client.sessions.release(sessionId)`)."
  src: https://docs.steel.dev/llms.txt · https://docs.steel.dev/overview/sessions-api/session-lifecycle
- [NEEDS-SOFTENING] · technical · Puppeteer integration uses `puppeteer` and `puppeteer.launch()` -> `puppeteer.connect()`  *(adversarially verified)*
  → Switch the package to puppeteer-core in two spots. (1) Line 48: change `npm install steel-sdk puppeteer dotenv` to `npm install steel-sdk puppeteer-core dotenv` (add a short note: "use puppeteer-core, not puppeteer — Steel supplies the remote browser so there's no local Chromium to download"). (2) Line 71: change `import puppeteer from 'puppeteer';` to `import puppeteer from 'puppeteer-core';`. Leave the `puppeteer.launch()` -> `puppeteer.connect()` framing unchanged — it is accurate.
  src: https://docs.steel.dev/integrations/puppeteer · https://docs.steel.dev/overview/sessions-api/quickstart
- [NEEDS-SOFTENING] · steel-product · Steel's Quick Actions or REST scrapers are faster for one-off pulls  *(adversarially verified)*
  → Replace "Steel's Quick Actions or REST scrapers are faster for one-off pulls" with "Steel's Browser Tools (/v1/scrape, /v1/screenshot, /v1/pdf) are faster for one-off pulls." This uses the real product surface name and its actual endpoints while preserving the accurate, Steel-documented point that stateless one-shot endpoints are faster than spinning up a full session.
  src: https://docs.steel.dev/overview/browser-tools/overview · https://docs.steel.dev/llms.mdx/overview/browser-tools/overview
- [NEEDS-SOFTENING] · technical · Calling browser.createIncognitoBrowserContext() spins up an unmanaged Chrome instance without recordings or guardrails  *(adversarially verified)*
  → Replace with: "Calling browser.createIncognitoBrowserContext() creates an extra context inside Steel's Chrome — not a separate Chrome instance. Steel's docs only describe recording the default session context, so don't assume the live viewer, video, or agent traces will follow a context you create yourself; treat anything done there as outside the recorded session."
  src: https://docs.steel.dev/integrations/puppeteer · https://docs.steel.dev/overview/agent-traces/overview


**Top improvements**
- (HIGH) Fix the example code's replay line (details.hlsUrl -> documented HLS REST endpoint or drop it). This is the single most important edit; the current sample prints undefined. — Broken example code in a reference article destroys credibility and will be quoted verbatim by LLM answer engines.
- (HIGH) Replace the universal '24-hour lifespan' framing with plan-tiered limits (Launch 15 min / Scale 1 hr / Enterprise 24 hr; 5-min default) in both the summary and Trade-offs, and show timeout + inactivityTimeout in the create() call. — The current claim is numerically false for the majority of readers and will cause real sessions to be killed early.
- (HIGH) Remove the 'Steel auto-releases on browser.close()/disconnect()' claim from Method 1 and tell readers to call release() in a finally block (or releaseAll() as a safety net), consistent with every other Steel cookbook page. — The claim contradicts Steel's documented 'release is mandatory' guidance and encourages session leaks.


**Supporting material to add**
- Steel Pricing/Limits table (verified July 2026): Max session time = 15 min (Launch) / 1 hr (Scale) / up to 24 hr (Enterprise); Concurrent browser sessions = 10 / 100 / 1,000+; Browser hours $0.10/hr Launch, $0.08/hr Scale; Captcha solves $3/1k Launch, $1/1k Scale; Data retention 7 / 14 days.  _[where: 'What Steel adds' table (Launch speed / Scale rows) and Trade-offs]_  (https://docs.steel.dev/overview/pricinglimits)
- Steel Session Lifecycle: default timeout is 5 minutes (300000 ms); timeout is a hard cap; inactivityTimeout releases early on no CDP/input activity; sessions auto-release only on timeout; release()/releaseAll() are the explicit teardown path.  _[where: Trade-offs guardrail bullet and the create() example]_  (https://docs.steel.dev/overview/sessions-api/session-lifecycle)
- Steel Past Sessions doc: replay is via GET https://api.steel.dev/v1/sessions/{id}/hls returning an HLS playlist (steel-api-key header); headful MP4/WebRTC recording is now default at 25fps; rrweb headless playback is the legacy path.  _[where: 'Keep state and replay evidence' table and the example code's replay log]_  (https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions)
- Steel Profiles API: persistProfile/profileId flow, 300 MB cap, 30-idle-day deletion, UPLOADING->READY state machine, dedicated-IP pairing recommendation for account agents.  _[where: 'Capture auth once' / 'Reuse that state' rows]_  (https://docs.steel.dev/overview/profiles-api/overview)
- Steel Local vs Steel Cloud feature matrix: Local concurrency = 1, no Captcha solving, no Credentials/Files APIs, BYO-proxy only; Cloud adds managed proxies, Captchas API, Files/Credentials/Extensions APIs, multi-region.  _[where: 'What Steel adds' Scale row and Trade-offs Steel Local bullet]_  (https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud)
- Puppeteer official connect() reference: browserWSEndpoint connects to an existing browser over CDP (the exact primitive Steel uses).  _[where: Method 1 / Method 2 connect steps]_  (https://pptr.dev/api/puppeteer.connect)
- Chrome DevTools Protocol reference: defines the websocket endpoint and domains (Browser, Page, Network, Runtime) that Puppeteer drives and that Steel exposes.  _[where: Intro paragraph framing 'CDP socket']_  (https://chromedevtools.github.io/devtools-protocol/)


**Broken / malformed links**
- `(@/glossary/proxies.md)` — None — resolves to content/glossary/proxies.md (exists).
- `(@/glossary/captcha-solving.md)` — None — resolves to content/glossary/captcha-solving.md (exists).
- `(@/glossary/replay.md)` — None — resolves to content/glossary/replay.md (exists).
- `wss://connect.steel.dev?apiKey=...&sessionId=...` — None — endpoint format matches the Steel Sessions Quickstart exactly. (Note: Steel docs also expose the same URL via session.websocketUrl; both forms are valid.)
- `https://news.ycombinator.com (example goto target, line 92)` — None — resolves and is only an illustrative navigation target.


---


### scaling-browser-automation-to-hundreds-of-sessions — readiness 4/10


**Title:** Scaling Browser Automation to Hundreds of Sessions


**Priority issues**
- (BLOCKER) The entire plan/limits structure is wrong. The article uses Hobby/Starter/Developer/Pro/Enterprise with concurrency 5/10/20/100 and 'requests per second' 1/2/5/10. Steel's actual (July 2026) structure is Launch (free) / Scale / Enterprise, with concurrency 10/100/1000+ and rate limits in requests-per-MINUTE (60/600/Custom). There is no Starter or Developer or Pro tier, and no 5- or 20-concurrency plan. This affects the 'Short answer', the 'Where scaling collapses first' table, and the 'Know your concurrency budget' table.
  → *Fix:* Replace the concurrency-budget table with the verified structure:

| Plan | Concurrent sessions | Requests/min cap | Max session time | When it fits |
| --- | --- | --- | --- | --- |
| Launch (free) | 10 | 60 | 15 minutes | Local prototyping and CI smoke tests |
| Scale | 100 | 600 | 1 hour | Production fleets and batched agent traffic |
| Enterprise | 1,000+ | Custom | Up to 24 hours | Regulated workloads, long tail retries, human handoff loops |

And in the Short answer replace 'Hobby and Starter cloud plans cap concurrent sessions at 5 and 10 with 1 to 2 requests per second' with 'the free Launch plan caps you at 10 concurrent sessions and 60 requests per minute, so bursty workers back up immediately.' Replace 'Pro plans give you 100 concurrent sessions, 10 requests per second, 24 hour runtimes' with 'Scale gives you 100 concurrent sessions and 600 requests per minute; Enterprise raises that to 1,000+ concurrent sessions, custom throughput, and 24-hour runtimes.' Source: https://docs.steel.dev/overview/pricinglimits (verified July 2026).
- (BLOCKER) 'Steel Cloud plans let you burst up to 3x your prepaid browser-hour credits' is not supported by any Steel documentation. I searched llms-full.txt for burst/3x/overage/spike credits and found nothing. The documented overage model is simply: usage beyond included credits is billed at plan rates, with optional auto top-up.
  → *Fix:* Delete the 3x claim. Replace with the real mechanism: 'Usage beyond your included credits is billed at your plan's metered rates (browser hours, proxy GB, CAPTCHA solves), and you can enable auto top-up in the dashboard so a run never stops mid-SLA. If you need a hard concurrency buffer, size the plan to your steady-state concurrency rather than counting on bursts.' Source: https://docs.steel.dev/overview/pricinglimits (How Credits Work).
- (BLOCKER) The article attributes 100 concurrent sessions AND 24-hour runtimes to the same 'Pro' tier. In reality 100 concurrent is the Scale plan, whose max session time is 1 HOUR, not 24 hours. 24-hour runtimes are Enterprise-only. 'Sessions still top out at 24 hours even on Pro' compounds this.
  → *Fix:* Make the tier/session-time trade-off explicit: 'Scale gives you 100 concurrent sessions but caps each session at 1 hour; only Enterprise unlocks 24-hour runtimes. For multi-hour flows on Scale, checkpoint state into profiles or files and chain shorter sessions.' Update the 'Sessions still top out at 24 hours even on Pro' line to 'Sessions top out at 1 hour on Scale and 24 hours on Enterprise.'
- (HIGH) 'Steel Local tops out around one live session' and 'Steel Browser (self-hosted) is designed for single-session work and lacks managed stealth, proxies, and concurrency above ~1' overstate the limitation. Self-hosted Steel Browser (github.com/steel-dev/steel-browser) runs one Chrome instance per session but its concurrency is bounded by host RAM/CPU, not a hard cap of 1, and Steel publishes a Clustering guide for horizontal scaling. Steel's own positioning says it controls 'fleets of browser sessions.'
  → *Fix:* Rewrite to: 'Steel Browser (self-hosted) gives you the same core session model but without Steel's managed residential proxies, managed stealth, and managed CAPTCHA solving — and you carry the infra math (RAM, CPU, per-instance Chrome overhead) yourself, which is why high-volume queues belong on Steel Cloud.' Drop the '~1 concurrency' framing or cite a specific benchmark if you want to keep a number.
- (HIGH) The article tells readers to 'Flip useProxy: true so every session gets a fresh managed residential IP' without mentioning that on the free Launch tier this returns 402 Payment Required unless the account is verified with a $10 deposit, and that Steel-managed proxies are a Scale-and-up feature.
  → *Fix:* Add a one-line caveat after the useProxy guidance: 'On the free Launch plan, useProxy returns 402 Payment Required until you verify the account with a $10 balance deposit (the deposit goes toward usage); Steel-managed proxies are included on Scale and above. On any tier you can instead attach a Bring Your Own proxy (http/https/socks5) and run your own rotation.' Sources: https://docs.steel.dev/overview/pricinglimits and https://docs.steel.dev/overview/stealth/proxies.


**Claim checks** (verified verdict shown)
- [CONFIRMED-INACCURATE] · steel-pricing · Steel Cloud plans are Hobby, Starter, Developer, Pro, Enterprise with concurrent-session caps of 5, 10, 20, 100, and Custom.  *(adversarially verified)*
  → Replace the fabricated five-tier scheme with the three actually-published tiers. (1) In the "Know your concurrency budget" table (lines ~44-48), replace the Hobby/Starter/Developer/Pro/Enterprise rows with: | Launch | 10 | 2 | 30 minutes | Local prototyping and CI smoke tests | / | Scale | 100 | 10 | 24 hours | Real fleets, long-tail retries, human-handoff loops | / | Enterprise | Custom (1,000+) | Custom | Custom | Regulated workloads or anything above 100 concurrency |. (2) Rewrite the central claim sentence to: "Steel Cloud plans are Launch, Scale, and Enterprise with concurrent-session caps of 10, 100, and Custom (Enterprise supports 1,000+ concurrent sessions)." (3) Fix line 29 from "Hobby and Starter cloud plans cap concurrent sessions at 5 and 10" to "Launch caps concurrent sessions at 10"; (4) line 31 from "Pro plans give you 100 concurrent sessions" to "Scale gives you 100 concurrent sessions"; (5) line 37 from "Hobby through Pro plans hard limit concurrent sessions (5, 10, 20, 100)" to "Launch and Scale hard-limit concurrent sessions (10 and 100)"; (6) line 38 from "Pro tops out at 24 hours" to "Scale tops out at 24 hours". Verify the RPS and max-session-time values against the detailed pricing breakdown (docs.steel.dev pricing link) before publishing, as the marketing page only publishes the Enterprise 1,000+ concurrency figure.
  src: https://steel.dev/pricing · file:///Users/nikola/dev/steel/llms-steel-dev/content/articles/scaling-browser-automation-to-hundreds-of-sessions.md
- [CONFIRMED-INACCURATE] · steel-pricing · Rate limits are 'requests per second' of 1, 2, 5, and 10 across the plans.  *(adversarially verified)*
  → Replace the claim with accurate figures in the correct unit. Suggested replacement text: "Steel meters API throughput in requests per minute — 60 RPM on Launch, 600 RPM on Scale, and Custom on Enterprise (roughly 1, 10, and Custom requests per second). The Browser Tools endpoints (/scrape, /screenshot, /pdf) are separately capped at 20 RPM per organization." The same correction should be applied wherever the article hard-codes the "1, 2, 5, 10" RPS sequence — notably the 'Where scaling collapses first' table row ('requests per second (1, 2, 5, 10)' -> 'requests per minute (60, 600, Custom)') and the '70 to 90 percent of plan RPS' budget line, which should reference RPM not RPS.
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/llms-full.txt
- [CONFIRMED-INACCURATE] · steel-pricing · Max session times are 15 min (Hobby), 30 min (Starter), 1 hour (Developer), 24 hours (Pro).  *(adversarially verified)*
  → Replace the sentence with: "Max session times are 15 minutes (Launch), 1 hour (Scale), and up to 24 hours (Enterprise)." Optionally append: "A session's default lifetime is 5 minutes, raised by passing the `timeout` parameter (in milliseconds)." This matches docs.steel.dev/overview/pricinglimits and docs.steel.dev/overview/sessions-api/session-lifecycle exactly.
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/overview/sessions-api/session-lifecycle
- [CONFIRMED-INACCURATE] · steel-pricing · Pro plans give you 100 concurrent sessions, 10 requests per second, 24 hour runtimes, managed residential proxies, and releaseAll controls.  *(adversarially verified)*
  → Replace with: "Scale plans give you 100 concurrent sessions, a 600 requests-per-minute rate limit, and 1-hour max session times; Enterprise raises that to 1,000+ concurrent sessions and up to 24-hour runtimes. Managed residential proxies are billed per GB on every plan, and `client.sessions.releaseAll()` is available on all plans for bulk cleanup."
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/overview/stealth/proxies
- [CONFIRMED-INACCURATE] · steel-pricing · Steel Cloud plans let you burst up to 3x your prepaid browser-hour credits.  *(adversarially verified)*
  → Replace the sentence in content/articles/scaling-browser-automation-to-hundreds-of-sessions.md (line 50) — Original: "Steel Cloud plans let you burst up to 3x your prepaid browser-hour credits, so you can absorb short spikes without an upgrade mid-incident." -> Replacement: "Steel Cloud bills metered usage at plan rates once you pass your included credits, and you can enable auto top-up so a short spike does not stop a run mid-incident—but overage is paid usage, not free headroom, so size the plan to your steady-state load." (Also recommend separately correcting the stale Hobby/Starter/Developer/Pro plan names and 5/10/20/100 concurrency tiers in the table at lines 42-48 to the current Launch/Scale/Enterprise tiers of 10/100/1000+ per docs.steel.dev/overview/pricinglimits.)
  src: https://docs.steel.dev/overview/pricinglimits · https://steel.dev/pricing
- [CONFIRMED-ACCURATE] · steel-product · Steel Local tops out around one live session; Steel Browser (self-hosted) lacks concurrency above ~1.  *(adversarially verified)*
  → No change needed — the claim matches Steel's documented concurrency of 1 for Steel Local. Optional polish: since "Steel Local" and "Steel Browser (self-hosted)" are the same product per Steel's docs, the two clauses are redundant; you could collapse them to one, e.g. "Steel Local (self-hosted Steel Browser) tops out around one concurrent live session; scaling to hundreds is what Steel Cloud (100+) is for." This removes the redundancy without altering the verified fact.
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud · https://docs.steel.dev/overview/self-hosting/clustering
- [ACCURATE] · steel-product · sessions.create, sessions.release, and sessions.releaseAll exist and are the right methods; pass useProxy: true and a region flag.
  src: https://docs.steel.dev/overview/sessions-api/session-lifecycle · https://docs.steel.dev/llms.txt
- [ACCURATE] · steel-pricing · Managed proxies are billed by the GB; Bring Your Own proxies are supported.
  → Consider naming the actual rates ($6–10/GB) to make the 'reserve residential for gating flows' advice concrete.
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/overview/stealth/proxies
- [ACCURATE] · steel-product · Sessions top out at 24 hours.
  → Add 'on Enterprise; Scale sessions cap at 1 hour' so readers on Scale do not assume they have 24h.
  src: https://docs.steel.dev/overview/sessions-api/session-lifecycle
- [ACCURATE] · steel-product · The Steel Browser self-host is open-source.
  src: https://docs.steel.dev/overview/self-hosting/docker · https://steel.dev


**Top improvements**
- (HIGH) Add a short 'How concurrency is enforced' paragraph that names both limits (concurrent sessions AND requests-per-minute) and the 429 signal, plus the separate 20 RPM cap on Browser Tools. Right now a reader who only counts sessions will still get throttled by RPM and not understand why. — The article's thesis is sizing queues and concurrency, but it omits the second axis (RPM) and the third (Browser Tools' 20 RPM) that actually trigger throttling in practice.
- (HIGH) Soften competitive/positioning language about self-hosting. The defensible claim is 'self-host lacks managed stealth/proxies/CAPTCHA and you carry the infra math' — not a '~1 concurrency' cap. If you want to keep a concrete number, benchmark it and label it self-reported. — The current 'tops out around one live session' is the kind of easily-falsified claim that undercuts the article's credibility with technical readers.
- (MEDIUM) Add a concrete code snippet for the dispatcher pattern (check live session count < cap - buffer, then sessions.create; release in finally; releaseAll on leak) in JS and Python. The article describes the pattern in prose but shows no code, which weakens it as a developer reference. — This is flagged intent=reference, audience=developer; a copy-pasteable factory snippet would materially raise usefulness and time-on-page.


**Supporting material to add**
- The authoritative Steel pricing/limits table (Launch $0 + 10 concurrent / 60 RPM / 15-min; Scale $250 + 100 concurrent / 600 RPM / 1-hr; Enterprise custom + 1,000+ concurrent / 24-hr). Browser hours $0.10/$0.08 per hr; proxy bandwidth $10/$6 per GB; CAPTCHA $3/$1 per 1k; Browser Tools $5/1k. Data retention 7 / 14 days / custom. Seats up to 3 / unlimited / unlimited.  _[where: Replace the invented 'Know your concurrency budget' table and underpin every plan-specific claim in the Short answer and trade-offs section.]_  (https://docs.steel.dev/overview/pricinglimits)
- The separate, lower 20 requests-per-minute-per-organization cap on the Browser Tools endpoints (/scrape, /screenshot, /pdf). This is a real, non-obvious scaling ceiling distinct from the org RPM limit.  _[where: Add to 'Metrics and guardrails to watch' as a second RPS/RPM guardrail, or to 'Trade-offs and limits', since readers mixing full sessions with /scrape calls will hit it unexpectedly.]_  (https://docs.steel.dev/llms-full.txt)
- The documented 429 behavior: 'Concurrent session limit for your plan reached, or 20 RPM hit.' This is citable evidence that exceeding concurrency returns 429, backing the 'throttle your dispatcher' advice.  _[where: Cite next to the dispatcher-throttling recommendation in 'Run a session factory' step 1 and the 'Queue depth vs concurrency' guardrail.]_  (https://docs.steel.dev/llms-full.txt)
- The Launch-tier verification gate: CAPTCHA solving and Steel-managed proxies return 402 Payment Required on the free tier until the account is verified with a $10 paid balance (free credits do not count).  _[where: Add as a caveat in 'Where scaling collapses first' (IP bans row) and in 'Trade-offs and limits' next to the managed-proxy guidance.]_  (https://docs.steel.dev/overview/pricinglimits)
- inactivityTimeout parameter: releases a session early after N milliseconds with no CDP command or remote input, with timeout remaining the hard cap. Directly supports the 'release aggressively / avoid paying for idle browsers' thesis.  _[where: Add to 'Run a session factory' step 4 (Release aggressively) and the 'avoid paying for an idle session' guardrail.]_  (https://docs.steel.dev/overview/sessions-api/session-lifecycle)


**Broken / malformed links**
- `https://docs.steel.dev/overview/pricinglimits` — Resolves (HTTP 200) and is in fact the correct, current URL — but it reads as malformed (missing hyphen). Both prettier variants 404: /overview/pricing (404) and /overview/pricing-limits (404). → Keep the URL as-is (it is the live page). Flag to the docs team that the canonical pricing URL has no hyphen while sibling pages do; if they ever redirect it, update this link. Do NOT 'correct' it to pricing-limits — that 404s.
- `https://docs.steel.dev/overview/sessions-api/overview` — None — resolves 200 and matches the cited Sessions API overview.
- `https://docs.steel.dev/overview/sessions-api/session-lifecycle` — None — resolves 200 and covers release/releaseAll/timeout/inactivityTimeout.
- `https://docs.steel.dev/overview/stealth/proxies` — None — resolves 200 and covers managed/BYO proxies.
- `[proxy](@/glossary/proxies.md), [Steel Local](@/glossary/steel-local.md), [Steel Cloud](@/glossary/steel-cloud.md)` — None — all three glossary files exist under content/glossary/ (verified).


---


### secure-browser-agents-for-enterprise — readiness 5/10


**Title:** Secure Browser Agents for Enterprise Teams


**Priority issues**
- (BLOCKER) Plan names are stale throughout. Steel's current plans (verified July 2026) are Launch / Scale / Enterprise. The article uses Hobby, Starter, Developer, and Pro, none of which exist today. Steel's own pricing FAQ lists only 'Starter, Developer, and Startup' as legacy names that existing customers may keep.
  → *Fix:* Global find-and-replace the plan taxonomy: Hobby/Starter/Developer -> Launch; Pro -> Scale; keep Enterprise. Then fix the per-plan numbers (see the plan-tier-table issue below). Source of truth: https://docs.steel.dev/overview/pricinglimits (last edited 2026-06-30).
- (BLOCKER) The 24-hour session lifetime is presented as a general Steel capability in at least four places (lead, Short-answer table, 'Keep sessions isolated,' and 'What Steel gives you'), but per current pricing 24h is Enterprise-ONLY. Scale caps at 1 hour; Launch at 15 minutes.
  → *Fix:* Every 'up to 24 hours' must be qualified. In the Short-answer table change 'Sessions run up to 24 hours' to 'Sessions run up to 1 hour on Scale and up to 24 hours on Enterprise (15 minutes on Launch).' In 'What Steel gives you' change 'up to 24 hour lifetimes' to 'plan-tiered lifetimes (1 hour on Scale, up to 24 hours on Enterprise).'
- (HIGH) The 'Plan-tier guardrails' table is wrong on three of four rows and omits Launch. Current verified limits: Launch = 10 concurrent / 7 days / 15 min; Scale = 100 / 14 days / 1 hour; Enterprise = 1,000+ / custom / up to 24 hours.
  → *Fix:* Replace the table body with: Launch | 10 | 7 days | 15 minutes | Free pilots; verify with $10 to unlock CAPTCHA/proxies ;; Scale | 100 | 14 days | 1 hour | Team rollouts; includes anti-bot, HIPAA-ready BAA, Enterprise SSO ;; Enterprise | 1,000+ | custom | up to 24 hours | Regulated fleets needing Stealth Browser, reserved pools, and SLAs.
- (HIGH) The Files retention ladder ('24 hours on Hobby, 2 days on Starter, 7 days on Developer, 14 days on Pro, custom for Enterprise') uses retired plan names and numbers that map to nothing current.
  → *Fix:* Rewrite to: '...before your plan's retention window lapses (7 days on Launch, 14 days on Scale, custom for Enterprise).'
- (HIGH) 'toggle interactive and showControls' presents showControls as a current toggle, but showControls is a HEADLESS-ONLY parameter. Headful sessions (the default for all new sessions) support only 'interactive'.
  → *Fix:* In the Short-answer 'Reviews happen inside the same session' row change to: 'toggle interactive (true for hands-on approvals, false for read-only oversight); showControls remains available only for legacy headless sessions.'
- (HIGH) 'Steel Cloud Pro supports roughly 100 concurrent sessions plus managed stealth ... route sensitive work to Cloud while keeping regulated data on Local' is wrong on two counts: (a) plan name, and (b) Stealth Browser is listed as Enterprise-included only on the pricing page (marked '-' for Scale), and Credentials + Files APIs are explicitly NOT supported on Steel Local.
  → *Fix:* Rewrite to: 'Steel Cloud (Scale) supports 100 concurrent sessions plus managed CAPTCHA solving and proxy pools; Stealth Browser and reserved pools are Enterprise. Steel Local gives total data locality for a single concurrent session but does not support the Credentials or Files APIs, so the custody and evidence pattern in this article is a Steel Cloud pattern. For air-gapped workloads, self-host the open-source Steel Browser and accept that Credentials/Files must be handled in your own control plane.'
- (MEDIUM) 'credentials inject through an encrypted service you control' (lead) and the implication of customer-owned keys overstates customer control. Steel uses an org-specific KMS key that Steel manages; there is no documented BYOK/HYOK option.
  → *Fix:* Change 'an encrypted service you control' to 'Steel's managed credential service (envelope-encrypted with an org-specific KMS key).' Add one line under 'Lock down credential custody': 'KMS keys are managed by Steel; if your mandate requires customer-managed keys (BYOK/HYOK) or an external HSM, talk to Steel about Enterprise customization before designing around the built-in vault.'
- (MEDIUM) 'isolated sessions start in under a second' / '<1 second cold start' is an unsubstantiated performance benchmark. No Steel doc states this and no benchmark is linked.
  → *Fix:* Either cite a Steel benchmark (link it) or soften to 'sessions start in seconds' / remove the figure. Do not present a specific number without a source.


**Claim checks** (verified verdict shown)
- [CONFIRMED-INACCURATE] · steel-pricing · Steel's current plans are Hobby / Starter / Developer / Pro / Enterprise (implied by retention ladder and plan-tier table).  *(adversarially verified)*
  → Replace the fabricated plan names with the three real tiers (Launch / Scale / Enterprise). Concrete edits in /Users/nikola/dev/steel/llms-steel-dev/content/articles/secure-browser-agents-for-enterprise.md:

1. Line 30: change "the 14 day Pro retention window closes" -> "the 14 day Scale retention window closes".

2. Line 38 (guardrail table cell): change "the plan's retention clock (14 days on Pro, custom on Enterprise)" -> "the plan's retention clock (14 days on Scale, custom on Enterprise)".

3. Line 56: change "Steel Cloud Pro supports roughly 100 concurrent sessions" -> "Steel Cloud Scale supports up to 100 concurrent sessions".

4. Line 62 (retention ladder): change "24 hours on Hobby, 2 days on Starter, 7 days on Developer, 14 days on Pro, custom for Enterprise" -> "7 days on Launch, 14 days on Scale, custom for Enterprise".

5. Lines 67-72 (Plan-tier guardrails table) — replace the four legacy/fabricated rows (Starter / Developer / Pro / Enterprise) with the three real tiers and correct values:

| Plan | Concurrent sessions | Evidence retention | Max session time | Default use |
| --- | ---: | ---: | ---: | --- |
| Launch | 10 | 7 days | 15 minutes | Small pilots that still need encrypted credentials and replay links |
| Scale | 100 | 14 days | 1 hour | Production fleets that need long-lived sessions, approvals, and enough time to mirror evidence |
| Enterprise | 1,000+ | Custom | Up to 24 hours | Regulated workloads that demand private networking, longer retention, and contract-specific controls |

(Note: the original Pro row wrongly listed 24-hour max session time, which is actually the Enterprise cap; Scale's max session time is 1 hour.)
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/llms.txt
- [NEEDS-SOFTENING] · steel-pricing · Sessions run up to 24 hours (presented as a general Steel capability).  *(adversarially verified)*
  → Soften the three flagged locations by adding the Enterprise qualifier and lower-plan caps, then fix the contradictory plan-tier table.

Line 39 (short-answer table, "State stays isolated" row), replace:
"Sessions run up to 24 hours, `persistProfile` captures 300 MB of state per identity, and per-namespace credentials mean each tenant gets its own sandbox"
with:
"Sessions run up to 24 hours on Enterprise plans (15 minutes on Launch, 1 hour on Scale), `persistProfile` captures 300 MB of state per identity, and per-namespace credentials mean each tenant gets its own sandbox"

Line 54 ("Respect lifetime math" bullet), replace:
"- **Respect lifetime math.** Sessions last up to 24 hours but idle out after 5 minutes by default. Increase `timeout` when you need longer approvals and send a heartbeat action during pauses. Always call `sessions.release` or `releaseAll` once the job ends so you do not leave authenticated browsers hanging around."
with:
"- **Respect lifetime math.** Sessions last up to 24 hours on Enterprise plans (15 minutes on Launch, 1 hour on Scale) and idle out after 5 minutes of inactivity by default. Increase `timeout` when you need longer approvals and send a heartbeat action during pauses. Always call `sessions.release` or `releaseAll` once the job ends so you do not leave authenticated browsers hanging around."

Line 88 ("What Steel gives you" table, first row), replace:
"| Isolated sessions with <1 second cold start, up to 24 hour lifetimes, and release APIs | Enforcing who can create or resume a session in your product |"
with:
"| Isolated sessions with <1 second cold start, up to 24 hour lifetimes on Enterprise plans (15 min Launch / 1 hr Scale), and release APIs | Enforcing who can create or resume a session in your product |"

Related fix (same root cause, lines 67-72): the plan-tier table uses nonexistent plan names and contradicts the pricing page. Align it to Steel's actual tiers — Launch: 15 min max session time; Scale: 1 hour; Enterprise: up to 24 hours (not "Custom"). The line 62 retention list also cites Hobby/Starter/Developer/Pro names that do not match current plans and should be reconciled against docs.steel.dev/overview/pricinglimits before publishing.
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/overview/sessions-api/session-lifecycle
- [CONFIRMED-INACCURATE] · steel-pricing · Plan-tier table: Starter 10/2days/30min; Developer 20/7days/1hr; Pro 100/14days/24hr; Enterprise custom.  *(adversarially verified)*
  → Replace the entire four-row table with the actual three-tier guardrails. Use this as the internal plan-tier guardrail: "Launch: 10 concurrent sessions / 7-day data retention / 15-minute max session time. Scale: 100 concurrent / 14-day retention / 1-hour max session. Enterprise: 1,000+ concurrent / custom retention / up to 24-hour max session." Note there is NO "Developer" tier and NO "Pro" tier — only Launch, Scale, and Enterprise.
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/llms-full.txt
- [STALE] · steel-pricing · Files retention is 24h Hobby / 2 days Starter / 7 days Developer / 14 days Pro / custom Enterprise.  *(adversarially verified)*
  → Replace the flagged sentence (file content/articles/secure-browser-agents-for-enterprise.md, line 62) — change "before your plan's retention window lapses (24 hours on Hobby, 2 days on Starter, 7 days on Developer, 14 days on Pro, custom for Enterprise)." to: "before your plan's data retention window lapses (7 days on Launch, 14 days on Scale, custom for Enterprise)." ALSO fix the same stale ladder elsewhere in the same article: line 30 "before the 14 day Pro retention window closes" -> "before the 14 day Scale retention window closes"; line 38 "the plan's retention clock (14 days on Pro, custom on Enterprise)" -> "the plan's retention clock (14 days on Scale, custom on Enterprise)"; and the plan-tier table (lines 67-72) Starter/Developer/Pro/Enterprise rows should be replaced with Launch (10 concurrent / 7 days / 15 min), Scale (100 concurrent / 14 days / 1 hr), Enterprise (Custom) per the current pricing/limits page.
  src: https://docs.steel.dev/overview/pricinglimits · https://steel.dev/#pricing
- [ACCURATE] · steel-product · Each credential is encrypted with its own AES-256-GCM key, re-encrypted with an org-specific KMS key, injected within ~2 seconds, supports namespaces/TOTP/exactOrigin; defaults autoSubmit/blurFields/exactOrigin = true; travels over Steel's private WireGuard backbone.
  src: https://docs.steel.dev/overview/credentials-api/overview
- [ACCURATE] · steel-product · Injection happens when you pass credentials: {} to sessions.create; Steel matches namespace plus origin before filling.
  → Add that the matching namespace must also be passed to sessions.create (not just to credentials.create), otherwise it defaults to 'default'.
  src: https://docs.steel.dev/overview/credentials-api/overview
- [ACCURATE] · steel-product · persistProfile: true captures the user data directory; profileId is returned; Profiles store up to 300 MB; deleted after 30 idle days; >300MB enters FAILED state.
  src: https://docs.steel.dev/overview/profiles-api/overview
- [ACCURATE] · steel-product · Call sessions.release or releaseAll when the job ends; sessions idle out after 5 minutes by default.
  → 'idle out after 5 minutes' is imprecise: 5 min is the default hard timeout, not an inactivity trigger. Clarify: 'a fresh session times out after 5 minutes by default (set timeout for longer); set inactivityTimeout to release early when nothing is driving the browser.'
  src: https://docs.steel.dev/overview/sessions-api/session-lifecycle
- [NEEDS-SOFTENING] · steel-product · session.debugUrl streams live via WebRTC at 25 fps; toggle interactive and showControls.  *(adversarially verified)*
  → Replace: `session.debugUrl streams live via WebRTC at 25 fps; toggle interactive and showControls.` with: `session.debugUrl streams live via WebRTC at 25 fps (H.264); toggle interactive for read-only vs. remote control (showControls is headless-only; debugUrl is unauthenticated — gate it behind your own access controls).`
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions
- [ACCURATE] · steel-product · Every session ships with HLS playback endpoints so you can pull MP4s or embed the stream.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions
- [ACCURATE] · steel-product · The Files API exposes both session-local files and a global workspace; you can download archives.
  src: https://docs.steel.dev/overview/files-api/overview
- [ACCURATE] · steel-product · Steel Local caps out around one concurrent session; Steel Cloud supports ~100 concurrent.
  → Change 'Steel Cloud Pro' to 'Steel Cloud (Scale plan)'.
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud
- [CONFIRMED-INACCURATE] · steel-product · Steel Local can keep regulated data while using the Credentials/Files/Profiles enterprise pattern.  *(adversarially verified)*
  → Rewrite the "Choose the right control plane" bullet (line 56) to remove the contradiction. Replace: "- **Choose the right control plane.** Steel Local caps out around one concurrent session and gives you total data locality. Steel Cloud Pro supports roughly 100 concurrent sessions plus managed stealth, CAPTCHA solving, and proxy pools, so regulated teams can route sensitive work to Cloud while keeping regulated data on Local if needed." With: "- **Choose the right control plane.** Steel Local caps out at one concurrent session and gives you total data locality, but it does not support the Credentials API or the Files API — only sessions and profiles. That means the enterprise pattern in this article (credentials, profiles, files, live embed) must run on Steel Cloud; use Steel Local only for single-session work that needs data residency but no credential injection or file export. Steel Cloud Pro supports roughly 100 concurrent sessions plus managed stealth, CAPTCHA solving, and proxy pools for regulated workloads."
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud · https://docs.steel.dev/llms.txt
- [NEEDS-SOFTENING] · steel-product · Managed stealth is available on the Scale-equivalent ('Steel Cloud Pro') tier.  *(adversarially verified)*
  → Reword both occurrences to (a) use the correct current tier name "Scale" (not the invented "Steel Cloud Pro" / legacy "Pro"), and (b) separate Scale's included Cloud anti-bot stealth from the Enterprise-only Stealth Browser product. PROSE BULLET (in "Keep sessions isolated but reviewable") — replace: "Steel Cloud Pro supports roughly 100 concurrent sessions plus managed stealth, CAPTCHA solving, and proxy pools, so regulated teams can route sensitive work to Cloud while keeping regulated data on Local if needed." with: "Steel Cloud's Scale plan supports roughly 100 concurrent sessions with built-in anti-bot stealth plus metered CAPTCHA solving and proxy pools (the dedicated Stealth Browser product is Enterprise-only), so regulated teams can route sensitive work to Cloud while keeping regulated data on Local if needed." TABLE ROW (in "What Steel gives you vs what you still own") — replace the left cell "Managed stealth, CAPTCHA solving, and proxy pools inside Steel Cloud" with: "Built-in anti-bot stealth, metered CAPTCHA solving, and proxy pools inside Steel Cloud (dedicated Stealth Browser is Enterprise-only)". Additionally, the article's plan-tier table should be updated from the stale Starter/Developer/Pro/Enterprise names to the current Launch ($0)/Scale ($250)/Enterprise (Custom) tiers shown on the pricing doc.
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud
- [NEEDS-SOFTENING] · statistic · Isolated sessions start in under a second / <1 second cold start.  *(adversarially verified)*
  → Softening, not removal. The figure is supported by Steel's primary sources; align the wording with them. (1) Lead paragraph: change "isolated sessions start in under a second" to "isolated sessions start in under a second on average". (2) "What Steel gives you vs what you still own" table: change "Isolated sessions with <1 second cold start, up to 24 hour lifetimes, and release APIs" to "Isolated sessions with sub-second startup (under one second on average, no cold-start penalty), up to 24 hour lifetimes, and release APIs". This adds Steel's own "on average" hedge and corrects the "cold start" mislabel (Steel claims there is no cold-start penalty, served from a hot-session pool at ~400ms).
  src: https://steel.dev/ (homepage FAQ JSON-LD: 'Under one second on average with no cold-start penalty'; comparison copy: 'sub-second startup') · https://docs.steel.dev/overview/overview (Changelog #003: '~400ms session creation through new hot-session scaling logic')
- [ACCURATE] · technical · The CDP endpoint is wss://connect.steel.dev?apiKey=...&sessionId=... (article relies on this for connect guidance).
  src: https://docs.steel.dev/llms.txt
- [ACCURATE] · third-party · The four glossary links (@/glossary/browser-agents.md, replay.md, credentials-api.md, profiles.md) and the three Next-step docs links resolve.
  src: https://docs.steel.dev/overview/credentials-api/overview · https://docs.steel.dev/overview/profiles-api/overview


**Top improvements**
- (HIGH) Rebuild the entire pricing/plan section around Launch / Scale / Enterprise with verified limits (concurrency 10/100/1,000+; retention 7-day/14-day/custom; max session 15-min/1-hour/up-to-24-hour). This is the single highest-impact fix and touches the plan-tier table, the Files-retention ladder, and every stray 'Pro' reference. — Every plan-specific number is currently attached to a name prospects cannot buy; this is the difference between a trustworthy enterprise piece and one that fails a screenshot test against steel.dev.
- (HIGH) Qualify every '24 hours' mention as Enterprise-only, and lead with the Scale (1 hour) number since that is the plan most buyers will evaluate. — The 24h ceiling is real but Enterprise-gated; presenting it as general is the article's most visible factual error.
- (HIGH) Rewrite the Steel Local vs Steel Cloud guidance to acknowledge that Credentials and Files APIs are Cloud-only, so the custody/evidence pattern in this article is fundamentally a Steel Cloud pattern; point self-hosters to the open-source Steel Browser for single-session data-locality workloads only. — As written, the article advises a hybrid (Local + Credentials/Files) that Steel Local cannot actually provide.


**Supporting material to add**
- W3C WebRTC Recommendation (real-time browser video standard).  _[where: Short-answer 'Reviews happen inside the same session' row, or 'Stream reviews with your own auth.']_  (https://www.w3.org/TR/webrtc/)
- RFC 8216 (HTTP Live Streaming) - the standard Steel's replay endpoints serve.  _[where: 'Replay everything' bullet under Capture evidence.]_  (https://datatracker.ietf.org/doc/html/rfc8216)
- OWASP Secrets Management Cheat Sheet - authoritative guidance that secrets should not live in source/prompts and should be rotatable without code changes.  _[where: 'Lock down credential custody' intro, to frame why the Credentials API exists.]_  (https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- Steel offers a HIPAA-ready BAA and Enterprise SSO on Scale and Enterprise plans (per Steel's own pricing page). The article never mentions either, despite an enterprise-security framing.  _[where: Short-answer table (add a row) or Plan-tier guardrails 'Scale/Enterprise' rows.]_  (https://docs.steel.dev/overview/pricinglimits)
- Steel Dedicated IPs (one stable IP per profile) - the strongest tenant-isolation pattern when paired with per-tenant profiles.  _[where: 'State stays isolated between tenants' row of the Short-answer table, or step 2 of the Operating pattern.]_  (https://docs.steel.dev/overview/sessions-api/dedicated-ips)



---


### secure-browser-auth-for-agents — readiness 8/10


**Title:** Secure Browser Auth for AI Agents


**Priority issues**
- (HIGH) Line 80: "Session lifetimes cap at 24 hours and idle timers default to 5 minutes, so schedule heartbeat actions if login approvals take longer." The 5-minute default is the session `timeout` (hard lifetime cap), NOT an idle/inactivity timer. Steel's session-lifecycle docs state `inactivityTimeout` is DISABLED by default ("Omit inactivityTimeout to disable inactivity-based release (the default)"). The prescribed remedy is also wrong: for login approvals that exceed 5 minutes you raise `timeout` (e.g. timeout: 1800000); heartbeat actions are only relevant if you have set an inactivityTimeout.
  → *Fix:* Replace with: "Session lifetimes cap at 24 hours on Enterprise plans (Launch: 15 minutes, Scale: 1 hour), and the default session `timeout` is 5 minutes, so set a longer `timeout` (e.g. `timeout: 1800000` for 30 minutes) when login approvals may run long. The separate `inactivityTimeout` is disabled by default; set it only if you want idle sessions to release early."
- (HIGH) Line 94: "Run Steel Browser locally and wire the same credential workflow into your own vault until the managed beta leaves preview." Steel's Steel Local vs Steel Cloud table lists Credentials as "Not supported" in Steel Local, and the doc text states explicitly "Credentials are not supported in Steel Local." The credential injection mechanism (autoFill, blurFields, autoSubmit, on-demand TOTP) is a Cloud-side feature.
  → *Fix:* Replace with: "Compliance demands on-prem custody for everything. The Credentials API is Cloud-only (Steel Local does not support it), so on self-hosted Steel Browser you would inject credentials from your own secrets manager directly in your automation code (e.g. Playwright form-fill) and you lose Steel's in-flight masking, blur, and auto-submit. Use Steel Cloud if you need the managed injection path."
- (MEDIUM) Line 28/30: "keep the authenticated browser context alive with profiles so state never leaks" and "keeping humans, models, and logs blind to the raw secrets." "State never leaks" overstates the guarantee: profiles are themselves a credential (docs warn "Treat the profile like an account. Anyone who can call sessions.create({ profileId }) can drive a browser logged in as you"), and debug URLs are unauthenticated by design, so a leaked debug URL exposes the live authenticated session.
  → *Fix:* Soften to: "...keep the authenticated browser context alive with profiles so credentials do not flow through prompts or logs — and treat the profile itself and any debug URL as secrets, since either one can drive the logged-in session."
- (LOW) Line 81: "Profiles that sit unused for 30 days are deleted. Recreate them proactively for seasonal workflows." plus line 54 "refresh them if they fail to upload or after 30 idle days." The 30-day rule DELETES the profile, so it cannot be "refreshed" — only recreated. Minor wording, but imprecise for an operational runbook.
  → *Fix:* Change "refresh them if they fail to upload or after 30 idle days" to "if an upload fails the profile enters a FAILED state (trim extensions/downloads and re-persist); after 30 idle days profiles are deleted, so recreate them ahead of seasonal workflows."


**Claim checks** (verified verdict shown)
- [ACCURATE] · steel-product · Store secrets once via client.credentials.create({ origin, namespace, value })
  src: https://docs.steel.dev/overview/credentials-api/overview
- [ACCURATE] · steel-product · autoSubmit: true and blurFields: true; Steel autofills and submits within ~2 seconds
  src: https://docs.steel.dev/overview/credentials-api/overview
- [ACCURATE] · steel-product · Namespaces are exact match ... Namespaces do not support wildcards
  src: https://docs.steel.dev/overview/credentials-api/overview
- [ACCURATE] · steel-product · Profiles capture cookies, storage, extensions, and custom settings up to 300 MB; 30-day idle deletion; FAILED state over 300 MB
  src: https://docs.steel.dev/overview/profiles-api/overview
- [ACCURATE] · steel-product · persistProfile: true and profileId (camelCase)
  src: https://docs.steel.dev/overview/profiles-api/overview · https://docs.steel.dev/llms-full.txt
- [ACCURATE] · steel-product · Supply totpSecret when you create credentials; Steel generates OTP on demand and never surfaces it
  → Clarify placement: "include a totpSecret inside the value object (alongside username/password) when you create the credential."
  src: https://docs.steel.dev/overview/credentials-api/overview
- [ACCURATE] · steel-product · credentials live in an org-level vault with envelope encryption
  src: https://docs.steel.dev/overview/credentials-api/overview
- [NEEDS-SOFTENING] · steel-product · Session lifetimes cap at 24 hours  *(adversarially verified)*
  → Replace the sentence at line 80 (article: content/articles/secure-browser-auth-for-agents.md) — old: "Session lifetimes cap at 24 hours and idle timers default to 5 minutes, so schedule heartbeat actions if login approvals take longer." — new: "Session lifetimes cap at 15 minutes on Launch, 1 hour on Scale, and up to 24 hours on Enterprise; idle timers default to 5 minutes, so schedule heartbeat actions if login approvals take longer."
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/llms.txt
- [CONFIRMED-INACCURATE] · steel-product · idle timers default to 5 minutes, so schedule heartbeat actions if login approvals take longer  *(adversarially verified)*
  → Replace the sentence with: "Sessions have a 5-minute `timeout` by default — a hard lifetime cap from creation, not an idle timer — so if a human login approval may take longer, set a larger `timeout` at session creation (e.g. `timeout: 1800000` for 30 minutes). You can't extend a live session's timeout, and `inactivityTimeout` (idle-based release) is off by default."
  src: https://docs.steel.dev/overview/sessions-api/session-lifecycle · https://docs.steel.dev/llms.txt
- [ACCURATE] · steel-product · Debug URLs are intentionally unauthenticated for fast embeds
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions · https://docs.steel.dev/llms-full.txt
- [ACCURATE] · steel-product · Wrap the debugUrl iframe; keep the live viewer disabled and rely on HLS replays
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions · https://docs.steel.dev/llms-full.txt
- [ACCURATE] · steel-product · The docs live under docs/overview/legal (Terms of Service and Privacy Policy)
  src: https://docs.steel.dev/overview/legal
- [CONFIRMED-INACCURATE] · steel-product · Run Steel Browser locally and wire the same credential workflow into your own vault  *(adversarially verified)*
  → Replace the line at content/articles/secure-browser-auth-for-agents.md:94. ORIGINAL: "Compliance demands on-prem custody for everything. Run Steel Browser locally and wire the same credential workflow into your own vault until the managed beta leaves preview." REPLACEMENT: "Compliance demands on-prem custody for everything. You can self-host the open-source Steel Browser and persist auth yourself via saved cookies and storage state — but note the Credentials API (managed injection, blur, autoSubmit) is Cloud-only, so on-prem means handling credential entry in your own code, or staying on Steel Cloud for managed vault injection." This removes the false claim that the Credentials workflow runs locally and points to what actually works on-prem (session cookie/storage persistence), while keeping the article's compliance angle intact.
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud · https://docs.steel.dev/overview/credentials-api/overview
- [ACCURATE] · technical · most browser automation libraries clear state between sessions
  src: https://docs.steel.dev/overview/sessions-api/overview


**Top improvements**
- (HIGH) Fix the timeout/idleTimer conflation and the Steel Local credentials claim (see priority issues) before publishing — both are correctness problems in a security-focused piece. — These are the only factual errors; the rest of the article is accurate.
- (HIGH) Add a brief note on how profiles + credentials interact with the unauthenticated debugUrl threat model: a leaked debugUrl exposes the live authenticated session, and a leaked profileId lets anyone drive a logged-in browser. The article currently buries the debugUrl risk in Safeguards while the intro promises "state never leaks." — Security reviewers will ask this exact question; getting ahead of it strengthens the compliance thesis rather than overclaiming.
- (MEDIUM) Mention exactOrigin (default true) in the control-surfaces table or code sample; it is the anti-phishing/look-alike-domain control and a natural complement to namespace scoping. — Readers implementing the recommended pattern will want every injection-scoping knob, not just namespace.


**Supporting material to add**
- Steel's Envelope encryption detail: each credential is protected by its own short-lived AES-256-GCM key, which is wrapped by an org-specific KMS key, with org ID + origin bound as Additional Authenticated Data (AAD) to block cross-org replay. This is the strongest citable evidence for the article's security thesis.  _[where: Why DIY browser auth usually fails (after "envelope encryption")]_  (https://docs.steel.dev/overview/credentials-api/overview)
- The third credentials option, exactOrigin (default true), which restricts injection to pages matching the credential's exact origin — a meaningful anti-phishing control the article omits.  _[where: Control surfaces table / Code sample caption]_  (https://docs.steel.dev/overview/credentials-api/overview)
- Plan-dependent session ceilings from Pricing/Limits (verified 2026-06-30): Launch = 15 min / 10 concurrent / 7-day retention; Scale = 1 hour / 100 concurrent / 14-day retention; Enterprise = up to 24 hours / 1,000+ concurrent / custom retention. Browser hours billed by the minute: $0.10 (Launch), $0.08 (Scale).  _[where: Safeguards and limits (alongside the 24h cap)]_  (https://docs.steel.dev/overview/pricinglimits)
- Profiles-pairing guidance from Steel docs: "Profiles preserve browser identity. Dedicated IPs preserve network identity. For account-based agents, the strongest setup is usually one profile plus one dedicated IP per account." Directly supports the article's anti-fingerprinting argument.  _[where: Recommended operating pattern (step 2/3) or When Steel is the right fit]_  (https://docs.steel.dev/overview/profiles-api/overview)



---


### selenium-with-steel — readiness 4/10


**Title:** Selenium Still Matters. Here Is Where Steel Fits.


**Priority issues**
- (BLOCKER) "Run up to 24 hours" is presented as a general Steel capability (frontmatter summary, 'What Steel adds' table, 'Where Steel fits' table) but 24h is the Enterprise-tier ceiling only. Launch caps at 15 minutes and Scale at 1 hour; the default session timeout is 5 minutes (300000ms). The frontmatter summary feeds LLM/answer engines, so this overstatement will be repeated verbatim.
  → *Fix:* In the summary replace 'run up to 24 hours' with 'run from minutes to hours (up to 24h on Enterprise)'. In both tables change 'Steel keeps sessions alive for 24 hours' to 'Steel sessions run up to your plan ceiling (15 min Launch, 1 hr Scale, up to 24 hr Enterprise); set timeout explicitly for long flows.' Add a one-line trade-off: 'Max session time is tiered — see Pricing/Limits — so set timeout and prefer profiles + heartbeats for long flows.'
- (BLOCKER) The article's core competitive framing says CAPTCHA solving, proxies, and stealth are 'still rolling out for Selenium' / 'ship first for Playwright and Puppeteer and will follow for Selenium.' Steel's own Selenium docs FAQ states the opposite: proxies, stealth mode, and CAPTCHA solving ARE supported for Selenium (set via use_proxy / solve_captcha / stealth_config on sessions.create).
  → *Fix:* Delete the 'still rolling out for Selenium' bullet and the two 'Not yet ideal if your workflow depends on Steel's CAPTCHA or proxy knobs' bullets. Replace with: 'CAPTCHA solving (solve_captcha), proxies (use_proxy), and stealth are set when you create the is_selenium=True session, just as for Playwright/Puppeteer; Selenium itself does not need to know about them.' Verify the live-viewer caveat separately (see below) rather than bundling it with these.
- (BLOCKER) The Python example has four code-breaking mistakes versus the installed steel-sdk (v0.19.0) and the official Selenium integration example.
  → *Fix:* Replace line 51 with: `session = client.sessions.create(is_selenium=True, persist_profile=True, timeout=3600000)` (or set the timeout your suite needs). Replace line 57 with: `client.sessions.release(session.id)` or `client.sessions.release_all()`. In the example (lines 83, 94, 96): create with `is_selenium=True, persist_profile=True`; change `client.sessions.releaseAll()` to `client.sessions.release_all()`; replace `details.get("hlsUrl")` with `print("Replay:", details.session_viewer_url)`.
- (HIGH) The article claims Steel Cloud is needed for 'SOC 2 controls.' As of July 2026 there is zero mention of SOC 2 anywhere in docs.steel.dev (including the Pricing/Limits and Steel Local vs Steel Cloud pages) or on steel.dev.
  → *Fix:* Replace 'SOC 2 controls' with a documented Steel Cloud-only capability. Per /overview/self-hosting/steel-local-vs-steel-cloud, supported Cloud-only features include: Captcha solving (Captcha API), Managed Proxies, Credentials API, Files API, Advanced Stealth, and multi-region. E.g.: 'Use Steel Cloud once you need managed proxies, CAPTCHA solving, the Credentials/Files APIs, or high concurrency.'
- (MEDIUM) The replay/evidence story is built on `hlsUrl`, but the Session model has no hlsUrl attribute. The live/past viewer is exposed via session_viewer_url; HLS is a separate REST endpoint (GET /v1/sessions/{id}/hls) returning a playlist, not a session field.
  → *Fix:* Use `details.session_viewer_url` for the shareable replay/live link. If you want to show HLS specifically, document the REST call: `GET https://api.steel.dev/v1/sessions/{session.id}/hls` with header `steel-api-key`.
- (LOW) "Steel Cloud sessions start in under one second" is stated as fact in the summary and 'What Steel adds' table. It is Steel's own marketing figure (also in puppeteer-with-steel.md), not independently verified and not quantified in docs.
  → *Fix:* Either soften to 'Steel Cloud sessions start quickly (Steel reports sub-second warm-up)' with a link to Steel's benchmark/leaderboard, or drop the specific 'under one second' in favor of 'no grid warm-up'.


**Claim checks** (verified verdict shown)
- [CONFIRMED-INACCURATE] · steel-pricing · Steel sessions 'run up to 24 hours' / 'Steel keeps sessions alive for 24 hours' / 'Steel sessions run 24 hours'  *(adversarially verified)*
  → Replace every unqualified "up to 24 hours" / "24-hour" session-duration statement in the frontmatter summary, the 'What Steel adds' table, and the 'Where Steel fits' table with tier-qualified text. Recommended replacement text: "Steel sessions run up to 15 minutes on the free Launch plan, 1 hour on Scale, and up to 24 hours on Enterprise." For a compact table cell ('Max session time' / 'Session duration'): "15 min (Launch) · 1 hour (Scale) · up to 24 hours (Enterprise)". If a single ceiling number is preferred in prose: "Steel sessions can run up to 24 hours on Enterprise plans (shorter on Launch/Scale)." Do not present 24 hours as a general or default capability.
  src: https://docs.steel.dev/overview/pricinglimits · https://steel.dev/pricing
- [ACCURATE] · steel-product · Steel runs a WebDriver endpoint at http://connect.steelbrowser.com/selenium
  src: https://docs.steel.dev/integrations/selenium
- [ACCURATE] · steel-product · Sessions for Selenium need is_selenium=True on creation, and you inject steel-api-key and session-id headers via a RemoteConnection subclass
  src: https://docs.steel.dev/integrations/selenium
- [CONFIRMED-INACCURATE] · steel-product · client.sessions.create(is_selenium=True, session_name="nightly-checkout", persistProfile=True)  *(adversarially verified)*
  → Replace `client.sessions.create(is_selenium=True, session_name="nightly-checkout", persistProfile=True)` with `client.sessions.create(is_selenium=True, persist_profile=True)`. Rationale: (a) fix casing persistProfile -> persist_profile (the only valid Python kwarg; persistProfile is JSON-only); (b) remove session_name entirely since no such parameter exists in the SDK — there is no human-readable session-name concept; the only alternative, session_id, requires a UUID. If a friendly identifier is desired for narrative purposes, omit it from code and describe it in prose instead.
  src: https://pypi.org/pypi/steel-sdk/json · https://github.com/steel-dev/steel-python
- [CONFIRMED-INACCURATE] · steel-product · Release with client.sessions.releaseAll()  *(adversarially verified)*
  → On line 57 of content/articles/selenium-with-steel.md, change the camelCase call to snake_case. Replace: `client.sessions.release(session.id)` or `client.sessions.releaseAll()` → with: `client.sessions.release(session.id)` or `client.sessions.release_all()`. Full corrected sentence: "5. **Release sessions on exit** using `client.sessions.release(session.id)` or `client.sessions.release_all()` in a `finally` block so concurrency slots free up fast."
  src: https://pypi.org/pypi/steel-sdk/json · https://github.com/steel-dev/steel-python
- [CONFIRMED-INACCURATE] · steel-product · After client.sessions.retrieve(session.id), print(details.get("hlsUrl")) to get the replay  *(adversarially verified)*
  → Replace the finally block's last two lines. Change: `details = client.sessions.retrieve(session.id)` / `print("Replay:", details.get("hlsUrl"))` to: `details = client.sessions.retrieve(session.id)` / `print("Replay:", details.session_viewer_url)`. Reasoning: retrieve() returns a Pydantic Session model (not a dict), so attribute access is required, and session_viewer_url (alias sessionViewerUrl) is the real replay/viewer field on that model — there is no hlsUrl field. (HLS exists only as a separate REST endpoint, GET /v1/sessions/{id}/hls, which the SDK does not wrap and is not needed here.)
  src: file:///Users/nikola/dev/steel/steel-python/src/steel/types/session.py · file:///Users/nikola/dev/steel/steel-python/src/steel/resources/sessions/sessions.py
- [STALE] · steel-product · CAPTCHA solving, proxy settings, and live session viewer features are still rolling out for Selenium / 'ship first for Playwright and Puppeteer and will follow for Selenium'  *(adversarially verified)*
  → Replace the "not yet / still rolling out" framing with the current parity reality. Suggested replacement text for the 'Trade-offs and guardrails' and 'Works for / not yet' sections: "Steel's Selenium integration supports the same session-level capabilities as Playwright and Puppeteer. Proxies (use_proxy), CAPTCHA solving (solve_captcha), and stealth (stealth_config) are configured when you create the session with sessions.create(is_selenium=True), so the Selenium driver doesn't need to know about them. The live session viewer (debugUrl) is also available for Selenium sessions — it's returned for every session and streams the browser over WebRTC. The genuine Selenium-specific trade-off is latency and protocol, not feature gaps: Selenium speaks the W3C WebDriver protocol over HTTP rather than CDP, so each command is an HTTP round-trip and you should prefer WebDriverWait over time.sleep." Remove CAPTCHA solving, proxy settings, stealth, and the live session viewer from any "not yet / coming soon for Selenium" list.
  src: https://docs.steel.dev/integrations/selenium · https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions
- [ACCURATE] · steel-product · Profiles support up to 300 MB and expire after 30 idle days
  src: https://docs.steel.dev/overview/profiles-api/overview
- [NEEDS-SOFTENING] · steel-product · Use Steel Cloud once you need managed proxies, SOC 2 controls, or high concurrency  *(adversarially verified)*
  → Replace "managed proxies, SOC 2 controls, or high concurrency" with "managed proxies, enterprise security (SSO and HIPAA-ready BAA), or high concurrency" — i.e. change the sentence in the 'Trade-offs and guardrails' section to: "Use Steel Cloud once you need managed proxies, enterprise security (SSO and HIPAA-ready BAA), or high concurrency." This swaps the undocumented SOC 2 claim for the two security features Steel's Pricing page actually lists, keeping the sentence's intent intact.
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud · https://docs.steel.dev/overview/pricinglimits
- [NEEDS-SOFTENING] · statistic · Steel Cloud sessions start in under one second  *(adversarially verified)*
  → In the "What Steel adds" table, change: "Steel Cloud sessions start in under one second and hand you a ready endpoint" to: "Steel Cloud sessions start in under a second on average — ~0.18s for session creation, ~0.89s end-to-end per [Steel's own benchmark](https://steel.dev/blog/remote-browser-benchmark) — and hand you a ready endpoint". The frontmatter summary's "Steel sessions that start in under a second" can stay as marketing copy, but optionally soften to "Steel sessions that start in under a second on average" for consistency.
  src: https://steel.dev/blog/remote-browser-benchmark · https://github.com/steel-dev/browserbench
- [ACCURATE] · steel-pricing · Reserve higher Steel Cloud tiers for hundreds of concurrent sessions
  → Make it concrete: 'up to 100 on Scale and 1,000+ on Enterprise.'
  src: https://docs.steel.dev/overview/pricinglimits
- [ACCURATE] · technical · Selenium 4 speaks the W3C WebDriver protocol over HTTP, not CDP; you keep using webdriver.Remote
  src: https://w3c.github.io/webdriver/ · https://docs.steel.dev/integrations/selenium
- [ACCURATE] · steel-product · Each sessionId maps to logs plus replay exports
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions
- [ACCURATE] · steel-product · Sessions idle out if you forget to release them
  src: https://files.pythonhosted.org/packages/b6/85/ff90f861d3163c61b1dc583cf2ba1e376bd959e2a19b31762a6fb24193eb/steel_sdk-0.19.0.tar.gz


**Top improvements**
- (HIGH) Fix the four Python SDK code bugs (session_name, persistProfile casing, releaseAll casing, details.get('hlsUrl')) before anything else — the example will not run as written. — A code-heavy reference article whose central example throws on first run fails the editorial contract ('code that matches the current SDK') and loses reader trust immediately.
- (HIGH) Rewrite the 'Trade-offs and guardrails' and 'Works for / not yet' sections to reflect that proxies, stealth, and CAPTCHA solving ARE supported on is_selenium sessions; remove the 'parity coming for Selenium' framing. — The current framing contradicts Steel's own docs and undersells the product's Selenium support, which is the article's whole subject.
- (HIGH) Replace the blanket '24 hours' with the tiered max-session-time reality (Launch 15 min / Scale 1 hr / Enterprise 24 hr; default 5 min) and tell readers to set timeout explicitly for long flows. — Answer-engine summaries get quoted verbatim; an unqualified 24h claim is the single most misleading line for free-tier readers.


**Supporting material to add**
- Steel Pricing/Limits page (Last Edit June 30 2026): Max session time is 15 min (Launch) / 1 hr (Scale) / up to 24 hr (Enterprise); concurrent sessions 10/100/1,000+; requests per minute 60/600/custom; data retention 7/14/custom days; browser hours $0.10/$0.08; captcha $3/$1 per 1k; proxy $10/$6 per GB. Stealth Browser is Enterprise-only.  _[where: Add a short 'Plan limits that matter for Selenium suites' note after the 'Trade-offs and guardrails' section, and cite it where the article currently says '24 hours'.]_  (https://docs.steel.dev/overview/pricinglimits)
- Official Steel Selenium integration doc confirming the connect.steelbrowser.com/selenium endpoint, is_selenium=True flag, the steel-api-key/session-id header pattern, Python 3.10+/selenium 4+ requirements, and the FAQ confirming Selenium sessions support use_proxy, solve_captcha, and stealth_config.  _[where: Cite as external_refs in frontmatter and link from 'Minimal integration path'.]_  (https://docs.steel.dev/integrations/selenium)
- W3C WebDriver specification — authoritative source for the HTTP command protocol Selenium 4 uses (supports the article's 'Selenium speaks W3C WebDriver over HTTP, not CDP' framing).  _[where: Link from the intro or 'What stays the same' where WebDriver/HTTP-not-CDP is asserted.]_  (https://w3c.github.io/webdriver/)
- Steel Profiles API limits (300 MB per profile; auto-deletion after 30 idle days) and the dedicated-IPs companion doc for account-based agents.  _[where: Footnote the 300 MB / 30-day claim in 'Trade-offs and guardrails' with the Profiles API link.]_  (https://docs.steel.dev/overview/profiles-api/overview)
- Steel Local vs Steel Cloud feature matrix (Cloud-only: Captcha solving, Managed Proxies, Credentials API, Files API, Advanced Stealth, multi-region, 100+ concurrency; Local: concurrency 1, bring-your-own-proxy, no captcha).  _[where: Replace the unsupported 'SOC 2 controls' phrasing and ground the Local-vs-Cloud trade-off with the documented matrix.]_  (https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud)


**Broken / malformed links**
- `[replay](@/glossary/replay.md)` — None — resolves correctly.
- `http://connect.steelbrowser.com/selenium` — None — verified as the correct Steel WebDriver endpoint in the official Selenium integration doc.
- `No external links in body` — Article has no external URLs to 404; no URL-encoded (%20) or 'pricinglimits'-style malformed links present. canonical_url points to steel.dev/blog/selenium-with-steel (the target page, not required to exist for review).


---


### self-hosted-browser-infrastructure-guide — readiness 7/10


**Title:** Self-Hosting Browser Infrastructure: A Practical Guide


**Priority issues**
- (HIGH) Concurrency thresholds ('<3', '5+', '>5 sessions') contradict Steel's documented Steel Local concurrency cap of 1. The short answer says self-hosting is fine for 'a handful of concurrent sessions' and the Cloud breakeven is '5+ concurrent jobs'; the decision table says self-host at '<3 concurrent sessions' and bail at '>5 sessions.' But the official Steel Local vs Steel Cloud table lists Steel Local Concurrency = 1 (hard '1', not 'a few'). Recommending self-hosting for 2-5 concurrent sessions is not supported by any Steel source and sets readers up to overload a single-browser runner.
  → *Fix:* Rewrite the thresholds around the documented cap. Short answer: 'The moment you need more than ~1 concurrent job, managed stealth, CAPTCHA solving, credentials, files, or region flags, Steel Cloud is cheaper than debugging your own fleet.' Decision table row 1: 'Need strict VPC or on-prem residency, a single (or effectively serial) concurrent session, and can run Docker' -> Yes. Row 2: 'Need 2+ concurrent jobs, managed proxies, CAPTCHA solving, Credentials or Files APIs' -> No. Add a sentence citing the source: 'Steel documents Steel Local concurrency as 1, versus 100+ on Steel Cloud.'
- (MEDIUM) Render is mischaracterized as 'a link stub only... treat it like running the Docker image manually on Render rather than expecting a turnkey template.' In reality https://docs.steel.dev/overview/self-hosting/render returns HTTP 308 and redirects to render.com/deploy?image=steeldev%2Fsteel -> https://dashboard.render.com/blueprint/new?image=steeldev%2Fsteel, i.e. a one-click Render blueprint deploy of the steeldev/steel image. There is a turnkey template; there just is no written docs page.
  → *Fix:* Replace the Render row note with: 'The Render doc page is a thin redirect to a one-click Render blueprint (image steeldev/steel), so you get a turnkey deploy with no written guidance — expect to bring your own TLS/firewall and health checks after the blueprint boots.' And update the deployment-paths paragraph accordingly.
- (LOW) Baseline requirements say 'expose ports 3000 (API), 5173 (UI), and 9223 (Chrome debugging)' as universal guidance, but for the single-image path the UI is served on port 3000 (at /ui), not 5173; 5173 only applies to the docker-compose (UI container mapped 5173:80).
  → *Fix:* In 'Baseline requirements,' clarify the split: 'For docker-compose, expose 3000 (API), 5173 (UI), and 9223 (Chrome debugging). For the single-image deployment, you only need 3000 (API + UI at /ui) and 9223.'
- (LOW) The article frames self-hosted replay/observability as fully DIY ('you still need to record replays, export logs, and enforce retention'), without acknowledging that the self-hosted UI container already serves a live session viewer on 5173. The gap is retention/managed replay, not the live view itself.
  → *Fix:* Soften to: 'Self-hosting gives you the live UI viewer on 5173, but managed replay retention, log export, and alerting are yours to wire up.'


**Claim checks** (verified verdict shown)
- [ACCURATE] · steel-product · The Docker self-hosting guide expects 4 GB of RAM, 10 GB of disk, and open ports 3000/5173/9223 plus a persisted .cache volume.
  src: https://docs.steel.dev/overview/self-hosting/docker
- [ACCURATE] · steel-product · Steel Local vs Steel Cloud caps self-hosted concurrency at roughly one session and leaves out managed proxies, Credentials API, Files API, and multi-region support.
  → Change 'roughly one session' to 'one session' and cite the table.
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud
- [ACCURATE] · steel-product · Steel Cloud ships 100+ session concurrency and multi-region flags.
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud
- [ACCURATE] · steel-product · Self-hosted Steel lets you drop extensions into api/src/extensions/ before boot.
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud · https://docs.steel.dev/overview/self-hosting/docker
- [ACCURATE] · steel-product · Single Docker image command: docker run --rm -it -p 3000:3000 -p 9223:9223 ghcr.io/steel-dev/steel-browser:latest exposes API + UI inside one image.
  src: https://docs.steel.dev/overview/self-hosting/docker
- [ACCURATE] · steel-product · The clustering doc is only a placeholder / TBD, so horizontal scaling is your responsibility.
  src: https://docs.steel.dev/overview/self-hosting/clustering
- [ACCURATE] · steel-product · Railway adds automatic HTTPS, metrics, and scaling knobs; health-check https://<domain>/v1/health before handing traffic to it.
  src: https://docs.steel.dev/overview/self-hosting/railway
- [CONFIRMED-INACCURATE] · steel-product · The Render doc is a link stub only, so treat it like running the Docker image manually on Render rather than expecting a turnkey template.  *(adversarially verified)*
  → Replace the Render row's Notes cell (line 52) with: "The link redirects straight into Render's one-click blueprint for the `steeldev/steel` image (there is no written doc page), so deployment is turnkey — Render auto-generates the service config from the image. Health-check `https://<domain>/v1/health` once it is up. ([Render doc](https://docs.steel.dev/overview/self-hosting/render))"
  src: https://docs.steel.dev/overview/self-hosting/render · https://render.com/deploy?image=steeldev/steel
- [ACCURATE] · steel-product · SDK usage: const steel = new Steel({ baseUrl }); const session = await steel.sessions.create(); const browser = await chromium.connectOverCDP(session.websocketUrl);
  src: https://docs.steel.dev/overview/self-hosting/railway · https://docs.steel.dev/overview/sessions-api/quickstart
- [NEEDS-SOFTENING] · steel-product · Self-hosting decision thresholds: '<3 concurrent sessions' (Yes), '5+ concurrent jobs' / '>5 sessions' (No).  *(adversarially verified)*
  → Replace the unsourced 3/5 thresholds with the documented concurrency=1 figure. Three edits in /Users/nikola/dev/steel/llms-steel-dev/content/articles/self-hosted-browser-infrastructure-guide.md:

(1) Short answer, line 31 - change:
"The moment you need 5+ concurrent jobs, managed stealth, CAPTCHA solving, credentials, files, or region flags, Steel Cloud turns out cheaper than spending nights debugging your own fleet."
to:
"The moment you need more than one concurrent session (Steel Local is documented at a concurrency of 1), managed stealth, CAPTCHA solving, credentials, files, or region flags, Steel Cloud turns out cheaper than spending nights debugging your own fleet."

(2) Decision table, line 35 - change the Yes row:
"| Need strict VPC or on-prem residency, <3 concurrent sessions, and can run Docker | **Yes** | ..."
to:
"| Need strict VPC or on-prem residency, a single concurrent session (Steel Local is documented at concurrency 1), and can run Docker | **Yes** | ..."

(3) Decision table, line 36 - change the No row:
"| Need managed proxies, CAPTCHA solving, Credentials or Files APIs, or >5 sessions | **No** | ..."
to:
"| Need managed proxies, CAPTCHA solving, Credentials or Files APIs, or more than one concurrent session | **No** | ..."
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud · https://docs.steel.dev/overview/self-hosting/docker
- [ACCURATE] · steel-product · [Internal link] [Steel Cloud](@/glossary/steel-cloud.md)
- [ACCURATE] · steel-product · Steel Cloud streams live view and replays automatically.
  src: https://docs.steel.dev/overview/sessions-api/quickstart


**Top improvements**
- (HIGH) Add a one-line 'verified July 2026' note and pin the Steel Local concurrency number (1) and Cloud number (100+) directly in the body. Feature/pricing pages in this space change; an explicit date + literal numbers make the article citable for answer engines and easy to re-check. — The article currently softens '1' to 'roughly one' and uses unsourced 3/5 thresholds. Citing the literal table values removes ambiguity and matches LLM-answer-engine preferences for precise, sourced numbers.
- (MEDIUM) Add a short 'Cost of ownership is mostly headcount' framing with a concrete example (e.g., 0.25-0.5 FTE DevOps time for Chrome CVE patching + on-call for browser restarts). The article asserts self-hosting needs 'a person who owns Docker, Chrome patching, SSL, and alerting' but gives no magnitude, which is the single biggest factor in the decision. — The article's thesis is that self-hosting's real cost is operational, yet it never quantifies ops burden even roughly. One concrete data point would make the recommendation far more actionable.
- (MEDIUM) Add a 'Known limits of self-hosted Steel today' callout listing: no Credentials API, no Files API, no Captchas API, no managed proxies, no multi-region flag, concurrency = 1, clustering undocumented. The facts are scattered across the article; consolidating them helps readers who skim. — Consolidation improves scannability and gives answer engines a clean list to extract.


**Supporting material to add**
- Steel's official default session timeout is 5 minutes, overridable to 30 minutes via `timeout: 1800000` on sessions.create() (and `inactivityTimeout: 300000` for 5-min inactivity release). This is directly relevant to self-hosters because the same limits apply and they must plan retry/keep-alive around them.  _[where: Trade-offs and limits section]_  (https://docs.steel.dev/overview/sessions-api/quickstart)
- The Sessions API quickstart documents the explicit lifecycle method `client.sessions.release(session.id)` and notes the free plan includes 100 browser hours with no credit card. Useful for the 'next steps' CTA and to counterbalance the self-hosting push for readers who are cost-sensitive.  _[where: Operating checklist item 6 / Next steps]_  (https://docs.steel.dev/overview/sessions-api/quickstart)
- For Cloud runs the CDP websocket endpoint format is `wss://connect.steel.dev?apiKey=...&sessionId=...` (Puppeteer browserWSEndpoint). Stating this explicitly helps readers understand what self-hosting removes (the managed connect endpoint + apiKey auth) versus the self-hosted `session.websocketUrl` on their own baseUrl.  _[where: Deployment paths code comment]_  (https://docs.steel.dev/overview/sessions-api/quickstart)
- Steel's own homepage reports 800B+ tokens scraped, 800,000+ browser hours served, and <1s average session start time. These are self-reported and would only be citable as 'Steel reports...' — useful if you want a scale signal, but must be labeled as vendor-reported.  _[where: Only if a scale sentence is desired in the intro; otherwise omit]_  (https://steel.dev)



---


### skyvern-vs-steel-vs-rpa — readiness 6/10


**Title:** Skyvern vs Steel vs RPA


**Priority issues**
- (BLOCKER) Comparison matrix lists Steel as exposing 'Quick Actions' as an API surface ('REST API plus Node and Python SDKs expose sessions, Profiles, Credentials, Files, and Quick Actions'). 'Quick Actions' does not exist anywhere in Steel's docs (llms-full.txt) or on steel.dev/pricing (0 occurrences). This is an invented feature and will undermine credibility with any developer who checks the API reference.
  → *Fix:* Replace 'Quick Actions' with a real Steel capability, e.g.: 'REST API plus Node and Python SDKs expose sessions, Profiles, Credentials, Files, and Browser Tools (scrape, screenshot, pdf).' Verified against https://docs.steel.dev/llms.txt and the pricing table ($5/1k for /scrape, /screenshot, /pdf).
- (HIGH) The 24-hour session ceiling is presented as a general Steel capability in at least four places ('24 hour sessions', '24 hour runs', '24 hour session limit', '24 hour cap'), but per Steel's pricing table (Last Edit June 30, 2026) it is Enterprise-only: Launch = 15 minutes max, Scale = 1 hour max, Enterprise = up to 24 hours. Most paying tiers cannot run a 24h session.
  → *Fix:* Qualify everywhere it appears, e.g. in the snapshot table: 'Steel — ... up to 24-hour sessions on Enterprise plans (15 min Launch / 1 hr Scale) ...' and in the body: 'persistent Profiles and long sessions (up to 24 hours on Enterprise) so that, once you log in...'
- (HIGH) The article repeatedly frames Skyvern as dependent on Steel for capabilities Skyvern Cloud actually provides itself. The matrix says Skyvern 'Needs Steel for lifecycle management, live viewer, agent logs, and release discipline'; the snapshot says it 'depends on Steel or similar infra for long sessions and observability'; security section says Skyvern 'leans on the browser runtime for credential injection, proxy policy, and approvals.' Skyvern Cloud's own pricing page (verified July 2026) advertises native CAPTCHA solving, proxy networks with geo-targeting, 2FA/TOTP handling, and 'full audit trail' / 'full observability' for every run, and is self-hostable via Docker Compose.
  → *Fix:* Rewrite to the real differentiator. Replace 'Needs Steel for lifecycle management, live viewer, agent logs, and release discipline' with: 'Ships its own managed cloud with CAPTCHA, proxies, and audit trail; Steel's edge is framework-agnostic browser infrastructure (CDP + any SDK) and measurable cold-start lifecycle, not planner-plus-infra bundling.' Keep the legitimate point that Skyvern is opinionated (Playwright-compatible) where Steel is neutral.
- (HIGH) Broken internal link to the benchmark: '[remote browser benchmark](../20-29%20Content/20%20Articles/remote-browser-benchmark.md)'. The path is URL-encoded (%20), follows a directory structure ('20-29 Content/20 Articles/') that does not exist in this repo, and no file named *benchmark* exists anywhere under content/.
  → *Fix:* Link to the canonical external post, which exists and resolves: 'Reproduce the [remote browser benchmark](https://steel.dev/blog/remote-browser-benchmark) to verify lifecycle gains...' (verified in steel.dev sitemap; raw code at https://github.com/steel-dev/browserbench).
- (MEDIUM) Snapshot table says 'sub-second session starts (0.89 s average lifecycle)'. The 0.89s figure is the FULL create->connect->goto->release loop, not the session-start (create) time alone. Conflating 'session start' with 'full lifecycle' overstates the create latency claim.
  → *Fix:* In the snapshot, write: 'sub-second lifecycle (0.89 s avg create->connect->goto->release, 1.09 s p95)' and drop the word 'starts', or say 'sub-second end-to-end browser cycles'.
- (MEDIUM) 'Managed proxies, stealth fingerprints, and CAPTCHAs API handle bot defenses in cloud plans' implies stealth is available across cloud plans. Steel's pricing table lists 'Stealth Browser' as an Enterprise-only feature (dashes for Launch and Scale). CAPTCHA solving and proxies are available on Launch/Scale (metered, with a $10 deposit on Launch), but the dedicated Stealth Browser product is not.
  → *Fix:* Split the capabilities: 'CAPTCHA solving and Steel-provided proxies on all paid plans; the dedicated Stealth Browser fingerprint on Enterprise.' Note the session-level stealthConfig option exists for tuning on any plan.


**Claim checks** (verified verdict shown)
- [ACCURATE] · competitor · Skyvern ... high WebVoyager performance (85.85 percent)
  → Add light attribution: 'high WebVoyager performance (85.85 percent, per Skyvern's own eval)' so the reader knows the source.
  src: https://www.skyvern.com/blog/skyvern-2-0-state-of-the-art-web-navigation-with-85-8-on-webvoyager-eval/ · https://github.com/Skyvern-AI/skyvern
- [ACCURATE] · statistic · Steel ... sub-second session starts (0.89 s average lifecycle) ... 1.09 second p95 from the create -> connect -> goto -> release loop
  → Keep the body wording; in the snapshot change 'sub-second session starts' to 'sub-second lifecycle'.
  src: https://steel.dev/blog/remote-browser-benchmark · https://github.com/steel-dev/browserbench
- [NEEDS-SOFTENING] · steel-product · Steel ... 24 hour sessions / 24 hour runs / 24 hour session limit  *(adversarially verified)*
  → Qualify every occurrence with the tier breakdown. For table cells (matrix, snapshot, trade-offs): replace "24 hour sessions" / "24 hour runs" / "24 hour session limit" with "Up to 24h (Enterprise); 1h (Scale); 15 min (Launch)". For the lede narrative: replace with "Steel sessions run up to 24 hours on Enterprise plans (Launch caps at 15 minutes, Scale at 1 hour)." This keeps the accurate 24h figure while disclosing that it is an Enterprise-tier limit, not a general capability.
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/llms.txt
- [CONFIRMED-INACCURATE] · steel-product · REST API plus Node and Python SDKs expose sessions, Profiles, Credentials, Files, and Quick Actions  *(adversarially verified)*
  → Replace the Steel cell in the "Implementation surface" row. Original: "REST API plus Node and Python SDKs expose sessions, Profiles, Credentials, Files, and Quick Actions". Replacement: "REST API plus Node and Python SDKs expose sessions, Profiles, Credentials, Files, and Extensions" (the Extensions API is a verified Steel surface; alternately use "Embeds"). Do not use the reviewer's suggested "/scrape, /screenshot, /pdf" — those endpoints are not verified for Steel and /screenshot is attributed to Browserless elsewhere in the corpus.
  src: file:///Users/nikola/dev/steel/llms-steel-dev/public/llms-full.txt · file:///Users/nikola/dev/steel/llms-steel-dev/content/articles/skyvern-vs-steel-vs-rpa.md
- [CONFIRMED-INACCURATE] · competitor · Skyvern ... Needs Steel for lifecycle management, live viewer, agent logs, and release discipline / depends on Steel or similar infra for long sessions and observability  *(adversarially verified)*
  → Rewrite the two Skyvern cells to credit Skyvern's native observability/audit trail and narrow Steel's edge to its genuine differentiators. (1) Best-fit snapshot, Skyvern red flag — replace "Needs clean prompts, reliable browser backing, and still depends on Steel or similar infra for long sessions and observability" WITH "Needs clean prompts and reliable browser backing; Skyvern ships its own audit trail and observability, so Steel only adds value if you want a live session viewer, MP4/HLS replay exports, and 24 hour session lifecycle primitives". (2) Comparison matrix, Runtime control, Skyvern — replace "Depends on paired infra; needs Steel for lifecycle management, live viewer, agent logs, and release discipline" WITH "Owns workflow run management (webhooks, event streaming, audit trail, run summaries) and is self-hostable; pair with Steel if you want a live session viewer, MP4/HLS replay, and explicit 24 hour session lifecycle primitives". (3) Evidence section (line 58) — replace "Skyvern inherits whatever evidence surface the browser layer provides" WITH "Skyvern provides its own run summaries and audit trail per execution; Steel layers in a live viewer, MP4/HLS replay, and Files export for ops-grade evidence". (4) Trade-offs table, Evidence row, Skyvern — replace "Borrowed from paired browser runtime; limited on its own" WITH "Native audit trail and run summaries; Steel adds live viewer, replay, and Files for deeper debugging". Leave Steel-column and RPA-column claims unchanged.
  src: https://www.skyvern.com/ · https://www.skyvern.com/pricing
- [NEEDS-SOFTENING] · steel-product · Managed proxies, stealth fingerprints, and CAPTCHAs API handle bot defenses in cloud plans  *(adversarially verified)*
  → Replace with: "CAPTCHA-solving API and managed proxies handle bot defenses on Launch (+$10 deposit) and Scale; the dedicated Stealth Browser is Enterprise-only"
  src: https://docs.steel.dev/llms.mdx/overview/pricinglimits · https://docs.steel.dev/llms.mdx/overview/stealth/captcha-solving
- [ACCURATE] · steel-product · explicit `sessions.release()`
  src: https://docs.steel.dev/llms.txt
- [ACCURATE] · competitor · Skyvern ... TypeScript and Python SDKs, REST API, and open-source runtime
  src: https://github.com/Skyvern-AI/skyvern
- [ACCURATE] · competitor · Skyvern's computer vision stack reads rendered pages ... computer vision plus LLM planner interprets unseen UIs
  src: https://github.com/Skyvern-AI/skyvern · https://www.skyvern.com/blog/skyvern-2-0-state-of-the-art-web-navigation-with-85-8-on-webvoyager-eval/
- [ACCURATE] · steel-product · Steel ... MP4 or HLS replay / MP4/HLS exports
  src: https://docs.steel.dev/llms-full.txt
- [NEEDS-SOFTENING] · steel-pricing · Steel prices by concurrent sessions, so your marginal cost is predictable browser minutes  *(adversarially verified)*
  → Replace: "Steel prices by concurrent sessions, so your marginal cost is predictable browser minutes" with: "Steel meteres usage by the browser-minute (browser hours at $0.10/hr on Launch and $0.08/hr on Scale, rounded up to the minute), plus proxy bandwidth, CAPTCHA solves, and Tools calls — so your marginal cost is predictable browser time, not a per-seat or per-bot license." (Concurrency caps of 10/100/1,000+ on Launch/Scale/Enterprise are plan limits, not a billing axis, and should not be described as "pricing.")
  src: https://docs.steel.dev/overview/pricinglimits · https://steel.dev/pricing
- [NEEDS-SOFTENING] · steel-product · Steel Browser (self-host) or Steel Cloud (managed) with same API surface for gradual rollout  *(adversarially verified)*
  → In content/articles/skyvern-vs-steel-vs-rpa.md, replace the Comparison matrix Deployment cell (line 48) text "Choice of Steel Browser (self-host) or Steel Cloud (managed) with same API surface for gradual rollout" with: "Choice of Steel Browser (self-host) or Steel Cloud (managed) sharing the same core session model; swap a base URL to graduate from local to Cloud (Credentials, Files, Captchas, managed proxies, and multi-region are Cloud-only)". Also consider tightening line 77 ("start self-hosted (Steel Browser) for data locality then burst into Steel Cloud without rewriting code") to "without rewriting session code" to avoid implying managed surfaces carry over.
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud · https://docs.steel.dev/overview/self-hosting/docker
- [ACCURATE] · steel-product · Steel ... Files retention on every managed plan
  src: https://steel.dev/pricing


**Top improvements**
- (HIGH) Reframe the Steel-vs-Skyvern relationship from 'Skyvern needs Steel' to 'Skyvern is an opinionated planner; Steel is neutral CDP infrastructure.' Skyvern Cloud is a legitimate competitor that bundles CAPTCHA/proxy/observability, so the current framing is both inaccurate and the kind of claim competitors flag. Lead with Steel's real edge: framework-agnostic CDP plus measurable cold-start lifecycle. — Verified against skyvern.com/pricing (July 2026): Skyvern Cloud ships its own anti-bot, proxies, 2FA, and audit trail. The dependency framing is the article's biggest accuracy and reputation risk.
- (HIGH) Add tier precision throughout. Steel's capabilities are strongly tier-gated: 24h sessions, Stealth Browser, reserved pools, and SLAs are Enterprise; Launch is 15-min sessions / 10 concurrent / 60 RPM; Scale is 1-hr / 100 concurrent / 600 RPM. State this once in a small table or footnote so '24 hour sessions' and 'managed stealth' stop reading as blanket features. — Verified against Steel pricing table (Last Edit June 30, 2026). Tier-gating affects every plan-sensitive claim and currently makes Launch/Scale promises the product cannot keep.
- (HIGH) Remove 'Quick Actions' from the Steel implementation-surface cell and replace with a real surface (Browser Tools: scrape/screenshot/pdf, plus Embeds). — 0 occurrences in Steel docs and pricing; an invented API in a vendor comparison.


**Supporting material to add**
- Reproducible benchmark source code and raw results for the 0.89s avg / 1.09s p95 lifecycle claim. Citing the repo (not just the blog post) makes the number verifiable and defensible against 'self-reported' pushback.  _[where: Evidence, observability, and restart speed section, where the 0.89s/1.09s figures first appear]_  (https://github.com/steel-dev/browserbench)
- Steel's current pricing/limits table (Launch $0+usage, Scale $250+usage, Enterprise custom; concurrency 10/100/1,000+; browser hours $0.10/$0.08; session caps 15min/1hr/24hr; RPS 60/600/custom). Lets the article state tier-gated facts precisely rather than as blanket claims.  _[where: Best-fit snapshot and Pricing/scaling row of the matrix]_  (https://docs.steel.dev/llms-full.txt)
- Skyvern's own eval results page for the 85.85% WebVoyager figure, giving a primary-source citation rather than a marketing echo.  _[where: Best-fit snapshot, Skyvern row, where 85.85% is cited]_  (https://eval.skyvern.com)
- Skyvern Cloud's own feature set (native CAPTCHA solving, proxy networks with country/state/ZIP geo-targeting, 2FA/TOTP, and 'full audit trail' / 'full observability' per run). This is the counter-evidence that should reframe the article's 'Skyvern needs Steel' claims.  _[where: Comparison matrix (Runtime control and Anti-bot rows for Skyvern) and the Skyvern fits when section]_  (https://www.skyvern.com/pricing)
- Steel's CDP connection contract (wss://connect.steel.dev?apiKey=...&sessionId=...) and the framework-neutral design (any CDP client — Playwright, Puppeteer, Selenium, chromedp, chromiumoxide — drives the same session). This is Steel's actual, defensible differentiator versus Skyvern's Playwright-compatible opinionation, and deserves to be stated explicitly.  _[where: Comparison matrix, Workflow scope / Runtime control rows (Steel column); and the Steel fits when section]_  (https://docs.steel.dev/llms.txt)


**Broken / malformed links**
- `../20-29%20Content/20%20Articles/remote-browser-benchmark.md` — Malformed and points nowhere: the path is URL-encoded (%20), follows a '20-29 Content/20 Articles/' directory structure that does not exist in this repo, and no file matching *benchmark* exists anywhere under content/. The link sits in the 'Next steps' CTA immediately after the article cites the 0.89s/1.09s benchmark as headline evidence. → Replace with the canonical external post, which exists in steel.dev's sitemap and resolves: https://steel.dev/blog/remote-browser-benchmark (optionally add the reproducible code link https://github.com/steel-dev/browserbench). All three @/glossary/ links (profiles.md, proxies.md, steel-cloud.md) were verified to exist in content/glossary/ and are fine.


---


### stagehand-with-steel — readiness 4/10


**Title:** Stagehand With Steel


**Priority issues**
- (BLOCKER) Both code samples target Stagehand v2, but Stagehand is on v3 (current in 2026). TS uses stagehand.page.goto/extract and modelClientOptions; the Python uses StagehandConfig + stagehand.page.extract. v3 uses stagehand.act/extract/observe at the top level, const page = stagehand.context.pages()[0] for goto, and model: { modelName, apiKey }. The Python v3 SDK is a different client (AsyncStagehand/Stagehand with client.sessions.act/extract). The snippets will not run as written against current @browserbasehq/stagehand.
  → *Fix:* Regenerate both samples from Steel's official Stagehand page (https://docs.steel.dev/integrations/stagehand) and the /cookbook/stagehand recipe, then run them. TS fix (key lines): replace `modelClientOptions: { apiKey: process.env.OPENAI_API_KEY }` with `model: { modelName: "openai/gpt-5", apiKey: process.env.OPENAI_API_KEY }`; insert `const page = stagehand.context.pages()[0];` after `await stagehand.init();`; change `await stagehand.page.goto(...)` to `await page.goto(...)`; change `await stagehand.page.extract({ instruction, schema })` to `await stagehand.extract("extract the first 5 titles and ranks", StoriesSchema)`. For Python, replace the StagehandConfig/Stagehand(stagehand.page.extract) block with the current AsyncStagehand client pattern from https://docs.stagehand.dev/v3/migrations/python and verify it executes before publishing.
- (HIGH) `sessionTimeout` is not a real Steel sessions.create parameter. The prose (line 60) says `client.sessions.create({ useProxy, solveCaptcha, sessionTimeout })`.
  → *Fix:* Replace `sessionTimeout` with `timeout` everywhere and state the unit. Corrected prose: `client.sessions.create({ useProxy, solveCaptcha, timeout })` — `timeout` is in milliseconds (e.g. 600000 for 10 minutes).
- (HIGH) "Managed sessions that can run up to 24 hours" (line 42) overstates the general capability. 24h is the Enterprise ceiling only.
  → *Fix:* Change to: "Managed sessions that can run up to your plan's session ceiling (15 min on Launch, 1 hour on Scale, up to 24 hours on Enterprise) and preserve auth until you call release()."
- (MEDIUM) The article repeatedly frames Stagehand as OpenAI-exclusive: "Your OpenAI API key, which Stagehand still uses for planning" (line 35), "Stagehand still consumes your OpenAI quota" (line 156), "Stagehand still calls OpenAI-hosted models" (line 167).
  → *Fix:* Soften to provider-neutral language. Line 35: "Your model-provider API key (OpenAI by default), which Stagehand still uses for planning." Line 156: "Stagehand still consumes your model-provider tokens (OpenAI/Anthropic/Google); Steel does not change LLM spend." Line 167: "Runs that must stay fully offline; Stagehand still calls a cloud LLM provider."
- (MEDIUM) "Steel Cloud plan limits in the hundreds" (line 45) is imprecise.
  → *Fix:* Replace with: "Concurrency from 10 sessions on Launch up to 1,000+ on Enterprise, enforced with SDK-level release discipline."
- (LOW) "Steel Quick Actions may be simpler" (line 168) uses terminology that does not appear in current Steel docs.
  → *Fix:* Replace 'Steel Quick Actions' with 'Steel Browser Tools (/scrape, /screenshot, /pdf) may be simpler.'
- (LOW) "Sub-second Steel Cloud sessions" (line 41) is an uncited performance claim.
  → *Fix:* Either cite a Steel benchmark with a link, or soften to: "Fast cloud-session startup exposed over CDP with session.websocketUrl."


**Claim checks** (verified verdict shown)
- [CONFIRMED-INACCURATE] · steel-product · Use the Steel SDK to call `client.sessions.create({ useProxy, solveCaptcha, sessionTimeout })`  *(adversarially verified)*
  → Replace `sessionTimeout` with `timeout` (the real field, in milliseconds) and add a brief units note. Exact replacement for the line 60 phrase: change `client.sessions.create({ useProxy, solveCaptcha, sessionTimeout })` to `client.sessions.create({ useProxy, solveCaptcha, timeout })` where timeout is in milliseconds (e.g. 600000 for 10 minutes). Full corrected sentence: "2. Use the Steel SDK (`steel-sdk` for Node, `steel` for Python) to call `client.sessions.create({ useProxy, solveCaptcha, timeout })` — `timeout` is in milliseconds, e.g. `600000` for 10 minutes — and capture the returned `session.sessionViewerUrl` for debugging."
  src: https://docs.steel.dev/overview/sessions-api/session-lifecycle · https://docs.steel.dev/integrations/stagehand
- [CONFIRMED-INACCURATE] · third-party · TS code: `modelClientOptions: { apiKey: process.env.OPENAI_API_KEY }` and `stagehand.page.extract({ instruction, schema })` / `stagehand.page.goto(...)`  *(adversarially verified)*
  → Replace the entire TypeScript example block (the `const stagehand = new Stagehand({...})` ... `console.log(result.stories)` portion) with a v3-correct version matching Steel's integration page and the Stagehand README/quickstart:

```ts
import Steel from "steel-sdk";
import { Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod";
import "dotenv/config";

const StoriesSchema = z.object({
  stories: z.array(z.object({ title: z.string(), rank: z.number() }))
});

async function run() {
  const client = new Steel({ steelAPIKey: process.env.STEEL_API_KEY });
  const session = await client.sessions.create({ useProxy: true, solveCaptcha: true });

  const stagehand = new Stagehand({
    env: "LOCAL",
    model: { modelName: "openai/gpt-5", apiKey: process.env.OPENAI_API_KEY },
    localBrowserLaunchOptions: {
      cdpUrl: `${session.websocketUrl}&apiKey=${process.env.STEEL_API_KEY}`
    }
  });

  await stagehand.init();
  const page = stagehand.context.pages()[0];
  await page.goto("https://news.ycombinator.com");
  const result = await stagehand.extract(
    "extract the first 5 titles and ranks",
    StoriesSchema
  );
  console.log(result.stories);

  await stagehand.close();
  await client.sessions.release(session.id);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

Secondary (same v2→v3 drift also appears in the prose and must be fixed for consistency, though outside the flagged line range): the lede, the "What stays the same" list (`.page.extract()`, `.page.act()`), the "Where Stagehand plans and Steel executes" table (`.page.act()`, `.goto()`), and "Minimal integration path" steps 4-5 (`.page.goto()`, `.page.extract()`, `.page.act()`) all reference the v2 `.page.*` API. Replace `.page.extract()` → `stagehand.extract()`, `.page.act()` → `stagehand.act()`, and `.page.goto()` → `page.goto()` (after `const page = stagehand.context.pages()[0]`). The Python example (`.page.goto`/`.page.extract`) has the same issue and needs the analogous fix.
  src: https://raw.githubusercontent.com/browserbase/stagehand/main/README.md · https://docs.steel.dev/integrations/stagehand
- [CONFIRMED-INACCURATE] · third-party · Python code: `from stagehand import StagehandConfig, Stagehand` then `Stagehand(config)` with `.page.goto()` / `.page.extract(..., schema=Stories)`  *(adversarially verified)*
  → Replace the Python code block (content/articles/stagehand-with-steel.md, lines 110-153) with the v3 API. Replace everything from `### Python` through the closing ``` with:

### Python
```python
import asyncio, os
from dotenv import load_dotenv
from playwright.async_api import async_playwright
from stagehand import AsyncStagehand

load_dotenv()

async def run():
    # v3 Stagehand is a pure API client ("Bring Your Own Browser").
    # You pass API keys directly — there is no StagehandConfig.
    async with AsyncStagehand(
        browserbase_api_key=os.getenv("BROWSERBASE_API_KEY"),
        model_api_key=os.getenv("MODEL_API_KEY"),
    ) as client:
        # sessions.start() provisions a browser and returns its cdp_url.
        start = await client.sessions.start(model_name="gpt-4o-mini")
        session_id = start.data.session_id
        cdp_url = start.data.cdp_url

        # Connect Playwright to that browser over CDP.
        async with async_playwright() as p:
            browser = await p.chromium.connect_over_cdp(cdp_url)
            context = browser.contexts[0]
            page = context.pages[0] if context.pages else await context.new_page()

            # Navigation and extraction go through client.sessions.*, not .page.
            await client.sessions.navigate(session_id, url="https://news.ycombinator.com")
            await page.wait_for_load_state("domcontentloaded")

            extract_stream = await client.sessions.extract(
                session_id,
                instruction="extract the first 5 story titles and ranks",
                schema={
                    "type": "object",
                    "properties": {
                        "stories": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "title": {"type": "string"},
                                    "rank": {"type": "integer"},
                                },
                            },
                        }
                    },
                },
                stream_response=True,
                x_stream_response="true",
            )
            async for event in extract_stream:
                pass  # consume the SSE stream

        await client.sessions.end(session_id)

if __name__ == "__main__":
    asyncio.run(run())
```

Also update the surrounding prose and the Node section's framing: the v2 integration (`local_browser_launch_options={"cdp_url": session.websocket_url}` / pointing Stagehand's own browser at Steel) is no longer valid. v3 returns its own cdp_url from a Stagehand-managed session; the authors should either (a) reframe the article around v3's BYOB model, or (b) pin to a v2 Stagehand SDK version and say so explicitly. As written, the code will not import or run against the current `stagehand` PyPI package (3.21.0).
  src: https://raw.githubusercontent.com/browserbase/stagehand-python/main/README.md · https://pypi.org/pypi/stagehand/json
- [ACCURATE] · third-party · Pass Stagehand a `cdpUrl` built from `session.websocketUrl` plus `&apiKey=${STEEL_API_KEY}` while leaving `env: "LOCAL"`
  src: https://docs.steel.dev/llms.mdx/integrations/stagehand
- [ACCURATE] · steel-product · `client.sessions.release(session.id)` frees the slot
  src: https://docs.steel.dev/llms.mdx/overview/sessions-api/session-lifecycle
- [NEEDS-SOFTENING] · steel-product · Managed sessions that can run up to 24 hours and preserve auth until you call release()  *(adversarially verified)*
  → On line 42 of /Users/nikola/dev/steel/llms-steel-dev/content/articles/stagehand-with-steel.md, replace the cell "Managed sessions that can run up to 24 hours and preserve auth until you call `release()`" with "Managed sessions that run from 15 minutes (Launch) up to 24 hours (Enterprise), preserving auth until you call `release()`"
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/overview/sessions-api/session-lifecycle
- [ACCURATE] · steel-product · Steel's managed browsers inherit your session timeout (default 5 minutes)
  src: https://docs.steel.dev/llms.mdx/overview/sessions-api/session-lifecycle
- [CONFIRMED-INACCURATE] · steel-pricing · Steel Cloud plan limits in the hundreds  *(adversarially verified)*
  → Edit line 45 of /Users/nikola/dev/steel/llms-steel-dev/content/articles/stagehand-with-steel.md. Replace the table cell "Steel Cloud plan limits in the hundreds with SDK-level release discipline" with "Plan-based concurrent browser sessions (10 on Launch up to 1,000+ on Enterprise) with SDK-level release discipline". Exact replacement: old: "Steel Cloud plan limits in the hundreds with SDK-level release discipline" -> new: "Plan-based concurrent browser sessions — 10 on Launch, 100 on Scale, 1,000+ on Enterprise — with SDK-level release discipline".
  src: https://steel.dev/#pricing · https://docs.steel.dev/overview/pricinglimits
- [ACCURATE] · steel-product · CAPTCHA solving, proxies, and multi-region runs require Steel Cloud; Steel Local mirrors the integration pattern but without those managed surfaces
  → Optionally clarify: managed proxies/multi-region need Cloud; Steel Local still supports bring-your-own-proxy.
  src: https://docs.steel.dev/llms.mdx/overview/self-hosting/steel-local-vs-steel-cloud
- [CONFIRMED-INACCURATE] · third-party · Stagehand still uses OpenAI for planning / consumes your OpenAI quota / calls OpenAI-hosted models  *(adversarially verified)*
  → Edit all three locations to make the provider optional rather than OpenAI-exclusive. LINE 35 — replace "- Your OpenAI API key, which Stagehand still uses for planning." with "- Your model provider's API key (OpenAI in the example below). Stagehand works with any provider — Google Gemini, Anthropic, Azure, Ollama, and more — so use whichever key your run configures.". LINE 156 — replace "- Stagehand still consumes your OpenAI quota; Steel does not change the LLM spend." with "- Stagehand still consumes your chosen model provider's quota (OpenAI, Anthropic, Google, or whichever you configure); Steel does not change the LLM spend.". LINE 167 — replace "- Runs that must stay fully offline; Stagehand still calls OpenAI-hosted models." with "- Runs that must stay fully offline; Steel Cloud is a remote managed runtime, so air-gapped workloads can't reach it. (Stagehand itself can drive local models like Ollama, but the Steel session is hosted.)". Optionally also rename the example env var comment or add a note that gpt-4o-mini is one of many supported models.
  src: https://docs.stagehand.dev/v3/configuration/models.md · https://docs.stagehand.dev/llms.txt
- [ACCURATE] · steel-product · `session.sessionViewerUrl` plus live WebRTC viewer and HLS replay
  src: https://docs.steel.dev/llms.mdx/overview/sessions-api/embed-sessions · https://docs.steel.dev/llms.txt
- [STALE] · steel-product · Steel Quick Actions may be simpler for headless snapshots / static scraping  *(adversarially verified)*
  → Replace "Steel Quick Actions may be simpler" with "Steel Browser Tools may be simpler". Exact edit on line 168 — change from: "- Workloads that only need headless snapshots or static scraping; Steel Quick Actions may be simpler." to: "- Workloads that only need headless snapshots or static scraping; Steel Browser Tools may be simpler."
  src: https://docs.steel.dev/llms.txt · https://docs.steel.dev/overview/browser-tools/overview
- [NEEDS-SOFTENING] · statistic · Sub-second Steel Cloud sessions exposed over CDP  *(adversarially verified)*
  → Replace the cell text "Sub-second Steel Cloud sessions exposed over CDP with `session.websocketUrl`" with: "On-demand Steel Cloud sessions created via `sessions.create()` and exposed over CDP through `session.websocketUrl`". This keeps the verifiable, sourced contrast against local-Chrome warmup while removing the unsubstantiated sub-second timing claim.
  src: https://docs.steel.dev/llms.mdx/integrations/stagehand · https://docs.steel.dev/llms.mdx/cookbook/stagehand
- [ACCURATE] · steel-product · `steel-sdk` for Node, `steel` for Python
  src: https://docs.steel.dev/llms.txt


**Top improvements**
- (HIGH) Rewrite both code samples against Stagehand v3 (verified July 2026) and actually execute them before publishing. Pull the canonical TS snippet from Steel's integration page (https://docs.steel.dev/integrations/stagehand) and the Python snippet from the v3 migration guide. — Non-running code in a reference article is the highest-trust-destroying defect; both samples currently use the v2 API surface.
- (HIGH) Add an explicit outbound link to the Steel + Stagehand integration page and cookbook recipe, plus the Stagehand v3 docs, in a 'References' or 'Next step' list. The article currently has zero external links. — Answer-engine and human readers benefit from primary sources; linking them also strengthens E-E-A-T signals and lets readers self-verify the v3 patterns.
- (MEDIUM) Qualify all plan-dependent Steel capabilities (session length, concurrency) with the Launch/Scale/Enterprise breakdown rather than stating the Enterprise ceiling as the default. — Per Steel's pricing page (verified June 30, 2026), most readers are on Launch (15-min cap, 10 sessions) or Scale (1-hr cap, 100 sessions); unqualified 24h/'hundreds' claims set wrong expectations.


**Supporting material to add**
- Steel's official Stagehand integration page — the authoritative primary source for this exact pairing. It confirms env: "LOCAL", localBrowserLaunchOptions.cdpUrl from `${session.websocketUrl}&apiKey=`, and the v3 `model: { modelName, apiKey }` config.  _[where: Reference it explicitly in 'Minimal integration path' and link it in 'Next step'; use it as the single source of truth for both code samples.]_  (https://docs.steel.dev/integrations/stagehand)
- Steel Session Lifecycle doc — the primary source for the 5-minute default timeout, the 24h plan-dependent ceiling, the `timeout` (ms) and `inactivityTimeout` params, and sessions.release/releaseAll.  _[where: Cite in the 'What Steel adds' table footnote and in 'Trade-offs and constraints' to ground the timeout and 24h statements.]_  (https://docs.steel.dev/overview/sessions-api/session-lifecycle)
- Steel Pricing/Limits table (verified June 30, 2026) — Launch/Scale/Enterprise concurrency (10/100/1,000+), max session time (15 min/1 hr/24 hr), RPM (60/600/custom), retention (7/14/custom days), and metered rates ($0.10/$0.08 per browser-hour, captcha $3/$1 per 1k).  _[where: Use it to make line 45 ('plan limits in the hundreds') and line 42 ('24 hours') precise and citable; optionally add a one-line pricing pointer.]_  (https://docs.steel.dev/overview/pricinglimits)
- Stagehand v3 primitives (act/extract/observe/agent) and model config — primary source showing the current top-level calling convention and multi-provider support.  _[where: Drive the corrected TS sample; add a one-line note that Stagehand supports OpenAI, Anthropic, and Google, replacing the OpenAI-only framing.]_  (https://docs.stagehand.dev/first-steps/introduction)
- Stagehand v2-to-v3 migration guides (TypeScript and Python) — document exactly what changed (stagehand.page -> stagehand.context.pages()[0] + top-level act/extract; Python StagehandConfig -> AsyncStagehand client).  _[where: Use as the reference when rewriting both code samples; link the Python migration guide from the Python snippet.]_  (https://docs.stagehand.dev/migration-guides/migrate-typescript-v2-to-v3)



---


### steel-cli-for-browser-workflows — readiness 6/10


**Title:** Steel CLI for Browser Workflows


**Priority issues**
- (BLOCKER) Wrong skill-install command: the article says `npx skills add steel-dev/cli --skill steel-browser`, but the docs and npm README both use `npx skills add steel-dev/skills --skill steel-browser` (the skills live in the `steel-dev/skills` repo, not `steel-dev/cli`).
  → *Fix:* In step 6, replace: `npx skills add steel-dev/cli --skill steel-browser` with: `npx skills add steel-dev/skills --skill steel-browser`. (Verified against https://docs.steel.dev/overview/steel-cli and https://github.com/steel-dev/skills, July 2026.)
- (HIGH) Install command is the deprecated legacy path: step 1 uses `npm i -g @steel-dev/cli`, but the @steel-dev/cli README (verified July 2026) explicitly frames `npm i -g @steel-dev/cli` as a previous method and recommends `curl -LsSf https://setup.steel.dev | sh` (or GitHub Releases) for new installs.
  → *Fix:* Replace step 1 with the current installer:
```bash
curl -LsSf https://setup.steel.dev | sh
steel login
```
Optionally add: '(If you previously installed via npm, `npm update -g @steel-dev/cli` still works and migrates you to the native binary.)'
- (HIGH) `steel run browser-use --task ...` is presented as a real command in the 'Patterns that make runs faster' table, but it is not in the generated CLI reference (docs/cli-reference.md), which has no `run` section and no `--task` flag. The docs only say `run` lets you 'run templates instantly'; `browser-use --task` is not a documented invocation.
  → *Fix:* Replace the table row's example with the verified scaffold command: `steel forge playwright --name intake-bot`, and drop the `steel run browser-use --task ...` fragment. If you want to keep `run`, verify the exact syntax with `steel run --help` first and cite it.
- (MEDIUM) 'Steel Cloud sessions start in under 1 second' is stated twice (Short answer and Implementation path) but is not supported anywhere in Steel's own docs (sessions-api page and steel.dev homepage make no such claim; they only say 'spin up on-demand sessions').
  → *Fix:* Either (a) cite a public Steel benchmark/report with a resolvable link and label it self-reported, or (b) soften both mentions to: 'Steel Cloud sessions start in about a second' / 'boot quickly'. Remove the precise 'under 1 second' figure unless you can link a source.
- (MEDIUM) 'Steel Cloud sessions ... inherit managed stealth' implies stealth is on by default in Cloud, but the CLI reference lists `--stealth` as an explicit opt-in flag ('Apply stealth preset on new sessions'). The default-start behavior is not documented as stealth-on.
  → *Fix:* Reword to: 'Steel Cloud sessions start fast; pass `--stealth` to enable Steel's managed stealth preset (humanized interactions plus auto-CAPTCHA solving).'


**Claim checks** (verified verdict shown)
- [STALE] · steel-product · Install with `npm i -g @steel-dev/cli`  *(adversarially verified)*
  → Replace "Install with `npm i -g @steel-dev/cli`" with "Install with `curl -fsS https://setup.steel.dev | sh`". This matches Steel's current native binary installer as documented in the official README and the npm package's own deprecation notice.
  src: https://registry.npmjs.org/@steel-dev/cli · https://github.com/steel-dev/cli
- [CONFIRMED-INACCURATE] · steel-product · Install the steel-browser skill via `npx skills add steel-dev/cli --skill steel-browser`  *(adversarially verified)*
  → Replace `npx skills add steel-dev/cli --skill steel-browser` with `npx skills add steel-dev/skills --skill steel-browser`.
  src: https://github.com/steel-dev/skills · https://raw.githubusercontent.com/steel-dev/skills/main/README.md
- [CONFIRMED-INACCURATE] · steel-product · `steel run browser-use --task ...` scaffolds a workflow  *(adversarially verified)*
  → Replace the bogus invocation with the real scaffolding command. In content/articles/steel-cli-for-browser-workflows.md (line 84, "Patterns that make runs faster" table), change: `steel forge playwright --name intake-bot` and `steel run browser-use --task ...` scaffold the workflow in minutes -> TO -> `steel forge playwright --name intake-bot` and `steel forge browser-use --name research-bot` scaffold the workflow in minutes
  src: https://github.com/steel-dev/cli/blob/main/docs/cli-reference.md · https://github.com/steel-dev/cli/blob/main/README.md
- [ACCURATE] · steel-product · `steel browser start` accepts `--stealth`, `--session-solve-captcha`, `--local`, `--api-url`, `-s/--session`
  src: https://raw.githubusercontent.com/steel-dev/cli/main/docs/cli-reference.md
- [ACCURATE] · steel-product · `steel screenshot https://example.com/checkout --full-page` and `steel forge playwright --name intake-bot`
  src: https://raw.githubusercontent.com/steel-dev/cli/main/docs/cli-reference.md · https://docs.steel.dev/overview/steel-cli
- [ACCURATE] · steel-product · Passthrough commands (`open`, `fill @e1`, `click @e5`, `wait --load networkidle`) are 'identical to agent-browser syntax'
  src: https://registry.npmjs.org/@steel-dev/cli
- [ACCURATE] · steel-product · `steel browser snapshot -i` captures interactive elements and is the recommended pre-action snapshot
  src: https://raw.githubusercontent.com/steel-dev/cli/main/docs/references/steel-browser-commands.md · https://docs.steel.dev/overview/steel-cli
- [NEEDS-SOFTENING] · statistic · Steel Cloud sessions start in under 1 second  *(adversarially verified)*
  → Soften to match Steel's own wording and acknowledge it as a self-reported average. Replace "Steel Cloud sessions start in under 1 second" with "Steel Cloud sessions start in under one second on average (per Steel's own benchmarks)." This keeps the stat, restores the "on average" qualifier Steel itself uses, and signals it is vendor-reported rather than an independent measurement.
  src: https://steel.dev/ (homepage FAQPage JSON-LD: "How fast is Steel.dev at starting browser sessions?" -> "Under one second on average with no cold-start penalty...") · https://steel.dev/ (competitor-comparison FAQs describing Steel as having "sub-second startup")
- [NEEDS-SOFTENING] · steel-product · Default Cloud sessions 'inherit managed stealth'  *(adversarially verified)*
  → Replace the Default Cloud bullet. Current: "- Default Cloud: do nothing. Steel Cloud sessions start in under 1 second and inherit managed stealth." New: "- Default Cloud: do nothing. Steel Cloud sessions start in under 1 second on Steel's managed cloud; pass `--stealth` to enable the advanced stealth preset Cloud supports (Local only offers limited stealth)." This keeps the accurate point (Cloud default = managed infra, fast start, and Cloud has the advanced stealth capability) while removing the false "stealth is on by default" implication.
  src: https://docs.steel.dev/overview/steel-cli · https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud
- [ACCURATE] · steel-product · Reviewer can share the `connect_url` for approvals during a run
  src: https://docs.steel.dev/overview/steel-cli
- [ACCURATE] · steel-product · Self-hosted target is 'your Steel Browser cluster', addressable via `--api-url https://steel.your-domain.dev/v1`
  src: https://api.github.com/repos/steel-dev/steel-browser · https://registry.npmjs.org/@steel-dev/cli
- [ACCURATE] · steel-product · Steel CLI docs URL is https://docs.steel.dev/overview/steel-cli
  src: https://docs.steel.dev/overview/steel-cli


**Top improvements**
- (HIGH) Fix the three concrete command errors in one pass: skill repo (steel-dev/cli -> steel-dev/skills), install method (npm -> curl installer), and remove/verify `steel run browser-use --task`. These are the items that will actually break for a reader who copies the article. — Copy-paste commands in a getting-started article must work verbatim; the skill-install command currently points at the wrong repo.
- (MEDIUM) Replace both 'under 1 second' mentions with either a cited, labeled benchmark or softer language ('about a second'). Performance numbers are exactly what answer engines quote, and an uncited figure is a liability. — Steel's own docs do not publish this number; the claim is currently unverifiable from primary sources.
- (MEDIUM) Reconcile the stealth framing: the article oscillates between 'inherit managed stealth' (automatic) and 'pass --stealth' (opt-in). Pick one accurate story: stealth is opt-in via --stealth on Cloud, self-host, and local. — The CLI reference documents --stealth as an explicit flag, so implying it is on by default in Cloud is misleading.


**Supporting material to add**
- The @steel-dev/cli README explicitly documents that `steel browser` is backed by the vendored `agent-browser` runtime, with a command-prefix-only migration path. This is the strongest primary citation for the article's core thesis ('the CLI is the workflow contract').  _[where: Short answer / 'Instead of patching wrappers' section]_  (https://registry.npmjs.org/@steel-dev/cli)
- Steel's own CLI reference lists `steel browser stop --all` for stopping all live sessions at once — useful for the teardown/cleanliness point the article makes.  _[where: Implementation path step 5 (Collect artifacts and stop cleanly)]_  (https://raw.githubusercontent.com/steel-dev/cli/main/docs/cli-reference.md)
- The docs overview documents `steel skills install steel-browser`, `steel skills list`, and `steel skills doctor` as the in-CLI way to install and verify skills — more robust than the one-time `npx` command for teams.  _[where: Implementation path step 6 (Automate the ceremony for agents)]_  (https://docs.steel.dev/overview/steel-cli)
- The Sessions API reference (docs.steel.dev/overview/sessions-api) is the authoritative source for the session lifecycle the CLI wraps; linking it grounds the lifecycle claims and helps answer-engine rankings.  _[where: Short answer and/or Next steps]_  (https://docs.steel.dev/overview/sessions-api)



---


