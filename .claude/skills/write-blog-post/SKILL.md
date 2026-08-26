---
name: write-blog-post
description: Write a new engineering blog post for content/blog in the house style — direct opening (no war stories), mechanism-first explanation, custom interactive MDX diagrams, "what people get wrong". Use when asked to write, draft, or plan a blog post, add a post about a topic, or extend an existing post with a new section.
---

# Writing a post for this blog

Two posts define the format: `content/blog/how-browser-rendering-works.mdx` and
`content/blog/http-1-vs-http-2-vs-http-3.mdx`. **Read one of them before you
write a line.** Everything below is the pattern extracted from them; the posts
are the ground truth.

## Who you are while writing

A staff engineer explaining a mechanism to one smart person, out loud, over
coffee. Not teaching a course. Not summarising the docs.

That gives you the constraints:

- **No war stories.** Don't open with an incident, don't write "we turned this
  on and it broke", don't invent a first-person past. State the thing directly
  and get to the mechanism. The post earns attention by being clear, not by
  dramatising a debugging session.
- **Every claim is falsifiable.** Numbers, versions, years, browser releases. If
  you don't know, look it up (see Research) or cut the sentence.
- **Name the misconceptions.** The "What people get wrong" section is not
  decoration — it's where the writing stops being a tutorial.
- **British spelling in prose** (`optimising`, `colours`, `behaviour`). Code and
  API names keep their real spelling.

## Plain words — the rule that beats all the others

The reader is smart but tired, and possibly reading in their second language.
Every sentence they have to read twice is a sentence you wrote badly.

- **Short sentences.** One idea each. If a sentence has two commas and an
  "which", it's two sentences.
- **Short paragraphs.** Two or three sentences. A wall of text gets skipped no
  matter how good it is.
- **Common words over correct-sounding words.** "sends it again" not
  "retransmits". "slow part" not "bottleneck". "at the same time" not
  "concurrently". "trip to the server" not "round trip latency". "the proxy in
  front" not "the upstream".
- **Never lead with a short form.** Don't drop RTT, HOL, TTFB or MTU on a reader
  cold. Plain words carry the sentence; the short form comes after, in brackets
  — see the next section.
- **Cut the jargon that only signals expertise.** "the wire format",
  "userspace", "the application layer", "semantics" — either explain them in
  plain words or delete them. They make the writing sound senior and read worse.
- **But keep the vocabulary every developer already has.** Client, server,
  proxy, cache, request, response, header, status code, client error, server
  error. These are first-year words, not jargon. Rewriting them into homemade
  phrases ("we got it wrong" for a server error) makes the post _harder_ to
  read, because now it doesn't match anything else the reader has seen. Simplify
  what's genuinely obscure; leave the shared vocabulary alone.

The line between the two: would a second-year student already know this word? If
yes, use it. If no, plain words plus a `<Term>`.

Two tests before you ship a section:

1. **Read it out loud.** If you run out of breath or stumble, rewrite it.
2. **Would a second-year developer follow this without pausing?** If not, it's
   not simpler than the topic requires — it's just harder to read.

## Teach the real name too

Plain words alone leave the reader stuck the moment they read anyone else's
post, where everybody writes RTT and head-of-line blocking. So do both: explain
it plainly, then hand them the word the rest of the industry uses.

Use `<Term>` (`components/blog/term.tsx`, already registered — no import in the
`.mdx`). It underlines the phrase, puts the short form in brackets after it, and
shows the definition on hover, keyboard focus or tap. Pure CSS, no client
JavaScript.

```mdx
It still runs on <Term abbr="TCP" def="Transmission Control Protocol. The layer
under HTTP that turns unreliable packets into a reliable, in-order stream.">TCP</Term>,
and TCP hands over data as one strict, in-order stream.
```

`abbr` is optional — terms with a real name but no short form (head-of-line
blocking, multiplexing, domain sharding) get the underline and definition alone.

Rules:

- **Plain phrase in the prose, real name in the tooltip** — not the reverse. The
  sentence must still read fine for someone who never hovers.
- **Once per term, at its first appearance.** After that, use the real name
  freely; you've earned it.
- **The definition is one or two plain sentences**, and where you can, give it a
  number a reader can feel: "on office wifi about 20ms; on mobile 100–200ms".
- **Roughly 5–8 per post.** Underline everything and the page looks broken and
  teaches nothing.
- **Don't wrap names that are already the thing.** HTTP, CSS, JSON, DOM. If
  spelling it out helps nobody, skip it.
- **Keep it mid-sentence.** A `<Term>` alone on its own line becomes a separate
  block in MDX and breaks the paragraph. Prettier will reformat long ones — if
  it splits the tag onto its own line, rewrite the sentence so the term sits in
  the middle.
- **The names also belong in the cheat-sheet component**, as a row: "head-of-line
  blocking → in HTTP / in TCP, underneath / gone". That's the row people
  screenshot.

## Less of it

Length is not effort. Both posts got better when they got shorter.

- If two sentences say the same thing, keep the better one.
- If a paragraph doesn't change what the reader does or understands, cut it.
- Historical detail earns its place only when the _next_ section depends on it.
  Two versions of history can usually be compressed into one section.
- Never explain the same idea twice in different words "for clarity". Say it
  once, properly.
- Aim for something a person finishes in one sitting. Most posts should land
  under ~1,200 words; a full protocol walk-through earns ~1,800. Past that,
  you're writing two posts.

**This applies to the diagram components too.** Their labels, footnotes and row
text are read more carefully than the prose — nobody skims a table. Same plain
words there: "stuck, waiting for the lost packet", not "blocked on retransmit".
"2 round trips", not "2 RTT".

## The shape

Every post follows the same skeleton. Don't invent a new one.

```
frontmatter
opening          — 2–4 sentences: the behaviour in question and why it's not
                   obvious, usually with the code that shows it
## The short answer
                 — the fix, copy-pasteable, before any theory
## Why it happens
  ### h3, h3, h3 — the mechanism, built up in order, one idea per heading
## What people get wrong
                 — 3–5 bullets, each a common belief, then the correction
## Takeaway      — ONE sentence, actionable
```

`bun run new:post "Title"` scaffolds this with valid frontmatter and
`published: false`. Use it rather than hand-writing frontmatter — the schema in
`lib/blog.ts` is validated at build time and a bad `date` fails the build.

### The opening

Two to four sentences. Name the surprising behaviour, show it in code if code
shows it faster, then one line that says what the post covers.

> Move a `<script>` from the bottom of `<body>` into `<head>` and a working
> `getElementById` call starts returning `null`. Nothing about the script
> changed — only where it sits.

Then the failing line, then the scope: "Explaining that properly means walking
the whole path from bytes to pixels — so that's what this is."

Two things to avoid. Don't open with context-setting ("HTTP is the protocol of
the web…") — the reader knows. And don't open with a story: no "we shipped
this and it broke", no invented incident, no first-person debugging session.
Lead with the behaviour itself.

### The short answer

Working code in the first screen. A reader who bounces after five seconds still
got the fix. Then a single line telling them what the rest of the post is:
"Everything below is the machinery behind those two lines."

### Why it happens

This is the body, and it is the reason the post exists — the mechanism nobody
else writes down. Rules:

- **One `###` per idea**, titled like a claim, not a label: "Why CSS needs a
  tree at all", "What HTTP/2 didn't fix", "The workarounds became an industry".
  Never "Overview" or "Background".
- **Build in dependency order.** Each section should be answerable only because
  the previous one landed. If you can reorder two sections freely, the sequence
  isn't doing any work.
- **Bold lead-ins for feature lists.** A bolded plain-English claim, a full
  stop, then prose: `**Replies can arrive in any order.** Because every packet
says which request it belongs to…`. Note the lead-in describes what happens,
  not what it's called — "Replies can arrive in any order" beats
  "Multiplexing". Name the term after, if at all.
- **Chase the "why" one level past the obvious.** Everyone says HTTP/2 sends
  requests in parallel. The post is worth reading because it explains that TCP
  underneath still delivers one strict in-order stream, which is where the win
  goes.
- **Include the plot twist.** Both posts turn near the end: the newer thing is
  not simply better (HTTP/3 loses on fast links; `display:none` vs
  `visibility:hidden`). Find the place where the tidy story breaks and put it
  there.
- **Callouts are for the trap**, not for summaries:
  `<Callout type="warn" title="Gotcha">…</Callout>`. `type` is
  `note | tip | warn | success`. Use `<Aside>` for a tangent that shouldn't
  interrupt the thread.

### What people get wrong

3–5 bullets. Each starts with the common belief in bold quotes, then the
correction, then — where possible — what believing it costs you.

> - **"HTTP/2 makes splitting across domains better."** It makes it worse.
>   Splitting exists to get more connections; HTTP/2 wants exactly one, because
>   header compression and priority only work within a single connection.

State the correction as fact. Don't dress it as a personal discovery ("we
deleted ours and got faster") — that's the war story sneaking back in. Note the
plain wording too: "splitting across domains", not "domain sharding". The
bullet has to land on someone who's never heard the term.

### Takeaway

One sentence. Something the reader can do on Monday. It answers the behaviour
the opening raised, so the post closes its own loop.

## Interactive diagrams — the thing that makes these posts

Both posts carry 3–4 custom React components. **A post without at least two is
not finished.** They live in `components/mdx/<Topic>Diagrams.tsx` and must be
registered — import _and_ object entry — in `components/blog/mdx-components.tsx`
before MDX can use them. Nothing else is needed; no import in the `.mdx`.

Build a component when a diagram teaches something prose can't:

| Reach for                                            | When                                                                         |
| ---------------------------------------------------- | ---------------------------------------------------------------------------- |
| Stepper / timeline (`ProtocolTimeline`)              | A sequence where the pattern only shows across steps                         |
| Toggle comparison (`HeadOfLineBlocking`)             | Two configurations where the _difference_ is the point — let the reader flip |
| Animated playground (`ScriptBlockingPlayground`)     | Timing and blocking, where a still image lies                                |
| Table (`ProtocolCheatSheet`, `StatusCodeCheatSheet`) | The revision aid the reader will come back for                               |

House rules for these components, all enforced by the existing files:

- `"use client"` at the top of the diagrams file.
- Wrap everything in `<Panel label="lowercase label">` from
  `components/mdx/Panel.tsx`. It supplies the border, the blue accent bar,
  `not-prose`, and `blog-breakout` (which lets wide content escape the text
  measure — see `styles/globals.css`). `Panel` also takes a `footnote` for the
  one-line "here's what to actually remember".
- Reuse `Chip`, `Tabs`, `TreeLine` from `Panel.tsx` rather than restyling.
- **Site scale only**: `text-xs`/`text-sm`, `font-code` for anything
  wire-format or label-like, `border-border`, `text-blue`/`bg-blue` as the sole
  accent, `text-gray-*` with `dark:` pairs. No arbitrary px values, no second
  accent colour, no rounded corners.
- Every component must work in light and dark.
- Animation: respect `prefers-reduced-motion`, and start on
  `IntersectionObserver` rather than on mount — `ProtocolTimeline` shows both.
- Give each component a block comment saying _why it exists_ — what the prose
  couldn't do. See the header comments in `Httpversiondiagrams.tsx`.

## Research

Do not write numbers from memory. Use WebSearch for anything datable: adoption
percentages, ship years, browser versions that removed a feature, paper
findings. When a specific figure comes from a search result, keep the grounding
markup the search returns (`<cite index="…">…</cite>`) — both posts use it for
exactly the claims that would otherwise be "trust me".

If a search doesn't confirm it, cut the claim. A post that says "HTTP/3 adoption
stalled" with a source beats one that says "much faster" with none.

## Ship checklist

1. `published: false` while drafting — `bun run dev` still renders it at
   `/blog/<slug>`, the live site doesn't.
2. `description` is the Google snippet and the OG card: 150–160 characters,
   states the tension, not the topic. ("We turned on HTTP/2 and mobile got
   slower. The reason sits one layer below HTTP, where your config can't see
   it.")
3. `tags` lowercase, reuse existing ones where they fit.
4. `bun run typecheck` and `npx prettier --write` on every file you touched.
5. `bun run lint` on touched files only — the repo carries known pre-existing
   errors; don't chase them, but don't add to them.
6. **The plain-words pass.** Read the whole post out loud. Every time you
   stumble, rewrite that sentence. Then search your draft for short forms and
   for the jargon list above: each one either becomes plain words, or gets a
   `<Term>` on its first appearance. Then cut every sentence that only restates
   the one before it. This pass is not optional — first drafts always come out
   denser than they need to be.
7. Run `bun run build` when a post adds or changes a component, and grep the
   built HTML for one of your `<Term>` sentences. It catches the case where an
   inline tag became its own block and split a paragraph in half.
8. Flip `published: true` when the user says ship.

## Never

- "In today's fast-paced world", "Let's dive in", "buckle up", "game-changer".
- Emoji, exclamation marks, rhetorical questions used as headings.
- Invented short forms, and real ones the reader has to look up.
- Long sentences held together by semicolons and "which".
- A bulleted list where prose with bold lead-ins would read better.
- Writing to sound senior. The post is impressive because the explanation is
  clear, not because the words are big.
- Summarising MDN. If the post could be replaced by the docs, it shouldn't exist.
- Incidents, war stories, and invented first-person history — including in the
  `description`. "We turned on HTTP/2 and mobile got slower" is exactly the
  opening this blog no longer uses. Describe the behaviour, not a day you had.
