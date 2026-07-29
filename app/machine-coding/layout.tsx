import { SiteShell } from "@/components/ui/site-shell";

export default function MachineCodingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteShell>{children}</SiteShell>;
}
