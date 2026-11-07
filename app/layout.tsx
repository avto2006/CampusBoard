import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Noto_Sans_Georgian } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Analytics } from "@vercel/analytics/react"

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Noto_Sans_Georgian({ subsets: ["latin", "georgian"], variable: "--font-body", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://campusboard.ge";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "CampusBoard — Student events & teammates in Georgia", template: "%s | CampusBoard" },
  description: "Hackathons, workshops, exchange programs and internships from Georgian universities in one feed, plus a board to find teammates.",
  openGraph: {
    type: "website",
    siteName: "CampusBoard",
    title: "CampusBoard — Student events & teammates in Georgia",
    description: "One feed for university events. One board to find your team.",
    url: siteUrl,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F6FA" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0F1A" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${body.variable}`}>
      <body className="flex min-h-dvh flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased">
        <ThemeProvider>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">
            Skip to content
          </a>
          <Navbar />
          <main id="main" className="w-full flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
        {/* Vercel Analytics კომპონენტი */}
        <Analytics />
      </body>
    </html>
  );
}   