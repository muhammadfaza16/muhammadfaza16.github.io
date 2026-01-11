"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/Container";
import { Post } from "@/lib/posts";

const ADMIN_PASSWORD = "faza123";

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [authError, setAuthError] = useState("");
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);

    // Editor State
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    // Form Inputs
    const [formData, setFormData] = useState<Partial<Post>>({});
    const [message, setMessage] = useState("");

    // Fetch posts on load/auth
    useEffect(() => {
        if (isAuthenticated) {
            fetchPosts();
        }
    }, [isAuthenticated]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/posts");
            const data = await res.json();
            setPosts(data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleLogin = () => {
        if (passwordInput === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            setAuthError("");
        } else {
            setAuthError("Password salah!");
        }
    };

    const handleCreate = () => {
        setIsCreating(true);
        setFormData({ title: "", slug: "", excerpt: "", content: "", thumbnail: "" });
        setEditingPost(null);
        setMessage("");
    };

    const handleEdit = (post: Post) => {
        setIsCreating(false);
        setEditingPost(post);
        setFormData({ ...post });
        setMessage("");
    };

    const handleCancel = () => {
        setIsCreating(false);
        setEditingPost(null);
        setFormData({});
        setMessage("");
    };

    const handleSave = async () => {
        if (!formData.title || !formData.content) {
            setMessage("❌ Title dan Content harus diisi!");
            return;
        }

        const endpoint = "/api/posts";
        const method = isCreating ? "POST" : "PUT";
        const body = {
            adminPassword: ADMIN_PASSWORD,
            post: isCreating ? formData : undefined,
            slug: isCreating ? undefined : editingPost?.slug,
            updates: isCreating ? undefined : formData
        };

        try {
            const res = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                setMessage(isCreating ? "✅ Post created!" : "✅ Post updated!");
                await fetchPosts();
                handleCancel();
            } else {
                const err = await res.json();
                setMessage(`❌ Error: ${err.error}`);
            }
        } catch (err) {
            setMessage("❌ Network error");
        }
    };

    const handleDelete = async (slug: string) => {
        if (!confirm(`Hapus post "${slug}"?`)) return;

        try {
            const res = await fetch("/api/posts", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ adminPassword: ADMIN_PASSWORD, slug })
            });

            if (res.ok) {
                await fetchPosts();
                setMessage("✅ Post deleted!");
            } else {
                setMessage("❌ Failed to delete");
            }
        } catch (err) {
            setMessage("❌ Network error");
        }
    };

    if (!isAuthenticated) {
        return (
            <Container>
                <div className="min-h-screen flex items-center justify-center -mt-20">
                    <div className="w-full max-w-md p-8 bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl shadow-lg text-center">
                        <span className="text-4xl mb-4 block">🛡️</span>
                        <h1 className="text-2xl font-serif font-medium mb-2">CMS Login</h1>
                        <p className="text-[var(--text-secondary)] mb-6 text-sm">Masuk untuk mengelola konten.</p>

                        <input
                            type="password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                            placeholder="Password..."
                            className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--hover-bg)] mb-4 text-center text-lg outline-none focus:border-[var(--foreground)] transition-colors"
                        />

                        {authError && <p className="text-red-500 mb-4 text-sm font-medium">{authError}</p>}

                        <button
                            onClick={handleLogin}
                            className="w-full py-3 bg-[var(--foreground)] text-[var(--background)] rounded-lg font-medium hover:opacity-90 transition-opacity"
                        >
                            Masuk
                        </button>
                    </div>
                </div>
            </Container>
        );
    }

    // Editor View
    if (isCreating || editingPost) {
        return (
            <Container>
                <div className="py-20 max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-serif font-medium">
                            {isCreating ? "New Post" : "Edit Post"}
                        </h1>
                        <button onClick={handleCancel} className="text-[var(--text-secondary)] hover:text-[var(--foreground)]">
                            ← Back to Dashboard
                        </button>
                    </div>

                    {message && (
                        <div className={`p-4 mb-6 rounded-lg ${message.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            {message}
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Title</label>
                            <input
                                type="text"
                                value={formData.title || ""}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full p-4 text-xl font-serif border border-[var(--border)] rounded-lg bg-[var(--card-bg)] focus:outline-none focus:border-[var(--foreground)] transition-colors"
                                placeholder="The Title of the Article..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Slug */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Slug (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.slug || ""}
                                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full p-3 font-mono text-sm border border-[var(--border)] rounded-lg bg-[var(--hover-bg)]"
                                    placeholder="auto-generated-from-title"
                                />
                            </div>
                            {/* Thumbnail */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Thumbnail URL</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={formData.thumbnail || ""}
                                        onChange={e => setFormData({ ...formData, thumbnail: e.target.value })}
                                        className="w-full p-3 text-sm border border-[var(--border)] rounded-lg bg-[var(--card-bg)]"
                                        placeholder="/images/blog/..."
                                    />
                                    <label className="flex items-center justify-center px-4 py-3 bg-[var(--hover-bg)] border border-[var(--border)] rounded-lg cursor-pointer hover:bg-[var(--border)] transition-colors" title="Upload Image">
                                        <span className="text-xl">📷</span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;

                                                const data = new FormData();
                                                data.append("file", file);
                                                data.append("adminPassword", ADMIN_PASSWORD);

                                                try {
                                                    const res = await fetch("/api/upload", {
                                                        method: "POST",
                                                        body: data
                                                    });

                                                    if (res.ok) {
                                                        const result = await res.json();
                                                        setFormData(prev => ({ ...prev, thumbnail: result.url }));
                                                        setMessage("✅ Image uploaded!");
                                                    } else {
                                                        const err = await res.json();
                                                        setMessage(`❌ Upload failed: ${err.error}`);
                                                    }
                                                } catch {
                                                    setMessage("❌ Network error during upload");
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Excerpt */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Excerpt</label>
                            <textarea
                                value={formData.excerpt || ""}
                                onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                                className="w-full p-3 text-sm border border-[var(--border)] rounded-lg bg-[var(--card-bg)] min-h-[80px]"
                                placeholder="Short description..."
                            />
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Content (Markdown)</label>
                            <textarea
                                value={formData.content || ""}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                className="w-full p-4 font-mono text-sm border border-[var(--border)] rounded-lg bg-[var(--card-bg)] min-h-[400px] leading-relaxed"
                                placeholder="# Write your story here..."
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
                            <button
                                onClick={handleCancel}
                                className="px-6 py-3 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-8 py-3 rounded-lg text-sm font-medium bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition-opacity"
                            >
                                Save Post
                            </button>
                        </div>
                    </div>
                </div>
            </Container>
        );
    }

    // Dashboard View
    return (
        <Container>
            <div className="py-20">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-serif font-medium mb-2">Content Manager</h1>
                        <p className="text-[var(--text-secondary)]">Manage your blog posts.</p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-full font-medium hover:shadow-lg hover:-translate-y-1 transition-all"
                    >
                        + New Post
                    </button>
                </div>

                {message && (
                    <div className={`p-4 mb-8 rounded-lg ${message.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {message}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-20 text-[var(--text-secondary)]">Loading posts...</div>
                ) : (
                    <div className="grid gap-4">
                        {posts.length === 0 ? (
                            <div className="text-center py-20 border border-dashed border-[var(--border)] rounded-2xl">
                                <span className="text-4xl block mb-4">📝</span>
                                <p className="text-[var(--text-secondary)]">No posts found. Start writing!</p>
                            </div>
                        ) : (
                            posts.map(post => (
                                <div key={post.slug} className="group p-6 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl flex items-center justify-between hover:border-[var(--border-strong)] transition-all">
                                    <div className="flex-1 min-w-0 pr-8">
                                        <h3 className="text-lg font-serif font-medium truncate">{post.title}</h3>
                                        {/* Category placeholder - future implementation */}
                                        {/* <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--hover-bg)] text-[var(--text-secondary)] font-mono border border-[var(--border)]">
                                                Uncategorized
                                            </span> */}
                                        <p className="text-sm text-[var(--text-secondary)] font-mono flex gap-4">
                                            <span>{post.date}</span>
                                            <span className="opacity-50">•</span>
                                            <span>/{post.slug}</span>
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <a
                                            href={`/blog/${post.slug}`}
                                            target="_blank"
                                            className="p-2 text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--hover-bg)] rounded-lg transition-colors"
                                            title="View Live"
                                        >
                                            👁️
                                        </a>
                                        <button
                                            onClick={() => handleEdit(post)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post.slug)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </Container >
    );
}
