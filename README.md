# LLM Answers on Steel

This repository builds `answers.steel.dev`: a small, source-grounded knowledge site for engineers and AI retrieval systems.

Ansorum compiles each published Markdown answer into:

- a human-readable HTML page;
- canonical machine Markdown at `page.md`;
- a JSON-LD sidecar;
- entries in `answers.json`, `llms.txt`, and `llms-full.txt`.

## Content layout

- `content/articles/` contains ten published cornerstone articles and additional editorial drafts.
- `content/glossary/` contains short definitions for Steel and browser-agent concepts.
- `themes/steel/` contains the active Tera and Sass theme.
- `eval/fixtures.yaml` defines deterministic retrieval and answer-selection checks.

## Publication state

Ansorum and Zola use the `draft` front-matter field as the publication gate:

```yaml
status: "draft"
draft: true
```

A normal build excludes draft HTML, machine Markdown, JSON-LD, and retrieval records. Use `ansorum build --drafts` only for local editorial review.

The descriptive `status` field does not control publication by itself.

## Editorial contract

Every published answer must:

- answer one primary query;
- identify an owner and `review_by` date;
- link current official sources through `external_refs`;
- use only code that matches the current SDK and documentation;
- avoid unsupported customer, competitor, benchmark, pricing, or plan claims;
- declare a realistic machine-output `token_budget`;
- link only to other public answer IDs through `related`.

## Local workflow

```bash
ansorum check
ansorum build
ansorum audit
ansorum eval
```

Use `ansorum serve` for local preview. Generated output is written to `public/` and is ignored by Git.

Before publishing a draft:

1. Verify every technical claim against its `external_refs`.
2. Run code examples against the documented package versions.
3. Set `status: "published"` and `draft: false`.
4. Run the full workflow above.

LLM rubric scoring remains optional and requires `OPENAI_API_KEY`; deterministic retrieval evaluation does not.
