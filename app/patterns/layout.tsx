import { SiteShell } from "@/components/ui/site-shell";

export default function PatternsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteShell>{children}</SiteShell>;
}
