"use client";

import { useEffect, useState } from "react";
import {
  CopyButton,
  CopyButtonIcon,
} from "@animate-ui/react/primitives/buttons/copy";
import { Check, Copy } from "lucide-react";

export function CopyEmail({ email }: { email: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "unavailable">("idle");

  useEffect(() => {
    if (status === "idle") return;
    const timeout = window.setTimeout(() => setStatus("idle"), 2400);
    return () => window.clearTimeout(timeout);
  }, [status]);

  async function copy(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("unavailable");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <CopyButton
        content={email}
        copied={status === "copied"}
        onClick={copy}
        aria-label="Copy email address"
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-current bg-transparent px-4 text-sm font-medium transition-colors hover:bg-[var(--surface)] hover:text-[var(--fg)]"
      >
        <CopyButtonIcon
          icon={<Copy aria-hidden className="size-4" />}
          copiedIcon={<Check aria-hidden className="size-4" />}
        />
        Copy email
      </CopyButton>
      <span aria-live="polite" role="status" className="text-sm text-current/70">
        {status === "copied"
          ? "Copied"
          : status === "unavailable"
            ? "Copy unavailable — use the email link"
            : ""}
      </span>
    </div>
  );
}
