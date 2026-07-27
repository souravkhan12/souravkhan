import { SiteShell } from "@/components/ui/site-shell";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteShell>{children}</SiteShell>;
}
