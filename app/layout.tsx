import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Nav from "@/components/nav";

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
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-50 -translate-y-20 rounded-md bg-pi-accent px-4 py-2 text-sm font-semibold text-white transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-pi-accent focus:ring-offset-2 focus:ring-offset-pi-navy"
        >
          Skip to content
        </a>

        <Nav />

        <main id="main-content">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
