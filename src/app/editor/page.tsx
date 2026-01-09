"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Post {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    thumbnail?: string;
}

export default function EditorPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch("/api/posts");
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (slug: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        setDeletingSlug(slug);
        try {
            const response = await fetch(`/api/posts/${slug}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setPosts(posts.filter((p) => p.slug !== slug));
            }
        } catch (error) {
            console.error("Failed to delete post:", error);
        } finally {
            setDeletingSlug(null);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "var(--background)",
            color: "var(--foreground)"
        }}>
            {/* Header */}
            <header style={{
                padding: "1.5rem 2rem",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <Link
                        href="/"
                        style={{
                            color: "var(--muted)",
                            textDecoration: "none",
                            fontSize: "0.875rem"
                        }}
                    >
                        ← Back to Site
                    </Link>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                        Post Editor
                    </h1>
                </div>
                <Link
                    href="/editor/new"
                    style={{
                        padding: "0.75rem 1.5rem",
                        borderRadius: "8px",
                        backgroundColor: "var(--foreground)",
                        color: "var(--background)",
                        textDecoration: "none",
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        transition: "opacity 0.2s"
                    }}
                >
                    + New Post
                </Link>
            </header>

            {/* Content */}
            <main style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
                {isLoading ? (
                    <div style={{
                        textAlign: "center",
                        padding: "4rem",
                        color: "var(--muted)"
                    }}>
                        Loading posts...
                    </div>
                ) : posts.length === 0 ? (
                    <div style={{
                        textAlign: "center",
                        padding: "4rem",
                        color: "var(--muted)"
                    }}>
                        <svg
                            width="64"
                            height="64"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            style={{ margin: "0 auto 1rem" }}
                        >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="12" y1="18" x2="12" y2="12" />
                            <line x1="9" y1="15" x2="15" y2="15" />
                        </svg>
                        <p>No posts yet. Create your first post!</p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {posts.map((post) => (
                            <div
                                key={post.slug}
                                style={{
                                    display: "flex",
                                    gap: "1rem",
                                    padding: "1rem",
                                    borderRadius: "12px",
                                    border: "1px solid var(--border)",
                                    backgroundColor: "var(--background)",
                                    transition: "border-color 0.2s"
                                }}
                            >
                                {/* Thumbnail */}
                                {post.thumbnail ? (
                                    <img
                                        src={post.thumbnail}
                                        alt={post.title}
                                        style={{
                                            width: "120px",
                                            height: "80px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                            flexShrink: 0
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        width: "120px",
                                        height: "80px",
                                        borderRadius: "8px",
                                        backgroundColor: "var(--hover)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                        color: "var(--muted)"
                                    }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <polyline points="21 15 16 10 5 21" />
                                        </svg>
                                    </div>
                                )}

                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h3 style={{
                                        fontSize: "1rem",
                                        fontWeight: 600,
                                        marginBottom: "0.25rem",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap"
                                    }}>
                                        {post.title}
                                    </h3>
                                    <p style={{
                                        fontSize: "0.875rem",
                                        color: "var(--muted)",
                                        marginBottom: "0.5rem",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap"
                                    }}>
                                        {post.excerpt}
                                    </p>
                                    <p style={{
                                        fontSize: "0.75rem",
                                        color: "var(--muted)"
                                    }}>
                                        {post.date}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div style={{
                                    display: "flex",
                                    gap: "0.5rem",
                                    alignItems: "flex-start",
                                    flexShrink: 0
                                }}>
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        target="_blank"
                                        style={{
                                            padding: "0.5rem 0.75rem",
                                            borderRadius: "6px",
                                            border: "1px solid var(--border)",
                                            backgroundColor: "transparent",
                                            color: "var(--foreground)",
                                            textDecoration: "none",
                                            fontSize: "0.875rem"
                                        }}
                                    >
                                        View
                                    </Link>
                                    <Link
                                        href={`/editor/${post.slug}`}
                                        style={{
                                            padding: "0.5rem 0.75rem",
                                            borderRadius: "6px",
                                            border: "1px solid var(--border)",
                                            backgroundColor: "transparent",
                                            color: "var(--foreground)",
                                            textDecoration: "none",
                                            fontSize: "0.875rem"
                                        }}
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(post.slug)}
                                        disabled={deletingSlug === post.slug}
                                        style={{
                                            padding: "0.5rem 0.75rem",
                                            borderRadius: "6px",
                                            border: "1px solid rgba(239, 68, 68, 0.3)",
                                            backgroundColor: "transparent",
                                            color: "#ef4444",
                                            fontSize: "0.875rem",
                                            cursor: deletingSlug === post.slug ? "wait" : "pointer",
                                            opacity: deletingSlug === post.slug ? 0.5 : 1
                                        }}
                                    >
                                        {deletingSlug === post.slug ? "..." : "Delete"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
