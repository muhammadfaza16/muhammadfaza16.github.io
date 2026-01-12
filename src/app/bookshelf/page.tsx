import { Container } from "@/components/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bookshelf | The Almanac of Broken Wanderer",
    description: "Koleksi buku yang telah dan sedang saya baca.",
};

const books = [
    { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", status: "Reading", cover: "📘" },
    { title: "Clean Architecture", author: "Robert C. Martin", status: "Reading", cover: "📗" },
    { title: "Atomic Habits", author: "James Clear", status: "Finished", cover: "📕" },
    { title: "Sapiens", author: "Yuval Noah Harari", status: "Finished", cover: "📙" },
    { title: "Man's Search for Meaning", author: "Viktor E. Frankl", status: "Favorite", cover: "📘" },
    { title: "The Alchemist", author: "Paulo Coelho", status: "Favorite", cover: "📕" },
];

export default function BookshelfPage() {
    return (
        <div style={{ paddingBottom: "8rem" }}>
            <section style={{
                minHeight: "50vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingTop: "8rem",
                paddingBottom: "4rem"
            }}>
                <Container>
                    <div className="animate-fade-in-up">
                        <span style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.9rem",
                            color: "var(--accent)",
                            display: "block",
                            marginBottom: "1.5rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em"
                        }}>
                            The Library
                        </span>
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(3rem, 6vw, 5rem)",
                            fontWeight: 400,
                            letterSpacing: "-0.03em",
                            lineHeight: 1,
                            color: "var(--foreground)",
                            maxWidth: "18ch"
                        }}>
                            I read to live more consecutive lives.
                        </h1>
                    </div>
                </Container>
            </section>

            <Container>
                <div className="animate-fade-in animation-delay-300" style={{ maxWidth: "60rem", margin: "0 auto" }}>

                    {/* Disclaimer */}
                    <div style={{
                        padding: "1rem",
                        marginBottom: "4rem",
                        background: "rgba(var(--foreground-rgb), 0.05)",
                        border: "1px solid var(--border)",
                        borderRadius: "12px",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.8rem",
                        color: "var(--text-secondary)",
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem"
                    }}>
                        <span style={{ fontSize: "1.25rem" }}>⚠️</span>
                        <div>
                            <strong style={{ color: "var(--foreground)", display: "block", marginBottom: "0.25rem" }}>Notice</strong>
                            The data below is currently placeholder content for demonstration purposes.
                        </div>
                    </div>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: "3rem"
                    }}>
                        {books.map((book, i) => (
                            <div key={i} className="group" style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1rem",
                                cursor: "pointer"
                            }}>
                                <div style={{
                                    aspectRatio: "2/3",
                                    backgroundColor: "var(--card-bg)",
                                    borderRadius: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "4rem",
                                    boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
                                    transition: "transform 0.3s ease, box-shadow 0.3s ease"
                                }} className="group-hover:-translate-y-2 group-hover:shadow-2xl">
                                    {book.cover}
                                </div>
                                <div>
                                    <h3 style={{
                                        fontFamily: "'Playfair Display', serif",
                                        fontSize: "1.25rem",
                                        fontWeight: 500,
                                        lineHeight: 1.2,
                                        marginBottom: "0.5rem"
                                    }}>
                                        {book.title}
                                    </h3>
                                    <p style={{
                                        fontSize: "0.9rem",
                                        color: "var(--text-secondary)",
                                        fontFamily: "var(--font-sans)"
                                    }}>
                                        {book.author}
                                    </p>
                                    <span style={{
                                        display: "inline-block",
                                        fontSize: "0.75rem",
                                        marginTop: "0.5rem",
                                        padding: "0.25rem 0.75rem",
                                        borderRadius: "99px",
                                        backgroundColor: "var(--hover-bg)",
                                        color: "var(--text-secondary)",
                                        fontFamily: "var(--font-mono)"
                                    }}>
                                        {book.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </div >
    );
}
