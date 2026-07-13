---
title: "Upload & Download Files in Browser Agent Sessions"
id: "browser-files-api-for-agent-workflows"
summary: "Use session files for one browser run and global files for assets that must be reused across sessions."
description: "How to move files in and out of cloud browser sessions — session files for a single run, global files for assets reused across every session."
canonical_questions: ["how do files work in steel browser sessions"]
retrieval_aliases: ["steel files api", "browser agent uploads and downloads"]
intent: "reference"
entity: "browser-infrastructure"
audience: "developer"
schema_type: "TechArticle"
visibility: "public"
ai_visibility: "public"
llms_priority: "core"
token_budget: "full"
date: "2026-07-13"
updated: "2026-07-13"
review_by: "2026-10-13"
owner: "editorial"
related: ["files-api", "sessions", "production-checklist-for-browser-agents"]
external_refs:
  - "https://docs.steel.dev/overview/files-api/overview"
type: "article"
status: "published"
draft: false
canonical_url: "https://answers.steel.dev/articles/browser-files-api-for-agent-workflows/"
created: "2026-04-01"
modified: "2026-07-13"
tags: [files, uploads, downloads]
immutable: false
---
Steel has two file scopes. Session files belong to an active browser environment; global files persist at the organization level and can be mounted into later sessions.

Use session files for uploads, downloads, and artifacts tied to one run. Use global files for inputs that several runs need.

## Upload a file to a session

```ts
import fs from "node:fs";

const session = await client.sessions.create();

try {
  const uploaded = await client.sessions.files.upload(session.id, {
    file: fs.createReadStream("./input.csv"),
  });

  console.log(uploaded.path);
  // Use uploaded.path when setting the browser's file input.
} finally {
  await client.sessions.release(session.id);
}
```

Files uploaded to the session are available inside that browser environment. Browser downloads also appear through the session files interface.

## Download the run's output

```ts
const files = await client.sessions.files.list(session.id);

for (const file of files.data) {
  console.log(file.path, file.size);
}

const archive = await client.sessions.files.downloadArchive(session.id);
const zip = await archive.blob();
```

Download the artifacts your application must retain before their storage policy expires. Keep the session ID, job ID, source URL, and artifact checksum beside the stored file.

## Reuse a global file

```ts
const globalFile = await client.files.upload({
  file: fs.createReadStream("./reference.csv"),
});

const sessionFile = await client.sessions.files.upload(session.id, {
  file: globalFile.path,
});
```

Global storage avoids uploading the same input for every run. Keep tenant boundaries in your application: organization-wide availability does not mean every workflow should receive every file.

## Security and retention

Files can contain personal data, exports from authenticated portals, or instructions that influence an agent. Apply the same controls used for other untrusted input:

- validate file type and size;
- scan or sandbox content before parsing;
- keep authorization tied to the owning task or tenant;
- avoid exposing raw storage paths in model prompts;
- define retention and deletion outside the browser lifecycle.

Releasing a session ends browser execution, but it is not a data-retention policy.

Follow the [Files API overview](https://docs.steel.dev/overview/files-api/overview) to upload one test file, list the session files, and download the resulting archive.
