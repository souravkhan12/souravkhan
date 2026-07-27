import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GitHub-backed Snake high score. Scores are stored as comments on a single
 * GitHub issue — no database, no names. Only the single best score across all
 * players is surfaced: the number to beat.
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

const PER_PAGE = 100;
// Caps a cold read at 30 GitHub calls (~3000 games). Past that, move the board
// to a real KV store rather than raising this.
const MAX_PAGES = 30;

export async function GET() {
  if (!REPO || !ISSUE) {
    return NextResponse.json({ best: 0, plays: 0, configured: false });
  }

  let best = 0;
  let plays = 0;

  // Walk every page — a single per_page=100 fetch silently under-reports both
  // `best` and `plays` the moment the board passes 100 recorded games.
  for (let page = 1; page <= MAX_PAGES; page++) {
    const res = await fetch(
      `${API}/repos/${REPO}/issues/${ISSUE}/comments?per_page=${PER_PAGE}&page=${page}`,
      { headers: ghHeaders(), next: { revalidate: 60 } },
    );
    if (!res.ok) {
      // Partial data still beats none, so return what we managed to read.
      return NextResponse.json({ best, plays, configured: true });
    }

    const data = (await res.json()) as Array<{ body: string }>;

    for (const c of data) {
      const m = c.body?.match(MARKER);
      if (!m) continue;
      try {
        // Older entries also carried a name — we only read the score now.
        const parsed = JSON.parse(m[1]) as { score?: number };
        const score = Math.floor(Number(parsed.score));
        if (!Number.isFinite(score) || score <= 0) continue;
        plays += 1;
        if (score > best) best = score;
      } catch {
        /* ignore malformed */
      }
    }

    // A short page is the last page.
    if (data.length < PER_PAGE) break;
  }

  return NextResponse.json({ best, plays, configured: true });
}

export async function POST(request: Request) {
  if (!TOKEN || !REPO || !ISSUE) {
    return NextResponse.json(
      { error: "high score board is not configured yet" },
      { status: 503 },
    );
  }

  let payload: { score?: number; website?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  if (payload.website) return NextResponse.json({ ok: true }); // honeypot

  const score = Math.floor(Number(payload.score));
  if (!Number.isFinite(score) || score <= 0 || score > MAX_SCORE) {
    return NextResponse.json({ error: "invalid score" }, { status: 400 });
  }

  const body = `🐍 ${score}\n\n<!-- score:${JSON.stringify({ score })} -->`;

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

  return NextResponse.json({ ok: true, score });
}

function ghHeaders(withAuth = true): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(withAuth && TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
  };
}
