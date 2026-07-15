---
title: "Automating Security Questionnaires With Browser Agents"
id: "browser-automation-for-security-questionnaires"
summary: "Show GRC teams to run security questionnaires inside Steel sessions with approvals, credential injection, and Files archives so evidence ships with responses."
canonical_questions: ["automating security questionnaires with browser agents"]
intent: "reference"
entity: "security"
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
canonical_url: "https://steel.dev/blog/browser-automation-for-security-questionnaires"
description: "Show GRC teams to run security questionnaires inside Steel sessions with approvals, credential injection, and Files archives so evidence ships with responses."
created: "2026-04-01"
modified: "2026-04-01"
tags: [security, questionnaires, vertical-workflow]
immutable: false
---
Security questionnaires only move when every answer ships with proof, and the proof usually lives behind trust portals that demand live browsers, attachments, and human approvals. Treat the entire workflow as a managed Steel session: spin up a session on demand, keep it alive across the questionnaire lifecycle (up to 24 hours on Enterprise; 1 hour on Scale and 15 minutes on Launch), and let approvals plus evidence exports ride on the same session instead of bouncing between spreadsheets and ad hoc screen shares.

Instead of handing procurement a pile of Playwright scripts and hoping reviewers accept screenshots, wire Steel into the questionnaire queue. Credentials stay inside the [Credentials API](@/glossary/credentials-api.md), Files carries every policy PDF or pentest report through uploads and downloads, and the `debugUrl` becomes the approval surface where a security lead can click through answers before the run releases.

## Where questionnaire workflows fall apart
- Portal fatigue: trust portals, SOC 2 exchanges, and SIG forms rotate between OTP prompts and idle timers, so local browser farms burn hours reconnecting just to upload the next answer.
- Attachments go missing: evidence packets scatter across laptops once someone drags a policy PDF into a survey widget, leaving no canonical archive when procurement reopens the ticket.
- Approvals lack custody: reviewers want to watch the exact browser state before the answer is submitted, yet screen shares never cite who touched the data or when.
- Scale stalls: every quarter brings dozens of overlapping questionnaires, and improvised fleets crash once more than a handful of sessions overlap because concurrency lives on brittle desktop VMs instead of Steel Cloud capacity.

## Workflow map
| Workflow | What usually breaks | Steel pattern |
| --- | --- | --- |
| Vendor security questionnaire portals | OTP prompts, timeouts, and forced file uploads make each answer a manual chore | Create a session with the right namespace, let Credentials inject username, password, and optional TOTP, then keep the portal live while Files mounts `/files` for every attachment |
| Trust center follow ups (SIG, CAIQ, bespoke forms) | Evidence revisions are stuck in email threads with no proof of submission | Upload refreshed policies or screenshots into Global Files, reuse them across sessions, and export the session archive so each follow up inherits the same artifacts |
| Proof of controls during audits | Reviewers need to see the automation in action before sign off | Embed the `debugUrl` with `interactive=true` and `showControls=true` so an approver can click through before the agent submits, then store the replay and Agent Traces with the questionnaire ID |
| Annual recertification runs | Multiple questionnaires overlap and saturate shared laptops | Use Steel Cloud to run dozens or hundreds of concurrent sessions while tagging each one with vendor metadata, then release and archive as a batch |

## Recommended browser pattern
1. **Tag the session on creation.** Include questionnaire ID, vendor, and control family in `metadata` so every replay, log export, and file bundle is searchable later.
2. **Namespace credentials.** Store each vendor portal login in the Credentials API, set namespaces per customer or program, and enable the default auto submit plus field blurring so secrets never leak back to the agent. Use `totpSecret` when portals require MFA so Steel injects fresh codes on demand.
3. **Mount attachments through Files.** Upload policy PDFs, pentest reports, and architecture diagrams into Global Files once, then mount them into each session and keep downloads in the `/files` directory for deterministic archiving. Use the archive endpoint after `sessions.release` so procurement gets a single zip.
4. **Wrap approvals with the live viewer.** Serve the `debugUrl` behind your SSO, pass `interactive=true` for approvers who need to edit an answer, and log every interactive session so the approval record inherits timestamps and user IDs.
5. **Mirror evidence on release.** Automate replay downloads, Agent Traces exports, and Files archive uploads into your compliance bucket immediately so nothing depends on plan retention windows (7 days on Launch, 14 days on Scale).
6. **Watch plan fit.** Steel Local is perfect for development but caps concurrency around a single session. Steel Cloud concurrency is 10 sessions on Launch, 100 on Scale, and 1,000+ on Enterprise, so size the questionnaire season against your tier before the queue spikes.
7. **Keep portals warm.** Set an explicit `timeout` (in milliseconds) when you create each session so one browser can finish several questionnaires for the same vendor back-to-back — Steel caps session length at 15 minutes on Launch, 1 hour on Scale, and up to 24 hours on Enterprise, and the default is only 5 minutes, so always set it explicitly. Chain questionnaires by vendor within your plan's window and close each with `sessions.release()` (or `sessions.releaseAll()` for a batch) once the answer set and evidence export complete.

## Trust and approvals checklist
| Requirement | Steel surface | How to wire it |
| --- | --- | --- |
| Credential custody | Credentials API | Store logins per namespace, let Steel inject and blur fields, and keep MFA secrets server side so agents never see raw passwords |
| Evidence handling | Files API | Upload source documents once, mount them into each session, and download the archive so attachments and portal receipts land in one predictable bundle |
| Live approval trail | `debugUrl` viewer | Embed the URL with `interactive=true&showControls=true`, gate it behind your ACL, and log who interacted before submission |
| Replayable proof | Session replays and Agent Traces | Export both immediately and tag them with questionnaire IDs so auditors can confirm what the automation submitted |
| Data residency | Steel Cloud vs Steel Browser | Run Steel Cloud when you need managed proxies, CAPTCHA solving, and the Credentials and Files APIs. Self-hosted Steel Browser (Steel Local) keeps sessions inside your VPC, but the Credentials and Files APIs are Cloud-only — so credential injection, TOTP autofill, and the Global Files archive must be swapped for a self-hosted equivalent before this workflow runs fully on-prem |

## Works for / Not yet
**Works for**
- SOC 2, SIG, CAIQ, VSA, and bespoke questionnaires that sit inside vendor trust portals and accept file uploads
- Procurement follow ups that demand live approvals and exported evidence before closing a ticket
- GRC teams that already orchestrate questionnaires in tools like Hyperproof or Vanta but still need a deterministic browser tier for portal steps

**Not yet**
- Portals that require hardware security keys or push-based MFA — the Credentials API injects TOTP codes only, so portals without a TOTP option (including SMS-only and WebAuthn-only flows) are not supported
- Questionnaires that prohibit any replay, log, or file export outside the vendor system
- Desktop-only survey tools that cannot be reached through a Chromium-based browser session
- Workloads that require both full VPC isolation and the Credentials/Files APIs in one platform — Credentials and Files are Cloud-only, so self-hosted (Steel Local) deployments cannot run this workflow end-to-end

## Next step
Pick a single vendor portal, upload its credentials and MFA secret into the Credentials API, stage attachments in Global Files, and run the next questionnaire through Steel Cloud so you can capture approvals via `debugUrl` plus a Files archive in one pass. The docs that matter are [docs.steel.dev/overview/sessions-api/overview](https://docs.steel.dev/overview/sessions-api/overview), [docs.steel.dev/overview/credentials-api/overview](https://docs.steel.dev/overview/credentials-api/overview), [docs.steel.dev/overview/files-api/overview](https://docs.steel.dev/overview/files-api/overview), and [docs.steel.dev/overview/sessions-api/human-in-the-loop](https://docs.steel.dev/overview/sessions-api/human-in-the-loop).

Humans use Chrome. Agents use Steel.
