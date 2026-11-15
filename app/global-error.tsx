"use client";

import "./globals.css";

// Last resort, used only if the root layout itself fails, so it renders its
// own <html> and <body> and can't rely on the nav, footer or contact page.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-pi-canvas p-6 text-center text-pi-ink">
        <h1 className="text-4xl font-semibold">Something went wrong</h1>
        <p className="mt-4 max-w-md">
          The website didn&apos;t load properly. Please try again, or email
          admin@performanceinterpreting.co.uk.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-full bg-pi-accent px-7 py-3 text-sm font-semibold text-white"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
