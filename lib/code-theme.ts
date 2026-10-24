import type { Options } from "rehype-pretty-code";

/**
 * One syntax-highlighting setup for every MDX page (posts, patterns, machine
 * coding, setup guides).
 *
 * Two themes, switched by the `.dark` class (see "CODE BLOCKS" in
 * globals.css), so code follows the site theme instead of being a black slab
 * on a white page. `keepBackground: false` drops Shiki's own backgrounds —
 * the block takes the site's surface colour, like every other card.
 */
export const prettyCodeOptions: Options = {
  theme: { light: "github-light", dark: "github-dark-dimmed" },
  keepBackground: false,
};
