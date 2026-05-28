import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import PageHero from "@/components/page-hero";
import ContentSection from "@/components/content-section";
import ContactCta from "@/components/contact-cta";

const page = getPage("about");

export const metadata: Metadata = {
  title: `${page.title} - Performance Interpreting`,
  description: page.metaDescription,
};

const SITE = "https://performanceinterpreting.co.uk";

export default function AboutPage() {
  return (
    <>
      {/* Article schema — agents asked 'tell me about PI' or 'what's PI's
          story' can extract the dated narrative directly */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "@id": `${SITE}/about/#aboutpage`,
            url: `${SITE}/about/`,
            name: page.title,
            description: page.metaDescription,
            mainEntity: { "@id": `${SITE}/#organization` },
            primaryImageOfPage: `${SITE}${page.heroImage}`,
          }),
        }}
      />

      {/* Person schema for Marie Pascall — founder profile so agents can
          answer 'who founded Performance Interpreting?' with structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": `${SITE}/#marie-pascall`,
            name: "Marie Pascall",
            jobTitle: "Founder",
            description:
              "Founder of Performance Interpreting. Born with unilateral deafness, Marie built PI from the inside out — designing access from the audience side rather than borrowing process from elsewhere. Gave evidence in the landmark Little Mix BSL case that established BSL access at live events as a legal requirement under the Equality Act 2010.",
            worksFor: { "@id": `${SITE}/#organization` },
            founderOf: { "@id": `${SITE}/#organization` },
            url: `${SITE}/about/`,
            knowsAbout: [
              "BSL interpreting",
              "Deaf access consultancy",
              "live event accessibility",
              "Equality Act 2010 BSL access",
              "performance interpreting",
            ],
            nationality: { "@type": "Country", name: "United Kingdom" },
          }),
        }}
      />

      {/* Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "About", item: `${SITE}/about/` },
            ],
          }),
        }}
      />

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
          stats={section.stats}
          image={section.image}
          imageAlt={section.imageAlt}
          variant={section.variant}
        />
      ))}
      <ContactCta />
    </>
  );
}
