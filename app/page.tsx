import Hero from "@/app/components/Hero";
import Navbar from "@/app/components/Navbar";
import WorkExperience from "@/app/components/WorkExperience";

export default function Page() {
  return (
    <div className="flex [--pattern-fg:var(--color-gray-950)]/5 dark:bg-gray-950 dark:[--pattern-fg:var(--color-white)]/10">
      <div className="relative -right-px col-start-2 row-span-full row-start-1 w-8 border-x border-x-(--pattern-fg) bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed"></div>
      <div className="mx-auto max-w-[1200px] flex-1 px-6 dark:bg-gray-950">
        <Navbar />
        <Hero />
        <WorkExperience />
      </div>
      <div className="relative -left-px col-start-4 row-span-full row-start-1 w-8 border-x border-x-(--pattern-fg) bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed"></div>
    </div>
  );
}
