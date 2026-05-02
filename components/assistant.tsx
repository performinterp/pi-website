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

// Minimal inline Markdown renderer — links, **bold**, paragraphs, bullet lists.
// We avoid pulling in react-markdown to keep the widget bundle small.
function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Match either a markdown link [text](url) or **bold**
  const re = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1] && m[2]) {
      const url = m[2];
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
      parts.push(
        <strong key={`b${key++}`} className="font-semibold">
          {m[3]}
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

export default function Assistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [handoff, setHandoff] = useState<{
    summary: HumanSummary;
    transcript: { role: "user" | "assistant"; content: string }[];
  } | null>(null);
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const scrollRef = useRef<HTMLDivElement>(null);

  const transport = useMemo(
    // Trailing slash matches Next's trailingSlash config — without it
    // every send eats a 308 redirect round-trip.
    () => new DefaultChatTransport<UIMessage>({ api: "/api/chat/" }),
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
            text: "Hi! I'm the Performance Interpreting assistant. I can help with questions about Deaf access at live events, BSL/ISL interpreting, our app, and how we work with venues and organisers. How can I help?",
          },
        ],
      } as UIMessage,
    ],
  });

  // Auto-scroll on new content
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

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
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close assistant" : "Open assistant"}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-pi-accent text-white shadow-2xl shadow-pi-accent/40 transition-all hover:brightness-110 hover:scale-105 print:hidden md:bottom-6 md:right-6"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Panel */}
      {open && (
        <div
          className="fixed bottom-24 right-3 z-40 flex w-[calc(100vw-1.5rem)] max-w-[400px] flex-col overflow-hidden rounded-2xl border border-pi-ink/10 bg-white shadow-2xl shadow-black/20 print:hidden md:bottom-28 md:right-6"
          style={{ height: "min(70vh, 600px)" }}
          role="dialog"
          aria-label="Performance Interpreting assistant"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-pi-ink/10 bg-pi-navy px-4 py-3 text-white">
            <div>
              <p className="font-display text-base">PI Assistant</p>
              <p className="text-[11px] text-white/65">Ask me about events, access, or our app</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
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
                <p className="mt-1 text-xs leading-relaxed text-pi-ink/70">
                  We&apos;ll reply within 48 hours. Edit anything before sending.
                </p>
              </div>

              <form onSubmit={onHandoffSubmit} className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="hf-name" className="block text-xs font-semibold uppercase tracking-wide text-pi-ink/55">Name</label>
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
                    <label htmlFor="hf-email" className="block text-xs font-semibold uppercase tracking-wide text-pi-ink/55">Email</label>
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
                  <label htmlFor="hf-message" className="block text-xs font-semibold uppercase tracking-wide text-pi-ink/55">Your message (editable)</label>
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
                    onClick={() => setHandoff(null)}
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
                  setHandoff(null);
                  setSendState("idle");
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-pi-accent/30 bg-pi-accent/5 px-5 py-2 text-xs font-semibold text-pi-accent transition hover:bg-pi-accent hover:text-white"
              >
                Back to chat
              </button>
            </div>
          ) : (
            <>
              <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
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
                  <div className="flex justify-start">
                    <div className="rounded-2xl bg-pi-canvas-soft px-3 py-2 text-sm text-pi-ink/60">
                      <span className="inline-flex gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-pi-ink/40 [animation-delay:0ms]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-pi-ink/40 [animation-delay:150ms]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-pi-ink/40 [animation-delay:300ms]" />
                      </span>
                    </div>
                  </div>
                )}
                {error && (
                  <p className="text-center text-xs text-pi-error">
                    Something went wrong. Try again, or email enquiries@performanceinterpreting.co.uk.
                  </p>
                )}
              </div>

              {/* Input */}
              <form
                onSubmit={onSubmit}
                className="flex items-center gap-2 border-t border-pi-ink/10 bg-pi-canvas/40 p-3"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 rounded-full border border-pi-ink/15 bg-white px-3 py-2 text-sm text-pi-ink outline-none focus:border-pi-accent focus:ring-1 focus:ring-pi-accent"
                  disabled={isThinking}
                />
                <button
                  type="submit"
                  aria-label="Send"
                  disabled={isThinking || !input.trim()}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-pi-accent text-white transition hover:brightness-110 disabled:opacity-40"
                >
                  <SendHorizonal size={16} />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
