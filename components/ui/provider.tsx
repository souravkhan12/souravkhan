"use client";
import { ReactLenis } from "@studio-freight/react-lenis";
import { MotionConfig } from "motion/react";
import { ThemeProvider } from "../theme/theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root>
      {/* "user": transforms and layout animations switch off for anyone with
          reduced motion set at the OS level; opacity fades still run. */}
      <MotionConfig reducedMotion="user">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </MotionConfig>
    </ReactLenis>
  );
}
