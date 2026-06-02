import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/page-hero";
import ContactCta from "@/components/contact-cta";
import AnimateIn from "@/components/animate-in";

const SITE = "https://performanceinterpreting.co.uk";

export const metadata: Metadata = {
  title: "PI Events App - Press Kit | Performance Interpreting",
  description:
    "Press resources for the PI Events App - a free iOS and Android app helping Deaf and hard of hearing audiences find and access BSL/ISL interpreted live events across the UK and Ireland. Logos, screenshots, demo GIFs, founder bio and ready-to-use quotes.",
  alternates: { canonical: `${SITE}/press/pi-events-app/` },
  openGraph: {
    title: "PI Events App - Press Kit",
    description:
      "Logos, screenshots, demo GIFs, founder bio and ready-to-use quotes. Free for journalists.",
    url: `${SITE}/press/pi-events-app/`,
    type: "website",
  },
};

type Demo = {
  feature: string;
  caption: string;
  gif: string;
  mp4: string;
};

const demos: Demo[] = [
  {
    feature: "Browse interpreted events",
    caption:
      "Every confirmed BSL and ISL event in the UK and Ireland in one place. Filter by date, location, type and language.",
    gif: "/press-kit/gifs/pi-events-browse.gif",
    mp4: "/press-kit/mp4/pi-events-browse.mp4",
  },
  {
    feature: "Smart search",
    caption:
      "Type-ahead search across events, venues and categories. Fuzzy matching catches typos and finds the event in seconds.",
    gif: "/press-kit/gifs/pi-events-search.gif",
    mp4: "/press-kit/mp4/pi-events-search.mp4",
  },
  {
    feature: "Request an interpreter",
    caption:
      "If an event has no interpreter booked, users submit a request directly through the app. PI then liaises with the organiser.",
    gif: "/press-kit/gifs/pi-events-request.gif",
    mp4: "/press-kit/mp4/pi-events-request.mp4",
  },
  {
    feature: "Know your rights",
    caption:
      "Plain-English guide to the Equality Act 2010, the DDA 1995 and the Irish Equal Status Acts. No legal jargon.",
    gif: "/press-kit/gifs/pi-events-rights.gif",
    mp4: "/press-kit/mp4/pi-events-rights.mp4",
  },
  {
    feature: "BSL & ISL videos",
    caption:
      "Every screen has a signed video walkthrough. The app is BSL-first by design, not an afterthought.",
    gif: "/press-kit/gifs/pi-events-videos.gif",
    mp4: "/press-kit/mp4/pi-events-videos.mp4",
  },
  {
    feature: "Order food and drink",
    caption:
      "Build an order with quantities and show it to bar staff as text. No more shouting over the music.",
    gif: "/press-kit/gifs/pi-events-order.gif",
    mp4: "/press-kit/mp4/pi-events-order.mp4",
  },
  {
    feature: "Push notifications",
    caption:
      "Get told when new interpreted events are added near you, or for the artists and venues you follow.",
    gif: "/press-kit/gifs/pi-events-notifications.gif",
    mp4: "/press-kit/mp4/pi-events-notifications.mp4",
  },
];

const facts: { k: string; v: string }[] = [
  { k: "Product", v: "PI Events App" },
  { k: "Audience", v: "Deaf and hard of hearing audiences in the UK and Ireland" },
  { k: "Cost", v: "Free for end users on iOS and Android" },
  { k: "Coverage", v: "Confirmed BSL and ISL interpreted events nationwide" },
  { k: "Built by", v: "Performance Interpreting - the company already delivering BSL at 600+ live events a year" },
  { k: "Languages", v: "British Sign Language (BSL) and Irish Sign Language (ISL)" },
  { k: "Notable feature", v: "BSL-first onboarding - signed video walkthroughs on every screen" },
  { k: "Founder", v: "Marie Pascall, born with unilateral deafness, NRCPD-registered" },
];

const quotes: { line: string; attribution: string }[] = [
  {
    line: "Performance Interpreting already delivers BSL at the biggest events in the country. The app solves a different problem - Deaf audiences could not find out which events had access in the first place. We built it because the gap was there and no one else was going to.",
    attribution: "Marie Pascall, Founder",
  },
  {
    line: "It is BSL-first, not BSL-bolt-on. Every screen has a signed video. The app speaks to its audience in their first language - the same standard we hold organisers to.",
    attribution: "Marie Pascall, Founder",
  },
  {
    line: "We did not market this app. It travelled by word of mouth at DeafExpo and through interpreters and audiences who picked it up at gigs. The community decided whether it was useful, and the answer was yes.",
    attribution: "James Edwards, Performance Interpreting",
  },
  {
    line: "Following the landmark Little Mix case, BSL access at live events is a legal right under the Equality Act 2010. The Request an Interpreter feature exists so any audience member can use that right in three taps.",
    attribution: "Performance Interpreting",
  },
];

export default function PiEventsAppPressKitPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Press", item: `${SITE}/press/` },
              { "@type": "ListItem", position: 3, name: "PI Events App", item: `${SITE}/press/pi-events-app/` },
            ],
          }),
        }}
      />

      <PageHero
        title="PI Events App - Press Kit"
        subtitle="Everything journalists need to cover the app. Logos, screenshots, demo GIFs, ready-to-use quotes and direct contact."
        backgroundImage="/images/concert.jpg"
      />

      <section className="section-padding section-gap">
        <div className="mx-auto max-w-4xl">
          {/* The pitch in one paragraph */}
          <AnimateIn>
            <div className="rounded-2xl border border-pi-ink/10 bg-pi-cream/40 p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark mb-3">
                The pitch in one paragraph
              </p>
              <p className="text-lg leading-relaxed text-pi-ink/80">
                The PI Events App is a free iOS and Android app that helps Deaf and hard of hearing audiences find every confirmed PI-delivered BSL and ISL interpreted live event in the UK and Ireland, request access at events that do not yet have it, and use a set of communication tools on the day - from a food and drink order builder to live speech-to-text. Every event in the app is staffed by NRCPD-registered interpreters - many of them PI Academy graduates - so audiences know the quality bar before they book. It is built by Performance Interpreting, the company that already delivers BSL at over 600 live events a year for clients including Arsenal, Wembley Stadium, Live Nation and the BBC. The app is BSL-first by design: every screen has a signed video, and the onboarding flow lets users choose their preferred language before any English appears.
              </p>
            </div>
          </AnimateIn>

          {/* At a glance */}
          <AnimateIn>
            <h2 className="font-display text-2xl font-bold text-pi-ink mt-14 mb-6">At a glance</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {facts.map((f) => (
                <div key={f.k} className="border-b border-pi-ink/10 pb-3">
                  <dt className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark mb-1">{f.k}</dt>
                  <dd className="text-pi-ink/80">{f.v}</dd>
                </div>
              ))}
            </dl>
          </AnimateIn>

          {/* Why it matters */}
          <AnimateIn>
            <h2 className="font-display text-2xl font-bold text-pi-ink mt-14 mb-4">Why the app exists</h2>
            <div className="space-y-4 text-pi-ink/75 leading-relaxed">
              <p>
                Performance Interpreting was founded by Marie Pascall, who was born with unilateral deafness. For over a decade PI has been the company organisers call when they want BSL access done properly - across the Live Nation and Festival Republic portfolios, at Royal events and state ceremonies, and through the partnership with Wembley Stadium that made BSL interpreting the default at every concert at the national stadium.
              </p>
              <p>
                Through all of that, one problem kept surfacing on the audience side: Deaf attendees could not find out which events had access in the first place. Information sat scattered across organiser sites, ticketing platforms and accessibility teams. The PI Events App pulls every confirmed interpreted event into one place, lets users request access where it is missing, and gives them practical tools to use on the day.
              </p>
              <p>
                It is free, it is BSL-first, and it was peer-recommended at DeafExpo 2026 before any paid marketing went out - which is the test that mattered most.
              </p>
            </div>
          </AnimateIn>

          {/* Demo GIFs */}
          <AnimateIn>
            <h2 className="font-display text-2xl font-bold text-pi-ink mt-14 mb-2">Demo GIFs</h2>
            <p className="text-sm text-pi-ink/65 mb-6">
              Right-click any GIF to save. MP4 versions linked below each GIF for higher-quality embeds. All assets are press-cleared - use freely with attribution to Performance Interpreting.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {demos.map((d) => (
                <div key={d.feature} className="rounded-2xl border border-pi-ink/10 bg-white p-5">
                  <div className="rounded-xl overflow-hidden bg-pi-navy/5 mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={d.gif}
                      alt={`PI Events App - ${d.feature}`}
                      loading="lazy"
                      className="w-full h-auto block"
                    />
                  </div>
                  <h3 className="font-display text-lg font-bold text-pi-ink mb-1">{d.feature}</h3>
                  <p className="text-sm text-pi-ink/65 leading-relaxed mb-3">{d.caption}</p>
                  <div className="flex gap-3 text-xs font-semibold">
                    <a href={d.gif} download className="text-pi-accent hover:underline">Download GIF</a>
                    <span className="text-pi-ink/30">|</span>
                    <a href={d.mp4} download className="text-pi-accent hover:underline">Download MP4</a>
                  </div>
                </div>
              ))}
            </div>
          </AnimateIn>

          {/* Pull quotes */}
          <AnimateIn>
            <h2 className="font-display text-2xl font-bold text-pi-ink mt-14 mb-2">Ready-to-use quotes</h2>
            <p className="text-sm text-pi-ink/65 mb-6">
              Pre-approved quotes you can drop straight into a piece. For a fresh quote or interview, use the contact below.
            </p>
            <div className="space-y-4">
              {quotes.map((q, i) => (
                <blockquote key={i} className="border-l-4 border-pi-accent bg-pi-cream/30 p-6 rounded-r-xl">
                  <p className="text-pi-ink/80 leading-relaxed italic">&ldquo;{q.line}&rdquo;</p>
                  <footer className="mt-3 text-sm font-semibold text-pi-ink">— {q.attribution}</footer>
                </blockquote>
              ))}
            </div>
          </AnimateIn>

          {/* Founder */}
          <AnimateIn>
            <h2 className="font-display text-2xl font-bold text-pi-ink mt-14 mb-4">Founder bio - Marie Pascall</h2>
            <div className="space-y-4 text-pi-ink/75 leading-relaxed">
              <p>
                Marie Pascall is the founder of Performance Interpreting, born with unilateral deafness. PI was inducted into Signature&apos;s Hall of Fame - the highest recognition in the BSL interpreting industry - and gave key evidence in the landmark Little Mix BSL case, which established BSL access at live events as a legal requirement under the Equality Act 2010.
              </p>
              <p>
                Marie has been profiled previously in The Limping Chicken, including coverage of <a href="https://limpingchicken.com/2022/06/24/signsong-performer-fletch-and-marie-pascall-of-performance-interpreting-tell-us-about-their-uk-stadium-tour-with-ed-sheeran/" target="_blank" rel="external noopener noreferrer" className="text-pi-accent underline underline-offset-4 hover:no-underline">PI&apos;s first stadium tour with a Deaf performer</a> on Ed Sheeran&apos;s Mathematics shows.
              </p>
            </div>
          </AnimateIn>

          {/* Asset downloads */}
          <AnimateIn>
            <h2 className="font-display text-2xl font-bold text-pi-ink mt-14 mb-4">Asset downloads</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href="/press-kit/pi-events-press-kit.zip"
                download
                className="group block rounded-2xl border-2 border-pi-accent bg-pi-accent/5 p-6 transition-all hover:bg-pi-accent/10"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark mb-2">
                  Recommended
                </p>
                <h3 className="font-display text-lg font-bold text-pi-ink mb-1">Full press kit (zip)</h3>
                <p className="text-sm text-pi-ink/65 leading-relaxed">
                  Logos, screenshots, all demo GIFs and MP4s, plain-text fact sheet. Around 10 MB.
                </p>
              </a>
              <a
                href="/press-kit/logos/PI-logo-landscape.png"
                download
                className="group block rounded-2xl border border-pi-ink/10 bg-white p-6 transition-all hover:border-pi-accent/30"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark mb-2">Logos</p>
                <h3 className="font-display text-lg font-bold text-pi-ink mb-1">PI brand pack</h3>
                <p className="text-sm text-pi-ink/65 leading-relaxed">
                  Landscape, square and reversed-out (white). PNG with transparency.
                </p>
              </a>
            </div>
            <p className="mt-4 text-xs text-pi-ink/55">
              Individual logos:{" "}
              <a href="/press-kit/logos/PI-logo-landscape.png" download className="text-pi-accent hover:underline">landscape</a> ·{" "}
              <a href="/press-kit/logos/PI-logo-square.png" download className="text-pi-accent hover:underline">square</a> ·{" "}
              <a href="/press-kit/logos/PI-logo-white-side.png" download className="text-pi-accent hover:underline">white (for dark backgrounds)</a>
            </p>
          </AnimateIn>

          {/* App screenshots */}
          <AnimateIn>
            <h2 className="font-display text-2xl font-bold text-pi-ink mt-14 mb-4">App screenshots</h2>
            <p className="text-sm text-pi-ink/65 mb-6">High-resolution PNGs, press-cleared.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { src: "/press-kit/screenshots/browse-categories.png", alt: "Browse interpreted events by category" },
                { src: "/press-kit/screenshots/event-detail.png", alt: "Event detail view" },
                { src: "/press-kit/screenshots/bsl-isl-videos.png", alt: "BSL and ISL video walkthroughs" },
                { src: "/press-kit/screenshots/request-interpreter.png", alt: "Request an interpreter for an event" },
                { src: "/press-kit/screenshots/know-your-rights.png", alt: "Know your rights guide" },
                { src: "/press-kit/screenshots/festival-checklist.png", alt: "Festival planning checklist" },
                { src: "/press-kit/screenshots/onboarding-language.png", alt: "BSL-first onboarding" },
                { src: "/press-kit/screenshots/support-speech-to-text.png", alt: "Live speech-to-text support" },
              ].map((s) => (
                <a key={s.src} href={s.src} download className="group block rounded-xl overflow-hidden border border-pi-ink/10 bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.src} alt={s.alt} loading="lazy" className="w-full h-auto block" />
                </a>
              ))}
            </div>
          </AnimateIn>

          {/* Boilerplate */}
          <AnimateIn>
            <h2 className="font-display text-2xl font-bold text-pi-ink mt-14 mb-4">About Performance Interpreting</h2>
            <p className="text-pi-ink/75 leading-relaxed">
              Performance Interpreting is the UK and Ireland&apos;s leading provider of BSL and ISL access at live events. Founded by Marie Pascall and inducted into Signature&apos;s Hall of Fame, PI delivers over 600 events a year across festivals, arenas, stadiums and Royal occasions, for clients including Arsenal, The O2, Wembley Stadium, Royal Albert Hall, Live Nation, Festival Republic, BBC, UEFA and the NFL. Every PI interpreter is NRCPD-registered. The PI Events App is a free consumer app launched as the next step in the same mission: equal access for Deaf audiences at every live event.
            </p>
          </AnimateIn>

          {/* Press contact */}
          <AnimateIn>
            <div className="mt-14 rounded-2xl border-2 border-pi-accent/30 bg-pi-cream/40 p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark mb-2">Press contact</p>
              <h2 className="font-display text-xl font-bold text-pi-ink mb-3">Interview, additional material, fact-check</h2>
              <p className="text-pi-ink/75 leading-relaxed mb-4">
                For an interview with Marie Pascall, additional assets, fact-checking, or anything not covered here, use the <Link href="/contact" className="text-pi-accent underline underline-offset-4 hover:no-underline">contact form</Link> and select press as your enquiry type. We aim to respond same-day.
              </p>
              <p className="text-sm text-pi-ink/65">
                Existing PI coverage at <Link href="/press" className="text-pi-accent underline underline-offset-4 hover:no-underline">performanceinterpreting.co.uk/press</Link>.
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
