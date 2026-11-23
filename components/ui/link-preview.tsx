"use client";

import type { ReactNode } from "react";
import {
  PreviewLinkCard,
  PreviewLinkCardImage,
  PreviewLinkCardPopup,
  PreviewLinkCardPortal,
  PreviewLinkCardPositioner,
  PreviewLinkCardTrigger,
} from "@animate-ui/react/primitives/base-ui/preview-link-card";
import { cn } from "@/lib/utils";

type LinkPreviewProps = {
  children: ReactNode;
  url: string;
  className?: string;
  imageSrc: string;
  imageAlt: string;
  isStatic?: boolean;
};

export function LinkPreview({
  children,
  url,
  className,
  imageSrc,
  imageAlt,
}: LinkPreviewProps) {
  return (
    <PreviewLinkCard href={url} src={imageSrc} width={320} height={180}>
      <PreviewLinkCardTrigger
        target="_blank"
        rel="noreferrer noopener"
        delay={450}
        closeDelay={150}
        className={className}
      >
        {children}
      </PreviewLinkCardTrigger>
      <PreviewLinkCardPortal>
        <PreviewLinkCardPositioner side="top" sideOffset={12} className="z-50">
          <PreviewLinkCardPopup
            target="_blank"
            rel="noreferrer noopener"
            className={cn(
              "overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-1 shadow-xl outline-none",
              "origin-[var(--transform-origin)]"
            )}
          >
            <PreviewLinkCardImage
              alt={imageAlt}
              className="block aspect-video w-80 rounded-xl object-cover object-top"
            />
          </PreviewLinkCardPopup>
        </PreviewLinkCardPositioner>
      </PreviewLinkCardPortal>
    </PreviewLinkCard>
  );
}
