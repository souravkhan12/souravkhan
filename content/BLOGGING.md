# Blogging playbook

How to write posts for this site, and how to keep them healthy afterwards.

---

## 1. Picking topics

**Write what's searched, not what's interesting.** Those overlap less than you'd think.

The winning shape for a blog with no audience yet is the **specific long-tail problem post**:

| Don't                                | Do                                                                     |
| ------------------------------------ | ---------------------------------------------------------------------- |
| "Thoughts on React state management" | "Why my Zustand store resets on route change in Next.js App Router"    |
| "A guide to TypeScript generics"     | "Typing a generic `useFetch` hook so the response narrows on `status`" |
| "Web performance tips"               | "Cutting 400ms of LCP by removing a single `@import` from globals.css" |

The specific one has near-zero competition and reaches a reader with acute intent — someone with the error message in their clipboard. That reader converts to a subscriber, a link, or a job lead. The generic one competes with the official docs and loses.

**Where topics come from, in priority order:**

1. **Google Search Console → Performance → Queries.** Queries where you already get impressions but few clicks are posts waiting to be written. This is the single best source and it only works once you have traffic — check it monthly.
2. **Your own last two weeks.** Anything that took you more than an hour to figure out is a post. The fact that it was hard for you is the evidence that it's under-documented.
3. **Google autocomplete and "People also ask"** for your stack. Free keyword research.
4. **Issue trackers.** A GitHub issue with 50 👍 and no clear answer is a post with a built-in audience.

---

## 2. Post structure

This is the shape that both ranks and gets read:

1. **The problem, in the first two sentences.** No preamble, no "in today's fast-paced world". State what broke and what you expected.
2. **The answer immediately** — a TL;DR code block near the top. Readers who bounce at five seconds still got value, and they still link to you. Burying the fix costs you the link.
3. **Then the mechanism.** _Why_ it happens. This is the part nobody else writes and the part that earns HN comments and inbound links.
4. **What you tried first.** The failed attempts are the most valuable and most-skipped section. They match what other people are searching for as they debug.
5. **A takeaway.** One concrete sentence the reader can act on, plus a link to a related post.

### Craft rules

- **1,200–2,500 words** for depth posts. Shorter is fine for a focused fix.
- **One idea per post.** Two ideas means two posts and twice the search surface.
- **H2s that read like search queries.** They become deep links via `rehype-autolink-headings`, so `## Why the store resets on navigation` beats `## Background`.
- **Every post needs one visual** — a diagram, a screenshot, or a live `<Demo>`.
- **All code must run.** Copy-pasteable, with imports. The `CodeBlock` copy button is already wired up.
- **Write `description` as the search snippet.** 150–160 characters — it's literally what Google displays.

### Components available in MDX

No imports needed; they're registered in `components/blog/mdx-components.tsx`.

```mdx
<Callout type="warn" title="Gotcha">
  `type` is one of: note, tip, warn, success.
</Callout>

<Aside>
  A margin note — tangential detail that shouldn't break the main thread.
</Aside>

<Demo title="Debounced input">
  <MyLiveExample />
</Demo>
```

`<Demo>` is the differentiator. A post with a working, resettable example is the one people bookmark and share.

---

## 3. Frontmatter

Validated by Zod in `lib/blog.ts` — a malformed field **fails the build**, so a typo can never silently corrupt the sitemap or the RSS feed.

```yaml
---
title: "Why my Zustand store resets on route change" # required
description: "150-160 chars. This is the Google snippet." # required
date: "2026-07-27" # required, YYYY-MM-DD
updated: "2026-09-02" # optional — shows "Updated …" and feeds dateModified
tags: ["nextjs", "zustand"] # optional, drives /blog/tags/[tag]
published: true # optional, defaults true
image: "/blog/zustand.png" # optional — OG images are generated, so this is just the hero
series: "App Router in anger" # optional
seriesOrder: 2 # optional, orders the series nav
---
```

---

## 4. Workflow

```bash
bun run new:post "Why my Zustand store resets on route change"
```

Scaffolds `content/blog/<slug>.mdx` with `published: false` and today's date.

Drafts render at `localhost:3000/blog/<slug>` during `bun run dev` but are excluded from the live site, the sitemap and the feed. Flip `published: true` to ship.

**On publish day:**

1. Merge to `main` → Vercel deploys.
2. Check the generated social card at `/blog/<slug>/opengraph-image`, then run the live URL through [opengraph.xyz](https://www.opengraph.xyz).
3. Cross-post the same body to **dev.to** and **Hashnode**, setting `canonical_url` to your own URL on both. You borrow their audience; Google still credits your site.
4. Share to X, LinkedIn, and one relevant subreddit (r/webdev, r/nextjs). Lead with the problem, not "I wrote a blog post".
5. In Search Console, use **URL Inspection → Request Indexing** to skip the discovery wait.

---

## 5. Cadence

**One good post every two weeks, forever, beats six in a month and then silence.** Google rewards consistency and so does an RSS audience. Put it in the calendar.

A realistic first 12 posts:

- **6 long-tail problem posts** — the SEO engine.
- **3 build-in-public posts** about this site. The GitHub-issues-as-a-database Snake leaderboard is a genuinely novel one.
- **2 opinion pieces** — these travel on HN and X but rarely rank. Reach, not search.
- **1 deep case study** — what actually converts recruiters.

---

## 6. Maintenance

| Cadence             | Task                                                                            |
| ------------------- | ------------------------------------------------------------------------------- |
| Every post          | Verify the OG card renders; cross-post with canonicals                          |
| Monthly             | Search Console: check Coverage for indexing errors, mine Queries for new topics |
| Monthly (automated) | `.github/workflows/links.yml` runs `lychee` and opens an issue on dead links    |
| Quarterly           | Refresh the top 5 posts by impressions                                          |
| Per release         | Keep `BLOG_INTEGRATION.md` in sync if the pipeline changes                      |

**The quarterly refresh is the highest-ROI hour you'll spend.** For your top 5 posts by Search Console impressions: update the code for current library versions, bump `updated`, and add links to newer posts. Updating a post that already ranks reliably beats writing a new one that doesn't.

---

## 7. Measuring

- **Vercel Analytics** — which posts get read, and where readers come from.
- **Search Console** — what people _searched_ to find you. This is what feeds section 1.
- **The metric that matters** is impressions growth in Search Console, not pageviews. Impressions rise weeks before clicks do; it's the leading indicator that the SEO work is compounding.
