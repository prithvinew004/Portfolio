import type { Metadata } from "next";
import { Geist, Bricolage_Grotesque, Martian_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/animations/smooth-scroll";
import { Cursor } from "@/components/animations/cursor";
import { ThemeToggle } from "@/components/theme-toggle";
import { PageShell } from "@/components/page-shell";
import { profile } from "@/content/resume";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" });
const mono = Martian_Mono({ subsets: ["latin"], variable: "--font-mono" });

// Vercel injects VERCEL_PROJECT_PRODUCTION_URL at build time; set NEXT_PUBLIC_SITE_URL once you
// have a custom domain. metadataBase is what makes the OG and icon URLs absolute — without it
// social scrapers get relative paths and show no preview.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

// roles[0] is real content; profile.role is still a PLACEHOLDER, and it would otherwise show
// up in the browser tab and every social preview.
const title = `${profile.name} — ${profile.roles[0]}`;

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

// Dark is the default; only an explicit "light" choice opts out. Runs before paint, so no flash.
const themeInit = `try{if(localStorage.getItem("theme")!=="light")document.documentElement.classList.add("dark")}catch{document.documentElement.classList.add("dark")}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className={`${geist.variable} ${display.variable} ${mono.variable} font-sans`}>
        <Cursor />
        <div className="fixed right-5 top-5 z-50 sm:right-8 sm:top-8">
          <ThemeToggle />
        </div>
        <PageShell>
          <SmoothScroll>{children}</SmoothScroll>
        </PageShell>
      </body>
    </html>
  );
}
