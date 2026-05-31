import type { Metadata } from "next";
import PageHero from "@/components/page-hero";
import ContactCta from "@/components/contact-cta";
import AnimateIn from "@/components/animate-in";
import { getTestimonials } from "@/lib/content";

const SITE = "https://performanceinterpreting.co.uk";

export const metadata: Metadata = {
  title: "Testimonials - Performance Interpreting",
  description:
    "What event organisers, Deaf community members and interpreters say about Performance Interpreting. 5-star rated on Google, 100% recommended on Facebook.",
  alternates: { canonical: `${SITE}/testimonials/` },
  openGraph: {
    title: "Testimonials | Performance Interpreting",
    description:
      "Real feedback from event organisers, Deaf attendees and interpreters who've worked with PI.",
    url: `${SITE}/testimonials/`,
    type: "website",
    // images handled by root opengraph-image.tsx convention.
  },
};

export default function TestimonialsPage() {
  const testimonials = getTestimonials();

  // Aggregate rating across the testimonials we display on this page.
  // Untreated quotes (no explicit rating) are treated as 5/5 for the
  // average — they're all unambiguously positive — but only quotes with
  // explicit ratings are counted in the rating count to be conservative.
  const rated = testimonials.filter((t) => t.rating);
  const ratingCount = rated.length;
  const ratingValue =
    ratingCount > 0
      ? (rated.reduce((sum, t) => sum + (t.rating ?? 0), 0) / ratingCount).toFixed(1)
      : "5.0";

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
              { "@type": "ListItem", position: 2, name: "Testimonials", item: `${SITE}/testimonials/` },
            ],
          }),
        }}
      />
      {/* AggregateRating attached to the Organization — the rich-result
          eligible structured-data signal that can earn visible star
          ratings in branded Google SERPs. Sourced from on-site testimonials
          with explicit ratings. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": `${SITE}/#organization`,
            name: "Performance Interpreting Ltd",
            url: SITE,
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue,
              reviewCount: String(ratingCount),
              bestRating: "5",
              worstRating: "1",
            },
          }),
        }}
      />
      {/* Review schema array — each testimonial as a Review of the organisation.
          Lets agents extract them individually rather than treating the page as
          one blob of text. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            testimonials.map((t) => ({
              "@context": "https://schema.org",
              "@type": "Review",
              author: { "@type": "Person", name: t.name },
              reviewBody: t.quote,
              itemReviewed: { "@id": `${SITE}/#organization` },
              ...(t.rating
                ? {
                    reviewRating: {
                      "@type": "Rating",
                      ratingValue: String(t.rating),
                      bestRating: "5",
                      worstRating: "1",
                    },
                  }
                : {}),
              ...(t.source
                ? {
                    publisher: {
                      "@type": "Organization",
                      name: t.source === "google" ? "Google" : t.source === "facebook" ? "Facebook" : t.source,
                    },
                  }
                : {}),
            }))
          ),
        }}
      />

      <PageHero
        title="Testimonials"
        subtitle="What event organisers, Deaf community members and interpreters say about working with Performance Interpreting."
        backgroundImage="/images/concert.jpg"
      />

      {/* Headline rating callout */}
      <section className="section-padding pt-12">
        <div className="mx-auto max-w-4xl rounded-2xl border border-pi-gold/20 bg-pi-gold/5 p-8 text-center">
          <p className="font-display text-3xl text-pi-ink md:text-4xl">
            5.0 on Google · 100% recommended on Facebook
          </p>
          <p className="mt-3 text-sm text-pi-ink/65">
            Reviews from real event organisers, Deaf attendees, PI Academy participants and interpreters.
          </p>
        </div>
      </section>

      {/* Testimonials grid */}
      <section className="section-padding section-gap">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-5 md:grid-cols-2">
            {testimonials.map((t, i) => (
              <AnimateIn key={i} delay={i * 80}>
                <figure className="flex h-full flex-col rounded-2xl border border-pi-ink/10 bg-white p-7 shadow-sm">
                  <svg
                    aria-hidden
                    className="w-8 h-8 text-pi-accent/40 mb-4 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10H0z" />
                  </svg>
                  <blockquote className="flex-1 text-pi-ink/85 italic leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 pt-4 border-t border-pi-ink/8">
                    <p className="text-sm font-semibold text-pi-ink">{t.name}</p>
                    {t.context && (
                      <p className="text-xs text-pi-ink/55 mt-0.5">{t.context}</p>
                    )}
                    {t.source && (
                      <p className="text-[10px] uppercase tracking-widest text-pi-ink/40 mt-2">
                        via {t.source === "google" ? "Google" : t.source === "facebook" ? "Facebook" : t.source}
                      </p>
                    )}
                  </figcaption>
                </figure>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
