// Limits on what one PIPA chat request can carry and cost. Anthropic bills
// per token, and the widget resends the whole conversation every turn, so
// these caps are what bound the bill. No imports, so the chat widget can
// share them without pulling zod into every page.

/** Longest message a visitor can type. The widget's input enforces it too. */
export const CHAT_USER_TEXT_MAX = 2_000;

/** Longest text part an assistant turn may carry back. Replies are capped at
 *  CHAT_MAX_OUTPUT_TOKENS per step (about 4,000 characters). */
export const CHAT_ASSISTANT_TEXT_MAX = 8_000;

/** Largest tool call plus its result, as JSON. Real ones are 1–3KB. */
export const CHAT_TOOL_PART_MAX = 8_000;

/** How much history reaches the model: the newest messages only. */
export const CHAT_HISTORY_MAX_MESSAGES = 20;
export const CHAT_HISTORY_MAX_CHARS = 40_000;

/** Reply length cap per model step. Without it the provider default is
 *  the model's maximum output, many thousands of tokens. */
export const CHAT_MAX_OUTPUT_TOKENS = 1_024;

/** PIPA's tools. Assistant turns echo their calls back, so the schema only
 *  accepts these names, and the route checks its tool set matches. */
export const PIPA_TOOL_NAMES = [
  "searchEvents",
  "lookupVenue",
  "getSignedExplainer",
  "buildRequestLink",
] as const;
export type PipaToolName = (typeof PIPA_TOOL_NAMES)[number];

/**
 * Keep the newest messages only, so a long conversation costs no more per
 * turn than a short one. When anything is dropped, the history restarts on
 * a visitor turn so the model never sees a reply without its question.
 * Tool calls live inside their assistant message, so cutting between
 * messages never separates a call from its result.
 */
export function trimChatHistory<T extends { role: string }>(messages: T[]): T[] {
  let start = Math.max(0, messages.length - CHAT_HISTORY_MAX_MESSAGES);
  const sizes = messages.map((m) => JSON.stringify(m).length);
  let total = sizes.slice(start).reduce((a, b) => a + b, 0);
  while (start < messages.length - 1 && total > CHAT_HISTORY_MAX_CHARS) {
    total -= sizes[start];
    start++;
  }
  if (start > 0) {
    while (start < messages.length - 1 && messages[start].role !== "user") start++;
  }
  return messages.slice(start);
}
