/**
 * Vendors the machine-coding solutions out of the Machine_Coding repo and into
 * content/machine-coding/code/<slug>/.
 *
 *   bun run sync:machine-coding
 *
 * The pages read those local files, never the network. Fetching at build time
 * would mean a GitHub outage or an unauthenticated rate limit fails a deploy,
 * and the vendored copy has the nicer property of showing up in a diff when the
 * source changes.
 *
 * Re-run it after pushing new solutions. Files that disappear upstream are
 * removed here too, so the two stay in step.
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const MC_DIR = path.join(process.cwd(), "content/machine-coding");
const CODE_DIR = path.join(MC_DIR, "code");

const OWNER = "souravkhan12";
const REPO = "Machine_Coding";
const BRANCH = "main";

/** Source files worth showing. Lockfiles and images are not. */
const CODE_EXT = new Set([".js", ".jsx", ".ts", ".tsx", ".css"]);

type TreeEntry = { path: string; type: string; size?: number };

async function main() {
  const questions = readQuestions();
  if (questions.length === 0) {
    console.error("No .mdx files in content/machine-coding — nothing to sync.");
    process.exit(1);
  }

  const tree = await fetchTree();

  fs.mkdirSync(CODE_DIR, { recursive: true });

  let written = 0;
  const empty: string[] = [];

  for (const { slug, repoPath } of questions) {
    // Match the directory, not a name prefix: "src/folders/switch" must not
    // also pull in a sibling called "src/folders/switch-v2".
    const prefix = repoPath.replace(/\/$/, "") + "/";
    const files = tree.filter(
      (e) =>
        e.type === "blob" &&
        e.path.startsWith(prefix) &&
        CODE_EXT.has(path.extname(e.path)),
    );

    if (files.length === 0) {
      empty.push(`${slug} → ${repoPath}`);
      continue;
    }

    const target = path.join(CODE_DIR, slug);
    // Wipe first so a file deleted upstream doesn't linger locally.
    fs.rmSync(target, { recursive: true, force: true });
    fs.mkdirSync(target, { recursive: true });

    for (const file of files) {
      const relative = file.path.slice(prefix.length);
      const source = await fetchRaw(file.path);

      const dest = path.join(target, relative);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, source);
      written += 1;
      console.log(`  ${slug}/${relative}  (${source.length} bytes)`);
    }
  }

  // Drop vendored directories whose .mdx has since been deleted or renamed.
  const slugs = new Set(questions.map((q) => q.slug));
  for (const dir of fs.readdirSync(CODE_DIR)) {
    if (!slugs.has(dir)) {
      fs.rmSync(path.join(CODE_DIR, dir), { recursive: true, force: true });
      console.log(`  removed orphaned ${dir}/`);
    }
  }

  console.log(
    `\nSynced ${written} file(s) for ${questions.length} question(s).`,
  );

  reportUnmapped(tree, questions);

  if (empty.length > 0) {
    // A wrong repoPath is a silent content bug — the page just renders no code.
    console.error(
      `\nNo source files matched these repoPath values:\n${empty
        .map((e) => `  - ${e}`)
        .join("\n")}`,
    );
    process.exit(1);
  }
}

/** Where solutions live in the source repo. */
const SOLUTIONS_ROOT = "src/folders";

/**
 * Names in SOLUTIONS_ROOT that aren't questions — loose scratch files and the
 * like. Extend this rather than making the discovery logic cleverer.
 */
const IGNORED = new Set(["a.js"]);

/**
 * Prints any solution directory in the repo that no .mdx points at.
 *
 * This is the part that makes a re-run useful after new solutions are pushed:
 * the sync alone would copy nothing for them, because it only walks folders
 * that content already references. Reported rather than auto-scaffolded — a new
 * question needs a category, a difficulty and a write-up, and guessing those
 * produces content that reads like filler.
 */
function reportUnmapped(
  tree: TreeEntry[],
  questions: Array<{ slug: string; repoPath: string }>,
) {
  const claimed = new Set(
    questions.map((q) => q.repoPath.replace(/\/$/, "").toLowerCase()),
  );

  const dirs = new Set<string>();
  for (const entry of tree) {
    if (!entry.path.startsWith(`${SOLUTIONS_ROOT}/`)) continue;
    const rest = entry.path.slice(SOLUTIONS_ROOT.length + 1);
    const top = rest.split("/")[0];
    if (!top || IGNORED.has(top)) continue;
    // Only directories are questions; a bare file at the root isn't one.
    if (rest.includes("/") || entry.type === "tree") dirs.add(top);
  }

  const unmapped = [...dirs]
    .filter((d) => !claimed.has(`${SOLUTIONS_ROOT}/${d}`.toLowerCase()))
    .sort();

  if (unmapped.length === 0) {
    console.log(
      "No unmapped solution folders — content is in step with the repo.",
    );
    return;
  }

  console.log(
    `\n${unmapped.length} solution folder(s) in the repo have no .mdx yet:`,
  );
  for (const dir of unmapped) {
    console.log(`  - ${SOLUTIONS_ROOT}/${dir}`);
  }
  console.log(
    `\nAdd content/machine-coding/<slug>.mdx with repoPath: "${SOLUTIONS_ROOT}/<dir>", then re-run.`,
  );
}

function readQuestions(): Array<{ slug: string; repoPath: string }> {
  if (!fs.existsSync(MC_DIR)) return [];

  return fs
    .readdirSync(MC_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(MC_DIR, filename), "utf-8");
      const { data } = matter(raw);
      return {
        slug: filename.replace(/\.mdx$/, ""),
        repoPath: String(data.repoPath ?? ""),
      };
    })
    .filter((q) => q.repoPath !== "");
}

async function fetchTree(): Promise<TreeEntry[]> {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${BRANCH}?recursive=1`;
  const res = await fetch(url, { headers: ghHeaders() });

  if (!res.ok) {
    throw new Error(
      `GitHub tree fetch failed: ${res.status} ${res.statusText}. ` +
        `Set GITHUB_TOKEN if you're hitting the unauthenticated rate limit.`,
    );
  }

  const body = (await res.json()) as { tree: TreeEntry[]; truncated: boolean };
  if (body.truncated) {
    throw new Error(
      "GitHub truncated the tree response — the repo outgrew a single call.",
    );
  }
  return body.tree;
}

async function fetchRaw(filePath: string): Promise<string> {
  const url = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${filePath}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download ${filePath}: ${res.status}`);
  }
  return res.text();
}

function ghHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
