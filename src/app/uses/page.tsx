import { Container } from "@/components/Container";
import { Disclaimer } from "@/components/Disclaimer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Uses | The Almanac of Broken Wanderer",
    description: "Daftar alat tempur: hardware, software, dan desk setup.",
};

const categories = [
    {
        name: "Hardware",
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
        name: "Development",
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
        name: "Apps & Productivity",
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
        name: "Desk Setup",
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
                            Uses.
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
                            Tools of the trade.
                        </p>
                    </header>

                    <div className="mb-16">
                        <Disclaimer>
                            Konten di halaman ini masih berupa dummy/placeholder.
                        </Disclaimer>
                    </div>

                    {/* Categories */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8rem" }}>
                        {categories.map((category) => (
                            <section key={category.name}>
                                <h2 style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: "2rem",
                                    fontWeight: 400,
                                    marginBottom: "3rem",
                                    textAlign: "center"
                                }}>
                                    {category.name}
                                </h2>
                                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                                    {category.items.map((item) => (
                                        <li key={item.title}>
                                            <h3 style={{
                                                fontFamily: "'Source Serif 4', serif",
                                                fontSize: "1.25rem",
                                                fontWeight: 500,
                                                marginBottom: "0.5rem",
                                                color: "var(--foreground)"
                                            }}>
                                                {item.title}
                                            </h3>
                                            <p style={{
                                                fontSize: "1.1rem",
                                                color: "var(--text-secondary)",
                                                lineHeight: 1.6,
                                                fontFamily: "'Source Serif 4', serif"
                                            }}>
                                                {item.description}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        ))}
                    </div>

                    {/* Footer note */}
                    <footer style={{ marginTop: "8rem", paddingTop: "2rem", borderTop: "1px solid var(--border)", textAlign: "center" }}>
                        <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.6, fontFamily: "'Source Serif 4', serif" }}>
                            Halaman ini terinspirasi oleh gerakan <a href="https://uses.tech" target="_blank" rel="noopener noreferrer" className="link-underline" style={{ color: "var(--foreground)" }}>/uses</a>.<br />
                            Semua produk di sini adalah yang benar-benar saya gunakan.
                        </p>
                    </footer>

                </div>
            </Container>
        </section>
    );
}
