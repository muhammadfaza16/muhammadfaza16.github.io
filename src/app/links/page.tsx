import { Container } from "@/components/Container";
import { Metadata } from "next";
import { Link2, ExternalLink, BookMarked, Wrench } from "lucide-react";

export const metadata: Metadata = {
    title: "Links | The Almanack of Broken Wanderer",
    description: "Koleksi resources, artikel, dan content yang menginspirasi.",
};

const links = [
    {
        category: "Essential Reads",
        icon: BookMarked,
        items: [
            { title: "How to Do Great Work", author: "Paul Graham", url: "#" },
            { title: "The Gervais Principle", author: "Venkatesh Rao", url: "#" },
            { title: "Taste for Makers", author: "Paul Graham", url: "#" },
        ]
    },
    {
        category: "Tools I Swear By",
        icon: Wrench,
        items: [
            { title: "Visual Studio Code", author: "Microsoft", url: "#" },
            { title: "Raycast", author: "Raycast", url: "#" },
            { title: "Linear", author: "Linear", url: "#" },
        ]
    }
];

function LinkItem({ link }: { link: { title: string; author: string; url: string } }) {
    return (
        <a href={link.url} style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "clamp(1rem, 2.5vw, 1.25rem) 0",
            borderBottom: "1px solid var(--border)",
            textDecoration: "none",
            color: "var(--foreground)",
            transition: "all 0.2s ease",
            gap: "1rem"
        }} className="group hover:text-[var(--accent)]">
            <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{
                    fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
                    fontFamily: "'Source Serif 4', serif",
                    display: "block",
                    marginBottom: "0.25rem"
                }}>
                    {link.title}
                </span>
                <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "clamp(0.75rem, 1.8vw, 0.85rem)",
                    color: "var(--text-muted)"
                }}>
                    {link.author}
                </span>
            </div>
            <ExternalLink
                className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                style={{ color: "var(--accent)" }}
            />
        </a>
    );
}

export default function LinksPage() {
    return (
        <div style={{ paddingBottom: "clamp(4rem, 8vh, 8rem)" }}>
            {/* Hero Section */}
            <section style={{
                minHeight: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingTop: "clamp(5rem, 12vh, 8rem)",
                paddingBottom: "clamp(2rem, 4vh, 3rem)"
            }}>
                <Container>
                    <div className="">
                        <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.35rem 0.75rem",
                            backgroundColor: "var(--hover-bg)",
                            borderRadius: "99px",
                            fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
                            fontFamily: "var(--font-mono)",
                            marginBottom: "clamp(1.5rem, 3vh, 2rem)"
                        }}>
                            <Link2 className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
                            <span style={{ color: "var(--text-secondary)" }}>The Curator</span>
                        </div>

                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
                            fontWeight: 400,
                            letterSpacing: "-0.03em",
                            lineHeight: 1.1,
                            marginBottom: "clamp(1rem, 2vh, 1.5rem)",
                            color: "var(--foreground)",
                            maxWidth: "16ch"
                        }}>
                            Curation is creation.
                        </h1>

                        <p style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                            color: "var(--text-secondary)",
                            maxWidth: "45ch",
                            lineHeight: 1.6,
                            margin: 0
                        }}>
                            Resources yang ngebentuk cara gue berpikir. Articles yang
                            sering gue baca ulang, tools yang gak bisa gue tinggalin.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Main Content */}
            <Container>
                <div className=" animation-delay-200" style={{ maxWidth: "42rem" }}>

                    {/* Disclaimer */}
                    <div style={{
                        padding: "clamp(0.875rem, 2vw, 1rem)",
                        marginBottom: "clamp(2rem, 4vh, 3rem)",
                        background: "rgba(var(--foreground-rgb), 0.05)",
                        border: "1px solid var(--border)",
                        borderRadius: "12px",
                        fontFamily: "var(--font-mono)",
                        fontSize: "clamp(0.7rem, 1.8vw, 0.8rem)",
                        color: "var(--text-secondary)",
                        display: "flex",
                        alignItems: "center",
                        gap: "clamp(0.75rem, 2vw, 1rem)"
                    }}>
                        <span style={{ fontSize: "1.25rem" }}>⚠️</span>
                        <div>
                            <strong style={{ color: "var(--foreground)", display: "block", marginBottom: "0.25rem" }}>Notice</strong>
                            The data below is currently placeholder content for demonstration purposes.
                        </div>
                    </div>

                    {/* Link Categories */}
                    {links.map((section, i) => (
                        <section key={i} style={{ marginBottom: "clamp(3rem, 6vh, 4rem)" }}>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                marginBottom: "clamp(1.25rem, 3vh, 1.75rem)"
                            }}>
                                <section.icon className="w-4 h-4" style={{ color: "var(--accent)" }} />
                                <h2 style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
                                    fontWeight: 500,
                                    margin: 0
                                }}>
                                    {section.category}
                                </h2>
                            </div>
                            <div>
                                {section.items.map((link, j) => (
                                    <LinkItem key={j} link={link} />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </Container>
        </div>
    );
}
