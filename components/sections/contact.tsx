import { contact, profile, sectionN, socials } from "@/content/resume";
import { CopyEmail } from "@/components/ui/copy-email";
import { SectionLabel } from "@/components/ui/section-label";
import { Separator } from "@/components/ui/separator";
import { CONTENT, GUTTER } from "@/lib/section";

export function Contact() {
  const externalSocials = socials.filter(({ label }) => label !== "Email");

  return (
    <footer
      id="contact"
      aria-labelledby="contact-title"
      className={`${GUTTER} bg-[var(--fg)] pb-8 pt-24 text-[var(--surface)] sm:pt-32`}
    >
      <div className={`${CONTENT} mx-auto`}>
        <SectionLabel
          n={sectionN("contact")}
          className="text-[var(--bg)]/65 [&>span]:text-[var(--surface)]"
        >
          Contact
        </SectionLabel>

        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:items-end">
          <div className="min-w-0">
            <h2
              id="contact-title"
              className="max-w-[14ch] text-balance font-display text-[clamp(3rem,7vw,5.75rem)] font-semibold leading-[0.96]"
            >
              {contact.heading[0]} {contact.heading[1]}
            </h2>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-[var(--bg)]/70">
              Share the workflow, product, or problem you are trying to move forward. A concise
              email is enough to start.
            </p>
          </div>

          <div className="min-w-0 lg:pb-2">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex min-h-12 max-w-full items-center gap-3 break-all text-lg font-semibold text-[var(--surface)] underline decoration-[var(--accent)] decoration-2 underline-offset-8 sm:text-xl"
            >
              {profile.email}
            </a>
            <div className="mt-5">
              <CopyEmail email={profile.email} />
            </div>
          </div>
        </div>

        <Separator className="mt-16 bg-[var(--surface)]/20" />
        <div className="flex flex-col gap-7 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap gap-5">
            {externalSocials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex min-h-11 items-center gap-2 text-[var(--bg)]/75 hover:text-[var(--surface)]"
                >
                  {social.label}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
          <a href="#hero" className="inline-flex min-h-11 items-center text-[var(--bg)]/75">
            Back to top ↑
          </a>
        </div>

        <div className="mt-8 flex flex-col gap-2 text-sm text-[var(--bg)]/55 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>{contact.footerNote}</span>
        </div>
      </div>
    </footer>
  );
}
