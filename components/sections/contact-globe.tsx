"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { profile } from "@/content/resume";
import { cn } from "@/lib/utils";

// ssr:false and gated on approach: d3-geo plus the land outline is its own chunk, paid for only
// by a visitor who actually scrolls near the footer.
const Globe = dynamic(() => import("@/components/ui/globe").then((m) => m.Globe), { ssr: false });

export function ContactGlobe({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { once: true, margin: "0px 0px 600px 0px" });

  return (
    <div
      ref={ref}
      // aspect-square reserves the slot before the chunk lands, so nothing shifts when it does.
      className={cn(
        "aspect-square text-[var(--fg)] [mask-image:linear-gradient(to_bottom,#000_62%,transparent_100%)]",
        className
      )}
    >
      {near && (
        <Globe
          lat={profile.coords.lat}
          lon={profile.coords.lon}
          label={`Globe turning past ${profile.location}`}
        />
      )}
    </div>
  );
}
