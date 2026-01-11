import { Container } from "@/components/Container";
import { ProjectGrid } from "@/components/ProjectGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Project | The Almanac of Broken Wanderer",
    description: "Project dan eksperimen yang lagi dikerjain.",
};

export default function ProjectPage() {
    return (
        <section style={{ paddingTop: "12vh", paddingBottom: "8rem" }}>
            <Container>
                <div className="animate-fade-in">
                    {/* Steve Jobs Style Hero */}
                    <div style={{ marginBottom: "6rem" }}>
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(3.5rem, 10vw, 7.5rem)",
                            fontWeight: 400,
                            letterSpacing: "-0.04em",
                            lineHeight: 0.95,
                            marginBottom: "2rem",
                            color: "var(--foreground)",
                            maxWidth: "15ch"
                        }}>
                            Selected Works.
                        </h1>
                        <p style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "1.25rem",
                            color: "var(--text-secondary)",
                            maxWidth: "40rem",
                            lineHeight: 1.6
                        }}>
                            A collection of experiments, failures, and accidental successes.
                            Things I build when I'm not overthinking.
                        </p>
                    </div>

                    <div className="animate-fade-in animation-delay-300">

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

                        <ProjectGrid />
                    </div>
                </div>
            </Container>
        </section>
    );
}
