import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { getNavigation } from "@/lib/content";

function TikTokIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
    </svg>
  );
}

const SOCIAL_ICONS: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  Facebook,
  Instagram,
  LinkedIn: Linkedin,
  X: Twitter,
  TikTok: TikTokIcon,
};

export default function Footer() {
  const nav = getNavigation();

  return (
    <footer className="bg-pi-navy border-t border-white/10">
      {/* Main footer grid */}
      <div className="section-padding py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">

          {/* Column 1 - Brand */}
          <div className="sm:col-span-2 lg:col-span-1 lg:pr-8">
            <p className="font-display text-lg font-semibold text-white leading-snug">
              Performance Interpreting Ltd
            </p>
            <p className="mt-3 text-sm text-white/70 leading-relaxed">
              Award-winning BSL &amp; ISL interpreting for live events across the UK and Ireland.
            </p>

            {/* Social icons */}
            <div className="mt-6 flex items-center gap-3">
              {nav.socialLinks.map((social) => {
                const Icon = SOCIAL_ICONS[social.platform];
                if (!Icon) return null;
                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white/80 transition-all duration-300 ease-out hover:bg-white/20 hover:text-white"
                  >
                    <Icon size={15} strokeWidth={1.75} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2 - Navigate */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-pi-gold mb-3">
              Navigate
            </h3>
            <ul className="space-y-2.5">
              {nav.footerNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/75 leading-relaxed transition-colors duration-300 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - PI Network */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-pi-gold mb-3">
              PI Network
            </h3>
            <ul className="space-y-2.5">
              {nav.networkLinks.map((item) => (
                <li key={item.href}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/75 leading-relaxed transition-colors duration-300 hover:text-white"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-sm text-white/75 leading-relaxed transition-colors duration-300 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Accreditation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-pi-gold mb-3">
              Accreditation
            </h3>
            <p className="text-sm leading-relaxed text-white/75 mb-4">
              All PI interpreters and PI Academy courses are NRCPD registered.
            </p>
            <a
              href="https://www.nrcpd.org.uk/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit NRCPD - National Registers of Communication Professionals working with Deaf and Deafblind People"
              className="inline-block"
            >
              <Image
                src="/logos/nrcpd-logo.png"
                alt="NRCPD - National Registers of Communication Professionals working with Deaf and Deafblind People"
                width={180}
                height={58}
                className="block rounded-sm opacity-95 hover:opacity-100 transition-opacity duration-300"
              />
            </a>
          </div>

        </div>
      </div>

      {/* Bottom bar - combined company + copyright on a single subtle band */}
      <div className="bg-pi-deep/60 section-padding py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <p className="max-w-2xl text-xs leading-relaxed text-white/55">
            Performance Interpreting Ltd is registered in England and Wales. Company
            No. 10684652. VAT No. 265 5979 48. Registered office: Onega House, 112
            Main Road, Sidcup, United Kingdom, DA14 6NE.
          </p>
          <div className="flex flex-col gap-2 md:items-end md:text-right">
            <p className="text-xs text-white/65">
              &copy; {new Date().getFullYear()} Performance Interpreting Ltd
            </p>
            <div className="flex gap-4">
              <Link
                href="/privacy"
                className="text-xs text-white/65 transition-colors duration-300 hover:text-white"
              >
                Privacy Policy
              </Link>
              <Link
                href="/accessibility"
                className="text-xs text-white/65 transition-colors duration-300 hover:text-white"
              >
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
