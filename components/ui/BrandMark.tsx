import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

/**
 * The site's mark: the S monogram knocked out of a rounded square — the same
 * drawing the favicon and app icons are rendered from (public/icon.svg), so the
 * tab, the home-screen icon and the navbar all show one thing.
 */
export function BrandMark({
  size = 28,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "bg-foreground text-background inline-flex shrink-0 items-center justify-center",
        className,
      )}
      style={{ width: size, height: size, borderRadius: size * 0.42 }}
    >
      <Logo size={Math.round(size * 0.62)} className="pointer-events-none" />
    </span>
  );
}
