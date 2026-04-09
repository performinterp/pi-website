import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Nav from "@/components/nav";
import CookieBanner from "@/components/cookie-banner";

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
  title: "Performance Interpreting — BSL & ISL for Live Events",
  description:
    "The UK's award-winning BSL and ISL interpreting service. Connecting Deaf audiences to unforgettable live experiences at festivals, sport, arenas and entertainment.",
  openGraph: {
    title: "Performance Interpreting — BSL & ISL for Live Events",
    description:
      "The UK's award-winning BSL and ISL interpreting service. Connecting Deaf audiences to unforgettable live experiences at festivals, sport, arenas and entertainment.",
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
                "The UK and Ireland's leading Deaf access consultancy and BSL & ISL interpreting service for live events including festivals, sport, arenas and entertainment. Award-winning, NRCPD-registered interpreters. 500+ events per year, thousands delivered in total.",
              foundingDate: "2017",
              telephone: "+44 20 3488 2308",
              email: "admin@performanceinterpreting.co.uk",
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
                email: "admin@performanceinterpreting.co.uk",
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
                "Signature Hall of Fame",
                "Landmark Little Mix BSL Legal Precedent",
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
                "https://app.performanceinterpreting.co.uk",
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
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      "@id": "https://performanceinterpreting.co.uk/#access-consultancy",
                      name: "Deaf Access Consultancy",
                      description: "End-to-end Deaf access planning for live events — legal compliance advisory, access audits, interpreter team design, production coordination and on-site management.",
                      serviceType: "Accessibility Consulting",
                      provider: { "@id": "https://performanceinterpreting.co.uk/#organization" },
                      areaServed: [
                        { "@type": "Country", name: "United Kingdom" },
                        { "@type": "Country", name: "Ireland" },
                      ],
                    },
                    priceSpecification: {
                      "@type": "PriceSpecification",
                      priceCurrency: "GBP",
                      description: "Consultancy packages tailored to event scale and requirements. Contact for a quote.",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      "@id": "https://performanceinterpreting.co.uk/#full-access-package",
                      name: "Full Deaf Access Package",
                      description: "Complete access coordination including BSL & ISL interpreting, live captions and induction loop systems — tailored to your venue and audience.",
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
                      name: "PI Academy — Interpreter Training",
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
      </body>
    </html>
  );
}
