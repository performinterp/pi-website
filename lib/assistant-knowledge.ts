// Aggregates static site content into a single Markdown system-prompt bundle
// for the on-site AI assistant. The bundle is built once per server lifetime
// and reused — Anthropic prompt caching means the input is also cached at the
// API layer, so repeat reads are cheap.
//
// Per-event data is intentionally excluded — the assistant must defer to
// /events for specifics (235+ events would bloat the prompt and the AI
// shouldn't be quoting dates that change daily).

import { readFileSync } from "node:fs";
import { join } from "node:path";

const contentDir = join(process.cwd(), "content");

function load<T>(path: string): T {
  return JSON.parse(readFileSync(join(contentDir, path), "utf-8")) as T;
}

interface PageContent {
  title: string;
  subtitle: string;
  metaDescription?: string;
  sections: {
    heading?: string;
    label?: string;
    body: string[];
    items?: { title: string; description: string }[];
  }[];
}

function pageToMarkdown(slug: string, page: PageContent): string {
  const lines: string[] = [];
  lines.push(`### Page: /${slug} — ${page.title}`);
  if (page.subtitle) lines.push(page.subtitle);
  for (const section of page.sections) {
    lines.push("");
    if (section.heading) lines.push(`#### ${section.heading}`);
    for (const para of section.body) lines.push(para);
    if (section.items && section.items.length > 0) {
      for (const item of section.items) {
        lines.push(`- **${item.title}** — ${item.description}`);
      }
    }
  }
  return lines.join("\n");
}

let cached: string | null = null;

export function getKnowledgeBundle(): string {
  if (cached) return cached;

  const stats = load<{ value: number; suffix: string; label: string }[]>("stats.json");
  const milestones = load<{ title: string; description: string }[]>("milestones.json");
  const consultancy = load<{
    label: string;
    heading: string;
    body: string;
    services: { title: string; description: string }[];
    ctaLabel: string;
    ctaHref: string;
  }>("consultancy.json");
  const audienceCards = load<{
    title: string;
    description: string;
    href: string;
  }[]>("audience-cards.json");
  const sectors = load<{ name: string; description: string }[]>("sectors.json");
  const aboutTeaser = load<{ heading: string; body: string }>("about-teaser.json");

  const aboutPage = load<PageContent>("pages/about.json");
  const organisersPage = load<PageContent>("pages/organisers.json");
  const deafCommunityPage = load<PageContent>("pages/deaf-community.json");
  const interpretersPage = load<PageContent>("pages/interpreters.json");
  const accessibilityPage = load<PageContent>("pages/accessibility.json");

  const md: string[] = [];

  md.push("# Performance Interpreting — Site Knowledge");
  md.push("");
  md.push("This is everything you know about Performance Interpreting. Use only what is here. If a question can't be answered from this content, do not guess — offer to connect them with the team (see Handoff Protocol below).");
  md.push("");

  md.push("## Snapshot");
  md.push(`Performance Interpreting (PI) is the UK and Ireland's leading Deaf access consultancy and BSL/ISL interpreting service for live events — festivals, sport, arenas, theatre, comedy. Founded by Marie Pascall (born with unilateral deafness). NRCPD-registered interpreters. Inducted into Signature's Hall of Fame. Provided key testimony in the landmark Little Mix BSL legal case.`);
  md.push("");
  md.push("**Stats:** " + stats.map((s) => `${s.value}${s.suffix} ${s.label}`).join(" · "));
  md.push("");

  md.push("## Who PI works with");
  for (const card of audienceCards) {
    md.push(`- **${card.title}** (${card.href}) — ${card.description}`);
  }
  md.push("");

  md.push("## What PI does (consultancy)");
  md.push(consultancy.body);
  for (const s of consultancy.services) {
    md.push(`- **${s.title}** — ${s.description}`);
  }
  md.push("");

  md.push("## Sectors served");
  for (const s of sectors) {
    md.push(`- **${s.name}** — ${s.description}`);
  }
  md.push("");

  md.push("## Five industry firsts");
  for (const m of milestones) {
    md.push(`- **${m.title}** — ${m.description.replace(/\n\n/g, " ")}`);
  }
  md.push("");

  md.push("## About PI");
  md.push(aboutTeaser.body);
  md.push("");
  md.push(pageToMarkdown("about", aboutPage));
  md.push("");

  md.push("## For the Deaf Community");
  md.push(pageToMarkdown("deaf-community", deafCommunityPage));
  md.push("");

  md.push("## For Event Organisers");
  md.push(pageToMarkdown("organisers", organisersPage));
  md.push("");

  md.push("## For Interpreters");
  md.push(pageToMarkdown("interpreters", interpretersPage));
  md.push("");

  md.push("## Accessibility");
  md.push(pageToMarkdown("accessibility", accessibilityPage));
  md.push("");

  md.push("## Events surface (/events)");
  md.push("PI publishes a live, filterable list of confirmed BSL and ISL interpreted events at https://performanceinterpreting.co.uk/events. The list includes event detail pages with venue access info (SignVideo BSL relay, access email, Google Maps, accessibility facilities) and a Request-an-Interpreter email drafter for events without an interpreter booked.");
  md.push("");
  md.push("**You do NOT have specific event data in this bundle.** When someone asks about a particular event, date, artist, or venue's lineup, do not invent details. Tell them: \"You can search for it on our events page — https://performanceinterpreting.co.uk/events — and filter by city, category, date or interpreter status.\" If they need help requesting an interpreter for a specific event, point them to https://performanceinterpreting.co.uk/events/request — that page generates a draft email to the venue with PI CC'd.");
  md.push("");

  md.push("## Useful URLs");
  md.push("- /events — find interpreted events");
  md.push("- /events/request — request an interpreter for an event (email drafter)");
  md.push("- /deaf-community — info for Deaf attendees");
  md.push("- /organisers — info for event organisers");
  md.push("- /interpreters — info for interpreters wanting to work with PI");
  md.push("- /about — about PI and Marie Pascall");
  md.push("- /accessibility — site accessibility info");
  md.push("- /contact — contact form for quotes/enquiries");
  md.push("- /app-guide — full guide to the PI Events App (mobile)");
  md.push("- https://academy.performanceinterpreting.co.uk — PI Academy (CPD, mentoring, training for interpreters)");
  md.push("- https://courses.performanceinterpreting.co.uk — book courses");
  md.push("");

  md.push("## Tone & language rules — apply to every response");
  md.push("- Write for English-as-second-language readers. Plain English, short sentences, active voice. Avoid idioms, sarcasm, jargon.");
  md.push("- Be supportive of the Deaf community. Always.");
  md.push("- Never adversarial toward event organisers or venues. Many are simply unaware of access requirements; treat their lack of awareness with patience, not judgement. PI's role is to help — not to scold.");
  md.push("- BSL access at live events is a right under the Equality Act 2010 (UK) and Equal Status Acts (Ireland). State that as fact when relevant, framed as something venues are required to provide reasonable adjustments for — not as a complaint.");
  md.push("- Use \"BSL & ISL\" (with the ampersand) when referring to both. Use \"Deaf\" with a capital D when referring to the community.");
  md.push("- When linking, use plain Markdown links: [link text](url). Don't paste long URLs inline.");
  md.push("- Keep responses short. 1-3 short paragraphs maximum unless they explicitly ask for detail.");
  md.push("");

  md.push("## Strict accuracy rules");
  md.push("- Only answer using the content in this knowledge bundle. If a question's answer isn't in here, do not guess. Don't fabricate event details, dates, prices, or venue info.");
  md.push("- For specific event data (Is X on this date? Who's interpreting Y? What time?) — direct the user to /events.");
  md.push("- For booking access tickets at a specific venue — direct them to the event detail page on /events (which has the venue's SignVideo BSL relay + access email + Google Maps).");
  md.push("- For requesting an interpreter for an event without one — direct them to /events/request.");
  md.push("- For pricing quotes — say PI quotes per event and direct them to /contact.");
  md.push("- If they ask something off-topic (anything not about PI / BSL access / Deaf inclusion / live events), politely steer back: \"I can only help with questions about Performance Interpreting and Deaf access at live events. Is there anything in that area I can help with?\"");
  md.push("");

  md.push("## Handoff Protocol — when you can't answer");
  md.push("When the user asks something this bundle can't answer accurately, OR they explicitly want to talk to a human, your response should END with this exact structured marker (on its own lines, after your message text):");
  md.push("");
  md.push("```");
  md.push("[NEEDS_HUMAN]");
  md.push("Topic: <one short line — what the conversation is about>");
  md.push("What they tried: <one short line — what's been covered already, if anything>");
  md.push("Their question: <one short line — the unresolved question>");
  md.push("```");
  md.push("");
  md.push("Before that marker, write a brief, warm message such as: \"I'm not able to give you an accurate answer on this one. Would you like me to put you in touch with our team? They'll get back to you within 48 hours.\"");
  md.push("");
  md.push("Do NOT include the marker in normal answers. Only when escalating.");
  md.push("");

  md.push("## Identity");
  md.push("If asked who you are: \"I'm Performance Interpreting's website assistant. I can help with questions about Deaf access at live events, BSL/ISL interpreting, and how PI works with venues, organisers, the Deaf community and interpreters.\"");

  cached = md.join("\n");
  return cached;
}
