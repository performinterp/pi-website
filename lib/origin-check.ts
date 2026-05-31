const PROD_ORIGIN = "https://performanceinterpreting.co.uk";

// Vercel preview deployments live on *.vercel.app subdomains — allow them
// in non-production so preview branches keep working end-to-end.
const VERCEL_PREVIEW_SUFFIX = ".vercel.app";

const ALLOWED_ORIGINS = new Set<string>([
  PROD_ORIGIN,
  ...(process.env.NODE_ENV === "development"
    ? ["http://localhost:3000", "http://127.0.0.1:3000"]
    : []),
]);

function isAllowed(originUrl: string): boolean {
  try {
    const u = new URL(originUrl);
    const o = `${u.protocol}//${u.host}`;
    if (ALLOWED_ORIGINS.has(o)) return true;
    if (process.env.NODE_ENV !== "production" && u.hostname.endsWith(VERCEL_PREVIEW_SUFFIX)) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function isAllowedOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  // Same-origin browser requests sometimes omit Origin. Fall back to
  // Referer for those. Server-to-server requests have neither — reject.
  if (origin) return isAllowed(origin);
  const referer = req.headers.get("referer");
  if (referer) return isAllowed(referer);
  return false;
}
