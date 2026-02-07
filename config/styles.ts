// Tailwind utility classes for common patterns
export const LAYOUT = {
  // Container classes
  container:
    "mx-auto max-w-[600px] flex-1 px-4 sm:px-6 md:max-w-[800px] lg:max-w-[1200px] overflow-x-auto",

  // Section classes
  section: "relative py-16  lg:mt-20 transition-colors duration-300",
  sectionHead: "mb-8 sm:mb-12 text-xl text-muted-foreground",

  // Grid patterns
  patternDivider:
    "relative border-x border-x-(--pattern-fg) bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed",

  // Cards
  card: "rounded-xl border border-border bg-card/80 backdrop-blur-md",
  cardPadding: "p-6",

  // Text
  heading: "text-2xl font-semibold tracking-tight text-foreground",
  subheading: " leading-relaxed font-medium text-muted-foreground",
  body: "font-normal text-muted-foreground",

  // Buttons
  buttonBase:
    "inline-flex items-center rounded-lg transition-all focus:outline-none",
  buttonPrimary:
    "bg-primary px-3 py-2 text-primary-foreground shadow-md focus:ring-2 focus:ring-primary focus:ring-offset-2",
  buttonSecondary:
    "border border-border bg-background px-3 py-2 text-foreground shadow-sm hover:bg-muted focus:ring-2 focus:ring-border focus:ring-offset-2",

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
