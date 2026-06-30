# Progress

Living checklist. Update this whenever a phase moves — this is the memory we use to pick work back up.

## Phase 0 — Foundations
- [x] Decided: multi-tenant product, separate from personal CoWork Supabase project
- [x] Decided: Next.js PWA over native app
- [x] Repo scaffolded (`design-cowork-app/`, builds clean)
- [x] Multi-tenant schema written (`supabase/migrations/0001_init.sql`): organizations, org_members, topics, captures, figma_refs, decisions, audits — all RLS-scoped to org membership
- [x] Supabase client helpers (`src/lib/supabase/client.ts`, `server.ts`)
- [x] Core types (`src/lib/types.ts`)
- [x] New Supabase project created: `DesignCoWork` (org: PombeiroHouse, region: eu-west-1, project ref: `htdukbbvutwvmsssglyk`, free tier — $0/mo)
- [x] Migration applied to the live project (`0001_init.sql` + `harden_is_org_member` search_path/anon-execute fix)
- [x] `design-cowork-app/.env.local` filled in with the live project URL + anon key (gitignored, not committed)

## Phase 1 — Core loop (MVP)
- [x] Topics list page (`/`)
- [x] New topic page (`/topics/new`)
- [x] Topic detail page with capture feed + quick-add form (`/topics/[id]`)
- [x] Capture auto-detects Figma links and creates a `figma_refs` row
- [x] Auth (sign in / sign up via `src/lib/auth-actions.ts`, session refresh in `src/proxy.ts` — Next.js 16 renamed middleware.ts to proxy.ts)
- [x] Org bootstrap on signup (`src/lib/org.ts` `ensureOrg()` — lazily creates a personal workspace org + `org_members` row on first authenticated page load; added `0002_org_bootstrap_policies.sql` INSERT policies needed for this)
- [x] Real design system: dark theme (surface/border/accent CSS vars in `globals.css`), `components/ui/` (button, input, textarea, badge) built on Radix + CVA since the shadcn CLI registry was unreachable from this sandbox's network
- [x] Mobile-first app shell: slim top bar + bottom nav with center FAB, extensible via `src/lib/nav.ts`; overflow-hidden removed from root div so FAB protrusion and touch targets work correctly
- [ ] Decisions view (pin/list rationale per topic)

## Phase 2 — Figma + enrichment
- [ ] Edge Function: Figma ingestion (fetch file/image metadata via Figma API into `figma_refs`)
- [ ] Edge Function: Claude-based enrichment — applies designer-skills routing against topic history + decisions + figma_refs, writes back to `captures.enrichment`
- [ ] Designer-skills routing logic (which plugin(s) apply to a given request)

## Phase 3 — Operations / maintenance layer
- [ ] Audits: design-ops / design-systems / visual-critique runs against stored component inventory + decision log
- [ ] "Is anything stale?" maintenance ritual (new component undocumented, decision not propagated, unresolved critique)

## Phase 4 — Sellable product
- [ ] Multi-org invites (beyond single org per signup)
- [ ] Billing
- [ ] Onboarding flow for new design teams

## Open decisions
- None blocking right now. Next concrete step: pick up Decisions view (Phase 1) or move into Phase 2 (Figma ingestion + enrichment).

## Known limitations / verification notes
- **This sandbox's network blocks direct calls to `*.supabase.co`** (confirmed via curl → 403 "Host not in allowlist"). The Supabase MCP tools still work (different network path), but `npm run dev` in this container cannot complete real sign-up/sign-in against the live project. The end-to-end auth → topic → capture flow has only been verified by code review + build, not by driving it live from here. Needs to be re-verified once deployed somewhere with normal egress (e.g. Vercel) or run locally on a machine with open network access.
- The raw fetch failure currently leaks to the user as unhelpful JSON-parse-error text on `/auth/sign-up` if the network call fails — worth wrapping in a friendlier error message before shipping.
