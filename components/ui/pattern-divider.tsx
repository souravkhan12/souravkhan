interface PatternDividerProps {
  position: "left" | "right";
}

export function PatternDivider({ position }: PatternDividerProps) {
  const isLeft = position === "left";

  return (
    <div
      className={`relative col-start-${isLeft ? "2" : "4"} border-x-foreground/5 dark:border-x-foreground/10 row-span-full row-start-1 w-4 border-x bg-[repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] bg-fixed sm:w-2 md:w-8 ${
        isLeft ? "-right-px" : "-left-px"
      }`}
    />
  );
}
