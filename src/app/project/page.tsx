import { Container } from "@/components/Container";
import { Disclaimer } from "@/components/Disclaimer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Project | The Almanac of Broken Wanderer",
    description: "Project dan eksperimen yang lagi dikerjain.",
};

const projects = [
    {
        id: 1,
        title: "Opus",
        description: "Project management tool tapi khusus buat personal use. Bosen sama Jira yang terlalu enterprise, dan Notion yang terlalu bebas. I need structure but with soul.",
        tech: ["Next.js", "PostgreSQL", "Tailwind"],
        status: "Active",
        statusColor: "#16a34a"
    },
    {
        id: 2,
        title: "Zen Focus",
        description: "Browser extension buat block distraction. Simpel, cuma satu tombol 'Zen Mode'. Kalau aktif, semua feed/timeline di-hide. Balik ke fungsi awal internet: informasi, bukan distraksi.",
        tech: ["Chrome Ext", "React"],
        status: "Beta",
        statusColor: "#d97706"
    },
    {
        id: 3,
        title: "Legacy Code Remaster",
        description: "Iseng refactor open source project lama yang udah abandonware. kasih napas baru, upgrade dependency, dan modernizing UI-nya. Just for fun.",
        tech: ["TypeScript", "Refactoring"],
        status: "Paused",
        statusColor: "#a8a29e"
    }
];

export default function ProjectPage() {
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
                            Project.
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
                            Things I build when I'm bored. Laboratorium eksperimen tanpa deadline.
                        </p>
                    </header>

                    <div className="mb-16">
                        <Disclaimer>
                            Project di bawah ini cuma dummy/mockup buat portfolio.
                        </Disclaimer>
                    </div>

                    {/* Project List */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "5rem" }}>
                        {projects.map((project) => (
                            <article key={project.id} style={{ position: "relative" }}>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "baseline",
                                    marginBottom: "1rem"
                                }}>
                                    <h2 style={{
                                        fontFamily: "'Playfair Display', serif",
                                        fontSize: "2rem",
                                        fontWeight: 400,
                                        color: "var(--foreground)"
                                    }}>
                                        {project.title}
                                    </h2>

                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: project.statusColor }} />
                                        <span style={{
                                            fontFamily: "var(--font-mono)",
                                            fontSize: "0.75rem",
                                            color: "var(--text-secondary)",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.05em"
                                        }}>
                                            {project.status}
                                        </span>
                                    </div>
                                </div>

                                <p style={{
                                    fontSize: "1.15rem",
                                    lineHeight: 1.6,
                                    color: "var(--text-secondary)",
                                    marginBottom: "1.5rem",
                                    fontFamily: "'Source Serif 4', serif"
                                }}>
                                    {project.description}
                                </p>

                                <div style={{ display: "flex", gap: "0.75rem" }}>
                                    {project.tech.map((t) => (
                                        <span key={t} style={{
                                            fontFamily: "var(--font-mono)",
                                            fontSize: "0.75rem",
                                            color: "var(--foreground)",
                                            padding: "0.25rem 0.75rem",
                                            border: "1px solid var(--border)",
                                            borderRadius: "99px"
                                        }}>
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>

                    <footer style={{ marginTop: "8rem", textAlign: "center", opacity: 0.5, fontSize: "0.9rem" }}>
                        <p>More projects on <a href="https://github.com/muhammadfaza16" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>GitHub</a>.</p>
                    </footer>

                </div>
            </Container>
        </section>
    );
}
