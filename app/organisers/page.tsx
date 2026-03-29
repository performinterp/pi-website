import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import PageHero from "@/components/page-hero";
import ContentSection from "@/components/content-section";
import ContactCta from "@/components/contact-cta";
import TestimonialQuote from "@/components/testimonial-quote";

const page = getPage("organisers");

export const metadata: Metadata = {
  title: `${page.title} — Performance Interpreting`,
  description: page.metaDescription,
};

export default function OrganisersPage() {
  return (
    <>
      <PageHero
        title={page.title}
        subtitle={page.subtitle}
        backgroundImage={page.heroImage}
      />

      {/* What We Offer */}
      <ContentSection
        label={page.sections[0].label}
        heading={page.sections[0].heading}
        body={page.sections[0].body}
        items={page.sections[0].items}
      />

      {/* Organiser quote */}
      <section className="section-padding pb-0">
        <TestimonialQuote
          quote="We couldn't be more grateful to Performance Interpreting for their incredible work. Their amazing team of BSL interpreters brought energy, passion, and accessibility to every performance."
          name="Adam"
          context="Event Organiser, Croydon PrideFest"
        />
      </section>

      {/* How It Works */}
      <ContentSection
        label={page.sections[1].label}
        heading={page.sections[1].heading}
        body={page.sections[1].body}
        items={page.sections[1].items}
      />

      {/* Why PI */}
      <ContentSection
        label={page.sections[2].label}
        heading={page.sections[2].heading}
        body={page.sections[2].body}
        items={page.sections[2].items}
      />

      {/* Attendee quote — shows organisers the impact */}
      <section className="section-padding pb-0">
        <TestimonialQuote
          quote="Absolutely amazing people. Wish they were at every gig. Really got everyone in the mood."
          name="John Williams"
          context="Concert attendee"
        />
      </section>

      <ContactCta />
    </>
  );
}
