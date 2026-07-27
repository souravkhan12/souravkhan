import { SiteShell } from "@/components/ui/site-shell";

export default function ArcadeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteShell>{children}</SiteShell>;
}
