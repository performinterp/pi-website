import { z } from "zod";

// Reject CR/LF/NUL — blocks email-header injection in name/email fields.
const NoHeaderInjection = z
  .string()
  .refine((s) => !/[\r\n\x00]/.test(s), { message: "Invalid characters" });

// Stricter for display-name fields used in email subject/From: also reject
// angle-bracket lookalikes (ASCII + Unicode variants) and quotes to prevent
// visually-misleading subject lines (e.g. `Resend Billing <support@...>`
// injected via the name field). NFKC normalize first so fullwidth `＜＞`
// decomposes to ASCII `<>` and gets caught. Math angle `⟨⟩`, CJK `〈〉`,
// and guillemets `‹›«»` are distinct codepoints (not NFKC-equivalent to
// ASCII) so blocked explicitly.
const SafeDisplayName = z
  .string()
  .transform((s) => s.normalize("NFKC"))
  .refine((s) => !/[\r\n\x00<>"⟨⟩〈〉〈〉‹›«»]/.test(s), { message: "Invalid characters" });

// Pipe order: length cap runs BEFORE the refinement so a multi-MB hostile
// payload doesn't get regex-scanned in full before length is enforced.
const Email = z.string().max(254).pipe(NoHeaderInjection).pipe(z.email());
const SafeName = z.string().max(100).pipe(SafeDisplayName).pipe(z.string().trim().min(1));

// Honeypot field — humans leave it empty; bots fill every input.
// Accept any string so the route can silently 200 on non-empty values
// rather than 400'ing (which would let bots detect+tune around the trap).
const Honeypot = z.string().max(1000).optional();

// The on-page form only offers four enum values, but other integrations
// (cached page versions, partner referrals, future internal tools) may
// post custom enquiry_type values. Accept any short non-empty string so
// a regression to the original behaviour ("any string, labelled as
// enquiryLabels[v] || v") doesn't 400 legitimate non-form submitters.
// Length capped to bound subject-line and email-text growth.
const EnquiryType = z.string().trim().min(1).max(50);

export const ContactSchema = z.object({
  name: SafeName,
  email: Email,
  message: z.string().max(5000).pipe(z.string().trim().min(1)),
  enquiry_type: EnquiryType,
  urgent: z.boolean().optional(),
  consent: z.boolean().optional(),
  website: Honeypot,
});

export const ChatHandoffSchema = z.object({
  name: SafeName,
  email: Email,
  message: z.string().max(5000).pipe(z.string().trim().min(1)),
  summary: z
    .object({
      topic: z.string().max(200).optional(),
      tried: z.string().max(2000).optional(),
      question: z.string().max(2000).optional(),
    })
    .optional(),
  transcript: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        // 30000 chars (~7500 words) is generous for one chat turn — a long
        // signed-explainer reply with embedded catalogue listing and 3-para
        // context can plausibly approach 10000. Bumped from 10000 to avoid
        // 400-rejecting legitimate handoffs and silently dropping them.
        content: z.string().max(30000),
      })
    )
    .max(100)
    .optional(),
  website: Honeypot,
});

// pi-feedback-uploads stores videos in Vercel Blob; returned URL host is
// <tenant>.public.blob.vercel-storage.com. The .public.blob.vercel-storage.com
// domain is multi-tenant (any Vercel customer can publish there), so the
// host-suffix check alone lets an attacker upload phishing content to their
// own tenant and submit that URL — bypassing the A-H4 fix. Lock down to the
// upload service's KNOWN path pattern: `/feedback/<ISO-timestamp>-<8 hex>.<ext>`
// (see pi-feedback-uploads/api/upload.js line 142, plus Vercel Blob's optional
// random-suffix appended after the extension).
const ALLOWED_UPLOAD_HOSTS = ["pi-feedback-uploads.vercel.app"];
const ALLOWED_UPLOAD_SUFFIXES = [".public.blob.vercel-storage.com"];
const UPLOAD_PATH_PATTERN =
  /^\/feedback\/\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z-[a-f0-9]{8}\.(mp4|mov|webm)(-[A-Za-z0-9]+)?$/;

export const VideoFeedbackSchema = z.object({
  url: z
    .url()
    .refine(
      (url) => {
        try {
          const u = new URL(url);
          if (u.protocol !== "https:") return false;
          // Host gate.
          const hostOk =
            ALLOWED_UPLOAD_HOSTS.includes(u.hostname) ||
            ALLOWED_UPLOAD_SUFFIXES.some((s) => u.hostname.endsWith(s));
          if (!hostOk) return false;
          // Path gate — restricts the multi-tenant Vercel Blob domain to
          // URLs that match the upload service's exact filename template.
          // An attacker would have to (a) own a Vercel tenant AND (b) be
          // able to upload at this exact path pattern, narrowing the
          // phishing-via-trusted-domain vector substantially.
          return UPLOAD_PATH_PATTERN.test(u.pathname);
        } catch {
          return false;
        }
      },
      { message: "URL must be on the allowlisted upload domain" }
    ),
});

// UIMessage shape from `ai` package: { role: 'user'|'assistant'|'system',
// parts: Array<{type: string, ...}> }. We validate just enough that the
// route's downstream `messages.find(m => m.role === ...)` and
// `lastUser.parts.filter(...)` can't crash on malformed input (null
// element, missing parts, etc.). `parts` items are kept as z.unknown()
// because the AI SDK has many part shapes (text, file, tool-call, …) —
// convertToModelMessages handles the rest.
const UIMessagePart = z.object({ type: z.string() }).passthrough();
const UIMessageLike = z
  .object({
    role: z.enum(["user", "assistant", "system"]),
    parts: z.array(UIMessagePart).max(200),
  })
  .passthrough();

export const ChatBodySchema = z.object({
  messages: z.array(UIMessageLike).min(1).max(50),
  audience: z
    .enum(["deaf", "organiser", "interpreter", "skipped"])
    .nullable()
    .optional(),
});

export function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c]!
  );
}
