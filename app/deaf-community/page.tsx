import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import PageHero from "@/components/page-hero";
import ContentSection from "@/components/content-section";
import ContactCta from "@/components/contact-cta";
import AnimateIn from "@/components/animate-in";
import AppStoreButtons from "@/components/app-store-buttons";

const page = getPage("deaf-community");

export const metadata: Metadata = {
  title: `${page.title} — Performance Interpreting`,
  description: page.metaDescription,
};

export default function DeafCommunityPage() {
  // Last section is the app download CTA — render it specially
  const contentSections = page.sections.slice(0, -1);
  const appSection = page.sections[page.sections.length - 1];

  return (
    <>
      <PageHero
        title={page.title}
        subtitle={page.subtitle}
        backgroundImage={page.heroImage}
      />
      {contentSections.map((section, i) => (
        <ContentSection
          key={section.heading ?? i}
          label={section.label}
          heading={section.heading}
          body={section.body}
          items={section.items}
        />
      ))}

      {/* App download section with store buttons */}
      <section className="section-padding section-gap">
        <div className="mx-auto max-w-4xl">
          <AnimateIn>
            {appSection.label && (
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-accent">
                {appSection.label}
              </p>
            )}
            {appSection.heading && (
              <h2 className="mt-3 font-display text-2xl text-white md:text-3xl">
                {appSection.heading}
              </h2>
            )}
          </AnimateIn>
          <AnimateIn delay={100}>
            <div className="mt-6 space-y-4">
              {appSection.body.map((paragraph, i) => (
                <p key={i} className="text-base leading-relaxed text-white/60">
                  {paragraph}
                </p>
              ))}
            </div>
          </AnimateIn>
          <AnimateIn delay={200}>
            <div className="mt-8">
              <AppStoreButtons />
            </div>
          </AnimateIn>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
