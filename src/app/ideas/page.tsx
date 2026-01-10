import { Container } from "@/components/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Ideas | The Almanac of Broken Wanderer",
    description: "Koleksi pemikiran pendek yang belum jadi artikel.",
};

const DISCLAIMER = <span style={{ filter: "grayscale(1)" }}>💡 Konten di halaman ini masih berupa dummy/placeholder. Akan segera diperbarui dengan ide-ide asli.</span>;

const ideas = [
    {
        id: 1,
        content: "Produktivitas sejati bukan tentang melakukan lebih banyak hal, tapi tentang menghilangkan hal-hal yang tidak penting.",
        date: "Jan 10, 2026",
        tags: ["productivity", "philosophy"],
        status: "seed" as const,
    },
    {
        id: 2,
        content: "AI tidak akan menggantikan programmer. Tapi programmer yang menggunakan AI akan menggantikan yang tidak.",
        date: "Jan 8, 2026",
        tags: ["ai", "programming"],
        status: "growing" as const,
    },
    {
        id: 3,
        content: "Menulis adalah cara terbaik untuk berpikir. Jika kamu tidak bisa menjelaskan sesuatu secara tertulis, berarti kamu belum benar-benar memahaminya.",
        date: "Jan 5, 2026",
        tags: ["writing", "thinking"],
        status: "evergreen" as const,
    },
    {
        id: 4,
        content: "Kode yang baik adalah kode yang tidak perlu ditulis. Arsitektur terbaik adalah yang paling sederhana untuk memenuhi kebutuhan.",
        date: "Jan 3, 2026",
        tags: ["programming", "architecture"],
        status: "growing" as const,
    },
    {
        id: 5,
        content: "Belajar bahasa baru mengubah cara kita berpikir. Begitu juga dengan belajar bahasa pemrograman baru.",
        date: "Dec 28, 2025",
        tags: ["learning", "programming"],
        status: "seed" as const,
    },
    {
        id: 6,
        content: "Kita overestimate apa yang bisa dicapai dalam 1 hari, tapi underestimate apa yang bisa dicapai dalam 1 tahun dengan konsistensi.",
        date: "Dec 20, 2025",
        tags: ["consistency", "growth"],
        status: "evergreen" as const,
    },
];

const statusConfig = {
    seed: { emoji: "🌱", label: "Seed", color: "#4ade80" },
    growing: { emoji: "🌿", label: "Growing", color: "#facc15" },
    evergreen: { emoji: "🌲", label: "Evergreen", color: "#22d3ee" },
};

export default function IdeasPage() {
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
                        Digital Garden
                    </span>
                    <h1 style={{
                        fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                        fontWeight: 700,
                        color: "var(--foreground)"
                    }}>
                        Ideas
                    </h1>
                    <p style={{
                        marginTop: "1rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.6,
                        maxWidth: "35rem"
                    }}>
                        Pemikiran pendek yang melintas di kepala. Beberapa masih berupa benih 🌱, ada yang sedang tumbuh 🌿, dan ada yang sudah menjadi evergreen 🌲.
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
                    marginBottom: "2rem",
                    flexWrap: "wrap"
                }}>
                    {Object.entries(statusConfig).map(([key, config]) => (
                        <span key={key} style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                            {config.emoji} {config.label}
                        </span>
                    ))}
                </div>

                {/* Ideas Grid */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    {ideas.map((idea) => {
                        const status = statusConfig[idea.status];
                        return (
                            <article key={idea.id} style={{
                                padding: "1.5rem",
                                borderRadius: "8px",
                                backgroundColor: "var(--card-bg)",
                                border: "1px solid var(--border)",
                                borderLeft: `3px solid ${status.color}`,
                                transition: "transform 0.2s ease"
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                                    <span style={{ fontSize: "1.25rem" }}>{status.emoji}</span>
                                    <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
                                        {idea.date}
                                    </span>
                                </div>
                                <p style={{
                                    fontSize: "1.05rem",
                                    lineHeight: 1.7,
                                    color: "var(--foreground)"
                                }}>
                                    {idea.content}
                                </p>
                                <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
                                    {idea.tags.map((tag) => (
                                        <span key={tag} style={{
                                            fontSize: "0.75rem",
                                            padding: "0.25rem 0.75rem",
                                            backgroundColor: "var(--hover-bg)",
                                            borderRadius: "999px",
                                            color: "var(--text-secondary)",
                                            fontFamily: "var(--font-mono)"
                                        }}>
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </article>
                        );
                    })}
                </div>

            </div>
        </Container>
    );
}
