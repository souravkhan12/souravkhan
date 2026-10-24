import { STACK } from "@/config/data";
import { HomeSection } from "@/components/home/HomeSection";

export function StackTable() {
  if (STACK.length === 0) return null;

  return (
    <HomeSection id="stack" label="Stack">
      <dl className="grid grid-cols-[96px_minmax(0,1fr)] gap-x-6 gap-y-3 text-sm sm:grid-cols-[150px_minmax(0,1fr)]">
        {STACK.map(({ group, items }) => (
          <div key={group} className="contents">
            <dt className="text-faint">{group}</dt>
            <dd>{items}</dd>
          </div>
        ))}
      </dl>
    </HomeSection>
  );
}
