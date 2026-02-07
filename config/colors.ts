// ========================================
// CENTRALIZED COLOR CONFIGURATION
// All colors used across the portfolio
// ========================================

// Tech Stack Brand Colors
// These are brand-specific colors that should remain consistent
export const TECH_COLORS = {
  react: "#61DAFB",
  typescript: "#3178C6",
  redux: "#764ABC",
  next: "#000000",
  cpp: "#00599C",
  mongodb: "#13AA52",
  sql: "#00758F",
  node: "#339933",
  html: "#E34C26",
  css: "#1572B6",
  tailwind: "#06B6D4",
  thirdweb: "#E500FF",
  github: "#2088FF",
  aws: "#FF9900",
} as const;

// Portfolio Design System Colors
// These reference CSS variables in globals.css
export const COLORS = {
  // Primary
  primary: "var(--color-primary)",
  primaryDark: "var(--color-primary-dark)",
  primaryLight: "var(--color-primary-light)",

  // Secondary
  secondary: "var(--color-secondary)",
  accent: "var(--color-accent)",

  // Background
  bgPrimary: "var(--color-bg-primary)",
  bgSecondary: "var(--color-bg-secondary)",
  bgCard: "var(--color-bg-card)",
  bgDark: "var(--color-bg-dark)",
  bgDarkCard: "var(--color-bg-dark-card)",

  // Text
  textPrimary: "var(--color-text-primary)",
  textSecondary: "var(--color-text-secondary)",
  textMuted: "var(--color-text-muted)",
  textLight: "var(--color-text-light)",

  // Border
  border: "var(--color-border)",
  borderLight: "var(--color-border-light)",
  borderDark: "var(--color-border-dark)",

  // Status
  success: "var(--color-success)",
  successLight: "var(--color-success-light)",
  successDark: "var(--color-success-dark)",
  successBg: "var(--color-success-bg)",

  // Shadow
  shadow: "var(--color-shadow)",
} as const;

// Tailwind Classes using CSS variables
export const THEME = {
  text: {
    primary: "text-[var(--color-text-primary)]",
    secondary: "text-[var(--color-text-secondary)]",
    muted: "text-[var(--color-text-muted)]",
    light: "text-[var(--color-text-light)]",
  },
  bg: {
    primary: "bg-[var(--color-bg-primary)]",
    secondary: "bg-[var(--color-bg-secondary)]",
    card: "bg-[var(--color-bg-card)]",
    dark: "bg-[var(--color-bg-dark)]",
    darkCard: "bg-[var(--color-bg-dark-card)]",
  },
  border: {
    default: "border-[var(--color-border)]",
    light: "border-[var(--color-border-light)]",
    dark: "border-[var(--color-border-dark)]",
  },
} as const;

// For inline styles
export const getCSSVariable = (name: string) => `var(${name})`;
