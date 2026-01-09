"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PostEditor } from "@/components/editor/PostEditor";

interface Post {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    thumbnail?: string;
}

export default function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const router = useRouter();
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPost();
    }, [slug]);

    const fetchPost = async () => {
        try {
            const response = await fetch(`/api/posts/${slug}`);
            if (!response.ok) {
                throw new Error("Post not found");
            }
            const data = await response.json();
            setPost(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load post");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (data: {
        title: string;
        excerpt: string;
        content: string;
        thumbnail?: string;
    }) => {
        const response = await fetch(`/api/posts/${slug}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to update post");
        }

        router.refresh();
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
                alignItems: "center",
                gap: "1rem"
            }}>
                <Link
                    href="/editor"
                    style={{
                        color: "var(--muted)",
                        textDecoration: "none",
                        fontSize: "0.875rem"
                    }}
                >
                    ← Back to Posts
                </Link>
                <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                    Edit Post
                </h1>
            </header>

            {/* Content */}
            <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
                {isLoading ? (
                    <div style={{
                        textAlign: "center",
                        padding: "4rem",
                        color: "var(--muted)"
                    }}>
                        Loading post...
                    </div>
                ) : error ? (
                    <div style={{
                        textAlign: "center",
                        padding: "4rem",
                        color: "#ef4444"
                    }}>
                        <p>{error}</p>
                        <Link
                            href="/editor"
                            style={{
                                display: "inline-block",
                                marginTop: "1rem",
                                color: "var(--foreground)",
                                textDecoration: "underline"
                            }}
                        >
                            Back to posts
                        </Link>
                    </div>
                ) : post ? (
                    <PostEditor
                        initialData={post}
                        onSave={handleSave}
                        isEditing
                    />
                ) : null}
            </main>
        </div>
    );
}
