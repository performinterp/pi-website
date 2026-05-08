"use client";

// Easy-Read-aware "How it works" intro for the request page.
// Renders standard or simpler copy depending on the global Easy-Read flag.
//
// Lives as a separate client component so the rest of the request page
// can stay a server component (preserving metadata export).

import { useEasyRead } from "@/lib/easy-read";

export default function RequestIntro() {
  const { on: easyRead } = useEasyRead();

  if (easyRead) {
    return (
      <div className="space-y-6 text-pi-ink/85">
        <div>
          <h2 className="font-display text-2xl text-pi-ink">How it works</h2>
          <ol className="mt-4 space-y-5 text-lg leading-relaxed">
            <Step n={1}>Tell us about the event you want to go to.</Step>
            <Step n={2}>
              We will fill in the venue&apos;s email if we have it. If not,
              you can type one in.
            </Step>
            <Step n={3}>We will write the email for you. You can change the words.</Step>
            <Step n={4}>
              Send the email. We get a copy. We will help if you need us.
            </Step>
          </ol>
        </div>
        <div className="rounded-2xl border border-pi-accent/20 bg-pi-accent/5 p-5">
          <h3 className="font-display text-lg text-pi-ink">Your rights</h3>
          <p className="mt-2 text-lg font-semibold leading-relaxed text-pi-ink/85">
            You have a right to BSL. The venue must help.
          </p>
          <ul className="mt-3 space-y-2 text-base text-pi-ink/70">
            <li>
              <RightsLink
                href="https://www.legislation.gov.uk/ukpga/2010/15/contents"
              >
                Equality Act 2010
              </RightsLink>{" "}
              — England, Scotland, Wales
            </li>
            <li>
              <RightsLink
                href="https://www.legislation.gov.uk/ukpga/1995/50/contents"
              >
                Disability Discrimination Act 1995
              </RightsLink>{" "}
              — Northern Ireland
            </li>
            <li>
              <RightsLink
                href="https://www.irishstatutebook.ie/eli/2000/act/8/enacted/en/html"
              >
                Equal Status Acts 2000-2018
              </RightsLink>{" "}
              — Ireland
            </li>
            <li>
              <RightsLink
                href="https://www.irishstatutebook.ie/eli/2017/act/40/enacted/en/html"
              >
                Irish Sign Language Act 2017
              </RightsLink>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  // Standard variant — original copy from page.tsx
  return (
    <div className="space-y-6 text-pi-ink/75">
      <div>
        <h2 className="font-display text-2xl text-pi-ink">How it works</h2>
        <ol className="mt-4 space-y-4 text-base leading-relaxed">
          <Step n={1}>Enter the details of the event you want to go to.</Step>
          <Step n={2}>
            If we have the venue&apos;s email we&apos;ll auto-fill it for you.
            Otherwise, enter the one you have.
          </Step>
          <Step n={3}>
            A friendly draft email is generated. Edit it however you like - or
            skip it entirely.
          </Step>
          <Step n={4}>
            Copy it to the clipboard, or open it in your email app. Performance
            Interpreting will be CC&apos;d for continued support.
          </Step>
        </ol>
      </div>
      <div className="rounded-2xl border border-pi-accent/20 bg-pi-accent/5 p-5">
        <h3 className="font-display text-lg text-pi-ink">Your Rights</h3>
        <p className="mt-2 text-base font-semibold leading-relaxed text-pi-ink/85">
          BSL access is your right - not a favour.
        </p>
        <ul className="mt-2 space-y-1 text-sm text-pi-ink/65">
          <li>
            <RightsLink
              href="https://www.legislation.gov.uk/ukpga/2010/15/contents"
            >
              Equality Act 2010
            </RightsLink>{" "}
            (England, Scotland, Wales)
          </li>
          <li>
            <RightsLink
              href="https://www.legislation.gov.uk/ukpga/1995/50/contents"
            >
              Disability Discrimination Act 1995
            </RightsLink>{" "}
            (Northern Ireland)
          </li>
          <li>
            <RightsLink
              href="https://www.irishstatutebook.ie/eli/2000/act/8/enacted/en/html"
            >
              Equal Status Acts 2000-2018
            </RightsLink>{" "}
            (Ireland)
          </li>
          <li>
            <RightsLink
              href="https://www.irishstatutebook.ie/eli/2017/act/40/enacted/en/html"
            >
              Irish Sign Language Act 2017
            </RightsLink>
          </li>
        </ul>
      </div>
    </div>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pi-warmth/15 text-xs font-bold text-pi-warmth">
        {n}
      </span>
      <span>{children}</span>
    </li>
  );
}

function RightsLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-pi-ink underline decoration-pi-accent decoration-2 underline-offset-2 hover:text-pi-accent"
    >
      {children}
    </a>
  );
}
