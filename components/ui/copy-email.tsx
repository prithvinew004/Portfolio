"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyEmail({ email }: { email: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "unavailable">("idle");

  useEffect(() => {
    if (status === "idle") return;
    const timeout = window.setTimeout(() => setStatus("idle"), 2400);
    return () => window.clearTimeout(timeout);
  }, [status]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("unavailable");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={copy}
        aria-label="Copy email address"
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-current px-4 text-sm font-medium"
      >
        {status === "copied" ? (
          <Check aria-hidden className="size-4" />
        ) : (
          <Copy aria-hidden className="size-4" />
        )}
        Copy email
      </button>
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
