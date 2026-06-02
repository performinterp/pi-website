import type { Metadata } from "next";
import PageHero from "@/components/page-hero";
import RequestDraftBuilder from "../_components/request-draft-builder";
import RequestIntro from "../_components/request-intro";

export const metadata: Metadata = {
  title: "Request an Interpreter - Performance Interpreting",
  description:
    "We'll write the email to the venue for you. Edit it as much as you like, copy it, or open it in your mail app. Performance Interpreting is CC'd for continued support.",
};

interface PageProps {
  searchParams: Promise<{ event?: string; venue?: string; date?: string }>;
}

export default async function EventRequestPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "@id": "https://performanceinterpreting.co.uk/events/request/#contactpage",
            url: "https://performanceinterpreting.co.uk/events/request/",
            name: "Request an Interpreter - Performance Interpreting",
            description:
              "We'll write the email to the venue for you. Edit it freely, copy it, or open it in your mail app. Performance Interpreting is CC'd for continued support.",
            inLanguage: "en-GB",
            about: { "@id": "https://performanceinterpreting.co.uk/#organization" },
            mainEntity: { "@id": "https://performanceinterpreting.co.uk/#organization" },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://performanceinterpreting.co.uk/" },
              { "@type": "ListItem", position: 2, name: "Events", item: "https://performanceinterpreting.co.uk/events/" },
              { "@type": "ListItem", position: 3, name: "Request an Interpreter", item: "https://performanceinterpreting.co.uk/events/request/" },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": "https://performanceinterpreting.co.uk/events/request/#webpage",
            url: "https://performanceinterpreting.co.uk/events/request/",
            name: "Request an Interpreter - Performance Interpreting",
            description:
              "We'll write the email to the venue for you. Edit it freely, copy it, or open it in your mail app.",
            inLanguage: "en-GB",
            datePublished: "2026-06-02",
            dateModified: "2026-06-02",
            isPartOf: { "@id": "https://performanceinterpreting.co.uk/#website" },
          }),
        }}
      />

      <PageHero
        title="Request an Interpreter"
        subtitle="Contacting a venue can feel daunting. We've made it as easy as possible by writing the email for you - edit it freely, then copy it or open it in your mail app."
        backgroundImage="/images/concert.jpg"
      />

      <section className="section-padding section-gap">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1fr_1.4fr]">
          <RequestIntro />

          <div className="rounded-2xl border border-pi-ink/10 bg-white p-6 shadow-sm md:p-8">
            <h2 className="font-display text-2xl text-pi-ink">
              Enter the details of the event you want to go to
            </h2>
            <p className="mt-2 text-base text-pi-ink/65">
              We&apos;ll generate the email for you to send.
            </p>
            <div className="mt-6">
              <RequestDraftBuilder
                initialEvent={params.event}
                initialVenue={params.venue}
                initialDate={params.date}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
