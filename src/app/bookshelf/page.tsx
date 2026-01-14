import { Container } from "@/components/Container";
import { Metadata } from "next";
import { BookOpen, Star, Clock, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
    title: "Bookshelf | The Almanac of Broken Wanderer",
    description: "Koleksi buku yang telah dan sedang saya baca.",
};

const books = [
    { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", status: "Reading", notes: "Tiap chapter butuh digesting lama. Worth every minute." },
    { title: "Clean Architecture", author: "Robert C. Martin", status: "Reading", notes: "The dependency rule changes how I think about code." },
    { title: "Atomic Habits", author: "James Clear", status: "Finished", notes: "1% better every day compounds into something massive." },
    { title: "Sapiens", author: "Yuval Noah Harari", status: "Finished", notes: "Humbling perspective on what it means to be human." },
    { title: "Man's Search for Meaning", author: "Viktor E. Frankl", status: "Favorite", notes: "The kind of book that rewires your brain permanently." },
    { title: "The Alchemist", author: "Paulo Coelho", status: "Favorite", notes: "Sometimes the journey matters more than the treasure." },
];

function StatusIcon({ status }: { status: string }) {
    switch (status) {
        case "Reading":
            return <Clock className="w-4 h-4" style={{ color: "var(--accent)" }} />;
        case "Finished":
            return <CheckCircle className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />;
        case "Favorite":
            return <Star className="w-4 h-4" style={{ color: "#f59e0b" }} />;
        default:
            return <BookOpen className="w-4 h-4" />;
    }
}

function BookCard({ book }: { book: typeof books[0] }) {
    return (
        <div style={{
            padding: "clamp(1.25rem, 3vw, 1.75rem)",
            backgroundColor: "var(--card-bg)",
            borderRadius: "16px",
            border: "1px solid var(--border)",
            transition: "all 0.3s ease"
        }} className="hover:border-[var(--border-strong)]">
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "clamp(0.75rem, 2vw, 1rem)"
            }}>
                <StatusIcon status={book.status} />
                <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "clamp(0.7rem, 1.8vw, 0.75rem)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "var(--text-muted)"
                }}>
                    {book.status}
                </span>
            </div>
            <h3 style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: "clamp(1.1rem, 2.8vw, 1.25rem)",
                fontWeight: 500,
                lineHeight: 1.3,
                marginBottom: "0.35rem"
            }}>
                {book.title}
            </h3>
            <p style={{
                fontSize: "clamp(0.85rem, 2vw, 0.9rem)",
                color: "var(--text-secondary)",
                marginBottom: "clamp(0.75rem, 2vw, 1rem)"
            }}>
                {book.author}
            </p>
            <p style={{
                fontSize: "clamp(0.8rem, 2vw, 0.875rem)",
                color: "var(--text-muted)",
                lineHeight: 1.5,
                fontStyle: "italic"
            }}>
                "{book.notes}"
            </p>
        </div>
    );
}

export default function BookshelfPage() {
    return (
        <div style={{ paddingBottom: "clamp(4rem, 8vh, 8rem)" }}>
            {/* Hero Section */}
            <section style={{
                minHeight: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingTop: "clamp(5rem, 12vh, 8rem)",
                paddingBottom: "clamp(2rem, 4vh, 3rem)"
            }}>
                <Container>
                    <div className="animate-fade-in-up">
                        <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.35rem 0.75rem",
                            backgroundColor: "var(--hover-bg)",
                            borderRadius: "99px",
                            fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
                            fontFamily: "var(--font-mono)",
                            marginBottom: "clamp(1.5rem, 3vh, 2rem)"
                        }}>
                            <BookOpen className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
                            <span style={{ color: "var(--text-secondary)" }}>The Library</span>
                        </div>

                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
                            fontWeight: 400,
                            letterSpacing: "-0.03em",
                            lineHeight: 1.1,
                            marginBottom: "clamp(1rem, 2vh, 1.5rem)",
                            color: "var(--foreground)",
                            maxWidth: "16ch"
                        }}>
                            I read to live more lives.
                        </h1>

                        <p style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                            color: "var(--text-secondary)",
                            maxWidth: "45ch",
                            lineHeight: 1.6,
                            margin: 0
                        }}>
                            Buku-buku yang ngebentuk cara gue mikir. Some I re-read,
                            most I highlight aggressively.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Main Content */}
            <Container>
                <div className="animate-fade-in animation-delay-200" style={{ maxWidth: "52rem" }}>

                    {/* Disclaimer */}
                    <div style={{
                        padding: "clamp(0.875rem, 2vw, 1rem)",
                        marginBottom: "clamp(2rem, 4vh, 3rem)",
                        background: "rgba(var(--foreground-rgb), 0.05)",
                        border: "1px solid var(--border)",
                        borderRadius: "12px",
                        fontFamily: "var(--font-mono)",
                        fontSize: "clamp(0.7rem, 1.8vw, 0.8rem)",
                        color: "var(--text-secondary)",
                        display: "flex",
                        alignItems: "center",
                        gap: "clamp(0.75rem, 2vw, 1rem)"
                    }}>
                        <span style={{ fontSize: "1.25rem" }}>⚠️</span>
                        <div>
                            <strong style={{ color: "var(--foreground)", display: "block", marginBottom: "0.25rem" }}>Notice</strong>
                            The data below is currently placeholder content for demonstration purposes.
                        </div>
                    </div>

                    {/* Books Grid */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
                        gap: "clamp(1rem, 3vw, 1.5rem)"
                    }}>
                        {books.map((book, i) => (
                            <BookCard key={i} book={book} />
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    );
}
