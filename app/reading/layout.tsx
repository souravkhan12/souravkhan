import { SiteShell } from "@/components/ui/site-shell";

export default function ReadingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteShell>{children}</SiteShell>;
}
