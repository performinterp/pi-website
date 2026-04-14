# PI Website — Editing Guide

## Getting started

Open the project in VS Code:
```bash
code /Users/james/Projects/Performance-Interpreting/pi-website
```

Run locally:
```bash
npm run dev
```
Then open http://localhost:3000 in your browser.

---

## Pages

| URL | File |
|-----|------|
| `/` (homepage) | `app/page.tsx` |
| `/about` | `app/about/page.tsx` |
| `/organisers` | `app/organisers/page.tsx` |
| `/deaf-community` | `app/deaf-community/page.tsx` |
| `/interpreters` | `app/interpreters/page.tsx` |
| `/accessibility` | `app/accessibility/page.tsx` |
| `/contact` | `app/contact/page.tsx` |
| `/privacy` | `app/privacy/page.tsx` |

---

## Content files (JSON) — start here for text changes

No code knowledge needed. All copy, numbers, and links live here.

| What it controls | File |
|-----------------|------|
| Homepage hero (tagline, subtitle, CTAs) | `content/hero.json` |
| Nav links, footer links, social links | `content/navigation.json` |
| Stats counters (500+, 27+, etc.) | `content/stats.json` |
| Testimonials | `content/testimonials.json` |
| Client logos list | `content/clients.json` |
| Sectors served | `content/sectors.json` |
| Timeline/milestones | `content/milestones.json` |
| Homepage about teaser | `content/about-teaser.json` |
| Audience cards (homepage) | `content/audience-cards.json` |
| Consultancy section | `content/consultancy.json` |
| "Get in touch" CTA band | `content/contact-cta.json` |
| All About page copy | `content/pages/about.json` |
| All Organisers page copy | `content/pages/organisers.json` |
| All Deaf Community page copy | `content/pages/deaf-community.json` |
| All Interpreters page copy | `content/pages/interpreters.json` |
| Accessibility page | `content/pages/accessibility.json` |
| Contact page | `content/pages/contact.json` |
| Privacy policy | `content/pages/privacy.json` |

**Rule of thumb: if it's text on the site, it's in one of these JSON files.**

---

## Components

Only touch these if you're changing layout or behaviour (not just copy).

| Component | What it is |
|-----------|-----------|
| `components/nav.tsx` / `nav-client.tsx` / `mobile-nav.tsx` | Site navigation |
| `components/footer.tsx` | Footer |
| `components/page-hero.tsx` | Hero banner on inner pages |
| `components/animated-counter.tsx` | Counting stats |
| `components/logo-ticker.tsx` | Scrolling client logos strip |
| `components/testimonial-quote.tsx` | Individual testimonial card |
| `components/contact-form.tsx` / `contact-cta.tsx` | Contact form + CTA band |
| `components/app-screenshot-carousel.tsx` | Events app screenshots |
| `components/app-store-buttons.tsx` | App Store / Google Play buttons |
| `components/video-feedback.tsx` | Video feedback feature |
| `components/cookie-banner.tsx` | Cookie consent |
| `components/animate-in.tsx` | Scroll-in animation wrapper |
| `components/content-section.tsx` | Generic section layout |

---

## Images

| Folder | Contents |
|--------|---------|
| `public/images/` | Photos (concert.jpg, festival-wide.jpg, etc.) |
| `public/logos/` | Client/partner logos |
| `public/icons/` | Icons |
| `public/og-image.jpg` | Social share preview image |

To swap an image: drop the new file in the same folder with the same filename.

---

## API routes

- `app/api/contact/route.ts` — contact form submissions
- `app/api/video-feedback/route.ts` — video feedback

---

## Deploying changes

```bash
cd /Users/james/Projects/Performance-Interpreting/pi-website
git add -p          # review and stage what you changed
git commit -m "your message here"
git push            # auto-deploys to Vercel
```

To deploy everything at once (skip the review step):
```bash
git add .
git commit -m "your message"
git push
```

---

## Common tasks

### Change a stat (e.g. update "500+ events")
Edit `content/stats.json` — change the `value` number.

### Add/edit a testimonial
Edit `content/testimonials.json` — copy an existing block and update the fields.

### Update nav links
Edit `content/navigation.json` — `mainNav` for the header, `footerNav` for the footer.

### Change homepage hero text
Edit `content/hero.json`.

### Update a full page's copy
Edit the relevant file in `content/pages/` — e.g. `content/pages/about.json` for the About page.

### Add a new image
Drop it in `public/images/`, then reference it as `/images/filename.jpg` in the relevant JSON or component.
