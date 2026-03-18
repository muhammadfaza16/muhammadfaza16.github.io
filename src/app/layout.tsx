import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SkipLink } from "@/components/SkipLink";
import { KonamiCode } from "@/components/KonamiCode";
import { FloatingZenToggle } from "@/components/FloatingZenToggle";

import { AudioProvider } from "@/components/AudioContext";
import { LiveMusicProvider } from "@/components/live/LiveMusicContext";

import prisma from "@/lib/prisma";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { ZenProvider } from "@/components/ZenContext";

import { Playfair_Display, Inter, Space_Mono, Outfit } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const interSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

import NextTopLoader from 'nextjs-toploader';

export default async function RootLayout({
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

  let initialSongs: { title: string; audioUrl: string }[] = [];
  try {
    const songs = await prisma.song.findMany({
      orderBy: { title: 'asc' },
      select: { title: true, audioUrl: true }
    });
    initialSongs = songs;
  } catch (error) {
    console.error("Prisma connection error in layout.tsx:", error);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const path = window.location.pathname;
                  const theme = localStorage.getItem('theme');
                  const isCuration = path.startsWith('/curation');
                  
                  if (!isCuration || !theme || theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${playfair.variable} ${outfit.variable} ${interSans.variable} ${spaceMono.variable}`}
        style={{ minHeight: "100svh", display: "flex", flexDirection: "column" }}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextTopLoader color="#E5E5E5" showSpinner={false} height={2} shadow="0 0 10px #E5E5E5,0 0 5px #E5E5E5" />
        <ThemeProvider>
            <AudioProvider initialSongs={initialSongs}>
                <LiveMusicProvider>
                  <ZenProvider>
                    <SkipLink />
                    <KonamiCode />
                    <FloatingZenToggle />

                    <LayoutShell>
                      {children}
                    </LayoutShell>
                  </ZenProvider>
                </LiveMusicProvider>
            </AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
