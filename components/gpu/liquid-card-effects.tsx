"use client";

import { useEffect } from "react";
import type { LiquidCardGroup, LiquidCardRenderer } from "./liquid-card-renderer";

export function LiquidCardEffects() {
  useEffect(() => {
    if (!navigator.gpu || !("IntersectionObserver" in window) || !("ResizeObserver" in window)) return;
    const groups: LiquidCardGroup[] = [];
    for (const host of document.querySelectorAll<HTMLElement>("[data-liquid-grid]")) {
      const canvas = host.querySelector("canvas.liquid-card-canvas");
      const cards = [...host.querySelectorAll<HTMLElement>("[data-liquid-card]")];
      if (canvas instanceof HTMLCanvasElement && cards.length) {
        groups.push({ host, canvas, cards, hovered: null, pointer: null, visible: false });
      }
    }
    if (!groups.length) return;

    const controller = new AbortController();
    const signal = controller.signal;
    const motion = matchMedia("(prefers-reduced-motion: reduce), (forced-colors: active)");
    let renderer: LiquidCardRenderer | undefined;
    let loading = false;
    let failed = false;
    let raf = 0;
    const eligible = () => !signal.aborted && !failed && !motion.matches && !document.hidden &&
      groups.some(({ visible }) => visible);

    function fallback() {
      for (const { host } of groups) delete host.dataset.liquidStatus;
    }
    function fail() {
      if (signal.aborted) return;
      failed = true;
      cancelAnimationFrame(raf);
      fallback();
    }
    function paint() {
      raf = 0;
      if (!eligible() || !renderer) return;
      let settling = false;
      for (const group of groups) {
        if (group.visible && renderer.render(group, schedule)) settling = true;
      }
      if (settling) schedule();
    }
    function schedule() {
      if (!eligible()) {
        cancelAnimationFrame(raf);
        raf = 0;
        return;
      }
      if (renderer) {
        if (!raf) raf = requestAnimationFrame(paint);
      } else if (!loading) {
        loading = true;
        void import("./liquid-card-renderer")
          .then(({ createLiquidCardRenderer }) => createLiquidCardRenderer(signal, fail))
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

    const visibility = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const group = groups.find(({ host }) => host === entry.target);
        if (group) group.visible = entry.isIntersecting;
      }
      schedule();
    });
    const resize = new ResizeObserver(schedule);

    for (const group of groups) {
      const { host } = group;
      visibility.observe(host);
      resize.observe(host);
      for (const card of group.cards) resize.observe(card);

      function highlight(target: EventTarget | null, pointer: LiquidCardGroup["pointer"]) {
        const card = target instanceof Element ? target.closest<HTMLElement>("[data-liquid-card]") : null;
        group.hovered = card;
        group.pointer = pointer;
        schedule();
      }
      host.addEventListener("pointermove", (event) => {
        if (event.pointerType === "mouse" || event.pointerType === "pen") {
          highlight(event.target, [event.clientX, event.clientY]);
        }
      }, { passive: true, signal });
      host.addEventListener("pointerleave", () => highlight(null, null), { signal });
      host.addEventListener("focusin", (event) => highlight(event.target, null), { signal });
      host.addEventListener("focusout", (event) => highlight(event.relatedTarget, null), { signal });
    }
    document.addEventListener("visibilitychange", schedule, { signal });
    motion.addEventListener("change", schedule, { signal });

    return () => {
      controller.abort();
      visibility.disconnect();
      resize.disconnect();
      cancelAnimationFrame(raf);
      renderer?.dispose();
      fallback();
    };
  }, []);

  return null;
}
