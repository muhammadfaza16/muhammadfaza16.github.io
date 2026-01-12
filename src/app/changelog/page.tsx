import { Container } from "@/components/Container";
import { Disclaimer } from "@/components/Disclaimer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Changelog | The Almanac of Broken Wanderer",
    description: "Timeline perjalanan karir dan hidup saya.",
};

const timeline = [
    {
        year: "2026",
        events: [
            {
                month: "Jan",
                title: "Personal Blog Launch",
                description: "Akhirnya rilis The Almanac! Bukan sekadar portfolio, tapi ruang berekspresi tanpa algoritma. Built with Next.js & unpolished thoughts.",
                type: "Project",
                color: "var(--foreground)"
            },
        ]
    },
    {
        year: "2025",
        events: [
            {
                month: "Dec",
                title: "Exploring Agentic AI",
                description: "Mulai deep dive ke pattern AI agents. Ternyata lebih dari sekadar chatbot; ini masa depan autonomous workflow.",
                type: "Learning",
                color: "#9333ea" // Purple
            },
            {
                month: "Aug",
                title: "Senior Engineer Promotion",
                description: "Naik level jadi Senior. Coding berkurang, meeting bertambah, tapi impact makin luas. Shifting focus ke system design.",
                type: "Career",
                color: "#d97706" // Amber
            },
            {
                month: "Mar",
                title: "Open Source Contribution",
                description: "PR pertama merge ke major OSS project. Deg-degan tapi puas rasanya bisa contribute back ke tools yang dipakai tiap hari.",
                type: "Project",
                color: "var(--foreground)"
            },
        ]
    },
    {
        year: "2024",
        events: [
            {
                month: "Nov",
                title: "Clean Architecture Implementation",
                description: "Selesai refactor legacy core system pakai Clean Arch. Testability naik drastis, tidur jadi lebih nyenyak.",
                type: "Learning",
                color: "#9333ea"
            },
            {
                month: "Jun",
                title: "Joined Tech Startup",
                description: "Pindah ke environment startup yang fast-paced. Tech stack modern, kultur sat-set, dan challenge baru.",
                type: "Career",
                color: "#d97706"
            },
            {
                month: "Feb",
                title: "First SaaS Revenue",
                description: "Iseng bikin side project, eh ada yang bayar. $10 pertama yang rasanya lebih manis dari gaji bulanan. Validation milestone unlocked.",
                type: "Project",
                color: "var(--foreground)"
            },
        ]
    },
    {
        year: "2023",
        events: [
            {
                month: "Sep",
                title: "Technical Writing",
                description: "Mulai rutin nulis artikel teknis di Medium. Documenting my ignorance in public.",
                type: "Milestone",
                color: "#16a34a" // Green
            },
            {
                month: "Jan",
                title: "University Graduation",
                description: "Lulus S1 Informatika. Bye-bye tugas akhir, hello real world problems.",
                type: "Milestone",
                color: "#16a34a"
            },
        ]
    },
];

export default function ChangelogPage() {
    return (
        <section style={{ paddingTop: "15vh", paddingBottom: "10rem" }}>
            <Container>
                <div className="animate-fade-in" style={{ maxWidth: "60rem", margin: "0 auto" }}>

                    <header style={{ marginBottom: "8rem", textAlign: "center" }}>
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(3.5rem, 8vw, 6rem)",
                            fontWeight: 700,
                            letterSpacing: "-0.02em",
                            lineHeight: 1,
                            marginBottom: "2rem",
                            color: "var(--foreground)"
                        }}>
                            Changelog.
                        </h1>
                        <p style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "1.25rem",
                            lineHeight: 1.6,
                            color: "var(--text-secondary)",
                            maxWidth: "40rem",
                            margin: "0 auto",
                            fontStyle: "italic"
                        }}>
                            A living history. Milestones, bugs fixed, and lessons learned along the way.
                        </p>
                    </header>

                    <div className="mb-16">
                        <Disclaimer>
                            Konten di halaman ini masih berupa dummy/placeholder, tapi vibe-nya udah dapet.
                        </Disclaimer>
                    </div>

                    {/* Timeline */}
                    <div style={{ position: "relative", paddingLeft: "1rem" }}>
                        {/* Continuous Vertical Line */}
                        <div style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: "2rem",
                            width: "1px",
                            backgroundColor: "var(--border)",
                            zIndex: -1
                        }} />

                        <div style={{ display: "flex", flexDirection: "column", gap: "6rem" }}>
                            {timeline.map((yearData) => (
                                <section key={yearData.year}>
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "2rem",
                                        marginBottom: "3rem"
                                    }}>
                                        <div style={{
                                            width: "2rem", // Aligns with the vertical line
                                            display: "flex",
                                            justifyContent: "center"
                                        }}>
                                            <span style={{
                                                width: "8px",
                                                height: "8px",
                                                backgroundColor: "var(--foreground)",
                                                borderRadius: "50%",
                                                boxShadow: "0 0 0 4px var(--background)" // Masking effect
                                            }} />
                                        </div>
                                        <h2 style={{
                                            fontFamily: "'Playfair Display', serif",
                                            fontSize: "2.5rem",
                                            fontWeight: 700,
                                            color: "var(--foreground)"
                                        }}>
                                            {yearData.year}
                                        </h2>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", paddingLeft: "3.5rem" }}>
                                        {yearData.events.map((event, idx) => {
                                            return (
                                                <div key={idx} className="group" style={{
                                                    display: "grid",
                                                    gridTemplateColumns: "1fr",
                                                    gap: "1.5rem",
                                                    position: "relative",
                                                    padding: "1.5rem",
                                                    // No card background, clean look
                                                }}>
                                                    <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem" }}>
                                                                <h3 style={{
                                                                    fontFamily: "'Playfair Display', serif",
                                                                    fontSize: "1.5rem",
                                                                    fontWeight: 600,
                                                                    color: "var(--foreground)",
                                                                    lineHeight: 1.2
                                                                }}>
                                                                    {event.title}
                                                                </h3>
                                                                <span style={{
                                                                    fontFamily: "var(--font-mono)",
                                                                    fontSize: "0.85rem",
                                                                    color: "var(--text-secondary)",
                                                                    textTransform: "uppercase",
                                                                    letterSpacing: "0.05em",
                                                                    fontWeight: 600
                                                                }}>
                                                                    {event.month}
                                                                </span>
                                                            </div>

                                                            <p style={{
                                                                fontSize: "1.1rem",
                                                                color: "var(--text-secondary)",
                                                                lineHeight: 1.6,
                                                                fontFamily: "'Source Serif 4', serif"
                                                            }}>
                                                                {event.description}
                                                            </p>

                                                            <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                                                                <span style={{
                                                                    fontFamily: "var(--font-mono)",
                                                                    fontSize: "0.75rem",
                                                                    color: event.color.includes('text-') ? "var(--text-secondary)" : event.color, // Fallback for color string format
                                                                    fontWeight: 600,
                                                                    textTransform: "uppercase"
                                                                }}>
                                                                    {event.type}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            ))}
                        </div>
                    </div>

                    <footer style={{ marginTop: "8rem", textAlign: "center", opacity: 0.5, fontSize: "0.9rem" }}>
                        {/* Disclaimer moved to top */}
                    </footer>

                </div>
            </Container>
        </section>
    );
}
