import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SkipLink } from "@/components/SkipLink";
import { ScrollToTop } from "@/components/ScrollToTop";

export const metadata: Metadata = {
  title: "Pillow Talk.",
  description: "Tempat menyimpan ide-ide yang lewat. Sekadar menulis supaya tidak lupa.",
  keywords: ["blog", "personal", "pillow talk", "ide", "indonesia"],
  authors: [{ name: "Author" }],
  openGraph: {
    title: "Pillow Talk.",
    description: "Tempat menyimpan ide-ide yang lewat.",
    type: "website",
    url: "https://manifesto.dev",
    siteName: "Pillow Talk",
  },
  alternates: {
    types: {
      'application/rss+xml': 'https://manifesto.dev/rss',
    },
  },
};

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
          <SkipLink />
          <ScrollToTop />
          <Header />
          <main id="main-content" className="main-content-padding" style={{ flex: 1 }}>
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
