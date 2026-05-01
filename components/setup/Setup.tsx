import { Section } from "@/components/ui";

export default function Setup() {
  return (
    <Section title="Setup" id="setup">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium">Tools</h3>
          <p className="text-sm text-gray-500">
            I use the following tools to build my projects.
          </p>
        </div>
      </div>
    </Section>
  );
}
