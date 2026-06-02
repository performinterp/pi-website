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
    "Festival Sign Language Access | BSL Interpreters at UK Festivals - Performance Interpreting",
  description:
    "BSL and ISL interpretation at the UK and Ireland's biggest festivals - Reading, Leeds, Download, Latitude, Wilderness, BST Hyde Park, BBC Radio 1's Big Weekend, Brighton Pride and more. Festival sign language access designed, staffed and delivered end-to-end by Performance Interpreting.",
  alternates: {
    canonical: "https://performanceinterpreting.co.uk/festivals/",
  },
  openGraph: {
    title: "Festival Sign Language Access - Performance Interpreting",
    description:
      "BSL and ISL at the UK and Ireland's biggest festivals. End-to-end festival sign language access - consultancy, interpreter team, on-site coordination.",
    url: "https://performanceinterpreting.co.uk/festivals/",
    type: "website",
    images: [
      { url: "/images/festival-signing.jpg", width: 1200, height: 630, alt: "BSL interpreter signing at a festival" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Festival Sign Language Access - Performance Interpreting",
    description:
      "BSL & ISL interpretation at the UK and Ireland's biggest festivals. Festival sign language access by Performance Interpreting.",
    images: ["/images/festival-signing.jpg"],
  },
};

// ─── Festival client list, grouped by tier so visitors and search engines
//     can see the breadth and specificity of our festival experience.
const FESTIVAL_TIERS: Array<{ heading: string; subheading: string; festivals: string[] }> = [
  {
    heading: "Major Music Festivals - UK & Ireland",
    subheading: "Multi-day camping festivals and national broadcast events where we design the access plan from the ground up",
    festivals: [
      "Reading Festival",
      "Leeds Festival",
      "Download Festival",
      "Latitude Festival",
      "Wilderness Festival",
      "Camp Bestival",
      "Big Feastival",
      "Boardmasters",
      "Wireless Festival",
      "Victorious Festival",
      "Isle of Wight Festival",
      "Creamfields",
      "TRNSMT",
      "Parklife",
      "Electric Picnic (Stradbally, Ireland)",
      "BBC Radio 1's Big Weekend",
      "BBC Radio 2 in the Park",
    ],
  },
  {
    heading: "Pride Festivals",
    subheading: "Multi-stage BSL access for the UK's Pride calendar",
    festivals: [
      "Brighton & Hove Pride",
      "London Pride",
      "Croydon Pride",
      "Reading Pride",
      "Peterborough Pride",
      "Swindon Pride",
    ],
  },
  {
    heading: "London Festivals & Concert Series",
    subheading: "BST Hyde Park, Crystal Palace Park, Finsbury Park, Victoria Park, Gunnersbury, Knebworth",
    festivals: [
      "BST Hyde Park",
      "All Points East (Victoria Park)",
      "Crystal Palace Park concerts",
      "Crystal Palace Bowl shows",
      "Finsbury Park (Festival Republic)",
      "Field Day",
      "Come Together",
      "Gunnersbury Park concerts",
      "Knebworth Park",
    ],
  },
  {
    heading: "Specialty, Family & Boutique",
    subheading: "Smaller and themed festivals where access is just as important",
    festivals: [
      "Splendour Festival",
      "Godiva Festival",
      "We Have Ways Festival",
      "Forbidden Forest",
      "Silverstone Grand Prix Fan Zone",
      "CarFest",
    ],
  },
];

const FESTIVAL_FAQS: Array<{ question: string; answer: string }> = [
  {
    question: "Can I get a BSL interpreter at a music festival?",
    answer:
      "Yes. Performance Interpreting provides British Sign Language (BSL) interpreters at the UK's biggest music festivals - including Reading, Leeds, Download, Latitude, Wilderness, BST Hyde Park, BBC Radio 1's Big Weekend and many more. We work directly with festival production teams to design the access plan, supply NRCPD-registered interpreters, and coordinate everything on the day. Deaf festival-goers can find out which sets have BSL through our free PI Events App.",
  },
  {
    question: "Which festivals does Performance Interpreting work at?",
    answer:
      "Our regular festival roster includes Reading, Leeds, Download, Latitude, Wilderness, Camp Bestival, Big Feastival, Boardmasters, Wireless, Victorious, Isle of Wight, Creamfields, TRNSMT, Parklife, BST Hyde Park, All Points East, Mighty Hoopla, BBC Radio 1's Big Weekend, BBC Radio 2 in the Park, Splendour, Godiva, We Have Ways, Silverstone, CarFest, Brighton Pride, London Pride and Electric Picnic in Ireland. We add new festivals every season - if your festival isn't on the list, get in touch.",
  },
  {
    question: "How do Deaf people find out which festival performances have BSL?",
    answer:
      "Through the free PI Events App. It lists every BSL and ISL interpreted performance at every event we work, including stage, set time and the interpreter on duty. Deaf and BSL-using festival-goers can plan their day around interpreted sets, request access for sets that don't yet have it, and give feedback after the event. Available on the App Store and Google Play, no sign-up required.",
  },
  {
    question: "Are festivals legally required to provide sign language access?",
    answer:
      "Under the Equality Act 2010 (covering England, Scotland and Wales), service providers - including festival organisers - must make reasonable adjustments for Deaf and disabled customers. Providing BSL interpretation at live performances is now an established reasonable adjustment, in part because of the landmark Little Mix legal case in which Performance Interpreting testified. In Northern Ireland the Disability Discrimination Act 1995 applies; in the Republic of Ireland the Irish Sign Language Act 2017 places ISL on a statutory footing. We can advise organisers on their specific obligations.",
  },
  {
    question: "How many BSL interpreters does a festival need?",
    answer:
      "It depends on the duration, the number of stages you want to cover, the audience size and the kind of access experience you want to deliver. A single show typically needs two interpreters rotating every 15–20 minutes. A three-day, multi-stage festival typically needs a designed team of 4–12 interpreters plus on-site coordinators and volunteers. As part of our consultancy we spec the right team for your event - we will never under-staff, and we'll always tell you honestly if a request is too tight.",
  },
  {
    question: "How are festival BSL interpreters positioned on stage?",
    answer:
      "Interpreter positioning is a production decision, not an afterthought. The interpreter needs a clear sightline to the audience, sufficient lighting (especially at evening and night-time sets), and a position that doesn't block the artist or stage visuals. We work with your production team during the planning phase to design the placement - typically on a riser stage-left or stage-right, with dedicated lighting. For festivals with large viewing areas we sometimes use IMAG (screen) interpretation in addition to a physical interpreter on stage.",
  },
  {
    question: "Do you work at Pride festivals?",
    answer:
      "Yes - we cover Brighton & Hove Pride, London Pride, Croydon Pride, Peterborough Pride, Reading Pride, Swindon Pride and more across the UK Pride calendar. Pride events often have several stages running concurrently (Main Stage, Cabaret, Family, Women's Stage) and we staff each independently. Our Pride teams include Deaf interpreters and a mix of BSL-using volunteers to support the audience throughout the day.",
  },
  {
    question: "What is the difference between BSL and ISL, and do you provide both?",
    answer:
      "British Sign Language (BSL) is the language of the UK Deaf community; Irish Sign Language (ISL) is a distinct language used by the Deaf community in Ireland. They are not mutually intelligible. Performance Interpreting provides BSL across the UK and ISL across Ireland and Northern Ireland where appropriate. We have ISL teams on the ground for events such as Electric Picnic and provide bilingual provision at Irish festivals on request.",
  },
  {
    question: "Do you cover Irish festivals like Electric Picnic?",
    answer:
      "Yes. Performance Interpreting provides ISL interpretation at Electric Picnic (Stradbally) and other Irish festivals. Our Irish interpreter team is a dedicated unit of qualified ISL interpreters with festival experience. For events on the island of Ireland we'll always recommend ISL as the appropriate language unless the audience specifically needs BSL.",
  },
  {
    question: "How early should festivals book interpreters?",
    answer:
      "As soon as the festival dates are confirmed. For major multi-day festivals, four to eight weeks ahead of show date is typical to give us time to assemble the right team, brief them on the line-up and coordinate accreditation. For one-day events two to four weeks is workable. Tight requests are sometimes possible - we'll always be honest about whether we can deliver the standard we'd want to.",
  },
  {
    question: "Do interpreters camp on site or travel daily?",
    answer:
      "Both, depending on the festival and the interpreter. For multi-day camping festivals (Reading, Latitude, Download, Wilderness, Camp Bestival etc.) most of our team will be camping or campervan'd on-site. Some interpreters drive in daily where the venue is local. Accommodation logistics are coordinated by our on-site lead so the festival production team doesn't have to think about it.",
  },
  {
    question: "Can I see who'll be interpreting at my festival in advance?",
    answer:
      "Yes. Booked interpreters appear in the PI Events App on the relevant set listing, with their names and a short profile. Some Deaf attendees prefer to follow specific interpreters and check in advance which sets they're working - the app supports this. For festival organisers, we share the team roster in advance as part of the pre-event briefing pack.",
  },
  {
    question: "Are all Performance Interpreting festival interpreters NRCPD-registered?",
    answer:
      "Yes - every BSL interpreter we deploy is registered with the NRCPD (National Registers of Communication Professionals working with Deaf and Deafblind People). Where relevant we also work with interpreters registered with NUBSLI (National Union of British Sign Language Interpreters) and SASLI (Scottish Association of Sign Language Interpreters) in Scotland. Irish Sign Language interpreters working with us are qualified through the relevant Irish bodies. We do not deploy unregistered interpreters under any circumstances. Our coordinators and volunteers are vetted and trained, and we run our own festival training weekends through PI Academy.",
  },
  {
    question: "How much does festival BSL access cost?",
    answer:
      "Festival BSL access is priced as a designed access package rather than per interpreter-hour. The cost depends on the number of stages covered, the number of festival days, team size (typically 4-12 interpreters plus coordinators and volunteers), whether the team camps on site, and whether you want a full access package (BSL plus live captions, induction loops, post-event reporting). For context, the wider UK market typically charges £40-£80 per hour for a single qualified interpreter at smaller events; festival-scale designed access is quoted per project. Festival quotes are tailored - share your dates, venue and line-up with us via the quote form and we'll come back with specifics.",
  },
  {
    question: "What if it rains? Can interpreters work in wet weather?",
    answer:
      "Yes. Our festival interpreters are equipped for British weather and our coordinators carry rain plans. Where the interpreter position is uncovered we'll ask the festival production team to provide cover (gazebo, riser canopy, lighting rig position). Audience visibility of the interpreter is the priority - we will not stop interpreting for rain.",
  },
  {
    question: "What's included in a Full Access Package for a festival?",
    answer:
      "A Full Access Package typically includes: BSL or ISL interpretation across stages, on-site coordination by a PI lead, sight-line and lighting design for interpreter placement, live captioning for hearing-loop or screen display, induction loops at relevant points, pre-event audit and access plan, post-event reporting with audience feedback, and integration with the PI Events App so Deaf festival-goers can find your event and provide feedback. Each package is shaped around the specific festival.",
  },
  {
    question: "Do you work outside the UK and Ireland?",
    answer:
      "Our core coverage is the UK and Ireland. We've worked on festivals and events further afield on a case-by-case basis where the brief makes sense - contact us with your specific requirements and we'll let you know if we can help.",
  },
];

const FESTIVAL_STATS = [
  { value: "600+", label: "Festival days delivered" },
  { value: "27+", label: "Festivals on our 2026 roster" },
  { value: "100+", label: "NRCPD-registered interpreters" },
  { value: "1", label: "Free app for Deaf festival-goers" },
];

export default function FestivalsPage() {
  return (
    <>
      {/* ─── Service schema for AI agents and rich results ─────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": "https://performanceinterpreting.co.uk/festivals/#service",
            name: "Festival Sign Language Access - BSL & ISL Interpretation at UK Festivals",
            alternateName: [
              "Festival BSL Interpretation",
              "Sign Language Interpreter for Festivals",
              "Festival Deaf Access",
              "BSL at Music Festivals",
              "Hire a Festival BSL Interpreter",
              "Festival Accessibility BSL",
            ],
            serviceType: "Sign Language Interpretation",
            category: "Accessibility services for live festivals",
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
              audienceType: "Deaf and BSL/ISL-using festival-goers, festival organisers, production teams",
            },
            availableLanguage: [
              { "@type": "Language", name: "British Sign Language", alternateName: "BSL" },
              { "@type": "Language", name: "Irish Sign Language", alternateName: "ISL" },
              { "@type": "Language", name: "English" },
            ],
            description:
              "End-to-end festival sign language access - BSL and ISL interpretation, on-site coordination, access planning and the PI Events App for Deaf festival-goers. Worked at Reading, Leeds, Download, Latitude, Wilderness, BST Hyde Park, BBC Radio 1's Big Weekend, Brighton Pride and more.",
            url: "https://performanceinterpreting.co.uk/festivals/",
            image: "https://performanceinterpreting.co.uk/images/festival-signing.jpg",
            award: [
              "Established the UK legal precedent for BSL access at live music events (Little Mix case)",
              "Signature Hall of Fame inductee (2022)",
            ],
            offers: {
              "@type": "Offer",
              url: "https://performanceinterpreting.co.uk/contact/",
              availability: "https://schema.org/InStock",
              priceCurrency: "GBP",
              priceSpecification: {
                "@type": "PriceSpecification",
                priceCurrency: "GBP",
                description: "Designed access pricing - tailored per festival.",
              },
            },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Festival Sign Language Access offerings",
              itemListElement: [
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Multi-stage BSL interpretation for music festivals" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "ISL interpretation at Irish festivals" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Festival access plan and Equality Act 2010 advisory" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "On-site coordination across festival run" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "PI Events App integration for Deaf festival-goers" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Post-event access reporting" } },
              ],
            },
            mentions: [
              { "@type": "Event", name: "Reading Festival", sameAs: "https://en.wikipedia.org/wiki/Reading_and_Leeds_Festivals" },
              { "@type": "Event", name: "Download Festival", sameAs: "https://en.wikipedia.org/wiki/Download_Festival" },
              { "@type": "Event", name: "Latitude Festival", sameAs: "https://en.wikipedia.org/wiki/Latitude_Festival" },
              { "@type": "Event", name: "Wilderness Festival", sameAs: "https://en.wikipedia.org/wiki/Wilderness_Festival" },
              { "@type": "Event", name: "Camp Bestival", sameAs: "https://en.wikipedia.org/wiki/Camp_Bestival" },
              { "@type": "Event", name: "BST Hyde Park", sameAs: "https://en.wikipedia.org/wiki/BST_Hyde_Park" },
              { "@type": "Event", name: "BBC Radio 1's Big Weekend", sameAs: "https://en.wikipedia.org/wiki/BBC_Radio_1%27s_Big_Weekend" },
              { "@type": "Event", name: "Electric Picnic", sameAs: "https://en.wikipedia.org/wiki/Electric_Picnic" },
              { "@type": "Event", name: "Brighton Pride", sameAs: "https://en.wikipedia.org/wiki/Brighton_Pride" },
              { "@type": "Language", name: "British Sign Language", sameAs: "https://en.wikipedia.org/wiki/British_Sign_Language" },
              { "@type": "Language", name: "Irish Sign Language", sameAs: "https://en.wikipedia.org/wiki/Irish_Sign_Language" },
              { "@type": "Legislation", name: "Equality Act 2010", sameAs: "https://www.legislation.gov.uk/ukpga/2010/15" },
              { "@type": "Organization", name: "NRCPD", url: "https://www.nrcpd.org.uk/" },
            ],
            mainEntityOfPage: { "@id": "https://performanceinterpreting.co.uk/festivals/#webpage" },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "5.0",
              reviewCount: "33",
              bestRating: "5",
              worstRating: "1",
            },
          }),
        }}
      />

      {/* ─── FAQPage schema - comprehensive search-intent coverage ─── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FESTIVAL_FAQS.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          }),
        }}
      />

      {/* ─── BreadcrumbList for site structure clarity ─────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://performanceinterpreting.co.uk/" },
              { "@type": "ListItem", position: 2, name: "Festivals", item: "https://performanceinterpreting.co.uk/festivals/" },
            ],
          }),
        }}
      />

      {/* ─── WebPage + Speakable schema - boosts voice / AI-assistant pickup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": "https://performanceinterpreting.co.uk/festivals/#webpage",
            url: "https://performanceinterpreting.co.uk/festivals/",
            name: "Festival Sign Language Access - Performance Interpreting",
            description:
              "End-to-end festival sign language access - BSL and ISL interpretation, on-site coordination, access planning and the PI Events App for Deaf festival-goers across the UK and Ireland.",
            inLanguage: "en-GB",
            datePublished: "2026-06-02",
            dateModified: "2026-06-02",
            isPartOf: { "@type": "WebSite", url: "https://performanceinterpreting.co.uk/" },
            primaryImageOfPage: {
              "@type": "ImageObject",
              url: "https://performanceinterpreting.co.uk/images/festival-signing.jpg",
            },
            about: {
              "@type": "Service",
              name: "Festival Sign Language Access - BSL & ISL Interpretation",
            },
            speakable: {
              "@type": "SpeakableSpecification",
              cssSelector: ["#service-intro", "#feedback-heading", "#faq-heading"],
            },
          }),
        }}
      />

      {/* ─── Reviews - structured testimonial data for AI / rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": "https://performanceinterpreting.co.uk/festivals/#reviews",
            name: "Festival Sign Language Access",
            provider: { "@id": "https://performanceinterpreting.co.uk/#organization" },
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
                author: { "@type": "Person", name: "Adam" },
                publisher: { "@type": "Organization", name: "Croydon PrideFest" },
                reviewBody:
                  "We couldn't be more grateful to Performance Interpreting for their incredible work. Their amazing team of BSL interpreters brought energy, passion, and accessibility to every performance.",
              },
              {
                "@type": "Review",
                reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
                author: { "@type": "Person", name: "Sarah Jones" },
                reviewBody:
                  "Interpreters are nearer the main stage this year. I was pleased so I can stand watch the interpreters AND the performances.",
                itemReviewed: { "@type": "Event", name: "BST Hyde Park" },
              },
              {
                "@type": "Review",
                reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
                author: { "@type": "Person", name: "Karen Rutter" },
                reviewBody:
                  "Great communication, great help, great organisation. More people using this service, more awareness - this will be huge for our Deaf community at festivals.",
              },
            ],
          }),
        }}
      />

      <PageHero
        title="Festival Sign Language Access"
        subtitle="BSL and ISL interpretation at the UK and Ireland's biggest festivals - designed, staffed and delivered end-to-end."
        backgroundImage="/images/festival-signing.jpg"
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
                BSL &amp; ISL interpretation at the UK and Ireland&rsquo;s biggest festivals
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-pi-ink/80">
                Performance Interpreting is the UK and Ireland&rsquo;s largest provider of sign language access at live festivals. From Reading and Leeds Festival (~90,000-capacity each) and Download at Donington Park, through to BST Hyde Park, Brighton Pride and boutique gatherings like Wilderness and Camp Bestival - we design the access plan, place NRCPD-registered interpreters where Deaf audiences can actually see them, and coordinate the team on the day.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-pi-ink/80">
                Festival sign language access isn&rsquo;t a side-service for us - it&rsquo;s the work we&rsquo;re known for. We helped establish the legal precedent that BSL access at live events is a requirement, not a courtesy. Coverage spans England, Scotland, Wales, Northern Ireland and the Republic of Ireland, with ISL teams for Irish festivals such as Electric Picnic in Stradbally.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-pi-accent px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-pi-accent/25 transition hover:brightness-110"
                >
                  Get a festival quote
                  <Icon name="arrow-right" size={16} />
                </Link>
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 rounded-full border border-pi-accent/30 bg-white px-7 py-3.5 text-base font-semibold text-pi-accent transition hover:bg-pi-accent hover:text-white"
                >
                  Find an interpreted festival set
                </Link>
              </div>
            </div>
          </AnimateIn>

          <AnimateIn delay={150}>
            <div className="grid grid-cols-2 gap-4">
              {FESTIVAL_STATS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-pi-ink/10 bg-white p-6 text-center shadow-sm"
                >
                  <div className="font-display text-3xl font-bold text-pi-accent md:text-4xl">
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

      {/* ─── Festivals we work at (full tiered list) ───────────────── */}
      <section className="section-padding section-gap bg-pi-canvas-soft">
        <AnimateIn>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark">
              Where you&rsquo;ll find us
            </p>
            <h2 className="mt-3 font-display text-2xl text-pi-ink md:text-3xl">
              Festivals we work at across the UK and Ireland
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-pi-ink/80">
              Every festival we work is added to the <Link href="/events" className="font-semibold text-pi-accent underline decoration-2 underline-offset-2 hover:text-pi-ink">PI Events App</Link> so Deaf festival-goers can plan their access in advance.
            </p>
          </div>
        </AnimateIn>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {FESTIVAL_TIERS.map((tier, i) => (
            <AnimateIn key={tier.heading} delay={i * 60}>
              <div className="h-full rounded-2xl border border-pi-ink/10 bg-white p-6 shadow-sm md:p-8">
                <h3 className="font-display text-lg font-semibold text-pi-ink md:text-xl">
                  {tier.heading}
                </h3>
                <p className="mt-2 text-sm text-pi-ink/65">{tier.subheading}</p>
                <ul className="mt-5 grid gap-2 text-base text-pi-ink/80 sm:grid-cols-2">
                  {tier.festivals.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Icon name="check" size={14} className="mt-1.5 shrink-0 text-pi-accent" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* ─── For Deaf festival-goers ───────────────────────────────── */}
      <section className="section-padding section-gap">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <AnimateIn delay={100}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/festival-energy.jpg"
                alt="BSL-using festival-goers watching an interpreted set"
                fill
                className="object-cover"
              />
            </div>
          </AnimateIn>

          <AnimateIn>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark">
                For Deaf festival-goers
              </p>
              <h2 className="mt-3 font-display text-2xl leading-snug text-pi-ink md:text-3xl">
                Find every BSL and ISL interpreted set in one place
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-pi-ink/80">
                The free PI Events App lists every interpreted festival set - by stage, by set time, and by the interpreter on duty. Plan your day, request access for sets that don&rsquo;t yet have it, and give feedback after the event so we can keep raising the bar.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-pi-accent" />
                  <p className="text-base text-pi-ink/75">Free on the App Store and Google Play - no sign-up required</p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-pi-accent" />
                  <p className="text-base text-pi-ink/75">See interpreter names and profiles before you go</p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-pi-accent" />
                  <p className="text-base text-pi-ink/75">Request BSL or ISL for sets that don&rsquo;t yet have it</p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-pi-accent" />
                  <p className="text-base text-pi-ink/75">Give post-festival feedback that we share with the organiser</p>
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

      {/* ─── For organisers - service breakdown ────────────────────── */}
      <section className="section-padding section-gap bg-pi-canvas-soft">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <AnimateIn>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark">
                For festival organisers &amp; production teams
              </p>
              <h2 className="mt-3 font-display text-2xl leading-snug text-pi-ink md:text-3xl">
                Festival access designed, not bolted on
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-pi-ink/80">
                Festival BSL access is a production discipline. Lighting, sight-lines, riser placement, rotation schedules, accreditation logistics, weather contingency and integration with your in-app guide all matter. We bring the playbook from hundreds of festivals so your team doesn&rsquo;t have to invent it.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pi-gold/10">
                    <Icon name="hand-metal" size={18} className="text-pi-gold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-pi-ink">BSL &amp; ISL Interpretation</h3>
                    <p className="mt-0.5 text-base text-pi-ink/65">Multi-stage, multi-day teams of NRCPD-registered interpreters with festival experience.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pi-gold/10">
                    <Icon name="settings" size={18} className="text-pi-gold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-pi-ink">Access plan &amp; legal advisory</h3>
                    <p className="mt-0.5 text-base text-pi-ink/65">Equality Act 2010 advisory, access audit, signage, captioning where appropriate, induction loops.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pi-gold/10">
                    <Icon name="users" size={18} className="text-pi-gold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-pi-ink">On-site coordination</h3>
                    <p className="mt-0.5 text-base text-pi-ink/65">A PI lead coordinator manages the interpreter team end-to-end and liaises with production in real time.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pi-gold/10">
                    <Icon name="zap" size={18} className="text-pi-gold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-pi-ink">PI Events App integration</h3>
                    <p className="mt-0.5 text-base text-pi-ink/65">Your festival shows up automatically when you book - no extra work for your access team.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pi-gold/10">
                    <Icon name="shield" size={18} className="text-pi-gold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-pi-ink">Post-event reporting</h3>
                    <p className="mt-0.5 text-base text-pi-ink/65">Audience feedback, attendance data and access metrics for your funders and stakeholders.</p>
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
                src="/images/festival-sunset.png"
                alt="PI festival production team at work"
                fill
                className="object-cover"
              />
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─── Authority signal - Little Mix / Equality Act ──────────── */}
      <section className="section-padding section-gap">
        <AnimateIn>
          <div className="mx-auto max-w-4xl rounded-2xl border border-pi-accent/25 bg-gradient-to-br from-pi-accent/8 to-pi-accent/3 p-8 md:p-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark">
              Why this matters
            </p>
            <h2 className="mt-3 font-display text-2xl leading-snug text-pi-ink md:text-3xl">
              We helped set the UK legal precedent for live-event BSL access
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-pi-ink/80">
              The landmark Little Mix case established that providing BSL interpretation at live music events is a reasonable adjustment under the Equality Act 2010. Performance Interpreting testified in that case. We don&rsquo;t just supply interpreters - we&rsquo;ve helped define what good festival access looks like in UK law.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-pi-ink/80">
              For festival organisers that means access decisions made with PI are grounded in the actual legal standard, not guesswork.
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
                How a festival booking flows
              </p>
              <h2 className="mt-3 font-display text-2xl leading-snug text-pi-ink md:text-3xl">
                From first enquiry to post-event report
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-pi-ink/80">
                We&rsquo;ve refined this over 600+ festival days. Your job is to focus on the festival; ours is to make access invisible until the moment a Deaf attendee experiences it.
              </p>

              <div className="mt-8 space-y-6">
                {[
                  { step: "1", title: "Tell us about your festival", desc: "Dates, venue, stages, line-up, expected audience size. We come back with questions and a draft plan." },
                  { step: "2", title: "We build your access plan", desc: "Interpreter team sizing, stage allocation, rotation schedule, accreditation, accommodation and on-site logistics - all confirmed before contract." },
                  { step: "3", title: "Pre-festival briefing", desc: "Interpreters are briefed on line-ups, setlists, specialist vocabulary and stage logistics ahead of show day." },
                  { step: "4", title: "On-site delivery", desc: "The PI coordinator arrives early, manages the team across the run, and handles real-time changes to your schedule." },
                  { step: "5", title: "Post-event report", desc: "Audience feedback, app analytics and access metrics packaged for your funders, sponsors and access stakeholders." },
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
                src="/images/festival-energy.jpg"
                alt="PI interpreter at a major festival"
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
              What festivals and audiences say
            </p>
            <h2 id="testimonials-heading" className="mt-3 font-display text-2xl text-pi-ink md:text-3xl">
              Trusted by festival organisers and Deaf festival-goers
            </h2>
          </div>
        </AnimateIn>

        {(() => {
          const reviews = [
            {
              quote:
                "We couldn't be more grateful to Performance Interpreting for their incredible work. Their amazing team of BSL interpreters brought energy, passion, and accessibility to every performance.",
              name: "Adam",
              context: "Event Organiser, Croydon PrideFest",
              rating: 5,
            },
            {
              quote:
                "Interpreters are nearer the main stage this year. I was pleased so I can stand watch the interpreters AND the performances.",
              name: "Sarah Jones",
              context: "BST Hyde Park attendee",
              rating: 5,
            },
            {
              quote:
                "Great communication, great help, great organisation. More people using this service, more awareness - this will be huge for our Deaf community at festivals.",
              name: "Karen Rutter",
              context: "Festival attendee",
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

      {/* ─── Festival feedback - Tally form + video upload ─────────── */}
      <section
        id="festival-feedback"
        className="scroll-mt-24 section-padding section-gap bg-pi-canvas-soft"
        aria-labelledby="feedback-heading"
      >
        <AnimateIn>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark">
              Make the next one better
            </p>
            <h2
              id="feedback-heading"
              className="mt-3 font-display text-2xl leading-snug text-pi-ink md:text-3xl"
            >
              Tell us how your festival access actually went
            </h2>
            <p className="mt-5 text-base leading-relaxed text-pi-ink/75">
              Whether the festival you attended had BSL or ISL provision from us, from another team, or none at all - your experience tells us where festival access is genuinely working and where it&rsquo;s falling short. Good, bad, in between - share what happened in writing or in sign language video. We collate the patterns, share insights back with festival organisers (only with your permission), and use what we learn to push standards higher across the industry.
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

          {/* Tally embed - same form as the deaf-community page */}
          <AnimateIn delay={150}>
            <div className="h-full overflow-hidden rounded-2xl border border-pi-ink/10 bg-white shadow-sm">
              <iframe
                src="https://tally.so/embed/Y5Dd20?alignLeft=1&hideTitle=1&transparentBackground=1"
                title="Festival feedback form"
                width="100%"
                height="100%"
                style={{ minHeight: 360 }}
                className="border-0"
                loading="lazy"
              />
            </div>
          </AnimateIn>
        </div>

        {/* Photo & video consent - separate small container */}
        <AnimateIn delay={200}>
          <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-pi-ink/10 bg-white px-6 py-6 text-center shadow-sm">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <div className="text-left sm:text-center">
                <p className="text-sm font-semibold text-pi-ink">
                  Happy to appear in festival photos or videos?
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
              Festival access - frequently asked questions
            </h2>
            <p className="text-sm text-pi-ink/55 text-center mb-8">
              Everything Deaf festival-goers and festival organisers ask us about BSL and ISL access at live festivals.
            </p>
          </AnimateIn>
          <div className="space-y-3">
            {FESTIVAL_FAQS.map((faq, i) => (
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

      {/* ─── About-this-page note - small but useful freshness signal */}
      <section className="section-padding pb-12">
        <p className="mx-auto max-w-3xl text-center text-xs text-pi-ink/45">
          About this page · Last updated <time dateTime="2026-06-02">2 June 2026</time> · Maintained by the Performance Interpreting team · Coverage: England, Scotland, Wales, Northern Ireland and the Republic of Ireland.
        </p>
      </section>
    </>
  );
}
