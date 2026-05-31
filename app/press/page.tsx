import type { Metadata } from "next";
import PageHero from "@/components/page-hero";
import ContactCta from "@/components/contact-cta";
import AnimateIn from "@/components/animate-in";
import { getPage } from "@/lib/content";

const SITE = "https://performanceinterpreting.co.uk";

// Press list lives inside content/pages/about.json as the "In the press"
// section so we don't duplicate source-of-truth. Pull it from there.
const aboutPage = getPage("about");
const pressSection = aboutPage.sections.find(
  (s) => s.heading === "Featured coverage" || s.label === "In the press"
);
const items = (pressSection?.items ?? []) as Array<{
  title: string;
  description: string;
  url: string;
}>;

export const metadata: Metadata = {
  title: "Press & Featured Coverage - Performance Interpreting",
  description:
    "National media coverage of Performance Interpreting — BBC, Arsenal, Wembley Stadium and more. PI's work shaping BSL access at live events across the UK and Ireland.",
  alternates: { canonical: `${SITE}/press/` },
  openGraph: {
    title: "Press & Featured Coverage | Performance Interpreting",
    description:
      "BBC, Arsenal, Wembley Stadium and more — coverage of PI's work in BSL access at live events.",
    url: `${SITE}/press/`,
    type: "website",
    // images handled by the root app/opengraph-image.tsx convention.
  },
};

function publisherFromUrl(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host.endsWith(".bbc.co.uk") || host === "bbc.co.uk") return "BBC";
    if (host.includes("arsenal")) return "Arsenal";
    if (host.includes("wembleystadium")) return "Wembley Stadium";
    if (host.includes("theguardian")) return "The Guardian";
    if (host.includes("nme")) return "NME";
    if (host.includes("itv")) return "ITV";
    if (host.includes("sky")) return "Sky";
    if (host.includes("limpingchicken")) return "The Limping Chicken";
    if (host.includes("disabilityrights")) return "Disability Rights UK";
    if (host.includes("completemusicupdate")) return "Complete Music Update";
    return host;
  } catch {
    return "Press";
  }
}

export default function PressPage() {
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
            ],
          }),
        }}
      />
      {/* CollectionPage + ItemList of NewsArticle — each piece of press
          coverage as a structured NewsArticle so agents asked 'where has PI
          been featured?' can extract the list directly. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            url: `${SITE}/press/`,
            name: "Press & Featured Coverage",
            description:
              "National media coverage of Performance Interpreting.",
            about: { "@id": `${SITE}/#organization` },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: items.length,
              itemListElement: items.map((it, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: {
                  "@type": "NewsArticle",
                  headline: it.title,
                  description: it.description,
                  url: it.url,
                  publisher: {
                    "@type": "Organization",
                    name: publisherFromUrl(it.url),
                  },
                  about: { "@id": `${SITE}/#organization` },
                },
              })),
            },
          }),
        }}
      />

      <PageHero
        title="Press & Featured Coverage"
        subtitle="Performance Interpreting in the national media."
        backgroundImage="/images/concert.jpg"
      />

      <section className="section-padding section-gap">
        <div className="mx-auto max-w-4xl">
          <AnimateIn>
            <p className="mb-10 text-lg leading-relaxed text-pi-ink/75">
              Our work has been covered by national media and recognised by some of the biggest names in sport and entertainment. A small selection below.
            </p>
          </AnimateIn>

          <div className="space-y-4">
            {items.map((it, i) => (
              <AnimateIn key={it.url} delay={i * 80}>
                <a
                  href={it.url}
                  target="_blank"
                  rel="external noopener noreferrer"
                  className="group block rounded-2xl border border-pi-ink/10 bg-white p-6 transition-all hover:border-pi-accent/30 hover:shadow-md hover:shadow-pi-navy/5"
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark mb-2">
                    {publisherFromUrl(it.url)}
                  </p>
                  <h2 className="font-display text-lg font-bold text-pi-ink leading-snug group-hover:text-pi-accent transition-colors">
                    {it.title}
                  </h2>
                  <p className="mt-2 text-sm text-pi-ink/65 leading-relaxed">{it.description}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-pi-accent group-hover:gap-3 transition-all">
                    Read the piece
                    <span aria-hidden>↗</span>
                  </span>
                </a>
              </AnimateIn>
            ))}
          </div>

          <AnimateIn>
            <p className="mt-10 text-sm text-pi-ink/55 leading-relaxed">
              Media enquiries: please use the <a href="/contact" className="text-pi-accent underline underline-offset-4 hover:no-underline">contact form</a> and select press as your enquiry type.
            </p>
          </AnimateIn>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
