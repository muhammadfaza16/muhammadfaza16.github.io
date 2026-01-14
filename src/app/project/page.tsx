import { Container } from "@/components/Container";
import { ProjectGrid } from "@/components/ProjectGrid";
import { Metadata } from "next";
import { Layers } from "lucide-react";

export const metadata: Metadata = {
    title: "Project | The Almanack of Broken Wanderer",
    description: "Eksperimen, tools, dan hal-hal yang gue bangun.",
};

export default function ProjectPage() {
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
                            <Layers className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
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
                            Building to understand.
                        </h1>

                        <p style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                            color: "var(--text-secondary)",
                            maxWidth: "48ch",
                            lineHeight: 1.6,
                            margin: 0
                        }}>
                            A collection of experiments, tools, and side quests.
                            Some are useful, most are just me trying to figure things out by making them.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Main Content */}
            <Container>
                <div className="animate-fade-in animation-delay-200">
                    <ProjectGrid />
                </div>
            </Container>
        </div>
    );
}
