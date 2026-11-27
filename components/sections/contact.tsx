import { ArrowUpRight } from "lucide-react";
import { FooterAntialiasing } from "@/components/gpu/footer-antialiasing";
import { contact, profile, sectionN, socials } from "@/content/resume";
import { CopyEmail } from "@/components/ui/copy-email";
import { SectionLabel } from "@/components/ui/section-label";
import { CONTENT, GUTTER } from "@/lib/section";

export function Contact() {
  const externalSocials = socials.filter(({ label }) => label !== "Email");

  return (
    <footer
      id="contact"
      aria-labelledby="contact-title"
      className={`${GUTTER} relative isolate border-t border-[var(--line)] pb-6 pt-[clamp(64px,9vw,112px)]`}
    >
      <div className={`${CONTENT} mx-auto`}>
        <SectionLabel n={sectionN("contact")}>Contact</SectionLabel>

        <div className="section-reveal mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="min-w-0">
            <h2
              id="contact-title"
              className="section-title max-w-[17ch]"
            >
              {contact.heading[0]} {contact.heading[1]}
            </h2>
            <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-[var(--muted)]">
              Share the workflow, product, or problem you are trying to move forward. A concise
              email is enough to start.
            </p>
          </div>

          <div className="min-w-0 lg:pb-2">
            <a
              href={`mailto:${profile.email}`}
              className="text-link inline-flex min-h-11 max-w-full items-center gap-2 break-all text-base font-medium text-[var(--accent)] underline underline-offset-4 sm:text-lg"
            >
              {profile.email} <ArrowUpRight aria-hidden className="size-4 shrink-0" />
            </a>
            <div className="mt-2">
              <CopyEmail email={profile.email} />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-x-6 border-t border-[var(--line)] pt-3">
          <ul className="flex flex-wrap gap-5">
            {externalSocials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-link inline-flex min-h-11 items-center gap-1.5 text-sm text-[var(--muted)]"
                >
                  {social.label} <ArrowUpRight aria-hidden className="size-4" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
          <a href="#hero" className="text-link inline-flex min-h-11 items-center text-sm text-[var(--muted)]">
            Back to top ↑
          </a>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <p className="text-xs text-[var(--dim)]">© {new Date().getFullYear()} {profile.name}</p>
          <FooterAntialiasing />
        </div>
      </div>
    </footer>
  );
}
