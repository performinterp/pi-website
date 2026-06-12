import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/page-hero";
import ContactCta from "@/components/contact-cta";
import AnimateIn from "@/components/animate-in";

const SITE = "https://performanceinterpreting.co.uk";

export const metadata: Metadata = {
  title: "PI Events App - Press Kit | Performance Interpreting",
  description:
    "Press resources for the PI Events App - a free iOS and Android app helping Deaf and hard of hearing audiences find and access BSL/ISL interpreted live events across the UK and Ireland. Logos, screenshots, demo videos, founder bio and ready-to-use quotes.",
  alternates: { canonical: `${SITE}/press/pi-events-app/` },
  openGraph: {
    title: "PI Events App - Press Kit",
    description:
      "Logos, screenshots, demo videos, founder bio and ready-to-use quotes. Free for journalists.",
    url: `${SITE}/press/pi-events-app/`,
    type: "website",
  },
};

type Demo = {
  feature: string;
  caption: string;
  cardMp4: string;
};

const demos: Demo[] = [
  {
    feature: "Browse interpreted events",
    caption:
      "Every PI-delivered BSL and ISL event in the UK and Ireland in one place. Filter by category - concerts, sports, festivals, theatre, comedy, family, pride and more.",
    cardMp4: "/press-kit/mp4/pi-events-browse-card.mp4",
  },
  {
    feature: "Smart search",
    caption:
      "Type-ahead search across events, venues and categories. Fuzzy matching catches typos and finds what users are looking for in seconds.",
    cardMp4: "/press-kit/mp4/pi-events-search-card.mp4",
  },
  {
    feature: "Request an interpreter",
    caption:
      "If an event has no interpreter booked, users submit a request directly through the app. PI then liaises with the organiser. Every confirmed event is staffed by an NRCPD-registered interpreter from PI's vetted network.",
    cardMp4: "/press-kit/mp4/pi-events-request-card.mp4",
  },
  {
    feature: "Know your rights",
    caption:
      "Plain-English guide to the Equality Act 2010 (England, Scotland, Wales), the DDA 1995 (Northern Ireland) and the Irish Equal Status Acts. Each section opens with a signed video.",
    cardMp4: "/press-kit/mp4/pi-events-rights-card.mp4",
  },
  {
    feature: "Communication Tool Kit",
    caption:
      "For the moments when there isn't an interpreter. Pre-made cards to show staff - I am Deaf, Emergency, Order, Speech to Text - tap to display full screen. Plus a live speech-to-text mode for quick conversations.",
    cardMp4: "/press-kit/mp4/pi-events-toolkit-card.mp4",
  },
  {
    feature: "BSL & ISL videos on every screen",
    caption:
      "The app is BSL & ISL first by design. Every major section has a signed video walkthrough in BSL or ISL - not subtitles, the actual primary content. Marie Pascall signs the guidance herself.",
    cardMp4: "/press-kit/mp4/pi-events-videos-card.mp4",
  },
  {
    feature: "Push notifications",
    caption:
      "Get told when new interpreted events are added near you, or for the artists and venues you follow. Late ticket releases surface through here too.",
    cardMp4: "/press-kit/mp4/pi-events-notifications-card.mp4",
  },
];

const facts: { k: string; v: string }[] = [
  { k: "Product", v: "PI Events App" },
  { k: "Audience", v: "Deaf and hard of hearing audiences in the UK and Ireland" },
  { k: "Cost", v: "Free for end users on iOS and Android" },
  { k: "Coverage", v: "Every PI-delivered BSL and ISL event nationwide - each one staffed by NRCPD-registered interpreters, many of them PI Academy graduates" },
  { k: "Built by", v: "Performance Interpreting - the company already delivering BSL at 600+ live events a year" },
  { k: "Languages", v: "British Sign Language (BSL) and Irish Sign Language (ISL)" },
  { k: "Notable feature", v: "BSL & ISL first onboarding plus an in-app Communication Tool Kit for moments when an interpreter is not present" },
  { k: "Founder", v: "Marie Pascall, born with unilateral deafness, NRCPD-registered" },
];

const quotes: { line: string; attribution: string; attributionLink?: { text: string; href: string } }[] = [
  {
    line: "Performance Interpreting already delivers BSL at the biggest events in the country. The app solves a different problem - Deaf audiences could not find out which events had access in the first place, and the access they could find was scattered across organiser sites, ticketing platforms and accessibility teams that did not talk to each other. We built it because the gap was there and no one else was going to.",
    attribution: "Marie Pascall, Founder, Performance Interpreting",
  },
  {
    line: "The brief was to empower the user at every stage of the event they are enjoying. Before - you give the app the event details, AI drafts the access request email for you, the venue's address is autofilled, and you send it with the tap of a few buttons. No more wondering what to write or who to send it to. At the event - communication cards and live speech-to-text so a Deaf attendee can engage with bar staff or security without having to use their voice. After - feedback in sign language or by form, the choice always there. Designed to work offline at venues where the wifi gives up, BSL & ISL first by default, and built to disappear once you have got what you need. Every engineering decision came from those constraints.",
    attribution: "James Edwards, Tailored Tools",
    attributionLink: { text: "Tailored Tools", href: "https://tailored-tools.com" },
  },
  {
    line: "Every card in the Tool Kit started with a real story - what went wrong at a gig, what got missed at the bar, what was unclear during a safety announcement. We spent the development process pulling those stories out of the Deaf community so the app's accessibility decisions are built on lived experience, not assumed from the outside. The next person does not have to go through what we have already been through.",
    attribution: "Daryl Jackson, Deaf Consultant",
  },
];

function renderAttribution(q: (typeof quotes)[number]) {
  if (!q.attributionLink) return q.attribution;
  const { text, href } = q.attributionLink;
  const idx = q.attribution.indexOf(text);
  if (idx === -1) return q.attribution;
  return (
    <>
      {q.attribution.slice(0, idx)}
      <a
        href={href}
        target="_blank"
        rel="external noopener"
        className="text-pi-accent underline underline-offset-4 hover:no-underline"
      >
        {text}
      </a>
      {q.attribution.slice(idx + text.length)}
    </>
  );
}

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
        subtitle="Everything journalists need to cover the app. Logos, screenshots, demo videos, ready-to-use quotes and direct contact."
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
                The PI Events App is a free iOS and Android app that helps Deaf and hard of hearing audiences find every confirmed PI-delivered BSL and ISL interpreted live event in the UK and Ireland, request access at events that do not yet have it, and use a set of communication tools on the day - from a food and drink order builder to live speech-to-text. Every event in the app is staffed by NRCPD-registered interpreters - many of them PI Academy graduates - so audiences know the quality bar before they book. It is built by Performance Interpreting, the company that already delivers BSL at over 600 live events a year for clients including Arsenal, Wembley Stadium, Live Nation and the BBC. The app is BSL & ISL first by design: every screen has a signed video, and the onboarding flow lets users choose their preferred language before any English appears.
              </p>
              <p className="mt-4 text-sm font-semibold text-pi-ink/80">
                Get the app:{" "}
                <a href="https://apps.apple.com/gb/app/pi-events/id6760933712" target="_blank" rel="external noopener" className="text-pi-accent underline underline-offset-4 hover:no-underline">App Store</a>{" "}·{" "}
                <a href="https://play.google.com/store/apps/details?id=uk.co.performanceinterpreting.app" target="_blank" rel="external noopener" className="text-pi-accent underline underline-offset-4 hover:no-underline">Google Play</a>{" "}·{" "}
                smart link for print: <span className="font-normal">performanceinterpreting.co.uk/get-app</span>
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
                It is free, it is BSL & ISL first, and it was peer-recommended at DeafExpo 2026 before any paid marketing went out - which is the test that mattered most.
              </p>
            </div>
          </AnimateIn>

          {/* Quality assurance */}
          <AnimateIn>
            <div className="mt-14 rounded-2xl border-2 border-pi-accent/30 bg-pi-cream/40 p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark mb-2">
                What makes this different from a generic listings app
              </p>
              <h2 className="font-display text-2xl font-bold text-pi-ink mb-3">Every event in the app is quality-assured</h2>
              <div className="space-y-3 text-pi-ink/75 leading-relaxed">
                <p>
                  The app only shows events that PI itself is delivering. That means every interpreter in the listing is NRCPD-registered, has been briefed by PI for the specific show, and meets the same professional bar PI applies at Wembley, Arsenal and the BBC.
                </p>
                <p>
                  Many of those interpreters trained or are training through PI Academy, the in-house training arm. The result is a continuous quality loop - new interpreters come up through PI Academy, get experience on PI-delivered events, and the audience sees the standard in the app.
                </p>
                <p>
                  For events PI does not deliver, the Request an Interpreter feature is how audiences ask for access - and how venues hear from their Deaf audience directly.
                </p>
              </div>
            </div>
          </AnimateIn>

          {/* Demo videos */}
          <AnimateIn>
            <h2 className="font-display text-2xl font-bold text-pi-ink mt-14 mb-2">Demo videos</h2>
            <p className="text-sm text-pi-ink/65 mb-6">
              Silent autoplay - no audio, no controls, embed anywhere. Each demo is downloadable as a captioned MP4 feature card, ready to drop into a piece. Raw screen captures and GIF versions are in the full press kit zip. All assets are press-cleared - use freely with attribution to Performance Interpreting.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {demos.map((d) => (
                <div key={d.feature} className="flex flex-col rounded-2xl border border-pi-ink/10 bg-white p-5">
                  <div className="rounded-xl overflow-hidden bg-pi-navy/5">
                    <video
                      src={d.cardMp4}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      aria-label={`PI Events App - ${d.feature}`}
                      className="w-full h-auto block"
                    />
                  </div>
                  <div className="flex-1 flex flex-col pt-4">
                    <h3 className="font-display text-xl font-bold text-pi-ink mb-2">{d.feature}</h3>
                    <p className="text-base text-pi-ink/75 leading-relaxed mb-4 flex-1">{d.caption}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold pt-2 border-t border-pi-ink/10">
                      <a href={d.cardMp4} download className="text-pi-accent hover:underline">↓ Download MP4</a>
                    </div>
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
                  <footer className="mt-3 text-sm font-semibold text-pi-ink">— {renderAttribution(q)}</footer>
                </blockquote>
              ))}
            </div>
          </AnimateIn>

          {/* Founder */}
          <AnimateIn>
            <h2 className="font-display text-2xl font-bold text-pi-ink mt-14 mb-4">Founder bio - Marie Pascall</h2>
            <div className="mb-6 max-w-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/press-kit/photos/marie-pascall-signing.jpg"
                alt="Marie Pascall signing BSL at a Performance Interpreting festival access point"
                loading="lazy"
                className="w-full h-auto rounded-2xl ring-1 ring-pi-ink/10"
              />
              <p className="mt-2 text-xs text-pi-ink/55">
                Marie Pascall at a PI festival access point. Press-cleared.{" "}
                <a href="/press-kit/photos/marie-pascall-signing.jpg" download className="text-pi-accent hover:underline">↓ Download</a>
              </p>
            </div>
            <div className="space-y-4 text-pi-ink/75 leading-relaxed">
              <p>
                Marie Pascall is the founder of Performance Interpreting, born with unilateral deafness. PI was inducted into Signature&apos;s Hall of Fame - the highest recognition in the BSL interpreting industry - and gave key evidence in the landmark Little Mix BSL case, which established BSL access at live events as a legal requirement under the Equality Act 2010.
              </p>
              <p>
                Marie has been profiled previously in The Limping Chicken, including coverage of <a href="https://limpingchicken.com/2022/06/24/signsong-performer-fletch-and-marie-pascall-of-performance-interpreting-tell-us-about-their-uk-stadium-tour-with-ed-sheeran/" target="_blank" rel="external noopener noreferrer" className="text-pi-accent underline underline-offset-4 hover:no-underline">PI&apos;s first stadium tour with a Deaf performer</a>{" "}on Ed Sheeran&apos;s Mathematics shows.
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
                  Logos, screenshots, all demo videos (MP4 + GIF feature cards), plain-text fact sheet.
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
            <p className="text-sm text-pi-ink/65 mb-6">High-resolution PNGs (1180 × 2708), press-cleared. Click to view full size, or right-click to save.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 items-start">
              {[
                { src: "/press-kit/screenshots/app-browse.png", alt: "Browse interpreted events by category" },
                { src: "/press-kit/screenshots/app-search.png", alt: "Smart search across events and venues" },
                { src: "/press-kit/screenshots/app-request.png", alt: "Request an interpreter for an event" },
                { src: "/press-kit/screenshots/app-toolkit.png", alt: "Communication Tool Kit" },
                { src: "/press-kit/screenshots/app-my-order.png", alt: "My Order summary card to show bar staff - lemonade, water, beef burger, nachos" },
                { src: "/press-kit/screenshots/app-videos.png", alt: "BSL and ISL signed video walkthroughs" },
              ].map((s) => (
                <a
                  key={s.src}
                  href={s.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-2xl bg-white shadow-sm shadow-pi-navy/5 ring-1 ring-pi-ink/10 transition-shadow hover:shadow-md hover:shadow-pi-navy/10"
                  style={{ aspectRatio: "886 / 1890" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.src} alt={s.alt} loading="lazy" className="w-full h-full block rounded-2xl" />
                </a>
              ))}
            </div>
          </AnimateIn>

          {/* Boilerplate */}
          <AnimateIn>
            <h2 className="font-display text-2xl font-bold text-pi-ink mt-14 mb-4">About Performance Interpreting</h2>
            <p className="text-pi-ink/75 leading-relaxed">
              Performance Interpreting is the UK and Ireland&apos;s leading provider of BSL and ISL access at live events. Founded by Marie Pascall and inducted into Signature&apos;s Hall of Fame, PI delivers over 600 events a year across festivals, arenas, stadiums and Royal occasions, for clients including Arsenal, The O2, Wembley Stadium, Royal Albert Hall, Live Nation, Festival Republic, BBC, UEFA and the NFL. Every PI interpreter is NRCPD-registered, with many trained through PI Academy, the in-house training arm. The PI Events App is a free consumer app and the front end of that pipeline - equal access for Deaf audiences at every live event. The app was designed and developed in partnership with <a href="https://tailored-tools.com" target="_blank" rel="external noopener" className="text-pi-accent underline underline-offset-4 hover:no-underline">Tailored Tools</a>.
            </p>
          </AnimateIn>

          {/* Press contact */}
          <AnimateIn>
            <div className="mt-14 rounded-2xl border-2 border-pi-accent/30 bg-pi-cream/40 p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark mb-2">Press contact</p>
              <h2 className="font-display text-xl font-bold text-pi-ink mb-3">Interview, additional material, fact-check</h2>
              <p className="text-pi-ink/75 leading-relaxed mb-4">
                For an interview with Marie Pascall, additional assets, fact-checking, or anything not covered here, use the <Link href="/contact?enquiry_type=press" className="text-pi-accent underline underline-offset-4 hover:no-underline">press contact form</Link>. We aim to respond same-day to deadline-led requests.
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
