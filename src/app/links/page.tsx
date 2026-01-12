import { Container } from "@/components/Container";
import { Disclaimer } from "@/components/Disclaimer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Links | The Almanac of Broken Wanderer",
    description: "Koleksi resource, tools, dan bacaan menarik.",
};

const categories = [
    {
        name: "Engineering",
        description: "Hard skill, software architecture, dan best practices.",
        links: [
            { title: "Patterns.dev", url: "https://patterns.dev", description: "Design patterns & component patterns for building web apps.", author: "Addy Osmani et al." },
            { title: "Three.js Journey", url: "https://threejs-journey.com", description: "Course paling comprehensive buat belajar WebGL & 3D web.", author: "Bruno Simon" },
            { title: "Refactoring Guru", url: "https://refactoring.guru", description: "Visual guide buat design patterns. Gambarnya lucu tapi materinya daging semua.", author: "Alexander Shvets" },
        ]
    },
    {
        name: "Design & UX",
        description: "Eye training dan understanding user philosophy.",
        links: [
            { title: "Laws of UX", url: "https://lawsofux.com", description: "Kumpulan prinsip psikologi yang ngaruh ke UI/UX.", author: "Jon Yablonski" },
            { title: "Mobbin", url: "https://mobbin.com", description: "Library screenshot mobile apps. Sering dipake buat nyari referensi flow.", author: "Mobbin" },
        ]
    },
    {
        name: "Readings",
        description: "Thinking tools dan mental models.",
        links: [
            { title: "Paul Graham Essays", url: "http://paulgraham.com/articles.html", description: "Classic. Kalau lagi buntu karir atau startup, baca ini.", author: "Paul Graham" },
            { title: "TheBrowser", url: "https://thebrowser.com", description: "Kurasi artikel harian. Worth every penny buat subscripton-nya.", author: "Robert Cottrell" },
        ]
    }
];

export default function LinksPage() {
    return (
        <section style={{ paddingTop: "15vh", paddingBottom: "10rem" }}>
            <Container>
                <div className="animate-fade-in" style={{ maxWidth: "60rem", margin: "0 auto" }}>

                    <header style={{ marginBottom: "6rem", textAlign: "center" }}>
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(3.5rem, 8vw, 6rem)",
                            fontWeight: 700,
                            letterSpacing: "-0.02em",
                            lineHeight: 1,
                            marginBottom: "2rem",
                            color: "var(--foreground)"
                        }}>
                            Links.
                        </h1>
                        <p style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "1.25rem",
                            lineHeight: 1.6,
                            color: "var(--text-secondary)",
                            maxWidth: "40rem",
                            margin: "0 auto",
                            fontStyle: "italic"
                        }}>
                            Resource pilihan yang sering gue visit. Dari dev tools sampai artikel mind-blowing.
                        </p>
                    </header>

                    <div className="mb-16">
                        <Disclaimer>
                            Koleksi ini dikurasi secara manual. Tidak ada affiliate links.
                        </Disclaimer>
                    </div>

                    {/* Links List */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6rem" }}>
                        {categories.map((category) => (
                            <section key={category.name}>
                                <div style={{
                                    marginBottom: "3rem",
                                    borderBottom: "1px solid var(--border)",
                                    paddingBottom: "1rem"
                                }}>
                                    <h2 style={{
                                        fontFamily: "'Playfair Display', serif",
                                        fontSize: "2rem",
                                        fontWeight: 400,
                                        color: "var(--foreground)"
                                    }}>
                                        {category.name}
                                    </h2>
                                    <p style={{ fontFamily: "'Source Serif 4', serif", color: "var(--text-secondary)", marginTop: "0.5rem", fontStyle: "italic" }}>
                                        {category.description}
                                    </p>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
                                    {category.links.map((link) => (
                                        <a
                                            key={link.title}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group"
                                            style={{ textDecoration: "none", color: "inherit", display: "block" }}
                                        >
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem" }}>
                                                <h3 style={{
                                                    fontFamily: "'Source Serif 4', serif",
                                                    fontSize: "1.25rem",
                                                    fontWeight: 600,
                                                    color: "var(--foreground)",
                                                    textDecoration: "underline",
                                                    textDecorationColor: "var(--border)",
                                                    textUnderlineOffset: "4px"
                                                }} className="group-hover:text-blue-600 transition-colors">
                                                    {link.title}
                                                </h3>
                                                <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
                                                    ↗
                                                </span>
                                            </div>

                                            <p style={{
                                                fontSize: "1rem",
                                                color: "var(--text-secondary)",
                                                lineHeight: 1.6,
                                                marginBottom: "0.5rem",
                                                fontFamily: "'Source Serif 4', serif"
                                            }}>
                                                {link.description}
                                            </p>

                                            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontFamily: "var(--font-mono)", opacity: 0.6 }}>
                                                by {link.author}
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>

                </div>
            </Container>
        </section>
    );
}
