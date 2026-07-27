import { SiteShell } from "@/components/ui/site-shell";

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteShell>{children}</SiteShell>;
}
