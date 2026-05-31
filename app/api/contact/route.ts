import { Resend } from "resend";
import { NextResponse } from "next/server";
import { ContactSchema } from "@/lib/api-schemas";
import { isAllowedOrigin } from "@/lib/origin-check";

export async function POST(request: Request) {
  try {
    if (!isAllowedOrigin(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const contentLength = Number(request.headers.get("content-length") ?? "0");
    if (contentLength > 100_000) {
      return NextResponse.json({ error: "Body too large" }, { status: 413 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const parsed = ContactSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const { name, email, message, enquiry_type, urgent, website } = parsed.data;

    // Honeypot — silently 200 so bots don't tune around it
    if (website && website.length > 0) {
      return NextResponse.json({ success: true });
    }

    const urgentLabel = urgent ? " [URGENT]" : "";
    const enquiryLabels: Record<string, string> = {
      organiser: "Event Organiser",
      "deaf-community": "Deaf Community",
      interpreter: "Interpreter",
      other: "Other",
    };

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "PI Website <website@performanceinterpreting.co.uk>",
      to: ["enquiries@performanceinterpreting.co.uk"],
      replyTo: email,
      subject: `${urgentLabel}New enquiry from ${name} (${enquiryLabels[enquiry_type] || enquiry_type})`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Enquiry type: ${enquiryLabels[enquiry_type] || enquiry_type}`,
        urgent ? `⚠️ URGENT - event within 2 weeks` : "",
        "",
        "Message:",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
