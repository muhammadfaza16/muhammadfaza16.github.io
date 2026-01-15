import { Container } from "@/components/Container";
import { Metadata } from "next";
import { BookOpen, Star, Clock, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
    title: "Bookshelf | The Almanack of Broken Wanderer",
    description: "Koleksi buku yang telah dan sedang saya baca.",
};

const books = [
    // Current - Vision Aligned
    { title: "Co-Intelligence", author: "Ethan Mollick", status: "Reading", notes: "Living and working with AI. Not just using it, but collaborating with it." },
    { title: "Building a StoryBrand", author: "Donald Miller", status: "Reading", notes: "Clarifying the message. If you confuse, you'll lose." },
    { title: "Same as Ever", author: "Morgan Housel", status: "Reading", notes: "Focusing on what never changes in a changing world. Human nature is constant." },

    // Science Pop / History / Big Context
    { title: "Sapiens", author: "Yuval Noah Harari", status: "Finished", notes: "The history of our species. How shared fictions enable large-scale cooperation." },
    { title: "Guns, Germs, and Steel", author: "Jared Diamond", status: "Finished", notes: "Geographic determinism. A macro-history lens that explains the broad strokes of civilization." },
    { title: "Cosmos", author: "Carl Sagan", status: "Finished", notes: "A poetic voyage through the universe that reminds us of our place in the grand scheme." },

    // Wisdom / Philosophy / Mental Models
    { title: "The Almanack of Naval Ravikant", author: "Eric Jorgenson", status: "Favorite", notes: "Wealth and happiness. The guide to playing long-term games with long-term people." },
    { title: "The Psychology of Money", author: "Morgan Housel", status: "Favorite", notes: "Doing well with money isn't just about what you know. It's about how you behave." },
    { title: "Behave", author: "Robert Sapolsky", status: "Favorite", notes: "The biology of humans at our best and worst. Complexity theory applied to us." },

    // Classics
    { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", status: "Finished", notes: "Exposing the bugs in our wetware. Essential for anyone wanting to be rational." },
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
                fontSize: "clamp(0.85rem, 2vw, 0.9rem)",
                color: "var(--text-muted)",
                lineHeight: 1.65,
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
                            <span style={{ color: "var(--text-secondary)" }}>The Polymath's Shelf</span>
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
                            Connecting the dots.
                        </h1>

                        <p style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                            color: "var(--text-secondary)",
                            maxWidth: "48ch",
                            lineHeight: 1.6,
                            margin: 0
                        }}>
                            From quantum mechanics to market dynamics, from evolutionary
                            psychology to the human condition. A curated collection for understanding
                            how the world actually works.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Main Content */}
            <Container>
                <div className="animate-fade-in animation-delay-200" style={{ maxWidth: "52rem" }}>



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
