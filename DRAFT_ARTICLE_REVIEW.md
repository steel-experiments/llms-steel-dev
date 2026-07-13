# Steel.dev Draft Article Review

**Scope:** All `draft: true` articles in `content/articles/` (32 total).  

**Method:** One research agent per article (web-researched fact-check against primary sources: docs.steel.dev, competitor sites, framework docs), each flagged claim adversarially re-verified by an independent agent, then a cross-cutting editorial synthesis. Ground-truth link scan run independently in the main loop.  

**Date:** 2026-07-13.  

**Status of this pass:** 20 of 32 articles fully reviewed (260 claims checked, adversarially verified). 12 articles were rate-limited out on the first run and are being re-reviewed on resume; their per-article sections are appended/updated as they land. The systemic findings below are stable.

---


## 0. The one table to fix first — Steel's canonical pricing/limits (per docs.steel.dev/overview/pricinglimits, ed. 2026-06-30)


Roughly half the drafts use **invented/legacy plan names** (Hobby / Starter / Developer / Pro) and fabricated per-tier numbers. The real tiers are **Launch / Scale / Enterprise**:


| Tier | Concurrency | Rate limit | Max session | Retention | Browser | Proxy | CAPTCHA | Base price |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Launch** | 10 | 60 RPM | 15 min | 7 days | $0.10/hr | $10/GB | $3/1k | $0 + usage ($30 one-time credits) |
| **Scale** | 100 | 600 RPM | 1 hour | 14 days | $0.08/hr | $6/GB | $1/1k | $250/mo + usage ($100 credits) |
| **Enterprise** | 1,000+ | custom | up to 24 hr | custom | custom | custom | custom | custom |


Delete everywhere: `$0.05/hr browser`, the `3x overage/burst` mechanism, `$5/GB proxy`, `$4/1k` CAPTCHA, and **"requests per second"** (Steel's limit is **per minute**, RPM). The unqualified **"24-hour sessions"** claim is **Enterprise-only** (Launch = 15 min, Scale = 1 hr).

---


## 1. Executive summary


The 20-article draft set has strong structural bones (consistent glossary linking, clear "fit/non-fit" framing, real Steel API knowledge) but is weighed down by a small number of systemic, self-inflicted accuracy problems that recur across most pieces. The single largest issue is stale or invented Steel pricing/tier vocabulary: roughly half the articles still use legacy or fabricated plan names (Hobby/Starter/Developer/Pro) and wrong per-tier numbers, even though Steel's canonical Pricing/Limits page (docs.steel.dev/overview/pricinglimits, last edited 2026-06-30) lists only three tiers — Launch/Scale/Enterprise. Three second-order Steel-product errors propagate widely: the 24-hour session ceiling is stated as a general capability when it is Enterprise-only; the 5-minute default `timeout` is repeatedly misdescribed as an "idle timer" (the real idle release, `inactivityTimeout`, is off by default); and the 2026 observability feature is called "agent logs" with a nonexistent `/agent-logs` endpoint when it is "Agent Traces" at `/agent-traces`. Beyond pricing, there is a cluster of invented SDK methods and CLI commands (profiles.get, client.sessions.agentLogs, steel.sessions.logs.list, `steel run`, `page.swipe()`, a wrong skills path) and a recurring failure to flag that Credentials, Files, CAPTCHA, and Stealth are Steel Cloud-only surfaces that Steel Local cannot run. On the competitive side, the riskiest claims are an unsubstantiated SOC 2 attestation (browserless-vs-steel), a Skyvern strawman that its own pricing page refutes (skyvern-vs-steel), and two unverifiable named-customer statistics in the public-records lead (Chronicle Legal / Benny). Several computer-use articles also pin stale model IDs (claude-sonnet-4-5, computer_20250124, gemini-2.5). None of these are unfixable, and most reduce to a shared canonical-source sweep; once the pricing table, the session-timeout model, the agent-traces rename, and the fabricated symbols are corrected globally, the bulk of the set moves from "unpublishable" to "credible reference."


---


## 2. Cross-cutting themes


### Stale/invented Steel plan names and per-tier numbers


Steel's canonical pricing page (docs.steel.dev/overview/pricinglimits, last edited 2026-06-30) has exactly three tiers — Launch ($0+usage, 10 concurrent, 60 RPM, 15-min max session, 7-day retention, $0.10/hr browser, $3/1k CAPTCHA, $10/GB proxy), Scale ($250/mo+usage, 100 concurrent, 600 RPM, 1-hr max session, 14-day retention, $0.08/hr, $1/1k CAPTCHA, $6/GB), Enterprise (1,000+ concurrent, custom RPM, up to 24-hr max session, custom retention). Roughly half the drafts instead use legacy/invented names — Hobby, Starter, Developer, Pro — and fabricated numbers (5/20 concurrent, 2-day/24h retention, 30-min caps, $5/GB proxy, $4–$3/1k CAPTCHA, $0.05/hr browser, 'requests per second' instead of per-minute). 'Hobby/Starter/Pro' matches neither current nor even legacy (Starter/Developer/Startup) tiers.



**Affected:** browser-automation-cost-at-scale, browser-automation-audit-trails, scaling-browser-automation-to-hundreds-of-sessions, prompt-injection-and-web-agents, browser-automation-for-public-records-and-compliance, anti-bot-false-positives-for-legit-automation, secure-browser-auth-for-agents, skyvern-vs-steel-vs-steel-vs-rpa, self-hosted-browser-infrastructure-guide, stagehand-with-steel


### Unqualified '24-hour session' ceiling


The 24h max is Enterprise-only (Launch=15 min, Scale=1 hr). The unqualified claim appears in intros, short answers, comparison tables, and trade-offs across most articles, overstating the capability Launch/Scale readers actually get. This is the single most-repeated factual overstatement in the set.



**Affected:** claude-computer-use-with-steel, gemini-computer-use-with-steel, prompt-injection-and-web-agents, secure-browser-auth-for-agents, stagehand-with-steel, skyvern-vs-steel-vs-steel-vs-rpa, anti-bot-false-positives-for-legit-automation, browser-automation-cost-at-scale, browser-automation-for-public-records-and-compliance, scaling-browser-automation-to-hundreds-of-sessions


### `timeout` (5-min hard lifetime) conflated with `inactivityTimeout` (idle release, off by default)


Multiple articles describe the 5-minute default as an 'idle timer' and then build heartbeat advice on top of it. In Steel, 5 min is the hard `timeout` lifetime (elapses regardless of activity, billable even when idle); idle-based release is a separate, opt-in `inactivityTimeout`. The result is backwards control guidance — readers think they're protected from idle billing when they are not, and heartbeat recipes (e.g. page.waitForTimeout(0)) are no-ops on a deprecated API.



**Affected:** prompt-injection-and-web-agents, secure-browser-auth-for-agents, embed-live-and-past-browser-sessions, scaling-browser-automation-to-hundreds-of-sessions


### 'Agent logs' / `/agent-logs` — wrong name and wrong endpoint


The 2026 observability feature (published 2026-05-22) is 'Agent Traces' at GET /v1/sessions/{id}/agent-traces, returning a timestamped browser-activity timeline (click/input/navigate/scroll/drag/error) synced to video. Several articles call it 'agent logs,' cite a nonexistent /agent-logs endpoint (404), and reference SDK methods that do not exist (client.sessions.agentLogs, steel.sessions.logs.list). Some also misdescribe content as 'every prompt + DOM diff' when it is browser activity, not model prompts.



**Affected:** browser-automation-audit-trails, prompt-injection-and-web-agents, claude-computer-use-with-steel, gemini-computer-use-with-steel


### Invented/nonexistent SDK methods and CLI commands


Copy-paste code blocks name symbols that do not exist in the shipped SDK/CLI: profiles.get (real: profiles.retrieve), client.files.downloadArchive (real: client.sessions.files.downloadArchive), client.sessions.agentLogs / steel.sessions.logs.list (no such subresource), `steel run browser-use --task` (no such command), `npx skills add steel-dev/cli` (real repo: steel-dev/skills), page.swipe() (no built-in swipe), `steel browser snapshot -i` for visual evidence (snapshot is an a11y tree; use screenshot), a fabricated `stealthNeeded` flag (real: useProxy/solveCaptcha), and Steel 'Quick Actions' (real product name: Browser Tools).



**Affected:** browser-profiles-that-survive-real-workflows, browser-automation-audit-trails, steel-cli-for-browser-workflows, mobile-mode-for-browser-automation, chrome-extensions-for-browser-agents, stagehand-with-steel, claude-computer-use-with-steel, browser-automation-cost-at-scale, multi-region-browser-sessions


### Steel Local vs Steel Cloud feature boundaries not flagged


Credentials API, Files API, CAPTCHA solving, and premium Stealth Browser are Steel Cloud-only; Steel Local is documented as concurrency=1 and 'Not supported' for Credentials/Files. Multiple articles recommend Steel Local for on-prem/sensitive workflows or 'self-host everything' without noting the flagship compliance/anti-bot controls are unavailable there, or imply Credentials/Files run inside your VPC.



**Affected:** browser-automation-for-public-records-and-compliance, prompt-injection-and-web-agents, secure-browser-auth-for-agents, skyvern-vs-steel-vs-steel-vs-rpa, self-hosted-browser-infrastructure-guide, anti-bot-false-positives-for-legit-automation


### Self-reported, region-conditional benchmark stated as unconditional fact


The 0.89s avg / 1.09s p95 / 1.34s p99 figure is from Steel's own benchmark (5,000 runs, AWS us-east-1, same-region, vendor-run) and the homepage footnote says 'under 1s when client is in same region.' Articles present it as 'sub-second' / 'under a second' / 'boots in under 1 second' with no link, no self-reported disclosure, and no p95 (which is >1s). p95 is over one second.



**Affected:** browserless-vs-steel, browser-automation-for-public-records-and-compliance, skyvern-vs-steel-vs-steel-vs-rpa, steel-cli-for-browser-workflows, claude-computer-use-with-steel, gemini-computer-use-with-steel


### Broken-link and canonical-URL patterns


Two recurring link defects: (1) a malformed URL-encoded relative path '../20-29%20Content/20%20Articles/remote-browser-benchmark.md' pointing at a directory that does not exist (a copy-paste artifact, also present in browserbase-vs-steel.md outside this set); (2) the canonical Steel limits URL is /overview/pricinglimits (one word, no hyphen — it looks like a typo but 200s), while the intuitive /overview/pricing and /overview/sessions-api 404; several articles 'correct' toward the 404 form. Some articles (secure-browser-auth) have zero outbound primary-source links.



**Affected:** skyvern-vs-steel-vs-steel-vs-rpa, gemini-computer-use-with-steel, browser-automation-cost-at-scale, secure-browser-auth-for-agents, chrome-extensions-for-browser-agents


### Stale model IDs across computer-use / agent-framework articles


Model and tool identifiers drift faster than article update cycles. claude-computer-use pins claude-sonnet-4-5 and tool computer_20250124 / beta computer-use-2025-01-24 (current: computer_20251124 / -2025-11-24, Sonnet 5 / Opus 4.8). gemini-computer-use is pegged to Gemini 2.5 (now Legacy; current is Gemini 3 / 3.5 via the GA Interactions API). skyvern references GPT-4o (current: GPT-5). stagehand-with-steel is built entirely on the deprecated Stagehand v2 API.



**Affected:** claude-computer-use-with-steel, gemini-computer-use-with-steel, skyvern-vs-steel-vs-steel-vs-rpa, stagehand-with-steel


### Missing primary-source citations and shared structural gaps


Several pieces make API/feature claims without linking the docs that back them, and omit Steel-native levers that are the direct answer to the problem being described: inactivityTimeout (for idle/concurrency cost), per-tier concurrency caps (for queue sizing), and the Agent Traces evidence timeline (for audit). Code samples frequently omit sessions.release() in a finally block even though Steel bills per minute and the articles themselves cite the 5-min timeout elsewhere.



**Affected:** secure-browser-auth-for-agents, browser-traces-replay-and-debugging, self-hosted-browser-infrastructure-guide, mobile-mode-for-browser-automation, scaling-browser-automation-to-hundreds-of-sessions, stagehand-with-steel


---


## 3. Global prioritized fixes


**[BLOCKER] Global pricing/tier canonicalization: replace Hobby/Starter/Developer/Pro with Launch/Scale/Enterprise everywhere, and correct every per-tier number to the canonical table (concurrency 10/100/1,000+; RPM 60/600/custom; max session 15min/1hr/24hr; retention 7/14/custom days; browser $0.10/$0.08 per hr; proxy $10/$6 per GB; CAPTCHA $3/$1 per 1k; Launch $30 one-time credits, Scale $250/mo + $100 credits, Enterprise custom). Add a dated one-line 'figures current as of June 2026; verify against docs.steel.dev/overview/pricinglimits' next to every rebuilt table. Delete the fabricated '$0.05/hr browser', '3x overage/burst', and '$5/GB proxy' figures.


*Applies to:* browser-automation-cost-at-scale, browser-automation-audit-trails, scaling-browser-automation-to-hundreds-of-sessions, prompt-injection-and-web-agents, browser-automation-for-public-records-and-compliance, anti-bot-false-positives-for-legit-automation, skyvern-vs-steel-vs-steel-vs-rpa, self-hosted-browser-infrastructure-guide


*Why:* This is the spine of the cost/scaling/audit articles and the most easily-checked defect; answer engines ingest these numbers verbatim.



**[BLOCKER] Qualify every '24-hour session' mention as Enterprise-only (Launch 15 min, Scale 1 hr, Enterprise up to 24 hr). In intros and comparison-table cells use tier-qualified wording; in decision/trade-off sections reframe 24h as an Enterprise-tier capability. Make code-sample `timeout` values consistent with the stated tier.


*Applies to:* claude-computer-use-with-steel, gemini-computer-use-with-steel, prompt-injection-and-web-agents, secure-browser-auth-for-agents, stagehand-with-steel, skyvern-vs-steel-vs-steel-vs-rpa, anti-bot-false-positives-for-legit-automation, browser-automation-cost-at-scale, browser-automation-for-public-records-and-compliance, scaling-browser-automation-to-hundreds-of-sessions


*Why:* Most-repeated overstatement in the set; Launch/Scale readers otherwise design around a session length they will never get.



**[BLOCKER] Rename 'agent logs' → 'agent traces' everywhere; correct the endpoint to GET /v1/sessions/{id}/agent-traces (returns {events,total,hasMore} of browser-activity timeline); remove nonexistent SDK methods client.sessions.agentLogs and steel.sessions.logs.list (use raw fetch with the steel-api-key header, or steel.sessions.events(id) for the RRWeb stream); reword 'every prompt + DOM diff' to 'browser-activity timeline of clicks/inputs/navigations/errors with element targets.'


*Applies to:* browser-automation-audit-trails, prompt-injection-and-web-agents, claude-computer-use-with-steel, gemini-computer-use-with-steel


*Why:* Wrong endpoint returns 404 for any reader who copies it; the cited SDK methods throw at runtime.



**[BLOCKER] Rewrite the session-timeout model: the 5-minute default is the hard lifetime `timeout` (billable even when idle, immutable on a live session, plan-bounded to 15min/1hr/24hr); `inactivityTimeout` is the separate, off-by-default idle release that resets on any CDP command or remote input. Remove 'idle timeout'/'time out after 5 minutes of inactivity' language. Replace the page.waitForTimeout(0) heartbeat advice (deprecated, no-op) with: set a larger `timeout` at creation, and if `inactivityTimeout` is on, keep the session warm with a real CDP command (e.g. page.evaluate(() => 1)).


*Applies to:* prompt-injection-and-web-agents, secure-browser-auth-for-agents, embed-live-and-past-browser-sessions, scaling-browser-automation-to-hundreds-of-sessions


*Why:* A core isolation/metering control currently described backwards across the security and scaling articles.



**[BLOCKER] Fix every broken/fabricated code symbol against the shipped SDK/CLI: profiles.get → profiles.retrieve; client.files.downloadArchive → client.sessions.files.downloadArchive; remove client.sessions.agentLogs/steel.sessions.logs.list; replace `steel run browser-use --task` with `steel forge <template> --name ...`; fix `npx skills add steel-dev/cli` → `npx skills add steel-dev/skills`; replace nonexistent page.swipe() with a pointer down/move/up sequence and page.tap()→locator.tap(); change `steel browser snapshot -i` (a11y tree) to `steel browser screenshot` for visual evidence; rename 'Steel Quick Actions' → 'Steel Browser Tools'; remove fabricated `ord` region and use only `lax`/`iad`; add an explicit Anthropic→Steel action+field translator in the Claude Computer Use loop; rewrite the Stagehand samples on v3 (stagehand.act/extract, stagehand.context.pages()[0], model:{modelName,apiKey}).


*Applies to:* browser-profiles-that-survive-real-workflows, browser-automation-audit-trails, steel-cli-for-browser-workflows, mobile-mode-for-browser-automation, chrome-extensions-for-browser-agents, stagehand-with-steel, claude-computer-use-with-steel, multi-region-browser-sessions


*Why:* A reference article lives or dies on whether its code runs; these snippets fail as written and will generate support tickets.



**[BLOCKER] Resolve the competitor/customer-claim risks before publishing: remove or substantiate the SOC 2 attestation (Steel publicly advertises only HIPAA-ready BAA; stand up a /trust page or downgrade the line); delete the unverifiable Chronicle Legal / Benny named-customer statistics in the public-records lead (the Chronicle numbers appear misappropriated from a Browserbase case study); rewrite the Skyvern competitive cells to acknowledge its native CAPTCHA solving, proxy networks, 2FA/TOTP, and audit trail (refuted by skyvern.com/pricing); soften 'Browserless: you own all log capture/replay' to acknowledge its plan-tiered 1/7/30/90-day retention and dashboard-hosted Session Replay; soften 'RPA usually blocked' to 'often detected on protected public sites.'


*Applies to:* browserless-vs-steel, browser-automation-for-public-records-and-compliance, skyvern-vs-steel-vs-steel-vs-rpa


*Why:* Easily-falsified competitive and compliance claims create direct legal/procurement/reputational risk and undermine Steel's credibility with answer engines that cross-check competitor sites.



**[HIGH] Update stale model/tool identifiers across the computer-use and agent-framework articles: claude-sonnet-4-5 → claude-sonnet-5 (or claude-opus-4-8); computer_20250124/computer-use-2025-01-24 → computer_20251124/computer-use-2025-11-24; gemini-2.5-computer-use-preview → gemini-3-flash-preview (note gemini-3.5-flash via the GA Interactions API as the newest path); GPT-4o → GPT-5. Add a pointer to leaderboard.steel.dev so the model choice ages gracefully.


*Applies to:* claude-computer-use-with-steel, gemini-computer-use-with-steel, skyvern-vs-steel-vs-steel-vs-rpa, stagehand-with-steel


*Why:* Model IDs drift faster than article update cycles; stale IDs contradict Steel's own integration/cookbook pages.



**[HIGH] Add Steel Local caveats wherever self-host/on-prem is recommended: the Credentials API, Files API, CAPTCHA solving, and premium Stealth Browser are Cloud-only (Steel Local = concurrency 1, no Credentials/Files, limited stealth, BYO-proxy). Do not imply Credentials/Files can be self-hosted or run inside your VPC; for on-prem compliance, state that DOM-level credential injection must be self-built on Steel Local.


*Applies to:* browser-automation-for-public-records-and-compliance, prompt-injection-and-web-agents, secure-browser-auth-for-agents, skyvern-vs-steel-vs-steel-vs-rpa, self-hosted-browser-infrastructure-guide, anti-bot-false-positives-for-legit-automation


*Why:* Compliance-focused readers otherwise build on Steel Local only to discover the flagship controls are missing.



**[HIGH] Fix the recurring broken-link and canonical-URL patterns: replace the malformed '../20-29%20Content/20%20Articles/remote-browser-benchmark.md' href (also flagged in browserbase-vs-steel.md outside this set) with https://steel.dev/blog/remote-browser-benchmark; use /overview/pricinglimits (one word, no hyphen — it 200s) not /overview/pricing; use /overview/sessions-api/overview not /overview/sessions-api; verify chrome-extensions' docs.steel.dev/overview/extensions-api/overview resolves before publish. Add missing outbound docs links on first mention of Credentials/Profiles/session-lifecycle/pricing (secure-browser-auth currently has zero).


*Applies to:* skyvern-vs-steel-vs-steel-vs-rpa, gemini-computer-use-with-steel, browser-automation-cost-at-scale, secure-browser-auth-for-agents, chrome-extensions-for-browser-agents


*Why:* Broken citation paths and missing primary-source links are penalized by answer engines and block reviewer verification.



**[HIGH] Disclose and link the 0.89s/1.09s/1.34s benchmark: label it as Steel's own self-reported test (5,000 runs, AWS us-east-1), state the same-region condition, include p95/p99, and note which providers were/ weren't measured. Soften 'sub-second'/'under a second'/'boots in under 1 second' to 'averages under a second in-region (p95 1.09s).' If the benchmark did not include the named competitor (e.g. Browserless), say so.


*Applies to:* browserless-vs-steel, browser-automation-for-public-records-and-compliance, skyvern-vs-steel-vs-steel-vs-rpa, steel-cli-for-browser-workflows, claude-computer-use-with-steel, gemini-computer-use-with-steel


*Why:* Unattributed vendor benchmarks read as independently verified; disclosing provenance costs one clause and removes the risk.



**[MEDIUM] Add Steel-native levers the articles currently omit: inactivityTimeout as the first-class idle/concurrency-cost control (scaling, embed, secure-auth); per-tier concurrency/RPM ceilings in queue-sizing guidance (scaling, public-records, self-hosted); Agent Traces as the audit/evidence surface (audit-trails, prompt-injection, claude-cu, gemini-cu); and sessions.release() in a finally block in every code sample (browser-traces, self-hosted, stagehand, skyvern). Also add the Launch $10-deposit gate for CAPTCHA/proxies where relevant.


*Applies to:* scaling-browser-automation-to-hundreds-of-sessions, embed-live-and-past-browser-sessions, secure-browser-auth-for-agents, browser-automation-audit-trails, prompt-injection-and-web-agents, self-hosted-browser-infrastructure-guide, stagehand-with-steel, browser-traces-replay-and-debugging


*Why:* These are the purpose-built Steel answers to the exact problems described; omitting them undersells the product and leaves readers to improvise.



---


## 4. Competitor & compliance claim risks (verify or remove before publish)


- **Claim:** Steel Cloud offers SOC 2 plus Files/Credentials boundaries

  **Article:** browserless-vs-steel.md

  **Risk:** SOC 2 is a specific third-party audit attestation, not a marketing adjective. Steel's site advertises only 'HIPA-ready BAA' (note: not even 'HIPAA-compliant'); no /security, /trust, or /compliance page exists. Browserless explicitly advertises SOC 2 Type II. Publishing an unverified SOC 2 claim on Steel's own blog creates direct procurement/legal risk if a customer relies on it in a security questionnaire.

  **Recommendation:** Confirm Steel's SOC 2 status internally + stand up a public /trust page before publishing, or downgrade the line to the documented 'HIPAA-ready BAA + Enterprise SSO plus Files/Credentials boundaries.'


- **Claim:** Chronicle Legal runs >100,000 government-portal sessions/month on Steel; Benny saw a 40% lift in benefit lookups

  **Article:** browser-automation-for-public-records-and-compliance.md

  **Risk:** Neither company appears anywhere on steel.dev (homepage, llms.txt, /customers 404, /case-studies 404). The Chronicle Legal statistic matches a published Browserbase case study and appears misappropriated. Named-customer quantitative claims with no traceable source are the highest legal/reputational risk in the set and the first thing a fact-checker or competitor flags.

  **Recommendation:** Delete both named-customer statistics; rewrite the lead as a representative pattern ('teams routinely clear tens of thousands of sessions a month; success rates climb sharply once CAPTCHA/proxy control moves into the runtime'). Only restore with a published, approved Steel case study.


- **Claim:** Skyvern 'relies on the browser layer underneath' for CAPTCHA; 'inherits whatever evidence surface the browser layer provides'; 'leans on the browser runtime for credential injection, proxy policy'

  **Article:** skyvern-vs-steel-vs-steel-vs-rpa.md

  **Risk:** Refuted by skyvern.com/pricing and the Skyvern GitHub: Skyvern ships native CAPTCHA solving (no third-party solver), its own residential/datacenter proxy networks with geo-targeting, 2FA/TOTP handling, and an 'Explainable AI' audit trail. Easily-falsified competitor capability claims hurt Steel's credibility more than they help and invite public correction.

  **Recommendation:** Reframe Steel's differentiator as portable, framework-agnostic infrastructure you control (self-host or cloud, any agent framework) plus browser-grade evidence (live viewer, MP4/HLS replay, Files) — not a capability monopoly Skyvern demonstrably has.


- **Claim:** Browserless: 'you own log capture, replay exports, and human-in-loop wiring'; replay/logs 'live wherever you store them'

  **Article:** browserless-vs-steel.md

  **Risk:** Overstated. Browserless captures and retains session data and logs per plan tier (1/7/30/90 days on Free/Prototyping/Starter/Scale) and hosts Session Replay in its dashboard with WebM screen-recording export. The genuinely-user-owned parts are long-term/audit retention beyond the plan window and approval wiring.

  **Recommendation:** Soften to acknowledge Browserless's plan-tiered retention and dashboard-hosted replay; reserve 'on you' for beyond-plan retention, approval chains, and audit packaging.


- **Claim:** Traditional RPA is 'usually blocked by modern bot defenses because they replay DOM commands, not real Chrome fingerprints'

  **Article:** skyvern-vs-steel-vs-steel-vs-rpa.md

  **Risk:** Overstated. Modern RPA (UiPath, Automation Anywhere) runs a real Chrome browser; the detectable surface is selector-replay and automation artifacts (WebDriver/CDP signals, extension signatures, event timing), not 'not real Chrome.' 'Usually blocked' is too strong for internal-app RPA.

  **Recommendation:** Soften to 'often detected on protected public sites; fine on internal apps,' and attribute detection to automation artifacts rather than non-Chrome fingerprints.


- **Claim:** Stagehand 'still uses OpenAI for planning' / 'only calls OpenAI-hosted models'

  **Article:** stagehand-with-steel.md

  **Risk:** Inaccurate for Stagehand v3, which is model-agnostic (OpenAI, Anthropic, Google Gemini, Vertex, Azure, local Ollama); OpenAI is only the default in Steel's recipe. Undersells the integration and misleads Claude/Gemini users.

  **Recommendation:** Soften to model-agnostic language ('your model provider and key for planning; OpenAI is the default — Stagehand also supports Anthropic, Gemini, Vertex, Azure, Ollama').


- **Claim:** Computer-use articles pin stale model/tool IDs: claude-sonnet-4-5 + computer_20250124 / computer-use-2025-01-24; gemini-2.5-computer-use-preview; Skyvern planner works with 'GPT-4o, Claude, or Gemini'

  **Article:** claude-computer-use-with-steel.md (also gemini-computer-use-with-steel.md, skyvern-vs-steel-vs-steel-vs-rpa.md)

  **Risk:** Contradicts both Anthropic's and Google's current docs and Steel's own integration/cookbook pages (which target computer_20251124 / Gemini 3). Gemini 2.5 is marked Legacy by Google. A 2026 reference article on year-old model versions misleads copy-pasters and underperforms in answer-engine ranking.

  **Recommendation:** Bump to current IDs (computer_20251124 / computer-use-2025-11-24; claude-sonnet-5 or claude-opus-4-8; gemini-3-flash-preview with a note on gemini-3.5-flash via the GA Interactions API; GPT-5). Defer volatile model choice to leaderboard.steel.dev.


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
  → Replace both occurrences of the unqualified claim with tier-qualified wording.

(1) Symptom-map table cell, line 44 — replace:
"Steel sessions run up to 24 hours with profile persistence so you look like the same trusted user"
with:
"Enterprise Steel sessions run up to 24 hours (Launch caps at 15 minutes, Scale at 1 hour) with profile persistence so you look like the same trusted user"

(2) Section 3, line 59 — replace:
"Steel sessions run up to 24 hours, and profiles can store 300 MB of cookies, extensions, and settings, which keeps login state stable while reducing the need for fresh MFA challenges."
with:
"Steel sessions run up to 24 hours on Enterprise plans (15 minutes on Launch, 1 hour on Scale), and profiles can store 300 MB of cookies, extensions, and settings, which keeps login state stable while reducing the need for fresh MFA challenges."
  src: https://docs.steel.dev/overview/pricinglimits · https://steel.dev/#pricing
- [ACCURATE] · steel-product · profiles can store 300 MB of cookies, extensions, and settings
  src: https://docs.steel.dev/overview/profiles-api/overview · https://docs.steel.dev/overview/llms-full.txt
- [INACCURATE] · steel-pricing · CAPTCHA solving ships on paid plans only, so build manual procedures for Hobby-tier runs  *(adversarially verified)*
  → Replace with: 'CAPTCHA solving requires a funded workspace: on Launch, verify your account with a $10 balance deposit to unlock it (free credits do not count); it is included on Scale and Enterprise. Build manual fallbacks for unfunded Launch runs or custom enterprise blockers.'
  src: https://docs.steel.dev/overview/pricinglimits · https://steel.dev/pricing
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
  → Replace the entire "Plan deadlines for evidence" table (content/articles/browser-automation-audit-trails.md, lines 76-82) with the current tiers. New table:\n\n| Plan | Concurrent sessions | Evidence retention | Max session time | Export-by reminder |\n| --- | ---: | ---: | ---: | --- |\n| Launch | 10 | 7 days | 15 minutes | Export replay and files immediately; no slack time |\n| Scale | 100 | 14 days | 1 hour | Schedule hourly exports and daily verification |\n| Enterprise | 1,000+ | Custom | Up to 24 hours | Contract will specify; automate retention mirrors anyway |\n\nALSO fix two downstream prose references that depend on the same bad tiers: (1) line 45 'Hobby and Starter plans purge session artifacts in 24 hours or 2 days' -> 'Launch purges session artifacts in 7 days, so waiting for legal to ask means the replay could be gone.' (2) line 100 'Treat Hobby and Starter like temporary cache layers' -> 'Treat the Launch tier like a temporary cache layer; export everything immediately or accept that proof disappears.' Note: the article's links section already cites docs.steel.dev/overview/pricinglimits, so aligning to that page is the correct fix.
  src: https://docs.steel.dev/overview/pricinglimits
- [CONFIRMED-INACCURATE] · steel-pricing · "Hobby and Starter plans purge session artifacts in 24 hours or 2 days."  *(adversarially verified)*
  → Replace the flagged sentence (article line 45) — current: "- Evidence disappears. Hobby and Starter plans purge session artifacts in 24 hours or 2 days, so waiting for legal to ask means the replay is gone." — with: "- Evidence disappears. Steel's Launch tier keeps session artifacts for only about a week before they are purged, so waiting for legal to ask means the replay is gone." ALSO fix the same fabrication in the "Plan deadlines for evidence" table (lines 76-82): the rows "Hobby" (24h) and "Starter" (2d) reference non-existent plans and the 24h/2d retention figures are wrong (24h is a session-runtime limit, not retention). Rename the tiers to Steel's actual plans — Launch / Scale / Enterprise — and remove the invented Hobby and Starter rows before publishing.
  src: https://steel.dev/pricing · https://docs.steel.dev/llms.txt
- [CONFIRMED-INACCURATE] · steel-product · `GET /v1/sessions/{id}/agent-logs` is the action-log endpoint, and `client.sessions.agentLogs(id)` is the SDK equivalent.  *(adversarially verified)*
  → Correct both occurrences of the wrong endpoint and remove the fabricated SDK method.

EDIT 1 — content/articles/browser-automation-audit-trails.md line 38 (the Short answer table).
Replace:
| Action log | Everything the agent attempted and what DOM returned | `GET /v1/sessions/{id}/agent-logs` (or SDK equivalent) writes structured steps you can ship into your SIEM |
with:
| Action log | Everything the agent attempted and what DOM returned | `GET /v1/sessions/{id}/agent-traces` returns the trace timeline as JSON you can ship into your SIEM |

EDIT 2 — content/articles/browser-automation-audit-trails.md line 55 (the Build the evidence stack table).
Replace:
| **Agent logs** | Every prompt, action, and DOM diff | `client.sessions.agentLogs(id)` (or raw `GET /agent-logs`) emits paginated events. Ship them to your log store so you can search for risky selectors or failed retries. |
with:
| **Agent traces** | Every prompt, action, and DOM diff | `GET /v1/sessions/{id}/agent-traces` returns the trace timeline as JSON (filter with `?startTime=`/`?endTime=`); fetch it with a raw request since there is no SDK helper. Ship it to your log store so you can search for risky selectors or failed retries. |

OPTIONAL (consistency, not part of the flagged claim): line 71 references a local bucket filename `agent-logs.ndjson` — that is the author's own artifact-naming convention, not an API path, so it is not factually wrong, but for consistency with the product it could be renamed `agent-traces.ndjson`.
  src: https://docs.steel.dev/overview/agent-traces/api · https://docs.steel.dev/sitemap.xml
- [CONFIRMED-INACCURATE] · steel-product · Agent logs contain "Every prompt, action, and DOM diff" / "Everything the agent attempted and what DOM returned."  *(adversarially verified)*
  → Replace line 38 cell: "Everything the agent attempted and what DOM returned | `GET /v1/sessions/{id}/agent-logs` (or SDK equivalent) writes structured steps you can ship into your SIEM" -> "Each browser action the agent performed (click, input, navigate, scroll, drag) with the target element and page URL | `GET /v1/sessions/{id}/agent-traces` (or SDK equivalent) returns a timestamped, video-synced activity timeline you can ship into your SIEM". Replace line 55 cell: "**Agent logs** | Every prompt, action, and DOM diff | `client.sessions.agentLogs(id)` (or raw `GET /agent-logs`) emits paginated events. Ship them to your log store so you can search for risky selectors or failed retries." -> "**Agent traces** | Every browser action (click, input, navigate, scroll, drag) with the target element and page URL | `GET /v1/sessions/{id}/agent-traces` returns paginated activity events. Ship them to your log store so you can search for risky selectors or failed retries.". Also update the remaining "agent logs" references (lines 4, 22, 28, 70, 92, 104) to "agent traces" for naming consistency.
  src: https://docs.steel.dev/llms.txt · https://docs.steel.dev/overview/agent-traces/overview
- [CONFIRMED-INACCURATE] · steel-product · Files archive call is `client.files.downloadArchive(sessionId)`.  *(adversarially verified)*
  → In /Users/nikola/dev/steel/llms-steel-dev/content/articles/browser-automation-audit-trails.md line 56, change `client.files.downloadArchive(sessionId)` to `client.sessions.files.downloadArchive(sessionId)`. Full replacement for that table cell's code span: `Call \`client.sessions.files.downloadArchive(sessionId)\` right after \`sessions.release\`.`
  src: https://github.com/steel-dev/steel-node/blob/main/src/resources/sessions/files.ts · https://github.com/steel-dev/steel-node/blob/main/src/resources/files.ts
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
  → Replace the flagged concurrency figures in both locations. Line 29 (Short answer): change "while [Steel Cloud](@/glossary/steel-cloud.md) plans top out at 5, 10, 20, or 100 concurrent sessions" to "while [Steel Cloud](@/glossary/steel-cloud.md) plans cap concurrency at 10 (Launch), 100 (Scale), or 1,000+ (Enterprise) sessions". Line 37 (Cost drivers table, Concurrency caps cell): change "Plans enforce 5, 10, 20, or 100 live sessions plus 1, 2, 5, or 10 requests per second." to "Plans cap at 10, 100, or 1,000+ live sessions (Launch / Scale / Enterprise)." (The RPS figures "1, 2, 5, or 10" were not surfaced on the current pricing page and need separate verification before reinsertion.)
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/llms.txt
- [INACCURATE] · steel-pricing · browser-hour pricing between $0.10 and $0.05  *(adversarially verified)*
  → Use '$0.10/hour on Launch down to $0.08/hour on Scale' everywhere.
  src: https://docs.steel.dev/overview/pricinglimits
- [INACCURATE] · steel-product · Pro plans pair 100 concurrent sessions, 10 requests per second, 24 hour max runtimes  *(adversarially verified)*
  → 'Scale pairs 100 concurrent sessions, 600 requests per minute, and a 1-hour max session runtime (24 hours is Enterprise) at $0.08/hour.'
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/overview/sessions-api/session-lifecycle
- [CONFIRMED-INACCURATE] · steel-product · Plans enforce ... 1, 2, 5, or 10 requests per second  *(adversarially verified)*
  → Replace "1, 2, 5, or 10 requests per second" with the accurate per-minute tiers. Suggested replacement text: "Plans cap throughput at 60 requests/minute on Launch and 600/minute on Scale (Enterprise is custom) — i.e. roughly 1 or 10 requests per second." For the line-61 'RPS ceilings' reference, reframe as "request-rate ceilings (60/min on Launch, 600/min on Scale, custom on Enterprise)" rather than listing fictional 1/2/5/10 RPS tiers.
  src: https://docs.steel.dev/overview/pricinglimits · https://steel.dev/llms.txt
- [CONFIRMED-INACCURATE] · steel-product · Long-lived flows on Hobby or Starter hit 15 to 30 minute caps  *(adversarially verified)*
  → In /Users/nikola/dev/steel/llms-steel-dev/content/articles/browser-automation-cost-at-scale.md, line 36, replace: "Long-lived flows on Hobby or Starter hit 15 to 30 minute caps and block new work." with: "Long-lived flows on Launch hit a 15-minute session cap and block new work." (Per docs.steel.dev/overview/pricinglimits: Launch = 15 min, Scale = 1 hour, Enterprise = up to 24 hours; there is no Hobby/Starter plan and no 30-minute cap on any tier.)
  src: https://docs.steel.dev/overview/pricinglimits · https://steel.dev/pricing
- [CONFIRMED-INACCURATE] · steel-pricing · Residential proxies run $10 to $5 per GB depending on plan  *(adversarially verified)*
  → Two edits required (the claim appears in both locations the reviewer cited). (1) Line 38, Stealth surface area row — replace "Residential proxies run $10 to $5 per GB depending on plan, and CAPTCHA solves are $4 to $3 per 1k on paid tiers." with "Residential proxies run $10 to $6 per GB depending on plan, and CAPTCHA solves are $3 to $1 per 1k on paid tiers." (the CAPTCHA figure is corrected in passing since it sits in the same sentence and is also wrong per Steel's FAQ: $3/1k Launch, $1/1k Scale). (2) Line 45, Proxy bandwidth row — replace "Billed per GB at $10 (Starter) to $5 (Pro)." with "Billed per GB at $10 (Launch) to $6 (Scale)." This fixes both the fictitious $5/GB and the non-existent plan names (Starter/Pro -> Launch/Scale).
  src: https://docs.steel.dev/overview/pricinglimits · https://steel.dev/pricing
- [CONFIRMED-INACCURATE] · steel-pricing · CAPTCHA solves are $4 to $3 per 1k on paid tiers  *(adversarially verified)*
  → Replace the CAPTCHA figure in BOTH locations. (1) Line 38 cost-drivers table row, current text: "Residential proxies run $10 to $5 per GB depending on plan, and CAPTCHA solves are $4 to $3 per 1k on paid tiers." -> change the CAPTCHA portion to: "CAPTCHA solves are $3 to $1 per 1k on paid tiers (Launch down to Scale)." (2) Line 46 plan-math table row, current text: "Priced at $4 to $3 per 1k solves on paid plans." -> replace with: "Priced at $3 per 1k solves on Launch down to $1 per 1k on Scale (Enterprise is custom)." Separately, the editor should also correct the proxy figure in the same line-38 sentence from "$10 to $5 per GB" to "$10 to $6 per GB (Launch to Scale)" to match the source table.
  src: https://docs.steel.dev/overview/pricinglimits · https://steel.dev/pricing
- [CONFIRMED-INACCURATE] · steel-product · Route every session with a stealthNeeded flag  *(adversarially verified)*
  → In /Users/nikola/dev/steel/llms-steel-dev/content/articles/browser-automation-cost-at-scale.md line 38, replace the cell's first sentence "Route every session with a `stealthNeeded` flag." with "Set `useProxy` and `solveCaptcha` per session, not globally." Keep the rest of the cell unchanged ("Use managed proxies only for OTP gates or checkout flows, keep static scraping on default datacenter IPs, and capture CAPTCHA counts per workflow."). This references the real, documented Steel sessions.create booleans and preserves the row's cost-control intent. Do NOT adopt the reviewer's `stealthConfig`/`stealth_config` suggestion — that parameter does not exist in the Steel API either.
  src: file:///Users/nikola/dev/steel/llms-steel-dev/content/articles/browser-automation-cost-at-scale.md · file:///Users/nikola/dev/steel/llms-steel-dev/content/articles/playwright-with-steel.md
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


### browser-automation-for-public-records-and-compliance — readiness 5/10


**Title:** Browser Automation for Public Records and Compliance Workflows


**Priority issues**
- (BLOCKER) The opening lead attributes two specific statistics to named companies that are unverifiable: "Chronicle Legal already runs more than 100,000 government-portal sessions a month ... to keep disability cases fresh" and "Benny saw a 40 percent lift in successful government benefit lookups." No mention of either company appears on steel.dev's homepage, its llms.txt site summary, its docs (llms-full.txt), or a /customers or /case-studies page (both 404). For a published blog post these read as factual customer claims and carry legal/reputational risk.
  → *Fix:* Either (a) link each to a real, published Steel case study if one exists and is approved for use, or (b) reframe as representative/illustrative, e.g.: "In high-volume government-portal automation we see on Steel — disability-case refreshers and benefits-eligibility lookups — teams routinely clear tens of thousands of sessions a month, and success rates climb sharply once CAPTCHA solving and proxy control move out of the script and into the runtime." Remove the company names unless they are cleared, named customers.
- (HIGH) Wrong/renamed plan tier names. Line 53 says "Steel Cloud starter tiers begin in the tens of concurrent sessions and Pro pushes into the hundreds." There is no "starter" or "Pro" plan. Per docs.steel.dev/overview/pricinglimits (last edited 2026-06-30), the current plans are Launch, Scale, and Enterprise. (Starter/Developer/Startup are legacy grandfathered plans.)
  → *Fix:* Replace the sentence with: "Steel Local is ideal for development and on-prem enclaves but supports a single concurrent session. Steel Cloud scales with your plan: Launch includes 10 concurrent sessions, Scale raises that to 100, and Enterprise supports 1,000+ with managed proxies and CAPTCHA coverage — so pick the tier that matches your docket velocity."
- (HIGH) Overstated Steel Cloud concurrency. Line 30: "[Steel Cloud] starts in the hundreds." Line 36: "Steel Cloud lets you request hundreds of sessions at once." Steel Cloud concurrency is 10 (Launch) / 100 (Scale) / 1,000+ (Enterprise). It starts at 10, not hundreds; "hundreds of sessions at once" is only true on Enterprise.
  → *Fix:* Line 30: change "[Steel Cloud] starts in the hundreds" to "[Steel Cloud] scales from 10 concurrent sessions on Launch up to 1,000+ on Enterprise". Line 36: change "Steel Cloud lets you request hundreds of sessions at once while managed proxies and CAPTCHAs keep logins steady" to "Steel Cloud scales from 10 concurrent sessions on Launch to 1,000+ on Enterprise, while managed proxies and CAPTCHA solving keep logins steady."
- (HIGH) 24-hour session ceiling is stated without plan context. Line 30: "stay live for up to 24 hours." The 24h maximum is Enterprise-only; per the pricing table max session time is Launch=15 minutes, Scale=1 hour, Enterprise=up to 24 hours, and the default session lifetime is 5 minutes (session-lifecycle doc).
  → *Fix:* Line 30: change "stay live for up to 24 hours" to "stay live from 15 minutes on Launch up to 24 hours on Enterprise (5 minutes by default)". Optionally add a one-liner in the concurrency section: "set `timeout` at session creation to the ceiling your plan allows."
- (MEDIUM) "sessions spin up in under a second" (line 30) is presented as fact. Steel's own llms.txt reports 0.89s average but p95 1.09s, from Steel-run benchmarks (browserbench repo). "Under a second" holds for the average but not p95, and the benchmark is vendor-run.
  → *Fix:* Change "sessions spin up in under a second" to "sessions spin up in roughly a second (0.89s average in Steel's benchmarks)" and link to https://github.com/steel-dev/browserbench, or drop the number if you do not want to cite a self-reported benchmark.
- (MEDIUM) The audit/trust table (lines 57-60) recommends the Files API and Credentials API as core compliance surfaces, but per docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud, Steel Local supports neither Files nor Credentials. The article positions Steel Local as a valid runtime (lines 30, 53, 63) without noting these tables' features require Steel Cloud.
  → *Fix:* Add a short note near the "Trust and audit controls" table: "Credentials and Files are Steel Cloud surfaces; on Steel Local you must vault secrets and archive downloads yourself."


**Claim checks** (verified verdict shown)
- [ACCURATE] · steel-product · sessions.release() (and the sessions.release reference) is the Steel method to end a session; releaseAll also exists
  src: https://docs.steel.dev/overview/sessions-api/session-lifecycle · https://docs.steel.dev/overview/llms-full.txt
- [ACCURATE] · steel-product · Manually log in once with `persistProfile: true`, then reuse the `profileId`
  src: https://docs.steel.dev/overview/profiles-api/overview
- [ACCURATE] · steel-product · Keep each profile under the 300 MB cap
  src: https://docs.steel.dev/overview/profiles-api/overview
- [ACCURATE] · steel-product · Reuse the profileId until ... the 30 day inactivity timer hits
  src: https://docs.steel.dev/overview/profiles-api/overview
- [ACCURATE] · steel-product · include `totpSecret` when available, require namespace matches in session creation (Credentials API)
  src: https://docs.steel.dev/overview/credentials-api/overview
- [ACCURATE] · steel-product · Proxy `debugUrl` behind SSO, default `interactive=false`
  src: https://docs.steel.dev/overview/llms-full.txt
- [NEEDS-SOFTENING] · statistic · sessions spin up in under a second  *(adversarially verified)*
  → Replace "sessions spin up in under a second" with "sessions spin up in under a second on average" (paragraph 2, line 30 of content/articles/browser-automation-for-public-records-and-compliance.md). This preserves the accurate thrust (creation ~182ms, full lifecycle avg 0.89s — both sub-second) while defusing the p95=1.09s objection and flagging it as a measured average. Optional stronger alternative: "sessions spin up in under 200ms (under a second for the full connect-and-load lifecycle)".
  src: https://steel.dev/llms.txt · https://steel.dev/blog/remote-browser-benchmark
- [NEEDS-SOFTENING] · steel-product · stay live for up to 24 hours  *(adversarially verified)*
  → Replace the phrase "stay live for up to 24 hours" with "stay live for up to an hour on Scale plans — 24 hours on Enterprise". Exact edit on line 30 of content/articles/browser-automation-for-public-records-and-compliance.md: change "sessions spin up in under a second, stay live for up to 24 hours, keep portal trust inside persistent profiles" to "sessions spin up in under a second, stay live for up to an hour on Scale plans — 24 hours on Enterprise — keep portal trust inside persistent profiles". This reflects the verified per-plan ceilings (Launch 15 min, Scale 1 hour, Enterprise up to 24 hours) and the 5-minute default.
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/overview/sessions-api/session-lifecycle
- [ACCURATE] · steel-product · Steel Local handles roughly one session
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud
- [CONFIRMED-INACCURATE] · steel-pricing · Steel Cloud starts in the hundreds (concurrency)  *(adversarially verified)*
  → Replace the intro parenthetical. Original: "([Steel Local](@/glossary/steel-local.md) handles roughly one session, [Steel Cloud](@/glossary/steel-cloud.md) starts in the hundreds)". Replacement: "([Steel Local](@/glossary/steel-local.md) handles roughly one session, [Steel Cloud](@/glossary/steel-cloud.md) scales from tens to hundreds)". This matches the docs (Launch=10, Scale=100, Enterprise=1,000+) and aligns with the article's own body wording. Note: the body's later reference to a "Pro" plan is also technically off (the actual plan names are Launch/Scale/Enterprise), but that is outside this flagged claim.
  src: https://docs.steel.dev/overview/pricinglimits · https://steel.dev/pricing
- [NEEDS-SOFTENING] · steel-pricing · Steel Cloud lets you request hundreds of sessions at once  *(adversarially verified)*
  → Replace the sentence "Steel Cloud lets you request hundreds of sessions at once while managed proxies and CAPTCHAs keep logins steady." with: "Steel Cloud scales from 10 concurrent sessions on Launch to 1,000+ on Enterprise — well beyond what a local fleet survives — while managed proxies and CAPTCHAs keep logins steady." (This ties the "hundreds/thousands" capability to the Enterprise tier and cites the actual Launch/Scale/Enterprise concurrency ladder from docs.steel.dev/overview/pricinglimits. Separately, line 53's "Pro pushes into the hundreds" should be corrected to the real plan names, since "Pro" is not a current Steel plan.)
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/llms.txt
- [CONFIRMED-INACCURATE] · steel-pricing · Steel Cloud starter tiers begin in the tens of concurrent sessions and Pro pushes into the hundreds  *(adversarially verified)*
  → Replace the sentence in step 7 with: "Steel Cloud's Launch tier starts at 10 concurrent sessions, Scale reaches 100 with anti-bot and dedicated IPs available, and Enterprise scales to 1,000+ with reserved pools and SLAs — pick the plan that matches your docket velocity." (Original: "Steel Cloud starter tiers begin in the tens of concurrent sessions and Pro pushes into the hundreds with managed proxies and CAPTCHA coverage, so pick the plan that matches your docket velocity.")
  src: https://docs.steel.dev/overview/pricinglimits · https://steel.dev/#pricing
- [CONFIRMED-INACCURATE] · third-party · Chronicle Legal already runs more than 100,000 government-portal sessions a month on managed browsers to keep disability cases fresh  *(adversarially verified)*
  → Delete the entire second sentence (the fabricated/misattributed customer stats). Replace the first paragraph's opening with: "Public records and compliance teams only trust automation when every run looks like a deputized clerk: authenticated entry, predictable state, and an evidence packet on release. At scale these workflows live or die by the browser runtime: SSO bounces, idle timers, and CAPTCHA walls decide whether a FOIA pull or docket sweep completes. That is why the runtime, not just the agent plan, decides whether these workflows scale." This removes the Chronicle Legal claim (which misattributes a Browserbase case study to Steel) and the unverified Benny claim. If a real customer stat is wanted later, source it from an actual Steel customer with permission — do not reuse Browserbase's published numbers.
  src: https://www.browserbase.com/blog/case-study-chronicle · https://www.chroniclelegal.com/impact
- [UNVERIFIABLE] · third-party · Benny saw a 40 percent lift in successful government benefit lookups once CAPTCHA solving and proxy control moved out of their scripts  *(adversarially verified)*
  → Replace the named-customer + fake-metric clause with an un-attributed capability statement that preserves the glossary links. Change: ", and Benny saw a 40 percent lift in successful government benefit lookups once [CAPTCHA solving](@/glossary/captcha-solving.md) and [proxy](@/glossary/proxies.md) control moved out of their scripts" TO: ", and teams see meaningfully higher lookup success once [CAPTCHA solving](@/glossary/captcha-solving.md) and [proxy](@/glossary/proxies.md) control are offloaded to the runtime". (Note: the companion "Chronicle Legal... 100,000 government-portal sessions a month" attribution in the same sentence is equally un-sourced and should get the same treatment, but it is outside this claim's scope.)
  src: https://steel.dev · https://steel.dev/customers (HTTP 404)
- [ACCURATE] · steel-product · Steel Browser in your own VPC when statutes require in-boundary processing
  src: https://steel.dev/llms.txt · https://docs.steel.dev/overview/self-hosting/docker
- [ACCURATE] · steel-product · Upload request payloads via Files, mount /files for download targets, ship the archive
  src: https://docs.steel.dev/overview/llms-full.txt
- [ACCURATE] · steel-product · HLS replay export at the end of each sweep / chain HLS replay downloads after sessions.release
  src: https://docs.steel.dev/overview/llms-full.txt
- [ACCURATE] · steel-product · Docs links: sessions-api/overview, profiles-api/overview, credentials-api/overview, files-api/overview (Next step)
  src: https://docs.steel.dev/overview/sessions-api/overview · https://docs.steel.dev/overview/profiles-api/overview


**Top improvements**
- (HIGH) Resolve the lead. The opening two sentences lean on named-customer numbers I cannot verify anywhere on Steel's own properties. Either link approved published case studies or rewrite the lead as a representative pattern without named companies and precise counts. The whole article's credibility rests on the opener. — Unverifiable named-customer statistics are the single biggest legal/reputational risk and the first thing a fact-checker or competitor will flag.
- (HIGH) Rewrite all pricing/concurrency references against the current Launch/Scale/Enterprise table (10/100/1,000+ concurrent; 15 min/1 hour/24 hours; 7/14/custom-day retention). Drop 'starter' and 'Pro'. — These are concrete, easily-checked factual errors against Steel's own pricing page.
- (MEDIUM) Add a one-line 'Steel Cloud required' note under the Trust and audit controls table for the Files, Credentials, and CAPTCHA rows, since Steel Local does not support them. The article currently implies they work on any Steel runtime. — A reader picking Steel Local for an on-prem enclave will discover the two flagship compliance controls are missing only after building.


**Supporting material to add**
- Authoritative pricing/limits table (Launch/Scale/Enterprise): browser hours $0.10/$0.08/custom, proxy $10/$6/GB, captcha $3/$1 per 1k, concurrent sessions 10/100/1,000+, max session time 15 min/1 hour/24 hours, RPS 60/600/custom, data retention 7/14/custom days. Last edited 2026-06-30.  _[where: Replace the vague 'starter/Pro/hundreds' framing in 'Recommended browser pattern' step 7 and the 'hundreds of sessions' line in 'Where compliance teams lose hours' with these concrete, current numbers.]_  (https://docs.steel.dev/overview/pricinglimits)
- Official 'Steel Local vs Steel Cloud' capability table: Steel Local concurrency=1, Captcha Solving=None, Credentials=Not supported, Files=Not supported; Steel Cloud concurrency=100+, Captcha via Captchas API, Credentials and Files supported.  _[where: Footnote the 'Trust and audit controls' table and step 7 to state that the Credentials API, Files API, CAPTCHA solving, and high concurrency are Steel Cloud surfaces — Steel Local cannot run the recommended compliance controls.]_  (https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud)
- Profile limits straight from the Profiles API page: 300 MB size cap (FAILED state on overflow) and 30-day inactivity auto-deletion.  _[where: Step 2 already cites both numbers correctly; optionally add the FAILED-state consequence so readers understand the failure mode.]_  (https://docs.steel.dev/overview/profiles-api/overview)
- Session lifecycle detail: default lifetime is 5 minutes, set via `timeout` (ms) at creation; `inactivityTimeout` releases idle sessions early; timeout cannot be edited on a live session; 24h is the Enterprise ceiling.  _[where: Near the 24-hour claim in the intro and in step 6 (export evidence on release) so compliance teams plan around the real timeouts.]_  (https://docs.steel.dev/overview/sessions-api/session-lifecycle)
- Steel's own lifecycle benchmark: 0.89s average (p95 1.09s), 25.6% control-plane tax, from the open browserbench repo.  _[where: If keeping the 'under a second' claim, cite it here and disclose it is Steel-run, not third-party independent.]_  (https://steel.dev/llms.txt)
- Profiles + Dedicated IPs pairing guidance: 'one profile plus one dedicated IP per account' is Steel's recommended account-based identity pattern.  _[where: Step 2 (Seed profiles per portal) or the 'Portal identity' row of the trust table — strengthens the per-jurisdiction identity argument.]_  (https://docs.steel.dev/overview/profiles-api/overview)



---


### browser-profiles-that-survive-real-workflows — readiness 8/10


**Title:** Browser Profiles That Survive Real Workflows


**Priority issues**
- (BLOCKER) `profiles.get` is not a real Steel SDK method. The article tells developers to 'Monitor `profiles.get` for `FAILED`' (failure table) and the Profiles API surface is listed as create/update. The official docs/SDK expose `client.profiles.create`, `.update`, `.list`, `.retrieve(id)`, `.delete(id)` — there is no `.get`. A developer who copies this gets a runtime error.
  → *Fix:* Replace 'Monitor `profiles.get` for `FAILED` or unused >30 days' with 'Poll `client.profiles.retrieve(profileId)` (or `client.profiles.list()`) for a `FAILED` status, and prune profiles unused >30 days'. Also consider adding `.list`/`.retrieve`/`.delete` alongside `.create`/`.update` in the Next-steps line so the surface is accurate.
- (HIGH) READY is misattributed to the session. The article says 'Wait for the session to enter `READY` in the Profiles API'. READY/UPLOADING/FAILED are PROFILE states, not session states (sessions have Live/Released/Failed). The profile transitions UPLOADING -> READY only after the session is released and the userDataDir upload completes.
  → *Fix:* Change 'Wait for the session to enter `READY` in the Profiles API or sleep a short window before issuing a dependent job.' to 'Wait for the PROFILE to reach `READY` (poll `client.profiles.retrieve(profileId)`; it transitions UPLOADING -> READY after release) before starting a dependent session, or sleep a short window.'
- (MEDIUM) 'Fingerprint' framing overstates what profiles deliver. The article claims profiles give 'identical fingerprinting' / reload 'fingerprint knobs'. Profiles persist browser IDENTITY (cookies, local storage, extensions, stored creds, and the saved user-agent) — useful for looking like the same returning browser — but they do NOT control anti-bot fingerprint surfaces (canvas, WebGL, fonts, screen). Those belong to Steel's separate Stealth feature, which is Enterprise-only per the current pricing page.
  → *Fix:* Soften to identity continuity and name Stealth separately. E.g. change 'retries resume mid-task with identical fingerprinting' to 'retries resume mid-task as the same returning browser identity' and in the failure table change 'reloads the stored User Data Directory and fingerprint knobs' to 'reloads the stored User Data Directory and saved browser identity (user agent, cookies, extensions)'. Add a one-liner: 'For canvas/WebGL/font anti-bot evasion, pair profiles with Steel Stealth (separate feature).'


**Claim checks** (verified verdict shown)
- [ACCURATE] · steel-product · Create one profile with `persistProfile: true`, reuse it by passing `profileId`.
  src: https://docs.steel.dev/overview/profiles-api/overview
- [ACCURATE] · steel-product · Steel snapshots the entire Chrome user data directory on release, including cookies, service workers, extension data, stored credentials, and browser settings.
  src: https://docs.steel.dev/overview/profiles-api/overview
- [ACCURATE] · steel-product · There is a 300 MB profile size limit; exceeding it marks the profile FAILED.
  src: https://docs.steel.dev/overview/profiles-api/overview
- [ACCURATE] · steel-product · Profiles unused after 30 days are automatically deleted.
  src: https://docs.steel.dev/overview/profiles-api/overview
- [CONFIRMED-INACCURATE] · steel-product · Monitor `profiles.get` for FAILED status.  *(adversarially verified)*
  → In /Users/nikola/dev/steel/llms-steel-dev/content/articles/browser-profiles-that-survive-real-workflows.md line 39, replace `profiles.get` with `profiles.retrieve`. New cell text: "Monitor `profiles.retrieve` for `FAILED` or unused >30 days and prune artifacts before re-uploading." (Method-name fix only; the FAILED/30-day logic is accurate per docs and stays.)
  src: https://docs.steel.dev/llms-full.txt · https://docs.steel.dev/overview/profiles-api/overview
- [CONFIRMED-INACCURATE] · steel-product · Wait for the session to enter READY in the Profiles API.  *(adversarially verified)*
  → Replace line 96 of content/articles/browser-profiles-that-survive-real-workflows.md. Original: "- **State lost after release.** You released before Steel finished uploading the profile. Wait for the session to enter `READY` in the Profiles API or sleep a short window before issuing a dependent job." New: "- **State lost after release.** The profile only finalizes *after* the session is released — it sits in `UPLOADING` during the run and flips to `READY` once Steel finishes persisting the userDataDir. Reuse the `profileId` too soon and the next session can start from a stale or empty context. Poll the Profiles API until the **profile** reports `READY` (or sleep a short window) before issuing a dependent job."
  src: https://docs.steel.dev/llms.mdx/overview/profiles-api/overview · https://docs.steel.dev/llms-full.txt
- [ACCURATE] · steel-product · CDP endpoint is wss://connect.steel.dev?apiKey=...&sessionId=...
  src: https://docs.steel.dev/llms-full.txt
- [ACCURATE] · steel-product · client.sessions.release(session.id) and client.sessions.context(session.id) exist; pass the context to sessionContext on the next run.
  src: https://docs.steel.dev/overview/sessions-api/session-lifecycle · https://docs.steel.dev/overview/sessions-api/reusing-auth-context
- [ACCURATE] · steel-product · The Profiles API lets you upload a zipped userDataDir, switch user agents, or swap proxies.
  src: https://docs.steel.dev/overview/profiles-api/overview
- [ACCURATE] · steel-product · sessionContext handoff 'will not restore extensions or last-page state.'
  src: https://docs.steel.dev/overview/sessions-api/reusing-auth-context
- [NEEDS-SOFTENING] · technical · Profiles give 'identical fingerprinting' / reload 'fingerprint knobs'.  *(adversarially verified)*
  → Replace the two flagged phrases (and line 31) with Steel's documented scope. Exact edits in /Users/nikola/dev/steel/llms-steel-dev/content/articles/browser-profiles-that-survive-real-workflows.md:

LINE 37 (failure table) — current: "Always create new sessions with `profileId` so Steel reloads the stored User Data Directory and fingerprint knobs."
REPLACE WITH: "Always create new sessions with `profileId` so Steel reloads the stored User Data Directory — cookies, storage, extensions, and the pinned user agent."

LINE 91 (trade-offs table) — current: "You need retries to resume mid-task with identical fingerprinting."
REPLACE WITH: "You need retries to resume mid-task with the same browser identity (cookies, storage, extensions, user agent)."

LINE 31 (Short answer) — current: "...require stored MFA devices, or depend on browser fingerprint stability."
REPLACE WITH: "...require stored MFA devices, or depend on stable browser identity across runs."

(These use Steel's own terminology — "browser identity" and the User Data Directory contents — and avoid implying canvas/WebGL/font spoofing, which is Stealth / Enterprise-tier and a separate mechanism from profiles.)
  src: https://docs.steel.dev/overview/profiles-api/overview · https://docs.steel.dev/overview/sessions-api/reusing-auth-context


**Top improvements**
- (HIGH) Fix the code example's latent race: it returns session.profileId immediately after client.sessions.release(), but the profile is still UPLOADING at that instant and only becomes READY once the upload finishes. Add a short poll (e.g. loop client.profiles.retrieve(profileId) until status==='READY', with a timeout) so the seeded profileId is actually usable on the next run. — The article's own 'What usually breaks' warns about this race, but the sample code silently exhibits it. A reader who copies seedProfile() and immediately calls runWithProfile() can hit 'profile not READY' failures.
- (MEDIUM) Add a one-paragraph 'Profiles vs Stealth vs sessionContext' disambiguation. Profiles = browser identity continuity; Stealth = anti-bot fingerprint evasion (Enterprise); sessionContext = lightweight cookie+localStorage copy. The article currently blurs profiles and fingerprinting. — Answer-engine readers frequently confuse these three Steel concepts; a crisp mapping improves both SEO recall and accuracy, and avoids implying profiles alone defeat anti-bot.
- (MEDIUM) Note concurrency hygiene: whether multiple simultaneous sessions may attach to the same profileId, and if Steel recommends serializing. State the verified behavior; if undocumented, recommend treating one profile as one active identity to avoid two sessions mutating shared cookies/storage at once. — 'Survive real workflows' implies scaled, possibly parallel runs; the article is silent on the one-profile-many-sessions question, which is where production breakage actually happens.


**Supporting material to add**
- Steel's own recommended pairing for account-based agents: 'one profile plus one dedicated IP per account, so sites see the same cookies, storage, and a familiar IP instead of a fresh browser from a new network every run.' Dedicated IPs are $5/IP/month on Scale.  _[where: 'Instead of scripted re-logins, pin one profile per workflow' section]_  (https://docs.steel.dev/overview/profiles-api/overview)
- Profile state machine (UPLOADING -> READY after release; FAILED on oversize) — cite to make the 'wait for READY' guidance concrete and pollable rather than a vague 'sleep a short window'.  _[where: 'What usually breaks' (State lost after release) and the code example]_  (https://docs.steel.dev/overview/profiles-api/overview)
- Profiles outlive session data retention. Steel retains session data 7 days (Launch) / 14 days (Scale), while profiles persist for 30 days of inactivity — a concrete reason profiles (not raw session replays) are the right primitive for long-lived auth.  _[where: 'Fit, non-fit, trade-offs' table or a new one-line note under it]_  (https://docs.steel.dev/overview/pricinglimits)
- Security framing straight from Steel docs: 'Anyone who can call sessions.create({ profileId }) on your workspace can drive a browser logged in as you' — strengthens the article's 'treat artifacts as secrets' point with a concrete threat model.  _[where: 'What usually breaks' (Context theft risk) bullet]_  (https://docs.steel.dev/llms-full.txt)



---


### browser-traces-replay-and-debugging — readiness 7/10


**Title:** Browser Traces, Replay, and Debugging for Agents


**Priority issues**
- (HIGH) Code sample calls client.sessions.create({ headless: false }), but `headless` is not a documented Sessions API create param, and headful is now the default for all new sessions.
  → *Fix:* Replace `const session = await client.sessions.create({ headless: false });` with `const session = await client.sessions.create();` (headful + WebRTC live streaming is already the default). Optionally add a real param such as `{ name: "agent-run" }`.
- (MEDIUM) The article has zero internal links, breaking the repo convention of (@/glossary/...) and (@/articles/...) links used throughout the rest of the content.
  → *Fix:* On first use of each term, link: `debugUrl` -> (@/glossary/debug-url.md); `HLS` -> (@/glossary/hls.md); `replay` -> (@/glossary/replay.md); `WebRTC` -> (@/glossary/webrtc.md); `session viewer` -> (@/glossary/session-viewer.md). In 'Next steps' add: 'If you are building the embed UI itself, see [Embed Live and Past Browser Sessions](@/articles/embed-live-and-past-browser-sessions.md).'
- (MEDIUM) Heavy topical overlap with the sibling article embed-live-and-past-browser-sessions.md (same debugUrl iframe, interactive flag, /v1/sessions/{id}/hls endpoint, steel-api-key header, rrweb legacy note).
  → *Fix:* Sharpen this article's framing to observability/incident-response (traces as evidence, replay-required incident gates, the 'Signals to watch' table) and explicitly defer the embed/integration how-to to the sibling article via a cross-link. Ensure the `related:` frontmatter arrays of both articles reference each other.
- (LOW) The 'Why naive setups fail' section and the trade-offs bullet conflate two distinct legacy paths (Chrome screencasting for LIVE headless sessions vs rrweb event reconstruction for PAST sessions) under a single 'rrweb' label.
  → *Fix:* In point 3 of 'Why naive setups fail', distinguish the two: 'Legacy headless live streams use Chrome screencasting, and legacy past-session replays reconstruct the DOM from rrweb events via /v1/sessions/:id/events. Both miss the OS-level fidelity of headful WebRTC+MP4.'
- (LOW) The 'Recommended operating pattern' code never releases the session, and never mentions sessions.release().
  → *Fix:* Add a finally-block release to the instrumentation example, e.g. `await client.sessions.release(session.id);`, and add a one-line note: 'Always release the session when the run finishes; Steel bills per session-minute and unreleased sessions idle until the 5-minute timeout.'
- (LOW) No retention/availability window is given for the HLS recording (how long after a run can you fetch /hls, and how long is it stored?).
  → *Fix:* Either state the retention window if Steel can confirm it, or add an explicit caveat: 'Steel does not guarantee long-term storage of session recordings — fetch and persist the HLS manifest to your own storage as part of every run.'


**Claim checks** (verified verdict shown)
- [ACCURATE] · steel-product · Steel streams every session live via a headful WebRTC stream exposed at session.debugUrl for live takeover.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions · https://docs.steel.dev/llms-full.txt
- [ACCURATE] · steel-product · An MP4/HLS recording is served from /v1/sessions/{id}/hls once the run completes.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions · https://docs.steel.dev/llms-full.txt
- [ACCURATE] · steel-product · Headful WebRTC streams preserve the real frame rate (25 fps).
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions
- [ACCURATE] · steel-product · The live embed uses ?interactive=true / ?interactive=false for takeover vs read-only.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions
- [ACCURATE] · steel-product · Steel defaults to a 5 minute idle timeout (streams expire when sessions idle for roughly 5 minutes).
  src: https://docs.steel.dev/llms-full.txt · https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions
- [CONFIRMED-ACCURATE] · steel-product · Code: const session = await client.sessions.create({ headless: false });  *(adversarially verified)*
  → No change needed for accuracy. The `headless` parameter is a valid, documented `SessionCreateParams` field in steel-sdk@0.18.0, so the snippet is correct. Optional stylistic cleanup only: since headful is the default, a "minimal instrumentation" example could be shortened to `const session = await client.sessions.create();` — but this is a refinement, not a correction.
  src: https://registry.npmjs.org/steel-sdk/0.18.0 (published npm tarball; src/resources/sessions/sessions.ts lines 866-868: SessionCreateParams.headless?: boolean) · https://docs.steel.dev/llms-full.txt (915KB docs export: live-sessions page confirms 'Headful sessions are now default for all new sessions' and uses client.sessions.create() with no headless flag; no example uses headless, confirming absence-of-example not absence-of-param)
- [ACCURATE] · steel-product · Debug URLs are intentionally unauthenticated — wrap them in your own access controls before embedding in user-facing dashboards.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions
- [ACCURATE] · steel-product · rrweb playback stays available, but Steel is phasing it out.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions · https://docs.steel.dev/llms-full.txt
- [ACCURATE] · steel-product · Fetch the HLS manifest with a `steel-api-key` request header against https://api.steel.dev/v1/sessions/{id}/hls.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions
- [ACCURATE] · steel-product · Steel now records the actual OS-level output (not event reconstruction).
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions


**Top improvements**
- (HIGH) Fix the instrumentation example: remove the undocumented `{ headless: false }` argument from client.sessions.create() since headful is the default. — It is the only factually wrong line in an otherwise accurate article, and it appears in a copy-paste code block.
- (HIGH) Add internal links on first use of debugUrl, HLS, replay, WebRTC, and session viewer to the existing glossary entries, following the (@/glossary/...) convention used across the rest of the repo. — The article currently has zero internal links; every comparable article in the repo links its key terms, and these are exactly the terms answer-engine users search.
- (MEDIUM) Cross-link and differentiate from embed-live-and-past-browser-sessions.md. Keep this article the observability/incident-response take (replay-required incident gates, the Signals table) and point integration how-to to the sibling. — The two drafts cover the same APIs and will cannibalize each other in search and answer engines unless they have distinct angles and bidirectional links.


**Supporting material to add**
- Steel docs (live-sessions): headful WebRTC streaming at 25 fps H.264 is now the default, with the SAME debugUrl used for legacy headless via Chrome screencasting. Confirms the article's core differentiator.  _[where: Short answer / Why naive setups fail #1]_  (https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions)
- Steel docs (past-sessions): the full hls.js playback snippet, including Safari native HLS fallback and the steel-api-key xhrSetup. The article's code only fetches the manifest; linking the official playback example would save readers a step.  _[where: Recommended operating pattern step 2 (recording playback)]_  (https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions)
- Steel docs note that Steel records every session automatically, so the replay artifact exists by default — strengthens the article's argument that traces should be a required dependency.  _[where: Short answer (add a sentence)]_  (https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions)
- Repo glossary entry for debugUrl (canonical_questions: 'what is debugurl') — the natural internal-link anchor and the term answer-engine users will search.  _[where: First mention of session.debugUrl in the Short answer]_  (https://steel.dev/glossary/debug-url)
- Steel docs param-casing convention: TS SDK is camelCase (useProxy, solveCaptcha, stealthConfig, persistProfile, profileId), Python SDK is snake_case (use_proxy, solve_captcha). Useful to state if the article ever shows more create options.  _[where: Minimal instrumentation example footnote, if params are added]_  (https://docs.steel.dev/llms-full.txt)


**Broken / malformed links**
- `https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions` — None — resolves HTTP 200 and directly supports the live-embed/WebRTC/debugUrl claims.
- `https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions` — None — resolves HTTP 200 and directly supports the /v1/sessions/{id}/hls + steel-api-key claims.


---


### browserless-vs-steel — readiness 7/10


**Title:** Browserless vs Steel


**Priority issues**
- (HIGH) "Steel Cloud offers SOC 2 plus Files/Credentials boundaries" — SOC 2 is not publicly substantiated anywhere on steel.dev or docs.steel.dev as of July 2026. The sitemap has no /security, /trust, /trust-center, or /compliance page; docs.steel.dev/legal is a 404; the pricing page advertises only "HIPA-ready BAA" and "Enterprise SSO". By contrast Browserless explicitly advertises "SOC 2 Type II" on its pricing page.
  → *Fix:* Either (a) confirm Steel's current SOC 2 status internally and stand up a public /trust or /security page before publishing, then keep the line; or (b) until then, replace with: "Steel Cloud offers a HIPAA-ready BAA plus Files/Credentials boundaries, while self-hosted Steel Browser lets you stay on-prem if needed." Do not let the article assert a certification the public site does not back.
- (MEDIUM) The 0.89s average / 1.09s p95 benchmark is presented as plain fact ("Steel's remote benchmark holds at...", "in the open benchmark") with no link and no disclosure that it is Steel's own self-run test — and, critically, that Browserless was NOT one of the providers measured.
  → *Fix:* Link the benchmark and disclose provenance. Replace the line 30 sentence with: "In Steel's own self-reported remote benchmark (create → connect → visit a page → release across 5,000 runs on AWS us-east-1), Steel averages 0.89 s with a 1.09 s p95 and a 1.34 s p99 ([benchmark](https://steel.dev/blog/remote-browser-benchmark)); Browserless publishes no equivalent lifecycle benchmark, so size both in your own region before committing."
- (LOW) "release-all safety nets" (line 49) is descriptive prose, not the actual API. The real method — used consistently across this repo (puppeteer-with-steel.md, selenium-with-steel.md, playwright-scripts-pass-locally-fail-in-cloud.md) — is `sessions.releaseAll()`.
  → *Fix:* Change "Live view embeds, pause/resume via session state, `sessions.release()` discipline, release-all safety nets" to "Live view embeds, pause/resume via session state, `sessions.release()` discipline, and `sessions.releaseAll()` as a fleet-wide safety net".
- (LOW) The article never quantifies pricing for either side, even though both are publicly documented and citable — a missed opportunity for a piece explicitly written to rank in answer engines.
  → *Fix:* Add a short, dated pricing sentence. Browserless (verified Jul 2026, browserless.io/pricing): Free = 1k units/mo, 2 concurrent, 1-min session cap; Prototyping $25/mo; Starter $140/mo; Scale $350/mo (60-min max session, 90-day log retention). Steel (verified Jul 2026, steel.dev/pricing): Launch $0 + usage, Scale $250/mo + usage, Enterprise custom (1,000+ concurrent). Note the sharpest contrast: Browserless's longest session is 60 min (Scale) vs Steel's 24 h.


**Claim checks** (verified verdict shown)
- [ACCURATE] · statistic · Steel's remote benchmark holds at 0.89 second average and 1.09 second p95 for the create -> connect -> navigate -> release loop
  → Disclose provenance and link it: "In Steel's own self-reported remote benchmark (5,000 runs, AWS us-east-1), the create → connect → visit → release loop averages 0.89 s with a 1.09 s p95 and a 1.34 s p99. Browserless publishes no equivalent benchmark. ([source](https://steel.dev/blog/remote-browser-benchmark))"
  src: https://steel.dev/blog/remote-browser-benchmark
- [ACCURATE] · steel-product · 24 hour session ceilings
  src: https://steel.dev/pricing · https://steel.dev
- [ACCURATE] · steel-product · persistent Profiles ... persist login state up to 30 days
  → For precision, say "30 idle days" rather than "up to 30 days" — the clock resets on use.
  src: https://docs.steel.dev/overview/profiles-api/overview
- [ACCURATE] · steel-product · Credentials API injects secrets without exposing them to your agent, Files API handles uploads/downloads
  src: https://docs.steel.dev/overview/credentials-api/overview · https://docs.steel.dev/overview/files-api/overview
- [NEEDS-SOFTENING] · steel-product · Steel Cloud offers SOC 2 plus Files/Credentials boundaries  *(adversarially verified)*
  → Replace the Steel column text on line 88. CURRENT: "Steel Cloud offers SOC 2 plus Files/Credentials boundaries, while self-hosted Steel Browser lets you stay on-prem if needed". REPLACE WITH: "Steel Cloud ships HIPAA-ready BAA and Enterprise SSO plus Files/Credentials boundaries, while self-hosted Steel Browser lets you stay on-prem if needed". (Rationale: removes the unsubstantiated SOC 2 attestation and states what Steel actually advertises on its pricing page; keeps the real Files/Credentials API differentiator.)
  src: https://steel.dev/sitemap.xml · https://steel.dev/pricing
- [ACCURATE] · steel-product · live viewer plus MP4 [replay] / MP4/HLS replay, structured Agent Logs, embed surfaces on every managed plan
  → If only HLS is actually downloadable, say "HLS replay" rather than "MP4/HLS" to match the documented format.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions · https://steel.dev/blog/agent-logs
- [ACCURATE] · steel-product · Managed stealth profiles, CAPTCHA API, regional proxy pools, mobile mode, plus the option to bring your own proxies
  src: https://docs.steel.dev/overview/sessions-api/mobile-mode · https://steel.dev
- [ACCURATE] · steel-product · open-source self-host "Steel Browser" / swap between self-hosted Steel Browser and Steel Cloud without rewriting automation code
  src: https://steel.dev/pricing · https://docs.steel.dev/overview/self-hosting/docker
- [ACCURATE] · steel-product · Steel Local is effectively single-session while Steel Cloud scales into the hundreds
  → Optionally: "Steel Local is effectively single-session while Steel Cloud scales from tens to 1,000+ concurrent sessions on Enterprise."
  src: https://steel.dev/pricing
- [ACCURATE] · steel-product · sessions.release() discipline, release-all safety nets / pause/resume via session state
  → Use the real symbol: "`sessions.releaseAll()` as a safety net".
  src: https://docs.steel.dev/overview/sessions-api/human-in-the-loop
- [ACCURATE] · steel-product · Neutral CDP endpoint works with Playwright, Puppeteer, Selenium, Browser Use, Stagehand, plus Steel SDKs
  src: https://docs.steel.dev/integrations/playwright
- [ACCURATE] · competitor · BrowserQL, REST shortcuts like /content and /screenshot
  src: https://docs.browserless.io/browserql · https://docs.browserless.io/rest-apis
- [ACCURATE] · competitor · Browserless prices by compute units, gives you a 1,000 unit free tier, and lets you self-host for privacy
  → Add that the free tier caps sessions at 1 minute and concurrency at 2 — material context for "free tier".
  src: https://www.browserless.io/pricing
- [ACCURATE] · competitor · Native integrations with LangChain, Zapier, n8n, REST-first scraping services
  src: https://docs.browserless.io
- [NEEDS-SOFTENING] · competitor · Browserless ... session replay API; you own log capture, replay exports, and human-in-loop wiring  *(adversarially verified)*
  → Soften all three locations to acknowledge Browserless captures and retains this data per plan tier (1/7/30/90 days) and hosts Session Replay in its dashboard; reserve "on you" for the genuinely-user-owned parts (long-term/audit retention beyond the plan window, approval wiring, application-level error logging). Exact edits:

LINE 30 (Intro) — replace:
"but you own log capture, replay exports, and human-in-loop wiring even if you lean on its session replay API"
with:
"but beyond its plan-tiered session and log retention (1/7/30/90 days on Free/Prototyping/Starter/Scale), the long-term audit trail, approval wiring, and human-in-loop flow stay on you even if you lean on its session replay API"

LINE 46 (Observability table, Browserless cell) — replace:
"Session replay API, debugger UI, logs, REST outputs; you choose where to store recordings and how long to keep them"
with:
"Session replay (dashboard-hosted, 1/7/30/90-day retention by plan), debugger UI, logs, REST outputs; screen-recording WebM files export to your code, but replay and log storage beyond the plan window is on you"

LINE 85 (Evidence burden row, Browserless cell) — replace:
"Replay, logs, and artifacts live wherever you store them; compliance burden stays internal"
with:
"Replay and logs persist in Browserless for 1 to 90 days by plan; anything beyond that window, plus approval chains and audit packaging, is yours to store"
  src: https://www.browserless.io/pricing · https://docs.browserless.io/baas/monitor-sessions/session-replay
- [ACCURATE] · competitor · Managed Browsers-as-a-Service plus Docker/commercial licenses you can run in your own VPC or serverless workers
  src: https://www.browserless.io/pricing
- [ACCURATE] · competitor · Browserless anti-bot: BrowserQL stealth routes, CAPTCHA solving, residential proxy support, fingerprint tuning you can script
  src: https://www.browserless.io/pricing · https://docs.browserless.io/browserql
- [ACCURATE] · competitor · No public benchmark (Browserless lifecycle speed); speed depends on region and reserved units
  src: https://steel.dev/blog/remote-browser-benchmark · https://www.browserless.io


**Top improvements**
- (HIGH) Resolve the SOC 2 claim before publishing — either verify internally + add a public /trust page, or downgrade the line to the documented "HIPAA-ready BAA." This is the single biggest exposure in the draft. — It is the only claim I could not substantiate against any Steel primary source, and a false compliance attestation on Steel's own blog creates direct legal/procurement risk.
- (HIGH) Link the benchmark and label it as Steel's self-reported test that did not include Browserless; add the p99 (1.34s) and sample size (5,000 runs) for defensibility. — The article targets answer-engine citations; an unlinked, unattributed benchmark reads as independent and will be quoted that way. Disclosing provenance costs one clause and removes the risk.
- (MEDIUM) Add concrete, dated pricing for both sides (Browserless unit tiers + session caps; Steel Launch/Scale/Enterprise). The "Pricing & limits" row is currently the vaguest cell in the table. — Concrete numbers are the most-cited payload in comparison queries, and they are all publicly verifiable as of Jul 2026.


**Supporting material to add**
- Browserless exact plan ladder (verified Jul 2026, browserless.io/pricing): Free = 1k units/mo / 2 concurrent / 1-min session / 1-day retention; Prototyping $25/mo / 10+5 concurrent / 20k units / 15-min session / 7-day retention; Starter $140/mo / 40+10 / 180k units / 30-min / 30-day; Scale $350/mo / 100+20 / 500k units / 60-min / 90-day. A "unit" = up to 30s of browser time; residential proxy 6 units/MB, datacenter 2 units/MB, captcha 10 units/solve.  _[where: Comparison table "Pricing & limits" row and/or a new one-line "Pricing reality" sentence under "Deployment and billing math".]_  (https://www.browserless.io/pricing)
- Steel's current public pricing (verified Jul 2026, steel.dev/pricing, marked "UPDATED SEP 2025"): Launch $0/mo + usage ($30 one-time credits); Scale $250/mo + usage ($100 credits/mo, Dedicated Slack, Enterprise SSO, HIPA-ready BAA); Enterprise custom (1,000+ concurrent, Stealth Browser, reserve pools). Homepage claims "<1s Avg. Session Start Time" and "800,000+ Browser Hours Served". Note: the docs.steel.dev/overview/pricing and /overview/pricing-limits URLs both 404 — the canonical limits page is not at the paths sibling articles cite.  _[where: "Deployment and billing math" section and the Pricing & limits table row.]_  (https://steel.dev/pricing)
- The session-length gap is the sharpest factual differentiator and is underplayed. Browserless caps session time at 1 min (Free) up to 60 min (Scale); Steel allows up to 24 h. For long-running agent workflows with human approvals this is concrete.  _[where: "State and trust requirements" or "When to choose Steel" — alongside the existing 24-hour point.]_  (https://www.browserless.io/pricing)
- The benchmark's full distribution and methodology (steel.dev/blog/remote-browser-benchmark, verified 200): 5,000 runs/provider on AWS EC2 us-east-1, create→connect→visit google.com→release; Steel 894ms avg / 867 median / 1,090 p95 / 1,340 p99, 100% success; speedups cited as 1.70× vs Kernel, 1.88× vs Browserbase, 4.09× vs Hyperbrowser, 8.95× vs AnchorBrowser.  _[where: Intro benchmark sentence and the Lifecycle-speed table cell.]_  (https://steel.dev/blog/remote-browser-benchmark)
- Browserless's own compliance posture for the competitive contrast: it publicly advertises SOC 2 Type II, GDPR Compliant, HIPAA Compliant, and DPA on its pricing/trust page. If Steel cannot match SOC 2 publicly, the article should not imply parity.  _[where: Trade-offs "Compliance posture" row.]_  (https://www.browserless.io/pricing)


**Broken / malformed links**
- `steel.dev/blog/remote-browser-benchmark` — Not broken (returns 200), but the article references "the open benchmark" / "Steel's remote benchmark" in prose (lines 30, 44, 92) WITHOUT linking it. A load-bearing statistic with no citation is the main link-quality defect in the draft. → Add the hyperlink https://steel.dev/blog/remote-browser-benchmark at first mention (intro, line 30) and in the Lifecycle-speed table cell.


---


### chrome-extensions-for-browser-agents — readiness 7/10


**Title:** Chrome Extensions for Browser Agents


**Priority issues**
- (HIGH) Code bug: client.extensions.list() is treated as a directly-iterable array. The real SDK (verified in v0.16.0 and v0.18.0) returns ExtensionListResponse = { count: number, extensions: Array<Extension> }, so calling .find() on the response object throws.
  → *Fix:* Replace step 3 with:
```typescript
const { extensions } = await client.extensions.list();
const redactorId = extensions.find((ext) => ext.name === 'Redactor')?.id;
```
Note: real extension IDs are shaped like `ext_12345` (per SDK docstrings), and each Extension has { id, name, createdAt, updatedAt }.
- (HIGH) Wrong CLI command and wrong tool for capturing visual evidence: the article says `Capture a `snapshot -i` so the evidence includes the extension's overlay or output.` `snapshot` is not a top-level steel command, and `steel browser snapshot -i` takes an accessibility-tree snapshot (interactive elements only — text/refs, no pixels). It will NOT capture a UI overlay or rendered output.
  → *Fix:* Use the screenshot command for visual evidence:
```bash
steel browser screenshot -f --annotate   # full-page PNG; -f full page, --annotate labels interactive elements
```
For DOM/structure-only inspection you can additionally run `steel browser snapshot -i` (note the full command — `snapshot` is a subcommand of `steel browser`).
- (MEDIUM) `Steel's Extensions API (currently in beta)` is stated twice (Short answer and trade-offs table) but appears stale. The repo's own published glossary entry for Extensions API (status: published, updated 2026-07-13) never mentions beta, and both steel-sdk v0.16.0 (2025-12-05) and v0.18.0 ship Extensions as a fully-versioned, stable resource with no beta markers.
  → *Fix:* Verify https://docs.steel.dev/overview/extensions-api/overview at publish time. If no longer marked beta, drop `currently in beta` from the Short answer and change the trade-offs row from `Extensions are in beta; expect changes and keep a fallback path ready` to `Extensions are a newer API; version-pin your SDK and keep a fallback path ready`.


**Claim checks** (verified verdict shown)
- [ACCURATE] · steel-product · Steel's Extensions API lets you upload an extension once via .zip, .crx, or a Chrome Web Store URL
  src: file:///Users/nikola/dev/steel/steel-main/node_modules/steel-sdk/resources/extensions.d.ts · file:///Users/nikola/dev/steel/steel-main/node_modules/steel-sdk/resources/extensions.js
- [NEEDS-SOFTENING] · steel-product · Inject extensions by passing `extensionIds` or the shortcut `all_ext` when you create the session  *(adversarially verified)*
  → In /Users/nikola/dev/steel/llms-steel-dev/content/articles/chrome-extensions-for-browser-agents.md, reword line 29 so `all_ext` is framed as a value inside the array rather than an alternative to `extensionIds`. Replace: "inject it into any session by passing `extensionIds` or the shortcut `all_ext` when you create the session." with: "inject it into any session by passing `extensionIds` (an array of extension IDs, or the sentinel `['all_ext']` to load every extension in your org) when you create the session." This matches the official docs' code example `extensionIds: ['all_ext']` and the article's own correct code samples on lines 66 and 93.
  src: https://docs.steel.dev/overview/extensions-api/overview · https://docs.steel.dev/cookbook/extensions
- [CONFIRMED-ACCURATE] · steel-product · Steel's Extensions API is currently in beta  *(adversarially verified)*
  src: https://docs.steel.dev/overview/extensions-api/overview · file:///Users/nikola/dev/steel/llms-steel-dev/content/glossary/extensions-api.md
- [ACCURATE] · steel-product · Methods exist: client.extensions.upload/list/update/delete/deleteAll
  src: file:///Users/nikola/dev/steel/steel-main/node_modules/steel-sdk/resources/extensions.d.ts
- [CONFIRMED-INACCURATE] · steel-product · `const extensions = await client.extensions.list(); const redactorId = extensions.find(...)`  *(adversarially verified)*
  → Replace the snippet so `.find()` operates on the nested `extensions` array, not the response object. Recommended edit (keeps the variable named `extensions` referring to the array, so the surrounding `.find(...)` line stays valid):

const { extensions } = await client.extensions.list();
const redactorId = extensions.find((e) => e.name === "redactor")?.id;

This matches the official Steel cookbook pattern at https://docs.steel.dev/cookbook/extensions: `(await client.extensions.list()).extensions.find(...)`.
  src: https://docs.steel.dev/cookbook/extensions · https://docs.steel.dev/overview/extensions-api/overview
- [ACCURATE] · steel-product · Attach via `client.sessions.create(extension_ids=[...])` (Python, snake_case)
  → Consider a one-line note that real IDs are ext_ prefixed (e.g. ext_12345), since the table shows name-like strings ('helper_id', 'policy_overlay').
  src: file:///Users/nikola/dev/steel/steel-main/node_modules/steel-sdk/resources/sessions/sessions.d.ts
- [ACCURATE] · steel-product · Steel stores extensions at the org level
  src: file:///Users/nikola/dev/steel/steel-main/node_modules/steel-sdk/resources/extensions.js
- [ACCURATE] · steel-product · Use `steel browser live` or the debug URL to confirm the extension shows up in chrome://extensions
  src: steel CLI v0.4.4 local install — `steel browser --help`
- [CONFIRMED-INACCURATE] · steel-product · Capture a `snapshot -i` so the evidence includes the extension's overlay or output  *(adversarially verified)*
  → Replace the line "- Capture a `snapshot -i` so the evidence includes the extension's overlay or output." with "- Capture a `steel browser screenshot` so the evidence includes the extension's overlay or output." (in content/articles/chrome-extensions-for-browser-agents.md, step 5, line 72). `steel browser snapshot` produces an accessibility-tree text snapshot, not a visual image, so it cannot record an extension's rendered overlay; `steel browser screenshot` is the correct command for pixel/visual evidence.
  src: local: steel 0.4.4 CLI binary — `steel --help` (no top-level snapshot; lists screenshot + browser), `steel snapshot -i` -> 'error: unrecognized subcommand snapshot; tip: a similar subcommand exists: screenshot', `steel browser --help` (lists snapshot + screenshot), `steel browser snapshot --help` ('Take an accessibility tree snapshot'; -i/--interactive = 'Show only interactive elements'), `steel browser screenshot --help` ('Take a screenshot'; --full-page/--format/--output) · https://docs.steel.dev/cli/reference (returned HTTP 404 'Page not found' — not a valid URL; the site's own meta tag redirects to https://docs.steel.dev/llms.txt as the LLM-optimized index)
- [ACCURATE] · technical · Extensions only load at startup (no hot-reloading mid-session)
  src: file:///Users/nikola/dev/steel/steel-main/node_modules/steel-sdk/resources/sessions/sessions.d.ts
- [ACCURATE] · technical · Permissions declared in manifest.json apply to every session that loads the extension
  → Add a short citation to Chrome's permissions docs to strengthen the claim.
  src: https://developer.chrome.com/docs/extensions/develop/concepts/permissions


**Top improvements**
- (HIGH) Fix the list() destructuring (High) and swap snapshot->screenshot (High) — these are the two issues that would actively mislead a developer copy-pasting the guide. — A reference article lives or dies on whether its code runs; both snippets fail as written.
- (MEDIUM) Resolve the beta status before publish: either confirm docs.steel.dev still labels Extensions beta, or strike 'currently in beta' (twice) so the evergreen article matches the stable SDK and the published glossary. — Self-contradiction with the team's own glossary and the shipped SDK undersells a stable feature.
- (MEDIUM) Tighten the all_ext wording: it is a sentinel value inside extensionIds (['all_ext']), not a sibling parameter — the current 'extensionIds OR the shortcut all_ext' framing reads as two separate knobs. — Precision on the param model matters for an answer-engine-optimized reference.


**Supporting material to add**
- Steel SDK reference confirming the Extensions API surface (upload/list/update/delete/deleteAll/download), org-level scoping, and .zip/.crx/URL upload params — the authoritative primary source for every method/param claim in the article.  _[where: Short answer or Next steps, as a one-line pointer alongside the docs link]_  (https://github.com/steel-dev/steel-node)
- As of steel-sdk v0.18.0, the Profiles API also accepts extensionIds (profiles.d.ts: `extensionIds: Array<string> | null`), meaning a named Profile can carry a fixed set of extensions alongside cookies/storage. This is a newer capability that strengthens the 'upload once, reuse' thesis.  _[where: Instead of patching scripts forever — as a second reuse path after sessions]_  (file:///Users/nikola/dev/steel/leaderboard/node_modules/.pnpm/steel-sdk@0.18.0/node_modules/steel-sdk/resources/profiles.d.ts)
- Chrome's official extensions documentation for the lifecycle/permissions claims the article asserts without citation (extensions load at browser startup; manifest permissions apply wherever the extension runs; content scripts and background workers).  _[where: Implementation path step 1 and the Guardrails table]_  (https://developer.chrome.com/docs/extensions/develop/concepts/service-workers)
- Manifest V3 migration context: Chrome Web Store removed MV2-only extensions, so some marketplace add-ons referenced via Chrome Web Store URL may no longer install. Worth a trade-off note given the article's marketplace-extension use case (password managers, translators).  _[where: Guardrails and trade-offs table — a new row]_  (https://developer.chrome.com/docs/extensions/develop/migrate)


**Broken / malformed links**
- `[CDP](@/glossary/cdp.md)` — None — link target exists at content/glossary/cdp.md (verified). → No change needed.
- `https://docs.steel.dev/overview/extensions-api/overview` — Not live-verified in this pass — WebSearch/WebFetch were rate-limited until 2026-07-23. However the URL is well-formed and matches the canonical external_ref the team already uses in glossary/extensions-api.md, so it is very likely correct. No malformed encoding or missing hyphens. → Re-resolve this URL manually before publish (curl -I) to confirm it 200s; keep it as-is otherwise.
- `https://chromewebstore.google.com/detail/...` — Illustrative placeholder, not a real link. Domain is correct — Chrome Web Store migrated to chromewebstore.google.com (from chrome.google.com/webstore) and that is the current canonical form as of 2025-2026. → No change needed; it is clearly a placeholder example.


---


### claude-computer-use-with-steel — readiness 4/10


**Title:** Claude Computer Use With Steel


**Priority issues**
- (BLOCKER) Both code samples will not run: they forward Anthropic's computer-use action and fields to Steel verbatim (`action: block.input.action, ...block.input, screenshot: true`) with no translation. Steel's sessions.computer API uses a DIFFERENT action vocabulary and field names than Anthropic.
  → *Fix:* Replace the body of the tool_use branch with an explicit translator. Skeleton: `function toSteel(input) { switch(input.action){ case 'left_click': case 'right_click': case 'middle_click': return {action:'click_mouse', button: input.button ?? 'left', coordinates: input.coordinate}; case 'mouse_move': return {action:'move_mouse', coordinates: input.coordinate}; case 'type': return {action:'type_text', text: input.text}; case 'key': case 'hold_key': return {action:'press_key', keys: typeof input.key==='string'?[input.key]:input.keys}; case 'scroll': return {action:'scroll', coordinates: input.coordinate, scroll_y: input.scrollDirection==='up'?-3:3}; case 'wait': return {action:'wait', duration: input.duration ?? 1}; case 'screenshot': return {action:'take_screenshot'}; default: return {action:'take_screenshot'}; } }` then `const screenshot = await steel.sessions.computer(session.id, { ...toSteel(block.input), screenshot: true });`. Mirror the same map in the Python loop.
- (HIGH) Stale Anthropic tool/beta identifiers: article uses `computer_20250124` and `betas: ["computer-use-2025-01-24"]` throughout (tools table, both code samples, and the 'Not yet ideal when' bullet).
  → *Fix:* Global replace: `computer_20250124` -> `computer_20251124` and `computer-use-2025-01-24` -> `computer-use-2025-11-24` in the 'Tool contract' table row, both code samples, and the trade-offs bullet ('Your Anthropic org does not yet have computer-use-2025-11-24 access').
- (HIGH) Model id `claude-sonnet-4-5` is stale and is not in the supported-model list for the current computer-use tool.
  → *Fix:* Change `model: "claude-sonnet-4-5"` to `model: "claude-sonnet-5"` (or `claude-opus-4-8`) in both samples, and add a one-liner: 'Check the Steel leaderboard (leaderboard.steel.dev) for the current computer-use-capable Claude models.'
- (HIGH) `steel.sessions.logs.list(session.id)` is referenced as the 'Agent logs' hook, but no such method exists in steel-sdk (v0.18.0 TS / v0.19.0 Python).
  → *Fix:* Replace the 'Agent logs' row's How-to with a real API: use `steel.sessions.events(session.id)` (RRWeb event stream) and/or the dashboard's 'Agent Traces' tab, or the Captchas status API. Example replacement: 'Agent traces | `steel.sessions.events(session.id)` (RRWeb events) plus the Agent Traces tab in the dashboard | Reconstruct click/DOM history alongside Anthropic transcripts'.
- (MEDIUM) 'Downloadable MP4/HLS' replay claim is not supported by Steel's docs.
  → *Fix:* Change 'Same viewer URL after release plus downloadable MP4/HLS' to 'Same viewer URL after release, served as an embeddable HLS stream'.
- (MEDIUM) Steel Computer API action list says 'click'; Steel's real action is 'click_mouse'.
  → *Fix:* Change the row to: 'Deterministic mapping for click_mouse, move_mouse, type_text, press_key, scroll, wait, take_screenshot' so the mapping claim matches the SDK's SessionComputerParams variants.
- (LOW) Intro implies any reader gets 24h sessions; that ceiling is Enterprise-only.
  → *Fix:* Soften the intro to 'sub-second sessions that last up to 24 hours on Enterprise (15 min on Launch, 1 hour on Scale)'.


**Claim checks** (verified verdict shown)
- [STALE] · technical · Pair it with Claude's `computer_20250124` tool (and the `computer-use-2025-01-24` beta).  *(adversarially verified)*
  → Replace the two identifiers throughout the article: `computer_20250124` -> `computer_20251124`, and `computer-use-2025-01-24` -> `computer-use-2025-11-24`. For the specific quoted sentence, change "Pair it with Claude's `computer_20250124` tool (and the `computer-use-2025-01-24` beta)." to "Pair it with Claude's `computer_20251124` tool (and the `computer-use-2025-11-24` beta)." The same substitution applies at every other occurrence in /Users/nikola/dev/steel/llms-steel-dev/content/articles/claude-computer-use-with-steel.md: the tool `type` appears at lines 28, 36, 73, and 144, and the beta header string appears at lines 85, 162, and 221 (the last is the access note "Your Anthropic org does not yet have `computer-use-2025-01-24` access", which should become `computer-use-2025-11-24`).
  src: https://docs.steel.dev/integrations/claude-computer-use · https://docs.steel.dev/cookbook/claude-computer-use
- [CONFIRMED-ACCURATE] · competitor · Use model `claude-sonnet-4-5` in the Messages call.  *(adversarially verified)*
  src: https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/computer-use-tool · file:///Users/nikola/dev/steel/llms-steel-dev/content/articles/claude-computer-use-with-steel.md
- [CONFIRMED-INACCURATE] · steel-product · Steel Computer API supports actions click, press_key, type_text, scroll, take_screenshot, and the example forwards `action: block.input.action` directly to `steel.sessions.computer`.  *(adversarially verified)*
  → Fix the action vocabulary and replace the verbatim-forwarding code with an explicit translation. Three edits:

(1) "What Steel adds" table — Computer API bridge row. Replace:
| Computer API bridge | Deterministic mapping for `click`, `press_key`, `type_text`, `scroll`, `take_screenshot` | Forward each tool call to `steel.sessions.computer(session.id, body)` and return the screenshot data URI |
with:
| Computer API bridge | Steel's Computer API uses its own action vocabulary — `move_mouse`, `click_mouse`, `drag_mouse`, `scroll`, `press_key`, `type_text`, `wait`, `take_screenshot`, `get_cursor_position` — and its own field names, so you translate each Claude action into the matching Steel call (do not forward Claude's payload as-is) | Map Claude's action and fields to `steel.sessions.computer(session.id, body)` and return the screenshot data URI |

(2) Example TypeScript loop — replace the forwarding block:
  const screenshot = await steel.sessions.computer(session.id, {
    action: block.input.action,
    ...block.input,
    screenshot: true,
  });
with a translation that maps Anthropic actions to Steel actions/fields, e.g.:
  const i = block.input;
  const coords = i.coordinate ?? i.start_coordinate;
  let body: Record<string, unknown> = { screenshot: true };
  switch (i.action) {
    case "left_click": case "right_click": case "middle_click":
      body = { action: "click_mouse", button: i.action.replace("_click", ""), coordinates: coords, ...body }; break;
    case "mouse_move":
      body = { action: "move_mouse", coordinates: coords, ...body }; break;
    case "left_click_drag":
      body = { action: "drag_mouse", path: [i.start_coordinate, i.coordinate], ...body }; break;
    case "type":
      body = { action: "type_text", text: i.text, ...body }; break;
    case "key":
      body = { action: "press_key", keys: [i.key], ...body }; break;
    case "scroll":
      body = { action: "scroll", coordinates: coords, delta_y: i.scroll_direction === "down" ? i.scroll_amount : -i.scroll_amount, ...body }; break;
    case "wait":
      body = { action: "wait", duration: i.duration ?? 1, ...body }; break;
    case "cursor_position":
      body = { action: "get_cursor_position", ...body }; break;
    default:
      body = { action: "take_screenshot", ...body }; // screenshot / hold_key / unknown
  }
  const screenshot = await steel.sessions.computer(session.id, body as any);

(3) Example Python loop — replace:
        resp = steel.sessions.computer(session.id, {**block.input, "screenshot": True})
with the same translation logic in Python (a helper mapping action -> dict of Steel fields), since {**block.input, "screenshot": True} has the identical verbatim-forwarding bug.
  src: https://registry.npmjs.org/steel-sdk (latest = 0.18.0) · steel-sdk 0.18.0 tarball, resources/sessions/sessions.d.ts — SessionComputerParams union (Variant0 move_mouse, Variant1 click_mouse, Variant2 drag_mouse, Variant3 scroll, Variant4 press_key, Variant5 type_text, Variant6 wait, Variant7 take_screenshot, Variant8 get_cursor_position)
- [CONFIRMED-INACCURATE] · steel-product · Agent logs hook: `steel.sessions.logs.list(session.id)`.  *(adversarially verified)*
  → Replace "Agent logs hook: `steel.sessions.logs.list(session.id)`." with "Recorded session events hook: `steel.sessions.events(session.id)` (RRWeb-format trace/replay events)." Alternatively, if the row is specifically about live observability rather than recorded traces: "Live session state hook: `steel.sessions.live_details(session.id)`."
  src: https://pypi.org/pypi/steel-sdk/json · https://github.com/steel-dev/steel-python
- [NEEDS-SOFTENING] · steel-product · Replay evidence is 'the same viewer URL after release plus downloadable MP4/HLS'.  *(adversarially verified)*
  → Replace the cell text "the same viewer URL after release plus downloadable MP4/HLS" with: "the same viewer URL after release, plus a streamable MP4-backed HLS recording (GET /v1/sessions/{id}/hls)". This keeps the accurate viewer-URL and HLS facts, drops the unsupported "downloadable MP4" framing, and reflects that MP4 is the backing format served via HLS rather than a file download.
  src: https://docs.steel.dev/llms-full.txt · https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions
- [ACCURATE] · steel-product · `steel.sessions.captchas.status(session.id)` returns CAPTCHA solving status to pause/resume Claude.
  src: https://registry.npmjs.org/steel-sdk/-/steel-sdk-0.18.0.tgz · https://docs.steel.dev/llms-full.txt
- [ACCURATE] · steel-product · Create a session via `steel.sessions.create({dimensions, blockAds, timeout})` (TS) / `dimensions, block_ads, api_timeout` (Python); log `session.sessionViewerUrl` / `session.session_viewer_url`; always call `steel.sessions.release(session.id)`.
  src: https://registry.npmjs.org/steel-sdk/-/steel-sdk-0.18.0.tgz · https://docs.steel.dev/llms-full.txt
- [ACCURATE] · steel-pricing · Sessions are sub-second to start and last up to 24 hours; Steel's 24h session ceiling applies without Enterprise increases.
  → Clarify in the intro that 24h is Enterprise (Launch 15 min, Scale 1 hour) so the headline does not overpromise.
  src: https://docs.steel.dev/llms-full.txt · https://docs.steel.dev/overview/pricing
- [ACCURATE] · steel-product · Install `steel-sdk` (Python) and import via `from steel import Steel`; TS uses `import { Steel } from "steel-sdk"`.
  src: https://pypi.org/pypi/steel-sdk/json · https://registry.npmjs.org/steel-sdk/latest
- [ACCURATE] · steel-product · Use `useProxy` and `region` as Steel session-creation options for hostile sites.
  src: https://docs.steel.dev/llms-full.txt · https://registry.npmjs.org/steel-sdk/-/steel-sdk-0.18.0.tgz
- [ACCURATE] · steel-product · Internal glossary links: (@/glossary/computer-use.md), (@/glossary/replay.md), (@/glossary/proxies.md).
- [CONFIRMED-INACCURATE] · steel-product · Both TypeScript and Python quickstarts from docs.steel.dev/integrations/claude-computer-use run end to end.  *(adversarially verified)*
  → Replace with: "Both the TypeScript and Python starters in the Steel + Claude Computer Use recipe (docs.steel.dev/cookbook/claude-computer-use) run end to end." This points at the correct URL (the cookbook recipe, linked from the integration page) where full runnable TS and Python starters actually exist. Optionally broaden to "the TypeScript, Python, Rust, and Go starters" since the recipe now offers four languages, but TS + Python is the accurate minimal statement.
  src: https://docs.steel.dev/integrations/claude-computer-use · https://docs.steel.dev/cookbook/claude-computer-use


**Top improvements**
- (HIGH) Make the code samples actually run by adding an explicit Anthropic-to-Steel action+field translator (see blocker fix). Without it the article's central artifact is decorative. — A developer-reference article that ranks in answer engines will be copy-pasted; non-functional loops damage trust and generate support tickets.
- (HIGH) Update the Anthropic layer wholesale: computer_20251124, computer-use-2025-11-24, and a current model (claude-sonnet-5 or claude-opus-4-8). One editorial sweep covers table, both samples, and the beta-access bullet. — Aligns the article with both Anthropic's and Steel's own current docs and avoids contradicting Steel's integration page.
- (HIGH) Replace the invented sessions.logs.list with real surfaces: sessions.events(id) for the RRWeb event stream, plus the dashboard Agent Traces tab and the captchas status API. — Calling a non-existent method is a hard error; the real surfaces exist and serve the same audit/evidence goal.


**Supporting material to add**
- Anthropic's official computer-use documentation is the canonical source for the tool type, beta header, supported models, and action schema. It confirms computer_20251124 / computer-use-2025-11-24 and the supported model list (Sonnet 5, Opus 4.8/4.7/4.6, Sonnet 4.6).  _[where: Add as the primary external reference at the end of the article (and in frontmatter external_refs).]_  (https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool)
- Steel's Claude Computer Use cookbook recipe is the full runnable starter (the integration page itself only shows a snippet).  _[where: Go-live checklist and a 'Full runnable starter' callout under the Example loops.]_  (https://docs.steel.dev/llms-full.txt)
- Steel's pricing page documents the tiered session ceilings (Launch 15 min, Scale 1 hour, Enterprise 24 hours), concurrency (10/100/1000+), and RPM (60/600/custom), giving citable grounding for the trade-offs section.  _[where: Footnote/link in the 'Not yet ideal when' bullet about the 24h ceiling and concurrency budget.]_  (https://docs.steel.dev/overview/pricing)
- Steel's model leaderboard tracks current computer-use-capable models, which drift frequently; useful since the article currently pins a stale model id.  _[where: Near the model line in both code samples and in the tool-contract table.]_  (https://leaderboard.steel.dev/)
- Steel's CAPTCHA recipe documents the poll-then-solve pattern using sessions.captchas.status() and sessions.captchas.solve(), including the per-page status response shape (isSolvingCaptcha, tasks, url).  _[where: The 'CAPTCHA status' row of the observability table and the Anti-bot stack row.]_  (https://docs.steel.dev/llms-full.txt)



---


### embed-live-and-past-browser-sessions — readiness 8/10


**Title:** Embed Live and Past Browser Sessions in Your App


**Priority issues**
- (HIGH) The HLS player sample code contradicts the article's own security guardrail. The snippet sets `xhr.setRequestHeader("steel-api-key", window.STEEL_API_KEY)` while loading the playlist from a local signed URL (`/signed/steel/sessions/e4d6/hls.m3u8`). Putting the key in `window.STEEL_API_KEY` ships the Steel API key to the browser unchanged — exactly what guardrail #4 ("Do not ship your Steel API key to the browser unchanged") warns against. Readers who copy-paste will leak their key.
  → *Fix:* Pick one model and make the code match it. Recommended (proxy via your backend, no key in browser): remove the xhrSetup line and have your backend both fetch and rewrite the manifest+segments so the player only ever calls your own origin:
```html
<script type="module">
  import Hls from "https://cdn.jsdelivr.net/npm/hls.js@^1.5.0/dist/hls.mjs";
  const manifestUrl = "/api/sessions/e4d6/hls.m3u8"; // your backend proxies api.steel.dev with the key server-side
  const video = document.getElementById("player");
  if (Hls.isSupported()) {
    const hls = new Hls();          // no xhrSetup, no key in the browser
    hls.loadSource(manifestUrl);
    hls.attachMedia(video);
  } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = manifestUrl;
  }
</script>
```
Then in step 1, emphasize: your backend adds the `steel-api-key` header when it forwards the request to `https://api.steel.dev/v1/sessions/{id}/hls`; the browser never sees the key.
- (HIGH) The article promotes replaying past sessions for audits/walkthroughs but never mentions that Steel deletes session recordings on a plan-gated schedule: 7 days on Launch, 14 days on Scale, custom on Enterprise (verified on the Pricing/Limits page, June 2026). An audit use case on Launch loses the HLS recording after a week.
  → *Fix:* Add a guardrail bullet and a note in the 'Embed past sessions' section. Bullet: '**Recordings are retention-limited.** Steel keeps session data for 7 days on Launch, 14 days on Scale, and a custom window on Enterprise — copy any HLS/MP4 you need for long-term evidence into your own storage before the window expires.' Optionally in step 1: 'For audit retention beyond your plan window, download the MP4 from the playlist and store it in your own object store.'
- (MEDIUM) No mention of plan-level max session time, which caps how long a live embed can run: 15 minutes on Launch, 1 hour on Scale, up to 24 hours on Enterprise (Pricing/Limits page, verified June 2026). The article only states the 5-minute default, so a Launch reader who raises `timeout` to keep a live iframe open will be surprised when the session is killed at 15 min.
  → *Fix:* In the 'Trade-offs and guardrails' section, expand the timeout bullet: '**Sessions expire, and plans cap them.** The default session timeout is 5 minutes; raise it with `timeout` (ms), but your plan still enforces a hard ceiling — 15 min on Launch, 1 hr on Scale, up to 24 hrs on Enterprise.'
- (MEDIUM) `client.sessions.create({ name: "qa-checkout" })` uses a `name` parameter that does not exist on `SessionCreateParams` in steel-sdk 0.18.0 (confirmed from the published type definitions). Real optional fields include timeout, inactivityTimeout, useProxy, solveCaptcha, userAgent, persistProfile, profileId, region, etc.
  → *Fix:* Drop the arg or use a real one, matching Steel's own live-sessions doc (which calls `client.sessions.create()` with no args). Simplest:
```ts
const session = await client.sessions.create();
```
Or, to show a real option:
```ts
const session = await client.sessions.create({ timeout: 600000 }); // 10-minute session
```
- (LOW) 'Default idle timeout is 5 minutes' misnames the feature. Per Steel's session-lifecycle doc, 5 minutes is the default session **timeout** (hard lifetime); the separate **inactivityTimeout** (which is what 'idle' implies) is OFF by default and must be opted into. A session actually keeps running even when nothing is driving it.
  → *Fix:* Reword the guardrail: '**Sessions expire.** The default session timeout is 5 minutes of lifetime (raise it with the `timeout` parameter, in milliseconds). If the iframe goes blank, confirm the session is still running or restart it. Note: an inactivity-based release is off by default — set `inactivityTimeout` if you want idle sessions to end early.'
- (LOW) 'Steel defaults to 600 px tall for readability' frames the iframe height as a Steel-enforced default. It is not — 600px is just the example height in Steel's docs; the embedder controls the iframe's height/width and can size it freely.
  → *Fix:* Reword: 'Give the iframe explicit width and height so the WebRTC stream never collapses (Steel's own examples use 600px tall, but you can size it to fit your layout).'
- (LOW) `new Steel({ apiKey: process.env.STEEL_API_KEY })` does not match the SDK's option name, which is `steelAPIKey` (steel-sdk 0.18.0). The constructor only destructures `steelAPIKey`, so `apiKey` is silently dropped; the snippet works only because `STEEL_API_KEY` is read from the env. Note: Steel's own embed-sessions docs have the same divergence, so the article matches the docs but not the SDK.
  → *Fix:* Use the SDK's real option: `const client = new Steel({ steelAPIKey: process.env.STEEL_API_KEY });` (This also fixes the latent bug if STEEL_API_KEY is ever unset.)


**Claim checks** (verified verdict shown)
- [ACCURATE] · steel-product · The debugUrl returned on session creation streams the headful browser over WebRTC at 25 fps.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions
- [ACCURATE] · steel-product · Call /v1/sessions/{id}/hls, pass your API key (header steel-api-key), feed the playlist to any HLS player.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions
- [ACCURATE] · steel-product · interactive=true lets humans take over; interactive=false makes the iframe read-only.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions
- [ACCURATE] · steel-product · Legacy headless sessions respect theme, showControls, pageId, and pageIndex query params.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions
- [CONFIRMED-INACCURATE] · steel-product · Default idle timeout is 5 minutes.  *(adversarially verified)*
  → Replace "Default idle timeout is 5 minutes." with "Default session timeout is 5 minutes." Full line becomes: "- **Sessions expire.** Default session timeout is 5 minutes. If the iframe goes blank, confirm the session is still running or restart it from your orchestration layer."
  src: https://docs.steel.dev/llms.mdx/overview/sessions-api/session-lifecycle · https://docs.steel.dev/llms.mdx/overview/sessions-api/embed-sessions/live-sessions
- [CONFIRMED-INACCURATE] · steel-product · client.sessions.create({ name: "qa-checkout" }) — store the returned debugUrl.  *(adversarially verified)*
  → Replace: `client.sessions.create({ name: "qa-checkout" })` — store the returned debugUrl. With: `const session = await client.sessions.create()` — then store the returned debugUrl via `session.debugUrl`. This matches the official Steel embedding docs (const session = await client.sessions.create(); console.log("Debug URL:", session.debugUrl);). If the intent was to group/label the session, use the valid `namespace` field (e.g. `client.sessions.create({ namespace: "qa-checkout" })`) — but note namespace is an organizational bucket defaulting to "default", not a human-readable session name, so the simplest faithful fix is to drop the argument entirely.
  src: https://registry.npmjs.org/steel-sdk (latest = 0.18.0) · https://registry.npmjs.org/steel-sdk/-/steel-sdk-0.18.0.tgz (SessionCreateParams interface, resources/sessions/sessions.d.ts lines 620-722; debugUrl on Session response lines 401-403)
- [CONFIRMED-INACCURATE] · steel-product · const client = new Steel({ apiKey: process.env.STEEL_API_KEY });  *(adversarially verified)*
  → Replace `const client = new Steel({ apiKey: process.env.STEEL_API_KEY });` with `const client = new Steel({ steelAPIKey: process.env.STEEL_API_KEY });`. This matches the only valid ClientOptions property, makes the code type-correct in TypeScript, and passes the key via the constructor as the snippet intends. (Equivalent minimal alternative: `const client = new Steel();` which relies on the STEEL_API_KEY env-var default — but the explicit `steelAPIKey` form better conveys intent and is robust if the key comes from a non-env source.)
  src: https://registry.npmjs.org/steel-sdk (latest = 0.18.0, verified by download + inspect) · https://registry.npmjs.org/steel-sdk/0.18.0 (published tarball index.d.ts line 91 + index.mjs line 29)
- [ACCURATE] · steel-product · Fetch /v1/sessions/{id}/events and pipe into rrweb-player for legacy headless replays.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions
- [ACCURATE] · technical · Safari plays HLS natively; Chrome, Edge, and Firefox need HLS.js or a comparable library.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions
- [ACCURATE] · technical · Headful playback requires H.264 baseline.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions
- [ACCURATE] · steel-product · Debug URLs are intentionally unauthenticated so you can paste them anywhere.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions
- [NEEDS-SOFTENING] · steel-product · Completed runs produce a durable MP4 recording that mirrors the live view without stitching screenshots.  *(adversarially verified)*
  → Two-part edit. (1) In the "Pick the right embed for the job" table, replace the cell text "Durable MP4 recording that mirrors the live view without stitching screenshots" with: "Real MP4 recording that mirrors the live view without stitching screenshots (retained for your plan's data-retention window)". (2) Add a bullet to the "Trade-offs and guardrails" section: "- **Recordings are plan-retained, not permanent.** Steel keeps the MP4 for 7 days on Launch, 14 days on Scale, and a custom window on Enterprise; offload the recording to your own storage if you need audit-grade retention." These preserve Steel's verified MP4/no-stitching claims while removing the "durable" overstatement the reviewer correctly flagged.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions · https://docs.steel.dev/overview/pricinglimits
- [CONFIRMED-INACCURATE] · steel-product · Steel defaults to 600 px tall for readability.  *(adversarially verified)*
  → Replace the line "- Fix the iframe dimensions so the WebRTC stream never collapses; Steel defaults to 600 px tall for readability." with "- Fix the iframe dimensions so the WebRTC stream never collapses. Steel's docs use 600 px as an example height, but the WebRTC stream fills whatever box you give it, so pick a height that fits your layout."
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions
- [ACCURATE] · technical · hls.js loaded from https://cdn.jsdelivr.net/npm/hls.js@^1.5.0/dist/hls.mjs
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions


**Top improvements**
- (HIGH) Reconcile the HLS sample with guardrail #4: proxy the manifest+segments through your backend and remove window.STEEL_API_KEY / the steel-api-key xhrSetup from the browser snippet (see priority fix #1). — The article's own code violates its own security guidance; this is the single most damaging thing a copy-paster can ship.
- (HIGH) Add a retention + plan-cap callout (7/14-day recording retention; 15-min/1-hr/24-hr max session time; 10/100/1000+ concurrency). These directly bound the audit and live-takeover use cases the article sells. — Plan limits are a production surprise waiting to happen and are verifiable on the Pricing/Limits page.
- (MEDIUM) Fix the two code bugs: drop the nonexistent `name` create-param, and use `steelAPIKey` (or note the env-var dependency) in the Steel constructor. — Both are authoritative-looking snippets that are subtly wrong against the actual SDK types.


**Supporting material to add**
- Steel Pricing/Limits (verified June 30 2026): Data retention is 7 days on Launch, 14 days on Scale, custom on Enterprise. Max session time is 15 min (Launch), 1 hour (Scale), up to 24 hours (Enterprise). Concurrent sessions: 10 / 100 / 1,000+. Requests per minute: 60 / 600 / custom.  _[where: Trade-offs and guardrails — add two bullets (retention window; plan caps on session length and concurrency).]_  (https://docs.steel.dev/overview/pricinglimits)
- Steel session-lifecycle doc distinguishes timeout (hard lifetime, default 5 min, in milliseconds) from inactivityTimeout (idle release, OFF by default), and confirms the 24-hour ceiling is plan-dependent.  _[where: Trade-offs and guardrails 'Sessions expire' bullet — clarify lifetime vs idle and how to raise each.]_  (https://docs.steel.dev/overview/sessions-api/session-lifecycle)
- Steel past-sessions doc states Steel 'automatically records every session' and that headful recordings are MP4 (no event reconstruction), which is the authoritative citation for the recording claim.  _[where: Short answer or 'Embed past sessions' intro — cite so the 'Steel records every run' premise is attributable.]_  (https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions)
- Steel live-sessions doc confirms headful sessions are now the default and that the same debugUrl works for both headful (WebRTC) and legacy headless (Chrome screencast) playback, with Steel auto-selecting the mode.  _[where: Implementation path step 4 — frame headless params as a true legacy-only path, not a parallel option.]_  (https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions)



---


### gemini-computer-use-with-steel — readiness 5/10


**Title:** Gemini Computer Use With Steel


**Priority issues**
- (BLOCKER) The entire article is pegged to Gemini 2.5, which Google now marks as Legacy. Steel's own integration page (verified) is titled/described 'Gemini 3', and the Steel cookbook defaults to gemini-3-flash-preview. Google's current Computer Use docs recommend gemini-3.5-flash via the now-GA Interactions API. Line 35 cites gemini-2.5-computer-use-preview; line 51 sets MODEL = "gemini-2.5-computer-use-preview-10-2025".
  → *Fix:* Replace both model references. Line 35: change the model cell to `gemini-3-flash-preview` (the Steel cookbook default) and note Gemini 3 is the current line. Line 51: change MODEL to `gemini-3-flash-preview`. Add a one-line note that Google's newest path is gemini-3.5-flash via the Interactions API (GA as of May 2026) for readers who want the latest model.
- (HIGH) The '24 hour runtimes' / '24 hour caps' framing (lines 28, 43, 90) is presented as a general Steel capability, but the 24h max is Enterprise-only. Verified pricing/limits page: Launch max session time = 15 minutes, Scale = 1 hour, Enterprise = up to 24 hours. The code example itself sets timeout: 900_000 (15 min), which is internally inconsistent with the 24h boast.
  → *Fix:* Gate the claim by plan. Line 28: change '24 hour runtimes' to 'runtimes up to 24 hours on Enterprise (15 min on Launch, 1 hour on Scale)'. Line 43: change '24 hour caps keep Gemini loops running' to 'plan-tiered session caps (15 min / 1 hr / 24 hr) keep loops running'. Line 90: change 'Runs exceed the 24 hour session cap' to 'Runs exceed your plan session cap (15 min Launch / 1 hr Scale / 24 hr Enterprise)'.
- (MEDIUM) Viewport is 1280x768 throughout (code line 57, prose line 69), but Steel's integration page example uses 1280x800 and the cookbook's denormalize helpers default to 1440x900.
  → *Fix:* Use 1280x800 to match docs.steel.dev/integrations/gemini-computer-use exactly, or 1440x900 to match the cookbook default. Update both the create() call (line 57) and the prose '1280x768 viewport' (line 69) so they agree with whichever you pick.
- (MEDIUM) Action-name lists are internally inconsistent and partly invented. The table (line 45) lists click/type/scroll/wait/navigate/take_screenshot; the action-router bullet (line 70) lists click_at/scroll_document/type_text_at/navigate/drag_and_drop/wait_5_seconds. Gemini's real vocabulary (per cookbook) is click_at, type_text_at, navigate, scroll_document, search, drag_and_drop, key_combination. wait_5_seconds is not a Gemini action, and search/key_combination are missing.
  → *Fix:* Standardize on Gemini's real vocabulary in both spots. Line 70: replace the list with 'click_at, type_text_at, navigate, scroll_document, search, drag_and_drop, key_combination'. Line 45: clarify these are Steel sessions.computer actions (e.g. click, type, scroll, take_screenshot) that your router maps the Gemini actions onto, so readers understand the two layers.
- (MEDIUM) 'sub-second startup' (line 28) is an unverified benchmark with no citation.
  → *Fix:* Either cite a Steel benchmark with a link, or soften to 'fast session startup' without a quantified claim until you have measured it.
- (LOW) Observability section relies on client.sessions.logs.list (console logs) and misses Agent Traces, Steel's headline 2026 observability feature (timeline synced to video, markdown/JSON export).
  → *Fix:* Keep sessions.logs.list for console logs but add Agent Traces as the primary replay/debug surface: mention GET /v1/sessions/{id}/agent-traces and the markdown/JSON export, and link the timeline-and-exports doc.


**Claim checks** (verified verdict shown)
- [STALE] · technical · Keep the same `gemini-2.5-computer-use-preview` model (line 35) and MODEL = "gemini-2.5-computer-use-preview-10-2025" (line 51).  *(adversarially verified)*
  → Update both references from the legacy 2.5 model to Google's current Computer Use default (gemini-3.5-flash). Line 35 (prose): change "Same `gemini-2.5-computer-use-preview` model, same system prompt, same task payload" to "Same `gemini-3.5-flash` model as Google's current quickstart, same system prompt, same task payload (the older `gemini-2.5-computer-use-preview-10-2025` still runs but Google labels it Legacy)." Line 51 (code constant): change `MODEL = "gemini-2.5-computer-use-preview-10-2025"` to `MODEL = "gemini-3.5-flash"`. Also update line 91's capability reference (`gemini-2.5-computer-use-preview`) to match the 3.5 model. This keeps the "both runtimes stay aligned" framing intact while aligning with the current Google quickstart and Steel's own "Gemini 3" integration page.
  src: https://ai.google.dev/gemini-api/docs/computer-use · https://docs.steel.dev/integrations/gemini-computer-use
- [NEEDS-SOFTENING] · steel-pricing · Sub-second startup and 24 hour runtimes (line 28); 24 hour caps keep Gemini loops running (line 43); Runs exceed the 24 hour session cap (line 90).  *(adversarially verified)*
  → Soften the 24h framing to be plan-conditional and add the same-region qualifier to the startup claim. Line 28: replace "you get sub-second startup, 24 hour runtimes, and deterministic evidence without touching your prompts or orchestrator." with "you get sub-second average startup (same region), plan-tiered runtimes (up to 24 hours on Enterprise), and deterministic evidence without touching your prompts or orchestrator." Line 43: replace "Fast startup and 24 hour caps keep Gemini loops running without relaunching Chrome" with "Fast startup and plan-tiered session caps (up to 24 hours on Enterprise) keep Gemini loops running without relaunching Chrome" — and note the adjacent code example's timeout:900000 reflects a 15-minute Launch-tier session, not the 24h cap, so either bump the example timeout or add a comment clarifying the Launch default. Line 90: no change needed (it correctly frames 24h as the maximum ceiling in a limitations section).
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/overview/sessions-api/session-lifecycle
- [CONFIRMED-INACCURATE] · technical · dimensions: { width: 1280, height: 768 } and helpers map normalized coordinates to the 1280x768 viewport (lines 57, 69).  *(adversarially verified)*
  → Replace 768 with the values Steel actually publishes. Three edits in content/articles/gemini-computer-use-with-steel.md: (1) Line 43 table cell — `{dimensions:{width:1280,height:768}` -> `{dimensions:{width:1280,height:800}`. (2) Line 57 code block — `dimensions: { width: 1280, height: 768 },` -> `dimensions: { width: 1280, height: 800 },`. (3) Line 69 — "both map normalized coordinates to the 1280x768 viewport. Reuse them verbatim." -> "both map normalized coordinates onto the session viewport (1440x900 by default in the cookbook; match whatever `width`/`height` you pass to `sessions.create`). Reuse them verbatim." Note: the article also cites the older gemini-2.5-computer-use-preview model while Steel's cookbook now uses gemini-3-flash-preview — recommend updating that separately.
  src: https://docs.steel.dev/integrations/gemini-computer-use · https://docs.steel.dev/cookbook/gemini-computer-use
- [ACCURATE] · technical · MAX_COORDINATE = 1000; Gemini plans in a normalized 0-1000 grid (line 51, 63, 70).
  src: https://docs.steel.dev/llms.mdx/cookbook/gemini-computer-use
- [ACCURATE] · steel-product · Forward each Gemini function_call to client.sessions.computer(session.id, body) and return the base64 PNG (line 45, 64).
  src: https://docs.steel.dev/integrations/gemini-computer-use · https://docs.steel.dev/llms.mdx/cookbook/gemini-computer-use
- [ACCURATE] · steel-product · Set useProxy and region on session creation (line 46).
  → Consider noting solveCaptcha:true is the flag to enable CAPTCHA autosolving, since the article discusses CAPTCHA but never names the flag.
  src: https://docs.steel.dev/integrations/gemini-computer-use · https://docs.steel.dev/llms.mdx/overview/sessions-api/multi-region
- [ACCURATE] · steel-product · client.sessions.captchas.status(session.id) to check CAPTCHA status (line 46, 79).
  src: https://docs.steel.dev/llms.mdx/overview/captchas-api/overview
- [ACCURATE] · steel-product · client.sessions.release(session.id) in finally (line 43, 65).
  src: https://docs.steel.dev/llms.mdx/overview/sessions-api/session-lifecycle · https://docs.steel.dev/llms.txt
- [ACCURATE] · steel-product · Log session.session_viewer_url / session.sessionViewerUrl (line 44, 61).
  src: https://docs.steel.dev/llms.mdx/overview/sessions-api/quickstart
- [ACCURATE] · steel-product · client.sessions.logs.list(session.id) for agent logs (line 44, 78).
  → Add Agent Traces (GET /v1/sessions/{id}/agent-traces, plus markdown/JSON export) as the recommended observability surface alongside logs.
  src: https://docs.steel.dev/llms.mdx/overview/agent-traces/overview
- [NEEDS-SOFTENING] · technical · Action router covers click_at, scroll_document, type_text_at, navigate, drag_and_drop, wait_5_seconds (line 70).  *(adversarially verified)*
  → Replace line 70's "Every Gemini action (`click_at`, `scroll_document`, `type_text_at`, `navigate`, `drag_and_drop`, `wait_5_seconds`) already has the Steel API payload defined." with: "Every Gemini browser-env action (`click_at`, `hover_at`, `type_text_at`, `scroll_document`, `scroll_at`, `wait_5_seconds`, `search`, `navigate`, `key_combination`, `drag_and_drop`, plus `go_back`, `go_forward`, and `open_web_browser`) already has a Steel API payload mapped in the router." Also fix the preceding sentence's file references from `agent.ts`/`agent.py` to the actual `index.ts`/`main.py`. Do NOT remove wait_5_seconds — the reviewer's premise that it is not a Gemini action is incorrect.
  src: https://docs.steel.dev/integrations/gemini-computer-use · https://docs.steel.dev/llms-full.txt
- [UNVERIFIABLE] · steel-product · blockAds: true is a valid sessions.create option (line 58).  *(adversarially verified)*
  → Verify blockAds against steel.apidocumentation.com before publishing, or drop it from the sample to avoid documenting an unsupported flag.
  src: https://docs.steel.dev/llms.txt · https://docs.steel.dev/llms.mdx/overview/sessions-api/quickstart
- [ACCURATE] · steel-product · timeout: 900_000 (15 min) in the create call (line 59).
  src: https://docs.steel.dev/llms.mdx/overview/sessions-api/session-lifecycle · https://docs.steel.dev/llms.mdx/overview/pricinglimits
- [ACCURATE] · steel-product · Steel is 'another API client sitting next to google-genai' and never touches Google credentials (line 38).
  src: https://docs.steel.dev/llms.mdx/cookbook/gemini-computer-use


**Top improvements**
- (HIGH) Reconcile the two action-name lists into one accurate Gemini vocabulary (click_at, type_text_at, navigate, scroll_document, search, drag_and_drop, key_combination) and clearly separate Gemini actions from Steel sessions.computer actions. — Two conflicting lists plus a non-existent action (wait_5_seconds) will trip up implementers and look sloppy to expert reviewers.
- (HIGH) Add an explicit model-selection note pointing to gemini-3-flash-preview (Steel cookbook default) and gemini-3.5-flash via the Interactions API, and link the Steel leaderboard so the article ages gracefully. — Model IDs change faster than article update cycles; delegating to the leaderboard keeps the article correct longer.
- (MEDIUM) Add a 'Plan limits that affect this integration' callout (session-length caps, concurrency, RPM, retention) so readers can scope their queue realistically. — The article encourages scaling a queue but never tells the reader what the plans actually permit.


**Supporting material to add**
- Steel plan limits, verified Jul 2026: Max session time 15 min (Launch) / 1 hr (Scale) / up to 24 hr (Enterprise); concurrency 10 / 100 / 1,000+; requests per minute 60 / 600 / custom; data retention 7 / 14 / custom days; browser hours $0.10/$0.08 per hr; captcha solves $3/$1 per 1k.  _[where: A short 'Plan limits that affect this integration' callout near 'Fit and trade-offs', or a footnote on the 24h claim.]_  (https://docs.steel.dev/llms.mdx/overview/pricinglimits)
- Steel Agent Traces (released 2026-05-22): a timeline of agent activity synced to the session video, exportable as markdown/JSON/ZIP, and queryable via GET /v1/sessions/{id}/agent-traces.  _[where: The 'Pair Gemini Computer Use with Steel observability' table — add an 'Agent Traces' row above or beside 'Agent logs'.]_  (https://docs.steel.dev/llms.mdx/overview/agent-traces/overview)
- Google's Interactions API is now generally available (May 2026) and is the recommended path for Computer Use with the newest models (gemini-3.5-flash); the older generateContent + computerUse-tool path still works for Gemini 2.5/3 previews.  _[where: A one-line note in 'What stays the same' or 'Minimal integration path' so readers pick the right Google API.]_  (https://ai.google.dev/gemini-api/docs/computer-use)
- Steel maintains a public model leaderboard for browser-agent workloads, referenced by the Gemini integration page itself for current model recommendations.  _[where: The 'Fit and trade-offs' or a 'Pick a model' note, to defer the volatile model choice to an authoritative Steel-owned source.]_  (https://docs.steel.dev/integrations/gemini-computer-use)
- Steel CAPTCHA solving is metered at $3/1k solves (Launch) and $1/1k solves (Scale); Launch requires a $10 paid deposit (not free credits) to use CAPTCHA solving or Steel proxies.  _[where: Near the 'Anti-bot and CAPTCHA tooling' row, so readers are not surprised by the Launch deposit gate.]_  (https://docs.steel.dev/llms.mdx/overview/pricinglimits)


**Broken / malformed links**
- `(@/glossary/computer-use.md), (@/glossary/replay.md), (@/glossary/proxies.md)` — Checked — all three resolve under content/glossary/ (computer-use.md, replay.md, proxies.md). No issue.
- `docs.steel.dev/integrations/gemini-computer-use (referenced line 95)` — Checked — returns HTTP 200. No issue.
- `https://steel.dev/blog/gemini-computer-use-with-steel (canonical_url, line 21)` — Returns HTTP 404. Expected for a draft (status: draft, draft: true); will resolve on publish. Not a defect. → No action needed; confirm it resolves after the article is published.
- `Note on the task-mentioned paths /overview/sessions-api and /overview/pricing` — Both return 404. The correct paths are /overview/sessions-api/overview and /overview/pricinglimits (one word, no hyphen). The article itself does not link to either, so no article-level break. → No article change required; flagged for the reviewer's awareness.


---


### mobile-mode-for-browser-automation — readiness 7/10


**Title:** Mobile Mode for Browser Automation Is Not Just a User-Agent String


**Priority issues**
- (HIGH) Names `page.swipe()` as a Playwright/Puppeteer helper. This method does not exist in Playwright (Page/Locator/Touchscreen classes), Puppeteer, or any mainstream browser-automation library — swipe must be composed from pointer down/move/up sequences.
  → *Fix:* Replace the sentence with: "Prefer `locator.tap()` for taps (Playwright's `page.tap()` is deprecated). There is no built-in swipe helper — compose gestures with `page.touchscreen.tap(x, y)` plus a pointer move sequence, or in Puppeteer use `page.mouse` with `mouse.down()`/`mouse.move()`/`mouse.up()` to drag."
- (MEDIUM) Recommends `page.tap()`. It exists in Playwright but is marked Discouraged in the official docs ('Use locator-based locator.tap() instead').
  → *Fix:* Change `page.tap()` references to `locator.tap()` (e.g., `await page.locator('#pay').tap()`).
- (MEDIUM) States 'Desktop DOM is 2-3x larger than mobile' as a quantitative fact in a table.
  → *Fix:* Either drop the number ('Desktop DOMs are typically larger than their mobile counterparts') or label it as self-reported with a link to a Steel benchmark. Suggested table cell: 'Desktop DOMs are typically much larger than mobile | Send the cheaper mobile DOM to your model or extraction step'.
- (LOW) The summary/short-answer says Steel creates a 'mobile-native session' (and title hints at a distinct 'Chrome build'), but the Trade-offs section concedes 'Mobile mode is still emulation on a desktop-class machine.'
  → *Fix:* In the summary, change 'swaps the entire session identity: viewport, touch stack, Chrome build, and fingerprint' to 'viewport, touch stack, and fingerprint' (drop 'Chrome build' — it is the same Chrome configured for mobile), and soften 'mobile-native session' to 'mobile-configured session' or 'mobile-fingerprinted session.'
- (LOW) Code comment `useProxy: true, // optional geo alignment` is imprecise.
  → *Fix:* Change the comment to `useProxy: true, // managed residential proxies (US by default; pass { country } for geo targeting)` or show the object form if geo alignment is the intent.


**Claim checks** (verified verdict shown)
- [ACCURATE] · steel-product · Steel's `deviceConfig: { device: "mobile" }` creates a mobile session.
  src: https://docs.steel.dev/llms.mdx/overview/sessions-api/mobile-mode · https://registry.npmjs.org/steel-sdk/-/steel-sdk-0.18.0.tgz
- [ACCURATE] · steel-product · Connect via `chromium.connectOverCDP(wss://connect.steel.dev?apiKey=...&sessionId=${session.id})`.
  src: https://docs.steel.dev/llms.txt · https://docs.steel.dev/llms.mdx/overview/sessions-api/mobile-mode
- [ACCURATE] · steel-product · Create the client with `new Steel({ steelAPIKey: process.env.STEEL_API_KEY })` and pass camelCase flags `useProxy`, `solveCaptcha`.
  src: https://docs.steel.dev/llms.txt · https://registry.npmjs.org/steel-sdk/-/steel-sdk-0.18.0.tgz
- [ACCURATE] · steel-product · `debugUrl` is a Steel session field for watching the live mobile viewport.
  src: https://registry.npmjs.org/steel-sdk/-/steel-sdk-0.18.0.tgz · https://docs.steel.dev/llms.mdx/overview/sessions-api/embed-sessions
- [RISKY-OR-DISPUTABLE] · technical · Prefer `page.tap()` and `page.swipe()` helpers where they exist.  *(adversarially verified)*
  → Replace with: "Prefer `locator.tap()` for taps (Playwright's `page.tap()` is deprecated). There is no built-in swipe helper — compose a swipe from a pointer down/move/up sequence."
  src: https://playwright.dev/docs/api/class-page · https://playwright.dev/docs/api/class-locator
- [ACCURATE] · competitor · Chrome extensions are desktop only today.
  src: https://docs.steel.dev/llms.txt
- [NEEDS-SOFTENING] · statistic · Desktop DOM is 2-3x larger than mobile.  *(adversarially verified)*
  → Replace the unsupported ratio with qualitative language consistent with Steel's own doc. In the "When to flip the switch" table, change the middle cell of the "Token budgets blowing up" row from: "Desktop DOM is 2-3x larger than mobile" to: "Sites often serve a leaner, simpler DOM to mobile devices" (keeping the third cell, "Send the cheaper mobile DOM to your model or extraction step," unchanged). This preserves the valid point without asserting a 2-3x figure that no primary source supports and that HTTP Archive data contradicts.
  src: https://docs.steel.dev/overview/sessions-api/mobile-mode · https://almanac.httparchive.org/en/2022/markup
- [ACCURATE] · steel-product · Mobile mode keeps working with proxies, CAPTCHA solving, profiles, and embeds.
  src: https://docs.steel.dev/llms.mdx/overview/sessions-api/mobile-mode
- [ACCURATE] · technical · Spawn a fresh context with `hasTouch: true`, `isMobile: true`, and `viewport` set to a device profile.
  src: https://playwright.dev/docs/api/class-browser#browser-new-context
- [ACCURATE] · technical · Mobile mode is still emulation on a desktop-class machine; hardware features (camera, gyroscope, Bluetooth, push) can require a real device.
  src: https://docs.steel.dev/llms.mdx/overview/sessions-api/mobile-mode


**Top improvements**
- (HIGH) Add a primary-source citation to Steel's Mobile Mode doc on first mention of `deviceConfig`, and link the glossary-style terms (viewport, fingerprint) where helpful. This article currently has only two internal glossary links and zero outbound docs links, which is weak for answer-engine ranking. — AE/LLM retrieval rewards citable primary sources; right now the article makes API claims without linking the API doc that backs them.
- (MEDIUM) Distinguish Steel mobile mode from native framework device emulation (Playwright `devices['iPhone 13']`, Puppeteer `page.emulate()`). The article's differentiator is that Steel aligns the whole fingerprint + UA + network identity rather than just viewport/UA — say that explicitly so readers don't conclude 'I can already do this with `devices[]`.' — Without this, a savvy reader's first objection is 'Playwright already has device emulation' — the article should preempt it.
- (MEDIUM) In the Playwright code sample, show `await page.locator(...).tap()` for a touch interaction so the article demonstrates, not just describes, correct mobile driving. Currently the only action shown is `page.goto()`. — The article's thesis is 'drive it like a phone,' but the sample never performs a touch action; a one-line tap makes the guidance concrete and copy-pasteable.


**Supporting material to add**
- Steel's official Mobile Mode doc — the primary source for this entire article. Confirms the deviceConfig flag, the connectOverCDP pattern, and the rationale (simplified navigation, lower token cost, consistent fingerprint).  _[where: First mention of `deviceConfig` (Short answer / 'Instead of spoofing headers' section) and again in Next steps.]_  (https://docs.steel.dev/overview/sessions-api/mobile-mode)
- Steel pricing/limits (last edited June 30, 2026) for the token/cost argument: browser hours at $0.08-$0.10/hr and the note that mobile pages reduce both HTML and vision tokens. Grounds the 'token budgets blowing up' row in real economics.  _[where: 'When to flip the switch' table, 'Token budgets blowing up' row — add the cost lever explicitly.]_  (https://docs.steel.dev/overview/pricinglimits)
- Playwright's locator.tap() and Touchscreen API — the correct, current APIs to cite instead of the deprecated `page.tap()` and invented `page.swipe()`.  _[where: Implementation path, step 3 (replace the tap/swipe sentence).]_  (https://playwright.dev/docs/api/class-locator#locator-tap)
- Steel's Proxies doc — managed residential proxies are US-by-default with global geographic targeting; relevant to the 'combine with residential proxies from the same region' guardrail and the `useProxy` comment.  _[where: Trade-offs and guardrails bullet on residential proxies; also the code comment on `useProxy`.]_  (https://docs.steel.dev/overview/stealth/proxies)


**Broken / malformed links**
- `[proxies](@/glossary/proxies.md)` — None — resolves to content/glossary/proxies.md (33 lines, non-stub).
- `[CAPTCHA solving](@/glossary/captcha-solving.md)` — None — resolves to content/glossary/captcha-solving.md (33 lines, non-stub).


---


### multi-region-browser-sessions — readiness 4/10


**Title:** Multi-Region Browser Sessions Without Proxy Confusion


**Priority issues**
- (BLOCKER) Fabricated `ord` (Chicago) region — Steel Cloud has only TWO regions: `lax` and `iad`
  → *Fix:* Replace every `ord` with `iad`, and change all 'lax, ord, or iad' / 'three US regions' phrasing to 'two US regions (lax and iad)'. Concretely: (1) Short answer: 'pin every session to `lax` or `iad`'; (2) region/proxy table 'Where Steel boots the browser VM (`lax`, `iad`)'; (3) Implementation step 1: 'Map each workflow to `lax` or `iad` today'; (4) Implementation step 3 code: use `region: "iad"`; (5) Trade-offs: 'Steel Cloud currently offers two US regions.' The Chicago residency example (failure-patterns table) should be rewritten to reference `iad` (Washington DC) or removed, since Chicago compute is not available.
- (HIGH) Failure-pattern table uses a Chicago residency scenario that Steel cannot satisfy
  → *Fix:* Rewrite the row to a real residency scenario, e.g.: 'Compliance run needs data residency on the US East Coast but devs keep flipping proxy providers' -> 'Anchor the session in `iad`, then only add a BYO proxy if you also need a non-East-Coast IP.'
- (MEDIUM) 'The usual 200+ ms cross-country lag' is unsourced and inflated for raw network RTT
  → *Fix:* Soften to a sourced/qualitative phrasing, e.g.: 'That cut alone removes the cross-country round trip between your orchestrator and the browser VM (typically 60-100 ms of network RTT between coasts, before the browser even reaches the target site).' For the table, change 'replay shows 300 ms RTT' to 'replay shows high, inconsistent RTT' and '400 ms variance' to 'large variance' unless you can cite a Steel benchmark.


**Claim checks** (verified verdict shown)
- [CONFIRMED-INACCURATE] · steel-product · Steel Cloud lets you pin every session to `lax`, `ord`, or `iad` with the `region` parameter  *(adversarially verified)*
  → Edit line 29 of content/articles/multi-region-browser-sessions.md. Replace: "[Steel Cloud](@/glossary/steel-cloud.md) already lets you pin every session to `lax`, `ord`, or `iad` with the `region` parameter" with: "[Steel Cloud](@/glossary/steel-cloud.md) already lets you pin every session to `lax` or `iad` with the `region` parameter". Also fix the cascading `ord` references so the article stays internally consistent: (1) line 68 code example — change `region: "ord",` to `region: "iad",` (or `lax`) and adjust the `state: "IL"` geolocation accordingly since Chicago/`ord` is not available; (2) line 85 — change "Steel Cloud currently offers three US regions" to "Steel Cloud currently offers two US regions".
  src: https://docs.steel.dev/overview/sessions-api/multi-region · file:///Users/nikola/dev/steel/llms-steel-dev/content/articles/multi-region-browser-sessions.md
- [CONFIRMED-INACCURATE] · steel-product · Steel Cloud currently offers three US regions  *(adversarially verified)*
  → Change "three US regions" to "two US regions". Exact replacement: "Steel Cloud currently offers two US regions"
  src: https://docs.steel.dev/overview/sessions-api/multi-region · https://docs.steel.dev/llms.txt
- [CONFIRMED-INACCURATE] · steel-product · Example code: client.sessions.create({ region: "ord", useProxy: { geolocation: { country: "US", state: "IL" } } })  *(adversarially verified)*
  → Replace `region: "ord"` with a valid region code. Minimal fix for this code block:

```ts
const session = await client.sessions.create({
  region: "iad",
  useProxy: {
    geolocation: { country: "US", state: "IL" },
  },
});
```

Additionally, for consistency, fix every other `ord` reference in /Users/nikola/dev/steel/llms-steel-dev/content/articles/multi-region-browser-sessions.md: lines 29 and 53 list `lax`, `ord`, or `iad` (drop `ord`); line 36 table cell `(lax, ord, iad)` (drop `ord`); line 46 "Anchor the session in `ord`" (change to `iad`); line 85 "Steel Cloud currently offers three US regions" (change to "two US regions"). The example's `state: "IL"` geolocation stays valid since it is supplied via useProxy, independent of compute region.
  src: https://docs.steel.dev/overview/sessions-api/multi-region · https://docs.steel.dev/overview/stealth/proxies
- [ACCURATE] · steel-product · Steel still auto-selects the region if you omit the flag
  src: https://docs.steel.dev/overview/sessions-api/multi-region
- [ACCURATE] · steel-product · Steel-managed residential proxies are US based today; use BYO for other locales
  src: https://docs.steel.dev/overview/stealth/proxies · https://docs.steel.dev/overview/sessions-api/multi-region
- [ACCURATE] · steel-product · Multi-region is a Steel Cloud feature; self-hosted clusters can match the pattern but you own provisioning
  src: https://docs.steel.dev/llms-full.txt
- [ACCURATE] · steel-product · Run Steel Browser (open-source self-host) in your own region while you wait
  src: https://github.com/steel-dev/steel-browser
- [ACCURATE] · steel-product · SDK usage: new Steel({ steelAPIKey: process.env.STEEL_API_KEY }) and client.sessions.create(...)
  src: https://docs.steel.dev/llms-full.txt
- [NEEDS-SOFTENING] · statistic · Region-first routing shaves the usual 200+ ms cross-country lag  *(adversarially verified)*
  → Replace the sentence with: "Region-first routing shaves the usual cross-country RTT (~60–90 ms — and far more once CDP round-trips and proxy hops stack up)." This keeps the claim's intent while correcting the inflated single-network number and reframing the larger figure honestly as cumulative automation overhead.
- [NEEDS-SOFTENING] · statistic · Symptom table figures: 'replay shows 300 ms RTT' and '400 ms variance between staging and prod'  *(adversarially verified)*
  → Replace the two fabricated figures with qualitative phrasing. Edit 1 — in the "Region vs proxy at a glance" table (line 39), change "Cookies and storage pinned to the wrong coast; replay shows 300 ms RTT" to "Cookies and storage pinned to the wrong coast; replay shows inflated cross-region RTT". Edit 2 — in the "failure patterns this solves" table (line 47), change "Debug traces show 400 ms variance between staging and prod" to "Debug traces show large latency variance between staging and prod".
  src: https://docs.steel.dev/overview/sessions-api/multi-region · https://docs.steel.dev/overview/stealth/proxies


**Top improvements**
- (HIGH) Remove `ord`/Chicago everywhere and correct 'three regions' to 'two regions (lax and iad)'. This is the only blocker; it affects 5 locations including runnable code. — The article's central product claim is factually wrong against current docs (verified July 2026), and the code sample uses an invalid region enum value.
- (MEDIUM) Add Dedicated IPs to the decision framework as a third network-control path. The article frames it as binary (managed-residential vs BYO), but Steel also offers Dedicated IPs for stable egress identity, which is frequently what teams actually want when they reflexively reach for proxies. — Closes a competitive/product blind spot and makes the 'when to add a proxy' guidance more complete.
- (MEDIUM) Soften or source the latency numbers (200+ ms, 300 ms RTT, 400 ms variance). Cross-coast network RTT is typically 60-100 ms; present figures as end-to-end added latency or cite a Steel benchmark. — Unsourced specific numbers undermine trust in an article written to rank in answer-engine results.


**Supporting material to add**
- Authoritative Available Regions table showing exactly two regions (LAX, IAD) and the explicit statement that the `region` parameter controls browser-instance placement while `useProxy`/`proxyUrl` control egress IP.  _[where: Short answer / region-vs-proxy table]_  (https://docs.steel.dev/overview/sessions-api/multi-region)
- Steel's own proxy-targeting guidance: prefer the broadest targeting that meets your needs (country over city), and US/GB proxies have the highest quality.  _[where: Implementation path step 3, as a practical tip when choosing geolocation targeting]_  (https://docs.steel.dev/overview/stealth/proxies)
- Steel Dedicated IPs as a third egress option (beyond managed-residential and BYO): a leased, stable Steel-managed IP for sessions that need a persistent network identity, especially when paired with Profiles.  _[where: New bullet in 'Region vs proxy at a glance' or Trade-offs, as a third network-control option]_  (https://docs.steel.dev/overview/stealth/proxies)
- Steel Local vs Steel Cloud comparison table confirming Multi-Region is Cloud-only ('Supported with region flag') and Steel Local is 'Host it yourself'.  _[where: Trade-offs and limits bullet about self-hosted clusters]_  (https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud)



---


### prompt-injection-and-web-agents — readiness 4/10


**Title:** Prompt Injection Risks in Web Agents


**Priority issues**
- (BLOCKER) The plan-tier table (lines 61-66) and every derived plan reference are wrong. Article lists Starter (10 concurrent / 2 days / 30 min), Developer (20 / 7 days / 1 hr), Pro (100 / 14 days / 24 hr), Enterprise (Custom). The real Steel plans are Launch / Scale / Enterprise: Launch = 10 concurrent, 7-day retention, 15-min max session; Scale = 100 concurrent, 14-day retention, 1-hour max; Enterprise = 1,000+ concurrent, custom retention, up to 24-hour max. There is no '20 concurrent' tier, no '2-day' or '30-min' figures, no 'Pro' tier, and only Enterprise reaches 24 h. 'Starter/Developer' are explicitly legacy names per the docs FAQ.
  → *Fix:* Replace the table with: Launch (10 concurrent / 7 days / 15 min), Scale (100 concurrent / 14 days / 1 hour), Enterprise (1,000+ / custom / up to 24 hours). Rename every in-text reference (Starter→Launch, Developer→Scale where the '20 concurrent' was, Pro→Scale). Verify at https://docs.steel.dev/overview/pricinglimits (last edit 2026-06-30).
- (BLOCKER) Retention windows are stated as '24 h to 14 days' (line 39) and 'Hobby plan logs disappear after 24 hours while Pro gives you 14 days' (line 107). There is no Hobby plan, no 24-hour retention window anywhere in Steel, and no Pro tier. These conflate the 24-hour MAX SESSION LENGTH (Enterprise) with data retention, which is actually 7 days (Launch) / 14 days (Scale) / custom (Enterprise).
  → *Fix:* Line 39: change 'retention (24 h to 14 days)' to 'retention (7 to 14 days on Launch/Scale, custom on Enterprise)'. Line 107: replace 'Hobby plan logs disappear after 24 hours while Pro gives you 14 days' with 'Launch-plan sessions and artifacts age out after 7 days; Scale keeps them for 14 days. Mirror anything important to your own storage before the window closes.'
- (BLOCKER) The agent-evidence endpoint is misnamed. Line 80 says `GET /v1/sessions/{id}/agent-logs`; the real endpoint is `GET /v1/sessions/{id}/agent-traces`. The feature is called 'Agent Traces' (published 2026-05-22). The term 'agent logs' also appears in the 'What Steel gives you' table (line 96).
  → *Fix:* Change `GET /v1/sessions/{id}/agent-logs` to `GET /v1/sessions/{id}/agent-traces`, and rename both mentions of 'agent logs' to 'agent traces'. Source: https://docs.steel.dev/overview/agent-traces/api
- (HIGH) The session-timeout model is conflated. The article says sessions 'time out after 5 minutes of inactivity' (line 57), that each session has 'a 5 minute idle timeout' (line 37), and that 'Idle sessions shut down quietly' after five minutes (line 106). In Steel the 5-minute DEFAULT is the hard lifetime cap (`timeout`), which elapses regardless of activity. Idle-based release is a SEPARATE, OFF-by-default parameter (`inactivityTimeout`). By default an idle session does NOT shut down early — it stays alive and billable until `timeout`.
  → *Fix:* Rewrite to: 'A session stays alive for 5 minutes by default (the `timeout` hard cap) and keeps billing even when idle. To release on genuine inactivity, set `inactivityTimeout` — any CDP command or remote input resets it, so normal automation is unaffected.' Remove 'idle timeout' from the short-answer table.
- (HIGH) The 'heartbeat' advice is broken on three counts (line 74 and line 106): it recommends `page.waitForTimeout(0)` to keep a session alive. (1) `page.waitForTimeout` is deprecated/removed in current Playwright. (2) `waitForTimeout(0)` is a no-op (0 ms) and issues NO CDP command, so it would not reset `inactivityTimeout` anyway. (3) Heartbeats only matter for `inactivityTimeout`, which is off by default — they do not extend the hard `timeout` cap.
  → *Fix:* Replace with: 'If approvals may exceed your configured `timeout`, set a longer `timeout` at session creation (it cannot be changed on a live session). If you enable `inactivityTimeout`, keep the session warm with a real CDP command — e.g. a periodic `page.evaluate(() => 1)` or a `Page.navigate` — since a plain `waitForTimeout` issues no CDP traffic.'
- (MEDIUM) Credentials and Files are presented as universal Steel capabilities, but both are Cloud-only. The Steel Local vs Cloud docs list Credentials = 'Not supported' and Files = 'Not supported' on Steel Local. The article's split-workflow guidance (section 2) and the 'Steel gives you' table (line 96) imply these controls exist everywhere.
  → *Fix:* Add one sentence in section 2 or the Safeguards: 'Credentials, Files, and managed stealth are Cloud-only — Steel Local supports neither, so credential-vault and evidence-export controls require Steel Cloud.' Source: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud
- (MEDIUM) 'keep the same session paused until you resume automation' (line 38, short-answer table) implies a Steel pause/resume API. The documented session states are Live / Released / Failed — there is no pause state or pause/resume method.
  → *Fix:* Reword to: '...and leave your orchestrator halted on that session until the reviewer approves, then resume automation.' Drop the implication that Steel pauses the session.
- (LOW) Credential create signature is slightly wrong: line 51 shows `client.credentials.create({ origin, namespace, value, totpSecret })` with `totpSecret` as a top-level sibling of `value`. In the real API `totpSecret` lives INSIDE `value` alongside `username`/`password`.
  → *Fix:* Change to `client.credentials.create({ origin, namespace, value: { username, password, totpSecret } })`. Source: https://docs.steel.dev/overview/credentials-api/overview


**Claim checks** (verified verdict shown)
- [CONFIRMED-INACCURATE] · steel-pricing · Plan table: Starter 10/2 days/30 min; Developer 20/7 days/1 hour; Pro 100/14 days/24 hours; Enterprise Custom  *(adversarially verified)*
  → Replace the plan-tier table with: "Launch 10 concurrent / 7-day retention / 15-min max; Scale 100 concurrent / 14-day retention / 1-hour max; Enterprise 1,000+ concurrent / custom retention / up to 24-hour max." i.e., rewrite the row as "Launch 10/7 days/15 min; Scale 100/14 days/1 hour; Enterprise 1,000+/custom/up to 24 hours." Source: https://docs.steel.dev/overview/pricinglimits
  src: https://docs.steel.dev/overview/pricinglimits · https://steel.dev/pricing
- [CONFIRMED-INACCURATE] · steel-pricing · Hobby plan logs disappear after 24 hours while Pro gives you 14 days  *(adversarially verified)*
  → Replace with: "Launch plan logs are kept for 7 days while Scale gives you 14 days (Enterprise retention is custom)."
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/
- [CONFIRMED-INACCURATE] · steel-pricing · plan's retention (24 h to 14 days)  *(adversarially verified)*
  → Replace "your plan's retention (24 h to 14 days)" with "your plan's retention (7 to 14 days)". Separately, fix line 107 ("Hobby plan logs disappear after 24 hours while Pro gives you 14 days") to "Launch-plan logs expire after 7 days while Scale gives you 14 days" to match real plan names and retention values.
  src: https://docs.steel.dev/overview/pricinglimits · https://steel.dev/pricing
- [CONFIRMED-INACCURATE] · steel-product · Each session is its own incognito browser capped at 24 hours with a 5 minute idle timeout  *(adversarially verified)*
  → In /Users/nikola/dev/steel/llms-steel-dev/content/articles/prompt-injection-and-web-agents.md line 37, replace "Each session is its own incognito browser capped at 24 hours with a 5 minute idle timeout." with "Each session is an isolated incognito-style browser with a hard lifetime cap (5-minute default, configurable at creation, plan-bounded to 15 minutes on Launch, 1 hour on Scale, and up to 24 hours on Enterprise); idle-based release is a separate, off-by-default feature." NOTE: the same two errors are repeated in prose at line 57 ("live up to 24 hours, and time out after 5 minutes of inactivity unless you send heartbeats") and should be corrected there too, e.g. "They start in under a second, have a hard lifetime cap (5-minute default, plan-bounded to 15 min / 1 hr / 24 hr on Launch / Scale / Enterprise), and release themselves on a separate opt-in inactivityTimeout if you enable it." Also consider fixing line 65, which labels the 24-hour/100-concurrent/14-day row "Pro" — Steel's plans are Launch, Scale, and Enterprise, and per the limits page that row matches Enterprise for max session length but Scale for retention/concurrency, so it needs a closer look.
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/overview/sessions-api/session-lifecycle
- [CONFIRMED-INACCURATE] · steel-product · They ... live up to 24 hours, and time out after 5 minutes of inactivity unless you send heartbeats  *(adversarially verified)*
  → Replace the flagged sentence (currently at content/articles/prompt-injection-and-web-agents.md, line 57): "Steel sessions behave like headful incognito windows. They start in under a second, live up to 24 hours, and time out after 5 minutes of inactivity unless you send heartbeats." with: "Steel sessions behave like headful incognito windows. They start in under a second and can run up to 24 hours depending on your plan, but each session is capped at a 5-minute `timeout` by default — a hard limit that elapses whether or not the browser is active, so set `timeout` explicitly at creation for longer runs (it cannot be changed on a live session). Opt into `inactivityTimeout` only if you want an idle session to release itself early; any CDP command resets that idle timer, but it does nothing to extend the hard `timeout` cap." Also fix the same misconception at line 37 ("capped at 24 hours with a 5 minute idle timeout" → "capped at 24 hours with a 5-minute hard `timeout` (idle-release is opt-in)") and line 106 (drop the heartbeat advice — by default idle sessions do not shut down and heartbeats do not extend `timeout`; keep only "increase the `timeout` parameter when you create the session").
  src: https://docs.steel.dev/overview/sessions-api/session-lifecycle · https://docs.steel.dev/overview/sessions-api/overview
- [CONFIRMED-INACCURATE] · steel-product · Fetch GET /v1/sessions/{id}/agent-logs ... match DOM events to prompt history  *(adversarially verified)*
  → Replace the sentence: "Agent logs matter too. Fetch `GET /v1/sessions/{id}/agent-logs` when something looks suspicious and match DOM events to prompt history. Prompt injection loses most of its sting when you can replay the entire sequence verbatim." with: "Agent traces matter too. Fetch `GET /v1/sessions/{id}/agent-traces` when something looks suspicious and you get a timestamped timeline of browser activity — clicks, inputs, navigation, scrolls, drags, and errors — synced to the session video. Prompt injection loses most of its sting when you can replay the entire sequence verbatim." For consistency, also update the two other "agent logs" mentions in the same article: line 87 ("Download files, agent logs, and the replay" -> "Download files, agent traces, and the replay") and line 96 ("Profiles, Files, replays, and agent logs" -> "Profiles, Files, replays, and agent traces").
  src: https://docs.steel.dev/llms.txt · https://docs.steel.dev/overview/agent-traces/api
- [CONFIRMED-INACCURATE] · steel-product · Upload credentials via client.credentials.create({ origin, namespace, value, totpSecret })  *(adversarially verified)*
  → Replace the snippet so totpSecret nests inside value. Change: `client.credentials.create({ origin, namespace, value, totpSecret })` to: `client.credentials.create({ origin, namespace, value: { username, password, totpSecret } })`. Full sentence in /Users/nikola/dev/steel/llms-steel-dev/content/articles/prompt-injection-and-web-agents.md (Section 1, ~line 51) becomes: "Upload credentials once via `client.credentials.create({ origin, namespace, value: { username, password, totpSecret } })`, then request injection by passing `credentials: {}` on `sessions.create`."
  src: https://docs.steel.dev/overview/credentials-api/overview · https://docs.steel.dev/llms-full.txt
- [ACCURATE] · steel-product · Steel stores each record with its own AES-256-GCM key, re-encrypts with org KMS key, decrypts only inside the session over a private WireGuard backbone; injects within ~2 seconds; defaults autoSubmit/blurFields/exactOrigin
  src: https://docs.steel.dev/overview/credentials-api/overview
- [ACCURATE] · steel-product · Profiles hold up to 300 MB and expire after 30 idle days; over-300 MB uploads enter a FAILED state; use persistProfile: true and reuse the returned profileId
  src: https://docs.steel.dev/overview/profiles-api/overview
- [ACCURATE] · steel-product · sessions.release, releaseAll, persistProfile, profileId, sessions.files.downloadArchive(sessionId) are valid SDK methods; the file archive auto-moves to global storage on release
  src: https://docs.steel.dev/overview/sessions-api/session-lifecycle · https://docs.steel.dev/overview/files-api/overview
- [ACCURATE] · steel-product · Every session ships with a debugUrl streaming live over WebRTC at 25 fps; the URL is unauthenticated by design; interactive=true and showControls=true are valid params
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions · https://docs.steel.dev/overview/sessions-api/human-in-the-loop
- [ACCURATE] · steel-product · Pull the HLS replay (/v1/sessions/{id}/hls) or MP4
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions
- [ACCURATE] · steel-product · Steel Local is roughly one live session and keeps everything inside your VPC
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud
- [ACCURATE] · third-party · Simon Willison's 'lethal trifecta' is a good mental model: give the agent instructions, hand it tools, then harvest the secrets it exposes
  → Tighten the paraphrase and add the link: 'Simon Willison's "lethal trifecta" — private data, untrusted content, and a communication channel out.'
  src: https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/ · https://simonwillison.net/tags/lethal-trifecta/
- [UNVERIFIABLE] · steel-product · Sessions start in under a second
  → Either remove 'in under a second' or replace with 'in well under a second in typical conditions' and link a Steel benchmark, or hedge to 'start quickly.'
  src: https://docs.steel.dev/overview/sessions-api/overview
- [CONFIRMED-INACCURATE] · technical · send periodic page.waitForTimeout(0) heartbeats ... to keep [the session] alive past the default five-minute window  *(adversarially verified)*
  → Replace the bullet at content/articles/prompt-injection-and-web-agents.md line 106 ("Idle sessions shut down quietly. If a review or holding pattern will take longer than five minutes, send periodic `page.waitForTimeout(0)` heartbeats or increase the `timeout` parameter when you create the session.") with: "The default five minutes is a hard lifetime `timeout` cap, not an idle window, and it can't be extended on a live session — set a larger `timeout` (in milliseconds) at creation if you expect long reviews. Idle-release is opt-in: pass `inactivityTimeout` and Steel resets it on any real CDP command or remote input; a pure client-side wait such as Playwright's deprecated `page.waitForTimeout()` sends no CDP traffic, so it won't reset the timer." NOTE: the same misconception appears earlier in the article and should also be corrected — line 57 ("time out after 5 minutes of inactivity unless you send heartbeats") and line 74 ("send a lightweight action every few minutes if approvals take longer than the default five minute window") both misframe the hard 5-minute timeout as an inactivity window.
  src: https://playwright.dev/docs/api/class-page#page-wait-for-timeout · https://docs.steel.dev/overview/sessions-api/session-lifecycle


**Top improvements**
- (HIGH) Rebuild the plan/retention/max-session table from the live pricing page and scrub every derived reference (Starter/Developer/Pro, '20 concurrent', '2-day retention', '30-min max', '24-hour retention', 'Hobby plan'). These are the blocking accuracy errors. — Eight separate locations in the article propagate wrong plan names and numbers; until fixed the piece is unpublishable for an answer-engine-targeted reference article.
- (HIGH) Rewrite the session-timeout explanation to distinguish `timeout` (hard lifetime cap, 5-min default, billable even when idle) from `inactivityTimeout` (off by default, resets on any CDP/input activity). Remove 'idle timeout' language from the short-answer table. — The article's headline isolation control is currently described backwards; readers will mis-size idle billing protection.
- (HIGH) Replace the `page.waitForTimeout(0)` heartbeat advice with correct guidance: set a longer `timeout` at creation (immutable on live sessions), and if `inactivityTimeout` is on, send a real CDP command like `page.evaluate(() => 1)`. — Current advice is a no-op on a deprecated Playwright API and gives false assurance.


**Supporting material to add**
- Simon Willison's original 'The lethal trifecta' post defines the term precisely as 'private data, untrusted content, and external communication.' The article cites the concept but loosely; linking the canonical post turns a name-drop into a citable primary source.  _[where: 'Why prompt injection hits browser agents harder', at the lethal-trifecta mention]_  (https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/)
- Willison's write-up of the GitHub MCP remote-prompt-injection demonstration is a concrete, well-documented real-world example of indirect prompt injection via untrusted web content — exactly the DOM-injection scenario this article describes abstractly.  _[where: Intro or 'Why prompt injection hits browser agents harder', as a real-world anchor]_  (https://simonwillison.net/2025/May/26/github-mcp-exploited/)
- OWASP Top 10 for LLM Applications lists Prompt Injection as LLM01 — an authoritative, vendor-neutral taxonomy to cite for the claim that prompt injection is 'inevitable' and the top-ranked LLM risk.  _[where: Opening paragraph, to back 'Prompt injection is inevitable']_  (https://genai.owasp.org/llm-risk-10/)
- Steel's own Agent Traces docs (the real name for what the article calls 'agent logs') describe the timestamped, video-synced activity timeline exported as markdown/JSON/ZIP — strong primary-source evidence for the 'capture every frame for audit' thesis.  _[where: Section 4 and the 'What Steel gives you' table, replacing 'agent logs']_  (https://docs.steel.dev/overview/agent-traces/overview)
- Steel's AAD (additional authenticated data) detail — ciphertext is bound to org ID + credential origin so a mismatch at decrypt blocks cross-org replay. This strengthens the 'fences each login to the right persona' claim with a concrete anti-replay mechanism.  _[where: Section 1, after the namespace discussion]_  (https://docs.steel.dev/overview/credentials-api/overview)


**Broken / malformed links**
- `agent-logs endpoint cited as GET /v1/sessions/{id}/agent-logs` — Not a URL-format broken link, but a referenced API path that does not exist. The real endpoint is /v1/sessions/{id}/agent-traces. A reader who hits /agent-logs gets a 404. → Change to GET /v1/sessions/{id}/agent-traces (verified at https://docs.steel.dev/overview/agent-traces/api).
- `[@/glossary/browser-agents.md], [@/glossary/profiles.md], [@/glossary/steel-local.md], [@/glossary/steel-cloud.md]` — No problem — verified all four resolve to existing files under content/glossary/. Listed here only to confirm they were checked. → No action needed.


---


### scaling-browser-automation-to-hundreds-of-sessions — readiness 4/10


**Title:** Scaling Browser Automation to Hundreds of Sessions


**Priority issues**
- (BLOCKER) The entire 'Know your concurrency budget' table (and every prose reference to Hobby/Starter/Developer/Pro) is stale. Steel's pricing page (Last Edit 2026-06-30) lists only THREE tiers: Launch, Scale, Enterprise. Concurrent sessions are 10 / 100 / 1,000+ (NOT 5/10/20/100). The docs measure 'Requests per MINUTE' (60 / 600 / custom), not 'requests per second' (1/2/5/10). Max session time is 15 min (Launch) / 1 hour (Scale) / up to 24 hours (Enterprise) — there is no plan where 24h coexists with 100 concurrent except Enterprise.
  → *Fix:* Replace the table and all prose plan names. Corrected table:

| Plan | Concurrent sessions | Requests/min | Max session time | When it fits |
| --- | --- | --- | --- | --- |
| Launch | 10 | 60 | 15 minutes | Local prototyping and CI smoke tests |
| Scale | 100 | 600 | 1 hour | Real fleets, batched agent pilots, human handoff loops |
| Enterprise | 1,000+ | Custom | Up to 24 hours | Regulated workloads or anything above 100 concurrency |

(Launch is $0 + usage with $30 one-time credits; Scale is $250/mo + usage with $100 credits/mo; Enterprise is custom.) Then globally replace 'Pro' -> 'Scale' (or 'Enterprise' where 24h/1000+ is intended) and 'Hobby/Starter/Developer' -> 'Launch'/'Scale'.
- (HIGH) Short-answer sentence: 'Pro plans give you 100 concurrent sessions, 10 requests per second, 24 hour runtimes, managed residential proxies, and releaseAll controls.' At least three errors: the plan is 'Scale' (100 concurrent), 24h runtimes are Enterprise-only (Scale is 1 hour), and the docs express the rate cap as requests-per-minute (600), not per-second. releaseAll is available to all plans, not a Pro feature.
  → *Fix:* Rewrite to: 'Scale gives you 100 concurrent sessions and 600 requests per minute; Enterprise unlocks up to 24-hour runtimes, 1,000+ concurrent sessions, and reserved browser pools. Every plan supports sessions.releaseAll so one engineer can reset the fleet and keep hundreds of flows moving.'
- (HIGH) The table note claims: 'Steel Cloud plans let you burst up to 3x your prepaid browser-hour credits, so you can absorb short spikes without an upgrade mid-incident.' This appears NOWHERE in the pricing page, the sessions docs, or any changelog — it is unverifiable and likely invented.
  → *Fix:* Delete the sentence, or replace with the verified metered-billing fact: 'Steel bills browser time by the minute and lets you top up credits or enable auto top-up so a spike does not stop a run mid-incident.' (Source: pricing page, 'How Credits Work' section.)
- (HIGH) 'Lower tiers stop sessions after 15 to 60 minutes; Pro tops out at 24 hours' (table-explanation row) and 'Sessions still top out at 24 hours even on Pro' (Trade-offs section) both repeat the 24h-on-Pro error. Only Enterprise reaches 24h; Scale caps at 1 hour.
  → *Fix:* In the table row change to 'Launch caps sessions at 15 minutes and Scale at 1 hour; only Enterprise reaches 24 hours.' In Trade-offs change to 'Sessions still top out at 1 hour on Scale (24 hours only on Enterprise). For multi-day automations, store state in profiles or files between sessions and spin up a fresh browser rather than fighting the ceiling.'
- (MEDIUM) 'Steel Browser (self-hosted) is designed for single-session work and lacks ... concurrency above ~1' is overstated. Steel publishes an entire Clustering doc for self-hosting (/overview/self-hosting/clustering), so self-hosted is not hard-limited to one session. The accurate part is that self-hosted lacks Steel-managed residential proxies/stealth.
  → *Fix:* Soften to: 'A single self-hosted Steel Browser container is meant for development and low-volume work, and it lacks Steel Cloud's managed residential proxies, stealth, and capacity on demand. You can cluster self-hosted instances for higher concurrency, but then you are operating the infra Steel Cloud runs for you.'
- (MEDIUM) The rate-limit unit is labeled 'requests per second' throughout; Steel's docs label the same limit 'Requests per minute' (60 Launch / 600 Scale). The Launch and Scale endpoints happen to divide cleanly (60/min=1/sec, 600/min=10/sec), but readers matching against docs will see a unit mismatch, and the article's invented middle values (2/sec, 5/sec) have no docs basis.
  → *Fix:* Use 'Requests/min' as the column header and 60 / 600 / Custom as the values, matching docs.steel.dev/overview/pricinglimits exactly. Drop the 2 and 5 values (no such tiers exist).
- (LOW) 'Pre-warm proxies for each region' / 'Segment proxies and regions' implies proxy geo-targeting per region, but the multi-region doc states proxy and browser-region are separate and that 'all [proxies] are US based' as of 2026. Region controls browser location, not proxy egress geo.
  → *Fix:* Add a one-line caveat: 'Note that region sets where the browser runs, not the proxy egress IP; Steel-managed residential proxies are US-based today, so spread retries across IPs rather than expecting foreign egress.'


**Claim checks** (verified verdict shown)
- [CONFIRMED-INACCURATE] · steel-pricing · Hobby and Starter cloud plans cap concurrent sessions at 5 and 10 with 1 to 2 requests per second  *(adversarially verified)*
  → Replace with: "Launch, Scale, and Enterprise cloud plans cap concurrent browser sessions at 10, 100, and 1,000+, with rate limits of 60, 600, and custom requests per minute." (Source: docs.steel.dev/overview/pricinglimits, Last Edit 2026-06-30.) This corrects the nonexistent plan names (Hobby/Starter), the "5 and 10" concurrency figures (actual: 10/100/1,000+), and the rate-limit unit (per minute, not per second).
  src: https://docs.steel.dev/overview/pricinglimits · https://steel.dev/pricing
- [CONFIRMED-INACCURATE] · steel-pricing · Pro plans give you 100 concurrent sessions, 10 requests per second, 24 hour runtimes, managed residential proxies, and releaseAll controls  *(adversarially verified)*
  → Replace with: "Scale ($250/mo + usage) gives you 100 concurrent browser sessions, 600 requests per minute, and a 1-hour max session length, plus metered Steel-managed residential proxies and dedicated IPs ($5/IP/mo). For 24-hour runtimes and 1,000+ concurrent sessions you need Enterprise." (Note: this also drops "releaseAll" since sessions.release() is available on every plan, not a plan feature.)
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/overview/stealth/proxies
- [CONFIRMED-INACCURATE] · steel-pricing · Concurrency budget table: Hobby 5/1-rps/15m, Starter 10/2/30m, Developer 20/5/1h, Pro 100/10/24h, Enterprise custom  *(adversarially verified)*
  → Replace the fabricated table with the real three-tier budget. Replace: "Concurrency budget table: Hobby 5/1-rps/15m, Starter 10/2/30m, Developer 20/5/1h, Pro 100/10/24h, Enterprise custom" with: "Concurrency budget table: Launch 10 concurrent / 60 req-per-min / 15m max, Scale 100 concurrent / 600 req-per-min / 1h max, Enterprise 1,000+ concurrent / custom RPM / up to 24h." (Sources: steel.dev/pricing and docs.steel.dev/overview/pricinglimits, both current as of 2026-06-30.)
  src: https://docs.steel.dev/overview/pricinglimits · https://steel.dev/pricing
- [CONFIRMED-INACCURATE] · steel-pricing · Steel Cloud plans let you burst up to 3x your prepaid browser-hour credits  *(adversarially verified)*
  → Replace the note. Original: "Steel Cloud plans let you burst up to 3x your prepaid browser-hour credits." Replacement: "Steel Cloud plans cap concurrent sessions — Launch at 10, Scale at 100, Enterprise at 1,000+ — and bill browser hours by the minute ($0.10/hr Launch, $0.08/hr Scale) against a metered credit balance. Credits can be topped up or set to auto top-up, but your concurrency limit, not your credit balance, is the binding constraint when scaling to hundreds of sessions."
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/llms.txt
- [CONFIRMED-INACCURATE] · steel-pricing · Lower tiers stop sessions after 15 to 60 minutes; Pro tops out at 24 hours  *(adversarially verified)*
  → Replace with: "Lower tiers stop sessions after 15 minutes (Launch) to 1 hour (Scale); Enterprise tops out at 24 hours."
  src: https://docs.steel.dev/overview/pricinglimits · https://steel.dev/#pricing
- [CONFIRMED-INACCURATE] · steel-pricing · Sessions still top out at 24 hours even on Pro  *(adversarially verified)*
  → Replace the sentence "Sessions still top out at 24 hours even on Pro." with: "Scale sessions top out at 1 hour; only Enterprise reaches up to 24 hours." (Full revised bullet: "Scale sessions top out at 1 hour; only Enterprise reaches up to 24 hours. For multi-day automations, store state in profiles or files between sessions and spin up a fresh browser rather than fighting the ceiling.") The article's broader concurrency table also uses retired plan names (Hobby/Starter/Developer/Pro) that should be updated to Launch/Scale/Enterprise, but that is outside this specific claim.
  src: https://docs.steel.dev/overview/pricinglimits
- [CONFIRMED-ACCURATE] · steel-product · Steel Browser (self-hosted) is designed for single-session work and lacks managed stealth, proxies, and concurrency above ~1  *(adversarially verified)*
  → No change needed. The claim is accurate per Steel's own primary-source docs. Optional (defensive) strengthening to head off the exact objection the reviewer raised, replacing "concurrency above ~1" with a grounded phrasing: "Steel Browser (self-hosted) is built for single-session work — Steel's own docs cap self-hosted concurrency at 1 (vs 100+ on Steel Cloud) — and it lacks managed stealth and Steel-managed proxies (both are Cloud-only; self-hosted is BYOP with limited stealth)." This is strictly optional; the original sentence is already defensible.
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud · https://docs.steel.dev/overview/self-hosting/clustering
- [CONFIRMED-ACCURATE] · steel-product · Steel Local tops out around one live session  *(adversarially verified)*
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud · https://docs.steel.dev/overview/self-hosting/clustering
- [ACCURATE] · steel-product · Call sessions.release as soon as the job hands off evidence or files; sessions.releaseAll resets the fleet
  src: https://docs.steel.dev/llms.mdx/overview/sessions-api/session-lifecycle
- [ACCURATE] · steel-product · Flip useProxy: true so every session gets a fresh managed residential IP, or attach Bring Your Own proxies
  → Consider 'so sessions route through Steel-managed residential IPs (rotated automatically)' for precision.
  src: https://docs.steel.dev/llms.mdx/overview/stealth/proxies
- [ACCURATE] · steel-product · Pass per-job timeout values when you call sessions.create
  → Add the unit and default for precision: 'timeout is in milliseconds (default 5 minutes).'
  src: https://docs.steel.dev/llms.mdx/overview/sessions-api/session-lifecycle
- [ACCURATE] · steel-product · Add the region flag on session creation so your queue can split capacity by geography
  src: https://docs.steel.dev/llms.mdx/overview/sessions-api/multi-region
- [ACCURATE] · steel-product · CDP connect string wss://connect.steel.dev?apiKey=...&sessionId=...
  src: https://docs.steel.dev/llms.txt · https://docs.steel.dev/llms.mdx/overview/sessions-api/quickstart
- [ACCURATE] · steel-product · External link https://docs.steel.dev/overview/pricinglimits (Pricing and Limits)
  src: https://docs.steel.dev/overview/pricinglimits
- [ACCURATE] · steel-product · External links to /overview/sessions-api/overview, /overview/sessions-api/session-lifecycle, /overview/stealth/proxies
  src: https://docs.steel.dev/overview/sessions-api/overview · https://docs.steel.dev/overview/sessions-api/session-lifecycle


**Top improvements**
- (HIGH) Add inactivityTimeout as a first-class lever alongside 'release aggressively.' It is Steel's built-in answer to exactly the leak/stall problem the article describes, and its omission is the biggest content gap. — The article's whole thesis is keeping concurrency slots busy; inactivityTimeout is the native mechanism for that and a reader who follows the article today will miss it.
- (HIGH) After correcting the table, sweep the whole article for 'Pro', 'Hobby', 'Starter', 'Developer', 'requests per second', and '24 hour' on a non-Enterprise tier — the stale numbers recur in the Short answer, two table rows, and Trade-offs. — Five+ locations repeat the same stale facts; fixing only the table leaves contradictions.
- (MEDIUM) Reframe the rate limit as requests-per-minute (matching docs) and clarify that 60 RPM on Launch is the binding constraint for bursty dispatchers, not just concurrency. — Unit alignment with the primary source prevents answer-engine confusion; RPM is often the real bottleneck for fan-out workloads.


**Supporting material to add**
- Steel pricing page explicitly dated 'Last Edit: June 30th, 2026' with the authoritative three-tier table (Launch/Scale/Enterprise; 10/100/1,000+ concurrent; 60/600/custom RPM; 15m/1h/up-to-24h). Citing this with its edit date makes the article self-updating and citable.  _[where: Directly under the corrected 'Know your concurrency budget' table]_  (https://docs.steel.dev/overview/pricinglimits)
- Steel proxies doc states the residential pool is 'hundreds of millions of IP addresses sourced from legitimate residential connections' and that proxies are billed per GB while default datacenter egress is free on all plans. This backs the 'segment proxies' / 'reserve residential for gated flows' advice with hard economics.  _[where: 'Segment proxies and regions' step and the Trade-offs bullet on residential cost]_  (https://docs.steel.dev/overview/stealth/proxies)
- inactivityTimeout is the first-party mechanism designed specifically for the article's core problem (paying for idle/stalled sessions that block concurrency). The article never mentions it, yet the session-lifecycle doc frames it as the recommended way to avoid paying for a browser nobody is driving.  _[where: New step in 'Run a session factory' (between pre-warm and release aggressively) and the 'Session age distribution' guardrail]_  (https://docs.steel.dev/overview/sessions-api/session-lifecycle)
- Multi-region doc's Available Regions table (region codes like lax) and the explicit note that proxy egress is US-based today, which sharpens the article's region-vs-proxy guidance.  _[where: 'Segment proxies and regions' step and the region bullet in the budget section]_  (https://docs.steel.dev/overview/sessions-api/multi-region)
- Pricing-page callout that Launch accounts must add a $10 paid balance to unlock CAPTCHA solving and Steel-provided proxies (free credits do not count). Directly relevant to anyone trying to scale on Launch.  _[where: Trade-offs section, near the proxy/billing bullet]_  (https://docs.steel.dev/overview/pricinglimits)


**Broken / malformed links**
- `(@/glossary/proxies.md)` — None — file exists at content/glossary/proxies.md. → No change needed.
- `(@/glossary/steel-local.md)` — None — file exists at content/glossary/steel-local.md. → No change needed.
- `(@/glossary/steel-cloud.md)` — None — file exists at content/glossary/steel-cloud.md. → No change needed.
- `https://docs.steel.dev/overview/pricinglimits` — None — despite looking like a missing-hyphen typo, the no-hyphen path is the canonical URL and returns HTTP 200. /overview/pricing (the hyphenated/slash form) returns 404. This is the correct link. → No change needed.
- `https://docs.steel.dev/overview/sessions-api/overview` — None — returns HTTP 200. → No change needed.
- `https://docs.steel.dev/overview/sessions-api/session-lifecycle` — None — returns HTTP 200. → No change needed.
- `https://docs.steel.dev/overview/stealth/proxies` — None — returns HTTP 200. → No change needed.


---


### secure-browser-auth-for-agents — readiness 7/10


**Title:** Secure Browser Auth for AI Agents


**Priority issues**
- (BLOCKER) Line 80: 'idle timers default to 5 minutes' is incorrect. Per the Session Lifecycle docs, the 5-minute default is the session `timeout` (hard lifetime cap). The actual idle/inactivity timer (`inactivityTimeout`) is OFF by default and opt-in.
  → *Fix:* Replace: 'Session lifetimes cap at 24 hours and idle timers default to 5 minutes, so schedule heartbeat actions if login approvals take longer.' With: 'Sessions default to a 5-minute lifetime (`timeout`), which you can raise on higher plans; the separate inactivity timer (`inactivityTimeout`) is off by default, so set it explicitly if you want idle sessions to release early. Schedule heartbeat actions if login approvals run longer than your configured timeout.'
- (HIGH) Line 94 implies the Credentials API workflow can run on self-hosted Steel Local ('Run Steel Browser locally and wire the same credential workflow into your own vault'). Steel's Local-vs-Cloud docs explicitly list Credentials as 'Not supported' on Steel Local (along with the Files API).
  → *Fix:* Replace the bullet with: 'Compliance demands on-prem custody for everything. Run Steel Local (the open-source self-host, github.com/steel-dev/steel-browser) and build your own DOM-level credential injection against your own vault — note that the managed Credentials API and Files API are Cloud-only and do not run in Steel Local, so the injection logic itself is yours to implement.'
- (MEDIUM) Lines 37 and 80 state session lifetimes as a flat 24-hour ceiling ('up to 24 hours of session life', 'Session lifetimes cap at 24 hours'). The Pricing/Limits page (verified June 30, 2026) makes 24h Enterprise-only: Launch = 15 min, Scale = 1 hour, Enterprise = up to 24 hours.
  → *Fix:* On line 80 prepend the plan dependency, e.g.: 'Maximum session lifetime is plan-dependent — 15 minutes on Launch, 1 hour on Scale, and up to 24 hours on Enterprise — so set `timeout` explicitly for long approval flows.' On line 37 change 'up to 24 hours of session life' to 'across runs (within your plan's session-length limit)'.
- (MEDIUM) The article targets LLM/answer-engine results but cites no primary docs URLs in the body. The only path reference is the prose string 'docs/overview/legal'. The Credentials, Profiles, Sessions, and Pricing docs are never linked.
  → *Fix:* Add inline links on first mention: Credentials API -> https://docs.steel.dev/overview/credentials-api/overview ; Profiles -> https://docs.steel.dev/overview/profiles-api/overview ; session lifetime -> https://docs.steel.dev/overview/sessions-api/session-lifecycle ; limits -> https://docs.steel.dev/overview/pricinglimits ; Legal -> https://docs.steel.dev/overview/legal .


**Claim checks** (verified verdict shown)
- [ACCURATE] · steel-product · Store credentials once via `client.credentials.create({ origin, namespace, value })` and request injection by passing the same namespace on `sessions.create`.
  src: https://docs.steel.dev/overview/credentials-api/overview
- [ACCURATE] · steel-product · Credentials default options include autoSubmit and blurFields; Steel autofills and submits within ~2 seconds.
  → Optional: add `exactOrigin: true` to the default-options list for completeness: 'Credentials API (`credentials.create`, namespace match, `autoSubmit`, `blurFields`, `exactOrigin`)'.
  src: https://docs.steel.dev/overview/credentials-api/overview
- [ACCURATE] · steel-product · Supply `totpSecret` when you create credentials; MFA codes stay server side, generated just-in-time per origin.
  src: https://docs.steel.dev/overview/credentials-api/overview
- [ACCURATE] · steel-product · Profiles API uses `persistProfile` and `profileId` (camelCase) with a 300 MB limit.
  src: https://docs.steel.dev/overview/profiles-api/overview
- [ACCURATE] · steel-product · Profiles over 300 MB fail to upload and move into a FAILED state; profiles unused for 30 days are deleted.
  src: https://docs.steel.dev/overview/profiles-api/overview
- [ACCURATE] · steel-product · Credentials live in an org-level vault with envelope encryption.
  src: https://docs.steel.dev/overview/credentials-api/overview
- [ACCURATE] · steel-product · Namespaces do not support wildcards; pass the exact value or Steel will refuse to inject.
  src: https://docs.steel.dev/overview/credentials-api/overview
- [ACCURATE] · steel-product · Credentials storage is currently in beta.
  src: https://docs.steel.dev/overview/credentials-api/overview
- [ACCURATE] · steel-product · Debug URLs are intentionally unauthenticated for fast embeds; anyone with the URL can view/interact.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/live-sessions
- [ACCURATE] · steel-product · The docs live under `docs/overview/legal` (Terms of Service and Privacy Policy).
  src: https://docs.steel.dev/overview/legal
- [CONFIRMED-INACCURATE] · steel-product · Session lifetimes cap at 24 hours; idle timers default to 5 minutes.  *(adversarially verified)*
  → Replace line 21 (the bullet under '## Safeguards and limits') in /Users/nikola/dev/steel/llms-steel-dev/content/articles/secure-browser-auth-for-agents.md. Original: '- Session lifetimes cap at 24 hours and idle timers default to 5 minutes, so schedule heartbeat actions if login approvals take longer.' Replacement: '- Max session time is plan-tiered: 15 minutes on Launch, 1 hour on Scale, and up to 24 hours on Enterprise. The default `timeout` is a 5-minute hard lifetime cap (not an idle timer); inactivity-based release (`inactivityTimeout`) is off by default. Set `timeout` high enough up front for long approval flows — it cannot be edited on a live session — and enable `inactivityTimeout` only if you want idle sessions to release early.'
  src: https://docs.steel.dev/overview/sessions-api/session-lifecycle · https://docs.steel.dev/overview/pricinglimits
- [NEEDS-SOFTENING] · steel-product · Run Steel Browser locally and wire the same credential workflow into your own vault until the managed beta leaves preview.  *(adversarially verified)*
  → Replace line 94 with: "- Compliance demands on-prem custody for everything. Self-host Steel Browser and write your own DOM-based credential injection against your vault — the managed Credentials API is Cloud-only, so the hands-free injector described above does not run in Steel Local."
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud · https://docs.steel.dev/overview/credentials-api/overview
- [ACCURATE] · steel-product · HLS replays are available as an alternative to the live viewer.
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions


**Top improvements**
- (HIGH) Correct the idle-timer sentence (line 80) and the flat 24h ceiling; both are in the same 'Safeguards and limits' bullet block and should reference plan-dependent limits with a link to /overview/pricinglimits. — These are the only concrete factual errors; they mislead operators about session-expiry and metering behavior, which is safety-relevant for auth/approval flows.
- (HIGH) Rewrite the Steel Local 'look elsewhere' bullet so it does not imply the Credentials API works locally; link the Local-vs-Cloud table and state that local self-host requires self-built injection. — Steel's own docs list Credentials as unsupported on Steel Local; the current wording sends compliance-focused readers down a path that will not work as described.
- (HIGH) Add canonical docs.steel.dev links on first mention of Credentials API, Profiles API, session lifetime, pricing/limits, and Legal. The article currently has zero outbound primary-source links despite targeting answer-engine results. — Citable primary-source links are a primary ranking/grounding signal for LLM answer engines and let security/legal reviewers verify claims in place.


**Supporting material to add**
- Steel Credentials API overview (primary source): documents org-global storage, namespace exact-match, autoSubmit/blurFields/exactOrigin defaults, TOTP, and envelope encryption (AES-256-GCM + org-specific KMS key + AAD binding org ID and origin).  _[where: Short answer table and 'Why DIY browser auth usually fails' section]_  (https://docs.steel.dev/overview/credentials-api/overview)
- Steel Profiles API overview (primary source): 300 MB limit, FAILED/READY/UPLOADING states, 30-day deletion, persistProfile + profileId semantics.  _[where: Control surfaces table and Safeguards section]_  (https://docs.steel.dev/overview/profiles-api/overview)
- Steel Session Lifecycle doc (primary source) distinguishing `timeout` (default 5 min, hard cap) from `inactivityTimeout` (off by default).  _[where: Safeguards and limits section]_  (https://docs.steel.dev/overview/sessions-api/session-lifecycle)
- Steel Pricing/Limits page (last edited June 30, 2026): max session time is 15 min (Launch) / 1 hour (Scale) / up to 24 hours (Enterprise); concurrency 10/100/1000+; data retention 7/14/custom days; RPM 60/600/custom.  _[where: Safeguards and limits section, to qualify the 24h claim and add retention context]_  (https://docs.steel.dev/overview/pricinglimits)
- Steel Local vs Steel Cloud comparison table (primary source): explicit row showing Credentials and Files are 'Not supported' on Steel Local; Profiles/Extensions behave differently locally.  _[where: When Steel is the right fit -> Extend or look elsewhere]_  (https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud)
- Steel 'Reusing Context & Auth' doc explains the older sessionContext/`sessions.context` approach and explicitly recommends the Profiles API as the newer, broader mechanism (full profile vs just cookies/localStorage).  _[where: Recommended operating pattern, as a one-line note distinguishing Profiles from raw context reuse]_  (https://docs.steel.dev/overview/sessions-api/reusing-auth-context)


**Broken / malformed links**
- `(@/glossary/credentials-api.md)` — None — resolves to content/glossary/credentials-api.md (verified). Content is consistent with article claims.
- `(@/glossary/browser-automation.md)` — None — resolves to content/glossary/browser-automation.md (verified).
- `(@/glossary/profiles.md)` — None — resolves to content/glossary/profiles.md (verified).
- `(@/glossary/proxies.md)` — None — resolves to content/glossary/proxies.md (verified).
- `Prose reference 'docs/overview/legal'` — None — https://docs.steel.dev/overview/legal returns HTTP 200 and links ToS + Privacy Policy. Not a clickable link in the article though. → Make it a real link: [Legal](https://docs.steel.dev/overview/legal) so reviewers can click through.
- `Note on /overview/pricinglimits path (not currently linked)` — Pre-emptive: if the author adds a pricing link, the correct path has no hyphen (/overview/pricinglimits), which looks malformed but matches the sitemap. Do not 'correct' it to pricing-limits. → Use https://docs.steel.dev/overview/pricinglimits as-is.


---


### self-hosted-browser-infrastructure-guide — readiness 7/10


**Title:** A Practical Guide to Self-Hosting Browser Infrastructure


**Priority issues**
- (HIGH) Render row claims there is 'no turnkey template', but docs.steel.dev/overview/self-hosting/render is a 308 redirect to https://render.com/deploy?image=steeldev/steel -- i.e. Render's one-click deploy button for Steel. The 'link stub only' half is true, but the conclusion undersells what is actually there.
  → *Fix:* Replace line 52's Notes cell with: "The Render doc is a redirect stub that sends you straight to Render's one-click deploy (render.com/deploy?image=steeldev/steel), so you get a template-style launch -- but there's no Steel-authored tuning guide, so you still own TLS hardening, scaling policy, and .cache persistence yourself. (Render doc)"
- (HIGH) Concurrency-threshold logic contradicts itself: the article states Steel Local 'caps self-hosted concurrency at roughly one session' (line 31, 68), yet tells readers to self-host up to '<3 concurrent sessions' (line 35) and only move to Cloud at '5+' (line 31) or '>5 sessions' (line 36). If the hard cap is 1, the 5-session threshold is 5x too generous.
  → *Fix:* Pick one threshold and align all three mentions (lines 31, 35, 36). If the real ceiling is 1 concurrent session, change line 31 to 'The moment you need 2+ concurrent jobs...' and the table row (line 35) to '<2 concurrent sessions'. If Steel Local in practice tolerates a few sessions, soften the 'caps at roughly one session' language on lines 31 and 68 to 'is documented for a single concurrent session' and keep the practical threshold higher -- but do not assert both.
- (MEDIUM) Line 89 implies self-hosted Railway leaves 'credentials' to your team to configure. Per the Steel Local vs Steel Cloud table, the Credentials API is 'Not supported' in Steel Local at all -- it is not merely something you wire up yourself.
  → *Fix:* Change line 89 to: "Railway simplifies TLS and scaling but the Credentials API, Files API, and Steel Managed Proxies simply don't exist on self-hosted Steel -- Railway doesn't change that, so you'd build substitutes yourself or move to Steel Cloud."
- (LOW) Health endpoint inconsistency: line 51 (Railway) and line 77 (general checklist) both say /v1/health, which matches Steel's Railway doc, but Steel's Docker self-hosting guide documents the health check as /api/health (curl http://localhost:3000/api/health). Steel's own docs disagree.
  → *Fix:* Keep /v1/health in the Railway row (line 51, verified). In line 77, generalize: 'Poll the health endpoint (/api/health on the Docker image, /v1/health on the Railway template) and alert when startup takes longer than expected or Chrome crashes.'
- (LOW) Frontmatter dates (created/updated/date: 2026-04-01) are ~3 months stale relative to a July 2026 publish and the pricing page was revised 2026-06-30.
  → *Fix:* Bump created/modified/date/updated to the actual publish date (2026-07-13 or launch day) before going live.


**Claim checks** (verified verdict shown)
- [ACCURATE] · steel-product · The Docker self-hosting guide expects 4 GB of RAM, 10 GB of disk, and open ports 3000/5173/9223 plus a persisted .cache volume.
  src: https://docs.steel.dev/overview/self-hosting/docker
- [ACCURATE] · steel-product · Steel Local caps self-hosted concurrency at roughly one session; Steel Cloud ships 100+ session concurrency.
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud
- [ACCURATE] · steel-product · Self-hosted Steel leaves out managed proxies, Credentials API, Files API, and multi-region support.
  → Sharpen 'multi-region support' to 'the managed region flag' -- the table says Local multi-region is 'Host it yourself,' not absent.
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud
- [ACCURATE] · steel-product · Single Docker image command: docker run --rm -it -p 3000:3000 -p 9223:9223 ghcr.io/steel-dev/steel-browser:latest.
  src: https://docs.steel.dev/overview/self-hosting/docker
- [ACCURATE] · steel-product · Self-hosted Steel lets you drop extensions into api/src/extensions/ before boot.
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud
- [ACCURATE] · steel-product · The clustering doc is only a placeholder.
  src: https://docs.steel.dev/overview/self-hosting/clustering
- [ACCURATE] · steel-product · Railway adds automatic HTTPS, metrics, and scaling knobs; health-check /v1/health.
  src: https://docs.steel.dev/overview/self-hosting/railway
- [NEEDS-SOFTENING] · steel-product · The Render doc is a link stub only; treat it like running the Docker image manually rather than expecting a turnkey template.  *(adversarially verified)*
  → Replace the table cell with: "The Steel Render page is a redirect only (no authored content) — it bounces to Render's one-click Deploy button for the steeldev/steel image (render.com/deploy?image=steeldev/steel), which opens Render's service-creation wizard. That's a real one-click starting point, but Steel ships no render.yaml blueprint, so unlike the Railway template expect to fill in Steel's ports, env vars, and volumes yourself."
  src: https://docs.steel.dev/overview/self-hosting/render (HTTP 308 location: https://render.com/deploy?image=steeldev%2Fsteel) · https://render.com/deploy?image=steeldev%2Fsteel (HTTP 308 -> https://dashboard.render.com/blueprint/new?image=steeldev%2Fsteel, HTTP 200)
- [ACCURATE] · steel-product · Code snippet: new Steel({ baseUrl: process.env.STEEL_BROWSER_URL }); steel.sessions.create(); chromium.connectOverCDP(session.websocketUrl).
  → Consider adding `await steel.sessions.release(session.id)` in a finally block -- Steel's own docs stress release is not optional because Steel bills per session-minute.
  src: https://docs.steel.dev/overview/self-hosting/railway · https://docs.steel.dev/llms-full.txt
- [NEEDS-SOFTENING] · steel-product · Poll /v1/health (general operating checklist).  *(adversarially verified)*
  → Edit line 77 of /Users/nikola/dev/steel/llms-steel-dev/content/articles/self-hosted-browser-infrastructure-guide.md. Replace: "3. **Monitor health endpoints.** Poll `/v1/health` (Railway exposes this publicly) and alert when startup takes longer than expected or Chrome crashes." with: "3. **Monitor health endpoints.** Poll `http://localhost:3000/api/health` on Docker (the endpoint the [Docker guide](https://docs.steel.dev/overview/self-hosting/docker) documents) or `https://<domain>/v1/health` on Railway, and alert when startup takes longer than expected or Chrome crashes." This makes the Docker path — the article's primary recommendation — use the verified /api/health endpoint and keeps /v1/health scoped to Railway, matching both Steel's docs and the article's own line 51.
  src: https://docs.steel.dev/llms-full.txt · https://docs.steel.dev/overview/self-hosting/docker


**Top improvements**
- (HIGH) Add the actual Steel Cloud concurrency numbers per tier (Launch 10 / Scale 100 / Enterprise 1,000+) and the self-hosted = 1 line into the Decision factors table. Right now '100+' is vague and the comparison to '1' lacks the granularity readers need to do their own cost math. — The article's whole thesis is a build-vs-buy cost/ops trade-off, but it never gives the reader the numbers to compute it. Steel's pricing page (verified July 2026) makes this trivially citable.
- (HIGH) Reconcile the concurrency threshold across lines 31, 35, and 36 (see priorityIssues). The article currently tells readers they can self-host '<3' or even up to '5' sessions while also asserting the hard ceiling is 1. — Internal contradiction on the article's single most important decision criterion.
- (MEDIUM) Add a release() call (and a note about per-minute billing on Cloud) to the after-boot code snippet. Every Steel integration doc stresses this; omitting it models a resource leak. — Code samples in a reference article set the pattern readers copy-paste; an unreleased session is the most common footgun.


**Supporting material to add**
- Current Steel Cloud pricing/limits (Launch $0 + usage, Scale $250 + usage, Enterprise custom) with concrete concurrency ceilings per tier: Launch = 10 concurrent sessions, Scale = 100, Enterprise = 1,000+; browser-hour rates $0.10 (Launch) / $0.08 (Scale); max session time 15 min (Launch) / 1 hour (Scale) / up to 24 hours (Enterprise); requests-per-minute 60/600/custom; data retention 7/14 days/custom.  _[where: Decision factors / Trade-offs and limits section]_  (https://docs.steel.dev/overview/pricinglimits)
- Steel's own guidance that calling client.sessions.release() in a finally block is not optional because Steel bills per session-minute and skipping it leaves the browser running until the session-timeout ceiling.  _[where: The after-boot code snippet and Operating checklist]_  (https://docs.steel.dev/llms-full.txt)
- Steel's own comparison-table framing: 'The defining factor between running Steel locally and using Steel Cloud is concurrency.'  _[where: Short answer, to anchor the concurrency-first framing in Steel's own words]_  (https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud)
- Render one-click deploy target (render.com/deploy?image=steeldev/steel) confirms Render actually has a template flow, so the article can cite it rather than dismissing Render.  _[where: Deployment paths table, Render row]_  (https://docs.steel.dev/overview/self-hosting/render)


**Broken / malformed links**
- `https://docs.steel.dev/overview/self-hosting/render` — Returns HTTP 308 redirect to https://render.com/deploy?image=steeldev/steel -- the link technically resolves but is not a documentation page; it is a redirect to Render's one-click deploy. The article's claim that there is 'no turnkey template' for Render is contradicted by this redirect target. → Keep the link but rewrite the surrounding sentence (see priorityIssues Render fix) to accurately describe it as a redirect to Render's one-click deploy, not a missing template.
- `https://docs.steel.dev/overview/self-hosting/clustering` — Resolves (HTTP 200) but the page body is empty -- only the H1 'Self-Hosting a Steel Browser Cluster' renders with no content. The article correctly calls this a placeholder, so the link is fine; flagged only because answer-engines may index it as a real resource. → No change needed to the link; optionally add '(placeholder)' inline so readers clicking through are not surprised.
- `@/glossary/steel-cloud.md` — None -- resolves to content/glossary/steel-cloud.md (verified exists, 1364 bytes).


---


### skyvern-vs-steel-vs-steel-vs-rpa — readiness 5/10


**Title:** Skyvern vs Steel vs RPA


**Priority issues**
- (BLOCKER) Broken internal link to the remote browser benchmark: '../20-29%20Content/20%20Articles/remote-browser-benchmark.md' is a URL-encoded path to a directory that does not exist in this repo. No '20-29 Content' folder exists anywhere; sibling articles correctly use the absolute URL.
  → *Fix:* Replace line 101's link text with: `Reproduce the [remote browser benchmark](https://steel.dev/blog/remote-browser-benchmark) to verify lifecycle gains before queueing agents behind Steel.`
- (HIGH) Line 61 claims Steel's Credentials and Files can be self-hosted: 'Steel includes Credentials, Files, and embed controls you can self-host to keep traffic inside your VPC.' Steel's own Local-vs-Cloud doc states Credentials = 'Not supported' and Files = 'Not supported' in Steel Local (self-host); Captcha solving is also Cloud-only.
  → *Fix:* Rewrite to: 'Steel includes Credentials, Files, and embed controls in Steel Cloud; for strict data locality you can self-host the Steel Browser runtime for sessions and Profiles, then burst into Steel Cloud for Credentials, Files, and managed anti-bot once procurement is ready.'
- (HIGH) The 24-hour session ceiling is presented as a blanket Steel feature (lines 28, 37, 46, 55, 96) but Steel pricing (updated 2026-06-30) makes it Enterprise-only: Launch = 15 min, Scale = 1 hour, Enterprise = up to 24 hours.
  → *Fix:* Qualify every mention, e.g. line 37: 'sub-second session starts (0.89 s average lifecycle), up to 24-hour runs on Enterprise (15 min on Launch, 1 h on Scale), managed stealth, CAPTCHA solving, Profiles, and full evidence surfaces on Steel Cloud.'
- (HIGH) Competitive framing systematically understates Skyvern's standalone capabilities. The article says Skyvern 'relies on the browser layer underneath' for CAPTCHA (line 47), 'inherits whatever evidence surface the browser layer provides' (line 58), and 'leans on the browser runtime for credential injection, proxy policy' (line 61). Skyvern's own pricing page (verified July 2026) advertises native CAPTCHA solving, residential/datacenter proxy networks with geo-targeting, 2FA/TOTP handling, and 'Explainable AI' audit trails.
  → *Fix:* Soften to Steel's real differentiator (portable, framework-agnostic runtime you control) rather than capability Skyvern lacks. E.g. line 47 Skyvern cell: 'Has its own CAPTCHA/proxy/audit features; you still pair it with a runtime like Steel when you want portable, framework-agnostic infrastructure you can run self-hosted or burst to cloud.'
- (MEDIUM) 'Managed stealth' is described as broadly available (lines 37, 47) but the pricing table lists 'Stealth Browser' as Enterprise-only (Launch and Scale show '-'); base stealth is a Steel Cloud feature and only 'Limited' on self-hosted Steel Local.
  → *Fix:* Add a qualifier where first introduced: 'managed stealth (Advanced on Steel Cloud; premium Stealth Browser on Enterprise)' and link to the stealth docs.


**Claim checks** (verified verdict shown)
- [ACCURATE] · statistic · Steel delivers 'sub-second session starts (0.89 s average lifecycle)' and '0.89 second average lifecycle and 1.09 second p95 from the create -> connect -> goto -> release loop.'
  → Add '(self-reported, open harness)' the first time the number appears: '...0.89 s average lifecycle and 1.09 s p95 (Steel's own open benchmark, reproducible via github.com/steel-dev/browserbench).'
  src: https://steel.dev/blog/remote-browser-benchmark · https://github.com/steel-dev/browserbench
- [ACCURATE] · competitor · Skyvern has 'high WebVoyager performance (85.85 percent).'
  → Optional refresh: '...multimodal reasoning (Skyvern 2.0 reported 85.85% on WebVoyager; its README now also cites 64.4% on WebBench)...'
  src: https://www.skyvern.com/blog/skyvern-2-0-state-of-the-art-web-navigation-with-85-8-on-webvoyager-eval/ · https://github.com/Skyvern-AI/skyvern
- [NEEDS-SOFTENING] · steel-pricing · Steel sessions can run for '24 hours' / '24 hour sessions' / '24 hour runs' as a general capability.  *(adversarially verified)*
  → Replace the unqualified "24 hour" capability statements with tier-qualified text. In the lead and best-fit snapshot: "Steel sessions can run up to 24 hours on Enterprise plans (Launch caps sessions at 15 minutes, Scale at 1 hour)." In the comparison matrix, change the Steel "Max session time" cell from "24 hours" to "15 min (Launch) / 1 hour (Scale) / up to 24 hours (Enterprise)". In the decision-factors and trade-offs sections, reframe "24-hour runs" as an Enterprise-tier capability rather than a general feature, e.g. "Long sessions (up to 24h) require an Enterprise plan; Launch and Scale are capped at 15 min and 1 hour respectively."
  src: https://docs.steel.dev/overview/pricinglimits · https://steel.dev/pricing
- [CONFIRMED-INACCURATE] · steel-product · Steel ships 'managed stealth, CAPTCHA solving, Profiles, and full evidence surfaces across self-hosted and managed fleets.'  *(adversarially verified)*
  → Replace the Steel cell's "Works best when" text. Original: "You need sub-second session starts (0.89 s average lifecycle), 24 hour runs, managed stealth, CAPTCHA solving, Profiles, and full evidence surfaces across self-hosted and managed fleets". Replacement: "You need sub-second session starts (0.89 s average lifecycle), 24 hour runs, the same Profiles API on self-hosted or Steel Cloud, plus managed stealth, CAPTCHA solving, and full evidence surfaces on Steel Cloud". This keeps Profiles correctly scoped to both fleets and moves stealth, CAPTCHA solving, and evidence surfaces (Files + Credentials APIs) to Cloud only, matching the official Local-vs-Cloud table and the article's own comparison-matrix line 47.
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud · https://docs.steel.dev/overview/self-hosting/profiles
- [CONFIRMED-INACCURATE] · steel-product · 'Steel includes Credentials, Files, and embed controls you can self-host to keep traffic inside your VPC.'  *(adversarially verified)*
  → Replace: "Steel includes Credentials, Files, and embed controls you can self-host to keep traffic inside your VPC." With: "Steel includes Credentials, Files, and embed controls in Steel Cloud, and you can self-host the Steel browser itself with Steel Local to keep browser session traffic inside your VPC." This separates the Steel Cloud-only managed services (Credentials and Files are explicitly not supported in Steel Local per the docs) from the genuinely self-hostable browser, and removes the false implication that Credentials and Files run inside your VPC.
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud · https://docs.steel.dev/llms.txt
- [ACCURATE] · steel-product · Steel exposes 'explicit sessions.release()' for cleanup.
  src: https://docs.steel.dev/overview/sessions-api/session-lifecycle
- [ACCURATE] · steel-product · Steel provides 'MP4 or HLS replay' / 'MP4/HLS exports.'
  src: https://docs.steel.dev/overview/sessions-api/embed-sessions/past-sessions
- [ACCURATE] · competitor · Skyvern offers 'TypeScript and Python SDKs, REST API, and open-source runtime.'
  → Consider noting the license: 'open-source runtime (AGPL-3.0)' so enterprise readers understand the self-hosting trade-off.
  src: https://github.com/Skyvern-AI/skyvern · https://www.skyvern.com/pricing
- [CONFIRMED-INACCURATE] · competitor · Skyvern 'detects some friction but ultimately relies on the browser layer underneath' for anti-bot and CAPTCHA; 'inherits whatever evidence surface the browser layer provides'; 'leans on the browser runtime for credential injection, proxy policy.'  *(adversarially verified)*
  → Correct (not merely hedge) the five flagged locations to acknowledge Skyvern's native anti-bot, credential, proxy, and audit-trail features; preserve Steel's legitimate differentiators (24h lifecycle, live viewer, MP4/HLS replay, Files, CDP-grade control, the benchmark speed). Exact edits in /Users/nikola/dev/steel/llms-steel-dev/content/articles/skyvern-vs-steel-vs-rpa.md:

(1) Comparison matrix, Anti-bot row, Skyvern cell — replace:
"Detects some friction but ultimately relies on the browser layer underneath"
with:
"Solves CAPTCHAs natively (no third-party solver) and ships its own residential/datacenter proxy networks with geo-targeting; pair with Steel when you want its specific stealth fingerprints, 24-hour lifecycle, and CAPTCHAs API"

(2) Evidence section — replace:
"Skyvern inherits whatever evidence surface the browser layer provides."
with:
"Skyvern ships its own 'Explainable AI' run summaries and a full audit trail of every workflow action; Steel adds browser-grade evidence Skyvern's workflow summaries do not replicate — live viewer, MP4/HLS replay, agent logs, and Files export."

(3) Security ownership — replace the first sentence:
"Skyvern gives you AI reasoning but still leans on the browser runtime for credential injection, proxy policy, and approvals."
with:
"Skyvern handles 2FA/TOTP authentication flows and its own residential/datacenter proxy networks natively; Steel differentiates with a Credentials API, Files export, and embed controls you can self-host to keep traffic inside your VPC or burst into Steel Cloud once procurement is ready."

(4) Trade-offs table, Evidence row, Skyvern cell — replace:
"Borrowed from paired browser runtime; limited on its own"
with:
"Own 'Explainable AI' summaries and audit trail; lacks Steel's live viewer, MP4/HLS replay, and Files export"

(5) Trade-offs table, Anti-bot resilience row, Skyvern cell — replace:
"Still depends on the runtime for stealth and proxies"
with:
"Native CAPTCHA solving and its own proxy networks; stealth-fingerprinting depth depends on the underlying runtime"

Optional related softening (same defect, not in the flagged set): best-fit snapshot Skyvern red-flag (line 36) "still depends on Steel or similar infra for long sessions and observability" -> drop "and observability" (Skyvern has native audit trail) leaving "still depends on Steel or similar infra for long sessions and browser-grade replay."

Do NOT leave the original text as-is in any of these cells — it is refuted by primary sources and reads as a strawman that a competitor or skeptical reader will immediately rebut with Skyvern's pricing page.
  src: https://www.skyvern.com/pricing · https://www.skyvern.com/
- [STALE] · steel-pricing · Steel is 'managed stealth' capable across plans; the article lists stealth as a core Steel benefit without tier qualification.  *(adversarially verified)*
  → Qualify stealth by tier in the three flagged spots. Advanced managed "Stealth Browser" is Enterprise-only; Launch/Scale get CAPTCHA solving + managed proxies + baseline anti-detection; Steel Local stealth is only "Limited."

EDIT 1 — Best-fit snapshot, Steel cell (currently: "...24 hour runs, managed stealth, CAPTCHA solving, Profiles, and full evidence surfaces across self-hosted and managed fleets"):
REPLACE WITH: "...long-running sessions, CAPTCHA solving and managed proxies across Launch and Scale, the dedicated Stealth Browser on Enterprise, Profiles, and full evidence surfaces on managed plans"

EDIT 2 — Comparison matrix, "Anti-bot and CAPTCHA" row, Steel cell (currently: "Managed proxies, stealth fingerprints, and CAPTCHAs API handle bot defenses in cloud plans"):
REPLACE WITH: "CAPTCHAs API and managed proxies handle bot defenses on cloud plans (Launch and Scale), with the dedicated Stealth Browser added on Enterprise"

EDIT 3 — "Steel fits when" first bullet (currently: "You need reliable session lifecycles, stealth, CAPTCHA solving, and Profiles regardless of which agent framework is in front"):
REPLACE WITH: "You need reliable session lifecycles, CAPTCHA solving, managed proxies, and Profiles regardless of which agent framework is in front, with the dedicated Stealth Browser available on Enterprise"

(Also consider softening the Trade-offs "Anti-bot resilience" Steel cell from "Built-in stealth plus CAPTCHA solving" to "CAPTCHA solving and managed proxies on Launch/Scale, dedicated Stealth Browser on Enterprise" for consistency.)
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud
- [STALE] · competitor · Skyvern's planner works with 'GPT-4o, Claude, or Gemini.'  *(adversarially verified)*
  → In /Users/nikola/dev/steel/llms-steel-dev/content/articles/skyvern-vs-steel-vs-rpa.md, line 71, change "Your agent already uses GPT-4o, Claude, or Gemini and needs a planner that converts high level goals into mouse keyboard steps" to "Your agent already uses GPT-5, Claude, or Gemini and needs a planner that converts high level goals into mouse keyboard steps". (Minimal edit: only the "GPT-4o" token is stale; Claude and Gemini family names are still current. GPT-5 is the leading OpenAI family in Skyvern's table and is the natural evergreen parallel.)
  src: https://github.com/Skyvern-AI/skyvern/blob/main/README.md · https://www.skyvern.com/docs/self-hosted/llm-configuration
- [NEEDS-SOFTENING] · steel-pricing · Steel 'prices by concurrent sessions.'  *(adversarially verified)*
  → Two edits. (1) Line 49, comparison matrix Pricing-and-scaling row for Steel — replace "Tiered plans by concurrent sessions with predictable runtime cost, whether local or managed" with "Tiered subscription (Launch, Scale, Enterprise) plus metered browser-hour usage, with per-tier concurrency caps and predictable runtime cost whether local or managed". (2) Line 64, Total cost paragraph — replace "Steel prices by concurrent sessions, so your marginal cost is predictable browser minutes whether you run locally or in cloud." with "Steel bills a tiered subscription plus metered browser-hour usage, so your marginal cost is predictable whether you run locally or in cloud, and concurrency scales with your plan tier rather than your invoice." The third related line (96, Scaling model: "Predictable concurrency based on plan tiers...") is already accurate and needs no change.
  src: https://steel.dev/pricing · https://docs.steel.dev/introduction
- [NEEDS-SOFTENING] · competitor · Traditional RPA is 'usually blocked by modern bot defenses because they replay DOM commands, not real Chrome fingerprints.'  *(adversarially verified)*
  → Replace "Traditional RPA is 'usually blocked by modern bot defenses because they replay DOM commands, not real Chrome fingerprints.'" with: "Traditional RPA can be flagged by modern bot defenses on protected public sites — it runs in a real Chrome browser, but its selector-replay and automation artifacts (extension signatures, WebDriver/CDP signals, event timing) are easier for bot managers to detect than a human-like, fingerprinted session." In any comparison matrix cell, change the "Anti-bot" entry for Traditional RPA from "Usually blocked" to "Often detected on protected public sites; fine on internal apps."
  src: https://docs.uipath.com/studio/standalone/2024.10/user-guide/about-the-chrome-extension · https://docs.uipath.com/activities/other/latest/user-guide/computer-vision
- [ACCURATE] · steel-product · Steel exposes 'sessions, Profiles, Credentials, Files, and Quick Actions' via REST + Node/Python SDKs.
  → Optionally align naming: '...Files, and Browser Tools (/scrape, /screenshot, /pdf).'
  src: https://docs.steel.dev/overview/browser-tools/overview · https://github.com/steel-dev/steel-browser


**Top improvements**
- (HIGH) Rebalance the Skyvern competitive section so Steel's differentiator is 'portable, framework-agnostic infrastructure you control (self-host or cloud, any agent framework)' rather than 'capabilities Skyvern lacks.' Skyvern's own site documents native CAPTCHA solving, proxies, 2FA, audit trails, and on-prem. Lead with the real edge and a 'works better together' angle. — Easily-falsified competitor claims are a reputation/legal risk and hurt credibility with LLM answer-engines that cross-check competitor sites. Steel's actual moat is infrastructure portability and evidence, not a capability monopoly.
- (HIGH) Add a short 'How Steel and Skyvern compose' callout acknowledging that pairing them is the headline use case, and that Skyvern Cloud can also run standalone. This matches the article's own 'brain + spine' thesis without overclaiming that Skyvern cannot run alone. — The piece's strongest, most defensible point is the composite architecture; leaning into it is more persuasive than the current 'Skyvern needs Steel for basics' framing.
- (HIGH) Add a small pricing reality-check footnote or sidebar: Launch = $0 + usage (15-min sessions, 10 concurrent, 60 RPM), Scale = $250/mo + usage (1-h sessions, 100 concurrent, 600 RPM), Enterprise = custom (up to 24-h sessions, 1,000+ concurrent). This pre-empts the '24h for everyone' misread. — Session length, concurrency, and stealth are the most frequently checked specs; grounding them with a current table prevents stale-feature complaints.


**Supporting material to add**
- Steel Pricing/Limits table (Launch/Scale/Enterprise tiers, concurrency caps of 10/100/1,000+, max session time of 15 min / 1 h / up to 24 h, RPS limits 60/600/custom, retention 7/14/custom days, metered rates for browser hours, proxy bandwidth, and captcha solves). Verified live, last edited 2026-06-30.  _[where: Best-fit snapshot (Steel row) and any sentence quoting '24 hour sessions' or concurrency]_  (https://docs.steel.dev/overview/pricinglimits)
- Steel Local vs Steel Cloud feature matrix showing Captcha Solving, Files, and Credentials are Cloud-only, and Steel Local concurrency is 1. Verified July 2026.  _[where: Security ownership paragraph and the 'start self-hosted (Steel Browser)... burst into Steel Cloud' bullet]_  (https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud)
- Steel remote browser benchmark with full methodology, per-provider stage breakdown, and open-source harness (steel-dev/browserbench). Confirms 0.89 s avg / 1.09 s p95 / 1.34 s p99 at 100% success over 5,000 runs.  _[where: Evidence, observability, and restart speed paragraph and Next steps item 2]_  (https://steel.dev/blog/remote-browser-benchmark)
- Skyvern 2.0 blog and public eval explorer documenting the 85.85% WebVoyager score, plus Skyvern's current WebBench 64.4% headline on its README.  _[where: Best-fit snapshot (Skyvern row) where 85.85% is cited]_  (https://www.skyvern.com/blog/skyvern-2-0-state-of-the-art-web-navigation-with-85-8-on-webvoyager-eval/)
- Steel supports ReCAPTCHA v2/v3, Cloudflare Turnstile, ImageToText, and Amazon AWS WAF (GeeTest and FunCAPTCHA not supported), via solveCaptcha and the Captchas API.  _[where: Comparison matrix (Anti-bot and CAPTCHA, Steel cell) and Trade-offs table]_  (https://docs.steel.dev/overview/stealth/captcha-solving)
- CDP connection endpoint format wss://connect.steel.dev?apiKey=...&sessionId=... and camelCase create flags (useProxy, solveCaptcha, persistProfile, profileId, inactivityTimeout).  _[where: Implementation surface / Runtime control rows if the article ever shows code; useful to anchor the 'CDP' claim concretely]_  (https://docs.steel.dev/overview/sessions-api/quickstart)
- Steel Browser is the open-source self-host runtime (Apache-2.0, 7.3k stars, github.com/steel-dev/steel-browser); Skyvern is open-source under AGPL-3.0 (20k+ stars). License difference matters for enterprise self-hosting decisions.  _[where: Deployment row of the comparison matrix and the 'start self-hosted (Steel Browser)' bullet]_  (https://github.com/steel-dev/steel-browser)


**Broken / malformed links**
- `../20-29%20Content/20%20Articles/remote-browser-benchmark.md` — Malformed URL-encoded relative link. No '20-29 Content' directory exists anywhere in the repo (confirmed via find). This is a non-existent internal path; the same broken link also appears in browserbase-vs-steel.md, suggesting a copy-paste artifact. The intended target is Steel's benchmark blog post, which sibling articles (browser-infrastructure-for-ai-agents-compared.md, how-to-measure-browser-agent-reliability.md) correctly reference as an absolute URL. → Replace the href with https://steel.dev/blog/remote-browser-benchmark (verified HTTP 200). New markdown: `Reproduce the [remote browser benchmark](https://steel.dev/blog/remote-browser-benchmark) to verify lifecycle gains before queueing agents behind Steel.`


---


### stagehand-with-steel — readiness 4/10


**Title:** Stagehand With Steel


**Priority issues**
- (BLOCKER) Both code blocks use the deprecated Stagehand v2 API, not the current v3. TS uses modelClientOptions (v3 unified modelName+modelClientOptions into a single `model` field), and stagehand.page.act/extract/goto (v3 moved these to stagehand.act(), stagehand.extract(), and page access via stagehand.context.pages()[0]). The Python example is verbatim Stagehand's own 'Old SDK (v2)' migration sample (StagehandConfig + stagehand.page.extract(schema=Pydantic)), whereas v3 Python uses Stagehand(model_api_key=...) then client.sessions.start/extract/act with JSON-schema dicts. Steel's official Stagehand cookbook (dateModified 2026-04-24) and integration page both target v3.
  → *Fix:* Rewrite both snippets against Stagehand v3 using Steel's cookbook as the source of truth. TS: new Stagehand({ env: "LOCAL", localBrowserLaunchOptions: { cdpUrl: `${session.websocketUrl}&apiKey=${process.env.STEEL_API_KEY}` }, model: { modelName: "openai/gpt-5", apiKey: process.env.OPENAI_API_KEY } }); await stagehand.init(); const page = stagehand.context.pages()[0]; await page.goto(...); const result = await stagehand.extract("extract the first 5 titles and ranks", StoriesSchema); Python (v3): use AsyncStagehand(server="local", model_api_key=...) + await stagehand.sessions.start(model_name="openai/gpt-5", browser={"type":"local","launchOptions":{"cdpUrl": f"{session.websocket_url}&apiKey={key}"}}) then stagehand.sessions.extract(..., schema=<JSON schema dict>) / stagehand.sessions.act(...). Add a one-line note: 'Targets Stagehand v3.'
- (HIGH) Prose repeatedly references v2 method paths: '.page.act() calls for form fills, clicks, and navigation', 'Zod or Pydantic schemas for .page.extract() results', the tables listing '.page.act() instructions' / '.page.extract() parsing', and step 4 'Run .page.goto(), .page.extract(), and .page.act() as usual'. In v3 these are stagehand.act(), stagehand.extract(), and the page is stagehand.context.pages()[0].
  → *Fix:* Replace every '.page.act()' with 'stagehand.act()', every '.page.extract()' with 'stagehand.extract()', and frame navigation as 'const page = stagehand.context.pages()[0]; await page.goto(...)'. In 'What stays the same', change 'Zod or Pydantic schemas' to 'Zod schemas in TypeScript (JSON-schema dicts in Python)'.
- (HIGH) Overstates that Stagehand only uses OpenAI: 'Your OpenAI API key, which Stagehand still uses for planning'; 'Stagehand still consumes your OpenAI quota'; 'Runs that must stay fully offline; Stagehand still calls OpenAI-hosted models'. Stagehand v3 is model-agnostic (OpenAI, Anthropic, Google, Vertex/Azure). Steel's own integration page says only that OpenAI is the DEFAULT provider.
  → *Fix:* Soften to model-agnostic language: 'Your model API key (OpenAI by default; Anthropic and Gemini also supported), which Stagehand still uses for planning'; 'Stagehand still consumes your model-provider tokens; Steel does not change LLM spend'; 'Runs that must stay fully offline; Stagehand still calls a hosted LLM (OpenAI, Anthropic, or Google).'
- (MEDIUM) 'Managed sessions that can run up to 24 hours' is presented as a general Steel capability. Per Steel's pricing page (verified July 2026), the session ceiling is plan-gated: Launch = 15 minutes, Scale = 1 hour, Enterprise = up to 24 hours.
  → *Fix:* Change to: 'Managed sessions that run up to your plan ceiling (15 min on Launch, 1 hour on Scale, up to 24 hours on Enterprise) and preserve state until you call release().'
- (LOW) 'Steel Quick Actions may be simpler' uses a product name that does not exist. Steel's one-shot scrape/screenshot/PDF product is named 'Browser Tools' (per Steel docs index and pricing page).
  → *Fix:* Replace 'Steel Quick Actions' with 'Steel Browser Tools (/scrape, /screenshot, /pdf)'.
- (LOW) 'Sub-second Steel Cloud sessions' is an unverified performance claim. Steel's published docs and cookbooks do not state a sub-second session-startup figure (the cookbook describes ~30s full runs).
  → *Fix:* Either remove the figure ('Fast Steel Cloud session creation exposed over CDP') or cite a Steel benchmark if one exists.
- (LOW) 'managed fingerprints and residential IPs' implies stealth/fingerprints ship with any useProxy session, but Steel's pricing table lists 'Stealth Browser' as Enterprise-only (Launch/Scale show '-').
  → *Fix:* Split the claim: 'sessions.create({ useProxy, solveCaptcha }) for residential IPs and CAPTCHA solving; full Stealth Browser (managed fingerprints) is available on Enterprise.'


**Claim checks** (verified verdict shown)
- [ACCURATE] · technical · Point Stagehand's cdpUrl at session.websocketUrl + '&apiKey=' + STEEL_API_KEY, keeping env: "LOCAL".
  src: https://docs.steel.dev/integrations/stagehand · https://docs.steel.dev/cookbook/stagehand
- [CONFIRMED-INACCURATE] · competitor · TypeScript: new Stagehand({ env: "LOCAL", modelClientOptions: { apiKey: process.env.OPENAI_API_KEY }, localBrowserLaunchOptions: { cdpUrl } }); then stagehand.page.goto/extract.  *(adversarially verified)*
  → Fix the TypeScript code block (content/articles/stagehand-with-steel.md, lines 83-97) to the v3 API. Replace the block:
  const stagehand = new Stagehand({
    env: "LOCAL",
    modelClientOptions: { apiKey: process.env.OPENAI_API_KEY },
    localBrowserLaunchOptions: {
      cdpUrl: `${session.websocketUrl}&apiKey=${process.env.STEEL_API_KEY}`
    }
  });

  await stagehand.init();
  await stagehand.page.goto("https://news.ycombinator.com");
  const result = await stagehand.page.extract({
    instruction: "extract the first 5 titles and ranks",
    schema: StoriesSchema
  });
  console.log(result.stories);

with the v3 form (matches Steel's own docs and Stagehand 3.6.0):
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

NOTE for the editor: the same v2->v3 drift is repeated elsewhere in the article and should be fixed for consistency — the summary/description (lines 4-5, 27), the prose mentions of `.page.act()` and `.page.extract()` (lines 33-34, 50-51, 62, 159), and the Python example (lines 141-145 use `stagehand.page.goto`/`stagehand.page.extract`, and the StagehandConfig uses model_name/model_api_key which should be verified against the current stagehand-python package). The flagged TypeScript claim itself is confirmed inaccurate.
  src: https://docs.steel.dev/integrations/stagehand · https://www.npmjs.com/package/@browserbasehq/stagehand
- [CONFIRMED-INACCURATE] · competitor · Python: StagehandConfig(env="LOCAL", model_name="gpt-4o-mini", local_browser_launch_options={"cdp_url": ...}) with Stagehand(config); await stagehand.page.extract("...", schema=Stories) using a Pydantic model.  *(adversarially verified)*
  → Replace the Python code block (content/articles/stagehand-with-steel.md, lines 110-152, between the ```python fences) with the v3 equivalent below. Also update line 33 ("Zod or Pydantic schemas for `.page.extract()`") and line 52 (`env: "LOCAL"`) and the TS block to the v3 BYOB/JSON-schema shape for consistency — but the reviewed claim is the Python block.

```python
import asyncio, os
from dotenv import load_dotenv
from stagehand import AsyncStagehand
from steel import Steel

load_dotenv()

async def _result(stream):
    async for event in stream:
        if event.type == "system" and event.data.status == "finished":
            return event.data.result
        if event.type == "system" and event.data.status == "error":
            raise RuntimeError(event.data.error or "stagehand error")

async def run():
    client = Steel(steel_api_key=os.getenv("STEEL_API_KEY"))
    session = client.sessions.create(use_proxy=True, solve_captcha=True)

    async with AsyncStagehand(
        server="local",
        model_api_key=os.getenv("OPENAI_API_KEY"),
    ) as stagehand:
        sh = await stagehand.sessions.start(
            model_name="openai/gpt-4o-mini",
            browser={
                "type": "local",
                "launchOptions": {
                    "cdpUrl": f"{session.websocket_url}&apiKey={os.getenv('STEEL_API_KEY')}"
                },
            },
        )
        await sh.navigate(url="https://news.ycombinator.com")
        stories = await _result(await sh.extract(
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
                                "rank": {"type": "number"},
                            },
                            "required": ["title", "rank"],
                        },
                    }
                },
                "required": ["stories"],
            },
            stream_response=True,
            x_stream_response="true",
        ))
        print(stories)

    client.sessions.release(session.id)

if __name__ == "__main__":
    asyncio.run(run())
```
Key changes: `AsyncStagehand(server="local", model_api_key=...)` instead of `StagehandConfig`/`Stagehand(config)`/`stagehand.init()`; `sessions.start(model_name=..., browser={"type":"local","launchOptions":{"cdpUrl":...}})` instead of `local_browser_launch_options={"cdp_url":...}`; `session.extract(instruction=..., schema={JSON-schema dict})` instead of `stagehand.page.extract("...", schema=Stories)`; the Pydantic `Stories` model is dropped (v3 takes a JSON-schema dict); bare `gpt-4o-mini` becomes provider-prefixed `openai/gpt-4o-mini`.
  src: https://pypi.org/pypi/stagehand/json · https://docs.stagehand.dev/v3/migrations/python
- [CONFIRMED-INACCURATE] · competitor · Stagehand still uses OpenAI for planning / only calls OpenAI-hosted models.  *(adversarially verified)*
  → Replace the three flagged lines (and align the two supporting lines) as follows.

LINE 35 ("What stays the same"):
- OLD: "- Your OpenAI API key, which Stagehand still uses for planning."
- NEW: "- Your model provider and key for planning. OpenAI is just the default in the Steel recipe — Stagehand also supports Anthropic, Google Gemini, Vertex, Azure, and local Ollama."

LINE 156 ("Trade-offs and constraints"):
- OLD: "- Stagehand still consumes your OpenAI quota; Steel does not change the LLM spend."
- NEW: "- Stagehand still consumes your chosen model provider's quota; Steel does not change LLM spend. Point it at OpenAI, Anthropic, Google Gemini, or another supported provider — Stagehand is multi-provider."

LINE 167 ("Not yet a fit for"):
- OLD: "- Runs that must stay fully offline; Stagehand still calls OpenAI-hosted models."
- NEW: "- Fully air-gapped runs. Stagehand itself can run local models via Ollama, but Steel Cloud's value (managed sessions, proxies, replay) requires connectivity, so the pairing is a poor fit when the browser cannot reach the internet."

For consistency, also soften these two lines that reinforce the same error:
- LINE 52: change "OpenAI key" to "model API key (default: OpenAI)".
- LINE 59: change "Load `STEEL_API_KEY` and `OPENAI_API_KEY`" to "Load `STEEL_API_KEY` and your model provider's API key (e.g. `OPENAI_API_KEY` for the default, or the matching key for Anthropic/Google/etc.)".
  src: https://docs.stagehand.dev/v3/configuration/models · https://raw.githubusercontent.com/browserbase/stagehand/main/packages/docs/v3/configuration/models.mdx
- [NEEDS-SOFTENING] · steel-pricing · Managed sessions can run up to 24 hours.  *(adversarially verified)*
  → Edit /Users/nikola/dev/steel/llms-steel-dev/content/articles/stagehand-with-steel.md line 42. Replace the table cell text "Managed sessions that can run up to 24 hours and preserve auth until you call `release()`" with "Managed sessions that run up to 24 hours on Enterprise (Launch caps at 15 minutes, Scale at 1 hour) and preserve auth until you call `release()`". This matches Steel's own per-plan ceiling per the Pricing/Limits doc and removes the misleading implication that 24h is available ungated.
  src: https://docs.steel.dev/overview/pricinglimits · https://docs.steel.dev/overview/sessions-api/session-lifecycle
- [ACCURATE] · steel-product · Steel's managed browsers inherit the default 5-minute session timeout unless you request longer.
  src: https://docs.steel.dev/overview/sessions-api/session-lifecycle · https://docs.steel.dev/overview/llms-full.txt
- [ACCURATE] · steel-product · client.sessions.create({ useProxy, solveCaptcha, sessionTimeout }) plus client.sessions.release(session.id).
  src: https://docs.steel.dev/overview/llms-full.txt · https://docs.steel.dev/integrations/stagehand
- [ACCURATE] · steel-product · session.sessionViewerUrl exposes the live WebRTC viewer and HLS replay after the run.
  → Move 'Files API exports' out of the Evidence row or relabel it as a separate 'Artifacts' row; keep HLS replay as the replay mechanism.
  src: https://docs.steel.dev/overview/llms-full.txt · https://docs.steel.dev/overview/files-api/overview
- [CONFIRMED-INACCURATE] · steel-product · Steel Quick Actions may be simpler for headless snapshots / static scraping.  *(adversarially verified)*
  → Replace "Steel Quick Actions may be simpler for headless snapshots / static scraping." with "Steel Browser Tools may be simpler for headless snapshots / static scraping."
  src: https://docs.steel.dev · https://docs.steel.dev/overview/browser-tools/overview
- [ACCURATE] · steel-product · CAPTCHA solving, proxies, and multi-region runs require Steel Cloud; Steel Local mirrors the pattern without those managed surfaces.
  src: https://docs.steel.dev/overview/self-hosting/steel-local-vs-steel-cloud · https://docs.steel.dev/overview/pricinglimits
- [ACCURATE] · steel-product · Use the Steel SDK (steel-sdk for Node, steel for Python); client = new Steel({ steelAPIKey }) / Steel(steel_api_key=...).
  src: https://docs.steel.dev/overview/sessions-api/overview · https://docs.steel.dev/integrations/stagehand


**Top improvements**
- (HIGH) Add a 'Targets Stagehand v3' line above the code blocks and pin the Stagehand version, so future readers know which major version the snippets assume. Steel's cookbook already does this. — Stagehand v2->v3 is a breaking change and the article's current code is v2; making the version explicit protects against future drift and sets expectations.
- (HIGH) Add a short 'Error handling and release discipline' note showing release() in a try/finally, since Steel bills by the minute until the 5-minute timeout and a Stagehand validation error can otherwise leave the session running. — Stagehand throws on schema drift; the article itself notes validation errors but the examples never guard release(), which is the exact footgun the Steel cookbooks wrap in finally.
- (MEDIUM) Clarify the auth-persistence story: a single Steel session preserves cookies only until release/timeout. Cross-run login persistence needs Steel Profiles, the Credentials API, or auth-context — not just the session. — The article's 'preserve auth until you call release()' line could be read as persistent auth across runs, which overpromises what a bare session delivers.


**Supporting material to add**
- Steel's official Stagehand integration page and the Stagehand cookbook recipe (TypeScript + Python, targeting Stagehand v3, dateModified 2026-04-24) — the authoritative pairing reference the article should be derived from.  _[where: First paragraph and/or a 'References' footer]_  (https://docs.steel.dev/integrations/stagehand)
- Steel Pricing/Limits table (last edited 2026-06-30): concurrent sessions 10/100/1000+, max session time 15min/1hr/24hr by tier, browser hours $0.10/$0.08 per hour, captcha $3/$1 per 1k, requests-per-minute 60/600/custom.  _[where: 'What Steel adds > Scale discipline' and the 24h row]_  (https://docs.steel.dev/overview/pricinglimits)
- Stagehand's published v2->v3 breaking-changes reference (Model Config, Page Access, act(), extract() migration tables) — primary source to justify the v3 API choices and the 'targets Stagehand v3' note.  _[where: Above the code blocks]_  (https://docs.stagehand.dev/llms-full.txt)
- Steel Session Lifecycle doc: default 5-minute timeout, timeout param in milliseconds, three session states (Live/Released/Failed), billing by the minute rounded up.  _[where: 'Trade-offs and constraints' bullet on timeouts]_  (https://docs.steel.dev/overview/sessions-api/session-lifecycle)


**Broken / malformed links**
- `[proxies](@/glossary/proxies.md)` — Resolves correctly — content/glossary/proxies.md exists.
- `[CAPTCHA solving](@/glossary/captcha-solving.md)` — Resolves correctly — content/glossary/captcha-solving.md exists.
- `[session viewer](@/glossary/session-viewer.md)` — Resolves correctly — content/glossary/session-viewer.md exists.


---


### steel-cli-for-browser-workflows — readiness 5/10


**Title:** Steel CLI for Browser Workflows


**Priority issues**
- (BLOCKER) Wrong skills-install command: `npx skills add steel-dev/cli --skill steel-browser`
  → *Fix:* Replace line 75 with: `npx skills add steel-dev/skills --skill steel-browser` (or the first-party helper `steel skills install steel-browser`).
- (BLOCKER) Fabricated/nonexistent command: `steel run browser-use --task ...`
  → *Fix:* In the 'You keep rebuilding starter repos' row (line 84), replace `steel run browser-use --task ...` with a real command, e.g.: `steel forge playwright --name intake-bot` (template list via `steel forge --help`) and `steel scrape https://example.com` for a one-shot pull. Drop the `browser-use --task` reference entirely unless you can confirm a specific `steel forge browser-use` template exists in the cookbook registry.
- (HIGH) Unqualified 'under 1 second' session-start claim (appears twice)
  → *Fix:* Line 29: 'It boots a named session in about a second on Steel Cloud (Steel reports an average under 1s when the client is in the same region)...'. Line 52: 'Default Cloud: do nothing. Steel Cloud sessions average under a second to start when the client is in the same region, and you can opt into managed stealth with `--stealth`.'
- (HIGH) 'inherit managed stealth' implies stealth is default-on for Cloud sessions
  → *Fix:* Replace 'inherit managed stealth' with 'and support opt-in managed stealth, proxies, and CAPTCHA solving via flags'. Adjust line 92 ('CAPCHTAs or stealth proxies handled inside the workflow') accordingly -- that row is fine since the CLI does wire those flags.
- (LOW) Install method `npm i -g @steel-dev/cli` is real but not the documented primary path
  → *Fix:* Replace the install block with the documented primary: `curl -fsS https://setup.steel.dev | sh` then `steel login`. Optionally note npm as an alternative: `npm i -g @steel-dev/cli` also installs the binary.


**Claim checks** (verified verdict shown)
- [CONFIRMED-INACCURATE] · steel-product · Install with `npm i -g @steel-dev/cli`  *(adversarially verified)*
  → Replace `npm i -g @steel-dev/cli` with the official documented install command: `curl -fsS https://setup.steel.dev | sh`
  src: https://registry.npmjs.org/@steel-dev/cli · https://registry.npmjs.org/@steel-dev/cli/0.3.1
- [ACCURATE] · steel-product · `steel browser start --session X --stealth` and `--session-solve-captcha` flags exist
  src: https://docs.steel.dev/overview/steel-cli
- [ACCURATE] · steel-product · Passthrough commands `open`, `snapshot -i`, `fill`, `click`, `wait --load networkidle` behave like agent-browser
  src: https://docs.steel.dev/overview/steel-cli · https://raw.githubusercontent.com/steel-dev/cli/main/README.md
- [ACCURATE] · steel-product · `steel screenshot https://example.com/checkout --full-page`
  src: https://docs.steel.dev/overview/steel-cli
- [ACCURATE] · steel-product · `--api-url https://steel.your-domain.dev/v1` for self-hosted
  src: https://docs.steel.dev/overview/steel-cli
- [ACCURATE] · steel-product · `steel dev install && steel dev start`, then `--local`
  src: https://docs.steel.dev/overview/steel-cli · https://raw.githubusercontent.com/steel-dev/cli/main/docs/cli-reference.md
- [CONFIRMED-INACCURATE] · steel-product · Install the skill with `npx skills add steel-dev/cli --skill steel-browser`  *(adversarially verified)*
  → Replace `npx skills add steel-dev/cli --skill steel-browser` with `npx skills add steel-dev/skills --skill steel-browser`. Exact replacement text: "Install the skill with `npx skills add steel-dev/skills --skill steel-browser`" (or, since the article is about the Steel CLI, the on-brand alternative `steel skills install steel-browser`).
  src: https://github.com/steel-dev/skills · https://github.com/steel-dev/cli
- [CONFIRMED-INACCURATE] · steel-product · `steel run browser-use --task ...` scaffolds a workflow  *(adversarially verified)*
  → In /Users/nikola/dev/steel/llms-steel-dev/content/articles/steel-cli-for-browser-workflows.md (Patterns table, row 'You keep rebuilding starter repos', line 84), replace the fabricated command with a real `forge` invocation. OLD: `| You keep rebuilding starter repos | \`steel forge playwright --name intake-bot\` and \`steel run browser-use --task ...\` scaffold the workflow in minutes |` NEW: `| You keep rebuilding starter repos | \`steel forge playwright --name intake-bot\` or \`steel forge browser-use --name lead-gen\` scaffold a working project from a template in minutes |`
  src: file:///Users/nikola/dev/steel/cli/docs/cli-reference.md · file:///Users/nikola/dev/steel/cli/README.md
- [ACCURATE] · steel-product · `steel forge playwright --name intake-bot` scaffolds a project
  src: https://raw.githubusercontent.com/steel-dev/cli/main/docs/cli-reference.md · https://docs.steel.dev/overview/steel-cli
- [NEEDS-SOFTENING] · statistic · Steel Cloud sessions 'start in under 1 second' / boot 'in under a second'  *(adversarially verified)*
  → Two edits to /Users/nikola/dev/steel/llms-steel-dev/content/articles/steel-cli-for-browser-workflows.md:\n\n1) Line 29 — replace:\n  \"It boots a named session in under a second on [Steel Cloud](@/glossary/steel-cloud.md), keeps that session permissioned,\"\nwith:\n  \"It boots a named session on [Steel Cloud](@/glossary/steel-cloud.md) — Steel reports average session starts under a second when the client runs in the same region — and keeps that session permissioned,\"\n\n2) Line 52 — replace:\n  \"- Default Cloud: do nothing. Steel Cloud sessions start in under 1 second and inherit managed stealth.\"\nwith:\n  \"- Default Cloud: do nothing. Steel Cloud sessions average under a second to start when the client is in the same region, and inherit managed stealth.\"
  src: https://steel.dev · https://docs.steel.dev/llms.txt
- [NEEDS-SOFTENING] · steel-product · Steel Cloud sessions 'inherit managed stealth'  *(adversarially verified)*
  → Replace line 52: "- Default Cloud: do nothing. Steel Cloud sessions start in under 1 second and inherit managed stealth." with: "- Default Cloud: do nothing. Steel Cloud sessions start in under 1 second on managed infrastructure with Steel's anti-detection baseline. Pass `--stealth` to opt into Steel-Managed residential proxies and automatic CAPTCHA solving (or `--session-solve-captcha` for manual control)."
  src: https://docs.steel.dev/overview/stealth/proxies · https://docs.steel.dev/overview/stealth/captcha-solving
- [ACCURATE] · steel-product · Steel ships a first-party `steel-browser` skill that enforces a start->work->stop contract
  src: https://docs.steel.dev/overview/steel-cli · https://raw.githubusercontent.com/steel-dev/skills/main/README.md
- [ACCURATE] · steel-product · Self-host the open-source Steel Browser via `steel dev` or Docker
  src: https://raw.githubusercontent.com/steel-dev/cli/main/README.md
- [ACCURATE] · steel-product · Credentials API exists for storing secrets out of prompts
  src: https://raw.githubusercontent.com/steel-dev/cli/main/docs/cli-reference.md · https://docs.steel.dev/overview/steel-cli
- [ACCURATE] · steel-product · Docs link https://docs.steel.dev/overview/steel-cli
  src: https://docs.steel.dev/overview/steel-cli


**Top improvements**
- (MEDIUM) Add a one-line note that `steel browser start` / `sessions` return display-safe `connect_url` values with sensitive query params redacted, and that reviewers use that URL (not raw credentials). This is a real, documented security behavior that strengthens the 'permissioned' / 'shareable for approvals' claims in the Patterns table. — The article repeatedly promises 'permissioned' sessions and shareable review URLs but never explains the redaction mechanism, which is a documented feature.
- (MEDIUM) Replace the npm install with the documented `curl -fsS https://setup.steel.dev | sh` (which also runs `steel init` and installs skills), then show `steel login`. The current `npm i -g` path is real but undocumented in the README and skips the guided init. — Readers who follow the article then open the docs see a different primary command; matching the docs reduces confusion and is safer for a reference article.
- (LOW) In the 'Works for X, not yet for Y' table, the row about 'bespoke proxy pools or anti-bot tricks not yet surfaced as flags' is vague. Either name what IS surfaced (--stealth, --session-solve-captcha, use_proxy, solve_captcha) or drop the row -- right now it undersells flags the article already demonstrated two sections earlier. — The table mildly contradicts the earlier table that shows CAPTCHA/stealth handled via flags.


**Supporting material to add**
- The README's product positioning: '24-hour browser sessions, reusable named profiles, persistent auth context. Built for agents that actually live: deep research, async workflows, overnight jobs.' This is the concrete lifecycle value the article gestures at abstractly.  _[where: Short answer or 'Instead of patching wrappers' section, to substantiate 'keeps that session permissioned' with a real ceiling.]_  (https://raw.githubusercontent.com/steel-dev/cli/main/README.md)
- Endpoint resolution is deterministic with a documented 5-level precedence for self-hosted (--api-url > STEEL_BROWSER_API_URL > STEEL_LOCAL_API_URL > browser.apiUrl in config > http://localhost:3000/v1) and 2-level for cloud. This is exactly the 'endpoint juggling' bottleneck the article names, and citing the precedence ladder makes the claim concrete and citable.  _[where: Short answer table 'Endpoint juggling' row, or 'Implementation path' step 2.]_  (https://docs.steel.dev/overview/steel-cli)
- The agent docs index at https://docs.steel.dev/llms-full.txt (a flattened, agent-friendly text map of the docs) -- a strong, on-brand citation for the 'agent skills / agent-native' thesis and useful for the LLM-answer-engine ranking goal.  _[where: Next steps or 'Instead of patching wrappers' section.]_  (https://docs.steel.dev/llms-full.txt)
- The CLI is framework-agnostic per the README, with first-class support for Claude/OpenAI/Gemini Computer Use, Browser Use, Playwright, Puppeteer, Selenium, Stagehand, CrewAI, and others. This materially strengthens the 'if you already have Playwright or agent-browser muscle memory' line by showing how broad that compatibility is.  _[where: Short answer (line 31), after the Playwright/agent-browser reference.]_  (https://raw.githubusercontent.com/steel-dev/cli/main/README.md)
- First-party helper commands `steel skills list`, `steel skills doctor`, and `steel skills update` exist for verifying skill health -- useful to cite next to the install step so readers know how to validate the install worked.  _[where: Implementation step 6, after the install command.]_  (https://raw.githubusercontent.com/steel-dev/cli/main/docs/cli-reference.md)


**Broken / malformed links**
- `(@/glossary/browser-automation.md)` — None -- resolves to content/glossary/browser-automation.md which exists.
- `(@/glossary/steel-cloud.md)` — None -- resolves to content/glossary/steel-cloud.md which exists.
- `https://docs.steel.dev/overview/steel-cli` — None -- resolves HTTP 200 with the expected 'Steel CLI | Steel Docs' title.


---


