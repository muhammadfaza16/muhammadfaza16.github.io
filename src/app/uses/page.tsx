import { Container } from "@/components/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Uses | The Almanac of Broken Wanderer",
    description: "Daftar alat tempur: hardware, software, dan desk setup.",
};

const DISCLAIMER = "🛠️ Konten di halaman ini masih berupa dummy/placeholder. Akan segera diperbarui dengan data asli.";

const categories = [
    {
        name: "💻 Hardware",
        items: [
            {
                title: "MacBook Pro 14\" M3 Pro",
                description: "Daily driver untuk coding dan segala pekerjaan. Performanya luar biasa untuk development.",
            },
            {
                title: "Dell UltraSharp 27\" 4K Monitor",
                description: "External monitor untuk produktivitas. Color accuracy yang bagus untuk design work.",
            },
            {
                title: "Keychron K2 Pro",
                description: "Mechanical keyboard dengan switch Gateron Brown. Perfect balance antara tactile dan noise.",
            },
            {
                title: "Logitech MX Master 3S",
                description: "Mouse yang ergonomis dengan gesture control. Sudah 3 tahun dan masih awet.",
            },
            {
                title: "Sony WH-1000XM5",
                description: "Noise cancelling headphone untuk fokus kerja. ANC-nya top tier.",
            },
        ],
    },
    {
        name: "🖥️ Development",
        items: [
            {
                title: "VS Code",
                description: "Main editor untuk semua jenis development. Dengan extension yang curated.",
            },
            {
                title: "Warp Terminal",
                description: "Terminal modern dengan AI assistant. Game changer untuk CLI workflow.",
            },
            {
                title: "GitHub Copilot",
                description: "AI pair programmer yang sudah jadi bagian essential dari workflow.",
            },
            {
                title: "Docker Desktop",
                description: "Untuk containerization dan local development environment.",
            },
            {
                title: "Postman",
                description: "API testing dan documentation. Kolaborasi dengan tim jadi lebih mudah.",
            },
        ],
    },
    {
        name: "📱 Apps & Productivity",
        items: [
            {
                title: "Raycast",
                description: "Spotlight replacement yang supercharge Mac workflow. Extensions-nya powerful.",
            },
            {
                title: "Notion",
                description: "Second brain untuk notes, docs, dan project management.",
            },
            {
                title: "Arc Browser",
                description: "Browser yang reimagine cara kita browsing. Tab management yang brilliant.",
            },
            {
                title: "Obsidian",
                description: "Untuk personal knowledge management dan journaling.",
            },
            {
                title: "Figma",
                description: "Design tool untuk UI/UX dan brainstorming visual.",
            },
        ],
    },
    {
        name: "🏠 Desk Setup",
        items: [
            {
                title: "IKEA BEKANT Desk",
                description: "Standing desk yang adjustable. Berganti posisi tiap beberapa jam.",
            },
            {
                title: "Herman Miller Aeron",
                description: "Investment untuk kesehatan punggung. Worth every penny.",
            },
            {
                title: "Elgato Key Light",
                description: "Untuk video calls dan content creation. Pencahayaan yang proper.",
            },
            {
                title: "Rain Design mStand",
                description: "Laptop stand yang elevate MacBook ke eye level.",
            },
        ],
    },
];

export default function UsesPage() {
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
                        My Setup
                    </span>
                    <h1 style={{
                        fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                        fontWeight: 700,
                        color: "var(--foreground)"
                    }}>
                        Uses
                    </h1>
                    <p style={{
                        marginTop: "1rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.6,
                        maxWidth: "35rem"
                    }}>
                        Hardware, software, dan tools yang saya gunakan sehari-hari untuk bekerja dan berkarya.
                    </p>
                    <p style={{ marginTop: "0.75rem", fontSize: "0.9rem", color: "var(--text-secondary)", fontStyle: "italic" }}>
                        Terakhir diperbarui: Januari 2026
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

                {/* Categories */}
                <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
                    {categories.map((category) => (
                        <section key={category.name}>
                            <h2 style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "1.25rem",
                                marginBottom: "1.5rem",
                                borderBottom: "1px solid var(--border)",
                                paddingBottom: "0.5rem"
                            }}>
                                {category.name}
                            </h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                {category.items.map((item) => (
                                    <div
                                        key={item.title}
                                        style={{
                                            padding: "1.25rem",
                                            borderRadius: "8px",
                                            backgroundColor: "var(--card-bg)",
                                            border: "1px solid var(--border)",
                                        }}
                                    >
                                        <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--foreground)" }}>
                                            {item.title}
                                        </h3>
                                        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                            {item.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Footer note */}
                <footer style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid var(--border)" }}>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                        <span style={{ filter: "grayscale(1)" }}>💡</span> <strong>Note:</strong> Halaman ini terinspirasi oleh gerakan <a href="https://uses.tech" target="_blank" rel="noopener noreferrer" className="link-underline">/uses</a>.
                        Semua produk di sini adalah yang benar-benar saya gunakan, bukan endorsement.
                    </p>
                </footer>

            </div>
        </Container>
    );
}
