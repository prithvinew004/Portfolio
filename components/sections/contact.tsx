import { ArrowUpRight } from "lucide-react";
import { profile, socials } from "@/content/resume";
import { CopyEmail } from "@/components/ui/copy-email";
import { CONTENT, GUTTER } from "@/lib/section";

export function Contact() {
  const externalSocials = socials.filter(({ label }) => label !== "Email");

  return (
    <footer
      id="contact"
      aria-labelledby="contact-title"
      className={`${GUTTER} bg-[var(--signal)] pb-8 pt-20 text-[#0a0b08] sm:pt-24 lg:pt-28`}
    >
      <div className={`${CONTENT} mx-auto`}>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/65">07 / Contact</p>

        <div className="mt-7 border-y border-black/25 py-10 sm:py-14 lg:py-16">
          <h2
            id="contact-title"
            className="max-w-[14ch] text-balance font-sans text-[clamp(3.25rem,9vw,9.5rem)] font-normal leading-[0.84] tracking-[-0.075em]"
          >
            Have a product worth building?
          </h2>
        </div>

        <div className="grid gap-10 border-b border-black/25 py-9 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <p className="max-w-2xl text-pretty text-lg leading-8 text-black/70 sm:text-xl sm:leading-9">
            Share the workflow, product, or problem you are trying to move forward. A concise email is enough to start.
          </p>

          <div className="min-w-0 lg:justify-self-end lg:text-right">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex max-w-full items-center gap-3 break-all border-b-2 border-black pb-1 text-lg font-medium sm:text-2xl"
            >
              {profile.email}
              <ArrowUpRight aria-hidden className="hidden size-5 sm:block" />
            </a>
            <div className="mt-5 flex lg:justify-end">
              <CopyEmail email={profile.email} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-7 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {externalSocials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex min-h-11 items-center gap-2 text-black/70 hover:text-black"
                >
                  {social.label}
                  <ArrowUpRight aria-hidden className="size-3.5" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
          <a href="#hero" className="inline-flex min-h-11 items-center text-black/70 hover:text-black">
            Back to top ↑
          </a>
        </div>

        <div className="mt-8 flex flex-col gap-2 text-xs uppercase tracking-[0.12em] text-black/65 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>Built with evidence, motion, and care.</span>
        </div>
      </div>
    </footer>
  );
}
