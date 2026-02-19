// Tailwind utility classes for common patterns
export const LAYOUT = {
  // Container classes
  container:
    "mx-auto max-w-[650px] flex-1 px-4 md:max-w-[800px] lg:max-w-[1200px] overflow-x-hidden",

  // Section classes
  section: "relative py-12 sm:py-16 transition-colors duration-300",
  sectionHead: "mb-8 sm:mb-12 text-xl text-gray-500 dark:text-gray-100",

  // Text
  heading:
    "text-2xl font-semibold tracking-tight text-gray-800 dark:text-gray-100",
  subheading: "leading-relaxed font-medium text-gray-600 dark:text-gray-400",
};

// Responsive utilities
export const RESPONSIVE = {
  mobileOnly: "md:hidden",
  desktopOnly: "hidden md:flex",
};

// Common spacing
export const SPACING = {
  xs: "gap-2",
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
  "2xl": "gap-12",
};
