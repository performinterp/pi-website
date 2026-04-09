import AnimateIn from "./animate-in";

interface TestimonialQuoteProps {
  quote: string;
  name: string;
  context: string;
}

export default function TestimonialQuote({
  quote,
  name,
  context,
}: TestimonialQuoteProps) {
  return (
    <AnimateIn>
      <blockquote className="mx-auto max-w-3xl rounded-2xl border border-pi-accent/25 bg-pi-accent/8 p-8 text-center md:p-12">
        <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-pi-accent/40" />
        <p className="font-display text-xl italic leading-relaxed text-white/90 md:text-2xl">
          &ldquo;{quote}&rdquo;
        </p>
        <footer className="mt-6">
          <p className="text-base font-semibold text-white">{name}</p>
          <p className="text-sm text-white/60">{context}</p>
        </footer>
      </blockquote>
    </AnimateIn>
  );
}
