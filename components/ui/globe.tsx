"use client";

import { useEffect, useRef } from "react";
import { geoDistance, geoGraticule10, geoOrthographic, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import land110 from "world-atlas/land-110m.json";
import { useReducedMotion } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

const SIZE = 400; // viewBox units; the svg scales with its container
const SPEED = 0.008; // degrees of longitude per ms — one turn in 45s
const DRAG = 0.35; // degrees per viewBox unit dragged

// Coastlines only (55KB), not country borders (108KB): at this size borders read as noise.
const topo = land110 as unknown as Topology;
const land = feature(topo, topo.objects.land as GeometryCollection);
const graticule = geoGraticule10();

/**
 * Wireframe globe that turns slowly with a marker pinned at `lat`/`lon`, and can be dragged.
 *
 * Paths are written straight to the DOM from a rAF loop. Rotation changes every frame and nothing
 * else depends on it, so routing it through React state would be a render per frame for no reason.
 * The loop only runs while the globe is on screen, and not at all under reduced motion — dragging
 * still works there, because the visitor asked for that movement.
 */
export function Globe({
  lat,
  lon,
  label,
  className,
}: {
  lat: number;
  lon: number;
  label: string;
  className?: string;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const grat = useRef<SVGPathElement>(null);
  const landEl = useRef<SVGPathElement>(null);
  const marker = useRef<SVGGElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = svg.current!;
    const projection = geoOrthographic()
      .scale(SIZE / 2 - 3)
      .translate([SIZE / 2, SIZE / 2])
      .clipAngle(90);
    const path = geoPath(projection);
    // Start facing the marker.
    let rot: [number, number] = [-lon, -lat];
    let dragging = false;

    const draw = () => {
      projection.rotate(rot);
      grat.current!.setAttribute("d", path(graticule) ?? "");
      landEl.current!.setAttribute("d", path(land) ?? "");
      const p = projection([lon, lat]);
      // Fade the marker over the last ~15° before the limb instead of popping at it.
      const edge = Math.PI / 2 - geoDistance([lon, lat], [-rot[0], -rot[1]]);
      const m = marker.current!;
      m.style.opacity = String(Math.max(0, Math.min(1, edge / 0.26)));
      if (p) m.setAttribute("transform", `translate(${p[0]} ${p[1]})`);
    };
    draw();

    let frame = 0;
    let last = 0;
    const tick = (now: number) => {
      if (last && !dragging) {
        rot = [(rot[0] + SPEED * (now - last)) % 360, rot[1]];
        draw();
      }
      last = now;
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (frame || reduced) return;
      last = 0;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    // Only spin on screen: a rAF loop for a globe below the fold is battery spent on nothing.
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), {
      threshold: 0.05,
    });
    io.observe(el);

    // Pointer events cover mouse and touch alike; `touch-pan-y` on the svg leaves vertical
    // scrolling to the browser, so only a sideways swipe turns the globe.
    let px = 0;
    let py = 0;
    const down = (e: PointerEvent) => {
      dragging = true;
      px = e.clientX;
      py = e.clientY;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const k = DRAG * (SIZE / el.getBoundingClientRect().width);
      rot = [
        rot[0] + (e.clientX - px) * k,
        Math.max(-90, Math.min(90, rot[1] - (e.clientY - py) * k)),
      ];
      px = e.clientX;
      py = e.clientY;
      draw();
    };
    const up = () => {
      dragging = false;
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);

    return () => {
      stop();
      io.disconnect();
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [lat, lon, reduced]);

  return (
    <svg
      ref={svg}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="img"
      aria-label={label}
      className={cn("size-full touch-pan-y select-none animate-[riseUp_1s_var(--ease)_both]", className)}
    >
      <defs>
        <radialGradient id="globe-fill" cx="38%" cy="32%" r="70%">
          <stop offset="0" style={{ stopColor: "var(--ac)", stopOpacity: 0.14 }} />
          <stop offset="1" style={{ stopColor: "var(--ac)", stopOpacity: 0.02 }} />
        </radialGradient>
      </defs>
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={SIZE / 2 - 3}
        fill="url(#globe-fill)"
        stroke="currentColor"
        strokeOpacity={0.3}
      />
      <path ref={grat} fill="none" stroke="currentColor" strokeOpacity={0.1} strokeWidth={0.6} />
      <path
        ref={landEl}
        fill="currentColor"
        fillOpacity={0.06}
        stroke="currentColor"
        strokeOpacity={0.6}
        strokeWidth={0.8}
      />
      <g ref={marker} data-marker style={{ opacity: 0 }}>
        <circle r={5} className="globe-ping fill-ac" />
        <circle r={4.5} className="fill-ac" />
      </g>
    </svg>
  );
}
