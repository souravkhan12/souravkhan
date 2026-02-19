// ======================================================
// DESIGN MOTION SYSTEM — PROFESSIONAL / MINIMAL
// ======================================================

// Core timing tokens (single source of truth)
export const MOTION = {
  duration: {
    instant: 0.12,
    fast: 0.18,
    normal: 0.24,
    slow: 0.32,
  },

  // Hybrid Material + iOS easing (industry standard)
  ease: [0.4, 0.0, 0.2, 1] as const,
};

// ======================================================
// ENTRY ANIMATIONS (page load / section load)
// Very subtle — user should not notice animation
// ======================================================
export const MOTION_VARIANTS = {
  // Pure fade
  fade: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: MOTION.duration.normal, ease: MOTION.ease },
    },
  },

  // Main section appearance
  rise: {
    hidden: { opacity: 0, y: 6 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: MOTION.duration.slow, ease: MOTION.ease },
    },
  },

  // Small components (text, icons, badges)
  microRise: {
    hidden: { opacity: 0, y: 3 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: MOTION.duration.normal, ease: MOTION.ease },
    },
  },

  // Lists / grids
  listItem: {
    hidden: { opacity: 0, y: 4 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: MOTION.duration.normal, ease: MOTION.ease },
    },
  },

  // Container stagger for lists/grids
  containerStagger: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.035,
        delayChildren: 0.05,
      },
    },
  },

  // Individual stagger items
  staggerItem: {
    hidden: { opacity: 0, y: 4 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: MOTION.duration.normal, ease: MOTION.ease },
    },
  },
};

// ======================================================
// INTERACTION MOTION (MOST IMPORTANT FOR POLISH)
// ======================================================
export const INTERACTIONS = {
  button: {
    whileHover: {
      y: -1,
      scale: 1.01,
      transition: { duration: MOTION.duration.fast, ease: MOTION.ease },
    },
    whileTap: {
      scale: 0.98,
      transition: { duration: MOTION.duration.instant },
    },
  },

  card: {
    whileHover: {
      y: -2,
      scale: 1.01,
      transition: { duration: MOTION.duration.fast, ease: MOTION.ease },
    },
    whileTap: {
      scale: 0.99,
      transition: { duration: MOTION.duration.instant },
    },
  },

  icon: {
    whileHover: {
      scale: 1.08,
      transition: { duration: MOTION.duration.fast, ease: MOTION.ease },
    },
    whileTap: {
      scale: 0.92,
      transition: { duration: MOTION.duration.instant },
    },
  },

  // Theme toggle interaction
  themeToggle: {
    whileHover: {
      rotate: 20,
      scale: 1.15,
      transition: { duration: MOTION.duration.fast, ease: MOTION.ease },
    },
    whileTap: {
      scale: 0.92,
      transition: { duration: MOTION.duration.instant },
    },
  },

  // Mobile menu toggle
  menuToggle: {
    whileTap: {
      scale: 0.9,
      transition: { duration: MOTION.duration.instant },
    },
  },
};

// ======================================================
// NAVBAR SCROLL BEHAVIOR
// Smooth but not noticeable
// ======================================================
export const NAVBAR_ANIMATION = {
  initial: { y: -8, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: MOTION.duration.slow, ease: MOTION.ease },
  },
};

// ======================================================
// MODAL / DIALOG
// Fast & functional — not cinematic
// ======================================================
export const MODAL_ANIMATION = {
  backdrop: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: MOTION.duration.fast },
    },
  },

  content: {
    hidden: { opacity: 0, scale: 0.98, y: 8 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: MOTION.duration.normal, ease: MOTION.ease },
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      y: 8,
      transition: { duration: MOTION.duration.fast },
    },
  },
};

// ======================================================
// MOBILE MENU ANIMATION
// ======================================================
export const MOBILE_MENU_ANIMATION = {
  initial: { opacity: 0, y: -10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION.duration.normal, ease: MOTION.ease },
  },
};

// Legacy exports for backward compatibility
export const ANIMATIONS = {
  spring: { type: "spring", stiffness: 300, damping: 20 },
  springStrong: { type: "spring", stiffness: 250, damping: 20 },
  springWeak: { type: "spring", stiffness: 200, damping: 10 },
};
