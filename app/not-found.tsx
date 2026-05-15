import Link from "next/link";
import NotFoundTracker from "@/components/not-found-tracker";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center section-padding text-center">
      <NotFoundTracker />
      <p className="text-xs font-semibold uppercase tracking-widest text-pi-accent">
        404
      </p>
      <h1 className="mt-3 font-display text-4xl text-white md:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-white/60">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-pi-accent px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-pi-accent/25 transition-all duration-200 hover:brightness-110"
        >
          Go home
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3 text-sm font-semibold text-white transition-all duration-200 hover:border-white/40 hover:bg-white/10"
        >
          Contact us
        </Link>
      </div>
    </section>
  );
}
