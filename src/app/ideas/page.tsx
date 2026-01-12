import { Container } from "@/components/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Ideas | The Almanac of Broken Wanderer",
    description: "Koleksi pemikiran pendek yang belum jadi artikel.",
};

const ideas = [
    {
        id: 1,
        content: "True productivity is not about getting more things done, but about eliminating the non-essentials until only the truth remains.",
        tags: ["productivity", "philosophy"],
    },
    {
        id: 2,
        content: "AI won't replace programmers, but programmers who use AI will replace those who don't. The skill is no longer syntax; it's orchestration.",
        tags: ["ai", "future"],
    },
    {
        id: 3,
        content: "Writing is the best way to debug your thoughts. If you can't explain it simply on paper, you don't understand it well enough.",
        tags: ["writing", "thinking"],
    },
    {
        id: 4,
        content: "The best code is the code you don't write. The best architecture is the one that allows you to delete the most code.",
        tags: ["software", "minimalism"],
    },
];

export default function IdeasPage() {
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
                            The Lab
                        </span>
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(3rem, 6vw, 5rem)",
                            fontWeight: 400,
                            letterSpacing: "-0.03em",
                            lineHeight: 1,
                            color: "var(--foreground)",
                            maxWidth: "20ch"
                        }}>
                            Everything begins as a fragile thought.
                        </h1>
                    </div>
                </Container>
            </section>

            <Container>
                <div className="animate-fade-in animation-delay-300" style={{ maxWidth: "65rem", margin: "0 auto" }}>

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

                    <div style={{ columnCount: 1, columnGap: "2rem" }} className="md:columns-2 lg:columns-3">
                        {ideas.map((idea) => (
                            <div key={idea.id} style={{
                                breakInside: "avoid",
                                marginBottom: "2rem",
                                padding: "2rem",
                                backgroundColor: "var(--card-bg)",
                                borderRadius: "2px",
                                borderLeft: "2px solid var(--accent)",
                                position: "relative",
                                boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)"
                            }}>
                                <p style={{
                                    fontFamily: "'Source Serif 4', serif",
                                    fontSize: "1.1rem",
                                    lineHeight: 1.6,
                                    color: "var(--foreground)",
                                    marginBottom: "1.5rem"
                                }}>
                                    {idea.content}
                                </p>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    {idea.tags.map(tag => (
                                        <span key={tag} style={{
                                            fontFamily: "var(--font-mono)",
                                            fontSize: "0.75rem",
                                            color: "var(--text-secondary)",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.05em"
                                        }}>
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    );
}
