"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { projects } from "@/content/resume";
import CardSwap, { Card, type CardSwapHandle } from "@/components/ui/card-swap";

export function HeroProjectStack() {
  const swapRef = useRef<CardSwapHandle>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const activeProject = projects[activeIndex];

  return (
    <div className="min-w-0 lg:-mr-12" data-hero-stack>
      <div className="hero-stack-stage">
        <CardSwap
          ref={swapRef}
          width={780}
          height={500}
          cardDistance={64}
          verticalDistance={48}
          depth={82}
          skewAmount={2.4}
          visibleCards={projects.length}
          delay={5800}
          autoplay={reduceMotion === false}
          pauseOnHover
          draggable={!reduceMotion}
          speed={reduceMotion ? 4 : 1.08}
          bounce={reduceMotion ? 0 : 0.16}
          parallax={reduceMotion ? 0 : 0.2}
          hoverSpread={reduceMotion ? 0 : 0.07}
          dim={0.38}
          cardRadius={12}
          intro={!reduceMotion}
          theme="dark"
          ariaLabel="Featured project websites"
          onChange={setActiveIndex}
        >
          {projects.map((project, index) => (
            <Card key={project.id} className="bg-[#11110f]">
              <div className="flex h-full flex-col p-2.5">
                <div className="flex h-12 min-w-0 items-center justify-between gap-4 px-3 text-sm">
                  <span className="truncate font-medium text-white">{project.title}</span>
                  <span className="shrink-0 font-mono text-xs tabular-nums text-[var(--signal)]">
                    {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                  </span>
                </div>
                <div className="relative min-h-0 flex-1 overflow-hidden rounded-md border border-white/10 bg-[#1b1b18]">
                  <Image
                    src={project.image.src}
                    alt={project.image.alt}
                    fill
                    priority={index < 2}
                    sizes="(min-width: 1024px) 54vw, 94vw"
                    className="object-cover object-top"
                    draggable={false}
                  />
                </div>
              </div>
            </Card>
          ))}
        </CardSwap>
      </div>

      <div className="hero-stack-meta mt-2 grid gap-4 border-t border-[var(--line)] pt-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="min-w-0" aria-live="polite">
          <p className="truncate text-base font-medium text-[var(--fg)]">{activeProject.title}</p>
          <p className="mt-1 truncate text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
            {activeProject.statusLabel}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="stack-control stack-control-icon"
            onClick={() => swapRef.current?.prev()}
            aria-label="Previous project"
          >
            <ArrowLeft aria-hidden className="size-4" />
          </button>
          <button
            type="button"
            className="stack-control stack-control-icon"
            onClick={() => swapRef.current?.next()}
            aria-label="Next project"
          >
            <ArrowRight aria-hidden className="size-4" />
          </button>
          <a
            href={activeProject.liveUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="stack-control stack-control-primary gap-2"
          >
            Live site
            <ArrowUpRight aria-hidden className="size-4" />
            <span className="sr-only">: {activeProject.title} (opens in a new tab)</span>
          </a>
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-[var(--dim)]">
        Drag the front card, use the controls, or focus the stack and press an arrow key.
      </p>
    </div>
  );
}
