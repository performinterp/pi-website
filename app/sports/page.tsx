import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/page-hero";
import ContactCta from "@/components/contact-cta";
import AnimateIn from "@/components/animate-in";
import Icon from "@/components/icon";
import MobileTestimonialsCarousel from "@/components/mobile-testimonials-carousel";
import VideoFeedback from "@/components/video-feedback";

export const metadata: Metadata = {
  title:
    "Sport Sign Language Access | BSL at Premier League, Wembley & UEFA - Performance Interpreting",
  description:
    "BSL and ISL interpretation at the UK and Ireland's biggest sporting events - Premier League clubs (Arsenal, Chelsea, Fulham, West Ham), Wembley Stadium cup finals, UEFA tournaments, England Netball, NFL UK and more. Match-day access designed, staffed and delivered end-to-end by Performance Interpreting.",
  alternates: {
    canonical: "https://performanceinterpreting.co.uk/sports/",
  },
  openGraph: {
    title: "Sport Sign Language Access - Performance Interpreting",
    description:
      "BSL and ISL interpretation at the UK and Ireland's biggest sporting events. Appointed Deaf Access provider for Wembley Stadium.",
    url: "https://performanceinterpreting.co.uk/sports/",
    type: "website",
    images: [
      { url: "/images/arsenal-pitchside.jpg", width: 1200, height: 630, alt: "BSL interpreter pitchside at a Premier League match" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sport Sign Language Access - Performance Interpreting",
    description:
      "BSL and ISL interpretation at the UK and Ireland's biggest sporting events. Appointed Deaf Access provider for Wembley Stadium.",
    images: ["/images/arsenal-pitchside.jpg"],
  },
};

const SPORT_TIERS: Array<{ heading: string; subheading: string; clients: string[] }> = [
  {
    heading: "Premier League Football",
    subheading: "Match-day BSL interpretation for Premier League clubs",
    clients: [
      "Arsenal",
      "Chelsea",
      "Fulham",
      "West Ham",
      "Additional Premier League partnerships - ask",
    ],
  },
  {
    heading: "National Stadiums & Cup Finals",
    subheading: "BSL at the venues where the biggest fixtures happen",
    clients: [
      "Wembley Stadium (appointed Deaf Access provider)",
      "Croke Park",
      "Principality Stadium",
      "FA Cup Final",
      "EFL Cup Final",
      "International friendlies",
    ],
  },
  {
    heading: "Governing Bodies & Tournaments",
    subheading: "Working with national federations and rights holders",
    clients: [
      "The FA",
      "UEFA",
      "England Netball",
      "NFL UK",
    ],
  },
  {
    heading: "Beyond Football - other sport we serve",
    subheading: "Motorsport, women's sport, broadcast and one-off fixtures",
    clients: [
      "Silverstone Grand Prix (F1 Fan Zone)",
      "Formula E - London",
      "England Netball internationals",
      "Broadcast sport coverage and post-match analysis",
      "Awards nights and end-of-season ceremonies",
    ],
  },
];

const SPORT_FAQS: Array<{ question: string; answer: string }> = [
  {
    question: "Can I get a BSL interpreter at a football match?",
    answer:
      "Yes. Performance Interpreting provides British Sign Language (BSL) interpreters at Premier League fixtures and major sporting events across the UK. We are the appointed Deaf Access provider for Wembley Stadium and work directly with clubs including Arsenal, Chelsea, Fulham and West Ham. Deaf fans can find out which matches have BSL coverage through the free PI Events App.",
  },
  {
    question: "Which Premier League clubs work with Performance Interpreting?",
    answer:
      "We work with multiple Premier League clubs including Arsenal, Chelsea, Fulham and West Ham, plus additional clubs we can't always name publicly. As the appointed Deaf Access provider for Wembley Stadium we also cover FA Cup finals, EFL Cup finals and international friendlies. Get in touch and we can confirm coverage for any specific club or fixture.",
  },
  {
    question: "How does BSL work in a sports stadium?",
    answer:
      "Sports stadium BSL is a production discipline. The interpreter needs a clear sightline from a Deaf accessible viewing area, dedicated lighting (especially for evening fixtures), and a position close to the action so PA announcements, on-pitch interviews, half-time ceremonies and player tributes can be interpreted in real time. We work with each club's operations team to design the placement and integrate with match-day logistics, security and broadcast.",
  },
  {
    question: "Is BSL at sport more than just the announcements?",
    answer:
      "Yes. Full sport BSL coverage typically includes pre-match build-up, team line-up announcements, PA messages, half-time entertainment, post-match interviews, awards ceremonies and any sponsor activations. Cup finals and international fixtures often add anthem interpretation, opening ceremonies and broadcast pieces. The depth depends on the club's access plan - we'll spec the right level for each fixture.",
  },
  {
    question: "Do you cover cup finals and international tournaments?",
    answer:
      "Yes. As the appointed Deaf Access provider for Wembley Stadium we cover FA Cup finals, EFL Cup finals, international friendlies and major fixtures. We also work with UEFA, The FA, England Netball and NFL UK on tournaments and showcase events. These often involve broadcast coverage as well as in-stadium access, and our coordinators handle both.",
  },
  {
    question: "How early should sports clubs and rights holders book interpreters?",
    answer:
      "As soon as the fixture date is confirmed. For regular Premier League and league fixtures we typically run a rolling booking with the club so a team is assigned for every relevant match. For one-off cup finals, international fixtures and tournaments, four to eight weeks ahead is typical. Tight requests are sometimes possible - we'll be honest about whether we can deliver the standard we'd want to.",
  },
  {
    question: "Do you cover women's sport and netball?",
    answer:
      "Yes. We work with England Netball on internationals and showcase fixtures, and our coverage extends to women's football, women's rugby and other women's sport on request. Equal access at women's fixtures matters just as much as at men's - we'll never under-staff a women's event compared to the men's equivalent.",
  },
  {
    question: "Is BSL provided for broadcast sport, not just live in-stadium?",
    answer:
      "Yes. We provide BSL interpreters for broadcast contexts - TV studio appearances, post-match analysis, awards shows, sponsor activations and ceremonial moments. Broadcast BSL has slightly different production constraints (camera framing, lighting, IFB earpieces, IMAG screen positioning) and we coordinate with the broadcast production team to make it work on air.",
  },
  {
    question: "Is BSL access at sport a legal requirement?",
    answer:
      "Under the Equality Act 2010, service providers including sports clubs and venues must make reasonable adjustments for Deaf and disabled fans. BSL interpretation at live events is now an established reasonable adjustment, in part because of the landmark Little Mix legal case in which Performance Interpreting testified. For Deaf season-ticket holders and matchday Deaf attendance, providing access is a recognised obligation - and increasingly an expectation from fans.",
  },
  {
    question: "Are Performance Interpreting's sport interpreters NRCPD-registered?",
    answer:
      "Yes. Every BSL interpreter we deploy is registered with the NRCPD (National Registers of Communication Professionals working with Deaf and Deafblind People). Where relevant we also work with interpreters registered with NUBSLI and SASLI (Scotland). Match-day work requires specialist sport vocabulary, comfort with high-noise environments, and the team-working pace of live broadcast - we run our own Premier League-orientated training through PI Academy.",
  },
  {
    question: "How much does BSL access at a sports event cost?",
    answer:
      "Sport access is priced as a designed access service rather than per interpreter-hour. For ongoing Premier League partnerships, pricing is structured per fixture across the season, with a typical team of two interpreters rotating during the match plus on-pitch broadcast pieces as needed. For one-off cup finals and international tournaments, quotes are tailored to the specific event - share your fixture or season with us via the quote form and we'll come back with specifics.",
  },
];

const SPORT_STATS = [
  { value: "6+", label: "Premier League clubs" },
  { value: "Wembley", label: "Appointed Deaf Access provider" },
  { value: "100+", label: "NRCPD-registered interpreters" },
  { value: "1", label: "Free app for Deaf fans" },
];

export default function SportsPage() {
  return (
    <>
      {/* ─── Service schema for AI agents and rich results ─────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": "https://performanceinterpreting.co.uk/sports/#service",
            name: "Sport Sign Language Access - BSL & ISL at UK Sporting Events",
            alternateName: [
              "Sport BSL Interpretation",
              "Sign Language Interpreter for Sport",
              "Deaf Access at Football",
              "BSL at Premier League",
              "BSL at Wembley",
              "Sign Language at Sporting Events",
              "Deaf Accessible Football",
            ],
            serviceType: "Sign Language Interpretation",
            category: "Accessibility services for live sport",
            provider: { "@id": "https://performanceinterpreting.co.uk/#organization" },
            areaServed: [
              { "@type": "Country", name: "United Kingdom" },
              { "@type": "Country", name: "Ireland" },
              { "@type": "AdministrativeArea", name: "England" },
              { "@type": "AdministrativeArea", name: "Scotland" },
              { "@type": "AdministrativeArea", name: "Wales" },
              { "@type": "AdministrativeArea", name: "Northern Ireland" },
            ],
            audience: {
              "@type": "Audience",
              audienceType: "Deaf and BSL/ISL-using sports fans, Premier League clubs, sport governing bodies, broadcast producers",
            },
            availableLanguage: [
              { "@type": "Language", name: "British Sign Language", alternateName: "BSL" },
              { "@type": "Language", name: "Irish Sign Language", alternateName: "ISL" },
              { "@type": "Language", name: "English" },
            ],
            description:
              "End-to-end sport sign language access - BSL and ISL interpretation at Premier League fixtures, Wembley Stadium, UEFA tournaments, England Netball, NFL UK and more. Designed, staffed and delivered by Performance Interpreting.",
            url: "https://performanceinterpreting.co.uk/sports/",
            image: "https://performanceinterpreting.co.uk/images/arsenal-pitchside.jpg",
            award: [
              "Appointed Deaf Access provider for Wembley Stadium",
              "BSL interpreting at every Wembley concert as standard",
              "Established the UK legal precedent for BSL access at live events (Little Mix case)",
            ],
            offers: {
              "@type": "Offer",
              url: "https://performanceinterpreting.co.uk/contact/",
              availability: "https://schema.org/InStock",
              priceCurrency: "GBP",
              priceSpecification: {
                "@type": "PriceSpecification",
                priceCurrency: "GBP",
                description:
                  "Designed access pricing - tailored per fixture or per season.",
              },
            },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Sport Sign Language Access offerings",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Premier League match-day BSL interpretation",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Wembley Stadium fixture and cup final access",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "International tournament and broadcast sport BSL",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Season-long Deaf access partnership for clubs and rights holders",
                  },
                },
              ],
            },
            mentions: [
              { "@type": "Place", name: "Wembley Stadium", sameAs: "https://en.wikipedia.org/wiki/Wembley_Stadium" },
              { "@type": "SportsOrganization", name: "Premier League", sameAs: "https://en.wikipedia.org/wiki/Premier_League" },
              { "@type": "SportsOrganization", name: "The FA", sameAs: "https://en.wikipedia.org/wiki/The_Football_Association" },
              { "@type": "SportsOrganization", name: "UEFA", sameAs: "https://en.wikipedia.org/wiki/UEFA" },
              { "@type": "SportsOrganization", name: "England Netball", sameAs: "https://en.wikipedia.org/wiki/England_Netball" },
              { "@type": "SportsOrganization", name: "Arsenal F.C.", sameAs: "https://en.wikipedia.org/wiki/Arsenal_F.C." },
              { "@type": "SportsOrganization", name: "Chelsea F.C.", sameAs: "https://en.wikipedia.org/wiki/Chelsea_F.C." },
              { "@type": "Language", name: "British Sign Language", sameAs: "https://en.wikipedia.org/wiki/British_Sign_Language" },
              { "@type": "Language", name: "Irish Sign Language", sameAs: "https://en.wikipedia.org/wiki/Irish_Sign_Language" },
              { "@type": "Legislation", name: "Equality Act 2010", sameAs: "https://www.legislation.gov.uk/ukpga/2010/15" },
              { "@type": "Organization", name: "NRCPD", url: "https://www.nrcpd.org.uk/" },
            ],
            mainEntityOfPage: { "@id": "https://performanceinterpreting.co.uk/sports/#webpage" },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "5.0",
              reviewCount: "33",
              bestRating: "5",
              worstRating: "1",
            },
            review: [
              {
                "@type": "Review",
                reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
                author: { "@type": "Person", name: "Karen Rutter" },
                reviewBody:
                  "Great communication, great help, great organisation. Booked again for Coldplay at Wembley. More people using this service, more awareness - this will be huge.",
              },
              {
                "@type": "Review",
                reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
                author: { "@type": "Person", name: "Sarah Jones" },
                reviewBody:
                  "Interpreters are nearer the main action this year. I was pleased so I can stand watch the interpreters AND the match.",
              },
              {
                "@type": "Review",
                reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
                author: { "@type": "Person", name: "Adam" },
                reviewBody:
                  "We couldn't be more grateful to Performance Interpreting for their incredible work. Their amazing team of BSL interpreters brought energy, passion, and accessibility to every moment.",
              },
            ],
          }),
        }}
      />

      {/* ─── FAQPage schema - covers sport-specific search-intent queries */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: SPORT_FAQS.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          }),
        }}
      />

      {/* ─── BreadcrumbList ─────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://performanceinterpreting.co.uk/" },
              { "@type": "ListItem", position: 2, name: "Sports", item: "https://performanceinterpreting.co.uk/sports/" },
            ],
          }),
        }}
      />

      {/* ─── WebPage + Speakable schema ─────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": "https://performanceinterpreting.co.uk/sports/#webpage",
            url: "https://performanceinterpreting.co.uk/sports/",
            name: "Sport Sign Language Access - Performance Interpreting",
            description:
              "End-to-end sport sign language access - BSL and ISL at Premier League fixtures, Wembley Stadium, UEFA tournaments, England Netball, NFL UK and more.",
            inLanguage: "en-GB",
            datePublished: "2026-06-02",
            dateModified: "2026-06-02",
            isPartOf: { "@type": "WebSite", url: "https://performanceinterpreting.co.uk/" },
            primaryImageOfPage: {
              "@type": "ImageObject",
              url: "https://performanceinterpreting.co.uk/images/arsenal-pitchside.jpg",
            },
            about: {
              "@type": "Service",
              "@id": "https://performanceinterpreting.co.uk/sports/#service",
            },
            speakable: {
              "@type": "SpeakableSpecification",
              cssSelector: ["#service-intro", "#feedback-heading", "#faq-heading"],
            },
          }),
        }}
      />

      <PageHero
        title="Sport Sign Language Access"
        subtitle="BSL and ISL interpretation at the UK and Ireland's biggest sporting events - designed, staffed and delivered end-to-end."
        backgroundImage="/images/arsenal-pitchside.jpg"
      />

      {/* ─── Intro + stats ────────────────────────────────── */}
      <section className="section-padding section-gap">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <AnimateIn>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark">
                What we do
              </p>
              <h2 id="service-intro" className="mt-3 font-display text-2xl leading-snug text-pi-ink md:text-3xl">
                BSL &amp; ISL interpretation at Premier League, Wembley and beyond
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-pi-ink/80">
                Performance Interpreting is the appointed Deaf Access provider for Wembley Stadium and works with multiple Premier League clubs - Arsenal, Chelsea, Fulham and West Ham among them - plus national governing bodies including The FA, UEFA, England Netball and NFL UK. From a regular-season Premier League fixture to a Wembley cup final or international friendly, we design the access plan, place NRCPD-registered interpreters where Deaf fans can actually see them, and coordinate the team on the day.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-pi-ink/80">
                Sport interpretation isn&rsquo;t about loud announcements. It&rsquo;s about giving Deaf fans the same emotional experience as everyone else - the buildup, the controversy, the joke from the substitute mic&rsquo;d up for broadcast, the manager&rsquo;s tribute after a late winner. That&rsquo;s the work. Coverage spans England, Scotland, Wales, Northern Ireland and the Republic of Ireland.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-pi-accent px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-pi-accent/25 transition hover:brightness-110"
                >
                  Get a fixture quote
                  <Icon name="arrow-right" size={16} />
                </Link>
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 rounded-full border border-pi-accent/30 bg-white px-7 py-3.5 text-base font-semibold text-pi-accent transition hover:bg-pi-accent hover:text-white"
                >
                  Find an interpreted match
                </Link>
              </div>
            </div>
          </AnimateIn>

          <AnimateIn delay={150}>
            <div className="grid grid-cols-2 gap-4">
              {SPORT_STATS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-pi-ink/10 bg-white p-6 text-center shadow-sm"
                >
                  <div className="font-display text-2xl font-bold text-pi-accent md:text-3xl">
                    {s.value}
                  </div>
                  <div className="mt-2 text-xs font-medium uppercase tracking-wider text-pi-ink/65">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─── Where you'll find us (sport tier grid) ─────────────────── */}
      <section className="section-padding section-gap bg-pi-canvas-soft">
        <AnimateIn>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark">
              Where you&rsquo;ll find us
            </p>
            <h2 className="mt-3 font-display text-2xl text-pi-ink md:text-3xl">
              Clubs, leagues and rights holders we work with
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-pi-ink/80">
              Every interpreted fixture is added to the <Link href="/events" className="font-semibold text-pi-accent underline decoration-2 underline-offset-2 hover:text-pi-ink">PI Events App</Link> so Deaf fans can plan around it.
            </p>
          </div>
        </AnimateIn>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {SPORT_TIERS.map((tier, i) => (
            <AnimateIn key={tier.heading} delay={i * 60}>
              <div className="h-full rounded-2xl border border-pi-ink/10 bg-white p-6 shadow-sm md:p-8">
                <h3 className="font-display text-lg font-semibold text-pi-ink md:text-xl">
                  {tier.heading}
                </h3>
                <p className="mt-2 text-sm text-pi-ink/65">{tier.subheading}</p>
                <ul className="mt-5 grid gap-2 text-base text-pi-ink/80 sm:grid-cols-2">
                  {tier.clients.map((c) => (
                    <li key={c} className="flex items-start gap-2">
                      <Icon name="check" size={14} className="mt-1.5 shrink-0 text-pi-accent" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* ─── For Deaf sports fans ─────────────────────────────────── */}
      <section className="section-padding section-gap">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <AnimateIn delay={100}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/football-stadium.jpg"
                alt="Deaf BSL-using fans watching an interpreted Premier League match"
                fill
                className="object-cover"
              />
            </div>
          </AnimateIn>

          <AnimateIn>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark">
                For Deaf sports fans
              </p>
              <h2 className="mt-3 font-display text-2xl leading-snug text-pi-ink md:text-3xl">
                Find every BSL-interpreted fixture in one place
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-pi-ink/80">
                The free PI Events App lists every interpreted match and sporting event - by club, by competition, by interpreter on duty. Plan your match-day, request access for fixtures that don&rsquo;t yet have it, and give feedback after the whistle.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-pi-accent" />
                  <p className="text-base text-pi-ink/75">Free on the App Store and Google Play - no sign-up required</p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-pi-accent" />
                  <p className="text-base text-pi-ink/75">See interpreter names and profiles before kick-off</p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-pi-accent" />
                  <p className="text-base text-pi-ink/75">Request BSL or ISL for fixtures that don&rsquo;t yet have it</p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-pi-accent" />
                  <p className="text-base text-pi-ink/75">Give post-match feedback that we share with the club</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/get-app"
                  className="inline-flex items-center gap-2 rounded-full bg-pi-warmth-strong px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-pi-warmth/25 transition hover:brightness-110"
                >
                  Get the PI Events App
                  <Icon name="arrow-right" size={16} />
                </Link>
                <Link
                  href="/deaf-community"
                  className="inline-flex items-center gap-2 rounded-full border border-pi-accent/30 bg-white px-7 py-3.5 text-base font-semibold text-pi-accent transition hover:bg-pi-accent hover:text-white"
                >
                  For the Deaf community
                </Link>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─── For clubs / governing bodies ─────────────────────────── */}
      <section className="section-padding section-gap bg-pi-canvas-soft">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <AnimateIn>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark">
                For clubs, leagues &amp; rights holders
              </p>
              <h2 className="mt-3 font-display text-2xl leading-snug text-pi-ink md:text-3xl">
                Match-day access that integrates with your operation
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-pi-ink/80">
                Stadium BSL is a production discipline. Sightlines from accessible viewing areas, lighting for evening fixtures, integration with PA and broadcast, IMAG screen placement, half-time entertainment - all of it matters. We bring the playbook from hundreds of fixtures so your match-day team doesn&rsquo;t have to invent it.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pi-gold/10">
                    <Icon name="hand-metal" size={18} className="text-pi-gold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-pi-ink">BSL &amp; ISL Interpretation</h3>
                    <p className="mt-0.5 text-base text-pi-ink/65">Match-day teams of NRCPD-registered interpreters with stadium experience.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pi-gold/10">
                    <Icon name="settings" size={18} className="text-pi-gold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-pi-ink">Stadium production integration</h3>
                    <p className="mt-0.5 text-base text-pi-ink/65">Sightlines, lighting, comms with PA and broadcast, IMAG and big-screen positioning.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pi-gold/10">
                    <Icon name="users" size={18} className="text-pi-gold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-pi-ink">Season-long booking model</h3>
                    <p className="mt-0.5 text-base text-pi-ink/65">Rolling fixture bookings across the season - no ad-hoc requests, no missed matches.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pi-gold/10">
                    <Icon name="zap" size={18} className="text-pi-gold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-pi-ink">PI Events App integration</h3>
                    <p className="mt-0.5 text-base text-pi-ink/65">Your fixture list shows up automatically in the app - no extra work for your access team.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pi-gold/10">
                    <Icon name="shield" size={18} className="text-pi-gold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-pi-ink">Post-season reporting</h3>
                    <p className="mt-0.5 text-base text-pi-ink/65">Deaf fan engagement metrics packaged for your access stakeholders and league reporting.</p>
                  </div>
                </div>
              </div>

              <Link
                href="/organisers"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-pi-accent transition-colors hover:text-pi-ink"
              >
                Full For-Organisers walkthrough
                <Icon name="arrow-right" size={16} />
              </Link>
            </div>
          </AnimateIn>

          <AnimateIn delay={150} className="order-first md:order-none">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/football.jpg"
                alt="Performance Interpreting team working at a Premier League fixture"
                fill
                className="object-cover"
              />
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─── Authority signal - Wembley + the legal precedent ───────── */}
      <section className="section-padding section-gap">
        <AnimateIn>
          <div className="mx-auto max-w-4xl rounded-2xl border border-pi-accent/25 bg-gradient-to-br from-pi-accent/8 to-pi-accent/3 p-8 md:p-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark">
              Why this matters
            </p>
            <h2 className="mt-3 font-display text-2xl leading-snug text-pi-ink md:text-3xl">
              We&rsquo;re Wembley Stadium&rsquo;s appointed Deaf Access provider
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-pi-ink/80">
              Wembley appointed Performance Interpreting as their Deaf Access provider - BSL interpreting at every Wembley concert is now standard, and we cover FA Cup finals, EFL Cup finals and international fixtures from the same operating base. We also testified in the landmark Little Mix case that established BSL interpretation at live events as a reasonable adjustment under the Equality Act 2010.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-pi-ink/80">
              For clubs and rights holders that means access decisions made with PI are grounded in the actual operational standard at the country&rsquo;s flagship stadium - not guesswork.
            </p>
            <div className="mt-7">
              <Link
                href="/press"
                className="inline-flex items-center gap-2 text-sm font-semibold text-pi-accent transition-colors hover:text-pi-ink"
              >
                Read the press coverage
                <Icon name="arrow-right" size={16} />
              </Link>
            </div>
          </div>
        </AnimateIn>
      </section>

      {/* ─── How it works ──────────────────────────────────────────── */}
      <section className="section-padding section-gap bg-pi-canvas-soft">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <AnimateIn>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark">
                How a sport booking flows
              </p>
              <h2 className="mt-3 font-display text-2xl leading-snug text-pi-ink md:text-3xl">
                From first enquiry to end-of-season report
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-pi-ink/80">
                We&rsquo;ve refined this over hundreds of fixtures. Your job is to focus on the match-day operation; ours is to make access invisible until the moment a Deaf fan experiences it.
              </p>

              <div className="mt-8 space-y-6">
                {[
                  { step: "1", title: "Tell us about your fixture or season", desc: "Club, venue, competition, expected attendance, whether you want a fixture-by-fixture or season-long arrangement." },
                  { step: "2", title: "We build your access plan", desc: "Interpreter team sizing, viewing-area placement, lighting integration, comms with stadium operations and broadcast, accreditation logistics." },
                  { step: "3", title: "Pre-fixture briefing", desc: "Interpreters are briefed on team news, specialist vocabulary, ceremonial moments and the match-day running order." },
                  { step: "4", title: "Match-day delivery", desc: "The PI coordinator arrives early, manages the team across the fixture, and handles real-time schedule changes." },
                  { step: "5", title: "Post-fixture report", desc: "Deaf fan engagement data, app analytics, access metrics packaged for your access stakeholders and league reporting." },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pi-accent text-base font-bold text-white shadow-md shadow-pi-accent/25">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-pi-ink">{item.title}</h3>
                      <p className="mt-1 text-base text-pi-ink/70">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimateIn>

          <AnimateIn delay={150} className="order-first md:order-none">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/arsenal-pitchside.jpg"
                alt="PI team pitchside at a Premier League match"
                fill
                className="object-cover"
              />
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────────────────── */}
      <section className="section-padding section-gap" aria-labelledby="testimonials-heading">
        <AnimateIn>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark">
              What clubs and fans say
            </p>
            <h2 id="testimonials-heading" className="mt-3 font-display text-2xl text-pi-ink md:text-3xl">
              Trusted by Premier League clubs and Deaf sports fans
            </h2>
          </div>
        </AnimateIn>

        {(() => {
          const reviews = [
            {
              quote:
                "Great communication, great help, great organisation. Booked again for Coldplay at Wembley. More people using this service, more awareness - this will be huge.",
              name: "Karen Rutter",
              context: "Concert attendee, Wembley Stadium",
              rating: 5,
            },
            {
              quote:
                "Interpreters are nearer the main action this year. I was pleased so I can stand watch the interpreters AND the match.",
              name: "Sarah Jones",
              context: "Deaf football fan",
              rating: 5,
            },
            {
              quote:
                "We couldn't be more grateful to Performance Interpreting for their incredible work. Their amazing team of BSL interpreters brought energy, passion, and accessibility to every moment.",
              name: "Adam",
              context: "Event Organiser",
              rating: 5,
            },
          ];
          return (
            <>
              <div className="mx-auto mt-12 hidden max-w-5xl gap-6 md:grid md:grid-cols-3">
                {reviews.map((t, i) => (
                  <AnimateIn key={t.name} delay={i * 80}>
                    <div className="flex h-full flex-col rounded-2xl border border-pi-ink/10 bg-white p-6 shadow-sm md:p-8">
                      <div className="mb-4 flex gap-0.5">
                        {Array.from({ length: t.rating }).map((_, j) => (
                          <svg key={j} className="h-4 w-4 fill-pi-gold" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="flex-1 text-base italic leading-relaxed text-pi-ink/85">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <div className="mt-5 border-t border-pi-ink/10 pt-5">
                        <p className="text-sm font-semibold text-pi-ink">{t.name}</p>
                        <p className="text-xs text-pi-ink/70">{t.context}</p>
                      </div>
                    </div>
                  </AnimateIn>
                ))}
              </div>

              <div className="mt-10">
                <MobileTestimonialsCarousel testimonials={reviews} />
              </div>
            </>
          );
        })()}
      </section>

      {/* ─── Sport feedback - Tally form + video upload ─────────────── */}
      <section
        id="sport-feedback"
        className="scroll-mt-24 section-padding section-gap bg-pi-canvas-soft"
        aria-labelledby="feedback-heading"
      >
        <AnimateIn>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark">
              Make the next fixture better
            </p>
            <h2
              id="feedback-heading"
              className="mt-3 font-display text-2xl leading-snug text-pi-ink md:text-3xl"
            >
              Tell us how your match-day access actually went
            </h2>
            <p className="mt-5 text-base leading-relaxed text-pi-ink/75">
              Whether the fixture you attended had BSL or ISL provision from us, from another team, or none at all - your experience tells us where stadium access is genuinely working and where it&rsquo;s falling short. Good, bad, in between - share what happened in writing or in sign language video. We collate the patterns, share insights back with clubs and rights holders (only with your permission), and use what we learn to push standards higher across the industry.
            </p>
          </div>
        </AnimateIn>

        <div className="mx-auto mt-10 grid max-w-5xl items-stretch gap-8 md:grid-cols-2 md:gap-10">
          {/* Video feedback - record in BSL/ISL or upload from camera roll */}
          <AnimateIn>
            <div className="flex h-full flex-col">
              <VideoFeedback />
            </div>
          </AnimateIn>

          {/* Tally embed - same form as the rest of the site */}
          <AnimateIn delay={150}>
            <div className="h-full overflow-hidden rounded-2xl border border-pi-ink/10 bg-white shadow-sm">
              <iframe
                src="https://tally.so/embed/Y5Dd20?alignLeft=1&hideTitle=1&transparentBackground=1"
                title="Match-day feedback form"
                width="100%"
                height="100%"
                style={{ minHeight: 360 }}
                className="border-0"
                loading="lazy"
              />
            </div>
          </AnimateIn>
        </div>

        {/* Photo & video consent */}
        <AnimateIn delay={200}>
          <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-pi-ink/10 bg-white px-6 py-6 text-center shadow-sm">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <div className="text-left sm:text-center">
                <p className="text-sm font-semibold text-pi-ink">
                  Happy to appear in match-day photos or videos?
                </p>
                <p className="mt-1 text-xs text-pi-ink/65">
                  Entirely optional. You can withdraw consent at any time.
                </p>
              </div>
              <a
                href="/photo-consent"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 rounded-full border border-pi-ink/15 bg-pi-canvas-soft px-5 py-2.5 text-sm font-semibold text-pi-ink transition-all hover:border-pi-accent/40 hover:bg-pi-accent/10"
              >
                <Icon name="clipboard-check" size={16} />
                Photo &amp; video consent
              </a>
            </div>
          </div>
        </AnimateIn>
      </section>

      {/* ─── FAQs ─────────────────────────────────────────────────── */}
      <section
        className="section-padding pt-12 pb-12 bg-white"
        aria-labelledby="faq-heading"
      >
        <div className="max-w-3xl mx-auto">
          <AnimateIn>
            <h2
              id="faq-heading"
              className="font-display text-2xl font-bold text-center mb-2 text-pi-ink md:text-3xl"
            >
              Sport access - frequently asked questions
            </h2>
            <p className="text-sm text-pi-ink/55 text-center mb-8">
              Everything Deaf sports fans, clubs and governing bodies ask us about BSL and ISL access at live sport.
            </p>
          </AnimateIn>
          <div className="space-y-3">
            {SPORT_FAQS.map((faq, i) => (
              <AnimateIn key={i}>
                <details className="group rounded-2xl border border-pi-ink/15 bg-white overflow-hidden">
                  <summary className="px-6 py-5 cursor-pointer font-medium text-pi-ink/80 hover:text-pi-ink flex items-center justify-between transition-colors">
                    {faq.question}
                    <svg
                      className="w-5 h-5 text-pi-ink/40 group-open:rotate-180 transition-transform flex-shrink-0 ml-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-5 text-sm text-pi-ink/65 leading-relaxed">{faq.answer}</div>
                </details>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      <ContactCta />

      {/* ─── About-this-page note ─────────────────────────── */}
      <section className="section-padding pb-12">
        <p className="mx-auto max-w-3xl text-center text-xs text-pi-ink/45">
          About this page · Last updated <time dateTime="2026-06-02">2 June 2026</time> · Maintained by the Performance Interpreting team · Coverage: England, Scotland, Wales, Northern Ireland and the Republic of Ireland.
        </p>
      </section>
    </>
  );
}
