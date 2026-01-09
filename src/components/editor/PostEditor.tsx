"use client";

import { useState, useRef, useEffect } from "react";
import { ImageUpload } from "./ImageUpload";

interface PostEditorProps {
    initialData?: {
        slug?: string;
        title: string;
        excerpt: string;
        content: string;
        thumbnail?: string;
    };
    onSave: (data: {
        title: string;
        excerpt: string;
        content: string;
        thumbnail?: string;
    }) => Promise<void>;
    isEditing?: boolean;
}

export function PostEditor({ initialData, onSave, isEditing = false }: PostEditorProps) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
    const [content, setContent] = useState(initialData?.content || "");
    const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || "");
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingInline, setIsUploadingInline] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);
    const contentRef = useRef<HTMLTextAreaElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);

    // Add click handlers to images in preview
    useEffect(() => {
        if (!showPreview || !previewRef.current) return;

        const images = previewRef.current.querySelectorAll("img");
        images.forEach((img) => {
            img.style.cursor = "zoom-in";
            img.onclick = () => setZoomedImage(img.src);
        });
    }, [showPreview, content]);

    // Close zoom on escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setZoomedImage(null);
        };
        if (zoomedImage) {
            document.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "";
        };
    }, [zoomedImage]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        try {
            await onSave({ title, excerpt, content, thumbnail: thumbnail || undefined });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save post");
        } finally {
            setIsSaving(false);
        }
    };

    const handleInlineImageUpload = async (file: File) => {
        setIsUploadingInline(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            const data = await response.json();

            // Insert markdown image at cursor position
            const textarea = contentRef.current;
            if (textarea) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const imageMarkdown = `\n![Image](${data.url})\n`;
                const newContent = content.substring(0, start) + imageMarkdown + content.substring(end);
                setContent(newContent);

                // Set cursor after inserted image
                setTimeout(() => {
                    textarea.selectionStart = textarea.selectionEnd = start + imageMarkdown.length;
                    textarea.focus();
                }, 0);
            }
        } catch (err) {
            setError("Failed to upload inline image");
        } finally {
            setIsUploadingInline(false);
        }
    };

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "0.75rem 1rem",
        borderRadius: "8px",
        border: "1px solid var(--border)",
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
        fontSize: "1rem",
        fontFamily: "inherit",
        transition: "border-color 0.2s"
    };

    const labelStyle: React.CSSProperties = {
        display: "block",
        marginBottom: "0.5rem",
        fontWeight: 500,
        color: "var(--foreground)"
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                {/* Title */}
                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={labelStyle}>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter post title..."
                        required
                        style={inputStyle}
                    />
                </div>

                {/* Thumbnail */}
                <ImageUpload
                    value={thumbnail}
                    onChange={setThumbnail}
                    label="Thumbnail Image"
                />

                {/* Excerpt */}
                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={labelStyle}>Excerpt</label>
                    <textarea
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="Brief description of the post..."
                        rows={3}
                        style={{ ...inputStyle, resize: "vertical" }}
                    />
                </div>

                {/* Content */}
                <div style={{ marginBottom: "1.5rem" }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "0.5rem"
                    }}>
                        <label style={{ ...labelStyle, marginBottom: 0 }}>Content (Markdown)</label>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            {/* Insert Image Button */}
                            <label
                                style={{
                                    padding: "0.5rem 0.75rem",
                                    borderRadius: "6px",
                                    border: "1px solid var(--border)",
                                    backgroundColor: "transparent",
                                    color: "var(--foreground)",
                                    fontSize: "0.875rem",
                                    cursor: isUploadingInline ? "wait" : "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.25rem",
                                    transition: "all 0.2s"
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <polyline points="21 15 16 10 5 21" />
                                </svg>
                                {isUploadingInline ? "Uploading..." : "Insert Image"}
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/gif,image/webp"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleInlineImageUpload(file);
                                        e.target.value = "";
                                    }}
                                    style={{ display: "none" }}
                                    disabled={isUploadingInline}
                                />
                            </label>

                            {/* Preview Toggle */}
                            <button
                                type="button"
                                onClick={() => setShowPreview(!showPreview)}
                                style={{
                                    padding: "0.5rem 0.75rem",
                                    borderRadius: "6px",
                                    border: "1px solid var(--border)",
                                    backgroundColor: showPreview ? "var(--foreground)" : "transparent",
                                    color: showPreview ? "var(--background)" : "var(--foreground)",
                                    fontSize: "0.875rem",
                                    cursor: "pointer",
                                    transition: "all 0.2s"
                                }}
                            >
                                {showPreview ? "Edit" : "Preview"}
                            </button>
                        </div>
                    </div>

                    {showPreview ? (
                        <div
                            ref={previewRef}
                            style={{
                                padding: "1rem",
                                borderRadius: "8px",
                                border: "1px solid var(--border)",
                                backgroundColor: "var(--background)",
                                minHeight: "400px",
                                whiteSpace: "pre-wrap",
                                lineHeight: 1.8
                            }}
                            dangerouslySetInnerHTML={{
                                __html: content
                                    .replace(/^### (.*$)/gm, '<h3 style="font-size:1.25rem;font-weight:600;margin:1.5rem 0 0.75rem;">$1</h3>')
                                    .replace(/^## (.*$)/gm, '<h2 style="font-size:1.5rem;font-weight:600;margin:1.5rem 0 0.75rem;">$1</h2>')
                                    .replace(/^# (.*$)/gm, '<h1 style="font-size:1.75rem;font-weight:600;margin:1.5rem 0 0.75rem;">$1</h1>')
                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:8px;margin:1rem 0;cursor:zoom-in;" />')
                                    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color:var(--foreground);text-decoration:underline;">$1</a>')
                                    .replace(/^> (.*$)/gm, '<blockquote style="border-left:3px solid var(--border);padding-left:1rem;margin:1rem 0;font-style:italic;color:var(--muted);">$1</blockquote>')
                                    .replace(/\n\n/g, '</p><p style="margin:1rem 0;">')
                            }}
                        />
                    ) : (
                        <textarea
                            ref={contentRef}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your content in Markdown format..."
                            rows={20}
                            required
                            style={{
                                ...inputStyle,
                                resize: "vertical",
                                fontFamily: "'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace",
                                fontSize: "0.9rem",
                                lineHeight: 1.6
                            }}
                        />
                    )}
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        padding: "1rem",
                        marginBottom: "1.5rem",
                        borderRadius: "8px",
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                        color: "#ef4444",
                        fontSize: "0.875rem"
                    }}>
                        {error}
                    </div>
                )}

                {/* Actions */}
                <div style={{ display: "flex", gap: "1rem" }}>
                    <button
                        type="submit"
                        disabled={isSaving}
                        style={{
                            padding: "0.75rem 2rem",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: "var(--foreground)",
                            color: "var(--background)",
                            fontSize: "1rem",
                            fontWeight: 500,
                            cursor: isSaving ? "wait" : "pointer",
                            opacity: isSaving ? 0.7 : 1,
                            transition: "opacity 0.2s"
                        }}
                    >
                        {isSaving ? "Saving..." : isEditing ? "Update Post" : "Create Post"}
                    </button>
                    <a
                        href="/editor"
                        style={{
                            padding: "0.75rem 2rem",
                            borderRadius: "8px",
                            border: "1px solid var(--border)",
                            backgroundColor: "transparent",
                            color: "var(--foreground)",
                            fontSize: "1rem",
                            textDecoration: "none",
                            textAlign: "center"
                        }}
                    >
                        Cancel
                    </a>
                </div>
            </form>

            {/* Image Zoom Lightbox */}
            {
                zoomedImage && (
                    <div
                        onClick={() => setZoomedImage(null)}
                        style={{
                            position: "fixed",
                            inset: 0,
                            backgroundColor: "rgba(0, 0, 0, 0.92)",
                            zIndex: 9999,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "2rem",
                            cursor: "zoom-out",
                        }}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setZoomedImage(null)}
                            style={{
                                position: "absolute",
                                top: "1.5rem",
                                right: "1.5rem",
                                background: "rgba(255,255,255,0.1)",
                                border: "none",
                                borderRadius: "50%",
                                width: "48px",
                                height: "48px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                color: "white",
                                fontSize: "1.5rem",
                                transition: "background 0.2s"
                            }}
                        >
                            ×
                        </button>

                        {/* Hint */}
                        <p style={{
                            position: "absolute",
                            top: "1.5rem",
                            left: "50%",
                            transform: "translateX(-50%)",
                            color: "rgba(255,255,255,0.5)",
                            fontSize: "0.75rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em"
                        }}>
                            Click anywhere or press ESC to close
                        </p>

                        {/* Zoomed image */}
                        <img
                            src={zoomedImage}
                            alt="Zoomed"
                            style={{
                                maxWidth: "90vw",
                                maxHeight: "85vh",
                                objectFit: "contain",
                                borderRadius: "8px",
                                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                            }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                )
            }
        </>
    );
}
