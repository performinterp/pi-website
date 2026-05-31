import { z } from "zod";

// Reject CR/LF/NUL — blocks email-header injection in name/email fields.
const NoHeaderInjection = z
  .string()
  .refine((s) => !/[\r\n\x00]/.test(s), { message: "Invalid characters" });

const Email = NoHeaderInjection.pipe(z.email().max(254));

// Honeypot field — humans leave it empty; bots fill every input.
// Accept any string so the route can silently 200 on non-empty values
// rather than 400'ing (which would let bots detect+tune around the trap).
const Honeypot = z.string().max(1000).optional();

export const ContactSchema = z.object({
  name: NoHeaderInjection.pipe(z.string().trim().min(1).max(100)),
  email: Email,
  message: z.string().trim().min(1).max(5000),
  enquiry_type: z.enum(["organiser", "deaf-community", "interpreter", "other"]),
  urgent: z.boolean().optional(),
  consent: z.boolean().optional(),
  website: Honeypot,
});

export const ChatHandoffSchema = z.object({
  name: NoHeaderInjection.pipe(z.string().trim().min(1).max(100)),
  email: Email,
  message: z.string().trim().min(1).max(5000),
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
        content: z.string().max(10000),
      })
    )
    .max(100)
    .optional(),
  website: Honeypot,
});

// pi-feedback-uploads stores videos in Vercel Blob; returned URL host is
// <tenant>.public.blob.vercel-storage.com. Keep the upload service host too
// as a future-proof allowance.
const ALLOWED_UPLOAD_HOSTS = ["pi-feedback-uploads.vercel.app"];
const ALLOWED_UPLOAD_SUFFIXES = [".public.blob.vercel-storage.com"];

export const VideoFeedbackSchema = z.object({
  url: z
    .url()
    .refine(
      (url) => {
        try {
          const u = new URL(url);
          if (u.protocol !== "https:") return false;
          if (ALLOWED_UPLOAD_HOSTS.includes(u.hostname)) return true;
          return ALLOWED_UPLOAD_SUFFIXES.some((s) => u.hostname.endsWith(s));
        } catch {
          return false;
        }
      },
      { message: "URL must be on the allowlisted upload domain" }
    ),
});

export const ChatBodySchema = z.object({
  messages: z.array(z.unknown()).min(1).max(50),
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
