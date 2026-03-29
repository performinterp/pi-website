import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, enquiry_type, urgent } = body;

    if (!name || !email || !message || !enquiry_type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const urgentLabel = urgent ? " [URGENT]" : "";
    const enquiryLabels: Record<string, string> = {
      organiser: "Event Organiser",
      "deaf-community": "Deaf Community",
      interpreter: "Interpreter",
      other: "Other",
    };

    await resend.emails.send({
      from: "PI Website <website@performanceinterpreting.co.uk>",
      to: ["admin@performanceinterpreting.co.uk"],
      replyTo: email,
      subject: `${urgentLabel}New enquiry from ${name} (${enquiryLabels[enquiry_type] || enquiry_type})`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Enquiry type: ${enquiryLabels[enquiry_type] || enquiry_type}`,
        urgent ? `⚠️ URGENT — event within 2 weeks` : "",
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
