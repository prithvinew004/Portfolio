"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-media-query";

/** The address itself, with a clipboard icon that morphs into a check once it's copied. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // No clipboard (insecure context, permission denied): fall through to the mail client.
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      data-cursor="snap"
      className="group inline-flex items-center gap-3 font-mono text-[15px] text-[var(--fg)] transition-colors duration-[--dur] ease-[--ease] hover:text-[var(--ac)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ac)]"
    >
      <span className="ul-draw">{email}</span>
      <CopiedIcon copied={copied} instant={reduced} />
      <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]" role="status">
        {copied ? "Copied" : "Copy"}
      </span>
    </button>
  );
}

/* Clipboard → check. Lifted from the 21st.dev state-icon set, driven by real state rather than
   its demo's auto-toggle. */
function CopiedIcon({ copied, instant }: { copied: boolean; instant: boolean }) {
  const d = instant ? 0 : 0.3;
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden className="size-[18px] shrink-0">
      <rect x="12" y="10" width="18" height="22" rx="2" stroke="currentColor" strokeWidth={2} />
      <path
        d="M10 14a2 2 0 00-2 2v18a2 2 0 002 2h14"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.3}
      />
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.path
            key="check"
            d="M16 21l4 4 6-8"
            stroke="var(--ac)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            exit={{ pathLength: 0 }}
            transition={{ duration: d }}
          />
        ) : (
          <motion.g
            key="lines"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: d * 0.66 }}
          >
            <line x1="17" y1="18" x2="25" y2="18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" opacity={0.4} />
            <line x1="17" y1="23" x2="25" y2="23" stroke="currentColor" strokeWidth={2} strokeLinecap="round" opacity={0.4} />
            <line x1="17" y1="28" x2="22" y2="28" stroke="currentColor" strokeWidth={2} strokeLinecap="round" opacity={0.4} />
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  );
}
