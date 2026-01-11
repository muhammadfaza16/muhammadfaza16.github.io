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
        <section>
            <Container>
                <div className="py-24">
                    <header className="mb-20">
                        <h1 className="text-4xl md:text-5xl font-serif font-medium mb-6">Writing</h1>
                        <p className="text-xl text-[var(--text-secondary)] max-w-2xl leading-relaxed">
                            Random thoughts, half-baked ideas, dan segala yang keburu diketik sebelum lupa.
                        </p>
                    </header>

                    <div className="flex flex-col">
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
