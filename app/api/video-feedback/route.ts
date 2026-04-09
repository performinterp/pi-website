import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    await resend.emails.send({
      from: "PI Website <website@performanceinterpreting.co.uk>",
      to: "admin@performanceinterpreting.co.uk",
      subject: "New video feedback received",
      html: `
        <h2>New Video Feedback</h2>
        <p>A visitor has submitted video feedback via the website.</p>
        <p><strong>Video URL:</strong> <a href="${url}">${url}</a></p>
        <p>This video was uploaded via the PI website feedback form.</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
