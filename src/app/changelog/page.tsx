import { Container } from "@/components/Container";
import { Metadata } from "next";
import { Clock, Briefcase, Pencil, GraduationCap, Heart, Folder } from "lucide-react";

export const metadata: Metadata = {
    title: "Changelog | The Almanac of Broken Wanderer",
    description: "Timeline perjalanan hidup dan karir.",
};

const timeline = [
    { year: "2025", event: "Started working on The Almanac of Broken Wanderer", type: "Project", icon: Folder },
    { year: "2024", event: "Joined TechCorp as Senior Frontend Engineer", type: "Career", icon: Briefcase },
    { year: "2023", event: "Published first technical essay on Agentic AI", type: "Writing", icon: Pencil },
    { year: "2022", event: "Graduated from University", type: "Life", icon: Heart },
    { year: "2019", event: "Started Informatics Engineering at UGM", type: "Education", icon: GraduationCap },
    { year: "2018", event: "Studied Chemical Engineering at UGM", type: "Education", icon: GraduationCap },
];

function TimelineItem({ item, isLast }: { item: typeof timeline[0]; isLast: boolean }) {
    const Icon = item.icon;
    return (
        <div style={{
            display: "flex",
            gap: "clamp(1rem, 3vw, 1.5rem)",
            position: "relative"
        }}>
            {/* Timeline line */}
            {!isLast && (
                <div style={{
                    position: "absolute",
                    left: "clamp(18px, 4vw, 22px)",
                    top: "clamp(44px, 10vw, 52px)",
                    bottom: "-clamp(1rem, 3vw, 1.5rem)",
                    width: "1px",
                    backgroundColor: "var(--border)"
                }} />
            )}

            {/* Year and icon */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flexShrink: 0,
                width: "clamp(36px, 9vw, 44px)"
            }}>
                <div style={{
                    width: "clamp(36px, 9vw, 44px)",
                    height: "clamp(36px, 9vw, 44px)",
                    borderRadius: "12px",
                    backgroundColor: "var(--hover-bg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent)",
                    border: "1px solid var(--border)"
                }}>
                    <Icon className="w-4 h-4" />
                </div>
            </div>

            {/* Content */}
            <div style={{
                flex: 1,
                paddingBottom: "clamp(1.5rem, 4vh, 2.5rem)"
            }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "0.5rem",
                    flexWrap: "wrap"
                }}>
                    <span style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "clamp(0.9rem, 2.2vw, 1rem)",
                        color: "var(--accent)",
                        fontWeight: 500
                    }}>
                        {item.year}
                    </span>
                    <span style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "clamp(0.65rem, 1.5vw, 0.7rem)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "var(--text-muted)",
                        padding: "0.2rem 0.5rem",
                        backgroundColor: "var(--hover-bg)",
                        borderRadius: "4px"
                    }}>
                        {item.type}
                    </span>
                </div>
                <h3 style={{
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
                    lineHeight: 1.4,
                    margin: 0,
                    color: "var(--foreground)"
                }}>
                    {item.event}
                </h3>
            </div>
        </div>
    );
}

export default function ChangelogPage() {
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
                            <Clock className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
                            <span style={{ color: "var(--text-secondary)" }}>The Timeline</span>
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
                            Dots connect backwards.
                        </h1>

                        <p style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                            color: "var(--text-secondary)",
                            maxWidth: "45ch",
                            lineHeight: 1.6,
                            margin: 0
                        }}>
                            Momen-momen penting yang ngebentuk siapa gue sekarang.
                            Jalan hidup cuma masuk akal kalau diliat ke belakang.
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

                    {/* Timeline */}
                    <div>
                        {timeline.map((item, i) => (
                            <TimelineItem key={i} item={item} isLast={i === timeline.length - 1} />
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    );
}
