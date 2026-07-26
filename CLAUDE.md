Create a CLAUDE.md file with these project rules:

# Portfolio — Prithviraj Panda
- Next.js 15 App Router, TypeScript, Tailwind CSS v4, shadcn/ui on Radix
- Animation: Framer Motion for component/page animations, GSAP + ScrollTrigger
  for scroll-driven sections, Lenis for smooth scroll
- 3D: React Three Fiber + drei; Spline embeds allowed for hero scene
- Component sources: prefer Aceternity UI, Magic UI, React Bits, Animate UI,
  Skiper UI via their CLIs/registries before writing from scratch
- All animations must respect prefers-reduced-motion
- Mobile-first responsive; 3D scenes must degrade gracefully on mobile
  (static fallback or lighter scene)
- Dark theme primary with light mode toggle
- Target Lighthouse performance 90+; lazy-load all 3D below the fold
- Use next/font, next/image, dynamic imports for heavy components
- Content source of truth: content/resume.ts (never hardcode personal details in components)