import GithubSlugger from "github-slugger";

export type Heading = {
  id: string;
  text: string;
  depth: 2 | 3;
};

export function extractHeadings(content: string): Heading[] {
  const slugger = new GithubSlugger();
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(content)) !== null) {
    const depth = match[1].length as 2 | 3;
    const text = match[2].trim().replace(/[*_`]/g, "");
    headings.push({ id: slugger.slug(text), text, depth });
  }

  return headings;
}
