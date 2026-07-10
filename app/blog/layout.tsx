import { LAYOUT } from "@/config/styles";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/footer";
import { PatternDivider } from "@/components/ui/pattern-divider";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background flex [--pattern-fg:var(--color-gray-950)]/5 dark:[--pattern-fg:var(--color-white)]/10">
      <PatternDivider position="left" />
      <div className={`${LAYOUT.container} bg-background`}>
        <Navbar />
        {children}
        <Footer />
      </div>
      <PatternDivider position="right" />
    </div>
  );
}
