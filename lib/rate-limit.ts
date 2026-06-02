import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Graceful-fallback: if Upstash env vars are missing (e.g. local dev,
// preview before secrets are wired) we skip rate-limiting entirely
// rather than crash every API request. Production MUST have both vars
// set or the chat endpoint is unprotected — log a single warning at
// module load if they're missing so it's visible in Vercel logs.
const HAS_UPSTASH =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

if (!HAS_UPSTASH && process.env.NODE_ENV === "production") {
  console.warn(
    "[rate-limit] UPSTASH_REDIS_REST_URL/TOKEN missing in production — API rate limiting is DISABLED"
  );
}

function makeLimiter(limit: number, window: `${number} ${"s" | "m" | "h" | "d"}`, prefix: string) {
  if (!HAS_UPSTASH) return null;
  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(limit, window),
    analytics: true,
    prefix,
  });
}

// Two-tier per-endpoint protection. Chat is the financial-DoS risk
// (Anthropic billing); contact/handoff are spam risks.
export const chatRateLimitPerMinute = makeLimiter(10, "60 s", "rl:chat:min");
export const chatRateLimitPerDay = makeLimiter(100, "1 d", "rl:chat:day");

// Soft daily budget — kicks in BEFORE the hard 100/day cap. When tripped
// the route streams back a friendly "use the contact form" nudge instead
// of returning a 429. Same UX pattern as the on-topic classifier refusal:
// no harsh failure, just a redirect to the human team. Catches bored
// browsers / curious researchers caining the assistant without making
// them feel rate-limited.
export const chatSoftLimitPerDay = makeLimiter(25, "1 d", "rl:chat:soft");

export const formRateLimitPerMinute = makeLimiter(5, "60 s", "rl:form:min");
export const formRateLimitPerDay = makeLimiter(20, "1 d", "rl:form:day");

export function getClientIp(req: Request): string {
  // Vercel sets x-real-ip to the trusted client IP measured at the edge.
  // Prefer it — it's not attacker-controllable from request headers.
  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  // Fallback: RIGHTMOST X-Forwarded-For value. Vercel APPENDS the actual
  // measured client IP to whatever the client claimed; leftmost is whatever
  // the attacker set. Never trust leftmost — without this, an attacker can
  // spoof `X-Forwarded-For: <random-per-request>` to get a fresh rate-limit
  // bucket every call and defeat the chat limiter entirely (the limiter
  // exists specifically to cap Anthropic billing exposure).
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((s) => s.trim()).filter(Boolean);
    const rightmost = parts[parts.length - 1];
    if (rightmost) return rightmost;
  }
  return "unknown";
}

type Limiter = ReturnType<typeof makeLimiter>;

export type RateLimitDecision =
  | { allowed: true }
  | {
      allowed: false;
      retryAfter: number;
      limit: number;
      remaining: number;
      reset: number;
    };

export async function checkRateLimits(
  ip: string,
  limiters: Limiter[]
): Promise<RateLimitDecision> {
  // If Upstash isn't configured, every limiter is null → fail-open.
  const live = limiters.filter((l): l is NonNullable<Limiter> => l !== null);
  if (live.length === 0) return { allowed: true };

  const results = await Promise.all(live.map((l) => l.limit(ip)));
  const exceeded = results.find((r) => !r.success);
  if (!exceeded) return { allowed: true };

  const retryAfter = Math.max(1, Math.ceil((exceeded.reset - Date.now()) / 1000));
  return {
    allowed: false,
    retryAfter,
    limit: exceeded.limit,
    remaining: exceeded.remaining,
    reset: exceeded.reset,
  };
}

export function rateLimitResponse(decision: Extract<RateLimitDecision, { allowed: false }>): Response {
  return new Response(
    JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(decision.retryAfter),
        "X-RateLimit-Limit": String(decision.limit),
        "X-RateLimit-Remaining": String(decision.remaining),
        "X-RateLimit-Reset": String(decision.reset),
      },
    }
  );
}
