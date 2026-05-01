import { anthropic } from "@ai-sdk/anthropic";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { getKnowledgeBundle } from "@/lib/assistant-knowledge";

export const runtime = "nodejs";
export const maxDuration = 30;

interface Body {
  messages: UIMessage[];
}

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
        // Cache the long static knowledge bundle. Repeat reads pay ~10% of
        // the input cost, so a hot site is very cheap.
        cacheControl: { type: "ephemeral" },
      },
    },
    messages: modelMessages,
    temperature: 0.4,
  });

  return result.toUIMessageStreamResponse();
}
