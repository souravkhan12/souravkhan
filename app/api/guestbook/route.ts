import { NextResponse } from "next/server";

/**
 * GitHub-backed guestbook. Entries are stored as comments on a single GitHub
 * issue so there's no database to run.
 *
 * Required env:
 *   GITHUB_TOKEN          – PAT with `repo` (or public_repo) scope
 *   GUESTBOOK_REPO        – "owner/repo" that holds the issue
 *   GUESTBOOK_ISSUE_NUMBER – the issue number entries are posted to
 */
const TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.GUESTBOOK_REPO;
const ISSUE = process.env.GUESTBOOK_ISSUE_NUMBER;
const API = "https://api.github.com";

const MARKER = /<!--\s*gb:([\s\S]*?)\s*-->/;

type Entry = { id: number; name: string; message: string; date: string };

function ghHeaders(withAuth = false): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(withAuth && TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
  };
}

function parseEntry(id: number, body: string, date: string): Entry {
  let name = "anonymous";
  let message = body ?? "";
  const m = body?.match(MARKER);
  if (m) {
    try {
      const meta = JSON.parse(m[1]);
      if (meta?.name) name = String(meta.name);
    } catch {
      /* ignore malformed marker */
    }
    message = body.replace(m[0], "").trim();
  }
  return { id, name, message, date };
}

export async function GET() {
  if (!REPO || !ISSUE) {
    return NextResponse.json({ entries: [], configured: false });
  }

  const res = await fetch(
    `${API}/repos/${REPO}/issues/${ISSUE}/comments?per_page=100`,
    { headers: ghHeaders(true), next: { revalidate: 30 } },
  );

  if (!res.ok) {
    return NextResponse.json({ entries: [], configured: true });
  }

  const data = (await res.json()) as Array<{
    id: number;
    body: string;
    created_at: string;
  }>;

  const entries = data
    .map((c) => parseEntry(c.id, c.body, c.created_at))
    .filter((e) => e.message.length > 0)
    .reverse();

  return NextResponse.json({ entries, configured: true });
}

export async function POST(request: Request) {
  if (!TOKEN || !REPO || !ISSUE) {
    return NextResponse.json(
      { error: "guestbook is not configured yet" },
      { status: 503 },
    );
  }

  let payload: { name?: string; message?: string; website?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields; humans never see it.
  if (payload.website) return NextResponse.json({ ok: true });

  const name = String(payload.name ?? "")
    .trim()
    .slice(0, 40);
  const message = String(payload.message ?? "")
    .trim()
    .slice(0, 280);

  if (!name || message.length < 2) {
    return NextResponse.json(
      { error: "add your name and a short message" },
      { status: 400 },
    );
  }

  const body = `${message}\n\n<!-- gb:${JSON.stringify({ name })} -->`;

  const res = await fetch(`${API}/repos/${REPO}/issues/${ISSUE}/comments`, {
    method: "POST",
    headers: { ...ghHeaders(true), "Content-Type": "application/json" },
    body: JSON.stringify({ body }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "couldn't save, try again" },
      {
        status: 502,
      },
    );
  }

  const created = (await res.json()) as { id: number; created_at: string };
  return NextResponse.json({
    entry: { id: created.id, name, message, date: created.created_at },
  });
}
