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
              "@type": "Organization",
              name: "Performance Interpreting Ltd",
              url: "https://performanceinterpreting.co.uk",
              logo: "https://performanceinterpreting.co.uk/logos/hands-icon.png",
              description:
                "The UK's leading Deaf access consultancy and BSL interpreting service for live events including festivals, sport, arenas and entertainment.",
              foundingDate: "2017",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Onega House, 112 Main Road",
                addressLocality: "Sidcup",
                postalCode: "DA14 6NE",
                addressCountry: "GB",
              },
              contactPoint: {
                "@type": "ContactPoint",
                email: "admin@performanceinterpreting.co.uk",
                contactType: "customer service",
              },
              sameAs: [
                "https://www.facebook.com/performanceinterpreting",
                "https://instagram.com/performanceinterpreting",
                "https://uk.linkedin.com/company/performance-interpreting",
                "https://x.com/performinterp",
              ],
              vatID: "265597948",
              legalName: "Performance Interpreting Limited",
              taxID: "10684652",
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
