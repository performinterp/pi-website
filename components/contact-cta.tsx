import Link from "next/link";
import { getContactCta } from "@/lib/content";

export default function ContactCta() {
  const { heading, subtitle, ctaLabel, ctaHref } = getContactCta();

  return (
    <section className="section-padding section-gap">
      <div className="rounded-2xl border border-pi-accent/20 bg-gradient-to-br from-pi-accent/10 to-pi-accent/5 p-10 text-center md:p-16">
        <h2 className="font-display text-2xl text-white md:text-3xl">{heading}</h2>
        <p className="mx-auto mt-4 max-w-md text-base text-white/70">{subtitle}</p>
        <div className="mt-8">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 rounded-full bg-pi-accent px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pi-accent/25 transition-all duration-200 hover:brightness-110 hover:shadow-pi-accent/40"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
