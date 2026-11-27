const role = ["Product-focused", "full-stack developer"] as const;

export const profile = {
  name: "Prithviraj Panda",
  role: role.join(" "),
  roleLines: role,
  location: "India",
  availability: "",
  email: "prithvi.new004@gmail.com",
  bookingUrl: "https://cal.com/prithviraj-panda-qtbcvw/30min",
  resumeUrl: "",
  photo: "",
  coords: { lat: 22.6, lon: 79 },
  offer:
    "I turn product ideas into clear, usable web experiences—from interface and data model to the workflows that make them useful.",
  tagline:
    "Full-stack product development with React, Next.js, TypeScript, and practical backend systems.",
  roles: ["product interfaces", "full-stack workflows", "browser-based tools", "ideas that ship"],
  aboutHeadline: "Thoughtful product engineering, from first interaction to the supporting system.",
  aboutBody:
    "I work across interface, application logic, data, and delivery. My best work starts with a real workflow, removes unnecessary complexity, and leaves behind a product people can understand and use.",
  currentlyBuilding: "product foundations, browser tools, and clearer ways to present real work.",
} as const;

export const github = {
  username: "prithvinew004",
  repos: ["GolfGives", "pdftoolkit", "devtoolkit"],
} as const;

export type ProjectStatus =
  | "deployed"
  | "assignment"
  | "prototype"
  | "in-progress"
  | "learning"
  | "fork"
  | "scaffold";

export type ProjectEvidence = {
  id: string;
  n: string;
  title: string;
  status: ProjectStatus;
  statusLabel: string;
  summary: string;
  contribution: string;
  capabilities: readonly string[];
  repoUrl?: string;
  liveUrl?: string;
  image: { src: string; alt: string };
  verifiedOn: string;
  excludedClaims: readonly string[];
  featured: boolean;
};

export const projects = [
  {
    id: "curoh-dr-raja",
    n: "01",
    title: "Curoh · Dr Raja Neuro Care",
    status: "deployed",
    statusLabel: "Published healthcare product work",
    summary:
      "A branded entry point for a clinical workspace that introduces secure access without exposing private patient or practice information.",
    contribution:
      "The public-facing experience combines clinic-specific branding, a focused sign-in path, and concise product context for prescriptions, notes, and follow-ups.",
    capabilities: ["Healthcare UX", "Branded authentication", "Responsive interface"],
    repoUrl: undefined,
    liveUrl: "https://dev.curoh.com/login/dr-raja-neuro-care",
    image: {
      src: "/projects/curoh-dr-raja.jpg",
      alt: "Curoh sign-in page for Dr Raja Neuro Care with clinic branding and secure workspace messaging",
    },
    verifiedOn: "2026-11-21",
    excludedClaims: ["clinical outcomes", "patient volume", "private workspace functionality"],
    featured: true,
  },
  {
    id: "digifrills",
    n: "02",
    title: "DigiFrills",
    status: "deployed",
    statusLabel: "Published organization website",
    summary:
      "A service-led company website for startup and SaaS audiences, structured around capabilities, project discovery, process, and direct enquiry.",
    contribution:
      "The public-facing implementation uses clear service positioning, a project showcase, and repeated booking paths to move visitors from overview to conversation.",
    capabilities: ["Service positioning", "Conversion paths", "Responsive interface"],
    repoUrl: undefined,
    liveUrl: "https://digifrills.in/",
    image: {
      src: "/projects/digifrills-home.jpg",
      alt: "DigiFrills homepage with its startup and SaaS service proposition and booking actions",
    },
    verifiedOn: "2026-11-21",
    excludedClaims: ["review count", "delivery volume", "delivery-time guarantee", "client outcomes"],
    featured: true,
  },
  {
    id: "navachis",
    n: "03",
    title: "Navachis IT Solutions",
    status: "deployed",
    statusLabel: "Published organization website",
    summary:
      "An enterprise technology website that organizes software products, services, industries, company information, and training into clear discovery paths.",
    contribution:
      "The public experience translates a broad catalogue—from ERP and HRMS to custom software and infrastructure—into a navigable business-focused presentation.",
    capabilities: ["Enterprise information architecture", "Service discovery", "Responsive interface"],
    repoUrl: undefined,
    liveUrl: "https://navachis.com/",
    image: {
      src: "/projects/navachis.jpg",
      alt: "Navachis IT Solutions homepage presenting its business-focused technology services",
    },
    verifiedOn: "2026-11-21",
    excludedClaims: ["business outcomes", "customer volume", "implementation ownership"],
    featured: true,
  },
  {
    id: "lomaa",
    n: "04",
    title: "LOMAA IT Solutions",
    status: "deployed",
    statusLabel: "Published organization website",
    summary:
      "A compact IT-services website that presents the company offer, core service categories, and contact routes in a direct marketing journey.",
    contribution:
      "The public-facing implementation balances visual identity with concise service discovery and accessible paths for prospective clients to start a conversation.",
    capabilities: ["Marketing UX", "Service discovery", "Contact pathways"],
    repoUrl: undefined,
    liveUrl: "https://lomaait.com/",
    image: {
      src: "/projects/lomaa.jpg",
      alt: "LOMAA IT Solutions homepage introducing its high-impact technology services",
    },
    verifiedOn: "2026-11-21",
    excludedClaims: ["ratings", "years in business", "client count", "business outcomes"],
    featured: true,
  },
] as const satisfies readonly ProjectEvidence[];

export const independentProjects = [
  {
    id: "golfgives",
    n: "05",
    title: "GolfGives",
    status: "assignment",
    statusLabel: "Full-stack assignment",
    summary:
      "A golf subscription demonstration that connects member scores, monthly draws, charity selection, subscriptions, and administrative review.",
    contribution:
      "The public implementation covers multi-role product flows, Supabase data and auth, Stripe checkout and webhooks, scheduled draws, proof review, and an admin workspace.",
    capabilities: ["Next.js", "TypeScript", "Supabase", "Stripe", "Product workflows"],
    repoUrl: "https://github.com/prithvinew004/GolfGives",
    liveUrl: "https://golf-gives-three.vercel.app/",
    image: {
      src: "/projects/golfgives.jpg",
      alt: "GolfGives landing page showing its golf and charitable giving proposition",
    },
    verifiedOn: "2026-11-21",
    excludedClaims: ["production usage", "real payment volume", "real charities", "business outcomes"],
    featured: false,
  },
  {
    id: "pdftoolkit",
    n: "06",
    title: "PDFToolkit",
    status: "deployed",
    statusLabel: "Deployed personal product",
    summary:
      "A browser-based workspace that organizes common PDF conversion, editing, compression, security, and utility tasks in one searchable product.",
    contribution:
      "The implementation demonstrates a broad tool catalogue, browser-oriented file workflows, clear category navigation, and a privacy-first product premise.",
    capabilities: ["Next.js", "TypeScript", "PDF.js", "pdf-lib", "Information architecture"],
    repoUrl: "https://github.com/prithvinew004/pdftoolkit",
    liveUrl: "https://pdftoolkit-khaki.vercel.app/",
    image: {
      src: "/projects/pdftoolkit.jpg",
      alt: "PDFToolkit homepage with its category navigation and popular PDF tools",
    },
    verifiedOn: "2026-11-21",
    excludedClaims: ["every listed operation validated", "lossless output", "universal local processing"],
    featured: false,
  },
  {
    id: "devtoolkit",
    n: "07",
    title: "DevToolkit",
    status: "deployed",
    statusLabel: "Deployed personal product",
    summary:
      "A focused collection of everyday developer, text, security, image, and utility tools designed for quick discovery and direct use.",
    contribution:
      "The public product demonstrates a compact multi-tool information architecture with visible JSON, UUID, word-count, password, and QR workflows.",
    capabilities: ["Next.js", "TypeScript", "Utility UX", "Content organization"],
    repoUrl: "https://github.com/prithvinew004/devtoolkit",
    liveUrl: "https://devtoolkit-delta.vercel.app/",
    image: {
      src: "/projects/devtoolkit.jpg",
      alt: "DevToolkit homepage showing its utility categories and popular tools",
    },
    verifiedOn: "2026-11-21",
    excludedClaims: ["usage volume", "community popularity", "security guarantees"],
    featured: false,
  },
] as const satisfies readonly ProjectEvidence[];

export const supportingProjects = [
  {
    id: "imagetoolkit",
    title: "ImageToolkit",
    status: "deployed" as const,
    statusLabel: "Supporting personal product",
    summary: "A deployed collection of image conversion, compression, editing, and utility workflows.",
    repoUrl: "https://github.com/prithvinew004/ImageToolkit",
    liveUrl: "https://image-toolkit-eight.vercel.app/",
    verifiedOn: "2026-11-21",
  },
] as const;

export const publicProjectCount =
  projects.length + independentProjects.length + supportingProjects.length;

export const capabilities = [
  {
    title: "Product interfaces",
    description: "Responsive, accessible interfaces organized around the job a visitor needs to complete.",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    evidenceProjectIds: ["curoh-dr-raja", "digifrills", "navachis", "lomaa"],
  },
  {
    title: "Full-stack workflows",
    description: "Data, authentication, payments, scheduled work, and administrative paths designed as one product flow.",
    skills: ["Supabase", "PostgreSQL", "Stripe", "API design"],
    evidenceProjectIds: ["curoh-dr-raja", "golfgives"],
  },
  {
    title: "Browser tools",
    description: "File and utility experiences that keep complex operations approachable and easy to find.",
    skills: ["PDF.js", "pdf-lib", "Client-side processing", "Information architecture"],
    evidenceProjectIds: ["pdftoolkit", "devtoolkit"],
  },
] as const;

export type ExperienceRecord = {
  organization: string;
  company: string;
  role: string;
  start: string;
  end: string;
  period: string;
  summary: string;
  blurb: string;
  publishable: boolean;
};

export const experience = [
  {
    organization: "DigiFrills",
    company: "DigiFrills",
    role: "Full Stack Engineer",
    start: "2024-10",
    end: "present",
    period: "Oct 2024 — Present",
    summary: "Role and public contribution require confirmation before publication.",
    blurb: "Role and public contribution require confirmation before publication.",
    publishable: false,
  },
  {
    organization: "LOMAA IT Solutions",
    company: "LOMAA IT Solutions",
    role: "Software Engineer",
    start: "2025-10",
    end: "2025-12",
    period: "Oct — Dec 2025",
    summary: "Role, dates, and public contribution require confirmation before publication.",
    blurb: "Role, dates, and public contribution require confirmation before publication.",
    publishable: false,
  },
  {
    organization: "Navachis IT Solutions",
    company: "Navachis IT Solutions",
    role: "Software Engineer",
    start: "2025-06",
    end: "2025-10",
    period: "Jun — Oct 2025",
    summary: "Role, dates, and public contribution require confirmation before publication.",
    blurb: "Role, dates, and public contribution require confirmation before publication.",
    publishable: false,
  },
] as const satisfies readonly ExperienceRecord[];

export const workingApproach = [
  {
    title: "Start with the workflow",
    body: "Define the real user path and the evidence it needs before choosing visual effects or abstractions.",
  },
  {
    title: "Build the smallest useful slice",
    body: "Connect interface, data, and edge cases early so the product can be evaluated as a whole.",
  },
  {
    title: "Polish what earns attention",
    body: "Use motion, detail, and performance work where they improve comprehension, feedback, or trust.",
  },
] as const;

export const experienceIntro = {
  heading: ["How I", "work"],
  blurb: "A product-minded process that moves from evidence and workflow to a tested, polished release.",
};

const order = [
  { id: "projects", label: "Work" },
  { id: "skills", label: "Capabilities" },
  { id: "experience", label: "Approach" },
  { id: "about", label: "About" },
  { id: "activity", label: "Activity" },
  { id: "contact", label: "Contact" },
];

export const sections = order.map((section, index) => ({
  ...section,
  n: String(index + 1).padStart(2, "0"),
}));

export const sectionN = (id: string) => sections.find((section) => section.id === id)?.n ?? "";

export const socials = [
  { label: "GitHub", href: "https://github.com/prithvinew004" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/prithviraj-panda-707621225/" },
  { label: "Discord", href: "https://discord.com/users/1068023960689717288" },
  { label: "Email", href: `mailto:${profile.email}` },
] as const;

export const contact = {
  heading: ["Have a product", "worth building?"],
  footerNote: "Built with evidence, restraint, and care.",
};
