// Easy Read summary box, shown near the top of a page only when Easy Read is
// on (the `er-only` class). Server component, so it is in the first paint.
// Copy for static pages lives in content/easy-read.json (read via
// getEasyRead); event/venue/city copy comes from lib/easy-read-auto.ts.
// Check wording with `npm run check:easy-read`.
import Link from "next/link";
import SignedClip from "@/components/signed-clip";
import type { EasyReadAction, EasyReadPage } from "@/lib/types";

const PRIMARY =
  "inline-flex items-center justify-center rounded-full bg-pi-accent px-7 py-3.5 text-lg font-bold text-white hover:brightness-110";
const SECONDARY =
  "inline-flex items-center justify-center rounded-full border-2 border-pi-accent px-7 py-3 text-lg font-semibold text-pi-accent hover:bg-pi-accent/10";

function ActionLink({ action, primary }: { action: EasyReadAction; primary: boolean }) {
  const cls = (action.style ?? (primary ? "primary" : "secondary")) === "primary" ? PRIMARY : SECONDARY;
  if (/^\/(?!\/)/.test(action.href)) {
    return <Link href={action.href} className={cls}>{action.label}</Link>;
  }
  const external = action.href.startsWith("https://");
  return (
    <a
      href={action.href}
      className={cls}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {action.label}
    </a>
  );
}

function PointIcon({ icon }: { icon: string }) {
  const box = "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl";
  if (icon.startsWith("/")) {
    const bg = icon.includes("-white") ? "bg-pi-navy" : "bg-pi-accent/10";
    return (
      <span className={`${box} ${bg}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={icon} alt="" className="h-10 w-10 object-contain" />
      </span>
    );
  }
  return <span aria-hidden="true" className={`${box} bg-pi-accent/10 text-3xl`}>{icon}</span>;
}

export default function EasyReadSummary({
  page,
  clearHeader = false,
}: {
  page: EasyReadPage | undefined;
  /** For pages with no hero: push the box below the fixed header. */
  clearHeader?: boolean;
}) {
  if (!page) return null;
  return (
    <section className={`er-only section-padding pb-2 ${clearHeader ? "pt-24 md:pt-28" : "pt-8"}`}>
      <div className="mx-auto max-w-3xl rounded-3xl border-2 border-pi-accent/30 bg-white p-6 shadow-sm md:p-8">
        <p className="text-base font-semibold text-pi-accent">This page in Easy Read</p>
        <h2 className="mt-1 font-display text-3xl leading-tight text-pi-ink">{page.title}</h2>
        <ul className="mt-6 space-y-5">
          {page.points.map((p) => (
            <li key={p.text} className="flex items-start gap-4">
              <PointIcon icon={p.icon} />
              <span className="pt-2.5 text-xl leading-relaxed text-pi-ink">{p.text}</span>
            </li>
          ))}
        </ul>
        {page.signed && (
          <div className="mt-8">
            <SignedClip {...page.signed} />
          </div>
        )}
        {page.actions && page.actions.length > 0 && (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {page.actions.map((a, i) => (
              <ActionLink key={a.href + a.label} action={a} primary={i === 0} />
            ))}
          </div>
        )}
        <p className="mt-8 border-t border-pi-ink/10 pt-5 text-lg text-pi-ink">
          The full page is below. It has more detail.
        </p>
      </div>
    </section>
  );
}
