import Link from "next/link";
import { Section, RowList } from "@/components/ui";
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
      <Section
        title="404"
        subtitle="that page doesn't exist — it may have moved, or never did."
        className="pt-8"
      >
        <div className="border-border border-x border-b px-6 py-8 sm:px-8">
          <p className="text-soft max-w-lg text-sm text-pretty">
            Nothing lives at that address. If you followed a link from
            somewhere, I&apos;d genuinely like to know —{" "}
            <Link
              href="/#contact"
              className="text-blue transition-opacity hover:opacity-80"
            >
              tell me where it was
            </Link>
            . Otherwise, try one of these.
          </p>
        </div>

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
      </Section>
    </SiteShell>
  );
}
