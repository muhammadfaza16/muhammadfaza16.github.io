import { Container } from "@/components/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Uses | The Almanac of Broken Wanderer",
    description: "Alat, software, dan hardware yang saya gunakan sehari-hari.",
};

const gear = [
    {
        category: "Hardware",
        items: [
            { name: "MacBook Pro 14", description: "M3 Pro, Space Black. The perfect balance of power and portability." },
            { name: "HHKB Professional Hybrid", description: "Topre switches. Once you go clack, you never go back." },
            { name: "MX Master 3S", description: "Standard issue for productivity." },
        ]
    },
    {
        category: "Software",
        items: [
            { name: "VS Code", description: "With GitHub Copilot and VIM bindings." },
            { name: "Arc Browser", description: "The operating system of the web." },
            { name: "Obsidian", description: "Second brain. Local markdown files 4ever." },
        ]
    }
];

export default function UsesPage() {
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
                            The Studio
                        </span>
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(3rem, 6vw, 5rem)",
                            fontWeight: 400,
                            letterSpacing: "-0.03em",
                            lineHeight: 1,
                            color: "var(--foreground)",
                            maxWidth: "18ch"
                        }}>
                            Tools for the craft.
                        </h1>
                    </div>
                </Container>
            </section>

            <Container>
                <div className="animate-fade-in animation-delay-300" style={{ maxWidth: "55rem" }}>

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

                    {gear.map((section, i) => (
                        <div key={i} style={{ marginBottom: "6rem" }}>
                            <h2 style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "1.75rem",
                                marginBottom: "2.5rem",
                                borderBottom: "1px solid var(--border)",
                                paddingBottom: "1rem",
                                display: "inline-block"
                            }}>
                                {section.category}
                            </h2>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                                gap: "3rem"
                            }}>
                                {section.items.map((item, j) => (
                                    <div key={j}>
                                        <h3 style={{
                                            fontFamily: "'Source Serif 4', serif",
                                            fontSize: "1.25rem",
                                            marginBottom: "0.75rem",
                                            fontWeight: 500
                                        }}>
                                            {item.name}
                                        </h3>
                                        <p style={{
                                            fontSize: "1rem",
                                            color: "var(--text-secondary)",
                                            lineHeight: 1.6
                                        }}>
                                            {item.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}
