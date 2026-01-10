import { Container } from "@/components/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Changelog | The Almanac of Broken Wanderer",
    description: "Timeline perjalanan karir dan hidup saya.",
};

const DISCLAIMER = "📝 Konten di halaman ini masih berupa dummy/placeholder. Akan segera diperbarui dengan data asli.";

const timeline = [
    {
        year: "2026",
        events: [
            {
                month: "Jan",
                title: "Launched Personal Blog",
                description: "Memulai The Almanac of Broken Wanderer sebagai ruang untuk berbagi pemikiran dan catatan.",
                type: "project" as const,
            },
        ]
    },
    {
        year: "2025",
        events: [
            {
                month: "Dec",
                title: "Started Learning Agentic AI",
                description: "Mendalami konsep AI agents dan penerapannya dalam software engineering.",
                type: "learning" as const,
            },
            {
                month: "Aug",
                title: "Promoted to Senior Engineer",
                description: "Naik level setelah 2 tahun kontribusi di tim backend.",
                type: "career" as const,
            },
            {
                month: "Mar",
                title: "First Open Source Contribution",
                description: "Kontribusi pertama ke project open source populer.",
                type: "project" as const,
            },
        ]
    },
    {
        year: "2024",
        events: [
            {
                month: "Nov",
                title: "Completed Clean Architecture Book",
                description: "Selesai membaca dan mengimplementasi prinsip-prinsip dari buku Uncle Bob.",
                type: "learning" as const,
            },
            {
                month: "Jun",
                title: "Joined New Company",
                description: "Pindah ke perusahaan tech startup sebagai Software Engineer.",
                type: "career" as const,
            },
            {
                month: "Feb",
                title: "Built First SaaS Product",
                description: "Merilis produk SaaS pertama sebagai side project.",
                type: "project" as const,
            },
        ]
    },
    {
        year: "2023",
        events: [
            {
                month: "Sep",
                title: "Started Tech Blog Writing",
                description: "Mulai menulis artikel teknis di Medium dan personal blog.",
                type: "milestone" as const,
            },
            {
                month: "Jan",
                title: "Graduated from University",
                description: "Lulus S1 Informatika dengan fokus pada Software Engineering.",
                type: "milestone" as const,
            },
        ]
    },
];

const typeConfig = {
    career: { emoji: "💼", color: "#3b82f6" },
    project: { emoji: "🚀", color: "#22c55e" },
    learning: { emoji: "📚", color: "#f59e0b" },
    milestone: { emoji: "🏆", color: "#a855f7" },
};

export default function ChangelogPage() {
    return (
        <Container>
            <div className="animate-fade-in-up" style={{ maxWidth: "50rem", marginTop: "2rem", marginBottom: "6rem" }}>

                <header style={{ marginBottom: "3rem" }}>
                    <span style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.85rem",
                        color: "var(--text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        display: "block",
                        marginBottom: "0.5rem"
                    }}>
                        Personal Changelog
                    </span>
                    <h1 style={{
                        fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                        fontWeight: 700,
                        color: "var(--foreground)"
                    }}>
                        Changelog
                    </h1>
                    <p style={{
                        marginTop: "1rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.6,
                        maxWidth: "35rem"
                    }}>
                        Timeline perjalanan karir, project, dan milestone penting dalam hidup saya. Seperti changelog software, tapi untuk manusia.
                    </p>
                </header>

                {/* Disclaimer */}
                <div style={{
                    padding: "1rem 1.5rem",
                    backgroundColor: "var(--hover-bg)",
                    border: "1px dashed var(--border)",
                    borderRadius: "8px",
                    marginBottom: "3rem",
                    fontSize: "0.9rem",
                    color: "var(--text-secondary)"
                }}>
                    {DISCLAIMER}
                </div>

                {/* Legend */}
                <div style={{
                    display: "flex",
                    gap: "1.5rem",
                    marginBottom: "3rem",
                    flexWrap: "wrap"
                }}>
                    {Object.entries(typeConfig).map(([key, config]) => (
                        <span key={key} style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            {config.emoji} {key.charAt(0).toUpperCase() + key.slice(1)}
                        </span>
                    ))}
                </div>

                {/* Timeline */}
                <div style={{ position: "relative" }}>
                    {/* Vertical Line */}
                    <div style={{
                        position: "absolute",
                        left: "0.5rem",
                        top: "2rem",
                        bottom: "2rem",
                        width: "2px",
                        backgroundColor: "var(--border)"
                    }} />

                    {timeline.map((yearData) => (
                        <div key={yearData.year} style={{ marginBottom: "3rem" }}>
                            <h2 style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "1.5rem",
                                fontWeight: 700,
                                marginBottom: "1.5rem",
                                paddingLeft: "2rem",
                                color: "var(--foreground)"
                            }}>
                                {yearData.year}
                            </h2>

                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                {yearData.events.map((event, idx) => {
                                    const type = typeConfig[event.type];
                                    return (
                                        <div key={idx} style={{ display: "flex", gap: "1rem", position: "relative" }}>
                                            {/* Dot */}
                                            <div style={{
                                                width: "1rem",
                                                height: "1rem",
                                                borderRadius: "50%",
                                                backgroundColor: type.color,
                                                flexShrink: 0,
                                                marginTop: "0.25rem",
                                                zIndex: 1,
                                                border: "3px solid var(--background)"
                                            }} />

                                            {/* Content */}
                                            <div style={{
                                                flex: 1,
                                                padding: "1.25rem",
                                                borderRadius: "8px",
                                                backgroundColor: "var(--card-bg)",
                                                border: "1px solid var(--border)"
                                            }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                                                    <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>
                                                        {type.emoji} {event.title}
                                                    </h3>
                                                    <span style={{
                                                        fontSize: "0.75rem",
                                                        fontFamily: "var(--font-mono)",
                                                        color: "var(--text-secondary)",
                                                        backgroundColor: "var(--hover-bg)",
                                                        padding: "0.25rem 0.5rem",
                                                        borderRadius: "4px"
                                                    }}>
                                                        {event.month}
                                                    </span>
                                                </div>
                                                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                                    {event.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </Container>
    );
}
