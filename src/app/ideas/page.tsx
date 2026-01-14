import { Container } from "@/components/Container";
import { Metadata } from "next";
import { Lightbulb, Sparkles } from "lucide-react";

export const metadata: Metadata = {
    title: "Ideas | The Almanack of Broken Wanderer",
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

function IdeaCard({ idea }: { idea: typeof ideas[0] }) {
    return (
        <div style={{
            padding: "clamp(1.25rem, 3vw, 1.75rem)",
            backgroundColor: "var(--card-bg)",
            borderRadius: "16px",
            border: "1px solid var(--border)",
            borderLeft: "3px solid var(--accent)",
            transition: "all 0.3s ease"
        }} className="hover:border-[var(--border-strong)]">
            <p style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
                lineHeight: 1.6,
                color: "var(--foreground)",
                marginBottom: "clamp(1rem, 2vh, 1.25rem)"
            }}>
                {idea.content}
            </p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {idea.tags.map(tag => (
                    <span key={tag} style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "clamp(0.65rem, 1.5vw, 0.75rem)",
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        padding: "0.25rem 0.5rem",
                        backgroundColor: "var(--hover-bg)",
                        borderRadius: "4px"
                    }}>
                        #{tag}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function IdeasPage() {
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
                    <div className="animate-fade-in-up">
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
                            <Lightbulb className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
                            <span style={{ color: "var(--text-secondary)" }}>The Lab</span>
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
                            Fragile thoughts, captured.
                        </h1>

                        <p style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                            color: "var(--text-secondary)",
                            maxWidth: "45ch",
                            lineHeight: 1.6,
                            margin: 0
                        }}>
                            Micro-essays dan pemikiran yang belum cukup matang
                            buat jadi artikel, tapi terlalu berharga buat dilupain.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Main Content */}
            <Container>
                <div className="animate-fade-in animation-delay-200" style={{ maxWidth: "42rem" }}>

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

                    {/* Ideas List */}
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "clamp(1rem, 3vw, 1.5rem)"
                    }}>
                        {ideas.map((idea) => (
                            <IdeaCard key={idea.id} idea={idea} />
                        ))}
                    </div>

                    {/* Footer quote */}
                    <div style={{
                        marginTop: "clamp(3rem, 6vh, 4rem)",
                        paddingTop: "clamp(2rem, 4vh, 3rem)",
                        borderTop: "1px solid var(--border)",
                        textAlign: "center"
                    }}>
                        <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            color: "var(--text-muted)"
                        }}>
                            <Sparkles className="w-4 h-4" />
                            <span style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "clamp(0.7rem, 1.5vw, 0.8rem)",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em"
                            }}>
                                Ideas are just the beginning
                            </span>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
