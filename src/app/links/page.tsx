import { Container } from "@/components/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Links | The Almanac of Broken Wanderer",
    description: "Koleksi resources, artikel, dan content yang menginspirasi.",
};

const DISCLAIMER = "🔗 Konten di halaman ini masih berupa dummy/placeholder. Akan segera diperbarui dengan links asli.";

const categories = [
    {
        name: "📚 Essential Reads",
        description: "Artikel dan essay yang wajib dibaca.",
        links: [
            {
                title: "How to Do Great Work",
                author: "Paul Graham",
                url: "https://paulgraham.com/greatwork.html",
                description: "Panduan fundamentil tentang bagaimana menghasilkan karya terbaik."
            },
            {
                title: "The Gervais Principle",
                author: "Venkatesh Rao",
                url: "https://www.ribbonfarm.com/the-gervais-principle/",
                description: "Analisis mendalam tentang dinamika organisasi melalui lensa The Office."
            },
            {
                title: "Taste for Makers",
                author: "Paul Graham",
                url: "https://paulgraham.com/taste.html",
                description: "Tentang pentingnya taste dalam pembuatan sesuatu yang baik."
            },
        ]
    },
    {
        name: "🛠️ Developer Tools",
        description: "Tools yang meningkatkan produktivitas.",
        links: [
            {
                title: "Visual Studio Code",
                author: "Microsoft",
                url: "https://code.visualstudio.com/",
                description: "Editor code yang powerful dan extensible."
            },
            {
                title: "Raycast",
                author: "Raycast",
                url: "https://raycast.com/",
                description: "Launcher yang supercharge workflow harian."
            },
            {
                title: "Linear",
                author: "Linear",
                url: "https://linear.app/",
                description: "Issue tracking yang benar-benar untuk developers."
            },
        ]
    },
    {
        name: "🎧 Podcasts",
        description: "Podcast yang worth your time.",
        links: [
            {
                title: "Lex Fridman Podcast",
                author: "Lex Fridman",
                url: "https://lexfridman.com/podcast/",
                description: "Conversasi mendalam dengan pikiran-pikiran terbaik dunia."
            },
            {
                title: "The Knowledge Project",
                author: "Shane Parrish",
                url: "https://fs.blog/knowledge-project-podcast/",
                description: "Mental models dan wisdom dari berbagai bidang."
            },
        ]
    },
    {
        name: "🎬 YouTube Channels",
        description: "Channels yang worth subscribing.",
        links: [
            {
                title: "Fireship",
                author: "Jeff Delaney",
                url: "https://www.youtube.com/@Fireship",
                description: "Penjelasan tech yang cepat, witty, dan informatif."
            },
            {
                title: "3Blue1Brown",
                author: "Grant Sanderson",
                url: "https://www.youtube.com/@3blue1brown",
                description: "Visualisasi matematika yang indah dan intuitif."
            },
        ]
    },
];

export default function LinksPage() {
    return (
        <Container>
            <div className="animate-fade-in-up" style={{ maxWidth: "50rem", marginTop: "2rem", marginBottom: "6rem" }}>

                <header style={{ marginBottom: "3rem" }}>
                    <span style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.85rem",
                        color: "var(--text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        display: "block",
                        marginBottom: "0.5rem"
                    }}>
                        Curated Resources
                    </span>
                    <h1 style={{
                        fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                        fontWeight: 700,
                        color: "var(--foreground)"
                    }}>
                        Links
                    </h1>
                    <p style={{
                        marginTop: "1rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.6,
                        maxWidth: "35rem"
                    }}>
                        Koleksi artikel, tools, podcast, dan resources yang telah menginspirasi dan membantu saya. Dikurasi dengan sepenuh hati.
                    </p>
                </header>

                {/* Disclaimer */}
                <div style={{
                    padding: "1rem 1.5rem",
                    backgroundColor: "var(--hover-bg)",
                    border: "1px dashed var(--border)",
                    borderRadius: "8px",
                    marginBottom: "3rem",
                    fontSize: "0.9rem",
                    color: "var(--text-secondary)"
                }}>
                    {DISCLAIMER}
                </div>

                {/* Categories */}
                <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
                    {categories.map((category) => (
                        <section key={category.name}>
                            <h2 style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "1.25rem",
                                marginBottom: "0.5rem",
                                borderBottom: "1px solid var(--border)",
                                paddingBottom: "0.5rem"
                            }}>
                                {category.name}
                            </h2>
                            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                                {category.description}
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                {category.links.map((link) => (
                                    <a
                                        key={link.title}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            padding: "1.25rem",
                                            borderRadius: "8px",
                                            backgroundColor: "var(--card-bg)",
                                            border: "1px solid var(--border)",
                                            textDecoration: "none",
                                            color: "inherit",
                                            transition: "all 0.2s ease",
                                            display: "block"
                                        }}
                                        className="link-card-hover"
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                            <div>
                                                <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.25rem", color: "var(--foreground)" }}>
                                                    {link.title}
                                                </h3>
                                                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                                                    by {link.author}
                                                </p>
                                            </div>
                                            <span style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>↗</span>
                                        </div>
                                        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                            {link.description}
                                        </p>
                                    </a>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

            </div>
        </Container>
    );
}
