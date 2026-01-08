import { Container } from "@/components/Container";
import { getAllPosts, getPostBySlug, getAdjacentPosts } from "@/lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { ReadingProgress } from "@/components/ReadingProgress";
import { TableOfContents } from "@/components/TableOfContents";
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

    // Helper to generate IDs from text
    const slugify = (text: string) => {
        return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    };

    // Extract TOC (now includes H3)
    const toc: { id: string; text: string; level: number }[] = [];

    // Improved markdown-to-HTML conversion with ID generation
    const formatContent = (content: string) => {
        // Remove the first H1 since we display it separately
        let processed = content.replace(/^# .*$/m, '').trim();

        // Extract headers for TOC (H2 and H3)
        content.replace(/^# .*$/m, '').trim().replace(/^\s*(#{2,3}) (.*$)/gim, (match, hashes, title) => {
            const level = hashes.length; // ## is level 2, ### is level 3
            const cleanTitle = title.trim();
            const id = slugify(cleanTitle);
            toc.push({ id, text: cleanTitle, level });
            return match;
        });

        // Process H2 headers - invisible anchor for navigation (min-height for IntersectionObserver)
        processed = processed.replace(/^\s*## (.*$)/gim, (match, title) => {
            const id = slugify(title.trim());
            return `<div id="${id}" class="scroll-mt-32" style="min-height:1px;margin-bottom:-1px;"></div>`;
        });

        // Process H3 headers - invisible anchor for navigation (min-height for IntersectionObserver)
        processed = processed.replace(/^\s*### (.*$)/gim, (match, title) => {
            const id = slugify(title.trim());
            return `<div id="${id}" class="scroll-mt-32" style="min-height:1px;margin-bottom:-1px;"></div>`;
        });

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
                {/* Back Link */}
                <div style={{ marginBottom: "2.5rem" }} className="animate-fade-in">
                    <Link
                        href="/blog"
                        style={{
                            fontSize: "0.875rem",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            transition: "transform 0.3s ease, color 0.3s ease"
                        }}
                        className="text-[var(--secondary)] hover:text-[var(--foreground)] hover:-translate-x-1"
                    >
                        ← Back to writing
                    </Link>
                </div>

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
