import { Container } from "@/components/Container";
import { Disclaimer } from "@/components/Disclaimer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Ideas | The Almanac of Broken Wanderer",
    description: "Digital Garden - Kumpulan ide dan pemikiran setengah matang.",
};

type IdeaStatus = "seed" | "growing" | "evergreen";

const statusConfig: Record<IdeaStatus, { label: string; color: string; description: string }> = {
    seed: { label: "Seed", color: "#a8a29e", description: "Baru ide lintasan, belum di-validasi." },     // Stone Grey
    growing: { label: "Growing", color: "#d97706", description: "Lagi di-develop, mulai kelihatan bentuknya." }, // Amber
    evergreen: { label: "Evergreen", color: "#16a34a", description: "Konsep matang yang relevan jangka panjang." } // Green
};

const ideas: { id: number; date: string; content: string; status: IdeaStatus; tags: string[] }[] = [
    {
        id: 1,
        date: "Jan 2026",
        content: "Konsep 'Digital Monastery' buat developer. Bukan detox sepenuhnya dari teknologi, tapi intentional use. Space dimana kita coding bukan buat hustle, tapi commiting to craft. Kayak biksu yang nyapu kuil.",
        status: "seed",
        tags: ["philosophy", "lifestyle"]
    },
    {
        id: 2,
        date: "Dec 2025",
        content: "Kenapa ya UI tools sekarang makin komplex? Figma udah kayak OS sendiri. Kepikiran bikin design tool yang constraint-based. Cuma bisa pake tokens yang udah define di code. Reverse engineering design process.",
        status: "growing",
        tags: ["product", "devtools"]
    },
    {
        id: 3,
        date: "Nov 2025",
        content: "Local-first software is the future. Capek sama SaaS yang lemot dan data hostage. Apps harusnya works offline by default, sync cuma fitur tambahan. SQLite in browser + CRDTs = Magic ✨",
        status: "evergreen",
        tags: ["tech", "architecture"]
    },
    {
        id: 4,
        date: "Oct 2025",
        content: "Bikin CLI tool buat generate boilerplate project, tapi opinionated banget. Ga ada config file. Take it or leave it. Kadang decision fatigue itu musuh terbesar productivity.",
        status: "seed",
        tags: ["devtools", "dx"]
    }
];

export default function IdeasPage() {
    return (
        <section style={{ paddingTop: "15vh", paddingBottom: "10rem" }}>
            <Container>
                <div className="animate-fade-in" style={{ maxWidth: "65ch", margin: "0 auto" }}>

                    <header style={{ marginBottom: "8rem", textAlign: "center" }}>
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(4rem, 12vw, 8rem)",
                            fontWeight: 400,
                            letterSpacing: "-0.05em",
                            lineHeight: 0.9,
                            marginBottom: "3rem",
                            color: "var(--foreground)"
                        }}>
                            Digital Garden
                        </h1>
                        <p style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "1.25rem",
                            lineHeight: 1.4,
                            color: "var(--text-secondary)",
                            maxWidth: "40rem",
                            margin: "0 auto",
                            fontStyle: "italic"
                        }}>
                            Just random thoughts. Kadang cuma "what if", kadang jadi cikal bakal project serius.
                        </p>
                    </header>

                    <div className="mb-16">
                        <Disclaimer>
                            Digital Garden. No commitment attached.
                        </Disclaimer>
                    </div>

                    {/* Legend - Functional Minimalist */}
                    <div style={{
                        display: "flex",
                        gap: "2rem",
                        marginBottom: "4rem",
                        paddingBottom: "2rem",
                        borderBottom: "1px solid var(--border)",
                        justifyContent: "center",
                        flexWrap: "wrap"
                    }}>
                        {Object.entries(statusConfig).map(([key, config]) => (
                            <div key={key} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: config.color }} />
                                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>
                                    {config.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Ideas List */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
                        {ideas.map((idea) => {
                            const status = statusConfig[idea.status];
                            return (
                                <article key={idea.id} style={{ position: "relative" }}>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "baseline",
                                        marginBottom: "1rem"
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: status.color }}
                                                title={status.label}
                                            />
                                            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                                                {idea.date}
                                            </span>
                                        </div>
                                    </div>

                                    <p style={{
                                        fontSize: "1.15rem",
                                        lineHeight: 1.6,
                                        color: "var(--foreground)",
                                        marginBottom: "1rem",
                                        fontFamily: "'Source Serif 4', serif"
                                    }}>
                                        {idea.content}
                                    </p>

                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                        {idea.tags.map((tag) => (
                                            <span key={tag} style={{
                                                fontSize: "0.75rem",
                                                fontFamily: "var(--font-mono)",
                                                color: "var(--text-secondary)",
                                                opacity: 0.7
                                            }}>
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    <footer style={{ marginTop: "8rem", textAlign: "center", opacity: 0.5, fontSize: "0.9rem" }}>
                        {/* Disclaimer moved to top */}
                    </footer>

                </div>
            </Container>
        </section>
    );
}
