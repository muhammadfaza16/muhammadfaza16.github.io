import { Container } from "@/components/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "TIL | The Almanac of Broken Wanderer",
    description: "Today I Learned. Snippets pengetahuan teknis harian.",
};

const tils = [
    {
        date: "2026-01-10",
        title: "CSS Scroll Snap",
        content: "CSS scroll-snap-type property allows you to create strictly controlled scrolling experiences, like pagination or image carousels, without JavaScript.",
        tag: "CSS"
    },
    {
        date: "2026-01-08",
        title: "React Server Components",
        content: "Server Components allow you to render components on the server specifically to reduce bundle size. They don't have access to browser APIs or hooks.",
        tag: "REACT"
    },
    {
        date: "2026-01-05",
        title: "Git Rebase vs Merge",
        content: "Rebase rewrites history to create a linear progression of commits. Merge preserves history but creates a merge commit. Use rebase for local cleanup, merge for shared branches.",
        tag: "GIT"
    }
];

export default function TILPage() {
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
                            The Knowledge
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
                            Daily compounds of knowledge.
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

                    {tils.map((til, i) => (
                        <div key={i} style={{
                            marginBottom: "4rem",
                            paddingBottom: "4rem",
                            borderBottom: "1px solid var(--border)"
                        }}>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "1.5rem",
                                alignItems: "center"
                            }}>
                                <span style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.85rem",
                                    color: "var(--text-secondary)"
                                }}>
                                    {til.date}
                                </span>
                                <span style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.75rem",
                                    padding: "0.25rem 0.75rem",
                                    border: "1px solid var(--border)",
                                    borderRadius: "99px",
                                    letterSpacing: "0.05em"
                                }}>
                                    {til.tag}
                                </span>
                            </div>
                            <h2 style={{
                                fontFamily: "'Source Serif 4', serif",
                                fontSize: "1.75rem",
                                marginBottom: "1rem",
                                lineHeight: 1.3
                            }}>
                                {til.title}
                            </h2>
                            <p style={{
                                fontFamily: "var(--font-sans)",
                                fontSize: "1.1rem",
                                lineHeight: 1.7,
                                color: "var(--text-secondary)"
                            }}>
                                {til.content}
                            </p>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}
