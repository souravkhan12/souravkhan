import Link from "next/link";
import { PageHeader, RowList } from "@/components/ui";
import { SiteShell } from "@/components/ui/site-shell";

export const metadata = {
  title: "Page not found",
  // A 404 that gets indexed is worse than one that doesn't.
  robots: { index: false, follow: true },
};

/**
 * The 404.
 *
 * There wasn't one, so every stale link, typo and moved URL landed on Next's
 * unstyled default: no nav, no theme, no way back — a guaranteed bounce. This
 * one keeps the site's chrome and, more usefully, offers somewhere to go.
 */
export default function NotFound() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="404"
        title="That page doesn't exist."
        muted="It may have moved, or never did."
        description={
          <>
            If you followed a link from somewhere, I&apos;d genuinely like to
            know —{" "}
            <Link
              href="/#contact"
              className="text-foreground underline underline-offset-4"
            >
              tell me where it was
            </Link>
            . Otherwise, try one of these.
          </>
        }
      />

      <RowList
        rows={[
          {
            href: "/",
            title: "Home",
            meta: "work, projects and the rest",
          },
          {
            href: "/blog",
            title: "Blog",
            meta: "writing on frontend and systems",
          },
          {
            href: "/arcade/quiz",
            title: "Guess the Output",
            meta: "a javascript puzzle, new every day",
            hint: "One snippet a day that doesn't do what it looks like it does.",
          },
          {
            href: "/projects",
            title: "Projects",
            meta: "things i've shipped",
          },
          {
            href: "/reading",
            title: "Reading",
            meta: "posts and talks worth your time",
          },
        ]}
      />
    </SiteShell>
  );
}
