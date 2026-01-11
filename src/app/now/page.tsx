import { Container } from "@/components/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Now | The Almanac of Broken Wanderer",
    description: "Apa yang sedang saya kerjakan sekarang.",
};

export default function NowPage() {
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
                            The Focus
                        </span>
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(3.5rem, 10vw, 7rem)",
                            fontWeight: 400,
                            letterSpacing: "-0.04em",
                            lineHeight: 0.95,
                            marginBottom: "2rem",
                            color: "var(--foreground)",
                            maxWidth: "15ch"
                        }}>
                            Focus is about saying no.
                        </h1>
                        <p style={{
                            marginTop: "2rem",
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "1.25rem",
                            color: "var(--text-secondary)",
                            maxWidth: "35rem",
                            lineHeight: 1.6
                        }}>
                            A living snapshot of what has my attention right now.<br />
                            Updated: January 2026.
                        </p>
                    </div>
                </Container>
            </section>

            <Container>
                <div className="animate-fade-in animation-delay-300" style={{ maxWidth: "45rem" }}>
                    <div style={{ marginBottom: "5rem" }}>
                        <h2 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "2rem",
                            marginBottom: "2rem",
                            borderBottom: "1px solid var(--border)",
                            paddingBottom: "1rem"
                        }}>
                            On My Desk
                        </h2>
                        <ul style={{
                            listStyle: "none",
                            padding: 0,
                            display: "flex",
                            flexDirection: "column",
                            gap: "2rem"
                        }}>
                            {[
                                "Deep diving into Agentic AI and Large Language Model orchestration.",
                                "Building this personal digital garden to be a premium reflection of my mind.",
                                "Writing a new technical essay about 'The Art of Code Deletion'.",
                                "Reading 'Thinking, Fast and Slow' (slowly)."
                            ].map((item, i) => (
                                <li key={i} style={{
                                    fontSize: "1.2rem",
                                    lineHeight: 1.6,
                                    display: "flex",
                                    gap: "1.5rem"
                                }}>
                                    <span style={{ color: "var(--accent)", fontFamily: "var(--font-serif)" }}>—</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "2rem",
                            marginBottom: "2rem",
                            borderBottom: "1px solid var(--border)",
                            paddingBottom: "1rem"
                        }}>
                            On Repeat
                        </h2>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1.5rem",
                            padding: "1.5rem",
                            backgroundColor: "var(--card-bg)",
                            borderRadius: "16px",
                            boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)"
                        }}>
                            <div style={{
                                width: "60px",
                                height: "60px",
                                backgroundColor: "var(--foreground)",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "var(--background)"
                            }}>
                                ▶
                            </div>
                            <div>
                                <p style={{ fontSize: "1.1rem", fontWeight: 500 }}>Lofi Girl Radio</p>
                                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Beats to rely/relax to</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
