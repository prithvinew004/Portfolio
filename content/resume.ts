// Single source of truth for all copy. Content below comes from the Claude Design handoff
// (Prithviraj Portfolio.dc.html) unless noted.

export const profile = {
  name: "Prithviraj Panda",
  role: "Full-Stack Software Engineer",
  location: "India",
  availability: "Available for opportunities · India",
  // Handles confirmed by the user; the design's placeholder links and hello@ address are not used.
  email: "prithvi.new004@gmail.com",
  // TODO(prithviraj): drop a PDF at public/resume.pdf and set this to "/resume.pdf".
  // Left empty on purpose — the command palette hides "Download resume" while it is, rather
  // than offering a link that 404s.
  resumeUrl: "",
  // TODO(prithviraj): drop a portrait at public/prithviraj.jpg and set this to "/prithviraj.jpg".
  // Empty hides the About portrait rather than rendering a broken image. LinkedIn's photo can't be
  // fetched from the public profile (it sits behind the auth wall), so it has to be saved by hand.
  photo: "",
  /** Where the contact globe parks its marker. Centre of India until there's a city to pin. */
  coords: { lat: 22.6, lon: 79 },
  tagline:
    "Full-stack software engineer with 1.5+ years shipping SaaS products end to end — Next.js and React up front, Node and TypeScript underneath.",
  // Cycled after "I build" in the hero.
  roles: [
    "Full-Stack SaaS products",
    "Next.js + React frontends",
    "Node & TypeScript APIs",
    "things that ship",
  ],
  aboutHeadline:
    "I turn ideas into shipped product — fast interfaces, clean APIs, and the small details that make software feel alive.",
  aboutBody:
    "Since 2024 I've been building SaaS products across the whole stack: designing schemas, wiring auth, tuning queries, and obsessing over the last 10% of the UI. I like small teams, quick iterations, and owning features from first sketch to production.",
  /** Shown beside the pulsing dot in the Activity section. Keep it to one line and present tense. */
  currentlyBuilding: "a charity subscription platform for golf clubs, and a set of browser-side developer toolkits.",
};

export const github = {
  username: "prithvinew004",
  /**
   * Which repos get cards. Curated on purpose, not read from GitHub's "pinned" list: the pins on
   * the profile are still the 2024 learning projects (PIG-GAME, CALCULATOR-, IOS-Calculator),
   * and sorting by stars is no better on an account with one star total. Everything *shown* on
   * the cards — description, language, stars — is fetched live; only this selection is fixed.
   *
   * Repin on github.com and this list can just mirror the new pins.
   */
  repos: ["GolfGives", "pdftoolkit", "devtoolkit"],
} as const;

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
  /** Where the quote can be checked — a LinkedIn recommendation, usually. */
  href?: string;
};

/**
 * Real quotes only — a portfolio with invented praise costs more than one with none. While this is
 * empty the section and its nav entry don't render at all.
 */
export const testimonials: Testimonial[] = [];

const order = [
  { id: "about", label: "About" },
  { id: "skills", label: "Stack" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Work" },
  ...(testimonials.length ? [{ id: "testimonials", label: "Kind words" }] : []),
  { id: "activity", label: "Activity" },
  { id: "contact", label: "Contact" },
];

/** Drives the navbar, the palette and every section eyebrow, so none of them can drift apart. */
export const sections = order.map((s, i) => ({ ...s, n: String(i + 1).padStart(2, "0") }));

/** The eyebrow number for a section id, derived from its position in `sections`. */
export const sectionN = (id: string) => sections.find((s) => s.id === id)?.n ?? "";

export const socials = [
  { label: "GitHub", href: "https://github.com/prithvinew004" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/prithviraj-panda-707621225/" },
  { label: "Email", href: `mailto:${profile.email}` },
] as const;

/** `wide` spans two of the three columns. Order matters: it's what makes the rows tile. */
export const skills = [
  {
    group: "Frontend",
    blurb: "Interfaces that feel instant",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    wide: true,
  },
  { group: "Backend", blurb: "APIs built to scale", items: ["Node.js", "Express", "FastAPI"] },
  {
    group: "Databases",
    blurb: "Data modelled properly",
    items: ["MongoDB", "PostgreSQL", "Supabase", "Prisma"],
  },
  { group: "Mobile", blurb: "One codebase, every screen", items: ["Flutter", "Ionic"], wide: true },
] as const;

export const marqueeStack = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Tailwind",
  "Express",
  "FastAPI",
  "MongoDB",
  "PostgreSQL",
  "Supabase",
  "Prisma",
  "Flutter",
  "Ionic",
] as const;

export const experienceIntro = {
  heading: ["Where I've", "worked"],
  blurb: "Startups and IT consultancies — always close to the product, always shipping.",
};

// TODO(prithviraj): these date ranges don't reconcile — DigiFrills runs Oct 2024 to Present, but
// LOMAA (Oct–Dec 2025) and Navachis (Jun–Oct 2025) both fall inside it. Confirm before publishing.
// Stored as display strings because the design writes them that way, not as sortable dates.
export const experience = [
  {
    company: "DigiFrills",
    role: "Full Stack Engineer",
    period: "Oct 2024 — Present",
    blurb:
      "Building and shipping SaaS features end to end — Next.js frontends, Node services, Prisma data layers — with ownership from spec to deploy.",
  },
  {
    company: "LOMAA IT Solutions",
    role: "Software Engineer",
    period: "Oct — Dec 2025",
    blurb:
      "Delivered client-facing web modules and REST integrations on tight timelines, working across React frontends and Express backends.",
  },
  {
    company: "Navachis IT Solutions",
    role: "Software Engineer",
    period: "Jun — Oct 2025",
    blurb:
      "Built cross-platform app screens and FastAPI endpoints, and hardened auth flows across mobile and web clients.",
  },
] as const;

// `media` is the placeholder caption the design shows in the card's image band. Swap it for a real
// image once there is one; `href` currently points at contact, as drawn.
export const projects = [
  {
    n: "01",
    title: "SaaS MVP",
    blurb:
      "Idea to launch: multi-tenant SaaS with auth, billing-ready schema, and a dashboard users actually enjoy.",
    stack: ["Next.js", "Prisma", "Supabase"],
    media: "[ product screenshot ]",
    href: "#contact",
  },
  {
    n: "02",
    title: "REST API Platform",
    blurb:
      "Production-grade API with JWT auth, role-based access, rate limiting, and clean, versioned endpoints.",
    stack: ["Node.js", "Express", "MongoDB", "JWT"],
    media: "[ API docs / console ]",
    href: "#contact",
  },
  {
    n: "03",
    title: "Cross-Platform App",
    blurb:
      "One product, every device — hybrid mobile app backed by a fast FastAPI service and shared design system.",
    stack: ["Ionic", "Angular", "Flutter", "FastAPI"],
    media: "[ mobile screens ]",
    href: "#contact",
  },
] as const;

export const contact = {
  heading: ["Let's build", "something"],
  footerNote: "Designed & built by me — obviously",
};
