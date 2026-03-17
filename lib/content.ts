import { readFileSync } from "fs";
import { join } from "path";
import type {
  HeroContent, Stat, Milestone, Client,
  Sector, AudienceCard, AboutTeaser,
  NavigationContent, PageContent, ContactCta,
  ConsultancyContent
} from "./types";

const contentDir = join(process.cwd(), "content");

function load<T>(path: string): T {
  const filePath = join(contentDir, path);
  const raw = readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export const getHero = () => load<HeroContent>("hero.json");
export const getStats = () => load<Stat[]>("stats.json");
export const getMilestones = () => load<Milestone[]>("milestones.json");
export const getClients = () => load<Client[]>("clients.json");
export const getSectors = () => load<Sector[]>("sectors.json");
export const getAudienceCards = () => load<AudienceCard[]>("audience-cards.json");
export const getAboutTeaser = () => load<AboutTeaser>("about-teaser.json");
export const getNavigation = () => load<NavigationContent>("navigation.json");
export const getConsultancy = () => load<ConsultancyContent>("consultancy.json");
export const getContactCta = () => load<ContactCta>("contact-cta.json");
export const getPage = (slug: string) => load<PageContent>(`pages/${slug}.json`);
