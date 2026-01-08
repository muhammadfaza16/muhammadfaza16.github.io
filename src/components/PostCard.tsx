import Link from "next/link";

interface PostCardProps {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    readingTime: string;
}

export function PostCard({ slug, title, excerpt, date, readingTime }: PostCardProps) {
    return (
        <article
            className="group"
            style={{
                paddingTop: "2rem",
                paddingBottom: "2rem",
                borderTop: "1px solid var(--border)"
            }}
        >
            <Link href={`/blog/${slug}`} className="block">
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {/* Meta */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em"
                    }} className="text-[var(--secondary)]">
                        <time dateTime={date}>{date}</time>
                        <span style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "var(--border)" }} />
                        <span>{readingTime}</span>
                    </div>

                    {/* Title */}
                    <h3
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "1.5rem",
                            fontWeight: 500,
                            lineHeight: 1.3,
                            transition: "color 0.3s ease"
                        }}
                        className="group-hover:text-[var(--text-secondary)]"
                    >
                        {title}
                    </h3>

                    {/* Excerpt */}
                    <p style={{
                        fontSize: "0.95rem",
                        lineHeight: 1.7,
                        fontWeight: 300,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        marginBottom: 0
                    }} className="text-[var(--text-secondary)]">
                        {excerpt}
                    </p>

                    {/* Read More Arrow */}
                    <div
                        style={{
                            paddingTop: "0.5rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                            opacity: 0,
                            transform: "translateX(-10px)",
                            transition: "opacity 0.3s ease, transform 0.3s ease"
                        }}
                        className="group-hover:opacity-100 group-hover:translate-x-0"
                    >
                        Read more <span style={{ transition: "transform 0.3s ease" }} className="group-hover:translate-x-1">→</span>
                    </div>
                </div>
            </Link>
        </article>
    );
}
