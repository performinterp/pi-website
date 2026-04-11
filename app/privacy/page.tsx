import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import PageHero from "@/components/page-hero";
import ContentSection from "@/components/content-section";

const page = getPage("privacy");

export const metadata: Metadata = {
  title: `${page.title} - Performance Interpreting`,
  description: page.metaDescription,
};

export default function PrivacyPage() {
  return (
    <>
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
