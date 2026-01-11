import { Container } from "@/components/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Links | The Almanac of Broken Wanderer",
    description: "Koleksi resources, artikel, dan content yang menginspirasi.",
};

const links = [
    {
        category: "Essential Reads",
        items: [
            { title: "How to Do Great Work", author: "Paul Graham", url: "#" },
            { title: "The Gervais Principle", author: "Venkatesh Rao", url: "#" },
            { title: "Taste for Makers", author: "Paul Graham", url: "#" },
        ]
    },
    {
        category: "Tools",
        items: [
            { title: "Visual Studio Code", author: "Microsoft", url: "#" },
            { title: "Raycast", author: "Raycast", url: "#" },
            { title: "Linear", author: "Linear", url: "#" },
        ]
    }
];

export default function LinksPage() {
    return (
        <div style={{ paddingBottom: "8rem" }}>
            <section style={{
                minHeight: "50vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingTop: "8rem",
                paddingBottom: "4rem"
            }}>
                <Container>
                    <div className="animate-fade-in-up">
                        <span style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.9rem",
                            color: "var(--accent)",
                            display: "block",
                            marginBottom: "1.5rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em"
                        }}>
                            The Curator
                        </span>
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(3rem, 6vw, 5rem)",
                            fontWeight: 400,
                            letterSpacing: "-0.03em",
                            lineHeight: 1,
                            color: "var(--foreground)",
                            maxWidth: "15ch"
                        }}>
                            Curation is creation.
                        </h1>
                    </div>
                </Container>
            </section>

            <Container>
                <div className="animate-fade-in animation-delay-300" style={{ maxWidth: "45rem" }}>

                    {/* Disclaimer */}
                    <div style={{
                        padding: "1rem",
                        marginBottom: "4rem",
                        background: "rgba(var(--foreground-rgb), 0.05)",
                        border: "1px solid var(--border)",
                        borderRadius: "12px",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.8rem",
                        color: "var(--text-secondary)",
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem"
                    }}>
                        <span style={{ fontSize: "1.25rem" }}>⚠️</span>
                        <div>
                            <strong style={{ color: "var(--foreground)", display: "block", marginBottom: "0.25rem" }}>Notice</strong>
                            The data below is currently placeholder content for demonstration purposes.
                        </div>
                    </div>

                    {links.map((section, i) => (
                        <div key={i} style={{ marginBottom: "6rem" }}>
                            <h2 style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "2rem",
                                marginBottom: "2rem",
                                color: "var(--text-secondary)",
                                fontWeight: 400
                            }}>
                                {section.category}
                            </h2>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                {section.items.map((link, j) => (
                                    <a key={j} href={link.url} style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "baseline",
                                        padding: "1.5rem 0",
                                        borderBottom: "1px solid var(--border)",
                                        textDecoration: "none",
                                        color: "var(--foreground)",
                                        transition: "color 0.2s"
                                    }} className="group hover:text-[var(--accent)]">
                                        <span style={{
                                            fontSize: "1.25rem",
                                            fontFamily: "'Source Serif 4', serif"
                                        }}>
                                            {link.title}
                                        </span>
                                        <span style={{
                                            fontFamily: "var(--font-mono)",
                                            fontSize: "0.9rem",
                                            color: "var(--text-secondary)"
                                        }}>
                                            {link.author} <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">↗</span>
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}
