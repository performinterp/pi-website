import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import PageHero from "@/components/page-hero";
import ContentSection from "@/components/content-section";
import ContactCta from "@/components/contact-cta";
import TestimonialQuote from "@/components/testimonial-quote";

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

      {/* Working with PI */}
      <ContentSection
        label={page.sections[0].label}
        heading={page.sections[0].heading}
        body={page.sections[0].body}
        items={page.sections[0].items}
      />

      {/* What We Look For */}
      <ContentSection
        label={page.sections[1].label}
        heading={page.sections[1].heading}
        body={page.sections[1].body}
        items={page.sections[1].items}
      />

      {/* PI Academy */}
      <ContentSection
        label={page.sections[2].label}
        heading={page.sections[2].heading}
        body={page.sections[2].body}
        items={page.sections[2].items}
        ctaLabel={page.sections[2].ctaLabel}
        ctaHref={page.sections[2].ctaHref}
        ctaExternal={page.sections[2].ctaExternal}
      />

      {/* Academy trainee quote */}
      <section className="section-padding pb-0">
        <TestimonialQuote
          quote="I attended the two day festival training weekend and was absolutely blown away by how much I came away with! They created a really supportive and safe space."
          name="Leah Jewiss"
          context="PI Academy participant"
        />
      </section>

      {/* Second Academy quote */}
      <section className="section-padding pb-0">
        <TestimonialQuote
          quote="The training offered by Performance Interpreting is invaluable. The trainers made the whole programme so welcoming. I enjoyed pushing through the boundaries of my comfort zone."
          name="Hayley Wiseman"
          context="PI Academy participant"
        />
      </section>

      {/* Get in Touch */}
      <ContentSection
        label={page.sections[3].label}
        heading={page.sections[3].heading}
        body={page.sections[3].body}
        items={page.sections[3].items}
      />

      <ContactCta />
    </>
  );
}
