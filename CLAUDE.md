# DesignCoWork

A design co-pilot, built to eventually be sold to other designers. Not a "generate isolated outputs" tool — it supports a loop of **exploration → execution → documentation → maintenance**, with persistent project memory across sessions.

## Product shape

- Skills come from https://github.com/Owl-Listener/designer-skills (9 plugins: design-research, design-systems, ux-strategy, ui-design, interaction-design, prototyping-testing, design-ops, designer-toolkit, visual-critique). A future routing layer decides which plugin(s) apply to a given request.
- Core entities: **topics** (threads), **captures** (the on-the-go inbox — text, Figma links, voice), **figma_refs** (ingested Figma file/frame data), **decisions** (the rationale log), **audits** (design-ops/design-systems findings).
- Used on the go: paste a Figma link, ask a question, open a new topic, add a requirement — from a phone.

## Architecture decisions (already made, don't re-litigate without reason)

- **Multi-tenant from day one.** This is meant to be sold to other designers, not just for personal use. Backend is a dedicated Supabase project, `DesignCoWork` (project ref `htdukbbvutwvmsssglyk`, org PombeiroHouse, eu-west-1) — NOT the personal "CoWork" project, which has `linkedin_posts`/`hedging-tool`/`customer-portal` data and no org boundary. RLS is scoped via `org_members`, not just `user_id`.
- Schema *patterns* (capture → enrich inbox, lightweight decision log) were borrowed from the personal CoWork project's `captures`/`context_notes` tables, but the actual multi-tenant schema lives in `supabase/migrations/` in this repo.
- App is a **Next.js PWA** (`design-cowork-app/`) — installable on a phone home screen, no app-store review needed. Chosen over native for speed of iteration.
- Auth: Supabase Auth.
- Figma ingestion and Claude-based enrichment/routing are meant to run as Supabase Edge Functions (not yet built — see `docs/PROGRESS.md`).

## Repo layout

- `design-cowork-app/` — Next.js app (App Router, TypeScript, Tailwind)
- `supabase/migrations/` — versioned schema (source of truth for the database)
- `docs/PROGRESS.md` — living status/roadmap, update this as work lands

## Working agreement

- Update `docs/PROGRESS.md` whenever a phase moves forward — that file is the memory used to pick work back up across sessions.
- New Supabase project creation, schema changes that go straight to a remote project, and anything billing-related needs a check-in before acting.
