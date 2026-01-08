"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewPostPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [quote, setQuote] = useState("");
    const [quoteAuthor, setQuoteAuthor] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            // Prepend quote to content if provided (as opener)
            let finalContent = content;
            if (quote) {
                finalContent = `> "${quote}"${quoteAuthor ? ` - ${quoteAuthor}` : ''}\n\n---\n\n${content}`;
            }

            const response = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, excerpt, content: finalContent })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to create post");
            }

            router.push("/admin");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create post");
        } finally {
            setIsSubmitting(false);
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

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "3rem 2rem" }}>
            <header style={{ marginBottom: "2.5rem" }}>
                <Link
                    href="/admin"
                    style={{
                        color: "var(--text-secondary)",
                        fontSize: "0.9rem",
                        textDecoration: "none",
                        transition: "color 0.2s"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = "var(--foreground)"}
                    onMouseOut={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
                >
                    ← Back to posts
                </Link>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.25rem", marginTop: "1rem" }}>
                    New Post
                </h1>
            </header>

            {error && (
                <div style={{
                    backgroundColor: "rgba(200, 50, 50, 0.1)",
                    border: "1px solid rgba(200, 50, 50, 0.3)",
                    color: "#e57373",
                    padding: "1rem 1.25rem",
                    borderRadius: "10px",
                    marginBottom: "1.5rem",
                    fontSize: "0.9rem"
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
                {/* Quote Section - Now at the top */}
                <div style={{
                    backgroundColor: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "1.5rem"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                        <span style={{ fontSize: "1.25rem" }}>💭</span>
                        <label style={{ fontWeight: 500, fontSize: "0.95rem" }}>
                            Opening Quote
                        </label>
                        <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>(optional)</span>
                    </div>
                    <textarea
                        value={quote}
                        onChange={(e) => setQuote(e.target.value)}
                        rows={2}
                        style={{
                            ...inputStyle,
                            fontStyle: "italic",
                            resize: "vertical"
                        }}
                        placeholder="The only real test of intelligence is if you get what you want."
                    />
                    <input
                        type="text"
                        value={quoteAuthor}
                        onChange={(e) => setQuoteAuthor(e.target.value)}
                        style={{
                            ...inputStyle,
                            fontSize: "0.9rem",
                            marginTop: "0.75rem"
                        }}
                        placeholder="Author (e.g. Naval Ravikant)"
                    />
                </div>

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
                        placeholder="Your post title..."
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
                        placeholder="Brief description for the post list..."
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
                        rows={18}
                        style={{
                            ...inputStyle,
                            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                            fontSize: "0.9rem",
                            lineHeight: 1.7,
                            resize: "vertical"
                        }}
                        placeholder="Write your post content here...

Paragraphs are separated by blank lines.

Use **bold** and *italic* for emphasis."
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
                        {isSubmitting ? "Creating..." : "Create Post"}
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
                </div>
            </form>
        </div>
    );
}
