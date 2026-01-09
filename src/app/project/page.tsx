import { Container } from "@/components/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Project | The Almanac of Broken Wanderer",
    description: "Project dan eksperimen yang lagi dikerjain.",
};

export default function ProjectPage() {
    return (
        <section style={{ paddingTop: "6rem", paddingBottom: "6rem" }}>
            <Container>
                <div className="animate-fade-in">
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                        fontWeight: 700,
                        marginBottom: "1.5rem",
                        color: "var(--foreground)"
                    }}>
                        Project
                    </h1>
                    <p style={{
                        fontSize: "1.1rem",
                        color: "var(--text-secondary)",
                        marginBottom: "3rem",
                        maxWidth: "42rem"
                    }}>
                        Tempat nampilin project-project yang lagi dikerjain. Mungkin berguna, mungkin juga cuma iseng.
                    </p>
                </div>

                {/* Empty state */}
                <div
                    className="animate-fade-in animation-delay-200"
                    style={{
                        padding: "5rem 2rem",
                        border: "1px dashed var(--border)",
                        borderRadius: "12px",
                        textAlign: "center",
                        color: "var(--text-secondary)",
                        backgroundColor: "rgba(0,0,0,0.02)"
                    }}
                >
                    <p style={{ marginBottom: "0.75rem", fontSize: "3rem" }}>🚧</p>
                    <p style={{ marginBottom: "0.5rem", fontSize: "1.25rem", fontWeight: 500 }}>
                        Masih kosong, belum ada yang bisa di-pamer-in.
                    </p>
                    <p style={{ fontSize: "1rem", opacity: 0.7 }}>
                        Lagi ngulik sesuatu... stay tuned! ✨
                    </p>
                </div>
            </Container>
        </section>
    );
}
