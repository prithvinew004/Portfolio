import { contact, profile, socials } from "@/content/resume";
import { Reveal } from "@/components/animations/reveal";
import { DecryptText } from "@/components/animations/decrypt-text";
import { RollLabel } from "@/components/ui/roll-label";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { SectionLabel } from "@/components/ui/section-label";
import { GUTTER } from "@/lib/section";

export function Contact() {
  return (
    <section
      id="contact"
      className={`relative border-t border-white/[0.07] ${GUTTER} pb-10 pt-[clamp(100px,16vh,200px)]`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-20%] left-[30%] h-[40vw] w-[60vw]"
        style={{
          background:
            "radial-gradient(ellipse,color-mix(in srgb,var(--ac) 7%,transparent) 0%,transparent 65%)",
        }}
      />

      <SectionLabel n="05" className="relative mb-9">
        Contact
      </SectionLabel>

      <Reveal>
        <h2 className="relative m-0 font-display text-[clamp(40px,7.6vw,124px)] font-extrabold uppercase leading-[0.98] tracking-[-0.02em]">
          <DecryptText text={contact.heading[0]} />
          <br />
          <span className="stroke-ac">
            <DecryptText text={contact.heading[1]} />
          </span>
        </h2>
      </Reveal>

      <ul className="relative mt-[clamp(36px,6vh,64px)] flex flex-wrap gap-4">
        {socials.map((s) => (
          <li key={s.label}>
            <MagneticButton
              href={s.href}
              external={s.href.startsWith("http")}
              className="border border-white/20 px-[38px] py-5 tracking-[0.06em] text-[var(--fg)] transition-all duration-[--dur] ease-[--ease] hover:border-[var(--ac)] hover:bg-[var(--ac)] hover:text-[var(--bg)]"
            >
              <RollLabel text={s.label} /> <span aria-hidden>→</span>
              {s.href.startsWith("http") && <span className="sr-only">(opens in a new tab)</span>}
            </MagneticButton>
          </li>
        ))}
      </ul>

      <div className="relative mt-[clamp(80px,12vh,140px)] flex flex-wrap justify-between gap-3 border-t border-[var(--line)] pt-6 text-[13px] text-[var(--muted)]">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>{contact.footerNote}</span>
        <a
          href="#hero"
          className="ul-draw text-[var(--muted)] transition-colors duration-[--dur] ease-[--ease] hover:text-[var(--ac)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ac)]"
        >
          Back to top <span aria-hidden>↑</span>
        </a>
      </div>
    </section>
  );
}
