const PROD_ORIGIN = "https://performanceinterpreting.co.uk";

// Vercel preview deployments live on *.vercel.app subdomains — allow them
// in non-production so preview branches keep working end-to-end.
// Use VERCEL_ENV (not NODE_ENV): Vercel sets NODE_ENV=production on BOTH
// preview and production builds, so NODE_ENV can't distinguish them.
// VERCEL_ENV is "production" | "preview" | "development" | undefined (local).
const VERCEL_PREVIEW_SUFFIX = ".vercel.app";
const IS_NON_PROD = process.env.VERCEL_ENV !== "production";

const ALLOWED_ORIGINS = new Set<string>([
  PROD_ORIGIN,
  ...(IS_NON_PROD ? ["http://localhost:3000", "http://127.0.0.1:3000"] : []),
]);

function isAllowed(originUrl: string): boolean {
  try {
    const u = new URL(originUrl);
    const o = `${u.protocol}//${u.host}`;
    if (ALLOWED_ORIGINS.has(o)) return true;
    if (IS_NON_PROD && u.hostname.endsWith(VERCEL_PREVIEW_SUFFIX)) {
      return true;
    }
    return false;
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
