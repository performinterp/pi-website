"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { findMatchingVenues, type VenueMatch } from "@/lib/venues";
import {
  ACCESS_NEEDS_LABELS,
  buildDraft,
  buildMailtoUrl,
  PI_EMAIL,
} from "@/lib/email-draft";

interface Props {
  initialEvent?: string;
  initialVenue?: string;
  initialDate?: string;
}

const ACCESS_OPTIONS = [
  { value: "", label: "None" },
  { value: "wheelchair", label: ACCESS_NEEDS_LABELS.wheelchair },
  { value: "hearing-loop", label: ACCESS_NEEDS_LABELS["hearing-loop"] },
  { value: "step-free", label: ACCESS_NEEDS_LABELS["step-free"] },
  { value: "assistance-dog", label: ACCESS_NEEDS_LABELS["assistance-dog"] },
  { value: "companion-pa", label: ACCESS_NEEDS_LABELS["companion-pa"] },
  { value: "quiet-room", label: ACCESS_NEEDS_LABELS["quiet-room"] },
  { value: "changing-places", label: ACCESS_NEEDS_LABELS["changing-places"] },
  { value: "other", label: "Other" },
];

export default function RequestDraftBuilder({
  initialEvent = "",
  initialVenue = "",
  initialDate = "",
}: Props) {
  const [eventName, setEventName] = useState(initialEvent);
  const [venueName, setVenueName] = useState(initialVenue);
  const [eventDate, setEventDate] = useState(initialDate);
  const [venueEmail, setVenueEmail] = useState("");
  const [accessNeeds, setAccessNeeds] = useState("");
  const [accessNeedsOther, setAccessNeedsOther] = useState("");

  const [matches, setMatches] = useState<VenueMatch[]>([]);
  const [lookupState, setLookupState] = useState<
    "idle" | "found" | "multiple" | "none" | "selected"
  >("idle");

  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const [showEditHint, setShowEditHint] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editHintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userOverrodeEmail = useRef(false);

  // Debounced venue lookup — mirrors app's setupVenueEmailLookup
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const trimmed = venueName.trim();
      if (trimmed.length < 3) {
        setMatches([]);
        setLookupState("idle");
        return;
      }
      const found = findMatchingVenues(trimmed);
      setMatches(found);
      if (found.length === 1) setLookupState("found");
      else if (found.length > 1) setLookupState("multiple");
      else setLookupState("none");
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [venueName]);

  // If initial venue had an email lookup match, auto-fill on mount
  useEffect(() => {
    if (!initialVenue) return;
    const found = findMatchingVenues(initialVenue);
    if (found.length === 1 && found[0].email && !userOverrodeEmail.current) {
      setVenueEmail(found[0].email);
      setLookupState("selected");
      setMatches([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function selectMatch(match: VenueMatch) {
    setVenueName(toTitleCase(match.venueName));
    if (match.email) {
      setVenueEmail(match.email);
      userOverrodeEmail.current = false;
    }
    setLookupState("selected");
    setMatches([]);
  }

  function toTitleCase(s: string): string {
    return s.replace(/\b\w/g, (c) => c.toUpperCase());
  }

  const draft = useMemo(
    () =>
      buildDraft({
        eventName,
        venueName,
        eventDate,
        venueEmail,
        accessNeeds,
        accessNeedsOther,
      }),
    [eventName, venueName, eventDate, venueEmail, accessNeeds, accessNeedsOther]
  );

  const isValid = eventName.trim().length > 0 && venueName.trim().length > 0;
  const mailtoUrl = isValid ? buildMailtoUrl(draft) : "";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(draft.body);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2500);
    } catch {
      setCopyState("error");
      setTimeout(() => setCopyState("idle"), 3000);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-pi-ink/15 bg-white px-3 py-2.5 text-sm text-pi-ink placeholder-pi-ink/40 outline-none transition focus:border-pi-accent focus:ring-1 focus:ring-pi-accent";
  const labelClass = "block text-xs font-semibold uppercase tracking-wide text-pi-ink/60";

  return (
    <div className="space-y-5">
      <div className="grid gap-3">
        <div>
          <label htmlFor="event-name" className={labelClass}>
            Event name
          </label>
          <input
            id="event-name"
            type="text"
            required
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="e.g. Ed Sheeran"
            className={`${inputClass} mt-1.5`}
          />
        </div>

        <div>
          <label htmlFor="venue-name" className={labelClass}>
            Venue
          </label>
          <input
            id="venue-name"
            type="text"
            required
            value={venueName}
            onChange={(e) => {
              setVenueName(e.target.value);
              userOverrodeEmail.current = false;
            }}
            placeholder="e.g. Wembley Stadium"
            className={`${inputClass} mt-1.5`}
            aria-describedby="venue-status"
          />
          {lookupState === "found" && matches.length > 0 && (
            <div className="mt-2 space-y-2">
              <p
                id="venue-status"
                className="text-xs font-semibold text-pi-accent"
                role="status"
              >
                Venue found - tap to select
              </p>
              <ul className="space-y-1">
                {matches.map((m) => (
                  <li key={m.venueName}>
                    <button
                      type="button"
                      onClick={() => selectMatch(m)}
                      className="w-full rounded-lg border border-pi-accent/30 bg-pi-accent/5 px-3 py-2 text-left text-sm font-semibold text-pi-ink transition hover:border-pi-accent hover:bg-pi-accent/10"
                    >
                      {m.venueName}
                      {m.email ? (
                        <span className="ml-2 text-xs font-normal text-pi-ink/55">
                          {m.email}
                        </span>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {lookupState === "multiple" && matches.length > 0 && (
            <div className="mt-2 space-y-2">
              <p
                id="venue-status"
                className="text-xs font-semibold text-pi-warmth"
                role="status"
              >
                Multiple venues found - please select one
              </p>
              <ul className="space-y-1">
                {matches.slice(0, 6).map((m) => (
                  <li key={m.venueName}>
                    <button
                      type="button"
                      onClick={() => selectMatch(m)}
                      className="w-full rounded-lg border border-pi-warmth/30 bg-pi-warmth/5 px-3 py-2 text-left text-sm font-semibold text-pi-ink transition hover:border-pi-warmth hover:bg-pi-warmth/10"
                    >
                      {m.venueName}
                      {m.email ? (
                        <span className="ml-2 text-xs font-normal text-pi-ink/55">
                          {m.email}
                        </span>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {lookupState === "selected" && venueEmail && (
            <p
              id="venue-status"
              className="mt-2 text-xs font-semibold text-pi-success"
              role="status"
            >
              ✓ Access email auto-filled
            </p>
          )}
          {lookupState === "none" && (
            <p
              id="venue-status"
              className="mt-2 text-xs text-pi-ink/55"
              role="status"
            >
              We don&apos;t have this venue&apos;s access email yet - you can
              type it below or send to us instead.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="event-date" className={labelClass}>
            Date (if known)
          </label>
          <input
            id="event-date"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className={`${inputClass} mt-1.5`}
          />
        </div>

        <div>
          <label htmlFor="venue-email" className={labelClass}>
            Venue&apos;s access email
          </label>
          <input
            id="venue-email"
            type="email"
            value={venueEmail}
            onChange={(e) => {
              setVenueEmail(e.target.value);
              userOverrodeEmail.current = true;
            }}
            placeholder="Auto-filled or type your own..."
            className={`${inputClass} mt-1.5`}
          />
        </div>

        <div>
          <label htmlFor="access-needs" className={labelClass}>
            Extra support needed?
          </label>
          <select
            id="access-needs"
            value={accessNeeds}
            onChange={(e) => setAccessNeeds(e.target.value)}
            className={`${inputClass} mt-1.5`}
          >
            {ACCESS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {accessNeeds === "other" && (
            <textarea
              value={accessNeedsOther}
              onChange={(e) => setAccessNeedsOther(e.target.value)}
              placeholder="Please describe your access need..."
              rows={3}
              maxLength={300}
              className={`${inputClass} mt-2 resize-y`}
            />
          )}
        </div>
      </div>

      {isValid && (
        <div className="rounded-2xl border border-pi-ink/10 bg-pi-canvas-soft/40 p-4 md:p-5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-wider text-pi-ink/55">
              Email preview
            </p>
            <span className="rounded-full bg-pi-accent/10 px-2.5 py-1 text-[11px] font-semibold text-pi-accent">
              ✏️ You&apos;ll edit this in your mail app
            </span>
          </div>
          <dl className="mt-3 space-y-1.5 text-xs">
            <div className="flex gap-2">
              <dt className="w-12 shrink-0 font-semibold text-pi-ink/55">To:</dt>
              <dd className="break-all text-pi-ink">{draft.to}</dd>
            </div>
            {draft.cc && (
              <div className="flex gap-2">
                <dt className="w-12 shrink-0 font-semibold text-pi-ink/55">CC:</dt>
                <dd className="break-all text-pi-ink">{draft.cc}</dd>
              </div>
            )}
            <div className="flex gap-2">
              <dt className="w-12 shrink-0 font-semibold text-pi-ink/55">Subject:</dt>
              <dd className="text-pi-ink">{draft.subject}</dd>
            </div>
          </dl>
          <div
            className="relative mt-3"
            onClick={() => {
              setShowEditHint(true);
              if (editHintTimer.current) clearTimeout(editHintTimer.current);
              editHintTimer.current = setTimeout(() => setShowEditHint(false), 2400);
            }}
          >
            <pre className="max-h-72 cursor-default overflow-auto whitespace-pre-wrap rounded-lg border border-pi-ink/10 bg-white p-3 text-sm leading-relaxed text-pi-ink select-text">
{draft.body}
            </pre>
            {showEditHint && (
              <div
                role="status"
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pi-ink px-4 py-2 text-xs font-semibold text-white shadow-xl"
              >
                ✏️ Edit this in your mail app
              </div>
            )}
          </div>
          <p
            className={`mt-3 text-xs leading-relaxed ${
              draft.hasVenueEmail ? "text-pi-success" : "text-pi-warmth"
            }`}
          >
            {draft.hasVenueEmail ? (
              <>
                This email goes to the <strong>venue&apos;s access team</strong>.
                Performance Interpreting is CC&apos;d to support your request if
                needed.
              </>
            ) : (
              <>
                This email goes to <strong>Performance Interpreting</strong>.
                We&apos;ll contact the venue on your behalf.
              </>
            )}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={handleCopy}
          disabled={!isValid}
          className="flex-1 rounded-full border border-pi-accent/30 bg-white px-5 py-3 text-sm font-semibold text-pi-accent transition hover:bg-pi-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copyState === "copied"
            ? "✓ Copied"
            : copyState === "error"
              ? "Couldn't copy"
              : "Copy email"}
        </button>
        <a
          href={mailtoUrl || "#"}
          aria-disabled={!isValid}
          onClick={(e) => {
            if (!isValid) e.preventDefault();
          }}
          className="flex-1 rounded-full bg-pi-warmth px-5 py-3 text-center text-sm font-bold text-white shadow-lg shadow-pi-warmth/30 transition hover:brightness-110 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
        >
          Open in mail
        </a>
      </div>

      {!isValid && (
        <p className="text-xs text-pi-ink/55">
          Add at least an event name and venue to generate the email.
        </p>
      )}

      <p className="text-[11px] leading-relaxed text-pi-ink/55">
        We&apos;ll always be CC&apos;d ({PI_EMAIL}) so we can step in if the
        venue needs more help. Edit anything before sending - or skip the
        template entirely.
      </p>
    </div>
  );
}
