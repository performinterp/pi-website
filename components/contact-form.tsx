"use client";

import { useState } from "react";

const enquiryTypes = [
  { value: "organiser", label: "Event organiser — book interpreters" },
  { value: "deaf-community", label: "Deaf community — request access" },
  { value: "interpreter", label: "Interpreter — join the team" },
  { value: "other", label: "Other enquiry" },
];

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="rounded-2xl border border-pi-success/30 bg-pi-success/5 p-8 text-center md:p-12">
        <p className="font-display text-2xl text-white">Message sent</p>
        <p className="mt-3 text-white/60">
          We&apos;ll get back to you within one working day.
        </p>
      </div>
    );
  }

  return (
    <form
      action="https://formspree.io/f/placeholder"
      method="POST"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="space-y-6"
    >
      <div>
        <label htmlFor="enquiry-type" className="block text-sm font-medium text-white/70">
          I am a...
        </label>
        <select
          id="enquiry-type"
          name="enquiry_type"
          required
          className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-pi-accent focus:ring-1 focus:ring-pi-accent"
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
          <label htmlFor="name" className="block text-sm font-medium text-white/70">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition focus:border-pi-accent focus:ring-1 focus:ring-pi-accent"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white/70">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition focus:border-pi-accent focus:ring-1 focus:ring-pi-accent"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-white/70">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition focus:border-pi-accent focus:ring-1 focus:ring-pi-accent"
          placeholder="Tell us about your event, access request, or enquiry..."
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="urgent"
          name="urgent"
          className="h-4 w-4 rounded border-white/15 bg-white/5 text-pi-accent focus:ring-pi-accent"
        />
        <label htmlFor="urgent" className="text-sm text-white/50">
          This is urgent (event within 2 weeks)
        </label>
      </div>

      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-full bg-pi-accent px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pi-accent/25 transition-all duration-200 hover:brightness-110 hover:shadow-pi-accent/40"
      >
        Send message
      </button>
    </form>
  );
}
