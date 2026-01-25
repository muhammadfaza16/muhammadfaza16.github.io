import type { Metadata } from "next";
import "./globals.css";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SkipLink } from "@/components/SkipLink";
import { KonamiCode } from "@/components/KonamiCode";
import { FloatingZenToggle } from "@/components/FloatingZenToggle";
import { NativeBrowserGuard } from "@/components/NativeBrowserGuard";
import { AudioProvider } from "@/components/AudioContext";
import { NarrativeProvider } from "@/components/NarrativeContext";

export const metadata: Metadata = {
  title: "The Almanack of Broken Wanderer.",
  description: "Tempat menyimpan ide-ide yang lewat. Sekadar menulis supaya tidak lupa.",
  keywords: ["blog", "personal", "yapping", "random thoughts", "indonesia"],
  authors: [{ name: "Author" }],
  openGraph: {
    title: "The Almanack of Broken Wanderer.",
    description: "Tempat menyimpan ide-ide yang lewat.",
    type: "website",
    url: "https://manifesto.dev",
    siteName: "The Almanack of Broken Wanderer",
  },
  alternates: {
    types: {
      'application/rss+xml': 'https://manifesto.dev/rss',
    },
  },
};

import { ZenProvider } from "@/components/ZenContext";

import { Playfair_Display, Source_Serif_4, Space_Mono } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-sans", // We use Serif as primary 'sans' role in this design system
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Author Name",
    url: "https://manifesto.dev",
    sameAs: [
      "https://twitter.com/username",
      "https://github.com/username",
      "https://linkedin.com/in/username"
    ],
    jobTitle: "Software Engineer",
    description: "Writer and developer exploring digital craftsmanship."
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${sourceSerif.variable} ${spaceMono.variable}`}
        style={{ minHeight: "100svh", display: "flex", flexDirection: "column" }}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <NarrativeProvider>
            <AudioProvider>
              <ZenProvider>
                <SkipLink />
                <KonamiCode />
                <KonamiCode />
                <FloatingZenToggle />
                <NativeBrowserGuard />
                <LayoutShell>
                  {children}
                </LayoutShell>
              </ZenProvider>
            </AudioProvider>
          </NarrativeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
