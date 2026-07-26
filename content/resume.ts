// Single source of truth for all personal content. Never hardcode these in components.
// TODO(prithviraj): resume text was not supplied — replace every PLACEHOLDER below.

export const profile = {
  name: "Prithviraj Panda",
  role: "PLACEHOLDER — e.g. Full-Stack Engineer",
  location: "PLACEHOLDER — City, Country",
  email: "sandralili26@outlook.com",
  phone: "",
  tagline: "PLACEHOLDER — one line that sits under the hero headline.",
  // Cycled by the hero's word-rotate. Keep them a similar length so the line doesn't jump.
  roles: ["Full-Stack Engineer", "Next.js Developer", "SaaS Builder"],
  // Revealed word-by-word on scroll, so length matters: aim for 45–70 words. Under ~30 the reveal
  // finishes before the section is halfway up the viewport and the effect is lost.
  about:
    "PLACEHOLDER — I build products end to end, from the schema up to the last pixel. Most of my work lives in the space between a design that has to feel effortless and a backend that has to stay boring under load. I care about the parts users never see: the migration that ran clean, the query that stopped timing out, the deploy nobody noticed.",
  resumeUrl: "/resume.pdf",
  availableForWork: true,
};

// Rendered as label + handle rather than brand icons: simple-icons dropped the LinkedIn mark and
// lucide dropped brand icons entirely, so one real logo beside two improvised ones would look off.
export const socials = [
  { label: "GitHub", handle: "prithvinew004", href: "https://github.com/prithvinew004" },
  { label: "LinkedIn", handle: "prithvirajpanda", href: "https://www.linkedin.com/in/prithvirajpanda" },
  // TODO(prithviraj): confirm this is the address you want public — it came from the environment.
  { label: "Email", handle: profile.email, href: `mailto:${profile.email}` },
] as const;

// TODO(prithviraj): these are inferred from the roles above, not from a resume — confirm or swap.
// Card sizing is layout, so it lives in the Skills component, derived from array order.
// `logo` keys into content/logos.ts; a tech with no logo there renders as a plain wordmark.
export const skills = [
  {
    group: "Frontend",
    blurb: "Interfaces that stay fast once real data shows up.",
    items: [
      { name: "React", logo: "react" },
      { name: "Next.js", logo: "nextdotjs" },
      { name: "TypeScript", logo: "typescript" },
      { name: "Tailwind CSS", logo: "tailwindcss" },
    ],
  },
  {
    group: "Backend",
    blurb: "APIs that stay boring under load.",
    items: [
      { name: "Node.js", logo: "nodedotjs" },
      { name: "GraphQL", logo: "graphql" },
      { name: "REST" },
      { name: "tRPC" },
    ],
  },
  {
    group: "Databases",
    blurb: "Schemas designed before the first query.",
    items: [
      { name: "PostgreSQL", logo: "postgresql" },
      { name: "MongoDB", logo: "mongodb" },
      { name: "Redis", logo: "redis" },
      { name: "Prisma", logo: "prisma" },
    ],
  },
  {
    group: "Mobile",
    blurb: "One codebase, two stores.",
    items: [
      { name: "React Native", logo: "react" },
      { name: "Expo", logo: "expo" },
    ],
  },
  {
    group: "DevOps",
    blurb: "Deploys nobody has to think about.",
    items: [
      { name: "Docker", logo: "docker" },
      { name: "Vercel", logo: "vercel" },
      { name: "Git", logo: "git" },
      { name: "CI/CD" },
    ],
  },
] as const;

/** Order the marquee runs in. Slugs must exist in content/logos.ts. */
export const stackMarquee = [
  "react",
  "nextdotjs",
  "typescript",
  "tailwindcss",
  "nodedotjs",
  "graphql",
  "postgresql",
  "prisma",
  "mongodb",
  "redis",
  "docker",
  "vercel",
  "expo",
  "git",
] as const;

// Company names are real; every role, date and bullet below is still PLACEHOLDER.
// The timeline renders exactly three bullets per entry — keep `highlights` at three, and keep them
// short (roughly under 110 characters) or the pinned cards outgrow the viewport.
export const experience = [
  {
    company: "DigiFrills",
    role: "PLACEHOLDER — Title",
    start: "2025-01",
    end: null, // null renders as "Present"
    location: "PLACEHOLDER",
    href: "",
    highlights: [
      "PLACEHOLDER — impact-first bullet with a number in it.",
      "PLACEHOLDER — what you built and what it changed.",
      "PLACEHOLDER — scope, ownership, or a result you can defend.",
    ],
    stack: ["Next.js", "TypeScript"],
  },
  {
    company: "LOMAA",
    role: "PLACEHOLDER — Title",
    start: "2024-01",
    end: "2024-12",
    location: "PLACEHOLDER",
    href: "",
    highlights: [
      "PLACEHOLDER — impact-first bullet with a number in it.",
      "PLACEHOLDER — what you built and what it changed.",
      "PLACEHOLDER — scope, ownership, or a result you can defend.",
    ],
    stack: ["React", "Node.js"],
  },
  {
    company: "Navachis",
    role: "PLACEHOLDER — Title",
    start: "2023-01",
    end: "2023-12",
    location: "PLACEHOLDER",
    href: "",
    highlights: [
      "PLACEHOLDER — impact-first bullet with a number in it.",
      "PLACEHOLDER — what you built and what it changed.",
      "PLACEHOLDER — scope, ownership, or a result you can defend.",
    ],
    stack: ["React", "PostgreSQL"],
  },
] as const;

// TODO(prithviraj): no project details were supplied — every title, summary and link is PLACEHOLDER.
// `summary` is always on the card; `details` is what the hover state reveals, so keep it to one or
// two short sentences. An empty `repo` hides the GitHub link rather than rendering a dead one.
export const projects = [
  {
    slug: "project-one",
    title: "PLACEHOLDER — Project One",
    year: "2025",
    summary: "PLACEHOLDER — one sentence on what it does and who it is for.",
    details: "PLACEHOLDER — the part worth bragging about: the hard problem, or the number it moved.",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
    links: { live: "", repo: "https://github.com/PLACEHOLDER/project-one" },
  },
  {
    slug: "project-two",
    title: "PLACEHOLDER — Project Two",
    year: "2024",
    summary: "PLACEHOLDER — one sentence on what it does and who it is for.",
    details: "PLACEHOLDER — the part worth bragging about: the hard problem, or the number it moved.",
    stack: ["React", "Node.js", "Redis", "Docker"],
    links: { live: "", repo: "https://github.com/PLACEHOLDER/project-two" },
  },
  {
    slug: "project-three",
    title: "PLACEHOLDER — Project Three",
    year: "2024",
    summary: "PLACEHOLDER — one sentence on what it does and who it is for.",
    details: "PLACEHOLDER — the part worth bragging about: the hard problem, or the number it moved.",
    stack: ["React Native", "Expo", "GraphQL"],
    links: { live: "", repo: "https://github.com/PLACEHOLDER/project-three" },
  },
] as const;

export const education = [
  {
    school: "PLACEHOLDER University",
    degree: "PLACEHOLDER Degree",
    start: "2020",
    end: "2024",
    detail: "",
  },
] as const;

export const navigation = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
] as const;

export const resume = {
  profile,
  socials,
  skills,
  experience,
  projects,
  education,
  navigation,
};

export type Profile = typeof profile;
export type Experience = (typeof experience)[number];
export type Project = (typeof projects)[number];
export type Education = (typeof education)[number];
