import { Container } from "@/components/Container";
import { getAllPosts, getPostBySlug, getAdjacentPosts } from "@/lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { ReadingProgress } from "@/components/ReadingProgress";
import { BlogPostActions } from "@/components/BlogPostActions";
import { ArticleContent } from "@/components/ArticleContent";
import { PostTemperature } from "@/components/PostTemperature";
import { ZenToggle } from "@/components/ZenToggle";
import { ZenHidden } from "@/components/ZenHidden";

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
        title: `${post.title} | Manifesto`, // Clean suffix
        description: post.excerpt,
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const { prev, next } = getAdjacentPosts(slug);

    // Improved markdown-to-HTML conversion
    const formatContent = (content: string) => {
        let processed = content.replace(/^# .*$/m, '').trim();

        // Process Headers - Clean styles
        processed = processed.replace(/^\s*## (.*$)/gim, '<h2>$1</h2>');
        processed = processed.replace(/^\s*### (.*$)/gim, '<h3>$1</h3>');

        return processed
            // Images - standard structure, styling handled by CSS
            .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img src="$2" alt="$1" />')
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
            // Wrap remaining lines
            .split('\n\n')
            .map(para => para.trim().startsWith('<') ? para : `<p>${para}</p>`)
            .join(' ')
    };

    const contentHtml = formatContent(post.content);

    return (
        <article style={{ paddingBottom: "8rem" }}>
            <ReadingProgress />

            {/* Minimalist Top Nav */}
            <Container>
                <div style={{
                    paddingTop: "2rem", // Adjusted after removing fixed header
                    marginBottom: "2rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <ZenHidden>
                        <Link
                            href="/blog"
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.8rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                color: "var(--text-secondary)",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                opacity: 0.7,
                                transition: "opacity 0.2s ease"
                            }}
                            className="hover:opacity-100"
                        >
                            ← Index
                        </Link>
                    </ZenHidden>

                    <ZenToggle />
                </div>

                {/* Hero Header - Read Mode */}
                <header
                    className=""
                    style={{
                        marginTop: "2rem", // Reduced from 8rem since we have the nav above
                        marginBottom: "6rem",
                        textAlign: "center",
                        maxWidth: "900px",
                        marginLeft: "auto",
                        marginRight: "auto"
                    }}
                >
                    <div
                        className=" animation-delay-100"
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.85rem",
                            color: "var(--accent)",
                            marginBottom: "1.5rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.15em",
                            fontWeight: 500
                        }}
                    >
                        {post.date}
                    </div>

                    <h1
                        className=" animation-delay-200"
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(3rem, 6vw, 5.5rem)", // Massive title
                            lineHeight: 1.05,
                            fontWeight: 400, // Thinner weight for elegance
                            margin: "0 auto 2.5rem",
                            color: "var(--foreground)",
                            letterSpacing: "-0.03em"
                        }}
                    >
                        {post.title}
                    </h1>

                    <div
                        className=" animation-delay-300"
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "1.5rem",
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.8rem",
                            color: "var(--text-secondary)"
                        }}
                    >
                        <span>{post.readingTime}</span>
                        <span style={{ opacity: 0.3 }}>/</span>
                        <PostTemperature />
                    </div>
                </header>

                {/* Featured Image - Cinematic */}
                {post.thumbnail && (
                    <div
                        className=" animation-delay-400"
                        style={{
                            width: "100%",
                            maxWidth: "1200px",
                            margin: "0 auto 6rem",
                            borderRadius: "2px", // Very slight rounding
                            overflow: "hidden",
                            boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" // Soft cinematic shadow
                        }}
                    >
                        <img
                            src={post.thumbnail}
                            alt={post.title}
                            style={{
                                width: "100%",
                                height: "auto",
                                objectFit: "cover",
                                maxHeight: "70vh", // Don't take up more than 70% of viewport height
                                display: "block"
                            }}
                        />
                    </div>
                )}

                {/* Article Content - Centered & Narrow */}
                <div style={{
                    maxWidth: "65ch",
                    margin: "0 auto",
                    position: "relative"
                }}>
                    <ArticleContent html={contentHtml} />

                    {/* Actions at the end of content */}
                    <div style={{ marginTop: "4rem", marginBottom: "4rem" }}>
                        <BlogPostActions slug={post.slug} title={post.title} />
                    </div>

                    {/* Divider */}
                    <hr style={{
                        border: "none",
                        height: "1px",
                        background: "var(--border)",
                        margin: "4rem auto",
                        maxWidth: "100px" // Small center line
                    }} />
                </div>

                {/* Minimalist Navigation Footer */}
                <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {prev ? (
                            <Link
                                href={`/blog/${prev.slug}`}
                                className="group block text-left"
                            >
                                <span style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.7rem",
                                    color: "var(--text-secondary)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.1em",
                                    display: "block",
                                    marginBottom: "1rem"
                                }}>
                                    Previous
                                </span>
                                <h3 style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: "1.5rem",
                                    lineHeight: 1.3,
                                    color: "var(--foreground)"
                                }} className="group-hover:text-[var(--accent)] transition-colors">
                                    {prev.title}
                                </h3>
                            </Link>
                        ) : <div />}

                        {next && (
                            <Link
                                href={`/blog/${next.slug}`}
                                className="group block text-right"
                            >
                                <span style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.7rem",
                                    color: "var(--text-secondary)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.1em",
                                    display: "block",
                                    marginBottom: "1rem"
                                }}>
                                    Next
                                </span>
                                <h3 style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: "1.5rem",
                                    lineHeight: 1.3,
                                    color: "var(--foreground)"
                                }} className="group-hover:text-[var(--accent)] transition-colors">
                                    {next.title}
                                </h3>
                            </Link>
                        )}
                    </div>
                </div>
            </Container>
        </article>
    );
}
