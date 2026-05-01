import { Resend } from "resend";
import { NextResponse } from "next/server";

interface TranscriptTurn {
  role: "user" | "assistant";
  content: string;
}

interface Body {
  name?: string;
  email?: string;
  message?: string;
  summary?: { topic?: string; tried?: string; question?: string };
  transcript?: TranscriptTurn[];
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const { name, email, message, summary, transcript } = body;

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
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
