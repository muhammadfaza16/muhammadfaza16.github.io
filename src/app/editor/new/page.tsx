"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { PostEditor } from "@/components/editor/PostEditor";

export default function NewPostPage() {
    const router = useRouter();

    const handleSave = async (data: {
        title: string;
        excerpt: string;
        content: string;
        thumbnail?: string;
    }) => {
        const response = await fetch("/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to create post");
        }

        const post = await response.json();
        router.push(`/editor/${post.slug}`);
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
                    New Post
                </h1>
            </header>

            {/* Content */}
            <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
                <PostEditor onSave={handleSave} />
            </main>
        </div>
    );
}
