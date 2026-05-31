import { NextResponse } from "next/server";
import { Resend } from "resend";
import { VideoFeedbackSchema, escapeHtml } from "@/lib/api-schemas";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get("content-length") ?? "0");
    if (contentLength > 10_000) {
      return NextResponse.json({ error: "Body too large" }, { status: 413 });
    }

    const parsed = VideoFeedbackSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const safeUrl = escapeHtml(parsed.data.url);

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
  } catch {
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
