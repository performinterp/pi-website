import type { Metadata } from "next";
import PageHero from "@/components/page-hero";
import RequestDraftBuilder from "../_components/request-draft-builder";

export const metadata: Metadata = {
  title: "Request an Interpreter - Performance Interpreting",
  description:
    "We'll write the email to the venue for you. Edit it as much as you like, copy it, or open it in your mail app. Performance Interpreting is CC'd for continued support.",
};

interface PageProps {
  searchParams: Promise<{ event?: string; venue?: string; date?: string }>;
}

export default async function EventRequestPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <>
      <PageHero
        title="Request an Interpreter"
        subtitle="Contacting a venue can feel daunting. We've made it as easy as possible by writing the email for you - edit it freely, then copy it or open it in your mail app."
        backgroundImage="/images/concert.jpg"
      />

      <section className="section-padding section-gap">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-6 text-pi-ink/75">
            <div>
              <h2 className="font-display text-2xl text-pi-ink">How it works</h2>
              <ol className="mt-4 space-y-4 text-base leading-relaxed">
                <li className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pi-warmth/15 text-xs font-bold text-pi-warmth">
                    1
                  </span>
                  <span>
                    Enter the details of the event you want to go to.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pi-warmth/15 text-xs font-bold text-pi-warmth">
                    2
                  </span>
                  <span>
                    If we have the venue&apos;s email we&apos;ll auto-fill it
                    for you. Otherwise, enter the one you have.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pi-warmth/15 text-xs font-bold text-pi-warmth">
                    3
                  </span>
                  <span>
                    A friendly draft email is generated. Edit it however you
                    like - or skip it entirely.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pi-warmth/15 text-xs font-bold text-pi-warmth">
                    4
                  </span>
                  <span>
                    Copy it to the clipboard, or open it in your email app.
                    Performance Interpreting will be CC&apos;d for continued
                    support.
                  </span>
                </li>
              </ol>
            </div>
            <div className="rounded-2xl border border-pi-accent/20 bg-pi-accent/5 p-5">
              <h3 className="font-display text-lg text-pi-ink">Your Rights</h3>
              <p className="mt-2 text-base font-semibold leading-relaxed text-pi-ink/85">
                BSL access is your right - not a favour.
              </p>
              <ul className="mt-2 space-y-1 text-sm text-pi-ink/65">
                <li>
                  <a
                    href="https://www.legislation.gov.uk/ukpga/2010/15/contents"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-pi-ink underline decoration-pi-accent decoration-2 underline-offset-2 hover:text-pi-accent"
                  >
                    Equality Act 2010
                  </a>{" "}
                  (England, Scotland, Wales)
                </li>
                <li>
                  <a
                    href="https://www.legislation.gov.uk/ukpga/1995/50/contents"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-pi-ink underline decoration-pi-accent decoration-2 underline-offset-2 hover:text-pi-accent"
                  >
                    Disability Discrimination Act 1995
                  </a>{" "}
                  (Northern Ireland)
                </li>
                <li>
                  <a
                    href="https://www.irishstatutebook.ie/eli/2000/act/8/enacted/en/html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-pi-ink underline decoration-pi-accent decoration-2 underline-offset-2 hover:text-pi-accent"
                  >
                    Equal Status Acts 2000-2018
                  </a>{" "}
                  (Ireland)
                </li>
                <li>
                  <a
                    href="https://www.irishstatutebook.ie/eli/2017/act/40/enacted/en/html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-pi-ink underline decoration-pi-accent decoration-2 underline-offset-2 hover:text-pi-accent"
                  >
                    Irish Sign Language Act 2017
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-pi-ink/10 bg-white p-6 shadow-sm md:p-8">
            <h2 className="font-display text-2xl text-pi-ink">
              Enter the details of the event you want to go to
            </h2>
            <p className="mt-2 text-base text-pi-ink/65">
              We&apos;ll generate the email for you to send.
            </p>
            <div className="mt-6">
              <RequestDraftBuilder
                initialEvent={params.event}
                initialVenue={params.venue}
                initialDate={params.date}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
