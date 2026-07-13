---
title: "Choose Between Self-Hosted Steel Browser and Steel Cloud"
id: "steel-local-vs-steel-cloud"
summary: "Self-host Steel Browser when infrastructure control is the requirement; use Steel Cloud when managed browser operations are the requirement."
description: "Self-host Steel Browser when infrastructure control is the requirement; use Steel Cloud when managed browser operations are the requirement."
canonical_questions: ["steel local vs steel cloud"]
retrieval_aliases: ["self hosted steel vs cloud", "steel browser deployment options"]
intent: "comparison"
entity: "browser-infrastructure"
audience: "developer"
schema_type: "Article"
visibility: "public"
ai_visibility: "public"
llms_priority: "core"
token_budget: "full"
date: "2026-07-13"
updated: "2026-07-13"
review_by: "2026-10-13"
owner: "editorial"
related: ["steel-local", "steel-cloud", "sessions", "what-is-a-cloud-browser-for-ai-agents"]
external_refs:
  - "https://docs.steel.dev/overview/self-hosting/docker"
  - "https://github.com/steel-dev/steel-browser"
  - "https://docs.steel.dev/overview/sessions-api/overview"
type: "article"
status: "published"
draft: false
canonical_url: "https://answers.steel.dev/articles/steel-local-vs-steel-cloud/"
created: "2026-04-01"
modified: "2026-07-13"
tags: [self-hosting, steel-cloud, deployment]
immutable: false
---
Self-hosted Steel Browser and Steel Cloud expose the same browser-session model but assign infrastructure ownership differently. Self-hosting gives your team control of the runtime; Steel Cloud operates the browser infrastructure for you.

## Start self-hosted Steel Browser

```bash
docker run --rm -it \
  -p 3000:3000 \
  -p 9223:9223 \
  ghcr.io/steel-dev/steel-browser:latest
```

This command is suitable for local evaluation. For production, the Steel self-hosting guide recommends pinned image versions, HTTPS, authentication, resource limits, and restricted access to the Chrome debugging port.

## Choose based on operational ownership

| Requirement | Self-hosted Steel Browser | Steel Cloud |
| --- | --- | --- |
| Runtime location | Your machines or cloud account | Steel-managed infrastructure |
| Updates and capacity | Your team plans and operates them | Steel operates the service |
| Network boundary | Defined by your deployment | Defined by Cloud configuration |
| Local modification | Source and container are available | Managed service interface |
| Incident response | Your on-call owns the browser layer | Shared between your application and service provider |

Self-hosting is a fit when browser execution must remain inside a controlled environment, the team needs to modify the runtime, or browser infrastructure is already an accepted operational responsibility.

Steel Cloud is a fit when the team wants to consume sessions through an API without operating Chrome hosts, capacity, updates, and supporting services.

## Keep application code portable

The Node and Python SDKs support a custom base URL for self-hosted deployments. Keep provider-specific configuration at the client boundary so workflow code depends on the session interface rather than one hostname.

Test portability with the operations your application actually uses. A basic session and CDP connection may work in both environments while managed proxies, CAPTCHA handling, files, credentials, regions, or retention policies differ.

## Account for the full self-hosting surface

Running the container is only the first step. Production ownership includes:

- authentication and TLS;
- Chrome and container updates;
- CPU, memory, and disk capacity;
- session cleanup after worker failure;
- logs, metrics, and recordings;
- network egress and proxy policy;
- backups for any persisted data;
- incident response.

Compare those responsibilities with the managed-service contract, not only browser-hour cost.

Follow the [Docker self-hosting guide](https://docs.steel.dev/overview/self-hosting/docker) to run one local session, then repeat the same workflow against Steel Cloud before choosing an operating model.
