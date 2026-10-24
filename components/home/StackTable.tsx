import { STACK } from "@/config/data";
import { HomeSection } from "@/components/home/HomeSection";
import { TechChip } from "@/components/ui/tech";

export function StackTable() {
  if (STACK.length === 0) return null;

  return (
    <HomeSection id="stack" label="Stack">
      <dl className="flex flex-col gap-4 sm:grid sm:grid-cols-[110px_minmax(0,1fr)] sm:gap-x-6 sm:gap-y-4">
        {STACK.map(({ group, items }) => (
          <div key={group} className="contents">
            <dt className="text-faint -mb-2 text-sm sm:mb-0 sm:pt-1">
              {group}
            </dt>
            <dd className="flex flex-wrap gap-1.5">
              {items.map((item) => (
                <TechChip key={item} label={item} />
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </HomeSection>
  );
}
