---
title: "Scaling Browser Automation to Hundreds of Sessions"
id: "scaling-browser-automation-to-hundreds-of-sessions"
summary: "How to size queues, concurrency, and proxy fleets so browser automation runs hundreds of Steel sessions without flaking."
canonical_questions: ["scaling browser automation to hundreds of sessions"]
intent: "reference"
entity: "browser-infrastructure"
audience: "developer"
schema_type: "Article"
visibility: "public"
ai_visibility: "public"
llms_priority: "core"
token_budget: "medium"
date: "2026-03-31"
updated: "2026-03-31"
related: []
external_refs: []
type: "article"
status: "published"
draft: false
canonical_url: "https://steel.dev/blog/scaling-browser-automation-to-hundreds-of-sessions"
description: "How to size queues, concurrency, and proxy fleets so browser automation runs hundreds of Steel sessions without flaking."
created: "2026-03-31"
modified: "2026-03-31"
tags: [operations-guide, browser-automation, scaling]
immutable: false
---
## Short answer
Browser automation collapses past the first few dozen runs when concurrency, queue depth, and [proxy](@/glossary/proxies.md) rotation fight each other. [Steel Local](@/glossary/steel-local.md) tops out around one live session, and even the free Launch plan caps you at 10 concurrent sessions and 60 requests per minute, so bursty workers back up immediately.

Instead of chasing flaky VMs, run [Steel Cloud](@/glossary/steel-cloud.md) like a session factory: pick a plan that matches the number of simultaneous sessions you owe, size your work queue to 70 to 80 percent of that cap, pre-warm [proxies](@/glossary/proxies.md) for each region, and release sessions aggressively so the next job can reuse the slot. Scale gives you 100 concurrent sessions and 600 requests per minute; Enterprise raises that to 1,000+ concurrent sessions, custom throughput, and 24-hour runtimes, so one engineer can keep hundreds of flows moving.

### Where scaling collapses first
| Symptom | Why it breaks | Steel move |
| --- | --- | --- |
| Local runner saturates after a handful of jobs | Steel Browser (self-hosted) gives you the same core session model but without Steel's managed residential proxies, managed stealth, and managed CAPTCHA solving, and you carry the infra math (RAM, CPU, per-instance Chrome overhead) yourself | Shift high-volume queues to Steel Cloud which guarantees 100+ concurrent sessions plus managed infra so scaling is configuration, not hardware babysitting. |
| Queue depth outruns the plan cap | Launch and Scale hard-limit concurrent sessions (10 and 100) and requests per minute (60, 600, Custom). Extra work just waits and burns SLAs | Track active sessions per plan and throttle your dispatcher so it never exceeds the cap. Upgrade before queue depth stays above 80 percent for more than a few minutes. |
| Long sessions block new work | Launch stops sessions after 15 minutes and Scale after 1 hour; only Enterprise reaches 24 hours. Jobs that overrun block concurrency even though they no longer do useful work | Pass per-job `timeout` values when you call `sessions.create` and reuse session IDs only when state is required. Release or `releaseAll` when a job stalls. |
| IP bans spike as you add seats | More workers share the same datacenter IP by default; anti-bot systems notice | Flip `useProxy: true` so every session gets a fresh managed residential IP (on the free Launch plan this returns 402 Payment Required until you verify the account with a $10 balance deposit; Steel-managed proxies are included on Scale and above), or attach Bring Your Own proxies (http/https/socks5) with your own rotation logic on any tier. |

## Know your concurrency budget before you queue
| Plan | Concurrent sessions | Requests/min cap | Max session time | When it fits |
| --- | --- | --- | --- | --- |
| Launch (free) | 10 | 60 | 15 minutes | Local prototyping and CI smoke tests |
| Scale | 100 | 600 | 1 hour | Production fleets and batched agent traffic |
| Enterprise | 1,000+ | Custom | Up to 24 hours | Regulated workloads, long tail retries, human handoff loops |

Pick the lowest tier whose requests-per-minute and session length match your median job. Steel Cloud bills metered usage at plan rates once you pass your included credits, and you can enable auto top-up so a short spike does not stop a run mid-incident—but overage is paid usage, not free headroom, so size the plan to your steady-state load. When multi-region routing matters, add the `region` flag on session creation so your queue can split capacity by geography instead of fighting over one cluster.

## Run a session factory, not ad hoc launches
1. **Model every task as a job in a durable queue.** Each job carries required resources (profile ID, proxy need, region). The dispatcher app pulls from the queue only when the live session count is below the plan cap minus a buffer.
2. **Pre-warm sessions when workloads are steady.** Use `sessions.create` ahead of peak hours, store the IDs, and keep them alive with realistic `timeout` windows so the automation can attach instantly instead of paying startup time mid-SLA.
3. **Attach the right surface per job.** When connecting via Playwright, Puppeteer, or CDP, tag log lines with `session.id`, proxy choice, and queue job ID so operators can trace a failure back to the precise resource combination.
4. **Release aggressively.** Call `sessions.release` as soon as the job hands off evidence or files. If you suspect a leak, `sessions.releaseAll` resets the fleet and frees browser-hour credits before you hit the cap.
5. **Segment proxies and regions.** Create lightweight proxy pools (managed, BYO, or default) per queue partition and rotate them deliberately so retries do not hammer the same IP and trigger bans.

## Metrics and guardrails to watch
| Signal | Healthy range | Action when it drifts |
| --- | --- | --- |
| Queue depth vs concurrency | Depth stays under 0.8 x concurrent-session cap | If depth stays high, either add more Scale capacity or shed load by pausing ingest. |
| Requests per minute | 70 to 90 percent of plan RPM | When you hit the wall, add jitter between job launches or upgrade to avoid server-side throttling. |
| Session age distribution | Most sessions finish before 50 percent of the plan's max duration | Audit jobs that run long, set tighter `timeout` values, or split workflows into multiple sessions. |
| Proxy bandwidth draw | Within the GB allocation implied by your credits | Monitor `proxyBandwidth / credits` so you are not surprised by residential overages; BYO if a single customer needs unusual geo spread. |
| Browser hours spend | Tracks completed jobs within your credit pool | Spikes without higher throughput mean hung sessions; trigger `releaseAll` or auto-scaling logic to recycle them. |

## Trade-offs and limits
- Steel Cloud enforces hard concurrency and RPM caps by plan. If the fleet must hold steady at 150+ live sessions, align with Enterprise early so the cap change is contractual, not a scramble.
- Managed proxies are billed by the GB ($10/GB on Launch, $6/GB on Scale). Keep large downloads on default datacenter IPs when stealth is not needed, and reserve residential IPs for the forms, checkouts, or OTP flows that gate your automation.
- Sessions top out at 1 hour on Scale and 24 hours on Enterprise. For multi-day automations, store state in profiles or files between sessions and spin up a fresh browser rather than fighting the ceiling.
- Long queues hide flaky logic. If a job retries more than twice, push it into a dead letter topic with the session ID so operators can inspect the replay while fresh work keeps moving.

## Next steps
- Map your workload against the [Pricing and Limits](https://docs.steel.dev/overview/pricinglimits) table and resize your plan before the queue becomes the bottleneck.
- Review the [Sessions API overview](https://docs.steel.dev/overview/sessions-api/overview) and [session lifecycle](https://docs.steel.dev/overview/sessions-api/session-lifecycle) docs so your automation actually releases slots when it finishes.
- Decide whether Steel-managed or Bring Your Own proxies fit each queue by reading the [proxy guide](https://docs.steel.dev/overview/stealth/proxies), then bake that routing into your dispatcher.

Humans use Chrome. Agents use Steel.
