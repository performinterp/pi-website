"use client";

import Link from "next/link";
import { useEffect } from "react";

// Shown when a page fails to render, e.g. a data source is down and there's
// no earlier copy to fall back on. Before this, visitors got Next's bare
// default error screen.
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center section-padding text-center">
      <h1 className="font-display text-4xl text-pi-ink md:text-5xl">Something went wrong</h1>
      <p className="mt-4 max-w-md text-pi-ink/75">
        This page didn&apos;t load properly. Please try again, or contact our team if it keeps
        happening.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full bg-pi-accent px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-pi-accent/25 transition-all duration-200 hover:brightness-110"
        >
          Try again
        </button>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-full border border-pi-ink/20 px-7 py-3 text-sm font-semibold text-pi-ink transition-all duration-200 hover:border-pi-ink/40"
        >
          Contact the team
        </Link>
      </div>
    </section>
  );
}
