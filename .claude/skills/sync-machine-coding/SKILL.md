---
name: sync-machine-coding
description: Refetch the machine-coding solutions from the Machine_Coding GitHub repo into the portfolio, and add pages for any new questions found there. Use when the user says to sync/refetch/update machine coding, has pushed new solutions to the Machine_Coding repo, or asks why a new question isn't showing on /machine-coding.
---

# Sync machine coding questions

Pulls solution source out of `souravkhan12/Machine_Coding` into this site and
adds pages for anything new.

## How the feature is wired

- `content/machine-coding/<slug>.mdx` — one file per question. Frontmatter is
  the metadata; the body is the write-up. This is the source of truth: a
  question exists on the site because this file exists, not because the repo
  folder does.
- `content/machine-coding/code/<slug>/` — vendored solution source, written by
  the sync script. **Never hand-edit these**; the next sync overwrites them.
- `lib/machine-coding.ts` — reads both. Categories are derived from the
  frontmatter, so a new `category` value creates a new section and its route
  with no other change.
- `scripts/sync-machine-coding.ts` — the sync itself.

Pages read the vendored files, never the network, so builds don't depend on
GitHub being reachable.

## Steps

### 1. Sync

```bash
bun run sync:machine-coding
```

This re-downloads the source for every question that already has an `.mdx`,
deletes vendored files that vanished upstream, and finishes by listing any
solution folder in the repo that **no `.mdx` points at yet**.

If it exits non-zero, read the error before doing anything else:

- _"No source files matched these repoPath values"_ — an `.mdx` has a
  `repoPath` that no longer exists. The folder was renamed or deleted upstream;
  fix the `repoPath` or delete the `.mdx`.
- _"GitHub tree fetch failed: 403"_ — unauthenticated rate limit. Re-run with
  `GITHUB_TOKEN` set.

### 2. Add pages for the new folders

For each folder the script reported as unmapped, read its actual source first:

```bash
curl -sS "https://api.github.com/repos/souravkhan12/Machine_Coding/git/trees/main?recursive=1" \
  | python3 -c "import json,sys; [print(e['path']) for e in json.load(sys.stdin)['tree'] if e['type']=='blob']"

curl -sS "https://raw.githubusercontent.com/souravkhan12/Machine_Coding/main/<path>"
```

Then create `content/machine-coding/<slug>.mdx`. Pick a `slug` that reads like
a question name, not the folder name, when they differ — `toggle-switch`, not
`switch`.

```markdown
---
title: "Star rating"
question: "Build a star rating widget with hover preview and a locked-in selection."
category: "react-ui"
categoryLabel: "React UI Components"
difficulty: "easy"
tags: ["state", "events"]
repoPath: "src/folders/star"
order: 1
---

## What it tests

## The approach

## Where it usually goes wrong
```

Frontmatter rules — all validated by zod at build time, so a mistake fails the
build rather than rendering wrong:

- `category` must be lowercase/dashes. Reuse an existing value unless the
  question genuinely doesn't fit one; a category of one item looks like a bug.
  Current values: check `content/machine-coding/*.mdx`.
- `categoryLabel` must match what other files in that category already use.
- `difficulty` is exactly `easy`, `medium` or `hard`.
- `repoPath` is the directory, no trailing slash.
- `order` sorts within a category. Leave gaps (10, 20) so inserting is cheap.
- A slug of `category` is rejected — it would shadow the category route.

### 3. Write the body from the real code

Base the write-up on the source you read in step 2, not on general knowledge of
the pattern. Describe what the implementation actually does — if it uses
`IntersectionObserver`, say so; if it uses a scroll handler, say that instead.
Quote only the few lines that carry the idea; the full source is rendered
automatically below the write-up, so repeating it is wasted space.

Do not invent first-person claims about how the author thought about the
problem. Describe the code and the trade-offs; leave personal commentary to
them.

### 4. Re-run and verify

```bash
bun run sync:machine-coding   # should now report no unmapped folders
bun run typecheck
bun run build
```

Then confirm the new page renders, including its Full solution section:

```bash
bun run dev
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/machine-coding/<slug>
```

Do not run `bun run build` while `bun run dev` is running — they fight over
`.next` and the dev server starts serving 404s for valid routes.

### 5. Report

Tell the user which questions were added, which files were re-synced, and
anything that needs their input — a category call that was ambiguous, or a
write-up section where only they can supply the reasoning.
