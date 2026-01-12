import { Container } from "@/components/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Changelog | The Almanac of Broken Wanderer",
    description: "Timeline perjalanan hidup dan karir.",
};

const timeline = [
    { year: "2025", event: "Started working on The Almanac of Broken Wanderer", type: "Project" },
    { year: "2024", event: "Joined TechCorp as Senior Frontend Engineer", type: "Career" },
    { year: "2023", event: "Published first technical essay on Agentic AI", type: "Writing" },
    { year: "2022", event: "Graduated from University", type: "Life" },
    { year: "2019", event: "Started Informatics Engineering at UGM", type: "Education" },
    { year: "2018", event: "Studied Chemical Engineering at UGM", type: "Education" },
];

export default function ChangelogPage() {
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
                            The Timeline
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
                            The dots connect backwards.
                        </h1>
                    </div>
                </Container>
            </section>

            <Container>
                <div className="animate-fade-in animation-delay-300" style={{ maxWidth: "45rem", position: "relative" }}>

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

                    <div style={{
                        position: "absolute",
                        left: "110px",
                        top: 0,
                        bottom: 0,
                        width: "1px",
                        backgroundColor: "var(--border)",
                        zIndex: 0
                    }} className="hidden md:block" />

                    {timeline.map((item, i) => (
                        <div key={i} style={{
                            display: "flex",
                            marginBottom: "4rem",
                            alignItems: "baseline",
                            position: "relative"
                        }}>
                            <div style={{
                                width: "100px",
                                flexShrink: 0,
                                textAlign: "right",
                                paddingRight: "2rem",
                                fontFamily: "var(--font-mono)",
                                fontSize: "1.2rem",
                                color: "var(--text-secondary)",
                                fontWeight: 500
                            }} className="hidden md:block">
                                {item.year}
                            </div>

                            <div style={{
                                width: "12px",
                                height: "12px",
                                backgroundColor: "var(--background)",
                                border: "2px solid var(--accent)",
                                borderRadius: "50%",
                                position: "absolute",
                                left: "105px",
                                top: "8px",
                                zIndex: 1
                            }} className="hidden md:block" />

                            <div style={{ flex: 1, paddingLeft: "1rem" }} className="md:pl-8">
                                <span className="md:hidden" style={{
                                    display: "block",
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "1rem",
                                    color: "var(--accent)",
                                    marginBottom: "0.5rem"
                                }}>
                                    {item.year}
                                </span>
                                <h3 style={{
                                    fontFamily: "'Source Serif 4', serif",
                                    fontSize: "1.5rem",
                                    marginBottom: "0.5rem",
                                    lineHeight: 1.4
                                }}>
                                    {item.event}
                                </h3>
                                <span style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.8rem",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                    color: "var(--text-secondary)",
                                    opacity: 0.8
                                }}>
                                    {item.type}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}
