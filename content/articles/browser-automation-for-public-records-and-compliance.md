---
title: "Browser Automation for Public Records and Compliance Workflows"
id: "browser-automation-for-public-records-and-compliance"
summary: "Show legal and compliance teams how Steel sessions keep court dockets, FOIA pulls, and filings automated with stateful profiles and audit-ready evidence."
canonical_questions: ["browser automation for public records and compliance workflows"]
intent: "reference"
entity: "browser-automation"
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
canonical_url: "https://steel.dev/blog/browser-automation-for-public-records-and-compliance"
description: "Show legal and compliance teams how Steel sessions keep court dockets, FOIA pulls, and filings automated with stateful profiles and audit-ready evidence."
created: "2026-04-01"
modified: "2026-04-01"
tags: [public-records, compliance, vertical-workflow]
immutable: false
---
Public records and compliance teams only trust automation when every run looks like a deputized clerk: authenticated entry, predictable state, and an evidence packet on release. At scale these workflows live or die by the browser runtime: SSO bounces, idle timers, and CAPTCHA walls decide whether a FOIA pull or docket sweep completes, and teams see meaningfully higher lookup success once [CAPTCHA solving](@/glossary/captcha-solving.md) and [proxy](@/glossary/proxies.md) control move out of their scripts and into the runtime. That is why the runtime, not just the agent plan, decides whether these workflows scale.

Instead of wiring Playwright or Selenium to a rotating cast of desktop VMs, treat Steel as the managed browser tier: sessions spin up in under a second, stay live up to 24 hours on Enterprise plans (15 minutes on Launch, 1 hour on Scale), keep portal trust inside persistent profiles, and release with replays and Agent Traces teams can file with counsel. You still own the case logic, but Steel supplies concurrency ([Steel Local](@/glossary/steel-local.md) runs a single session at a time, while [Steel Cloud](@/glossary/steel-cloud.md) scales from 10 concurrent sessions on Launch up to 100 on Scale and 1,000+ on Enterprise), stealth, CAPTCHA tooling, and the audit-friendly plumbing that general-purpose headless browsers skip.

## Where compliance teams lose hours
- Dockets, licensure boards, and FOIA portals bounce between SSO, SMS codes, and idle timers. Without persisted profiles every retry becomes a password reset and a potential security finding.
- Portals dump downloads into opaque temp folders or drive-by popups. Evidence disappears unless workflows mount a predictable `/files` path and archive outputs before anyone closes the browser.
- Manual review blocks everything. Investigators want a live view before approving a filing, then expect immutable replay plus Agent Traces when the case hits discovery.
- Queue spikes melt flaky browser farms. Local fleets collapse after a dozen concurrent logins or whenever Windows Update reboots the host. Steel Cloud lets you request hundreds of sessions at once (Launch starts at 10 concurrent, Scale at 100, Enterprise at 1,000+) while managed proxies and CAPTCHAs keep logins steady.

## Workflow map
| Workflow | What usually breaks | Steel pattern |
| --- | --- | --- |
| Court docket sweeps and legal notice watchlists | Multi-tenant logins get rate limited, per-county portals expire in minutes, and operators cannot show what the bot actually saw | Create tagged sessions per jurisdiction, reuse `profileId` so trust cookies survive, schedule `sessions.release()` plus an agent trace export (markdown/JSON/ZIP) at the end of each sweep, and keep the session's HLS replay link on hand for streaming review |
| Public records pulls and FOIA exports | Downloads land on random disks, evidence trails get lost, and FOIA queues time out while you stitch data together | Upload request payloads via Files, mount `/files` for download targets, and ship the archive plus Agent Traces to case storage as soon as the run completes |
| License renewals and compliance filings | OTP delivery, notarized attachments, and per-agency credentials force humans back into the loop | Store credentials with namespaces, include `totpSecret` when available, keep attachments in Files so agents can feed webforms, and gate `debugUrl` access for approvals |
| Investigations and evidence packages | Opposing counsel asks how the data was collected and who touched it, long after plan retention windows expire | Capture metadata on session creation, mirror replays and Agent Traces into your storage before plan deadlines, and attach viewer activity records to case notes |

## Recommended browser pattern
1. **Tag every run on creation.** Pass case identifiers, jurisdiction, and workflow type into `metadata` so every replay, Agent Trace, and file is traceable when subpoenas land months later.
2. **Seed profiles per portal.** Manually log in once with `persistProfile: true`, finish MFA, then reuse the `profileId` until the portal forces a reset or the 30 day inactivity timer hits. Keep each profile under the 300 MB cap by clearing downloads after every batch.
3. **Namespace credentials.** Upload per-agency secrets into the Credentials API, require namespace matches in session creation, and delete secrets automatically when an operator leaves the program.
4. **Bundle attachments through Files.** Intake scans, affidavits, and receipts belong in Files so agents can upload via deterministic paths and your system can download one archive when the session ends.
5. **Wrap the live viewer.** Proxy `debugUrl` behind SSO, default `interactive=false`, and log every escalation to ensure approvals have a human signature.
6. **Export evidence on release.** Pull the agent trace export (markdown/JSON/ZIP) and mirror the Files archive immediately after `sessions.release`, and record the session's HLS replay link so the run can still be streamed for review before it ages out of plan retention.
7. **Budget concurrency.** Steel Local is perfect for development and on-prem enclaves but caps concurrency near one session. On Steel Cloud, Launch starts at 10 concurrent sessions, Scale at 100, and Enterprise at 1,000+ with managed proxies, stealth, and CAPTCHA coverage; pick the plan that matches your docket velocity.

## Trust and audit controls
| Requirement | Steel surface | How to wire it |
| --- | --- | --- |
| Portal identity | Profiles + Sessions metadata | Store a profile per portal and inject `metadata` so every browser action maps to a case and user persona |
| Credential custody | Credentials API | Keep logins vaulted, enforce namespaces, inject TOTPs when available, and audit access per secret |
| Attachment hygiene | Files API | Move uploads and downloads through Files so nothing sits on developer laptops and every document inherits case IDs |
| Live oversight | `debugUrl`, embeds, Agent Traces | Serve the viewer through your ACL, log interactive handoffs, and pair each replay with the Agent Trace export for counsel |
| Evidence retention | HLS + Files exports | Export Agent Traces and Files archives before the plan retention window (7 days on Launch, 14 on Scale, custom on Enterprise) and store them in your compliance bucket; keep the HLS replay link on file so the session can be re-streamed for counsel while Steel retains it |
| Data residency | Steel Cloud vs Steel Browser | Use Steel Browser in your own VPC when statutes require in-boundary processing, otherwise lean on Steel Cloud for managed proxies and CAPTCHA solving |

## Works for / Not yet
**Works for**
- Monitoring court dockets, board agendas, and enforcement bulletins across dozens of portals that share a Chromium front end
- Running FOIA queues, licensure renewals, and compliance filings that need attachments plus auditable evidence packages
- Investigations where counsel demands video proof of what the automation accessed and when approvals were granted

**Not yet**
- Desktop-only court software or terminals that never expose a browser surface Steel can attach to
- Hardware token flows without SMS or TOTP fallbacks
- Scenarios where you cannot store replays, Agent Traces, or files outside the portal, because auditors still expect exported evidence
- Self-hosting Steel Browser (Steel Local) in your own VPC for data residency: it gives you in-boundary processing and single-concurrency control, but it does not currently include the Credentials, Files, or CAPTCHA APIs (or dedicated Stealth Browser) — those are Steel Cloud only. If your statute requires in-boundary processing AND you need those APIs, talk to Steel about a dedicated Enterprise deployment

## Next step
Pick one docket sweep, seed a profile, upload the agency credentials under a namespace, and run it through Steel Cloud so you can capture replays, Agent Traces, and a Files archive in a single queue item. The docs that matter are [docs.steel.dev/overview/sessions-api/overview](https://docs.steel.dev/overview/sessions-api/overview), [docs.steel.dev/overview/profiles-api/overview](https://docs.steel.dev/overview/profiles-api/overview), [docs.steel.dev/overview/credentials-api/overview](https://docs.steel.dev/overview/credentials-api/overview), and [docs.steel.dev/overview/files-api/overview](https://docs.steel.dev/overview/files-api/overview).

Humans use Chrome. Agents use Steel.
