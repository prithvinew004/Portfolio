// Static film grain over the whole page. Inline SVG turbulence rather than a raster tile: it costs
// no request and no bytes beyond this string.
const NOISE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)'/%3E%3C/svg%3E";

export function Grain() {
  return (
    <div
      aria-hidden
      // inset-0, not the design's inset:-50%: the noise is a repeating background so it never
      // shows an edge anyway, and a 780px-wide fixed layer added ~49px of horizontal scroll on a
      // 390px screen.
      className="pointer-events-none fixed inset-0 z-[60] opacity-[0.055]"
      style={{ backgroundImage: `url("${NOISE}")` }}
    />
  );
}
