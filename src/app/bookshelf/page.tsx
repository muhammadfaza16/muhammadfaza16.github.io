import { Container } from "@/components/Container";
import { Disclaimer } from "@/components/Disclaimer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bookshelf | The Almanac of Broken Wanderer",
    description: "Koleksi buku yang telah dan sedang saya baca.",
};

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
        <span style={{
            color: "var(--foreground)",
            opacity: 0.6,
            fontSize: "0.8rem",
            letterSpacing: "1px",
            fontFamily: "var(--font-mono)"
        }}>
            {"★".repeat(rating)}
        </span>
    );
}

export default function BookshelfPage() {
    return (
        <section style={{ paddingTop: "15vh", paddingBottom: "10rem" }}>
            <Container>
                <div className="animate-fade-in" style={{ maxWidth: "65ch", margin: "0 auto" }}>

                    <header style={{ marginBottom: "6rem", textAlign: "center" }}>
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(4rem, 12vw, 8rem)",
                            fontWeight: 400,
                            letterSpacing: "-0.05em",
                            lineHeight: 0.9,
                            marginBottom: "3rem",
                            color: "var(--foreground)"
                        }}>
                            Bookshelf.
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
                            Notes on what I read.
                        </p>
                    </header>

                    <div className="mb-16">
                        <Disclaimer>
                            Konten di halaman ini masih berupa dummy/placeholder.
                        </Disclaimer>
                    </div>

                    {/* Currently Reading */}
                    <section style={{ marginBottom: "8rem" }}>
                        <h2 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "2rem",
                            fontWeight: 400,
                            marginBottom: "3rem",
                            textAlign: "center"
                        }}>
                            Reading
                        </h2>
                        <div style={{ display: "grid", gap: "2.5rem" }}>
                            {books.currentlyReading.map((book, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "1.5rem" }}>
                                    <div>
                                        <h3 style={{
                                            fontFamily: "'Source Serif 4', serif",
                                            fontSize: "1.5rem",
                                            fontWeight: 500,
                                            marginBottom: "0.25rem",
                                            color: "var(--foreground)"
                                        }}>
                                            {book.title}
                                        </h3>
                                        <p style={{ fontSize: "1rem", color: "var(--text-secondary)", fontFamily: "'Source Serif 4', serif" }}>by {book.author}</p>
                                    </div>
                                    <div style={{ textAlign: "right", minWidth: "100px" }}>
                                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem", color: "var(--text-secondary)" }}>{book.progress}%</span>
                                        <div style={{
                                            height: "2px",
                                            width: "100px",
                                            backgroundColor: "var(--border)",
                                            marginTop: "0.5rem",
                                            position: "relative"
                                        }}>
                                            <div style={{
                                                position: "absolute",
                                                left: 0,
                                                top: 0,
                                                height: "100%",
                                                width: `${book.progress}%`,
                                                backgroundColor: "var(--foreground)"
                                            }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Finished 2025 */}
                    <section style={{ marginBottom: "8rem" }}>
                        <h2 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "2rem",
                            fontWeight: 400,
                            marginBottom: "3rem",
                            textAlign: "center"
                        }}>
                            2025
                        </h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
                            {books.finished2025.map((book, i) => (
                                <div key={i}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem" }}>
                                        <h3 style={{
                                            fontFamily: "'Source Serif 4', serif",
                                            fontSize: "1.5rem",
                                            fontWeight: 500,
                                            color: "var(--foreground)"
                                        }}>
                                            {book.title}
                                        </h3>
                                        <StarRating rating={book.rating} />
                                    </div>
                                    <p style={{ fontSize: "1rem", color: "var(--text-secondary)", fontFamily: "'Source Serif 4', serif", marginBottom: "1rem" }}>by {book.author}</p>
                                    <p style={{
                                        fontSize: "1.1rem",
                                        lineHeight: 1.6,
                                        color: "var(--foreground)",
                                        fontFamily: "'Source Serif 4', serif",
                                        fontStyle: "italic",
                                        opacity: 0.9
                                    }}>
                                        "{book.review}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* All-Time Favorites */}
                    <section>
                        <h2 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "2rem",
                            fontWeight: 400,
                            marginBottom: "3rem",
                            textAlign: "center"
                        }}>
                            Favorites
                        </h2>
                        <ul style={{
                            listStyle: "none",
                            padding: 0,
                            display: "flex",
                            flexDirection: "column",
                            gap: "1.5rem",
                            textAlign: "center"
                        }}>
                            {books.allTimeFavorites.map((book, i) => (
                                <li key={i}>
                                    <span style={{
                                        fontFamily: "'Source Serif 4', serif",
                                        fontSize: "1.25rem",
                                        color: "var(--foreground)"
                                    }}>
                                        {book.title}
                                    </span>
                                    <span style={{
                                        display: "block",
                                        fontFamily: "'Source Serif 4', serif",
                                        fontSize: "1rem",
                                        color: "var(--text-secondary)",
                                        fontStyle: "italic",
                                        marginTop: "0.25rem"
                                    }}>
                                        {book.author}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <footer style={{ marginTop: "6rem", textAlign: "center", opacity: 0.5, fontSize: "0.9rem" }}>
                        {/* Disclaimer moved to top */}
                    </footer>

                </div>
            </Container>
        </section>
    );
}
