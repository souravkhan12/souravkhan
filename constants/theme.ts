// Theme colors and design tokens
export const THEME = {
  colors: {
    primary: "#6366f1",
    secondary: "#ec4899",
    background: {
      light: "#ffffff",
      dark: "#1E1E1E",
    },
    text: {
      light: "#1f2937",
      dark: "#f3f4f6",
    },
    border: {
      light: "#d1d5db",
      dark: "#404040",
    },
    muted: {
      light: "#6b7280",
      dark: "#9ca3af",
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
