import Link from "next/link";
import { getContactCta } from "@/lib/content";

export default function ContactCta() {
  const { heading, subtitle, ctaLabel, ctaHref } = getContactCta();

  return (
    <section className="section-padding section-gap">
      <div className="bg-pi-accent/10 border border-pi-accent/20 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="font-display text-2xl text-white">{heading}</h2>
        <p className="mt-3 text-pi-muted">{subtitle}</p>
        <div className="mt-8">
          <Link
            href={ctaHref}
            className="inline-block bg-pi-accent text-white rounded-lg px-8 py-3 hover:brightness-110 transition font-medium"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
