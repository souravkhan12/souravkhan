import { NextResponse } from "next/server";

/**
 * GitHub-backed Snake leaderboard. Scores are stored as comments on a single
 * GitHub issue — no database. Best score per name is what surfaces.
 *
 * Reuses the same repo/issue you set up (originally for the guestbook):
 *   GITHUB_TOKEN           – PAT with `repo` (or public_repo) scope
 *   GUESTBOOK_REPO         – "owner/repo" that holds the issue
 *   GUESTBOOK_ISSUE_NUMBER – the issue number scores are posted to
 */
const TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.GUESTBOOK_REPO;
const ISSUE = process.env.GUESTBOOK_ISSUE_NUMBER;
const API = "https://api.github.com";

// Board is 15×15 with a length-3 start, so 222 apples is the theoretical max.
const MAX_SCORE = 225;
const MARKER = /<!--\s*score:([\s\S]*?)\s*-->/;
const BLOCKED = /\b(fuck|shit|bitch|nigger|faggot|cunt|slut|rape)\b/i;

type Score = { name: string; score: number; date: string };

function ghHeaders(withAuth = false): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(withAuth && TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
  };
}

export async function GET() {
  if (!REPO || !ISSUE) {
    return NextResponse.json({ scores: [], configured: false });
  }

  const res = await fetch(
    `${API}/repos/${REPO}/issues/${ISSUE}/comments?per_page=100`,
    { headers: ghHeaders(true), next: { revalidate: 20 } },
  );
  if (!res.ok) return NextResponse.json({ scores: [], configured: true });

  const data = (await res.json()) as Array<{
    body: string;
    created_at: string;
  }>;

  // Keep the best score per name.
  const best = new Map<string, Score>();
  for (const c of data) {
    const m = c.body?.match(MARKER);
    if (!m) continue;
    try {
      const parsed = JSON.parse(m[1]) as { name?: string; score?: number };
      const name = String(parsed.name ?? "").slice(0, 20);
      const score = Math.floor(Number(parsed.score));
      if (!name || !Number.isFinite(score) || score <= 0) continue;
      const prev = best.get(name.toLowerCase());
      if (!prev || score > prev.score) {
        best.set(name.toLowerCase(), { name, score, date: c.created_at });
      }
    } catch {
      /* ignore malformed */
    }
  }

  const scores = [...best.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);

  return NextResponse.json({ scores, configured: true });
}

export async function POST(request: Request) {
  if (!TOKEN || !REPO || !ISSUE) {
    return NextResponse.json(
      { error: "leaderboard is not configured yet" },
      { status: 503 },
    );
  }

  let payload: { name?: string; score?: number; website?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  if (payload.website) return NextResponse.json({ ok: true }); // honeypot

  const name = String(payload.name ?? "")
    .replace(/[^\p{L}\p{N} _.'-]/gu, "")
    .trim()
    .slice(0, 20);
  const score = Math.floor(Number(payload.score));

  if (!name) {
    return NextResponse.json({ error: "add a name" }, { status: 400 });
  }
  if (BLOCKED.test(name)) {
    return NextResponse.json({ error: "pick another name" }, { status: 400 });
  }
  if (!Number.isFinite(score) || score <= 0 || score > MAX_SCORE) {
    return NextResponse.json({ error: "invalid score" }, { status: 400 });
  }

  const body = `🐍 ${name} — ${score}\n\n<!-- score:${JSON.stringify({ name, score })} -->`;

  const res = await fetch(`${API}/repos/${REPO}/issues/${ISSUE}/comments`, {
    method: "POST",
    headers: { ...ghHeaders(true), "Content-Type": "application/json" },
    body: JSON.stringify({ body }),
  });
  if (!res.ok) {
    return NextResponse.json(
      { error: "couldn't save, try again" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, entry: { name, score } });
}
