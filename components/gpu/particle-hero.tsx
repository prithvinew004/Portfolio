"use client";

import { useEffect, useRef, useState } from "react";
import type { ParticleRenderer } from "./particle-renderer";

type Mode = "static" | "active" | "paused";

export function ParticleHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>("static");

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.closest("section");
    if (!canvas || !section || !navigator.gpu || !("IntersectionObserver" in window)) return;
    const target = canvas;

    const controller = new AbortController();
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = matchMedia("(max-width: 767px), (pointer: coarse)").matches;
    let renderer: ParticleRenderer | undefined;
    let visible = false;
    let loading = false;
    let firstFrame = false;
    let failed = false;

    function fail() {
      if (controller.signal.aborted) return;
      failed = true;
      renderer?.dispose();
      setMode("static");
    }

    function sync() {
      if (failed || controller.signal.aborted) return;
      const eligible = visible && !document.hidden && !motion.matches;
      if (renderer) {
        if (eligible) renderer.start();
        else renderer.stop();
        if (firstFrame) setMode(motion.matches ? "static" : eligible ? "active" : "paused");
      } else if (eligible && !loading) {
        loading = true;
        void import("./particle-renderer")
          .then(({ createParticleRenderer }) => createParticleRenderer(target, {
            mobile,
            signal: controller.signal,
            onFirstFrame() {
              firstFrame = true;
              sync();
            },
            onFailure: fail,
          }))
          .then((next) => {
            if (failed || controller.signal.aborted) {
              next.dispose();
              return;
            }
            renderer = next;
            sync();
          })
          .catch(fail);
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(section);

    function trackPointer(event: PointerEvent) {
      if (!renderer || !visible || motion.matches || event.pointerType !== "mouse") return;
      const bounds = target.getBoundingClientRect();
      if (bounds.width && bounds.height) {
        renderer.setPointer([(event.clientX - bounds.left) / bounds.width, (event.clientY - bounds.top) / bounds.height]);
      }
    }
    function clearPointer() {
      renderer?.setPointer(null);
    }

    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    if (!mobile) {
      section.addEventListener("pointermove", trackPointer, { passive: true });
      section.addEventListener("pointerleave", clearPointer);
    }

    return () => {
      controller.abort();
      observer.disconnect();
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      section.removeEventListener("pointermove", trackPointer);
      section.removeEventListener("pointerleave", clearPointer);
      renderer?.dispose();
    };
  }, []);

  return (
    <div className="hero-art" aria-hidden="true" data-renderer={mode}>
      <div className="hero-static" />
      <canvas ref={canvasRef} className="hero-canvas" />
    </div>
  );
}
