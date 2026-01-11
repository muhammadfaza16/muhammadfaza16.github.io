import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SkipLink } from "@/components/SkipLink";
import { ScrollToTop } from "@/components/ScrollToTop";
import { KonamiCode } from "@/components/KonamiCode";

export const metadata: Metadata = {
  title: "The Almanac of Broken Wanderer.",
  description: "Tempat menyimpan ide-ide yang lewat. Sekadar menulis supaya tidak lupa.",
  keywords: ["blog", "personal", "yapping", "random thoughts", "indonesia"],
  authors: [{ name: "Author" }],
  openGraph: {
    title: "The Almanac of Broken Wanderer.",
    description: "Tempat menyimpan ide-ide yang lewat.",
    type: "website",
    url: "https://manifesto.dev",
    siteName: "The Almanac of Broken Wanderer",
  },
  alternates: {
    types: {
      'application/rss+xml': 'https://manifesto.dev/rss',
    },
  },
};

import { ZenProvider } from "@/components/ZenContext";

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
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <ZenProvider>
            <SkipLink />
            <ScrollToTop />
            <KonamiCode />
            <Header />
            <main id="main-content" className="main-content-padding" style={{ flex: 1 }}>
              {children}
            </main>
            <Footer />
          </ZenProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
