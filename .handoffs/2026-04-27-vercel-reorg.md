# Vercel Account Reorg — Performance Interpreting

**Created:** 2026-04-25
**Target execution:** 2026-04-27 (Mon morning, ~1–2 hrs)
**Status:** Planned, not started

## Why we're doing this

The current Vercel team `tailored-tools-projects` (under personal Gmail account `jamesredwards89@gmail.com`) holds **17 projects across 4+ different ventures** (PI, Sonic Sanctuary, Tailored Tools, plus side projects). This created the bug we hit on 2026-04-25: the GitHub identity linked to the Vercel account is `Tailored-Tools` (not `performinterp`), so `vercel git connect` for `pi-website` failed because Vercel can't see the `performinterp` GitHub namespace from a `Tailored-Tools`-linked account. Fixing it case-by-case adds collaborator hacks; doing it properly means separating concerns by venture.

We also have a separate Vercel account `admin@performanceinterpreting.co.uk` already created but with no projects under it — perfect home for a clean PI Vercel team.

## Target end state

| Venture | Vercel account / team | GitHub link | Projects |
|---|---|---|---|
| **Performance Interpreting** | `admin@performanceinterpreting.co.uk` (new team) | `performinterp` | All `pi-*` projects |
| **Sonic Sanctuary** | TBD — own team or `admin@thesonicsanctuary.uk` | TBD | `ss-os`, `sonic-sanctuary-site` |
| **Tailored Tools** | Existing team, **rename** from `tailored-tools-projects` to just `tailored-tools` | `Tailored-Tools` | TT projects only |
| **Personal/side** | Personal Gmail Vercel | `Tailored-Tools` or personal | `fitcheck`, `nephew-bike-site`, `ajw`, `lineage-music`, `gold-rush`, `loose-minisite`, `memory-box-sender` |

## Project inventory (as of 2026-04-25)

All 17 projects in `tailored-tools-projects` team:

**PI projects (7) — move to PI team:**
- `pi-website` — performanceinterpreting.co.uk + www → **LIVE, customer-facing**
- `pi-events-guide` — pi-southbank-guide.vercel.app
- `pi-events-pitch` — pi-events-pitch.vercel.app
- `pi-projects-site` — projects.performanceinterpreting.co.uk → **live subdomain**
- `pi-os-staff` — os.performanceinterpreting.co.uk → **live subdomain**
- `pi-os` — last deploy 2026-01-30 (likely stale — verify before move, may be deletable)
- `pi-os-preview` — last deploy 2026-02-03 (stale — verify before move, may be deletable)

**Sonic Sanctuary projects (2) — move to SS team/account:**
- `ss-os` — thesonicsanctuary.uk + www → **LIVE, customer-facing**
- `sonic-sanctuary-site` — also has thesonicsanctuary.uk attached (conflict? legacy site? verify which is actually serving)

**Other projects (8) — leave behind / personal:**
- `memory-box-sender`, `lineage-music`, `fitcheck`, `ao-api`, `nephew-bike-site`, `ajw` (amandajanewellness.com — live), `gold-rush`, `loose-minisite`

## STOP AND CONFIRM before starting

1. **Plan tier check** — is the current `tailored-tools-projects` team on Hobby or Pro? New PI team will start on Hobby. If you need Pro (analytics, longer crons, more bandwidth), upgrade plan needs deciding upfront.
2. **`thesonicsanctuary.uk` conflict** — both `ss-os` AND `sonic-sanctuary-site` claim the domain. Verify which one is actually serving (`dig thesonicsanctuary.uk` + Vercel dashboard) before any move.
3. **Live customer domains:** `performanceinterpreting.co.uk`, `projects.performanceinterpreting.co.uk`, `os.performanceinterpreting.co.uk`, `thesonicsanctuary.uk`, `amandajanewellness.com` — any move risks downtime if mishandled. Save these for last.

## Execution order (lowest risk first)

### Phase 1 — Prep (no live impact, ~20 min)
1. Sign into `admin@performanceinterpreting.co.uk` Vercel account in browser.
2. Create new team called `performance-interpreting` (or whatever you prefer — keep it short, no "co-uk" suffix).
3. Choose plan tier (Hobby is fine to start).
4. Go to https://vercel.com/[new-team]/settings → invite `jamesredwards89@gmail.com` as a member (so you can use the CLI from your normal terminal session).
5. On the new team's authentication settings, link GitHub as `performinterp` user.
6. Verify Vercel GitHub App is installed on `performinterp` GH org (already true as of 2026-04-25 — confirm).

### Phase 2 — Cleanup (delete stale projects, no live impact, ~10 min)
1. Decide on `pi-os` and `pi-os-preview` — if not in use, delete from old team (don't bother moving).
2. Decide on `pi-events-pitch` — if it was a one-off pitch deck, delete.
3. Decide on `sonic-sanctuary-site` vs `ss-os` — only one should hold thesonicsanctuary.uk; delete the other or remove the duplicate domain.

### Phase 3 — Move non-domain PI projects (low risk, ~15 min)
1. `pi-events-guide` (no custom domain attached) → transfer to PI team
2. After move, run a fresh deploy from the new team to verify it builds. If env vars didn't migrate, re-add them.

### Phase 4 — Move PI projects with subdomains (~30 min, plan for ~5 min DNS each)
4. `pi-projects-site` → transfer → re-add env vars → re-attach `projects.performanceinterpreting.co.uk` domain → verify DNS (CNAME on Cloudflare/wherever DNS is hosted).
5. `pi-os-staff` → same flow → re-attach `os.performanceinterpreting.co.uk`.

### Phase 5 — Move pi-website (highest risk, ~30 min, do last)
6. **Take a snapshot** — note all env vars on `pi-website` (RESEND_API_KEY at minimum), all domains, current deployment URL.
7. Transfer `pi-website` to PI team.
8. Re-add env vars on the new team's project settings.
9. Re-attach `performanceinterpreting.co.uk` and `www.performanceinterpreting.co.uk`. Domain re-verification may require DNS revalidation — keep DNS provider tab open.
10. Trigger a fresh production deploy.
11. Test the live site: home page loads, contact form submits and routes to enquiries@.
12. Connect Git from the new team's project settings (`vercel git connect` should now work cleanly because the new team's user has `performinterp` GH linked).
13. Test auto-deploy with a no-op commit.

### Phase 6 — Move Sonic Sanctuary (separate decision)
- Consider if SS gets its own Vercel account (`admin@thesonicsanctuary.uk`) or just its own team under PI account. Either is fine — depends on whether you want billing separate.

### Phase 7 — Rename old team
- Rename `tailored-tools-projects` → `tailored-tools`. Cosmetic, no impact.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| **performanceinterpreting.co.uk goes down mid-transfer** | Do this last when you have ~30 min of focused time. Keep DNS dashboard open. Worst case: re-add domain to old team if the new team won't verify. |
| **Env vars don't migrate on transfer** | Take screenshots / `vercel env ls` beforehand. Re-add manually. RESEND_API_KEY is the critical one for `pi-website`. |
| **GitHub Git integration on the new team isn't auto-linked after transfer** | Expected — connect manually after each move. This is what we wanted anyway. |
| **Cross-account transfers might require Vercel support** | Vercel docs say transfers between teams need both as members of source team. If admin@... can't be added as member of `tailored-tools-projects`, fallback: do the moves while logged into Gmail account, with admin@... as recipient team after inviting jamesredwards89 to the new PI team as admin. |
| **Plan tier limits** | Don't upgrade until you know what you need. Hobby is fine for static + low-traffic sites. |

## Rollback plan

If anything goes wrong on `pi-website` specifically:
1. The repo on disk still has working code — the source of truth is unaffected.
2. If domain breaks on the new team, remove it from new team and re-add to old team (will revalidate within 1–10 min).
3. The pre-reorg deploy URL (`pi-website-sooty.vercel.app`) on the old team will still work as a fallback.
4. Worst case: transfer back. Vercel transfers are reversible.

## Files to touch in repo

None — this is all Vercel dashboard work. The repo only changes if `.vercel/project.json` needs regenerating (it does, after a transfer — run `vercel link` and pick the new team/project).

## Success criteria

- All 7 PI projects sit under the new PI team
- `performanceinterpreting.co.uk` serves correctly with no certificate / DNS issues
- A `git push origin main` to `pi-website` triggers an auto-deploy
- Contact form on the live site still works (test submission lands at `enquiries@`)
- Old `tailored-tools-projects` team contains only TT + personal projects
