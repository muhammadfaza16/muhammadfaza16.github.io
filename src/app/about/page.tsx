import { Container } from "@/components/Container";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About | The Almanac of Broken Wanderer",
    description: "Sedikit cerita tentang siapa saya dan apa yang saya kerjakan.",
};

export default function AboutPage() {
    return (
        <Container>
            <div className="animate-fade-in-up" style={{ maxWidth: "45rem", marginTop: "2rem", marginBottom: "6rem" }}>

                {/* Header */}
                <header style={{ marginBottom: "4rem" }}>
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                        fontWeight: 700,
                        marginBottom: "1.5rem",
                        color: "var(--foreground)"
                    }}>
                        About Me
                    </h1>
                    <p style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "1.1rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.6
                    }}>
                        Software Engineer, Thinker, & Occasional Philosopher.
                    </p>
                </header>

                {/* Content */}
                <div className="prose" style={{
                    color: "var(--foreground)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "1.05rem",
                    lineHeight: 1.8
                }}>
                    <p>
                        Halo! Selamat datang di sudut kecil saya di internet.
                    </p>
                    <p>
                        Saya adalah seorang pengembang perangkat lunak yang memiliki ketertarikan mendalam pada bagaimana teknologi membentuk cara kita berpikir dan hidup.
                        Di sela-sela menulis kode, saya sering menghabiskan waktu merenungkan hal-hal absurd, membaca buku-buku lama, dan mencoba memahami dunia yang semakin kompleks ini.
                    </p>
                    <p>
                        Blog ini, <em>The Almanac of Broken Wanderer</em>, adalah arsip digital dari segala hal yang melintas di kepala saya. Mulai dari catatan teknis, esai filosofis pendek, hingga curhatan yang mungkin tidak seharusnya dipublikasikan.
                    </p>

                    <h3 style={{ fontFamily: "'Playfair Display', serif", marginTop: "3rem", fontSize: "1.75rem" }}>
                        More About Me
                    </h3>

                    <ul style={{ listStyle: "none", padding: 0, marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <li>
                            <Link href="/now" className="link-underline" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <span style={{ fontSize: "1.25rem" }}>⚡</span>
                                <div>
                                    <strong>Now</strong>
                                    <span style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                                        Apa yang sedang menjadi fokus saya saat ini?
                                    </span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/uses" className="link-underline" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <span style={{ fontSize: "1.25rem" }}>🛠️</span>
                                <div>
                                    <strong>Uses</strong>
                                    <span style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                                        Tools, hardware, dan software yang saya gunakan sehari-hari.
                                    </span>
                                </div>
                            </Link>
                        </li>
                    </ul>

                    <div style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid var(--border)" }}>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", marginBottom: "1rem" }}>Let's Connect</h3>
                        <p>
                            Saya selalu terbuka untuk diskusi menarik. Anda bisa menemukan saya di <a href="https://twitter.com/muhammadfaza16" target="_blank" rel="noopener noreferrer" className="link-underline">Twitter/X</a> atau <a href="https://github.com/muhammadfaza16" target="_blank" rel="noopener noreferrer" className="link-underline">GitHub</a>.
                        </p>
                    </div>

                </div>
            </div>
        </Container>
    );
}
