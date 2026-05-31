import { Resend } from "resend";
import { NextResponse } from "next/server";
import { ChatHandoffSchema } from "@/lib/api-schemas";
import { isAllowedOrigin } from "@/lib/origin-check";
import {
  formRateLimitPerMinute,
  formRateLimitPerDay,
  checkRateLimits,
  getClientIp,
  rateLimitResponse,
} from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    if (!isAllowedOrigin(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const rateDecision = await checkRateLimits(getClientIp(request), [
      formRateLimitPerMinute,
      formRateLimitPerDay,
    ]);
    if (!rateDecision.allowed) return rateLimitResponse(rateDecision);

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

    const parsed = ChatHandoffSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const { name, email, message, summary, transcript, website } = parsed.data;

    if (website && website.length > 0) {
      return NextResponse.json({ success: true });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const subjectTopic = summary?.topic?.trim() || "assistance request";
    const transcriptText = (transcript ?? [])
      .map((turn) => `${turn.role === "user" ? "User" : "Assistant"}: ${turn.content}`)
      .join("\n\n");

    const lines: string[] = [];
    lines.push(`Name: ${name}`);
    lines.push(`Email: ${email}`);
    lines.push("");
    if (summary?.topic) lines.push(`Topic: ${summary.topic}`);
    if (summary?.tried) lines.push(`What they tried: ${summary.tried}`);
    if (summary?.question) lines.push(`Their question: ${summary.question}`);
    lines.push("");
    lines.push("Message from user (edited):");
    lines.push(message);
    if (transcriptText) {
      lines.push("");
      lines.push("---");
      lines.push("Full conversation:");
      lines.push("");
      lines.push(transcriptText);
    }

    await resend.emails.send({
      from: "PI Website <website@performanceinterpreting.co.uk>",
      to: ["enquiries@performanceinterpreting.co.uk"],
      replyTo: email,
      subject: `Chat transcript — ${subjectTopic}`,
      text: lines.join("\n"),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Chat handoff error:", error);
    return NextResponse.json(
      { error: "Failed to send transcript" },
      { status: 500 }
    );
  }
}
