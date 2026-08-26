#!/usr/bin/env bun
/**
 * Scaffolds a new blog post with valid frontmatter.
 *
 *   bun run new:post "Fixing hydration mismatch in Next.js 16"
 *
 * Friction is what kills a blogging habit — this removes the "what were the
 * frontmatter fields again?" step.
 */
import fs from "fs";
import path from "path";

const title = process.argv.slice(2).join(" ").trim();

if (!title) {
  console.error('Usage: bun run new:post "Your Post Title"');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

const filePath = path.join(process.cwd(), "content/blog", `${slug}.mdx`);

if (fs.existsSync(filePath)) {
  console.error(`✗ content/blog/${slug}.mdx already exists`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);

// Starts as a draft: published: false hides it from the live site but
// `bun run dev` still renders it, so you can preview before shipping.
const template = `---
title: "${title.replace(/"/g, '\\"')}"
description: "One or two sentences, 150-160 characters. This is the snippet Google shows."
date: "${today}"
tags: []
published: false
---

The behaviour, in two sentences. What it does, and why that isn't obvious.

## The short answer

\`\`\`ts
// Working, copy-pasteable code. Readers who bounce in 5s still got value.
\`\`\`

## Why it happens

The mechanism. This is the part nobody else writes.

<Callout type="warn" title="Gotcha">
  The thing that will bite you next.
</Callout>

## What people get wrong

The common beliefs, and the corrections.

## Takeaway

One concrete sentence a reader can act on.
`;

fs.writeFileSync(filePath, template);

console.log(`✓ content/blog/${slug}.mdx`);
console.log(`  preview: http://localhost:3000/blog/${slug}`);
console.log(`  set published: true when it's ready to ship`);
