import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import PageHero from "@/components/page-hero";
import ContactForm from "@/components/contact-form";
import AnimateIn from "@/components/animate-in";

const page = getPage("contact");

export const metadata: Metadata = {
  title: `${page.title} - Performance Interpreting`,
  description: page.metaDescription,
};

export default function ContactPage() {
  const enquirySection = page.sections[0];

  return (
    <>
      <PageHero
        title={page.title}
        subtitle={page.subtitle}
        backgroundImage={page.heroImage}
      />

      {/* Enquiry types + form */}
      <section className="section-padding section-gap">
        <div className="mx-auto max-w-4xl">
          <AnimateIn>
            {enquirySection?.label && (
              <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark">
                {enquirySection.label}
              </p>
            )}
            {enquirySection?.heading && (
              <h2 className="mt-3 font-display text-2xl text-pi-ink md:text-3xl">
                {enquirySection.heading}
              </h2>
            )}
          </AnimateIn>

          {enquirySection && (
            <AnimateIn delay={100}>
              <div className="mt-6 space-y-4">
                {enquirySection.body.map((p, i) => (
                  <p key={i} className="text-base leading-relaxed text-pi-ink/80">
                    {p}
                  </p>
                ))}
              </div>
            </AnimateIn>
          )}

          {enquirySection?.items && (
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {enquirySection.items.map((item, i) => (
                <AnimateIn key={item.title} delay={i * 80}>
                  <div className="rounded-xl border border-pi-ink/10 bg-white p-5 shadow-sm">
                    <h3 className="text-base font-semibold text-pi-ink">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-pi-ink/70">
                      {item.description}
                    </p>
                  </div>
                </AnimateIn>
              ))}
            </div>
          )}

          <AnimateIn delay={200}>
            <div className="mt-12">
              <ContactForm />
            </div>
          </AnimateIn>
        </div>
      </section>

    </>
  );
}
