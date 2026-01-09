import { Container } from "@/components/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Uses | The Almanac of Broken Wanderer",
    description: "Daftar alat tempur: hardware, software, dan desk setup.",
};

export default function UsesPage() {
    return (
        <Container>
            <div className="animate-fade-in-up" style={{ maxWidth: "45rem", marginTop: "2rem", marginBottom: "6rem" }}>

                <header style={{ marginBottom: "4rem" }}>
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                        fontWeight: 700,
                        marginBottom: "1.5rem",
                        color: "var(--foreground)"
                    }}>
                        Uses
                    </h1>
                </header>

                <div style={{
                    padding: "4rem 2rem",
                    border: "1px dashed var(--border)",
                    borderRadius: "8px",
                    textAlign: "center",
                    backgroundColor: "var(--hover-bg)"
                }}>
                    <span style={{ fontSize: "2.5rem", marginBottom: "1.5rem", display: "block" }}>🚧</span>
                    <h2 style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "1.25rem",
                        color: "var(--foreground)",
                        marginBottom: "1rem",
                        fontWeight: 600
                    }}>
                        Work in Progress
                    </h2>
                    <p style={{
                        color: "var(--text-secondary)",
                        maxWidth: "30rem",
                        margin: "0 auto",
                        lineHeight: 1.6
                    }}>
                        Halaman ini sedang dalam proses kurasi. Saya sedang mendata gears dan software yang saya gunakan supaya tidak ada yang terlewat. Cek lagi nanti ya!
                    </p>
                </div>

            </div>
        </Container>
    );
}
