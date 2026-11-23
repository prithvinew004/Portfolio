"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { projects } from "@/content/resume";
import CardSwap, { Card, type CardSwapHandle } from "@/components/ui/card-swap";

export function HeroProjectStack() {
  const swapRef = useRef<CardSwapHandle>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const activeProject = projects[activeIndex];

  return (
    <div className="min-w-0" data-hero-stack>
      <div className="hero-stack-stage">
        <CardSwap
          ref={swapRef}
          width={600}
          height={410}
          cardDistance={56}
          verticalDistance={46}
          depth={78}
          skewAmount={3.5}
          visibleCards={projects.length}
          delay={5600}
          autoplay={reduceMotion === false}
          pauseOnHover
          draggable={!reduceMotion}
          speed={reduceMotion ? 4 : 1.15}
          bounce={reduceMotion ? 0 : 0.18}
          parallax={reduceMotion ? 0 : 0.24}
          hoverSpread={reduceMotion ? 0 : 0.08}
          dim={0.34}
          cardRadius={22}
          intro={!reduceMotion}
          theme="light"
          ariaLabel="Featured project websites"
          onChange={setActiveIndex}
        >
          {projects.map((project, index) => (
            <Card key={project.id} className="bg-[var(--surface)]">
              <div className="flex h-full flex-col p-2">
                <div className="flex h-11 min-w-0 items-center justify-between gap-4 px-3 text-sm">
                  <span className="truncate font-semibold text-[var(--fg)]">{project.title}</span>
                  <span className="shrink-0 tabular-nums text-[var(--muted)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--node)]">
                  <Image
                    src={project.image.src}
                    alt={project.image.alt}
                    fill
                    priority={index < 2}
                    sizes="(min-width: 1024px) 44vw, 90vw"
                    className="object-cover object-top"
                    draggable={false}
                  />
                </div>
              </div>
            </Card>
          ))}
        </CardSwap>
      </div>

      <div className="mt-5 flex flex-col gap-4 border-t border-[var(--line)] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--fg)]" aria-live="polite">
            {activeProject.title}
          </p>
          <p className="mt-1 text-sm tabular-nums text-[var(--muted)]">
            {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="stack-control"
            onClick={() => swapRef.current?.prev()}
          >
            Previous
          </button>
          <button
            type="button"
            className="stack-control"
            onClick={() => swapRef.current?.next()}
          >
            Next
          </button>
          <a
            href={activeProject.liveUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="stack-control stack-control-primary"
          >
            Visit live site
            <span className="sr-only">: {activeProject.title} (opens in a new tab)</span>
          </a>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
        Drag the front card, use the controls, or focus the stack and press an arrow key.
      </p>
    </div>
  );
}
