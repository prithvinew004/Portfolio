"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { AaMode, FooterAaRenderer } from "./footer-aa-renderer";

const MODES = [
  ["off", "Off"],
  ["msaa", "MSAA 4×"],
  ["ssaa", "SSAA 2×"],
  ["fxaa", "FXAA"],
] as const satisfies readonly (readonly [AaMode, string])[];

export function FooterAntialiasing() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<() => void>(null);
  const modeRef = useRef<AaMode>("fxaa");
  const pausedRef = useRef(false);
  const labelId = useId();
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);

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
    let requestedMode: AaMode | undefined;
    let raf = 0;
    let previous = 0;
    let time = 0;
    const eligible = () => visible && !document.hidden && !motion.matches && !failed && !signal.aborted;

    function fail() {
      if (signal.aborted) return;
      failed = true;
      cancelAnimationFrame(raf);
      delete target.dataset.aaMode;
      setReady(false);
    }

    function paint(now: number) {
      raf = 0;
      if (!eligible() || !renderer) return;
      const rotating = !pausedRef.current;
      const selected = modeRef.current;
      const changed = selected !== requestedMode;
      if (rotating && previous) time += Math.min((now - previous) / 1000, 0.06);
      previous = rotating ? now : 0;
      const done = renderer.render(selected, time);
      if (changed && done) {
        requestedMode = selected;
        void done.then(() => {
          if (!signal.aborted && !failed && modeRef.current === selected) {
            target.dataset.aaMode = selected;
            setReady(true);
          }
        });
      }
      if (rotating) schedule();
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
    scheduleRef.current = schedule;

    return () => {
      controller.abort();
      scheduleRef.current = null;
      visibility.disconnect();
      resize.disconnect();
      cancelAnimationFrame(raf);
      renderer?.dispose();
    };
  }, []);

  return (
    <>
      <div ref={stageRef} className="footer-aa-stage" data-aa-ready={ready} aria-hidden="true">
        <canvas ref={canvasRef} className="footer-aa-canvas" />
      </div>
      <div className="footer-aa-controls flex items-center gap-2" data-aa-ready={ready}>
        <label htmlFor={labelId} className="sr-only">Anti-aliasing</label>
        <select
          id={labelId}
          className="min-h-11 max-w-full rounded-md border border-[var(--line)] bg-[var(--bg)] px-2 text-xs text-[var(--muted)]"
          defaultValue="fxaa"
          disabled={!ready}
          onChange={(event) => {
            const mode = MODES.find(([value]) => value === event.target.value);
            if (mode) {
              modeRef.current = mode[0];
              scheduleRef.current?.();
            }
          }}
        >
          {MODES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <button
          type="button"
          className="text-link grid size-11 place-items-center rounded-md border border-[var(--line)] bg-[var(--bg)] text-[var(--muted)]"
          aria-label={paused ? "Play footer animation" : "Pause footer animation"}
          disabled={!ready}
          onClick={() => {
            pausedRef.current = !pausedRef.current;
            setPaused(pausedRef.current);
            scheduleRef.current?.();
          }}
        >
          {paused ? <Play size={14} aria-hidden /> : <Pause size={14} aria-hidden />}
        </button>
      </div>
    </>
  );
}
