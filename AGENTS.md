<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# OMNIARK project instructions

## Scope

These rules apply to the OMNIARK website, Omniark Studio, blog content, Developer Notes, and publication workflow. For Developer Notes work, the editorial charter defines truth, teaching, visual, and approval standards; the growth system defines evidence-led discovery, search, measurement, and reuse work. Read both when the work affects content strategy, search, analytics, or publication readiness.

## Must-read documents

- `docs/DEVELOPER_NOTES_EDITORIAL_CHARTER.md` – editorial mission, evidence rules, teaching level, visuals, search structure, workflow, and approval boundaries
- `docs/DEVELOPER_NOTES_GROWTH_SYSTEM.md` – source-first topic discovery, search and answer-engine discovery, technical audit scope, comparison experiments, measurement, and staged delivery
- `docs/SEARCH_FOUNDATION.md` – current search, metadata, sitemap, and indexing contract
- `docs/ADSENSE_STATUS.md` – current AdSense status and unresolved site-quality work

Read only the documents relevant to the requested scope, but always read the editorial charter before creating or changing Developer Notes content or its presentation.

## Hard rules

- Developer Notes must be based on traceable real events. Never invent a log, error, fix, result, date, metric, or personal experience.
- Prefer resolved incidents with verified results. An unresolved incident may be used only when uncertainty is explicit and the general diagnostic lesson is clearly separated from the historical record.
- Treat the owner as the author. Preserve sincere first-person material, but do not attribute the agent's inference or technical knowledge to the owner as lived experience.
- Keep credentials, API keys, account identifiers, private paths, session IDs, personal data, unreleased business figures, and raw internal logs out of public-facing drafts and visuals.
- Files in `app/content/drafts` are review copies. Files in `app/content/posts` are public-site sources. Do not move, copy, or recreate a draft in `posts` without explicit publication approval.
- Do not delete, unpublish, replace, schedule, deploy, or alter an existing public post without explicit approval.
- A successful build or test is not proof of a usable result. Report separately what was executed, what succeeded, what failed, and what remains unverified.
- Reuse the existing Studio importer, safe Markdown blocks, visual system, and publication path before building another content system.
- Keep unrelated working-tree changes untouched. Commit only the exact files belonging to one coherent change.

## Working loop

1. Inspect current site, draft, evidence, and relevant history.
2. Create or update an internal event card before writing the article.
3. Establish the reader question and search intent only after the event is evidenced; never reverse that order to manufacture a topic.
4. Classify every material claim as confirmed, author-provided, inferred, or unverified.
5. Draft as a useful chapter for beginner, intermediate, and advanced vibe coders.
6. Add evidence-led visuals that explain something the text alone does not.
7. Check factual boundaries, privacy, mobile readability, alt text, search structure, related-note links, and discoverability metadata.
8. Import only the selected article into Studio as `status: draft`.
9. Run the relevant renderer/import/build tests and inspect the resulting file or screen.
10. Stop at review state unless publication is explicitly requested.
11. After a public launch, measure only verifiable discovery and reader-path signals; do not invent attribution or AI-citation results.
12. Report completed work, unverified work, and the next safe action.

## Definition of complete

Work is not complete because text exists. It is complete only when the source record, edited article, visual assets, rendered draft, verification result, and publication state have each been checked and reported accurately.
