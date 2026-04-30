import AnimateIn from "./animate-in";

interface TestimonialQuoteProps {
  quote: string;
  name?: string;
  context?: string;
  wide?: boolean;
}

export default function TestimonialQuote({
  quote,
  name,
  context,
  wide,
}: TestimonialQuoteProps) {
  return (
    <AnimateIn>
      <blockquote className={`mx-auto rounded-2xl border border-pi-accent/25 bg-pi-accent/8 p-8 text-center md:p-12 ${wide ? "max-w-5xl" : "max-w-3xl"}`}>
        <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-pi-accent/50" />
        <p className="font-display text-xl italic leading-relaxed text-pi-ink/90 md:text-2xl">
          &ldquo;{quote}&rdquo;
        </p>
        {(name || context) && (
          <footer className="mt-6">
            {name && <p className="text-base font-semibold text-pi-ink">{name}</p>}
            {context && <p className="text-sm text-pi-ink/60">{context}</p>}
          </footer>
        )}
      </blockquote>
    </AnimateIn>
  );
}
