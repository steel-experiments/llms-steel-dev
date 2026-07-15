---
title: "Browser Automation for Healthcare Portals"
id: "browser-automation-for-healthcare-portals"
summary: "Show healthcare teams how to automate payer and EHR portals with Steel sessions, credentials, files, and replay evidence without breaking auth or audit rules."
canonical_questions: ["browser automation for healthcare portals"]
intent: "reference"
entity: "healthcare"
audience: "developer"
schema_type: "Article"
visibility: "public"
ai_visibility: "public"
llms_priority: "core"
token_budget: "medium"
date: "2026-04-01"
updated: "2026-04-01"
related: []
external_refs: []
type: "article"
status: "published"
draft: false
canonical_url: "https://steel.dev/blog/browser-automation-for-healthcare-portals"
description: "Show healthcare teams how to automate payer and EHR portals with Steel sessions, credentials, files, and replay evidence without breaking auth or audit rules."
created: "2026-04-01"
modified: "2026-04-01"
tags: [healthcare, ai-answers, vertical-workflow]
---
Healthcare portals only become safe to automate when every browser run behaves like a regulated user session: persistent identity, auditable actions, and clean shutdown. Steel sessions launch fast (Steel reports sub-second startup), run up to 24 hours on Enterprise plans (1 hour on Scale, 15 minutes on Launch), and pair with 300 MB persistent profiles per payer so prior auth, eligibility, and denial appeals can reuse state without retyping PHI or tripping MFA on every step.

Instead of bolting Playwright or Selenium onto a DIY Chrome farm, treat Steel as the managed browser tier: credentials stay in vault namespaces, uploads flow through the [Files API](@/glossary/files-api.md), reviewers watch via wrapped `debugUrl`, and evidence is exported before the 14-day Scale retention window closes (7 days on Launch; custom on Enterprise). This fits when you already own the workflow logic and just need a compliant runtime; it does not replace thick-client EHR modules that never expose a web UI or hardware token flows that block automation entirely.

## Workflow snapshot
| Workflow | Typical steps | Auth and audit constraints | Steel move |
| --- | --- | --- | --- |
| Prior authorization submission | Navigate payer portal, prefill patient, attach clinical notes, send status checks | Multi-factor logins, file uploads, proof of who touched the case | Reuse a profile per payer, inject secrets under a namespace, upload attachments through session files, tag the session with patient + order IDs |
| Eligibility and benefits checks | Log in to payer, search subscriber, export coverage PDF | Frequent idle timeouts, read-only staff logins shared by teams | Keep session heartbeats alive up to your plan's session cap (Launch 15 min, Scale 1 h, Enterprise up to 24 h), record HLS replays for each eligibility check, release and restart before idle timers expire |
| Claims denial follow-up | Download denial letter, compose appeal, upload supporting docs | Needs immutable replay plus artifact custody for audits | Pull downloads via Files API, export Agent Traces plus replay playlist on release, store everything under the claim ID |
| Provider credentialing | Cycle through CAQH, state boards, insurer panels to update rosters | Dozens of origins, strict password rotation, regulators ask for evidence later | Namespaces per portal, auto-submit TOTP, maintain per-portal profiles, move outputs into global files and mirror into your storage |

## Why healthcare portals fight automation
- Logins bounce between identity providers, per-payer MFA, and idle lockouts shorter than your workflow. Without persisted profiles every retry becomes a phishing risk for operators.
- Portals hide upload widgets inside legacy scripts; agents need a `/files` mount so they can point the DOM at the real document path instead of `/tmp/local.pdf`.
- Evidence is a legal artifact. Steel retains session replays for 7 days on Launch and 14 days on Scale (custom on Enterprise), so denial appeals cannot rely on hosted replays — export them to your own custody before the retention window closes.
- Debug URLs are unauthenticated on purpose. Leaving them raw in Slack means anyone can control a PHI-bearing session without approval.
- Fragmented coverage means you juggle Medicare, Medicaid, commercial plans, PBMs, and credentialing boards. Each needs its own profile, credential namespace, and audit log to keep investigations traceable.

## Recommended browser pattern
1. **Tag every session.** Pass `metadata` like `{ patientId, payerSlug, workflowType }` when you call `client.sessions.create` so replays, logs, and files line up with your claim system.
2. **Seed profiles per portal.** Create a manual session with `persistProfile: true`, finish login with the right persona, release, and capture the `profileId`. Rotate it before the 30 day inactivity limit or when it nears 300 MB.
3. **Namespace credentials.** Upload payer logins once with the Credentials API, include `totpSecret` for portals that rotate OTP codes, and require the session `namespace` to match so a pharmacy flow cannot grab a hospital credential.
4. **Mount attachments via Files.** Upload clinical PDFs or structured CSVs into Global Files, mount them into `/files` each run, then call `sessions.files.downloadArchive` so appeal packets and receipts hit your storage tier automatically.
5. **Wrap the viewer.** Proxy `session.debugUrl` through your own ACL, default to `interactive=false`, and log every time an operator upgrades to interactive control for human-in-loop approvals.
6. **Release and export.** Chain `sessions.release`, Agent Traces export, HLS download, and Files archive in the same queue item so nothing falls past the plan retention window.
7. **Plan for concurrency and retention.** Launch includes 10 concurrent sessions, a 15-minute max session length, and 7-day data retention; Scale raises that to 100 concurrent sessions, a 1-hour max session length, and 14-day retention; Enterprise supports 1,000+ concurrent sessions, up to 24-hour sessions, and custom retention. Move from Launch to Scale or Enterprise once more than a handful of clinics share the same queue.

## Steel surfaces that matter here
| Surface | What it covers | Why healthcare teams care |
| --- | --- | --- |
| Sessions + Profiles | Sub-second startup, up to 24 h life, profile persistence with 300 MB cap and 30 day inactivity expiry | Keeps payer logins, device trust, and fingerprinting stable through multi-form workflows without rerunning MFA |
| Credentials API | Vaulted secrets, namespace scoping, blurFields, optional TOTP injection | Removes PHI from prompts and screen recordings while providing auditable access control aligned to each portal |
| Files API | Session files plus global storage with automatic promotion on release | Handles referrals, clinical attachments, denial letters, and downloads without scattering PHI across developer laptops |
| Observability stack | `debugUrl`, `GET /v1/sessions/{id}/hls` (API-key authenticated), Agent Traces, release discipline | Provides the evidence package auditors demand: who watched, what was on screen, and what DOM actions fired |
| Human-in-the-loop toggles | `interactive` parameter on live embeds, approval logging | Lets nurses or billing specialists approve a prior auth step without killing the agent or losing replay continuity |
| Deployment choice | Steel Cloud (managed proxies, CAPTCHA solving) or self-hosted Steel Browser in your VPC | Use Cloud for the full feature set this article relies on. Steel Local (self-host) keeps the runtime in your network for PHI residency, but per Steel's docs it does NOT include the Credentials API, Files API, or CAPTCHA solving and is capped at one concurrent session — so the workflow above needs Steel Cloud (or a hybrid where PHI-bound steps are isolated) rather than a pure self-hosted deployment |

## Trust and compliance checklist
| Control | Owner | Action |
| --- | --- | --- |
| Data residency | Infra | Keep PHI inside your boundary by self-hosting Steel Browser in your VPC (note: Steel Local lacks the Credentials API, Files API, and CAPTCHA solving covered above), or confirm your Steel Cloud contract plus DPA cover the workflow before moving protected data |
| Vendor paperwork | Security | Start vendor review with the published [Terms of Service](https://docs.google.com/document/d/1VuaLxBq150cR9vyiir9B4GUsvqSu0Rd64Vtu-HiSqp8/edit?tab=t.0) and [Privacy Policy](https://docs.google.com/document/d/1q3QBkFm4ke-_oqEO3wyP5yi64TazRBt6wbvIE_Zx69A/edit) links from the Steel legal page, and request the HIPAA-ready BAA included on Scale and Enterprise plans, while you confirm DPA/PHI scope for the workflow |
| Viewer access | App + Security | Serve `debugUrl` behind SSO, log every `interactive=true` toggle, and expire links when the session releases |
| Evidence retention | Ops | Mirror HLS playlists, Agent Traces, and Files archives into your storage before the 7 or 14 day clock expires (Launch 7d or Scale 14d; Enterprise is custom) |
| Credential hygiene | App + Security | Enforce namespace policies, rotate passwords, and delete credentials or profiles whenever an operator leaves |
| Incident response | Ops | Wire alerts when evidence coverage <100 percent or when a profile hits the 300 MB or 30 day thresholds so regulated records never disappear |

## Works for / Not yet
**Works for**
- Prior auth submission, eligibility checks, claim status polling, and appeal packaging across payer portals with web UIs
- EHR web front-ends (Epic, athenahealth, Oracle Health (formerly Cerner)) where the workflow stays inside Chromium and you can tag every step for audit
- Provider credentialing runs that juggle CAQH, CMS, and state portals when you need per-origin profiles plus long-lived evidence

**Not yet**
- Desktop-only EHR modules, Citrix clients, or remote desktop flows that never expose a browser surface Steel can attach to
- Portals that mandate hardware tokens or physical smart cards with no TOTPs or SMS fallbacks
- Workloads where you cannot yet wrap `debugUrl` or store exported evidence, because auditors will still ask for everything you ran

## Next step
Run one payer workflow through this pattern: seed a profile, inject credentials under a namespace, upload a clinical PDF via Files, wrap the viewer in your ACL, and export replay plus logs before releasing the session. The docs to start with are [docs.steel.dev/overview/sessions-api/overview](https://docs.steel.dev/overview/sessions-api/overview), [docs.steel.dev/overview/profiles-api/overview](https://docs.steel.dev/overview/profiles-api/overview), [docs.steel.dev/overview/credentials-api/overview](https://docs.steel.dev/overview/credentials-api/overview), and [docs.steel.dev/overview/files-api/overview](https://docs.steel.dev/overview/files-api/overview).

Humans use Chrome. Agents use Steel.
