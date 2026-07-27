import { SiteShell } from "@/components/ui/site-shell";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteShell>{children}</SiteShell>;
}
