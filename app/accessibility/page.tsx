import type { Metadata } from "next";
import { getPage, getEasyRead } from "@/lib/content";
import PageHero from "@/components/page-hero";
import EasyReadSummary from "@/components/easy-read-summary";
import ContentSection from "@/components/content-section";
import { jsonLd } from "@/lib/json-ld";

const page = getPage("accessibility");

export const metadata: Metadata = {
  title: `${page.title} - Performance Interpreting`,
  description: page.metaDescription,
};

export default function AccessibilityPage() {
  const SITE = "https://performanceinterpreting.co.uk";
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${SITE}/accessibility/`,
            url: `${SITE}/accessibility/`,
            name: page.title,
            description: page.metaDescription,
            about: { "@id": `${SITE}/#organization` },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Accessibility", item: `${SITE}/accessibility/` },
            ],
          }),
        }}
      />
      <PageHero title={page.title} subtitle={page.subtitle} />

      <EasyReadSummary page={getEasyRead("/accessibility")} />
      {page.sections.map((section, i) => (
        <ContentSection
          key={section.heading ?? i}
          label={section.label}
          heading={section.heading}
          body={section.body}
          items={section.items}
        />
      ))}
    </>
  );
}
