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
      <blockquote className="mx-auto max-w-3xl rounded-2xl border border-pi-accent/15 bg-pi-accent/5 p-8 text-center md:p-10">
        <p className="font-display text-lg italic leading-relaxed text-white md:text-xl">
          &ldquo;{quote}&rdquo;
        </p>
        <footer className="mt-5">
          <p className="text-sm font-semibold text-white">{name}</p>
          <p className="text-xs text-white/40">{context}</p>
        </footer>
      </blockquote>
    </AnimateIn>
  );
}
