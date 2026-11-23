import Image from "next/image";
import { Database, Files, PanelsTopLeft } from "lucide-react";
import { capabilities, independentProjects, projects, sectionN } from "@/content/resume";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { Pill } from "@/components/ui/pill";
import { SectionIntro } from "@/components/ui/section-intro";
import { CONTENT, GUTTER, SECTION_Y } from "@/lib/section";

const projectById = new Map(
  [...projects, ...independentProjects].map((project) => [project.id, project])
);

const icons = [PanelsTopLeft, Database, Files] as const;
const cardClasses = ["lg:col-span-2", "lg:col-span-1", "lg:col-span-3"] as const;

function CapabilityEvidence({ capabilityIndex }: { capabilityIndex: number }) {
  const capability = capabilities[capabilityIndex];
  const evidence = capability.evidenceProjectIds
    .map((projectId) => projectById.get(projectId))
    .filter((project) => project !== undefined)
    .slice(0, capabilityIndex === 2 ? 2 : 3);

  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden bg-[var(--bg)] p-5 sm:p-7">
      <div className="grid size-full grid-cols-2 gap-3">
        {evidence.map((project, index) => (
          <div
            key={project.id}
            className={`relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] ${
              evidence.length === 3 && index === 0 ? "col-span-2" : ""
            }`}
          >
            <Image
              src={project.image.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 32vw, 80vw"
              className="object-cover object-top"
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-x-5 bottom-5 flex flex-wrap gap-2 sm:inset-x-7 sm:bottom-7">
        {capability.skills.map((skill) => (
          <Pill
            key={skill}
            variant="outline"
            className="border-white/30 bg-[var(--fg)] text-[var(--surface)] shadow-sm"
          >
            {skill}
          </Pill>
        ))}
      </div>
    </div>
  );
}

export function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="capabilities-title"
      className={`${GUTTER} ${SECTION_Y} border-y border-[var(--line)] bg-[var(--surface)]`}
    >
      <div className={`${CONTENT} mx-auto`}>
        <SectionIntro
          n={sectionN("skills")}
          label="Capabilities"
          title="A stack is useful when the workflow holds together."
          titleId="capabilities-title"
          description={
            <p>
              Each capability is tied to public work you can inspect—interface, supporting system,
              and delivery treated as one product.
            </p>
          }
        />

        <BentoGrid className="mt-10 auto-rows-[30rem] lg:auto-rows-[28rem]">
          {capabilities.map((capability, index) => {
            const evidenceProject = projectById.get(capability.evidenceProjectIds[0]);
            return (
              <BentoCard
                key={capability.title}
                name={capability.title}
                description={capability.description}
                Icon={icons[index]}
                href={`#project-${capability.evidenceProjectIds[0]}`}
                cta={`See ${evidenceProject?.title ?? "project"} evidence`}
                className={cardClasses[index]}
                background={<CapabilityEvidence capabilityIndex={index} />}
              />
            );
          })}
        </BentoGrid>
      </div>
    </section>
  );
}
