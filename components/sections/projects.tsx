"use client";

import { Braces, FileStack, ImageIcon, Trophy } from "lucide-react";
import FlowingMenu, { type FlowingMenuItem } from "@/components/FlowingMenu";
import {
  CollectionGridDisclosure,
  type Collection,
} from "@/components/watermelon/collection-grid-disclosure";
import { Safari } from "@/components/ui/safari";
import { independentProjects, projects, supportingProjects } from "@/content/resume";
import { CONTENT, GUTTER } from "@/lib/section";

const workItems: FlowingMenuItem[] = projects.map((project) => ({
  text: project.title.replace(" · Dr Raja Neuro Care", ""),
  marquee: project.title,
  image: project.image.src,
  meta: project.capabilities[0],
  link: project.liveUrl,
}));

const independentById = new Map(independentProjects.map((project) => [project.id, project]));
const supporting = supportingProjects[0];

const toolCollections: readonly Collection[] = [
  {
    id: "product-system",
    name: "Full-stack product system",
    description: "One connected product flow spanning members, payments, scheduled work, charity choice, and admin review.",
    items: [
      {
        id: "golfgives",
        name: independentById.get("golfgives")!.title,
        status: independentById.get("golfgives")!.statusLabel,
        summary: independentById.get("golfgives")!.summary,
        technologies: independentById.get("golfgives")!.capabilities,
        icon: Trophy,
        liveUrl: independentById.get("golfgives")!.liveUrl!,
        repoUrl: independentById.get("golfgives")!.repoUrl,
      },
    ],
  },
  {
    id: "browser-tools",
    name: "Browser tool suite",
    description: "Focused utilities for documents, developer tasks, and images—organized for fast discovery and direct use.",
    items: [
      {
        id: "pdftoolkit",
        name: independentById.get("pdftoolkit")!.title,
        status: independentById.get("pdftoolkit")!.statusLabel,
        summary: independentById.get("pdftoolkit")!.summary,
        technologies: independentById.get("pdftoolkit")!.capabilities,
        icon: FileStack,
        liveUrl: independentById.get("pdftoolkit")!.liveUrl!,
        repoUrl: independentById.get("pdftoolkit")!.repoUrl,
      },
      {
        id: "devtoolkit",
        name: independentById.get("devtoolkit")!.title,
        status: independentById.get("devtoolkit")!.statusLabel,
        summary: independentById.get("devtoolkit")!.summary,
        technologies: independentById.get("devtoolkit")!.capabilities,
        icon: Braces,
        liveUrl: independentById.get("devtoolkit")!.liveUrl!,
        repoUrl: independentById.get("devtoolkit")!.repoUrl,
      },
      {
        id: "imagetoolkit",
        name: supporting.title,
        status: supporting.statusLabel,
        summary: supporting.summary,
        technologies: ["Image workflows", "Conversion", "Compression", "Browser tools"],
        icon: ImageIcon,
        liveUrl: supporting.liveUrl,
        repoUrl: supporting.repoUrl,
      },
    ],
  },
];

export function Projects() {
  const primary = projects[0];

  return (
    <>
      <section
        id="projects"
        aria-labelledby="projects-title"
        className="border-b border-[var(--line)] bg-[var(--bg)] text-[var(--fg)]"
      >
        <div className={`${CONTENT} ${GUTTER} mx-auto pb-10 pt-24 sm:pb-14 sm:pt-28`}>
          <div className="grid gap-6 border-b border-[var(--line)] pb-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="section-kicker">01 / Selected work</p>
              <h2
                id="projects-title"
                className="mt-5 max-w-[11ch] text-balance font-sans text-[clamp(3rem,7vw,6.75rem)] font-normal leading-[0.88] tracking-[-0.07em]"
              >
                Pick a project. Let the work move.
              </h2>
            </div>
            <div className="lg:justify-self-end">
              <p className="max-w-xl text-pretty text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
                Four public product and organization surfaces. Hover or focus a row to bring its real interface into the index.
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[var(--dim)]">
                Hover / focus / tap to explore
              </p>
            </div>
          </div>
        </div>

        <div className="h-[68svh] min-h-[31rem] max-h-[52rem] border-b border-[var(--line)]">
          <FlowingMenu
            items={workItems}
            speed={54}
            direction="alternate"
            followCursor={0.32}
            duration={0.48}
            stretch={0.55}
            magnet={0.18}
            bandRadius={0}
            textColor="var(--fg)"
            bgColor="var(--bg)"
            marqueeBgColor="var(--signal)"
            marqueeTextColor="#090a08"
            borderColor="var(--line)"
            align="left"
            showIndex
            showArrow
            imageShape="rounded"
            intro={false}
            ariaLabel="Selected project websites"
            className="work-flowing-menu"
          />
        </div>
      </section>

      <section
        id={`project-${primary.id}`}
        aria-labelledby="primary-case-study-title"
        className="case-study-stage overflow-hidden bg-[var(--paper)] text-[var(--paper-ink)]"
      >
        <div className={`${CONTENT} ${GUTTER} mx-auto py-24 sm:py-28 lg:py-36`}>
          <div className="grid gap-8 border-b border-black/20 pb-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <p className="section-kicker !text-black/65">02 / Primary evidence</p>
              <h2
                id="primary-case-study-title"
                className="mt-5 max-w-[12ch] text-balance font-sans text-[clamp(2.8rem,6.5vw,6.25rem)] font-normal leading-[0.9] tracking-[-0.065em]"
              >
                A clinical entry point designed for trust.
              </h2>
            </div>
            <p className="max-w-2xl text-pretty text-lg leading-8 text-black/70 lg:justify-self-end">
              {primary.summary}
            </p>
          </div>

          <div className="case-study-media relative mt-10 overflow-hidden bg-[var(--signal)] px-3 pb-0 pt-12 sm:px-10 sm:pt-16 lg:px-20 lg:pt-24">
            <span className="absolute left-5 top-4 text-xs font-medium uppercase tracking-[0.16em] text-black/55 sm:left-8 sm:top-6">
              Live public surface / verified {primary.verifiedOn}
            </span>
            <Safari
              imageSrc={primary.image.src}
              imageAlt={primary.image.alt}
              imagePriority
              url="dev.curoh.com/login/dr-raja-neuro-care"
              className="translate-y-2 drop-shadow-[0_36px_34px_rgba(0,0,0,0.28)] sm:translate-y-4"
            />
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/65">Contribution</p>
              <p className="mt-4 max-w-md text-pretty text-xl leading-8">
                {primary.contribution}
              </p>
              <a
                href={primary.liveUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-7 inline-flex min-h-11 items-center border-b border-black font-medium"
              >
                Open the live product ↗
                <span className="sr-only">{primary.title} (opens in a new tab)</span>
              </a>
            </div>

            <div className="border-t border-black/20">
              {primary.capabilities.map((capability, index) => (
                <div key={capability} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-black/20 py-5 sm:py-6">
                  <span className="text-xs tabular-nums text-black/65">0{index + 1}</span>
                  <span className="font-display text-[clamp(1.6rem,3vw,2.75rem)] font-medium leading-none tracking-[-0.035em]">
                    {capability}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="independent-work"
        aria-labelledby="independent-work-title"
        className={`${GUTTER} border-y border-[var(--line)] bg-[var(--bg)] py-24 text-[var(--fg)] sm:py-28 lg:py-36`}
      >
        <div className={`${CONTENT} mx-auto`}>
          <div className="grid gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="section-kicker">03 / Independent products</p>
              <h2
                id="independent-work-title"
                className="mt-5 max-w-[10ch] text-balance font-sans text-[clamp(2.8rem,6vw,6rem)] font-normal leading-[0.9] tracking-[-0.065em]"
              >
                Open a collection. See the system inside.
              </h2>
            </div>
            <p className="max-w-xl text-pretty text-lg leading-8 text-[var(--muted)] lg:justify-self-end">
              Multi-role workflows and browser utilities, grouped by the job they do rather than presented as another wall of cards.
            </p>
          </div>

          <CollectionGridDisclosure collections={toolCollections} className="mt-12 sm:mt-16" />
        </div>
      </section>
    </>
  );
}
