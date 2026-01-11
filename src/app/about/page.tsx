import { Container } from "@/components/Container";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About | The Almanac of Broken Wanderer",
    description: "Sedikit cerita tentang siapa saya dan apa yang saya kerjakan.",
};

export default function AboutPage() {
    return (
        <div style={{ paddingBottom: "8rem" }}>
            {/* 1. HERO: The Manifesto */}
            <section style={{
                minHeight: "80vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                paddingTop: "6rem"
            }}>
                <Container>
                    <div className="animate-fade-in-up">
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(3rem, 8vw, 6rem)",
                            fontWeight: 400,
                            letterSpacing: "-0.04em",
                            lineHeight: 1, // Tight leading
                            marginBottom: "3rem",
                            color: "var(--foreground)",
                            maxWidth: "18ch",
                            marginLeft: "auto",
                            marginRight: "auto"
                        }}>
                            I build for the sake of understanding.
                        </h1>
                        <p style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "1.5rem",
                            color: "var(--text-secondary)",
                            maxWidth: "35rem",
                            margin: "0 auto",
                            lineHeight: 1.6
                        }}>
                            Software Engineer. Occasional Philosopher.<br />
                            Professional Overthinker.
                        </p>
                    </div>
                </Container>
            </section>

            {/* 2. PHILOSOPHY: The Believes */}
            <section style={{ padding: "8rem 0", backgroundColor: "var(--card-bg)" }}>
                <Container>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: "4rem"
                    }}>
                        {[
                            {
                                num: "01",
                                title: "Simplicity",
                                desc: "The ultimate sophistication. I confuse simple with easy, but I always strive for the former."
                            },
                            {
                                num: "02",
                                title: "Curiosity",
                                desc: "I pull threads just to see what unravels. Sometimes it's a sweater, sometimes it's the universe."
                            },
                            {
                                num: "03",
                                title: "Craft",
                                desc: "Code is poetry written for machines. It should be elegant, efficient, and occasionally rhyme."
                            }
                        ].map((item, i) => (
                            <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                                <span style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.9rem",
                                    color: "var(--accent)",
                                    display: "block",
                                    marginBottom: "1rem"
                                }}>
                                    {item.num}
                                </span>
                                <h3 style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: "2rem",
                                    fontWeight: 500,
                                    marginBottom: "1rem"
                                }}>
                                    {item.title}
                                </h3>
                                <p style={{
                                    color: "var(--text-secondary)",
                                    lineHeight: 1.7,
                                    fontSize: "1.1rem"
                                }}>
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* 3. ARCHIVE: The Navigation (Apple Cards) */}
            <section style={{ padding: "8rem 0" }}>
                <Container>
                    <div style={{ marginBottom: "5rem", textAlign: "center" }}>
                        <h2 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "3rem",
                            fontWeight: 400,
                            letterSpacing: "-0.02em"
                        }}>
                            The Archive
                        </h2>
                    </div>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: "2rem"
                    }}>
                        {[
                            { href: "/now", emoji: "⚡", title: "Now", desc: "What's focusing my attention." },
                            { href: "/bookshelf", emoji: "📚", title: "Bookshelf", desc: "Library of things I've read." },
                            { href: "/ideas", emoji: "💡", title: "Ideas", desc: "Sparks that might catch fire." },
                            { href: "/links", emoji: "🔗", title: "Links", desc: "Curated corner of the web." },
                            { href: "/changelog", emoji: "📝", title: "Changelog", desc: "History of updates & life." },
                            { href: "/til", emoji: "🎓", title: "TIL", desc: "Today I Learned snippets." },
                            { href: "/uses", emoji: "🛠️", title: "Uses", desc: "Hardware & Software stack." }
                        ].map((link) => (
                            <Link
                                href={link.href}
                                key={link.href}
                                className="card-hover"
                                style={{
                                    display: "block",
                                    padding: "2rem",
                                    borderRadius: "16px",
                                    backgroundColor: "var(--card-bg)",
                                    border: "1px solid var(--border)",
                                    textDecoration: "none",
                                    color: "var(--foreground)"
                                }}
                            >
                                <span style={{ fontSize: "2.5rem", marginBottom: "1rem", display: "block" }}>
                                    {link.emoji}
                                </span>
                                <h4 style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: "1.5rem",
                                    fontWeight: 500,
                                    marginBottom: "0.5rem"
                                }}>
                                    {link.title}
                                </h4>
                                <p style={{
                                    color: "var(--text-secondary)",
                                    fontSize: "0.95rem",
                                    lineHeight: 1.5
                                }}>
                                    {link.desc}
                                </p>
                            </Link>
                        ))}
                    </div>
                </Container>
            </section>

            {/* 4. FOOTER: Connect */}
            <section style={{ padding: "6rem 0", textAlign: "center" }}>
                <Container>
                    <p style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "2rem",
                        marginBottom: "2rem",
                        fontStyle: "italic",
                        opacity: 0.8
                    }}>
                        "Stay hungry. Stay foolish."
                    </p>

                    <div style={{ display: "flex", gap: "2rem", justifyContent: "center" }}>
                        <a href="https://x.com/scienfilix" target="_blank" rel="noopener noreferrer"
                            className="link-underline"
                            style={{ fontSize: "1.1rem", fontFamily: "var(--font-mono)" }}>
                            Twitter / X
                        </a>
                        <a href="https://github.com/mfazans23" target="_blank" rel="noopener noreferrer"
                            className="link-underline"
                            style={{ fontSize: "1.1rem", fontFamily: "var(--font-mono)" }}>
                            GitHub
                        </a>
                    </div>
                </Container>
            </section>
        </div>
    );
}
