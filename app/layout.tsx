import type { Metadata } from "next";
import { Syne, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/animations/smooth-scroll";
import { Cursor } from "@/components/animations/cursor";
import { Grain } from "@/components/ui/grain";
import { PageShell } from "@/components/page-shell";
import { Nav } from "@/components/nav";
import { CommandPalette } from "@/components/command-palette";
import { profile } from "@/content/resume";

// No `weight`: that pins static instances, and the hero's weight ramp needs the wght axis to
// interpolate. Omitting it makes next/font fetch the variable font, which also serves 700/800.
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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s — ${profile.name}` },
  description: profile.tagline,
  applicationName: profile.name,
  authors: [{ name: profile.name }],
  creator: profile.name,
  keywords: [profile.name, ...profile.roles],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: profile.name,
    title,
    description: profile.tagline,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description: profile.tagline },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${grotesk.variable}`}>
      <body className="font-sans">
        <Grain />
        <Cursor />
        <PageShell>
          <Nav />
          <CommandPalette />
          <SmoothScroll>{children}</SmoothScroll>
        </PageShell>
      </body>
    </html>
  );
}
