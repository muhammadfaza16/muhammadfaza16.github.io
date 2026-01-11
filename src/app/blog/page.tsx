import { Container } from "@/components/Container";
import { PostCard } from "@/components/PostCard";
import { getAllPosts } from "@/lib/posts";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Writing | The Almanac of Broken Wanderer",
    description: "Writing is the best way to debug your thoughts.",
};

export default function BlogPage() {
    const posts = getAllPosts();

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
                            The Essays
                        </span>
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(3rem, 6vw, 5rem)",
                            fontWeight: 400,
                            letterSpacing: "-0.03em",
                            lineHeight: 1,
                            color: "var(--foreground)",
                            maxWidth: "15ch"
                        }}>
                            Writing is the best way to debug your thoughts.
                        </h1>
                    </div>
                </Container>
            </section>

            <Container>
                <div className="animate-fade-in animation-delay-300" style={{ maxWidth: "45rem" }}>
                    <div className="flex flex-col gap-12">
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
        </div>
    );
}
