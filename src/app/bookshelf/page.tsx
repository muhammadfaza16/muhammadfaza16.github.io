import { Container } from "@/components/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bookshelf | The Almanac of Broken Wanderer",
    description: "Koleksi buku yang telah dan sedang saya baca.",
};

const DISCLAIMER = "📚 Konten di halaman ini masih berupa dummy/placeholder. Akan segera diperbarui dengan data asli.";

const books = {
    currentlyReading: [
        {
            title: "Thinking, Fast and Slow",
            author: "Daniel Kahneman",
            progress: 45,
            cover: "📘",
        },
        {
            title: "Clean Architecture",
            author: "Robert C. Martin",
            progress: 12,
            cover: "📗",
        },
    ],
    finished2025: [
        {
            title: "Atomic Habits",
            author: "James Clear",
            rating: 5,
            review: "Buku yang mengubah cara saya memandang kebiasaan kecil.",
            cover: "📕",
        },
        {
            title: "The Pragmatic Programmer",
            author: "David Thomas & Andrew Hunt",
            rating: 5,
            review: "Wajib baca untuk setiap software developer.",
            cover: "📙",
        },
        {
            title: "Sapiens",
            author: "Yuval Noah Harari",
            rating: 4,
            review: "Perspektif baru tentang sejarah umat manusia.",
            cover: "📗",
        },
    ],
    allTimeFavorites: [
        {
            title: "Man's Search for Meaning",
            author: "Viktor E. Frankl",
            cover: "📘",
        },
        {
            title: "The Alchemist",
            author: "Paulo Coelho",
            cover: "📕",
        },
        {
            title: "Meditations",
            author: "Marcus Aurelius",
            cover: "📙",
        },
    ],
};

function StarRating({ rating }: { rating: number }) {
    return (
        <span style={{ color: "var(--accent)", letterSpacing: "2px" }}>
            {"★".repeat(rating)}{"☆".repeat(5 - rating)}
        </span>
    );
}

export default function BookshelfPage() {
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
                        My Reading Journey
                    </span>
                    <h1 style={{
                        fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                        fontWeight: 700,
                        color: "var(--foreground)"
                    }}>
                        Bookshelf
                    </h1>
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

                {/* Currently Reading */}
                <section style={{ marginBottom: "4rem" }}>
                    <h2 style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "1.25rem",
                        marginBottom: "1.5rem",
                        borderBottom: "1px solid var(--border)",
                        paddingBottom: "0.5rem"
                    }}>
                        📖 Currently Reading
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
                        {books.currentlyReading.map((book, i) => (
                            <div key={i} style={{
                                padding: "1.5rem",
                                borderRadius: "8px",
                                backgroundColor: "var(--card-bg)",
                                border: "1px solid var(--border)"
                            }}>
                                <span style={{ fontSize: "2rem" }}>{book.cover}</span>
                                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginTop: "0.75rem", marginBottom: "0.25rem" }}>
                                    {book.title}
                                </h3>
                                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>{book.author}</p>
                                <div style={{ marginTop: "1rem", height: "4px", width: "100%", backgroundColor: "var(--border)", borderRadius: "2px" }}>
                                    <div style={{ height: "100%", width: `${book.progress}%`, backgroundColor: "var(--foreground)", borderRadius: "2px" }}></div>
                                </div>
                                <p style={{ fontSize: "0.75rem", textAlign: "right", marginTop: "0.5rem", opacity: 0.6 }}>{book.progress}%</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Finished 2025 */}
                <section style={{ marginBottom: "4rem" }}>
                    <h2 style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "1.25rem",
                        marginBottom: "1.5rem",
                        borderBottom: "1px solid var(--border)",
                        paddingBottom: "0.5rem"
                    }}>
                        ✅ Finished in 2025
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {books.finished2025.map((book, i) => (
                            <div key={i} style={{
                                padding: "1.5rem",
                                borderRadius: "8px",
                                backgroundColor: "var(--card-bg)",
                                border: "1px solid var(--border)",
                                display: "flex",
                                gap: "1.5rem",
                                alignItems: "flex-start"
                            }}>
                                <span style={{ fontSize: "2.5rem" }}>{book.cover}</span>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.25rem" }}>{book.title}</h3>
                                    <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>{book.author}</p>
                                    <StarRating rating={book.rating} />
                                    <p style={{ fontSize: "0.9rem", marginTop: "0.75rem", color: "var(--foreground)", opacity: 0.9, fontStyle: "italic" }}>
                                        "{book.review}"
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* All-Time Favorites */}
                <section>
                    <h2 style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "1.25rem",
                        marginBottom: "1.5rem",
                        borderBottom: "1px solid var(--border)",
                        paddingBottom: "0.5rem"
                    }}>
                        <span style={{ filter: "grayscale(1)" }}>❤️</span> All-Time Favorites
                    </h2>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                        {books.allTimeFavorites.map((book, i) => (
                            <div key={i} style={{
                                padding: "1rem 1.5rem",
                                borderRadius: "8px",
                                backgroundColor: "var(--card-bg)",
                                border: "1px solid var(--border)",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem"
                            }}>
                                <span style={{ fontSize: "1.5rem" }}>{book.cover}</span>
                                <div>
                                    <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>{book.title}</h3>
                                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{book.author}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </Container>
    );
}
