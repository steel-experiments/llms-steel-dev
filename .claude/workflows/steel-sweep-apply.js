export const meta = {
  name: 'steel-sweep-apply',
  description: 'Apply verified systemic fact-check fixes to each of the 32 published Steel.dev articles (body-only, frontmatter untouched)',
  phases: [
    { title: 'Apply', detail: 'one surgical editor per article: reads its edit-spec + the article, applies verified fixes' },
  ],
}

let ARTICLES = args
if (typeof ARTICLES === 'string') { try { ARTICLES = JSON.parse(ARTICLES) } catch (e) { ARTICLES = ARTICLES.split('\n').map((s) => s.trim()).filter(Boolean) } }
if (!Array.isArray(ARTICLES) || !ARTICLES.length) throw new Error('args must be a non-empty array of article paths; got typeof=' + typeof args)

function slug(p) { return p.split('/').pop().replace(/\.md$/, '') }

const APPLY_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['path', 'slug', 'editsApplied', 'skipped', 'uncertain', 'residualPatterns'],
  properties: {
    path: { type: 'string' },
    slug: { type: 'string' },
    editsApplied: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['what'], properties: {
      what: { type: 'string', description: 'concise description of the edit made' },
      category: { enum: ['pricing', 'session-ceiling', 'agent-traces', 'timeout-model', 'sdk-symbol', 'steel-local', 'competitor', 'link', 'model-id', 'other'] },
    } } },
    skipped: { type: 'array', items: { type: 'string' }, description: 'spec fixes deliberately not applied, with reason' },
    uncertain: { type: 'array', items: { type: 'string' }, description: 'fixes you were unsure about — flag for human review (do not guess)' },
    residualPatterns: { type: 'array', items: { type: 'string' }, description: 'systemic error patterns still present after your edits' },
  },
}

function applyPrompt(path) {
  const s = slug(path)
  return [
    'You are a meticulous copy-editor applying VERIFIED fact-check fixes to a PUBLISHED Steel.dev article. The fixes have already been researched, adversarially verified, and written out in your edit-spec. Your job is to apply them surgically — not to research or invent.',
    '',
    'ARTICLE (absolute path): ' + path,
    'YOUR EDIT SPEC (read it FIRST with the Read tool): /tmp/specs/' + s + '.md',
    '',
    'The spec opens with "## 0" — the canonical Steel pricing/limits table, independently verified 2026-07-13 against docs.steel.dev. Treat that table as GROUND TRUTH for every number. Then comes "## Your article\'s edit spec" with: Priority issues (each with a suggestedFix), Claim checks (each with a recommendedAction containing exact OLD→NEW replacement text), Broken links, and Top improvements.',
    '',
    'STEP 1 — Read the spec file, then Read the article file.',
    'STEP 2 — Apply EVERY fix in the spec: each "Priority issues → suggestedFix", each "Claim checks → recommendedAction" (these contain exact OLD/NEW text — use it, adapting only if the live text differs slightly), and each "Broken links → fix".',
    'STEP 3 — Then scan the article body for these GLOBAL SYSTEMIC PATTERNS and fix any that are present (use the §0 table for all numbers):',
    '  1. Plan names: Hobby→Launch, Starter→Launch, Developer→Scale (or Launch by context), Pro→Scale. Replace every per-tier number with the §0 table (concurrency 10/100/1,000+; rate 60/600/custom RPM; max session 15 min/1 hour/up to 24 h; retention 7/14/custom days; browser $0.10/$0.08 per hr; proxy $10/$6 per GB; CAPTCHA $3/$1 per 1k).',
    '  2. Unqualified "24 hour" / "24h" / "24-hour" sessions → qualify as a tiered ceiling: "up to 24 hours on Enterprise (15 minutes on Launch, 1 hour on Scale)". Keep it concise in table cells.',
    '  3. "agent logs" / "agent-logs" / "agentLogs" / "Agent Logs" → "Agent Traces"; endpoint /v1/sessions/{id}/agent-logs → /v1/sessions/{id}/agent-traces; REMOVE nonexistent SDK methods (client.sessions.agentLogs, steel.sessions.logs.list, sessions.logs.list) and replace with a REST fetch (e.g. fetch of /v1/sessions/{id}/agent-traces with the steel-api-key header).',
    '  4. "3x overage" / "triple credits" / "burst" billing mechanism → DELETE; Steel bills metered pay-as-you-go beyond included credits (Launch $30 one-time/90-day, Scale $100/mo). Rephrase to that.',
    '  5. "requests per second" / "1, 2, 5, or 10 RPS" → "requests per minute (RPM): 60 on Launch, 600 on Scale, custom on Enterprise".',
    '  6. The region `ord` (Chicago) does NOT exist in Steel Cloud — only `lax` and `iad`. Remove every `ord` reference and any "three regions" claim; rewrite any Chicago-residency example around `iad`.',
    '  7. Invented/wrong code symbols: profiles.get → profiles.retrieve; client.files.downloadArchive → client.sessions.files.downloadArchive; `steel run ... --task` → `steel forge <template> --name ...`; `npx skills add steel-dev/cli` → `npx skills add steel-dev/skills`; "Quick Actions" → "Browser Tools"; page.swipe() → a pointer down/move/up sequence; page.tap() → locator.tap(); `steel browser snapshot -i` used for visual evidence → `steel browser screenshot` (snapshot returns an a11y tree). In Python code, camelCase like persistProfile/releaseAll should be snake_case persist_profile/release_all UNLESS the surrounding code is clearly JavaScript/TypeScript.',
    '  8. timeout vs inactivityTimeout: where the article calls the 5-minute default an "idle timer" / "5 minutes of inactivity" / "time out after 5 minutes of inactivity", correct it: 5 min is the hard session LIFETIME (timeout, billable even when idle); idle-based release is the separate, OFF-by-default inactivityTimeout. Replace no-op heartbeat advice (page.waitForTimeout(0)) with: set a larger timeout at creation, and if inactivityTimeout is on, keep the session warm with a real CDP command (e.g. page.evaluate(() => 1)).',
    '  9. Steel Local / self-host caveat: where the article recommends self-host/Steel Local for compliance, on-prem, or anti-bot, ADD a one-line caveat that Credentials API, Files API, CAPTCHA solving, and the dedicated Stealth Browser are Steel Cloud-only (Steel Local = concurrency 1) — unless the spec says otherwise.',
    ' 10. Broken benchmark link `../20-29%20Content/20%20Articles/remote-browser-benchmark.md` → https://steel.dev/blog/remote-browser-benchmark',
    ' 11. Stale model IDs (if present): claude-sonnet-4-5 → claude-sonnet-5; computer_20250124 → computer_20251124; gemini-2.5 → gemini-3-flash-preview; GPT-4o → GPT-5. (Only if the article pins these.)',
    '',
    'HARD RULES (non-negotiable):',
    '- BODY ONLY. Do NOT edit the YAML frontmatter (between the opening "---" and the closing "---"). Titles, descriptions, draft flags, and status were already optimized and published — leave them exactly as-is.',
    '- Preserve ALL code comments. Preserve the article\'s structure, headings, tables, and tone. Make the SMALLEST edit that fixes each error — no rewrites unless a specific fix requires one.',
    '- Locate edit targets by matching the QUOTED TEXT in the spec, not by line number (line numbers may drift as you edit).',
    '- For competitor/compliance softening (SOC 2, Skyvern, customer statistics, Browserbase numbers), follow the spec\'s recommendedAction EXACTLY. Do not invent new competitor claims. If a recommendedAction would assert something unverified, weaken it instead and list it under `uncertain`.',
    '- If any fix is ambiguous or you are unsure, SKIP it and list it under `uncertain` — never guess at facts, prices, or API names.',
    '- Keep all glossary links like (@/glossary/foo.md) intact.',
    '',
    'When done, return ONLY the structured object summarizing what you changed, what you skipped, and anything uncertain.',
  ].join('\n')
}

phase('Apply')
const results = await parallel(ARTICLES.map((p) => () =>
  agent(applyPrompt(p), { label: 'apply:' + slug(p), phase: 'Apply', schema: APPLY_SCHEMA, agentType: 'general-purpose', effort: 'high' })
    .then((r) => ({ slug: slug(p), result: r }))
    .catch((e) => ({ slug: slug(p), error: String(e && e.message ? e.message : e) }))
))

return { applied: results.filter((r) => r.result), errored: results.filter((r) => r.error) }
