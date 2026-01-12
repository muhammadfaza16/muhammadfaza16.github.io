import { Container } from "@/components/Container";
import { PostCard } from "@/components/PostCard";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
    title: "Writing",
    description: "Random thoughts, half-baked ideas, dan segala yang keburu diketik sebelum lupa.",
};

export default function BlogPage() {
    const posts = getAllPosts();

    return (
        <section style={{ paddingTop: "12vh", paddingBottom: "8rem" }}>
            <Container>
                <div className="animate-fade-in">
                    <header style={{ marginBottom: "6rem" }}>
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(3.5rem, 10vw, 7.5rem)",
                            fontWeight: 400,
                            letterSpacing: "-0.04em",
                            lineHeight: 0.95,
                            marginBottom: "2rem",
                            color: "var(--foreground)",
                            maxWidth: "15ch"
                        }}>
                            Writing
                        </h1>
                        <p style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "1.25rem",
                            color: "var(--text-secondary)",
                            maxWidth: "40rem",
                            lineHeight: 1.6
                        }}>
                            Random thoughts, half-baked ideas, dan segala yang keburu diketik sebelum lupa.
                        </p>
                    </header>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {posts.map((post) => (
                            <PostCard
                                key={post.slug}
                                slug={post.slug}
                                title={post.title}
                                excerpt={post.excerpt}
                                date={post.date}
                                readingTime={post.readingTime || ""}
                                thumbnail={post.thumbnail}
                            />
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
}
