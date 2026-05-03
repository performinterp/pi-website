// Ported verbatim from pi-events-standalone-app/public/app.js — MessageTemplates.friendly,
// handleRequestBSLForm, copyMessage, openEmail (lines 9650–9870).
// If the app changes its template, re-port — don't drift.

// Website-originated CC alias for the Enquiries | PI Team shared mailbox.
// Routes to the same inbox as enquiries@ but is filterable in Outlook
// (`to:enquiries-web`) so Marie can distinguish website-sent access requests
// from app-sent ones (the app continues to CC enquiries@ since it's already
// submitted to the stores and immutable until the next release cycle).
export const PI_EMAIL = "enquiries-web@performanceinterpreting.co.uk";

export const ACCESS_NEEDS_LABELS: Record<string, string> = {
  wheelchair: "Wheelchair accessible seating",
  "hearing-loop": "Hearing loop",
  "step-free": "Step-free access",
  "assistance-dog": "Assistance dog space",
  "companion-pa": "Companion/PA ticket",
  "quiet-room": "Quiet room",
  "changing-places": "Changing Places toilet",
};

export interface DraftInput {
  eventName: string;
  venueName: string;
  eventDate: string;
  venueEmail: string;
  accessNeeds: string;
  accessNeedsOther: string;
}

export interface EmailDraft {
  subject: string;
  body: string;
  to: string;
  cc?: string;
  hasVenueEmail: boolean;
}

function generateFriendlyMessage(
  eventName: string,
  venueName: string,
  eventDate: string,
  includePiNote: boolean
): string {
  const piNote = includePiNote
    ? `\n\nI've CC'd Performance Interpreting to help support this request.`
    : "";
  const dateClause = eventDate ? ` on ${eventDate}` : "";
  return `Hi ${venueName} team,

I want to attend ${eventName}${dateClause}!

I am Deaf and use BSL.
Will there be an interpreter?

If not, can you arrange one?${piNote}

Thank you!`;
}

export function buildDraft(input: DraftInput): EmailDraft {
  const hasVenueEmail = input.venueEmail.trim().length > 0;
  let body = generateFriendlyMessage(
    input.eventName.trim() || "[event]",
    input.venueName.trim() || "[venue]",
    input.eventDate.trim(),
    hasVenueEmail
  );

  if (input.accessNeeds && input.accessNeeds !== "") {
    const label =
      input.accessNeeds === "other"
        ? input.accessNeedsOther.trim() ||
          "Other access needs (please contact me to discuss)"
        : ACCESS_NEEDS_LABELS[input.accessNeeds] ?? input.accessNeeds;
    body += `\n\nExtra support needed: ${label}`;
  }

  const subject = `BSL Interpretation Request - ${input.eventName.trim() || "your event"}`;

  return {
    subject,
    body,
    to: hasVenueEmail ? input.venueEmail.trim() : PI_EMAIL,
    cc: hasVenueEmail ? PI_EMAIL : undefined,
    hasVenueEmail,
  };
}

export function buildMailtoUrl(draft: EmailDraft): string {
  // Use encodeURIComponent (not URLSearchParams) — URLSearchParams encodes spaces
  // as "+" which mail clients render literally. This matches the app's approach.
  const parts: string[] = [];
  if (draft.cc) parts.push(`cc=${encodeURIComponent(draft.cc)}`);
  parts.push(`subject=${encodeURIComponent(draft.subject)}`);
  parts.push(`body=${encodeURIComponent(draft.body)}`);
  return `mailto:${draft.to}?${parts.join("&")}`;
}
