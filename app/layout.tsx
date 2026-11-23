import type { Metadata } from "next";
import { Syne, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { profile, socials } from "@/content/resume";

// Keep the display face variable so all editorial heading weights share one font asset.
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-grotesk",
});

// Vercel injects VERCEL_PROJECT_PRODUCTION_URL at build time; set NEXT_PUBLIC_SITE_URL once you
// have a custom domain. metadataBase is what makes the OG and icon URLs absolute — without it
// social scrapers get relative paths and show no preview.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const title = `${profile.name} — ${profile.role}`;
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: siteUrl,
  jobTitle: profile.role,
  email: `mailto:${profile.email}`,
  sameAs: socials.filter(({ label }) => label !== "Email").map(({ href }) => href),
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s — ${profile.name}` },
  description: profile.offer,
  applicationName: profile.name,
  authors: [{ name: profile.name }],
  creator: profile.name,
  keywords: [profile.name, "full-stack developer", "Next.js developer", "TypeScript developer"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: profile.name,
    title,
    description: profile.offer,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description: profile.offer },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${grotesk.variable}`}>
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema).replace(/</g, "\\u003c") }}
        />
        <ScrollProgress className="z-[60] h-0.5 bg-none bg-[var(--accent)]" />
        <Nav />
        {children}
      </body>
    </html>
  );
}
