import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Section, Card } from "@/components/ui";
import { getAllSetupGuides } from "@/lib/setup";

export default function Setup() {
  const guides = getAllSetupGuides();

  return (
    <Section title="Setup" id="setup">
      <div className="flex flex-col gap-4">
        {guides.map((guide) => (
          <Link key={guide.slug} href={`/setup/${guide.slug}`}>
            <Card
              variant="default"
              padding="md"
              className="group hover:border-foreground/20 flex items-center justify-between gap-4 transition-colors"
            >
              <div className="min-w-0">
                <h3 className="line-clamp-1 text-base font-semibold text-gray-900 transition-colors group-hover:text-gray-700 dark:text-white dark:group-hover:text-gray-300">
                  {guide.title}
                </h3>
                <p className="mt-1 line-clamp-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {guide.description}
                </p>
              </div>
              <ChevronRight
                size={18}
                className="text-muted-foreground shrink-0 transition-transform group-hover:translate-x-0.5"
              />
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}
