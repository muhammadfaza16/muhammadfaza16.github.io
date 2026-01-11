import Link from "next/link";
import Image from "next/image";

interface PostCardProps {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    readingTime: string;
    thumbnail?: string;
    hideBorderTop?: boolean;
}

export function PostCard({ slug, title, excerpt, date, readingTime, thumbnail }: PostCardProps) {
    return (
        <article className="group">
            <Link href={`/blog/${slug}`} className="block">
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                    {/* Meta Top */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        fontSize: "0.8rem",
                        fontFamily: "var(--font-mono)",
                        color: "var(--text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em"
                    }}>
                        <time dateTime={date}>{date}</time>
                        <span style={{ width: "3px", height: "3px", borderRadius: "50%", backgroundColor: "var(--border)" }} />
                        <span>{readingTime}</span>
                    </div>

                    <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
                        {/* Content */}
                        <div style={{ flex: 1 }}>
                            <h3
                                style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: "1.75rem",
                                    fontWeight: 600,
                                    lineHeight: 1.2,
                                    marginBottom: "0.75rem",
                                    color: "var(--foreground)",
                                    transition: "color 0.2s ease"
                                }}
                                className="group-hover:text-[var(--accent)]"
                            >
                                {title}
                            </h3>

                            <p style={{
                                fontFamily: "'Source Serif 4', serif",
                                fontSize: "1.1rem",
                                lineHeight: 1.6,
                                color: "var(--text-secondary)",
                                marginBottom: "0"
                            }}>
                                {excerpt}
                            </p>
                        </div>

                        {/* Thumbnail (Right side on desktop, hidden on mobile maybe? keeping it visible for now) */}
                        {thumbnail && (
                            <div style={{
                                flexShrink: 0,
                                width: "140px",
                                height: "90px",
                                position: "relative",
                                borderRadius: "4px",
                                overflow: "hidden",
                                display: "block" // can adjust to hidden/block based on mobile needs
                            }} className="hidden sm:block">
                                <Image
                                    src={thumbnail}
                                    alt={title}
                                    fill
                                    style={{ objectFit: "cover" }}
                                    className="group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </article>
    );
}

