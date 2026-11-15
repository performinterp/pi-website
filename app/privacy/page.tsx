import type { Metadata } from "next";
import { getPage, getEasyRead } from "@/lib/content";
import PageHero from "@/components/page-hero";
import EasyReadSummary from "@/components/easy-read-summary";
import ContentSection from "@/components/content-section";
import { jsonLd } from "@/lib/json-ld";

const page = getPage("privacy");

export const metadata: Metadata = {
  title: `${page.title} - Performance Interpreting`,
  description: page.metaDescription,
};

export default function PrivacyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://performanceinterpreting.co.uk/" },
              { "@type": "ListItem", position: 2, name: "Privacy", item: "https://performanceinterpreting.co.uk/privacy/" },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": "https://performanceinterpreting.co.uk/privacy/#webpage",
            url: "https://performanceinterpreting.co.uk/privacy/",
            name: `${page.title} - Performance Interpreting`,
            description: page.metaDescription,
            inLanguage: "en-GB",
            datePublished: "2026-06-02",
            dateModified: "2026-10-09",
            isPartOf: { "@id": "https://performanceinterpreting.co.uk/#website" },
          }),
        }}
      />
      <PageHero title={page.title} subtitle={page.subtitle} />

      <EasyReadSummary page={getEasyRead("/privacy")} />
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
