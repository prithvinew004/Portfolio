"use client";

import { useEffect, useRef, useState } from "react";
import type { FooterAaRenderer } from "./footer-aa-renderer";

export function FooterAntialiasing() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage || !navigator.gpu || !("IntersectionObserver" in window) || !("ResizeObserver" in window)) return;
    const target = canvas;
    const controller = new AbortController();
    const signal = controller.signal;
    const motion = matchMedia("(prefers-reduced-motion: reduce), (forced-colors: active)");
    let renderer: FooterAaRenderer | undefined;
    let loading = false;
    let failed = false;
    let visible = false;
    let firstFrameSubmitted = false;
    let raf = 0;
    let previous = 0;
    let time = 0;
    const eligible = () => visible && !document.hidden && !motion.matches && !failed && !signal.aborted;

    function fail() {
      if (signal.aborted) return;
      failed = true;
      cancelAnimationFrame(raf);
      setReady(false);
    }

    function paint(now: number) {
      raf = 0;
      if (!eligible() || !renderer) return;
      if (previous) time += Math.min((now - previous) / 1000, 0.06);
      previous = now;
      const done = renderer.render("fxaa", time);
      if (!firstFrameSubmitted && done) {
        firstFrameSubmitted = true;
        void done.then(() => {
          if (!signal.aborted && !failed) setReady(true);
        });
      }
      schedule();
    }

    function schedule() {
      if (!eligible()) {
        cancelAnimationFrame(raf);
        raf = 0;
        previous = 0;
        return;
      }
      if (renderer) {
        if (!raf) raf = requestAnimationFrame(paint);
      } else if (!loading) {
        loading = true;
        void import("./footer-aa-renderer")
          .then(({ createFooterAaRenderer }) => createFooterAaRenderer(target, signal, fail))
          .then((next) => {
            if (signal.aborted || failed) next.dispose();
            else {
              renderer = next;
              schedule();
            }
          })
          .catch(fail);
      }
    }

    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      schedule();
    });
    const resize = new ResizeObserver(schedule);
    visibility.observe(stage);
    resize.observe(stage);
    window.addEventListener("resize", schedule, { signal });
    document.addEventListener("visibilitychange", schedule, { signal });
    motion.addEventListener("change", schedule, { signal });

    return () => {
      controller.abort();
      visibility.disconnect();
      resize.disconnect();
      cancelAnimationFrame(raf);
      renderer?.dispose();
    };
  }, []);

  return (
    <div ref={stageRef} className="footer-aa-stage" data-aa-ready={ready} aria-hidden="true">
      <canvas ref={canvasRef} className="footer-aa-canvas" />
    </div>
  );
}
