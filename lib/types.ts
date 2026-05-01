export interface HeroContent {
  tagline: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  posterImage: string;
  videoSrc?: string;
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export interface Milestone {
  icon: string;
  title: string;
  description: string;
  accentColor: "gold" | "accent";
}

export interface Client {
  name: string;
  logo: string;
  url?: string;
}

export interface Sector {
  name: string;
  photo: string;
  clients: string[];
  description: string;
  size: "large" | "small";
}

export interface AudienceCard {
  icon: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  external?: boolean;
}

export interface AboutTeaser {
  label: string;
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  photo: string;
}

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface NavigationContent {
  mainNav: NavItem[];
  ctaButton: { label: string; href: string };
  footerNav: NavItem[];
  networkLinks: NavItem[];
  socialLinks: { platform: string; url: string; label: string }[];
}

export interface ConsultancyContent {
  label: string;
  heading: string;
  body: string;
  services: { icon: string; title: string; description: string }[];
  ctaLabel: string;
  ctaHref: string;
}

export interface ContactCta {
  heading: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
}

export type InterpreterStatus = "booked" | "on-request";

export interface Event {
  name: string;
  rawDate: string;
  isoDate: string;
  venue: string;
  city: string;
  time: string;
  interpreters: string;
  interpretation: string;
  language: "BSL" | "ISL" | "BSL_AND_ISL" | "OTHER";
  category: string;
  imageUrl: string;
  eventUrl: string;
  status: string;
  source: string;
  description: string;
  format: string;
  soldOut: boolean;
  addedDate: string | null;
  interpreterStatus: InterpreterStatus;
  interpreterStatusLabel: string;
}

export interface PageContent {
  title: string;
  subtitle: string;
  heroImage: string;
  metaDescription: string;
  sections: {
    heading?: string;
    label?: string;
    body: string[];
    items?: { title: string; description: string; url?: string }[];
    stats?: { number: string; label: string }[];
    image?: string;
    imageAlt?: string;
    variant?: "achievements" | "press" | "stats";
    ctaLabel?: string;
    ctaHref?: string;
    ctaExternal?: boolean;
  }[];
}
