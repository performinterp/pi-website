import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import PageHero from "@/components/page-hero";
import ContentSection from "@/components/content-section";

const page = getPage("app-privacy");

export const metadata: Metadata = {
  title: `${page.title} - Performance Interpreting`,
  description: page.metaDescription,
};

export default function AppPrivacyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://performanceinterpreting.co.uk/" },
              { "@type": "ListItem", position: 2, name: "App Privacy", item: "https://performanceinterpreting.co.uk/app-privacy/" },
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
            "@id": "https://performanceinterpreting.co.uk/app-privacy/#webpage",
            url: "https://performanceinterpreting.co.uk/app-privacy/",
            name: `${page.title} - Performance Interpreting`,
            description: page.metaDescription,
            inLanguage: "en-GB",
            datePublished: "2026-07-11",
            dateModified: "2026-07-11",
            isPartOf: { "@id": "https://performanceinterpreting.co.uk/#website" },
          }),
        }}
      />
      <PageHero title={page.title} subtitle={page.subtitle} />
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
