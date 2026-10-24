import Link from "next/link";
import { SETUP_TOOLS } from "@/config/data";
import { HomeSection } from "@/components/home/HomeSection";

export function SetupGrid() {
  if (SETUP_TOOLS.length === 0) return null;

  return (
    <HomeSection id="setup" label="Setup">
      <ul className="grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
        {SETUP_TOOLS.map(({ name, note }) => (
          <li key={name}>
            <p className="text-sm font-bold">{name}</p>
            <p className="text-soft mt-0.5 text-sm">{note}</p>
          </li>
        ))}
      </ul>
      <Link
        href="/setup"
        className="hover:text-blue mt-7 inline-block text-sm font-semibold transition-colors"
      >
        Full setup guides <span aria-hidden="true">→</span>
      </Link>
    </HomeSection>
  );
}
