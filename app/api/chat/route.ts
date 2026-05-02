import { anthropic } from "@ai-sdk/anthropic";
import { convertToModelMessages, stepCountIs, streamText, tool, type UIMessage } from "ai";
import { z } from "zod";
import { getKnowledgeBundle } from "@/lib/assistant-knowledge";
import { fetchEvents } from "@/lib/events";
import { eventSlug } from "@/lib/event-slug";
import { getVenueContact, getVenueDetails, getVenueFeatures, getAccessFeatureDef } from "@/lib/venues";

export const runtime = "nodejs";
export const maxDuration = 30;

const ORIGIN = "https://performanceinterpreting.co.uk";

interface Body {
  messages: UIMessage[];
}

const tools = {
  searchEvents: tool({
    description:
      "Search the live events list. ALWAYS call this for any question that mentions a specific artist, event name, date, venue, or interpreter (e.g. 'when's Rebekah Spencer next interpreting?', 'is The O2's Ariana Grande gig BSL booked?'). The query field matches across event name, venue, city AND interpreter names. Returns up to 5 most-relevant matches sorted by date.",
    inputSchema: z.object({
      query: z
        .string()
        .optional()
        .describe(
          "Free text — artist name, event title, OR interpreter name. Matches partial. Use the user's exact spelling."
        ),
      interpreter: z
        .string()
        .optional()
        .describe("Interpreter name. Use this when the question is specifically about an interpreter."),
      city: z.string().optional().describe("Filter by city."),
      venue: z.string().optional().describe("Filter by venue name (partial match)."),
      status: z
        .enum(["booked", "on-request", "any"])
        .optional()
        .describe(
          "Interpreter status — booked = interpreter confirmed, on-request = no interpreter yet but venue accepts requests."
        ),
    }),
    execute: async ({ query, interpreter, city, venue, status }) => {
      const events = await fetchEvents();
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      const q = (query ?? "").toLowerCase().trim();
      const interpQ = (interpreter ?? "").toLowerCase().trim();
      const cityQ = (city ?? "").toLowerCase().trim();
      const venueQ = (venue ?? "").toLowerCase().trim();
      const filtered = events
        .filter((e) => new Date(`${e.isoDate}T00:00:00Z`) >= today)
        .filter((e) => {
          if (q) {
            const hay = `${e.name} ${e.venue} ${e.city} ${e.interpreters}`.toLowerCase();
            if (!hay.includes(q)) return false;
          }
          if (interpQ && !e.interpreters.toLowerCase().includes(interpQ)) return false;
          if (cityQ && !e.city.toLowerCase().includes(cityQ)) return false;
          if (venueQ && !e.venue.toLowerCase().includes(venueQ)) return false;
          if (status && status !== "any" && e.interpreterStatus !== status) return false;
          return true;
        })
        .slice(0, 5);

      return {
        count: filtered.length,
        events: filtered.map((e) => ({
          name: e.name,
          date: e.isoDate,
          venue: e.venue,
          city: e.city,
          interpreterStatus: e.interpreterStatus,
          interpreters: e.interpreters || null,
          language: e.language,
          soldOut: e.soldOut,
          detailUrl: `${ORIGIN}/events/${eventSlug(e)}`,
        })),
      };
    },
  }),

  lookupVenue: tool({
    description:
      "Look up a venue's accessibility info: access email, SignVideo BSL relay URL, address, Google Maps link, and accessible facilities.",
    inputSchema: z.object({
      venue: z.string().describe("Venue name, e.g. 'The O2', 'Wembley Stadium'."),
    }),
    execute: async ({ venue }) => {
      const contact = getVenueContact(venue);
      const details = getVenueDetails(venue);
      const featureKeys = getVenueFeatures(venue);
      const features = featureKeys
        .map((k) => {
          const def = getAccessFeatureDef(k);
          return def ? def.label : null;
        })
        .filter(Boolean);
      if (!contact && !details && features.length === 0) {
        return { found: false, venue };
      }
      return {
        found: true,
        venue,
        accessEmail: contact?.email || null,
        signVideoUrl: contact?.vrs || null,
        signVideoLabel: contact?.vrsLabel || null,
        bslGuaranteed: contact?.bslGuaranteed || false,
        note: contact?.note || null,
        address:
          details &&
          [details.address, details.address2, details.city, details.postcode]
            .filter(Boolean)
            .join(", "),
        mapsUrl: details?.mapsUrl || null,
        accessFeatures: features,
      };
    },
  }),

  buildRequestLink: tool({
    description:
      "Generate a /events/request URL pre-filled with event/venue/date so the user lands on the email drafter ready to go. Use after asking the user if they'd like a request set up.",
    inputSchema: z.object({
      eventName: z.string(),
      venueName: z.string().optional(),
      date: z.string().optional().describe("ISO date YYYY-MM-DD."),
    }),
    execute: async ({ eventName, venueName, date }) => {
      const params = new URLSearchParams();
      params.set("event", eventName);
      if (venueName) params.set("venue", venueName);
      if (date) params.set("date", date);
      return { url: `${ORIGIN}/events/request?${params.toString()}` };
    },
  }),
};

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Assistant is not configured." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const { messages } = (await req.json()) as Body;
  const knowledge = getKnowledgeBundle();
  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: anthropic("claude-haiku-4-5"),
    system: knowledge,
    providerOptions: {
      anthropic: {
        cacheControl: { type: "ephemeral" },
      },
    },
    messages: modelMessages,
    temperature: 0.2,
    tools,
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}
