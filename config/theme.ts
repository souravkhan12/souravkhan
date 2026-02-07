// Theme colors and design tokens - all colors reference CSS variables from globals.css
export const THEME = {
  colors: {
    primary: "var(--primary)",
    secondary: "var(--secondary)",
    background: {
      light: "var(--background)",
      dark: "var(--background)",
    },
    text: {
      light: "var(--foreground)",
      dark: "var(--foreground)",
    },
    border: {
      light: "var(--border)",
      dark: "var(--border)",
    },
    muted: {
      light: "var(--muted-foreground)",
      dark: "var(--muted-foreground)",
    },
  },
  shadows: {
    navbar: "var(--shadow-navbar)",
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  },
  radius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "1rem",
    xl: "1.5rem",
    full: "9999px",
  },
  transitions: {
    fast: "150ms",
    base: "300ms",
    slow: "500ms",
  },
};

// Animation configuration
export const ANIMATIONS = {
  spring: { type: "spring", stiffness: 300, damping: 20 },
  springStrong: { type: "spring", stiffness: 250, damping: 20 },
  springWeak: { type: "spring", stiffness: 200, damping: 10 },
};

// Common animation variants
export const MOTION_VARIANTS = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
  },
  blurSlideUp: {
    hidden: { opacity: 0, y: 10, filter: "blur(10px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  slideInScale: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
  blurFadeOut: {
    hidden: { filter: "blur(10px)" },
    visible: { filter: "blur(0px)" },
  },
  containerStagger: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  },
  staggerItem: {
    hidden: { opacity: 0, y: 4 },
    visible: { opacity: 1, y: 0 },
  },
};
