import { Container } from "@/components/Container";
import { Metadata } from "next";
import {
    Sparkles,
    Target,
    BookOpen,
    Headphones,
    Coffee,
    Flame,
    Brain,
    Pencil,
    Clock
} from "lucide-react";
import { MusicPlayer } from "@/components/MusicPlayer";

export const metadata: Metadata = {
    title: "Now | The Almanack of Broken Wanderer",
    description: "Apa yang sedang saya kerjakan sekarang.",
};

// Focus item component with visual indicator
function FocusItem({
    icon: Icon,
    title,
    description,
    progress,
    accent = false
}: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    progress?: number;
    accent?: boolean;
}) {
    return (
        <div style={{
            display: "flex",
            gap: "clamp(1rem, 3vw, 1.25rem)",
            padding: "clamp(1rem, 3vw, 1.5rem)",
            backgroundColor: accent ? "var(--card-bg)" : "transparent",
            borderRadius: accent ? "16px" : 0,
            border: accent ? "1px solid var(--border)" : "none",
            transition: "all 0.3s ease"
        }} className={accent ? "hover:border-[var(--border-strong)]" : ""}>
            <div style={{
                width: "clamp(40px, 10vw, 48px)",
                height: "clamp(40px, 10vw, 48px)",
                borderRadius: "12px",
                backgroundColor: "var(--hover-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: "var(--accent)"
            }}>
                <Icon className="w-5 h-5" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
                    fontWeight: 500,
                    marginBottom: "0.35rem",
                    lineHeight: 1.3
                }}>
                    {title}
                </h3>
                <p style={{
                    fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
                    color: "var(--text-secondary)",
                    lineHeight: 1.65,
                    margin: 0
                }}>
                    {description}
                </p>
                {progress !== undefined && (
                    <div style={{
                        marginTop: "0.75rem",
                        height: "4px",
                        backgroundColor: "var(--hover-bg)",
                        borderRadius: "2px",
                        overflow: "hidden"
                    }}>
                        <div style={{
                            width: `${progress}%`,
                            height: "100%",
                            backgroundColor: "var(--accent)",
                            borderRadius: "2px",
                            transition: "width 0.5s ease"
                        }} />
                    </div>
                )}
            </div>
        </div>
    );
}


// Status pill component
function StatusPill({ status, time }: { status: string; time: string }) {
    return (
        <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.35rem 0.75rem",
            backgroundColor: "var(--hover-bg)",
            borderRadius: "99px",
            fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
            fontFamily: "var(--font-mono)"
        }}>
            <span style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#22c55e",
                animation: "pulse 2s ease-in-out infinite"
            }} />
            <span style={{ color: "var(--text-secondary)" }}>{status}</span>
            <span style={{ color: "var(--text-muted)" }}>•</span>
            <span style={{ color: "var(--text-muted)" }}>{time}</span>
        </div>
    );
}

export default function NowPage() {
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
                        <StatusPill status="Online" time="Jakarta" />

                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
                            fontWeight: 400,
                            letterSpacing: "-0.03em",
                            lineHeight: 1.1,
                            marginTop: "clamp(1.5rem, 3vh, 2rem)",
                            marginBottom: "clamp(1rem, 2vh, 1.5rem)",
                            color: "var(--foreground)",
                            maxWidth: "16ch"
                        }}>
                            Lagi ngapain aja sekarang?
                        </h1>

                        <p style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                            color: "var(--text-secondary)",
                            maxWidth: "45ch",
                            lineHeight: 1.6,
                            margin: 0
                        }}>
                            A living document. Snapshot of current priorities,
                            obsessions, dan hal-hal yang lagi makan bandwidth gue sekarang.
                        </p>

                        <p style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
                            color: "var(--text-muted)",
                            marginTop: "clamp(1.5rem, 3vh, 2rem)"
                        }}>
                            Last updated: January 2026 · Jakarta
                        </p>
                    </div>
                </Container>
            </section>

            {/* Main Content */}
            <Container>
                <div className="animate-fade-in animation-delay-200" style={{ maxWidth: "42rem" }}>

                    {/* Current Focus */}
                    <section style={{ marginBottom: "clamp(3rem, 6vh, 4rem)" }}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            marginBottom: "clamp(1.25rem, 3vh, 1.75rem)"
                        }}>
                            <Target className="w-4 h-4" style={{ color: "var(--accent)" }} />
                            <h2 style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
                                fontWeight: 500,
                                margin: 0
                            }}>
                                Main Quest
                            </h2>
                        </div>

                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "clamp(0.75rem, 2vh, 1rem)"
                        }}>
                            <FocusItem
                                icon={Brain}
                                title="Deep diving into Agentic AI"
                                description="Exploring LLM orchestration, tool-use patterns, dan bikin sistem yang bisa 'mikir' sendiri. Fascinating stuff."
                                progress={65}
                                accent
                            />
                            <FocusItem
                                icon={Sparkles}
                                title="Building this digital garden"
                                description="You're looking at it. Pengen bikin space yang reflects how my brain actually works—chaotic but intentional."
                                progress={40}
                                accent
                            />
                        </div>
                    </section>

                    {/* Side Quests */}
                    <section style={{ marginBottom: "clamp(3rem, 6vh, 4rem)" }}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            marginBottom: "clamp(1.25rem, 3vh, 1.75rem)"
                        }}>
                            <Flame className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />
                            <h2 style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
                                fontWeight: 500,
                                margin: 0
                            }}>
                                Side Quests
                            </h2>
                        </div>

                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem"
                        }}>
                            <FocusItem
                                icon={Pencil}
                                title="Writing 'The Art of Code Deletion'"
                                description="An essay about why deleting code is harder (and more valuable) than writing it. Still drafting."
                            />
                            <FocusItem
                                icon={BookOpen}
                                title="Reading 'Thinking, Fast and Slow'"
                                description="Kahneman's masterpiece. Slow progress—tiap chapter butuh digesting lama. Worth it."
                            />
                            <FocusItem
                                icon={Coffee}
                                title="Experimenting with pour-over"
                                description="Currently obsessed with V60 technique. The ritual matters as much as the result."
                            />
                        </div>
                    </section>

                    {/* Currently Playing */}
                    <section>
                        <MusicPlayer />
                    </section>

                    {/* Inspirational footer */}
                    <div style={{
                        marginTop: "clamp(3rem, 6vh, 4rem)",
                        paddingTop: "clamp(2rem, 4vh, 3rem)",
                        borderTop: "1px solid var(--border)",
                        textAlign: "center"
                    }}>
                        <p style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(1.1rem, 3vw, 1.35rem)",
                            fontStyle: "italic",
                            color: "var(--text-secondary)",
                            maxWidth: "35ch",
                            margin: "0 auto",
                            lineHeight: 1.5
                        }}>
                            "The secret of getting ahead is getting started."
                        </p>
                        <p style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "clamp(0.7rem, 1.5vw, 0.8rem)",
                            color: "var(--text-muted)",
                            marginTop: "0.75rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em"
                        }}>
                            — Mark Twain
                        </p>
                    </div>
                </div>
            </Container>
        </div>
    );
}
