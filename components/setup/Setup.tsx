import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Section, GridBand, GridCell } from "@/components/ui";
import { getAllSetupGuides } from "@/lib/setup";

export default function Setup() {
  const guides = getAllSetupGuides();

  return (
    <Section title="setup" id="setup">
      <GridBand cols="grid-cols-1 sm:grid-cols-2">
        {guides.map((guide, index) => (
          <GridCell
            key={guide.slug}
            padded={false}
            tinted={index % 2 === 1}
            className="group transition-colors hover:bg-gray-50 dark:hover:bg-black"
          >
            <Link
              href={`/setup/${guide.slug}`}
              className="flex h-full items-center justify-between gap-4 p-6 sm:p-8"
            >
              <div className="min-w-0">
                <h3 className="ss01 normal-case-force group-hover:text-blue line-clamp-1 text-base font-semibold transition-colors">
                  {guide.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {guide.description}
                </p>
              </div>
              <ChevronRight
                size={18}
                className="shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </GridCell>
        ))}
      </GridBand>
    </Section>
  );
}
