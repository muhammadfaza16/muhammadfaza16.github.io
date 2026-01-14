"use client";

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
    hideThumbnail?: boolean;
}

export function PostCard({ slug, title, excerpt, date, readingTime, thumbnail, hideBorderTop, hideThumbnail }: PostCardProps) {
    const showThumbnail = thumbnail && !hideThumbnail;

    return (
        <article
            className="group"
            style={{
                paddingTop: "2rem",
                paddingBottom: "2rem",
                borderTop: hideBorderTop ? "none" : "1px solid var(--border)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                borderRadius: "8px",
                margin: "0 -1rem",
                padding: "2rem 1rem"
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
            }}
        >
            <Link href={`/blog/${slug}`} className="block">
                <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
                    {/* Thumbnail - Only show if not hidden */}
                    {showThumbnail && (
                        <div style={{
                            flexShrink: 0,
                            width: "120px",
                            height: "80px",
                            borderRadius: "8px",
                            overflow: "hidden",
                            backgroundColor: "var(--hover)",
                            position: "relative"
                        }}>
                            <Image
                                src={thumbnail}
                                alt={title}
                                fill
                                style={{
                                    objectFit: "cover",
                                }}
                                className="group-hover:scale-105 transition-transform duration-300"
                                sizes="120px"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: hideThumbnail ? "0.75rem" : "0.5rem" }}>
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

                        {/* Title - Enhanced when no thumbnail */}
                        <h3
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: hideThumbnail ? "clamp(1.75rem, 4vw, 2.25rem)" : "1.5rem",
                                fontWeight: hideThumbnail ? 400 : 500,
                                lineHeight: 1.2,
                                letterSpacing: hideThumbnail ? "-0.02em" : "0",
                                transition: "color 0.3s ease",
                                marginBottom: hideThumbnail ? "0.25rem" : 0
                            }}
                            className="group-hover:text-[var(--text-secondary)]"
                        >
                            {title}
                        </h3>

                        {/* Excerpt */}
                        <p style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: hideThumbnail ? "1.05rem" : "0.95rem",
                            lineHeight: 1.7,
                            fontWeight: 400,
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
                                fontSize: "0.85rem",
                                fontWeight: 500,
                                fontFamily: "var(--font-mono)",
                                opacity: 0,
                                transform: "translateX(-10px)",
                                transition: "opacity 0.3s ease, transform 0.3s ease"
                            }}
                            className="group-hover:opacity-100 group-hover:translate-x-0"
                        >
                            Read more <span style={{ transition: "transform 0.3s ease" }} className="group-hover:translate-x-1">→</span>
                        </div>
                    </div>
                </div>
            </Link>
        </article>
    );
}
