import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TO = process.env.CONTACT_TO ?? "souravkhan654@gmail.com";

/** Escape user input before it goes anywhere near an HTML email body. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Strip CR/LF so a crafted name can't inject extra mail headers. */
function sanitizeHeader(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export async function POST(request: Request) {
  const limit = rateLimit(`contact:${clientIp(request)}`, 3, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { message: "Too many messages — try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  try {
    const body = await request.json();

    // Honeypot — pretend it worked so bots don't retry.
    if (body.website) {
      return NextResponse.json({ message: "Email sent successfully" });
    }

    const name = sanitizeHeader(String(body.name ?? "")).slice(0, 100);
    const email = sanitizeHeader(String(body.email ?? "")).slice(0, 254);
    const message = String(body.message ?? "")
      .trim()
      .slice(0, 5000);

    if (!name || !message || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { message: "Please fill in a name, a valid email, and a message." },
        { status: 400 },
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: TO,
      replyTo: `${name} <${email}>`,
      subject: `Portfolio contact — ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      `,
    });

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "Failed to send email" },
      { status: 500 },
    );
  }
}
