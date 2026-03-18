import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import PageHero from "@/components/page-hero";
import ContentSection from "@/components/content-section";
import ContactCta from "@/components/contact-cta";

const page = getPage("interpreters");

export const metadata: Metadata = {
  title: `${page.title} — Performance Interpreting`,
  description: page.metaDescription,
};

export default function InterpretersPage() {
  return (
    <>
      <PageHero
        title={page.title}
        subtitle={page.subtitle}
        backgroundImage={page.heroImage}
      />
      {page.sections.map((section, i) => (
        <ContentSection
          key={section.heading ?? i}
          label={section.label}
          heading={section.heading}
          body={section.body}
          items={section.items}
        />
      ))}
      <ContactCta />
    </>
  );
}
