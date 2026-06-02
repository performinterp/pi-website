"use client";

import { useState } from "react";

const enquiryTypes = [
  { value: "organiser", label: "Event organiser - book interpreters" },
  { value: "deaf-community", label: "Deaf community - request access" },
  { value: "interpreter", label: "Interpreter - join the team" },
  { value: "other", label: "Other enquiry" },
];

// Option lists for the type-specific selects. The labels here drive the
// form UI; the route's VALUE_LABELS map (lib/api-schemas.ts) drives the
// email body rendering. Keep the value keys identical between the two so
// the round-trip is clean.
const ORGANISER_EVENT_TYPES = [
  { value: "concert", label: "Concert" },
  { value: "sport", label: "Sport" },
  { value: "theatre", label: "Theatre" },
  { value: "comedy", label: "Comedy" },
  { value: "festival", label: "Festival" },
  { value: "awards", label: "Awards" },
  { value: "corporate", label: "Corporate" },
  { value: "other", label: "Other" },
];
const AUDIENCE_SIZES = [
  { value: "under_500", label: "Under 500" },
  { value: "500_to_2k", label: "500 – 2,000" },
  { value: "2k_to_10k", label: "2,000 – 10,000" },
  { value: "10k_to_50k", label: "10,000 – 50,000" },
  { value: "over_50k", label: "50,000+" },
  { value: "not_sure", label: "Not sure yet" },
];
const EVENT_FORMATS = [
  { value: "single_show", label: "Single show / single date" },
  { value: "multi_night", label: "Multi-night run" },
  { value: "festival_weekend", label: "Festival weekend" },
  { value: "one_off", label: "One-off special" },
  { value: "other", label: "Other" },
];
const LANGUAGES_NEEDED = [
  { value: "bsl", label: "BSL" },
  { value: "isl", label: "ISL" },
  { value: "both", label: "Both BSL and ISL" },
  { value: "not_sure", label: "Not sure yet" },
];
const LEAD_TIMES = [
  { value: "under_2_weeks", label: "Less than 2 weeks (urgent)" },
  { value: "2_to_6_weeks", label: "2 – 6 weeks" },
  { value: "over_6_weeks", label: "6+ weeks" },
];

const DEAF_LANGUAGE_PREFERENCES = [
  { value: "bsl", label: "BSL" },
  { value: "isl", label: "ISL" },
  { value: "either", label: "Either is fine" },
];
const CONTACTED_VENUE_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No, not yet" },
  { value: "not_sure", label: "Not sure" },
];

const NRCPD_STATUSES = [
  { value: "tsli", label: "TSLI (Trainee)" },
  { value: "rsli", label: "RSLI (Registered)" },
  { value: "tslt", label: "TSLT (Translator)" },
  { value: "not_registered", label: "Not registered" },
  { value: "other", label: "Other" },
];
const INTERPRETER_LANGUAGES = [
  { value: "bsl", label: "BSL" },
  { value: "isl", label: "ISL" },
];
const YEARS_EXPERIENCE = [
  { value: "under_2", label: "Under 2 years" },
  { value: "2_to_5", label: "2 – 5 years" },
  { value: "5_to_10", label: "5 – 10 years" },
  { value: "over_10", label: "10+ years" },
];
const SPECIALISMS = [
  { value: "theatre", label: "Theatre" },
  { value: "festival", label: "Festival" },
  { value: "music", label: "Music" },
  { value: "sport", label: "Sport" },
  { value: "comedy", label: "Comedy" },
  { value: "awards", label: "Awards" },
  { value: "conference", label: "Conference" },
  { value: "education", label: "Education" },
];
const INTERPRETER_GOALS = [
  { value: "ad_hoc", label: "Ad-hoc gigs" },
  { value: "regular_roster", label: "Joining a regular roster" },
  { value: "mentoring", label: "Mentoring" },
  { value: "shadowing", label: "Shadowing" },
  { value: "other", label: "Other" },
];

const inputClass =
  "mt-2 w-full rounded-lg border border-pi-ink/15 bg-white px-4 py-3 text-pi-ink placeholder-pi-ink/40 outline-none transition focus:border-pi-accent focus:ring-1 focus:ring-pi-accent";
const labelClass = "block text-sm font-medium text-pi-ink/80";

// URL params that the form will accept as pre-fills via PIPA's deep-link
// flow. EXPLICITLY EXCLUDES `urgent`, `message`, `consent`, `name`, and
// `email` so an attacker can't craft a URL that pre-fills hostile
// content and the urgent flag, then sends the link to a victim who
// submits with only their name/email visible-edited. The fields below
// all correspond to structured questions PIPA already gathers during
// conversation; the user always controls name/email/message themselves.
const URL_PREFILLABLE_FIELDS: ReadonlySet<string> = new Set([
  // Organiser
  "event_name", "event_type", "venue", "city", "event_dates",
  "audience_size", "event_format", "language_needed",
  "other_access_needs", "lead_time",
  // Deaf community
  "event_for_access", "event_date", "language_preference",
  "specific_access_need", "contacted_venue",
  // Interpreter
  "nrcpd_status", "languages", "years_experience",
  "specialisms", "region", "looking_for",
]);

const MULTI_VALUE_FIELDS: ReadonlySet<string> = new Set([
  "languages", "specialisms", "looking_for",
]);

type Prefill = Record<string, string | string[]>;

// Parse URL params into a prefill object SYNCHRONOUSLY (before first paint)
// so `defaultValue` props see the correct value at mount time. Returns {}
// during SSR. Only fields on URL_PREFILLABLE_FIELDS are accepted; everything
// else is ignored. Multi-value fields accept comma-separated lists.
function parseUrlPrefill(): Prefill {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const out: Prefill = {};
  for (const [key, raw] of params.entries()) {
    if (key === "enquiry_type") continue; // handled separately for the type state
    if (!URL_PREFILLABLE_FIELDS.has(key)) continue;
    if (MULTI_VALUE_FIELDS.has(key)) {
      out[key] = raw.split(",").map((s) => s.trim()).filter(Boolean);
    } else {
      out[key] = raw;
    }
  }
  return out;
}

function readEnquiryTypeFromUrl(): string {
  if (typeof window === "undefined") return "";
  const t = new URLSearchParams(window.location.search).get("enquiry_type");
  if (t && enquiryTypes.some((et) => et.value === t)) return t;
  return "";
}

function prefillStr(prefill: Prefill, key: string): string {
  return typeof prefill[key] === "string" ? (prefill[key] as string) : "";
}

function prefillHas(prefill: Prefill, key: string, value: string): boolean {
  return Array.isArray(prefill[key]) && (prefill[key] as string[]).includes(value);
}

// ------------------------------------------------------------------
// Module-level field components — defined OUTSIDE ContactForm so React
// preserves their identity across re-renders. Defining them inside the
// parent meant every render created a brand-new component type and
// React unmounted+remounted the underlying <input>, wiping any value
// the user had typed since the last render.
// ------------------------------------------------------------------

function TextField({
  name,
  label,
  prefill,
  placeholder,
}: {
  name: string;
  label: string;
  prefill: Prefill;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        defaultValue={prefillStr(prefill, name)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

function SelectField({
  name,
  label,
  prefill,
  options,
}: {
  name: string;
  label: string;
  prefill: Prefill;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={prefillStr(prefill, name)}
        className={inputClass}
      >
        <option value="">Select...</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function CheckboxGroupField({
  name,
  label,
  prefill,
  options,
}: {
  name: string;
  label: string;
  prefill: Prefill;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <p className={labelClass}>{label}</p>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map((o) => (
          <label
            key={o.value}
            className="flex items-center gap-2 rounded-lg border border-pi-ink/15 bg-white px-3 py-2 text-sm text-pi-ink/80 transition hover:border-pi-accent/40"
          >
            <input
              type="checkbox"
              name={name}
              value={o.value}
              defaultChecked={prefillHas(prefill, name, o.value)}
              className="h-4 w-4 rounded border-pi-ink/20 bg-white text-pi-accent focus:ring-pi-accent"
            />
            {o.label}
          </label>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  // Synchronous init so defaultValue / defaultChecked are correct at FIRST
  // mount — fixing the prior bug where prefill landed via useEffect after
  // paint and defaultValue (which only applies on mount) silently dropped
  // the deep-linked values.
  const [enquiryType, setEnquiryType] = useState<string>(readEnquiryTypeFromUrl);
  const [prefill] = useState<Prefill>(parseUrlPrefill);

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-pi-success/30 bg-pi-success/5 p-8 text-center md:p-12">
        <p className="font-display text-2xl text-pi-ink">Message sent</p>
        <p className="mt-3 text-pi-ink/65">
          We&apos;ll aim to reply within 48 hours.
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const get = (k: string) => (formData.get(k) ?? "").toString();
    const getAll = (k: string) =>
      formData.getAll(k).map((v) => v.toString()).filter(Boolean);

    const baseData: Record<string, unknown> = {
      name: get("name"),
      email: get("email"),
      message: get("message"),
      enquiry_type: get("enquiry_type"),
      urgent: (form.elements.namedItem("urgent") as HTMLInputElement)?.checked,
      // Explicit positive consent — required by schema; the route stores
      // the value in the audit-trail line of the email body. HTML `required`
      // attribute on the checkbox already prevents browser submission
      // without it; this propagates the same signal to the server.
      consent: (form.elements.namedItem("consent") as HTMLInputElement)?.checked,
      website: get("nickname"),
    };

    if (baseData.enquiry_type === "organiser") {
      Object.assign(baseData, {
        event_name: get("event_name") || undefined,
        event_type: get("event_type") || undefined,
        venue: get("venue") || undefined,
        city: get("city") || undefined,
        event_dates: get("event_dates") || undefined,
        audience_size: get("audience_size") || undefined,
        event_format: get("event_format") || undefined,
        language_needed: get("language_needed") || undefined,
        other_access_needs: get("other_access_needs") || undefined,
        lead_time: get("lead_time") || undefined,
      });
    } else if (baseData.enquiry_type === "deaf-community") {
      Object.assign(baseData, {
        event_for_access: get("event_for_access") || undefined,
        event_date: get("event_date") || undefined,
        language_preference: get("language_preference") || undefined,
        specific_access_need: get("specific_access_need") || undefined,
        contacted_venue: get("contacted_venue") || undefined,
      });
    } else if (baseData.enquiry_type === "interpreter") {
      const languages = getAll("languages");
      const specialisms = getAll("specialisms");
      const looking_for = getAll("looking_for");
      Object.assign(baseData, {
        nrcpd_status: get("nrcpd_status") || undefined,
        languages: languages.length ? languages : undefined,
        years_experience: get("years_experience") || undefined,
        specialisms: specialisms.length ? specialisms : undefined,
        region: get("region") || undefined,
        looking_for: looking_for.length ? looking_for : undefined,
      });
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(baseData),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  // Per-type section JSX. These are inline expressions (not components),
  // so they don't suffer the inner-component remount bug — they just
  // render their tree directly with the module-level helpers.
  const OrganiserSection = (
    <section className="space-y-5 rounded-2xl border border-pi-ink/10 bg-pi-cream/40 p-5 md:p-6">
      <header>
        <h3 className="font-display text-lg text-pi-ink">Event details</h3>
        <p className="mt-1 text-sm text-pi-ink/65">
          The more you can share now, the faster our team can come back with a
          tailored quote. None of these are required — fill in what you know.
        </p>
      </header>
      <div className="grid gap-5 md:grid-cols-2">
        <TextField name="event_name" label="Event name" prefill={prefill} placeholder="e.g. Glastonbury 2026, The Lion King UK tour" />
        <SelectField name="event_type" label="Event type" prefill={prefill} options={ORGANISER_EVENT_TYPES} />
        <TextField name="venue" label="Venue" prefill={prefill} placeholder="e.g. The O2" />
        <TextField name="city" label="City" prefill={prefill} placeholder="e.g. London" />
        <TextField name="event_dates" label="Date(s)" prefill={prefill} placeholder="e.g. 13 Jun 2026 or 13–15 Jun 2026" />
        <SelectField name="audience_size" label="Expected audience size" prefill={prefill} options={AUDIENCE_SIZES} />
        <SelectField name="event_format" label="Format" prefill={prefill} options={EVENT_FORMATS} />
        <SelectField name="language_needed" label="Language needed" prefill={prefill} options={LANGUAGES_NEEDED} />
        <SelectField name="lead_time" label="Lead time" prefill={prefill} options={LEAD_TIMES} />
      </div>
      <div>
        <label htmlFor="other_access_needs" className={labelClass}>
          Other access needs (optional)
        </label>
        <textarea
          id="other_access_needs"
          name="other_access_needs"
          rows={2}
          defaultValue={prefillStr(prefill, "other_access_needs")}
          className={inputClass}
          placeholder="e.g. live captions, induction loop, wheelchair access info..."
        />
      </div>
    </section>
  );

  const DeafCommunitySection = (
    <section className="space-y-5 rounded-2xl border border-pi-ink/10 bg-pi-cream/40 p-5 md:p-6">
      <header>
        <h3 className="font-display text-lg text-pi-ink">Access needs</h3>
        <p className="mt-1 text-sm text-pi-ink/65">
          Tell us what you&apos;d like to attend and what you need. We&apos;ll
          help you get there.
        </p>
      </header>
      <div className="grid gap-5 md:grid-cols-2">
        <TextField name="event_for_access" label="Event you want access to" prefill={prefill} placeholder="e.g. Wembley Beyoncé, 14 Jun" />
        <TextField name="event_date" label="Date of event" prefill={prefill} placeholder="e.g. 14 Jun 2026" />
        <SelectField name="language_preference" label="Language preference" prefill={prefill} options={DEAF_LANGUAGE_PREFERENCES} />
        <SelectField name="contacted_venue" label="Have you contacted the venue yet?" prefill={prefill} options={CONTACTED_VENUE_OPTIONS} />
      </div>
      <div>
        <label htmlFor="specific_access_need" className={labelClass}>
          Specific access need (optional)
        </label>
        <textarea
          id="specific_access_need"
          name="specific_access_need"
          rows={2}
          defaultValue={prefillStr(prefill, "specific_access_need")}
          className={inputClass}
          placeholder="e.g. BSL interpreter only, plus wheelchair seating"
        />
      </div>
    </section>
  );

  const InterpreterSection = (
    <section className="space-y-5 rounded-2xl border border-pi-ink/10 bg-pi-cream/40 p-5 md:p-6">
      <header>
        <h3 className="font-display text-lg text-pi-ink">
          Your interpreting profile
        </h3>
        <p className="mt-1 text-sm text-pi-ink/65">
          Helps us point you to the right opportunity — gigs, roster,
          mentoring, or shadowing.
        </p>
      </header>
      <div className="grid gap-5 md:grid-cols-2">
        <SelectField name="nrcpd_status" label="NRCPD status" prefill={prefill} options={NRCPD_STATUSES} />
        <SelectField name="years_experience" label="Years interpreting" prefill={prefill} options={YEARS_EXPERIENCE} />
        <TextField name="region" label="Region you mainly work in" prefill={prefill} />
      </div>
      <CheckboxGroupField name="languages" label="Language(s)" prefill={prefill} options={INTERPRETER_LANGUAGES} />
      <CheckboxGroupField name="specialisms" label="Specialisms (tick all that apply)" prefill={prefill} options={SPECIALISMS} />
      <CheckboxGroupField name="looking_for" label="What you're looking for" prefill={prefill} options={INTERPRETER_GOALS} />
    </section>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot — display:none so password managers and Chrome autofill
          skip it. `nickname` is a less autofill-targeted name than
          `website` or `url`. Server silently 200s on non-empty value. */}
      <input
        type="text"
        name="nickname"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        defaultValue=""
        style={{ display: "none" }}
      />

      <div>
        <label htmlFor="enquiry-type" className={labelClass}>
          I am a...
        </label>
        <select
          id="enquiry-type"
          name="enquiry_type"
          required
          value={enquiryType}
          onChange={(e) => setEnquiryType(e.target.value)}
          className={inputClass}
        >
          <option value="">Select enquiry type</option>
          {enquiryTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className={inputClass}
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className={inputClass}
            placeholder="your@email.com"
          />
        </div>
      </div>

      {enquiryType === "organiser" && OrganiserSection}
      {enquiryType === "deaf-community" && DeafCommunitySection}
      {enquiryType === "interpreter" && InterpreterSection}

      <div>
        <label htmlFor="message" className={labelClass}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className={inputClass}
          placeholder={
            enquiryType === "organiser"
              ? "Anything else we should know? (Optional — the fields above already give us a great starting point.)"
              : "Tell us about your enquiry..."
          }
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="urgent"
          name="urgent"
          className="h-4 w-4 rounded border-pi-ink/20 bg-white text-pi-accent focus:ring-pi-accent"
        />
        <label htmlFor="urgent" className="text-sm text-pi-ink/65">
          This is urgent (event within 2 weeks)
        </label>
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="consent"
          name="consent"
          required
          className="mt-0.5 h-4 w-4 rounded border-pi-ink/20 bg-white text-pi-accent focus:ring-pi-accent"
        />
        <label htmlFor="consent" className="text-sm text-pi-ink/65">
          I consent to Performance Interpreting Ltd storing my data in order to
          respond to my enquiry, in accordance with the{" "}
          <a
            href="/privacy"
            className="text-pi-accent underline hover:text-pi-ink"
          >
            Privacy Policy
          </a>
          .
        </label>
      </div>

      {status === "error" && (
        <p className="text-sm text-pi-error">
          Something went wrong. Please try again or email us directly at
          enquiries@performanceinterpreting.co.uk.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center gap-2 rounded-full bg-pi-accent px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pi-accent/25 transition-all duration-200 hover:brightness-110 hover:shadow-pi-accent/40 disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
