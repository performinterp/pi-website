"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, X, SendHorizonal, Mail } from "lucide-react";
import Link from "next/link";

const SAME_ORIGIN = "https://performanceinterpreting.co.uk";

function isInternalUrl(url: string): boolean {
  if (url.startsWith("/")) return true;
  try {
    const u = new URL(url);
    if (u.origin === SAME_ORIGIN) return true;
    return u.hostname === "performanceinterpreting.co.uk" || u.hostname === "www.performanceinterpreting.co.uk";
  } catch {
    return false;
  }
}

function toRelativeIfInternal(url: string): string {
  if (url.startsWith("/")) return url;
  try {
    const u = new URL(url);
    if (u.origin === SAME_ORIGIN || u.hostname.endsWith("performanceinterpreting.co.uk")) {
      return u.pathname + u.search + u.hash;
    }
  } catch {}
  return url;
}

const NEEDS_HUMAN_MARKER = "[NEEDS_HUMAN]";

interface HumanSummary {
  topic: string;
  tried: string;
  question: string;
}

function extractTextFromMessage(m: UIMessage): string {
  return m.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

function isVideoUrl(url: string): boolean {
  // Belt-and-braces: only render as a video player if the URL is on PI's
  // own media host AND ends in a video extension. If the model
  // hallucinates a plausible-looking URL elsewhere, it falls back to a
  // regular link rather than rendering a broken video element.
  const clean = url.split("#")[0];
  if (!/\.(mp4|webm|mov)$/i.test(clean)) return false;
  try {
    const u = new URL(clean);
    return u.hostname === "media.performanceinterpreting.co.uk";
  } catch {
    return false;
  }
}

function SignVideoPlayer({ url, label }: { url: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  // Browsers allow muted autoplay, but the `autoPlay` attribute is flaky
  // when the element mounts mid-stream from a re-render. Explicitly call
  // play() once the metadata is ready so it fires reliably. Sign-language
  // videos have no audio so muted is the right default.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const tryPlay = () => {
      v.muted = true;
      v.play().catch(() => {
        // Some browsers still block — controls are visible so the user
        // can tap play. No console noise.
      });
    };
    if (v.readyState >= 1) tryPlay();
    else v.addEventListener("loadedmetadata", tryPlay, { once: true });
    return () => v.removeEventListener("loadedmetadata", tryPlay);
  }, [url]);
  return (
    <span className="my-2 block">
      <span className="block text-xs font-semibold uppercase tracking-wide text-pi-accent">
        {label}
      </span>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={ref}
        src={url}
        controls
        autoPlay
        muted
        playsInline
        preload="auto"
        className="mt-1.5 w-full max-w-[340px] rounded-lg border border-pi-ink/10 bg-black"
        aria-label={label}
      />
    </span>
  );
}

// Minimal inline Markdown renderer — links, **bold**, paragraphs, bullet
// lists, and inline video players for .mp4 URLs (used by the signed
// explainer tool). We avoid pulling in react-markdown to keep the widget
// bundle small.
function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Match either a markdown link [text](url) or **bold**.
  // The bold pattern allows ANYTHING (including a link inside) so bold-wrapped
  // links like **[SignVideo](url)** render correctly — see recursion below.
  const re = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)|\*\*([\s\S]+?)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1] && m[2]) {
      const url = m[2];
      // Video URLs render as inline players, not links. PIPA emits BSL/ISL
      // explainer clips this way via the getSignedExplainer tool.
      if (isVideoUrl(url)) {
        // Use the URL itself as the React key so the same video element is
        // preserved across text-delta re-renders during streaming. Without
        // a stable key, React would unmount/remount the <video> on every
        // chunk and the autoplay would never settle.
        parts.push(<SignVideoPlayer key={`v:${url}`} url={url} label={m[1]} />);
        last = re.lastIndex;
        continue;
      }
      const internal = isInternalUrl(url);
      const linkClass = "text-pi-accent underline underline-offset-2 hover:text-pi-ink";
      if (internal) {
        // Use Next.js Link so navigation is client-side. The Assistant lives
        // in app/layout.tsx so its state (open panel + chat history) is
        // preserved across internal route transitions.
        parts.push(
          <Link key={`l${key++}`} href={toRelativeIfInternal(url)} className={linkClass}>
            {m[1]}
          </Link>
        );
      } else {
        // External: open in new tab so we don't lose the conversation.
        parts.push(
          <a
            key={`l${key++}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {m[1]}
          </a>
        );
      }
    } else if (m[3]) {
      // Recurse so bold-wrapped links / formatting render correctly,
      // e.g. **[SignVideo](https://...)**.
      parts.push(
        <strong key={`b${key++}`} className="font-semibold">
          {renderInline(m[3])}
        </strong>
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function MarkdownText({ text }: { text: string }) {
  // Split on blank lines for paragraphs; treat lines starting with "- " or "* "
  // as a list within the current block.
  const blocks: React.ReactNode[] = [];
  const paragraphs = text.split(/\n{2,}/);
  paragraphs.forEach((para, pi) => {
    const lines = para.split("\n");
    const isList = lines.every((l) => /^\s*[-*]\s+/.test(l) || l.trim() === "");
    if (isList && lines.some((l) => l.trim())) {
      blocks.push(
        <ul key={`p${pi}`} className="my-1 ml-4 list-disc space-y-1">
          {lines
            .filter((l) => l.trim())
            .map((l, li) => (
              <li key={li}>{renderInline(l.replace(/^\s*[-*]\s+/, ""))}</li>
            ))}
        </ul>
      );
    } else {
      blocks.push(
        <p key={`p${pi}`} className={pi === 0 ? "" : "mt-2"}>
          {lines.flatMap((l, li) =>
            li === 0 ? renderInline(l) : [<br key={`br${li}`} />, ...renderInline(l)]
          )}
        </p>
      );
    }
  });
  return <>{blocks}</>;
}

function parseHumanMarker(text: string): { visible: string; summary: HumanSummary } | null {
  const idx = text.indexOf(NEEDS_HUMAN_MARKER);
  if (idx === -1) return null;
  const visible = text.slice(0, idx).trim();
  const after = text.slice(idx + NEEDS_HUMAN_MARKER.length).trim();

  const get = (label: string): string => {
    const re = new RegExp(`${label}\\s*:\\s*(.+)`, "i");
    const m = after.match(re);
    return m ? m[1].trim() : "";
  };

  return {
    visible,
    summary: {
      topic: get("Topic"),
      tried: get("What they tried"),
      question: get("Their question"),
    },
  };
}

type Audience = "deaf" | "organiser" | "interpreter" | "skipped";

const AUDIENCE_KEY = "pipaAudience";

function loadAudience(): Audience | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(AUDIENCE_KEY);
  if (v === "deaf" || v === "organiser" || v === "interpreter" || v === "skipped") return v;
  return null;
}

function audienceGreeting(a: Audience | null): string {
  switch (a) {
    case "deaf":
      return "Welcome back! What can I help you with today? I'll show signed BSL or ISL videos when there's one for your question.";
    case "organiser":
      return "Welcome back. I can help with quotes, lead times, venue partnerships and how PI works with event organisers.";
    case "interpreter":
      return "Welcome back. I can help with PI's interpreter roster, Academy training, festival work and getting involved.";
    default:
      return "Hi! I'm **PIPA** — Performance Interpreting's Personal Assistant. I can help with Deaf access at live events, BSL & ISL interpreting, our app, and how we work with venues and organisers. What can I help you with?";
  }
}

function audienceChips(a: Audience | null): string[] {
  switch (a) {
    case "deaf":
      return [
        "Find a BSL or ISL gig",
        "Show me how to book in BSL",
        "What are my access rights?",
        "Speak to the team",
      ];
    case "organiser":
      return [
        "Get a quote for an event",
        "What's the lead time?",
        "How do you work with venues?",
        "Speak to the team",
      ];
    case "interpreter":
      return [
        "How do I join PI's roster?",
        "What's PI Academy?",
        "Festival work with PI",
        "Volunteer with PI",
      ];
    default:
      return [
        "Find a BSL or ISL gig",
        "Request access for an event",
        "How do I book accessible seating?",
        "Speak to the team",
      ];
  }
}

export default function Assistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [audience, setAudienceState] = useState<Audience | null>(null);
  // audienceRef tracks the latest value for the transport body fn (which
  // is called per-request and needs the current audience without
  // recreating the transport).
  const audienceRef = useRef<Audience | null>(null);
  const [handoff, setHandoff] = useState<{
    summary: HumanSummary;
    transcript: { role: "user" | "assistant"; content: string }[];
  } | null>(null);
  // Tracks message IDs we've already consumed for handoff. Without this,
  // hitting "Back to chat" would immediately re-trigger the handoff form
  // because the marker is still present on the last assistant message.
  const dismissedHandoffIds = useRef<Set<string>>(new Set());
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const scrollRef = useRef<HTMLDivElement>(null);
  // Refs for keyboard / screen-reader focus management.
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);

  // Hydrate audience from localStorage on mount.
  useEffect(() => {
    const stored = loadAudience();
    if (stored) {
      setAudienceState(stored);
      audienceRef.current = stored;
    }
  }, []);

  function setAudience(a: Audience) {
    setAudienceState(a);
    audienceRef.current = a;
    try {
      window.localStorage.setItem(AUDIENCE_KEY, a);
    } catch {
      // ignore quota / privacy-mode errors
    }
  }

  function resetAudience() {
    setAudienceState(null);
    audienceRef.current = null;
    try {
      window.localStorage.removeItem(AUDIENCE_KEY);
    } catch {
      // ignore
    }
  }

  const transport = useMemo(
    // Trailing slash matches Next's trailingSlash config — without it
    // every send eats a 308 redirect round-trip. The `body` fn runs per
    // request so audience flows to the API even when it changes mid-
    // session.
    () =>
      new DefaultChatTransport<UIMessage>({
        api: "/api/chat/",
        body: () => ({ audience: audienceRef.current }),
      }),
    []
  );

  const { messages, sendMessage, status, error } = useChat({
    transport,
    messages: [
      {
        id: "intro",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: audienceGreeting(null),
          },
        ],
      } as UIMessage,
    ],
  });

  // When audience changes (after the picker), refresh the intro greeting.
  useEffect(() => {
    if (!audience) return;
    // useChat doesn't expose a setMessages helper here cleanly; we mutate
    // the intro message's text in-place via the assistant SDK's internal
    // reducer is not safe — instead, just leave the original intro and let
    // the next assistant response be on-tone. The picker itself disappears
    // once an audience is set; that's the meaningful UX cue.
  }, [audience]);

  // Auto-scroll on new content. Honour prefers-reduced-motion.
  useEffect(() => {
    if (!scrollRef.current) return;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [messages, status]);

  // Focus management: when the panel opens, move focus into the input so
  // keyboard users can start typing immediately. When it closes (and we're
  // not opening for the first time), return focus to the launcher button so
  // the user's tab order doesn't get dumped at the top of the page.
  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (open) {
      // Defer to next tick so the panel is mounted and the input is in DOM.
      const id = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(id);
    }
    if (wasOpenRef.current) launcherRef.current?.focus();
    wasOpenRef.current = open;
  }, [open]);
  useEffect(() => {
    if (open) wasOpenRef.current = true;
  }, [open]);

  // Allow Escape to close the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Watch for [NEEDS_HUMAN] marker on the latest assistant message
  const lastAssistant = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "assistant") return messages[i];
    }
    return null;
  }, [messages]);

  useEffect(() => {
    if (status !== "ready") return;
    if (!lastAssistant) return;
    if (dismissedHandoffIds.current.has(lastAssistant.id)) return;
    const text = extractTextFromMessage(lastAssistant);
    const parsed = parseHumanMarker(text);
    if (parsed && !handoff) {
      const transcript = messages
        .filter((m) => m.id !== "intro")
        .map((m) => ({
          role: m.role === "user" ? ("user" as const) : ("assistant" as const),
          content: extractTextFromMessage(m).replace(NEEDS_HUMAN_MARKER, "").trim(),
        }))
        .filter((t) => t.content.length > 0);
      setHandoff({ summary: parsed.summary, transcript });
    }
  }, [lastAssistant, messages, status, handoff]);

  function dismissHandoff() {
    if (lastAssistant) dismissedHandoffIds.current.add(lastAssistant.id);
    setHandoff(null);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || status === "streaming" || status === "submitted") return;
    sendMessage({ text: trimmed });
    setInput("");
  }

  async function onHandoffSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!handoff) return;
    const form = e.currentTarget;
    const name = (form.elements.namedItem("hf-name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("hf-email") as HTMLInputElement).value;
    const message = (form.elements.namedItem("hf-message") as HTMLTextAreaElement).value;
    setSendState("sending");
    try {
      const res = await fetch("/api/chat-handoff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          summary: handoff.summary,
          transcript: handoff.transcript,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSendState("sent");
    } catch {
      setSendState("error");
    }
  }

  const isThinking = status === "submitted" || status === "streaming";
  const initialMessage = useMemo(() => {
    if (!handoff) return "";
    const lines: string[] = [];
    if (handoff.summary.topic) lines.push(`Topic: ${handoff.summary.topic}`);
    if (handoff.summary.tried) lines.push(`Already covered: ${handoff.summary.tried}`);
    if (handoff.summary.question) lines.push(`My question: ${handoff.summary.question}`);
    return lines.join("\n");
  }, [handoff]);

  return (
    <>
      {/* Floating launcher */}
      <button
        type="button"
        ref={launcherRef}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close PIPA" : "Open PIPA assistant"}
        aria-expanded={open}
        className={`fixed bottom-5 right-5 z-40 h-14 w-14 items-center justify-center rounded-full bg-pi-accent text-white shadow-2xl shadow-pi-accent/40 transition-all hover:brightness-110 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100 print:hidden md:bottom-6 md:right-6 ${open ? "hidden sm:flex" : "flex"}`}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Panel — full-screen on mobile (no chrome conflicts with iOS URL
          bar / bottom toolbar via env safe areas), floating bottom-right
          card on tablet/desktop. */}
      {open && (
        <div
          className="fixed inset-0 z-40 flex flex-col overflow-hidden border border-pi-ink/10 bg-white shadow-2xl shadow-black/20 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] print:hidden sm:inset-auto sm:bottom-24 sm:right-3 sm:w-[calc(100vw-1.5rem)] sm:max-w-[400px] sm:rounded-2xl sm:h-[min(70vh,600px)] sm:pt-0 sm:pb-0 md:bottom-28 md:right-6"
          role="dialog"
          aria-modal="true"
          aria-label="PIPA — Performance Interpreting assistant"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-pi-ink/10 bg-pi-navy px-4 py-3 text-white">
            <div>
              <p className="font-display text-base">PIPA</p>
              <p className="text-[11px] text-white/65">Performance Interpreting&apos;s Personal Assistant</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close PIPA"
              className="rounded-full p-1 transition hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          {handoff && sendState !== "sent" ? (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="rounded-xl border border-pi-warmth/30 bg-pi-warmth/5 p-3">
                <p className="text-xs font-bold uppercase tracking-wider text-pi-warmth flex items-center gap-1.5">
                  <Mail size={14} aria-hidden="true" />
                  Send to PI
                </p>
                <p className="mt-1 text-sm leading-relaxed text-pi-ink/70">
                  We&apos;ll reply within 48 hours. Edit anything before sending.
                </p>
              </div>

              <form onSubmit={onHandoffSubmit} className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="hf-name" className="block text-xs font-semibold uppercase tracking-wide text-pi-ink/65">Name</label>
                    <input
                      id="hf-name"
                      name="hf-name"
                      type="text"
                      required
                      placeholder="Your name"
                      className="mt-1 w-full rounded-lg border border-pi-ink/15 bg-white px-2.5 py-2 text-sm text-pi-ink outline-none focus:border-pi-accent focus:ring-1 focus:ring-pi-accent"
                    />
                  </div>
                  <div>
                    <label htmlFor="hf-email" className="block text-xs font-semibold uppercase tracking-wide text-pi-ink/65">Email</label>
                    <input
                      id="hf-email"
                      name="hf-email"
                      type="email"
                      required
                      placeholder="your@email.com"
                      className="mt-1 w-full rounded-lg border border-pi-ink/15 bg-white px-2.5 py-2 text-sm text-pi-ink outline-none focus:border-pi-accent focus:ring-1 focus:ring-pi-accent"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="hf-message" className="block text-xs font-semibold uppercase tracking-wide text-pi-ink/65">Your message (editable)</label>
                  <textarea
                    id="hf-message"
                    name="hf-message"
                    required
                    rows={6}
                    defaultValue={initialMessage}
                    className="mt-1 w-full rounded-lg border border-pi-ink/15 bg-white px-2.5 py-2 text-sm leading-relaxed text-pi-ink outline-none focus:border-pi-accent focus:ring-1 focus:ring-pi-accent"
                  />
                  <p className="mt-1 text-[10px] text-pi-ink/45">
                    A summary of our conversation will be included for context.
                  </p>
                </div>
                {sendState === "error" && (
                  <p className="text-xs text-pi-error">Couldn&apos;t send — try again or email enquiries@performanceinterpreting.co.uk directly.</p>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={dismissHandoff}
                    className="flex-1 rounded-full border border-pi-ink/15 bg-white px-3 py-2 text-xs font-semibold text-pi-ink/70 transition hover:bg-pi-ink/5"
                  >
                    Back to chat
                  </button>
                  <button
                    type="submit"
                    disabled={sendState === "sending"}
                    className="flex-1 rounded-full bg-pi-warmth px-3 py-2 text-xs font-bold text-white shadow-md shadow-pi-warmth/30 transition hover:brightness-110 disabled:opacity-50"
                  >
                    {sendState === "sending" ? "Sending..." : "Send to PI"}
                  </button>
                </div>
              </form>
            </div>
          ) : sendState === "sent" ? (
            <div className="flex-1 overflow-y-auto p-6 text-center">
              <p className="font-display text-xl text-pi-ink">Thanks!</p>
              <p className="mt-3 text-sm leading-relaxed text-pi-ink/70">
                The team will be in touch within 48 hours.
              </p>
              <button
                type="button"
                onClick={() => {
                  dismissHandoff();
                  setSendState("idle");
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-pi-accent/30 bg-pi-accent/5 px-5 py-2 text-xs font-semibold text-pi-accent transition hover:bg-pi-accent hover:text-white"
              >
                Back to chat
              </button>
            </div>
          ) : (
            <>
              <div
                ref={scrollRef}
                className="flex-1 space-y-3 overflow-y-auto p-4"
                aria-live="polite"
                aria-atomic="false"
                aria-relevant="additions text"
                role="log"
                onClick={(e) => {
                  // On mobile (panel is full-screen) the underlying page
                  // would otherwise stay hidden after a Next/Link tap.
                  // Auto-dismiss on internal-link clicks so the user can
                  // see the page they navigated to. Conversation state is
                  // preserved (Assistant lives in the root layout).
                  const target = e.target as HTMLElement | null;
                  const anchor = target?.closest("a");
                  if (!anchor) return;
                  const href = anchor.getAttribute("href") || "";
                  if (!href.startsWith("/")) return; // external links open in new tab
                  if (window.matchMedia("(min-width: 640px)").matches) return; // desktop unchanged
                  setOpen(false);
                }}
              >
                {messages.map((m) => {
                  const text = extractTextFromMessage(m);
                  const parsed = parseHumanMarker(text);
                  const visible = parsed ? parsed.visible : text;
                  if (!visible) return null;
                  const isUser = m.role === "user";
                  return (
                    <div
                      key={m.id}
                      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                          isUser
                            ? "bg-pi-accent text-white"
                            : "bg-pi-canvas-soft text-pi-ink"
                        }`}
                      >
                        {isUser ? (
                          visible.split("\n").map((line, i) => (
                            <p key={i} className={i === 0 ? "" : "mt-2"}>
                              {line}
                            </p>
                          ))
                        ) : (
                          <MarkdownText text={visible} />
                        )}
                      </div>
                    </div>
                  );
                })}
                {isThinking && (
                  <div className="flex justify-start" aria-label="PIPA is typing">
                    <div className="rounded-2xl bg-pi-canvas-soft px-3 py-2 text-sm text-pi-ink/70">
                      <span className="inline-flex gap-1" aria-hidden="true">
                        <span className="h-1.5 w-1.5 animate-bounce motion-reduce:animate-none rounded-full bg-pi-ink/40 [animation-delay:0ms]" />
                        <span className="h-1.5 w-1.5 animate-bounce motion-reduce:animate-none rounded-full bg-pi-ink/40 [animation-delay:150ms]" />
                        <span className="h-1.5 w-1.5 animate-bounce motion-reduce:animate-none rounded-full bg-pi-ink/40 [animation-delay:300ms]" />
                      </span>
                      <span className="sr-only">PIPA is typing</span>
                    </div>
                  </div>
                )}
                {error && (
                  <p className="text-center text-xs text-pi-error">
                    Something went wrong. Try again, or email enquiries@performanceinterpreting.co.uk.
                  </p>
                )}

                {/* Audience picker — first turn, no audience set yet. Shown
                    instead of the sample chips. Tapping a card stores the
                    choice and reveals the audience-tailored chips. */}
                {messages.length === 1 && !isThinking && audience === null && (
                  <div className="rounded-2xl border border-pi-accent/20 bg-pi-accent/5 p-3">
                    <p className="text-sm font-semibold text-pi-ink">
                      To help you best — which one are you?
                    </p>
                    <div className="mt-3 grid gap-2">
                      {(
                        [
                          { id: "deaf", label: "I'm Deaf or hard of hearing", hint: "I'll show signed BSL or ISL videos when there's one." },
                          { id: "organiser", label: "I'm an event organiser", hint: "Quotes, lead times, working with venues." },
                          { id: "interpreter", label: "I'm an interpreter", hint: "PI roster, Academy, festival work." },
                        ] as { id: Audience; label: string; hint: string }[]
                      ).map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => setAudience(a.id)}
                          className="rounded-xl border border-pi-ink/10 bg-white p-3 text-left transition hover:border-pi-accent/50 hover:bg-pi-accent/5 focus:outline-none focus:ring-2 focus:ring-pi-accent"
                        >
                          <p className="text-sm font-semibold text-pi-ink">{a.label}</p>
                          <p className="mt-0.5 text-xs text-pi-ink/65">{a.hint}</p>
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setAudience("skipped")}
                      className="mt-2 text-xs font-medium text-pi-ink/55 underline underline-offset-2 hover:text-pi-ink"
                    >
                      Skip — just exploring
                    </button>
                  </div>
                )}

                {/* Sample-prompt chips — first turn, audience picked.
                    Audience-specific. Hidden after the user sends a message. */}
                {messages.length === 1 && !isThinking && audience !== null && (
                  <div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {audienceChips(audience).map((label) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => sendMessage({ text: label })}
                          className="rounded-full border border-pi-accent/25 bg-white px-3 py-1.5 text-sm text-pi-accent transition hover:bg-pi-accent hover:text-white motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-pi-accent focus:ring-offset-1"
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={resetAudience}
                      className="mt-2 text-xs font-medium text-pi-ink/55 underline underline-offset-2 hover:text-pi-ink"
                    >
                      Switch role
                    </button>
                  </div>
                )}
              </div>

              {/* Input */}
              <form
                onSubmit={onSubmit}
                className="flex items-center gap-2 border-t border-pi-ink/10 bg-pi-canvas/40 p-3"
              >
                <label htmlFor="pipa-input" className="sr-only">
                  Type your question for PIPA
                </label>
                <input
                  id="pipa-input"
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 rounded-full border border-pi-ink/15 bg-white px-3 py-2 text-base text-pi-ink outline-none focus:border-pi-accent focus:ring-2 focus:ring-pi-accent"
                  disabled={isThinking}
                />
                <button
                  type="submit"
                  aria-label="Send message to PIPA"
                  disabled={isThinking || !input.trim()}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-pi-accent text-white transition hover:brightness-110 disabled:opacity-40 motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-pi-accent focus:ring-offset-2"
                >
                  <SendHorizonal size={18} />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
