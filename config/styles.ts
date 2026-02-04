// Tailwind utility classes for common patterns
export const LAYOUT = {
  // Container classes
  container:
    "mx-auto max-w-[600px] flex-1 px-4 sm:px-6 md:max-w-[800px] lg:max-w-[1200px] overflow-x-auto",

  // Section classes
  section: "relative py-12 sm:py-16 transition-colors duration-300",
  sectionHead: "mb-8 sm:mb-12 text-xl text-gray-500 dark:text-gray-100",

  // Grid patterns
  patternDivider:
    "relative border-x border-x-(--pattern-fg) bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed",

  // Cards
  card: "rounded-xl border bg-white/80 backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-800/70",
  cardPadding: "p-6",

  // Text
  heading:
    "text-2xl font-semibold tracking-tight text-gray-800 dark:text-gray-100",
  subheading: " leading-relaxed font-medium text-gray-600 dark:text-gray-400",
  body: "font-normal text-gray-600 dark:text-gray-300",

  // Buttons
  buttonBase:
    "inline-flex items-center rounded-lg transition-all focus:outline-none",
  buttonPrimary:
    "bg-gray-900 px-3 py-2 text-white shadow-md focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 dark:bg-gray-500 dark:text-black",
  buttonSecondary:
    "border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 dark:border-gray-600 dark:bg-[#1E1E1E] dark:text-gray-100 dark:hover:bg-[#2a2a2a]",

  // Flex patterns
  flexCenter: "flex items-center justify-center",
  flexBetween: "flex items-center justify-between",
  flexCol: "flex flex-col",
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
