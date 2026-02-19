# Portfolio Refactoring Plan

> Full codebase audit — dead code, UI inconsistencies, and cleanup opportunities.

---

## 1. Dead Code & Unused Exports

### `config/styles.ts`

| Symbol                   | Status    | Reason                                       |
| ------------------------ | --------- | -------------------------------------------- |
| `RESPONSIVE`             | ❌ Remove | Never imported anywhere                      |
| `SPACING`                | ❌ Remove | Never imported anywhere                      |
| `LAYOUT.buttonBase`      | ❌ Remove | Button component uses CVA, not these strings |
| `LAYOUT.buttonPrimary`   | ❌ Remove | Same — unused                                |
| `LAYOUT.buttonSecondary` | ❌ Remove | Same — unused                                |
| `LAYOUT.cardPadding`     | ❌ Remove | Card component has its own padding logic     |
| `LAYOUT.card`            | ❌ Remove | Card component has its own variant classes   |
| `LAYOUT.patternDivider`  | ❌ Remove | PatternDivider uses inline classes           |
| `LAYOUT.flexCenter`      | ❌ Remove | Never used — just use Tailwind directly      |
| `LAYOUT.flexBetween`     | ❌ Remove | Never used                                   |
| `LAYOUT.flexCol`         | ❌ Remove | Never used                                   |
| `LAYOUT.body`            | ❌ Remove | Never used                                   |

### `config/theme.ts`

| Symbol                         | Status    | Reason                                                                    |
| ------------------------------ | --------- | ------------------------------------------------------------------------- |
| `THEME` (entire object)        | ❌ Remove | Never imported anywhere — colors/shadows/radius all live in CSS variables |
| `ANIMATIONS`                   | ❌ Remove | Never imported anywhere                                                   |
| `MOTION_VARIANTS.fadeIn`       | ❌ Remove | Never used                                                                |
| `MOTION_VARIANTS.blurSlideUp`  | ❌ Remove | Never used                                                                |
| `MOTION_VARIANTS.slideInScale` | ❌ Remove | Never used                                                                |
| `MOTION_VARIANTS.blurFadeOut`  | ❌ Remove | Never used                                                                |

### Unused Imports

| File                                        | Import                         | Action                          |
| ------------------------------------------- | ------------------------------ | ------------------------------- |
| `components/github-contributions/graph.tsx` | `LoaderIcon` from lucide-react | ❌ Remove                       |
| `components/hero/HeroTechStack.tsx`         | `motion` from motion/react     | ❌ Remove (only uses MotionDiv) |

### Unused Files

| File                                | Action    | Reason                                                   |
| ----------------------------------- | --------- | -------------------------------------------------------- |
| `hooks/use-breakpoint.ts`           | ❌ Delete | Never imported anywhere                                  |
| `components/seo/StructuredData.tsx` | ❌ Delete | Never used — `app/layout.tsx` has its own inline JSON-LD |

### Unused Types (`types/index.ts`)

| Type             | Status    | Reason                                           |
| ---------------- | --------- | ------------------------------------------------ |
| `ContactInfo`    | ❌ Remove | Never used as a type annotation                  |
| `SocialLinks`    | ❌ Remove | Never used as a type annotation                  |
| `HeroContent`    | ❌ Remove | Never used as a type annotation                  |
| `NavLink`        | ❌ Remove | Never used as a type annotation                  |
| `WorkExperience` | ❌ Remove | Never used as a type (component name shadows it) |

---

## 2. CSS Bloat (`styles/globals.css`)

| Item                               | Action    | Reason                            |
| ---------------------------------- | --------- | --------------------------------- |
| `.magnify-area` styles             | ❌ Remove | Class never used in any component |
| `.scrollbar-auto` utility          | ❌ Remove | Class never used in any component |
| `--sidebar-*` variables (10+ vars) | ❌ Remove | No sidebar component exists       |
| `--chart-*` variables (5 vars)     | ❌ Remove | No chart component uses these     |
| `--color-sidebar-*` theme mappings | ❌ Remove | Same — no sidebar                 |
| `--color-chart-*` theme mappings   | ❌ Remove | Same — no chart                   |

---

## 3. UI Inconsistencies

### Spacing & Layout

- **Container padding**: `px-2` (8px) is too tight on mobile → change to `px-4` (16px)
- **PatternDivider**: `w-2 sm:w-2` is redundant (sm:w-2 does nothing) → simplify
- **Section spacing conflict**: `LAYOUT.section` uses `py-12 sm:py-16` but the `<Section>` component defaults to `py-6 sm:py-8` — two competing systems

### Dark Mode

- `dark:bg-[#1E1E1E]` is hardcoded in 4+ places → already covered by CSS `--background` variable in `.dark` class, can be simplified

### Import Consistency

- Some files import from barrel `@/components/ui`, others from direct paths like `@/components/ui/Button` → standardize to barrel imports

### Component Structure

- Blog pages repeat the full wrapper (PatternDivider + container + Navbar + Footer) → create a shared `app/blog/layout.tsx` to deduplicate
- Footer has redundant `font-sans` class (body already sets it)
- `Card.gradient` prop is defined but never used by any consumer → remove

---

## 4. Implementation Priority

### Phase 1 — Dead Code Removal (low risk)

1. Clean `config/styles.ts` — remove 10 unused LAYOUT properties + RESPONSIVE + SPACING
2. Clean `config/theme.ts` — remove THEME, ANIMATIONS, 4 unused motion variants
3. Remove unused imports (LoaderIcon, motion)
4. Delete `hooks/use-breakpoint.ts`
5. Delete `components/seo/StructuredData.tsx`
6. Clean `types/index.ts`
7. Clean `globals.css` — remove unused styles and CSS variables

### Phase 2 — UI Consistency Fixes (medium risk)

1. Fix container padding (`px-2` → `px-4`)
2. Fix PatternDivider redundant breakpoints
3. Standardize imports to barrel exports
4. Remove redundant `font-sans` from footer
5. Remove unused `gradient` prop from Card
6. Create `app/blog/layout.tsx` to deduplicate blog page wrappers
