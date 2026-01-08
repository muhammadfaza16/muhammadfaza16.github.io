"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Post {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    readingTime?: string;
}

export default function AdminDashboard() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetch("/api/posts")
            .then(res => res.json())
            .then(data => {
                setPosts(data);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (slug: string, title: string) => {
        if (!confirm(`Delete "${title}"?`)) return;

        setDeleting(slug);
        try {
            const res = await fetch(`/api/posts?slug=${slug}`, { method: "DELETE" });
            if (res.ok) {
                setPosts(posts.filter(p => p.slug !== slug));
                setMessage({ type: 'success', text: `"${title}" deleted` });
                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage({ type: 'error', text: 'Failed to delete post' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Network error' });
        } finally {
            setDeleting(null);
        }
    };

    if (loading) {
        return (
            <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "3rem 2rem", color: "var(--text-secondary)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ animation: "pulse 1.5s infinite" }}>●</span> Loading posts...
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "3rem 2rem" }}>
            {/* Toast Message */}
            {message && (
                <div style={{
                    position: "fixed",
                    top: "1.5rem",
                    right: "1.5rem",
                    padding: "1rem 1.5rem",
                    borderRadius: "8px",
                    backgroundColor: message.type === 'success' ? "#1a472a" : "#5c1a1a",
                    color: message.type === 'success' ? "#90EE90" : "#ffcccc",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    zIndex: 1000,
                    animation: "fadeIn 0.3s ease"
                }}>
                    {message.text}
                </div>
            )}

            <header style={{ marginBottom: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.25rem", marginBottom: "0.5rem" }}>
                        Content Manager
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                        {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                    </p>
                </div>
                <Link
                    href="/admin/posts/new"
                    style={{
                        backgroundColor: "var(--foreground)",
                        color: "var(--background)",
                        padding: "0.75rem 1.5rem",
                        borderRadius: "8px",
                        textDecoration: "none",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        transition: "transform 0.2s, box-shadow 0.2s"
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = "translateY(-1px)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                >
                    + New Post
                </Link>
            </header>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {posts.map((post, index) => (
                    <div
                        key={post.slug}
                        style={{
                            backgroundColor: "var(--card-bg)",
                            border: "1px solid var(--border)",
                            borderRadius: "12px",
                            padding: "1.25rem 1.5rem",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "1.5rem",
                            opacity: deleting === post.slug ? 0.5 : 1,
                            transition: "all 0.2s ease",
                            animation: `fadeIn 0.3s ease ${index * 0.05}s both`
                        }}
                    >
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <h2 style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "1.15rem",
                                marginBottom: "0.4rem",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                            }}>
                                {post.title}
                            </h2>
                            <p style={{
                                color: "var(--text-secondary)",
                                fontSize: "0.85rem",
                                marginBottom: "0.4rem",
                                display: "-webkit-box",
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden"
                            }}>
                                {post.excerpt || "No excerpt"}
                            </p>
                            <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.75rem", color: "var(--text-secondary)", opacity: 0.8 }}>
                                <span>{post.date}</span>
                                {post.readingTime && (
                                    <>
                                        <span>·</span>
                                        <span>{post.readingTime}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                            <Link
                                href={`/blog/${post.slug}`}
                                style={{
                                    padding: "0.5rem 0.875rem",
                                    border: "1px solid var(--border)",
                                    borderRadius: "6px",
                                    fontSize: "0.8rem",
                                    textDecoration: "none",
                                    color: "var(--text-secondary)",
                                    transition: "all 0.2s"
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.borderColor = "var(--foreground)";
                                    e.currentTarget.style.color = "var(--foreground)";
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.borderColor = "var(--border)";
                                    e.currentTarget.style.color = "var(--text-secondary)";
                                }}
                            >
                                View
                            </Link>
                            <Link
                                href={`/admin/posts/${post.slug}`}
                                style={{
                                    padding: "0.5rem 0.875rem",
                                    border: "1px solid var(--border)",
                                    borderRadius: "6px",
                                    fontSize: "0.8rem",
                                    textDecoration: "none",
                                    color: "var(--text-secondary)",
                                    transition: "all 0.2s"
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.borderColor = "var(--foreground)";
                                    e.currentTarget.style.color = "var(--foreground)";
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.borderColor = "var(--border)";
                                    e.currentTarget.style.color = "var(--text-secondary)";
                                }}
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(post.slug, post.title)}
                                disabled={deleting === post.slug}
                                style={{
                                    padding: "0.5rem 0.875rem",
                                    border: "1px solid rgba(200, 50, 50, 0.3)",
                                    borderRadius: "6px",
                                    fontSize: "0.8rem",
                                    backgroundColor: "transparent",
                                    color: "rgba(200, 80, 80, 0.9)",
                                    cursor: deleting === post.slug ? "not-allowed" : "pointer",
                                    transition: "all 0.2s"
                                }}
                                onMouseOver={(e) => {
                                    if (deleting !== post.slug) {
                                        e.currentTarget.style.borderColor = "#c33";
                                        e.currentTarget.style.backgroundColor = "rgba(200, 50, 50, 0.1)";
                                    }
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.borderColor = "rgba(200, 50, 50, 0.3)";
                                    e.currentTarget.style.backgroundColor = "transparent";
                                }}
                            >
                                {deleting === post.slug ? "..." : "Delete"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <footer style={{ marginTop: "2.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
                <Link href="/" style={{ color: "var(--text-secondary)", fontSize: "0.85rem", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseOver={(e) => e.currentTarget.style.color = "var(--foreground)"}
                    onMouseOut={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
                >
                    ← Back to site
                </Link>
            </footer>

            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
            `}</style>
        </div>
    );
}
