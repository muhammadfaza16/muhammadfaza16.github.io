"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Post {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    content: string;
}

export default function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const router = useRouter();
    const [post, setPost] = useState<Post | null>(null);
    const [title, setTitle] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [date, setDate] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPost() {
            try {
                const res = await fetch("/api/posts");
                const posts: Post[] = await res.json();
                const found = posts.find(p => p.slug === slug);
                if (found) {
                    setPost(found);
                    setTitle(found.title);
                    setExcerpt(found.excerpt);
                    setContent(found.content);
                    setDate(found.date);
                }
            } catch {
                setError("Failed to load post");
            } finally {
                setLoading(false);
            }
        }
        loadPost();
    }, [slug]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch("/api/posts", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug, title, excerpt, content, date })
            });

            if (!response.ok) {
                throw new Error("Failed to update post");
            }

            setSuccess("Changes saved!");
            setTimeout(() => {
                router.push("/admin");
                router.refresh();
            }, 1000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update post");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm(`Delete "${title}"?`)) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/posts?slug=${slug}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("Failed to delete post");
            }

            router.push("/admin");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete post");
        } finally {
            setIsDeleting(false);
        }
    };

    const inputStyle = {
        width: "100%",
        padding: "0.875rem 1rem",
        fontSize: "1rem",
        border: "1px solid var(--border)",
        borderRadius: "10px",
        backgroundColor: "var(--card-bg)",
        transition: "border-color 0.2s, box-shadow 0.2s",
        outline: "none"
    };

    if (loading) {
        return (
            <div style={{ maxWidth: "800px", margin: "0 auto", padding: "3rem 2rem", color: "var(--text-secondary)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ animation: "pulse 1.5s infinite" }}>●</span> Loading post...
                </div>
                <style jsx global>{`
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.4; }
                    }
                `}</style>
            </div>
        );
    }

    if (!post) {
        return (
            <div style={{ maxWidth: "800px", margin: "0 auto", padding: "3rem 2rem" }}>
                <p style={{ marginBottom: "1rem", color: "var(--text-secondary)" }}>Post not found</p>
                <Link href="/admin" style={{ color: "var(--foreground)" }}>← Back to posts</Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "3rem 2rem" }}>
            {/* Toast Messages */}
            {(success || error) && (
                <div style={{
                    position: "fixed",
                    top: "1.5rem",
                    right: "1.5rem",
                    padding: "1rem 1.5rem",
                    borderRadius: "8px",
                    backgroundColor: success ? "#1a472a" : "#5c1a1a",
                    color: success ? "#90EE90" : "#ffcccc",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    zIndex: 1000,
                    animation: "fadeIn 0.3s ease"
                }}>
                    {success || error}
                </div>
            )}

            <header style={{ marginBottom: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div>
                    <Link
                        href="/admin"
                        style={{ color: "var(--text-secondary)", fontSize: "0.9rem", textDecoration: "none", transition: "color 0.2s" }}
                        onMouseOver={(e) => e.currentTarget.style.color = "var(--foreground)"}
                        onMouseOut={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
                    >
                        ← Back to posts
                    </Link>
                    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.25rem", marginTop: "1rem" }}>
                        Edit Post
                    </h1>
                </div>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    style={{
                        backgroundColor: "transparent",
                        color: "rgba(200, 80, 80, 0.9)",
                        padding: "0.5rem 1rem",
                        borderRadius: "8px",
                        border: "1px solid rgba(200, 50, 50, 0.3)",
                        fontSize: "0.85rem",
                        cursor: isDeleting ? "not-allowed" : "pointer",
                        opacity: isDeleting ? 0.6 : 1,
                        transition: "all 0.2s"
                    }}
                    onMouseOver={(e) => {
                        if (!isDeleting) {
                            e.currentTarget.style.borderColor = "#c33";
                            e.currentTarget.style.backgroundColor = "rgba(200, 50, 50, 0.1)";
                        }
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = "rgba(200, 50, 50, 0.3)";
                        e.currentTarget.style.backgroundColor = "transparent";
                    }}
                >
                    {isDeleting ? "Deleting..." : "Delete Post"}
                </button>
            </header>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
                {/* Title */}
                <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
                        Title <span style={{ color: "#e57373" }}>*</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>

                {/* Date */}
                <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
                        Date
                    </label>
                    <input
                        type="text"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        style={inputStyle}
                        placeholder="e.g. January 2026"
                    />
                </div>

                {/* Excerpt */}
                <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
                        Excerpt
                    </label>
                    <textarea
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        rows={2}
                        style={{
                            ...inputStyle,
                            resize: "vertical"
                        }}
                    />
                </div>

                {/* Content */}
                <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
                        Content <span style={{ color: "#e57373" }}>*</span>
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows={22}
                        style={{
                            ...inputStyle,
                            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                            fontSize: "0.9rem",
                            lineHeight: 1.7,
                            resize: "vertical"
                        }}
                    />
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "1rem", paddingTop: "0.5rem" }}>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                            backgroundColor: "var(--foreground)",
                            color: "var(--background)",
                            padding: "0.875rem 2rem",
                            borderRadius: "10px",
                            border: "none",
                            fontSize: "1rem",
                            fontWeight: 500,
                            cursor: isSubmitting ? "not-allowed" : "pointer",
                            opacity: isSubmitting ? 0.6 : 1,
                            transition: "transform 0.2s, box-shadow 0.2s"
                        }}
                        onMouseOver={(e) => {
                            if (!isSubmitting) {
                                e.currentTarget.style.transform = "translateY(-1px)";
                                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                            }
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                    <Link
                        href="/admin"
                        style={{
                            padding: "0.875rem 2rem",
                            borderRadius: "10px",
                            border: "1px solid var(--border)",
                            fontSize: "1rem",
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
                        Cancel
                    </Link>
                    <Link
                        href={`/blog/${slug}`}
                        style={{
                            padding: "0.875rem 2rem",
                            borderRadius: "10px",
                            border: "1px solid var(--border)",
                            fontSize: "1rem",
                            textDecoration: "none",
                            color: "var(--text-secondary)",
                            marginLeft: "auto",
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
                        View Post →
                    </Link>
                </div>
            </form>

            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
