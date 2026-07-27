import { NextResponse } from "next/server";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/**
 * Newsletter signup, backed by Buttondown.
 *
 *   BUTTONDOWN_API_KEY – from buttondown.com/settings/programming
 *
 * Unconfigured, this returns 503 rather than pretending to succeed.
 */
const API_KEY = process.env.BUTTONDOWN_API_KEY;
const ENDPOINT = "https://api.buttondown.email/v1/subscribers";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  const limit = rateLimit(`subscribe:${clientIp(request)}`, 5, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "too many attempts, try again later" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let payload: { email?: string; website?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  // Honeypot — answer 200 so bots don't learn they were caught.
  if (payload.website) {
    return NextResponse.json({ ok: true, message: "You're on the list." });
  }

  const email = String(payload.email ?? "")
    .trim()
    .toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json(
      { error: "that doesn't look like a valid email" },
      { status: 400 },
    );
  }

  if (!API_KEY) {
    return NextResponse.json(
      { error: "the newsletter isn't set up yet" },
      { status: 503 },
    );
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Token ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, tags: ["portfolio"] }),
  });

  // Buttondown 400s on an address that's already subscribed; that's a success
  // from the reader's point of view, and confirming it leaks nothing they
  // didn't already know about their own address.
  if (res.status === 400) {
    return NextResponse.json({
      ok: true,
      message: "You're already on the list.",
    });
  }

  if (!res.ok) {
    console.error("Buttondown subscribe failed:", res.status, await res.text());
    return NextResponse.json(
      { error: "couldn't subscribe, try again" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, message: "You're on the list." });
}
