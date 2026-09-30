import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import { LabOverlays } from "@/components/effects/LabOverlays";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/layout/Providers";
import { SkipLink } from "@/components/layout/SkipLink";
import { Toaster } from "@/components/layout/Toaster";
import { Navbar } from "@/components/navigation/Navbar";
import { RecruiterDock } from "@/components/recruiter-mode/RecruiterDock";
import { profile } from "@/content/profile";
import { site } from "@/content/site";
import { listPublicAssets } from "@/lib/assets";
import { preferenceScript } from "@/lib/utils/storage";
import "./globals.css";

const mono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  variable: "--font-jetbrains",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin", "vietnamese"],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s — ${site.shortTitle}` },
  description: site.description,
  keywords: [...site.keywords],
  authors: [{ name: profile.name, url: site.url }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: site.shortTitle,
    title: site.title,
    description: site.description,
    locale: "en_US",
    alternateLocale: ["vi_VN"],
    firstName: "Hiếu",
    lastName: "Đào",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0b0d",
  colorScheme: "dark light",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // data-theme / data-recruiter are owned by the inline preference script and the providers —
    // never rendered by React, so no re-render can reset them. CSS defaults to dark without them.
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${mono.variable} ${grotesk.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: preferenceScript }} />
      </head>
      <body>
        <Providers publicAssets={listPublicAssets()}>
          <SkipLink />
          <Navbar />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <RecruiterDock />
          <LabOverlays />
          <Toaster />
        </Providers>
        <noscript>
          <style>{".reveal{opacity:1!important;transform:none!important}"}</style>
        </noscript>
      </body>
    </html>
  );
}
