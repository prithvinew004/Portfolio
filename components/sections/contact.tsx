"use client";

import { ArrowUpRight } from "lucide-react";
import { profile, socials } from "@/content/resume";
import { DecryptText } from "@/components/animations/decrypt-text";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { SECTION, SECTION_CONTAINER, SECTION_LABEL } from "@/lib/section";
import { cn } from "@/lib/utils";

export function Contact() {
  return (
    <section id="contact" className={cn("bg-[var(--hero-void)] text-[var(--hero-cream)]", SECTION)}>
      <div className={SECTION_CONTAINER}>
        <h2 className={SECTION_LABEL}>Contact</h2>

        <p className="mt-10 font-display text-[clamp(2.2rem,7.5vw,5.5rem)] font-extrabold leading-[0.92] tracking-[-0.04em]">
          <DecryptText text="Let's work" />
          <br />
          <DecryptText text="together" />
        </p>

        <p className="mt-8 max-w-[46ch] text-pretty text-[var(--hero-sage)] sm:text-lg">
          {profile.availableForWork
            ? "Open to new work. The fastest way to reach me is email — I read everything."
            : "Not taking on new work right now, but always happy to talk."}
        </p>

        <ul className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-8">
          {socials.map((social) => {
            const external = social.href.startsWith("http");
            return (
              <li key={social.label}>
                <MagneticButton href={social.href} className="px-6 py-3">
                  <span className="flex flex-col items-start gap-0.5 text-left">
                    <span className="text-[0.6rem] text-[var(--hero-sage)]">{social.label}</span>
                    <span className="text-[0.72rem] normal-case tracking-normal">{social.handle}</span>
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 text-[var(--hero-amber)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                  {external && <span className="sr-only">(opens in a new tab)</span>}
                </MagneticButton>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
