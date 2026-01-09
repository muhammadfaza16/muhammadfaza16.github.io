import { Container } from "@/components/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Now | The Almanac of Broken Wanderer",
    description: "Apa yang sedang saya kerjakan sekarang.",
};

export default function NowPage() {
    return (
        <Container>
            <div className="animate-fade-in-up" style={{ maxWidth: "45rem", marginTop: "2rem", marginBottom: "6rem" }}>

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
                        What I'm doing now
                    </span>
                    <h1 style={{
                        fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                        fontWeight: 700,
                        color: "var(--foreground)"
                    }}>
                        Now
                    </h1>
                    <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "var(--text-secondary)", fontStyle: "italic" }}>
                        Terakhir diperbarui: Januari 2026
                    </p>
                </header>

                <div className="content-block" style={{ marginBottom: "3rem" }}>
                    <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "1.25rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>
                        🎯 Fokus Utama
                    </h2>
                    <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "1rem", color: "var(--foreground)" }}>
                        <li style={{ display: "flex", gap: "1rem", alignItems: "baseline" }}>
                            <span style={{ color: "var(--accent)" }}>→</span>
                            <span>Mengembangkan <strong>Personal Brand & Blog</strong> ini menjadi lebih serius.</span>
                        </li>
                        <li style={{ display: "flex", gap: "1rem", alignItems: "baseline" }}>
                            <span style={{ color: "var(--accent)" }}>→</span>
                            <span>Mempelajari <strong>Agentic AI</strong> dan penerapannya dalam software engineering (Deepmind's approach).</span>
                        </li>
                        <li style={{ display: "flex", gap: "1rem", alignItems: "baseline" }}>
                            <span style={{ color: "var(--accent)" }}>→</span>
                            <span>Menulis setidaknya satu artikel teknis setiap minggu.</span>
                        </li>
                    </ul>
                </div>

                <div className="content-block" style={{ marginBottom: "3rem" }}>
                    <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "1.25rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>
                        📚 Sedang Dibaca
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1.5rem" }}>
                        <div style={{ padding: "1.5rem", borderRadius: "8px", backgroundColor: "var(--card-bg)", border: "1px solid var(--border)" }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }}>Thinking, Fast and Slow</h3>
                            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Daniel Kahneman</p>
                            <div style={{ marginTop: "1rem", height: "4px", width: "100%", backgroundColor: "var(--border)", borderRadius: "2px" }}>
                                <div style={{ height: "100%", width: "45%", backgroundColor: "var(--foreground)", borderRadius: "2px" }}></div>
                            </div>
                            <p style={{ fontSize: "0.75rem", textAlign: "right", marginTop: "0.5rem", opacity: 0.6 }}>45%</p>
                        </div>

                        <div style={{ padding: "1.5rem", borderRadius: "8px", backgroundColor: "var(--card-bg)", border: "1px solid var(--border)" }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }}>Clean Architecture</h3>
                            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Robert C. Martin</p>
                            <div style={{ marginTop: "1rem", height: "4px", width: "100%", backgroundColor: "var(--border)", borderRadius: "2px" }}>
                                <div style={{ height: "100%", width: "12%", backgroundColor: "var(--foreground)", borderRadius: "2px" }}></div>
                            </div>
                            <p style={{ fontSize: "0.75rem", textAlign: "right", marginTop: "0.5rem", opacity: 0.6 }}>12%</p>
                        </div>
                    </div>
                </div>

                <div className="content-block">
                    <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "1.25rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>
                        🎵 On Repeat
                    </h2>
                    <p style={{ color: "var(--text-secondary)" }}>
                        Playlist: <em>Lofi Girl - chill lofi beats to study/relax to</em>.
                    </p>
                </div>

                <footer style={{ marginTop: "5rem", fontSize: "0.85rem", color: "var(--text-secondary)", opacity: 0.7 }}>
                    <p>Halaman ini terinspirasi oleh gerakan <a href="https://nownownow.com/about" target="_blank" className="link-underline">/now</a>.</p>
                </footer>

            </div>
        </Container>
    );
}
