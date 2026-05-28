import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Nav from "@/components/nav";
import CookieBanner from "@/components/cookie-banner";
import AppPromoBanner from "@/components/app-promo-banner";
import Assistant from "@/components/assistant";
import { EasyReadProvider, EASY_READ_INIT_SCRIPT } from "@/lib/easy-read";
import { Analytics } from "@vercel/analytics/next";

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display-loaded",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body-loaded",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://performanceinterpreting.co.uk"),
  title: "Performance Interpreting - BSL & ISL for Live Events",
  description:
    "The UK and Ireland's largest performance interpreting provider. Award-winning BSL & ISL access across festivals, sport, arenas, theatre, broadcast and beyond.",
  openGraph: {
    title: "Performance Interpreting - BSL & ISL for Live Events",
    description:
      "The UK and Ireland's largest performance interpreting provider. Award-winning BSL & ISL access across festivals, sport, arenas, theatre, broadcast and beyond.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSerifDisplay.variable} ${dmSans.variable}`}
    >
      <head>
        {/* Set Easy-Read data attribute before paint to prevent flash of
            standard content for users whose preference is Easy-Read. */}
        <script dangerouslySetInnerHTML={{ __html: EASY_READ_INIT_SCRIPT }} />
      </head>
      <body className="font-body antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["Organization", "LocalBusiness"],
              "@id": "https://performanceinterpreting.co.uk/#organization",
              name: "Performance Interpreting Ltd",
              legalName: "Performance Interpreting Limited",
              url: "https://performanceinterpreting.co.uk",
              logo: "https://performanceinterpreting.co.uk/logos/hands-icon.png",
              image: "https://performanceinterpreting.co.uk/images/concert.jpg",
              description:
                "The UK and Ireland's largest performance interpreting provider, working across music, sport, theatre, festivals, broadcast, political and corporate domains. Award-winning, NRCPD-registered. 500+ events per year, thousands delivered in total. Inaugural Signature Hall of Fame inductee.",
              slogan: "The UK and Ireland's largest performance interpreting provider",
              foundingDate: "2017",
              telephone: "+44 20 3488 2308",
              email: "enquiries@performanceinterpreting.co.uk",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Onega House, 112 Main Road",
                addressLocality: "Sidcup",
                addressRegion: "Greater London",
                postalCode: "DA14 6NE",
                addressCountry: "GB",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 51.4274,
                longitude: 0.1033,
              },
              areaServed: [
                { "@type": "Country", name: "United Kingdom" },
                { "@type": "Country", name: "Ireland" },
              ],
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  opens: "09:00",
                  closes: "18:00",
                },
              ],
              priceRange: "££-£££",
              contactPoint: {
                "@type": "ContactPoint",
                email: "enquiries@performanceinterpreting.co.uk",
                telephone: "+44 20 3488 2308",
                contactType: "customer service",
                availableLanguage: ["English", "British Sign Language", "Irish Sign Language"],
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "5.0",
                bestRating: "5",
                worstRating: "1",
                ratingCount: "33",
                reviewCount: "33",
              },
              award: [
                "The UK and Ireland's largest performance interpreting provider, working across music, sport, theatre, festivals, broadcast and political domains",
                "Inaugural Signature Hall of Fame inductee (2022) — highest recognition in the BSL interpreting industry",
                "Established legal precedent for BSL access at live events through testimony in the 2019 Little Mix case under the Equality Act 2010",
                "Appointed Deaf Access provider for the 2023 King's Coronation and subsequent Royal events and state ceremonies — managing BSL interpreting, hearing loops and live captions across every site and screen",
                "Proactive BSL access standard at Wembley Stadium — every concert by default since September 2021",
                "Launched the PI Events App in 2026 — first free Deaf-community events app from a UK interpreting service",
              ],
              hasCredential: [
                {
                  "@type": "EducationalOccupationalCredential",
                  credentialCategory: "Professional Registration",
                  name: "NRCPD Registered Interpreters",
                },
              ],
              memberOf: {
                "@type": "Organization",
                name: "NRCPD",
                url: "https://www.nrcpd.org.uk",
              },
              knowsAbout: [
                "BSL interpreting",
                "ISL interpreting",
                "Deaf access consultancy",
                "live event interpreting",
                "festival interpreting",
                "sport interpreting",
                "Equality Act 2010 BSL access",
              ],
              sameAs: [
                "https://www.facebook.com/performanceinterpreting",
                "https://instagram.com/performanceinterpreting",
                "https://uk.linkedin.com/company/performance-interpreting",
                "https://x.com/performinterp",
                "https://academy.performanceinterpreting.co.uk",
                "https://courses.performanceinterpreting.co.uk",
              ],
              vatID: "GB265597948",
              taxID: "10684652",
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Interpreting & Access Services",
                itemListElement: [
                  {
                    "@type": "OfferCatalog",
                    name: "BSL & ISL Interpreting",
                    itemListElement: [
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Service",
                          "@id": "https://performanceinterpreting.co.uk/#bsl-interpreting",
                          name: "BSL Interpreting for Live Events",
                          description: "British Sign Language interpreting for concerts, festivals, sport, theatre, comedy, awards and corporate events across the UK.",
                          serviceType: "Sign Language Interpreting",
                          provider: { "@id": "https://performanceinterpreting.co.uk/#organization" },
                          areaServed: { "@type": "Country", name: "United Kingdom" },
                        },
                        priceSpecification: {
                          "@type": "PriceSpecification",
                          priceCurrency: "GBP",
                          description: "Pricing based on event type, duration and interpreter team size. Contact for a tailored quote.",
                        },
                      },
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Service",
                          "@id": "https://performanceinterpreting.co.uk/#isl-interpreting",
                          name: "ISL Interpreting for Live Events",
                          description: "Irish Sign Language interpreting for concerts, festivals, sport and live entertainment across Ireland and Northern Ireland.",
                          serviceType: "Sign Language Interpreting",
                          provider: { "@id": "https://performanceinterpreting.co.uk/#organization" },
                          areaServed: { "@type": "Country", name: "Ireland" },
                        },
                        priceSpecification: {
                          "@type": "PriceSpecification",
                          priceCurrency: "EUR",
                          description: "Pricing based on event type, duration and interpreter team size. Contact for a tailored quote.",
                        },
                      },
                    ],
                  },
                  {
                    "@type": "OfferCatalog",
                    name: "Deaf Access Consultancy",
                    description:
                      "End-to-end Deaf access planning for live events. Most agencies supply interpreters; we design the entire access experience.",
                    itemListElement: [
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Service",
                          "@id": "https://performanceinterpreting.co.uk/#legal-compliance-advisory",
                          name: "Legal & Compliance Advisory",
                          description:
                            "Advice on your obligations under the Equality Act 2010 (England, Scotland, Wales), the Disability Discrimination Act 1995 (Northern Ireland) and the Irish Sign Language Act 2017. PI helped establish the legal precedent that BSL access at live events is a requirement, not a courtesy.",
                          serviceType: "Accessibility Compliance Advisory",
                          provider: { "@id": "https://performanceinterpreting.co.uk/#organization" },
                          areaServed: [
                            { "@type": "Country", name: "United Kingdom" },
                            { "@type": "Country", name: "Ireland" },
                          ],
                          url: "https://performanceinterpreting.co.uk/organisers/",
                        },
                      },
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Service",
                          "@id": "https://performanceinterpreting.co.uk/#access-audits",
                          name: "Access Audits",
                          description:
                            "Independent assessment of your current Deaf access provision with practical recommendations to develop an equitable access service for Deaf and Deafblind customers.",
                          serviceType: "Accessibility Audit",
                          provider: { "@id": "https://performanceinterpreting.co.uk/#organization" },
                          areaServed: [
                            { "@type": "Country", name: "United Kingdom" },
                            { "@type": "Country", name: "Ireland" },
                          ],
                          url: "https://performanceinterpreting.co.uk/organisers/",
                        },
                      },
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Service",
                          "@id": "https://performanceinterpreting.co.uk/#interpreter-team-design",
                          name: "Interpreter Team Design",
                          description:
                            "The right number of interpreters, the right specialisms, the right rotation schedule. We design teams around your event — not the other way around.",
                          serviceType: "Interpreter Team Coordination",
                          provider: { "@id": "https://performanceinterpreting.co.uk/#organization" },
                          areaServed: [
                            { "@type": "Country", name: "United Kingdom" },
                            { "@type": "Country", name: "Ireland" },
                          ],
                          url: "https://performanceinterpreting.co.uk/organisers/",
                        },
                      },
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Service",
                          "@id": "https://performanceinterpreting.co.uk/#production-coordination",
                          name: "Production Coordination",
                          description:
                            "Sight-line placement, lighting requirements, stage positioning, comms with your production crew. We handle the technical integration so interpreting actually works on the day.",
                          serviceType: "Event Production Accessibility",
                          provider: { "@id": "https://performanceinterpreting.co.uk/#organization" },
                          areaServed: [
                            { "@type": "Country", name: "United Kingdom" },
                            { "@type": "Country", name: "Ireland" },
                          ],
                          url: "https://performanceinterpreting.co.uk/organisers/",
                        },
                      },
                    ],
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      "@id": "https://performanceinterpreting.co.uk/#full-access-package",
                      name: "Full Deaf Access Package",
                      description: "Complete access coordination including BSL & ISL interpreting, live captions and induction loop systems - tailored to your venue and audience.",
                      serviceType: "Accessibility Services",
                      provider: { "@id": "https://performanceinterpreting.co.uk/#organization" },
                      areaServed: [
                        { "@type": "Country", name: "United Kingdom" },
                        { "@type": "Country", name: "Ireland" },
                      ],
                    },
                    priceSpecification: {
                      "@type": "PriceSpecification",
                      priceCurrency: "GBP",
                      description: "Bespoke packages based on venue, audience size and access requirements. Contact for a tailored quote.",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      "@id": "https://performanceinterpreting.co.uk/#training",
                      name: "PI Academy - Interpreter Training",
                      description: "NRCPD-approved CPD courses, mentoring and professional development for sign language interpreters specialising in live events.",
                      serviceType: "Professional Training",
                      provider: { "@id": "https://performanceinterpreting.co.uk/#organization" },
                      url: "https://academy.performanceinterpreting.co.uk",
                      areaServed: [
                        { "@type": "Country", name: "United Kingdom" },
                        { "@type": "Country", name: "Ireland" },
                      ],
                    },
                  },
                ],
              },
            }),
          }}
        />
        <EasyReadProvider>
          <a
            href="#main-content"
            className="fixed left-4 top-4 z-50 -translate-y-20 rounded-md bg-pi-accent px-4 py-2 text-sm font-semibold text-white transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-pi-accent focus:ring-offset-2 focus:ring-offset-pi-navy"
          >
            Skip to content
          </a>

          <Nav />

          <main id="main-content">{children}</main>

          <Footer />
          <CookieBanner />
          <AppPromoBanner />
          <Assistant />
        </EasyReadProvider>
        <Analytics />
      </body>
    </html>
  );
}
