import { NextResponse } from "next/server";
import { Resend } from "resend";
import { VideoFeedbackSchema, escapeHtml } from "@/lib/api-schemas";
import { isAllowedOrigin } from "@/lib/origin-check";

export async function POST(request: Request) {
  try {
    if (!isAllowedOrigin(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Match the sibling-route pattern: fail fast on misconfig with a
    // generic error string so config state isn't a public oracle, and
    // construct the Resend client only after the env var is confirmed
    // present (module-level `new Resend(undefined)` would otherwise
    // either throw at import or silently produce a 500-every-request
    // client with no observability).
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return NextResponse.json(
        { error: "Failed to send notification" },
        { status: 500 }
      );
    }

    const clHeader = request.headers.get("content-length");
    const contentLength = clHeader !== null ? Number(clHeader) : NaN;
    if (!Number.isFinite(contentLength) || contentLength > 10_000) {
      return NextResponse.json({ error: "Body too large" }, { status: 413 });
    }

    const parsed = VideoFeedbackSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const safeUrl = escapeHtml(parsed.data.url);

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "PI Website <website@performanceinterpreting.co.uk>",
      to: "admin@performanceinterpreting.co.uk",
      subject: "New video feedback received",
      html: `
        <h2>New Video Feedback</h2>
        <p>A visitor has submitted video feedback via the website.</p>
        <p><strong>Video URL:</strong> <a href="${safeUrl}">${safeUrl}</a></p>
        <p>This video was uploaded via the PI website feedback form.</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    // Don't swallow silently — operators need to distinguish Resend
    // down vs malformed input vs invalid key.
    console.error("Video feedback error:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}
