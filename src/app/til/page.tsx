import { Container } from "@/components/Container";
import { Metadata } from "next";
import { GraduationCap, Calendar, Tag } from "lucide-react";

export const metadata: Metadata = {
    title: "TIL | The Almanack of Broken Wanderer",
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

function TilCard({ til }: { til: typeof tils[0] }) {
    return (
        <div style={{
            padding: "clamp(1.25rem, 3vw, 1.75rem)",
            backgroundColor: "var(--card-bg)",
            borderRadius: "16px",
            border: "1px solid var(--border)",
            transition: "all 0.3s ease"
        }} className="hover:border-[var(--border-strong)]">
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "clamp(0.75rem, 2vh, 1rem)",
                flexWrap: "wrap",
                gap: "0.5rem"
            }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                }}>
                    <Calendar className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
                    <span style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "clamp(0.75rem, 1.8vw, 0.85rem)",
                        color: "var(--text-muted)"
                    }}>
                        {til.date}
                    </span>
                </div>
                <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontFamily: "var(--font-mono)",
                    fontSize: "clamp(0.65rem, 1.5vw, 0.75rem)",
                    padding: "0.25rem 0.6rem",
                    backgroundColor: "var(--hover-bg)",
                    borderRadius: "99px",
                    letterSpacing: "0.05em",
                    color: "var(--text-secondary)"
                }}>
                    <Tag className="w-3 h-3" />
                    {til.tag}
                </span>
            </div>
            <h3 style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: "clamp(1.15rem, 3vw, 1.35rem)",
                marginBottom: "clamp(0.5rem, 1.5vh, 0.75rem)",
                lineHeight: 1.3,
                fontWeight: 500
            }}>
                {til.title}
            </h3>
            <p style={{
                fontSize: "clamp(0.9rem, 2.2vw, 1rem)",
                lineHeight: 1.6,
                color: "var(--text-secondary)",
                margin: 0
            }}>
                {til.content}
            </p>
        </div>
    );
}

export default function TILPage() {
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
                            <GraduationCap className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
                            <span style={{ color: "var(--text-secondary)" }}>The Knowledge</span>
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
                            Daily compounds.
                        </h1>

                        <p style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                            color: "var(--text-secondary)",
                            maxWidth: "45ch",
                            lineHeight: 1.6,
                            margin: 0
                        }}>
                            Micro-learnings yang gue tangkep tiap hari.
                            Potongan kecil yang bakal jadi besar seiring waktu.
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

                    {/* TIL List */}
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "clamp(1rem, 3vw, 1.5rem)"
                    }}>
                        {tils.map((til, i) => (
                            <TilCard key={i} til={til} />
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    );
}
