// Both production hostnames. Vercel auto-redirects www → apex (307), but
// a direct curl/non-browser integration that doesn't follow redirects, or
// a same-origin browser fetch from the www-served HTML before the redirect
// settles, would carry the www Origin. Allowlist both.
const PROD_ORIGINS = [
  "https://performanceinterpreting.co.uk",
  "https://www.performanceinterpreting.co.uk",
];

// Vercel injects the current deploy's own URL into VERCEL_URL (always set on
// any Vercel build) and VERCEL_BRANCH_URL (preview/prod branch alias). Allow
// only those exact origins on non-production — NOT a wildcard `.vercel.app`
// suffix, because any attacker can register a free *.vercel.app project
// and would otherwise pass the check.
// VERCEL_ENV is "production" | "preview" | "development" | undefined (local).
const VERCEL_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;
const VERCEL_BRANCH_URL = process.env.VERCEL_BRANCH_URL ? `https://${process.env.VERCEL_BRANCH_URL}` : null;
const IS_NON_PROD = process.env.VERCEL_ENV !== "production";

const ALLOWED_ORIGINS = new Set<string>([
  ...PROD_ORIGINS,
  ...(IS_NON_PROD && VERCEL_URL ? [VERCEL_URL] : []),
  ...(IS_NON_PROD && VERCEL_BRANCH_URL ? [VERCEL_BRANCH_URL] : []),
  ...(IS_NON_PROD ? ["http://localhost:3000", "http://127.0.0.1:3000"] : []),
]);

function isAllowed(originUrl: string): boolean {
  try {
    const u = new URL(originUrl);
    const o = `${u.protocol}//${u.host}`;
    return ALLOWED_ORIGINS.has(o);
  } catch {
    return false;
  }
}

export function isAllowedOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (origin) {
    const allowed = isAllowed(origin);
    if (!allowed) console.warn(`[origin-check] rejected origin: ${origin}`);
    return allowed;
  }
  // Same-origin browser requests sometimes omit Origin (older browsers,
  // privacy extensions). Fall back to Referer for those.
  const referer = req.headers.get("referer");
  if (referer) {
    const allowed = isAllowed(referer);
    if (!allowed) console.warn(`[origin-check] rejected referer: ${referer}`);
    return allowed;
  }
  console.warn("[origin-check] rejected: no Origin or Referer header");
  return false;
}
