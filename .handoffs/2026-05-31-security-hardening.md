---
type: handoff
project: pi-website (main PI)
status: ready for execution
authored: 2026-05-31
master_plan: /Users/james/Projects/Performance-Interpreting/docs/security/2026-05-31-security-hardening-plan.md
---

# Security hardening — pi-website

## Read this first

**The full plan covering BOTH sites is here:**
`/Users/james/Projects/Performance-Interpreting/docs/security/2026-05-31-security-hardening-plan.md`

Read it end-to-end before starting. The work for this repo is **Part A** of that
document (plus cross-cutting items in **Part C**).

## TL;DR for this repo

Seven commits, in this order:

1. **A-C1** — `fix(deps): npm audit fix` — patch uuid/svix/resend CVEs
2. **A-H3 + A-H4 + A-M2 (server)** — Zod validation + URL allowlist + honeypot acceptance on every API route
3. **A-M2 (client)** — Honeypot field on `/contact/` form
4. **A-M1** — Origin check on every POST API route
5. **A-H2** — Security headers (CSP, X-Frame-Options, Permissions-Policy, etc.) — **test extensively before pushing, CSP can break the site**
6. **A-H1** — Rate limit `/api/chat`, `/api/contact`, `/api/chat-handoff` via Upstash Redis — **requires Upstash signup first**
7. **A-M3** — Enable Vercel Firewall managed ruleset (dashboard UI, not git)

Estimated total: **4–6 hours**.

## Critical preflight

```bash
# 1. Right GitHub account
gh auth status
gh auth switch -u performinterp  # if not already

# 2. Clean working tree on main
cd /Users/james/Projects/Performance-Interpreting/pi-website
git checkout main && git pull

# 3. Local build PASSES before you start (anything failing later is your change)
npx next build
```

## API surface inventory (audited 2026-05-31)

- `/api/contact` — Resend email enquiries
- `/api/chat` — Anthropic AI chatbot — **expensive, no rate limit, financial DoS risk**
- `/api/chat-handoff` — Chat → human handoff email
- `/api/video-feedback` — Notify admin of video uploads — **embeds user URL in HTML email, phishing vector**

## Verification checklist (don't skip)

See **Part D — Final checklist** in the master plan for the full per-finding
verification list. Don't declare done until every box is ticked.
