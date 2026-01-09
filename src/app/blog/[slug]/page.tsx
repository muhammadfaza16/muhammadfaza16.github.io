import { Container } from "@/components/Container";
import { getAllPosts, getPostBySlug, getAdjacentPosts } from "@/lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { ReadingProgress } from "@/components/ReadingProgress";
import { BlogPostActions } from "@/components/BlogPostActions";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        return {
            title: "Post Not Found",
        };
    }

    return {
        title: `${post.title} | Manifesto`,
        description: post.excerpt,
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    // Get adjacent posts for navigation
    const { prev, next } = getAdjacentPosts(slug);

    // Improved markdown-to-HTML conversion
    const formatContent = (content: string) => {
        // Remove the first H1 since we display it separately
        let processed = content.replace(/^# .*$/m, '').trim();

        // Process H2 headers
        processed = processed.replace(/^\s*## (.*$)/gim, '<h2 class="text-2xl font-serif font-semibold mt-12 mb-4">$1</h2>');

        // Process H3 headers
        processed = processed.replace(/^\s*### (.*$)/gim, '<h3 class="text-xl font-serif font-medium mt-8 mb-3">$1</h3>');

        return processed
            // Bold
            .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/gim, '<em>$1</em>')
            // Blockquotes
            .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
            // Unordered lists
            .replace(/^- (.*$)/gim, '<li>$1</li>')
            // Ordered lists
            .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
            // Horizontal rules
            .replace(/^---$/gim, '<hr />')
            // Wrap remaining lines as paragraphs (if not already a tag)
            .split('\n\n')
            .map(para => para.trim().startsWith('<') ? para : `<p>${para}</p>`)
            .join(' ')
    };

    const contentHtml = formatContent(post.content);

    return (
        <article style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
            <ReadingProgress />
            <Container>
                {/* Article Header */}
                <header style={{ marginBottom: "3rem" }} className="animate-fade-in-up">
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors mb-8 group"
                    >
                        <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
                        Back to journal
                    </Link>

                    <h1
                        className="animate-fade-in animation-delay-100"
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                            lineHeight: 1.2,
                            fontWeight: 700,
                            marginBottom: "1.5rem",
                            color: "var(--foreground)"
                        }}
                    >
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] mb-8 animate-fade-in animation-delay-200 font-medium tracking-wide">
                        <time dateTime={post.date} style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {post.date}
                        </time>
                        <span>•</span>
                        <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {post.readingTime}
                        </span>
                    </div>

                    {/* Actions Row */}
                    <div style={{ marginTop: "1.5rem" }}>
                        <BlogPostActions slug={post.slug} title={post.title} />
                    </div>

                </header>

                {/* Thumbnail Image */}
                {post.thumbnail && (
                    <div
                        className="animate-fade-in animation-delay-300"
                        style={{
                            maxWidth: "42rem",
                            margin: "0 auto 3rem",
                            borderRadius: "12px",
                            overflow: "hidden"
                        }}
                    >
                        <img
                            src={post.thumbnail}
                            alt={post.title}
                            style={{
                                width: "100%",
                                height: "auto",
                                display: "block"
                            }}
                        />
                    </div>
                )}

                <div className="relative mx-auto" style={{ maxWidth: "42rem" }}>
                    {/* Article Text */}
                    <div
                        className="prose drop-cap animate-fade-in animation-delay-200"
                        style={{
                            fontSize: "1.1rem",
                            lineHeight: 1.85,
                        }}
                        dangerouslySetInnerHTML={{ __html: contentHtml }}
                    />
                </div>

                {/* Next/Previous Navigation */}
                <div style={{ maxWidth: "42rem", margin: "4rem auto 0" }}>
                    <div style={{ height: "1px", background: "var(--border)", marginBottom: "3rem" }} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {prev ? (
                            <Link
                                href={`/blog/${prev.slug}`}
                                className="group block"
                            >
                                <span className="text-sm text-[var(--text-secondary)] mb-2 block">Previous</span>
                                <h3 className="text-lg font-serif font-medium group-hover:text-[var(--secondary)] transition-colors">
                                    {prev.title}
                                </h3>
                            </Link>
                        ) : <div />}

                        {next && (
                            <Link
                                href={`/blog/${next.slug}`}
                                className="group block text-right"
                            >
                                <span className="text-sm text-[var(--text-secondary)] mb-2 block">Next</span>
                                <h3 className="text-lg font-serif font-medium group-hover:text-[var(--secondary)] transition-colors">
                                    {next.title}
                                </h3>
                            </Link>
                        )}
                    </div>

                    <div className="mt-12 text-center">
                        <Link
                            href="/blog"
                            className="inline-block text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors border-b border-transparent hover:border-[var(--foreground)] pb-1"
                        >
                            ← All journal entries
                        </Link>
                    </div>
                </div>
            </Container >
        </article >
    );
}
