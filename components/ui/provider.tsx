"use client";
import { ReactLenis } from "@studio-freight/react-lenis";
import { ThemeProvider } from "../theme/theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </ReactLenis>
  );
}
