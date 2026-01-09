"use client";

import { useState, useRef, useCallback } from "react";
import { ImageCropper } from "./ImageCropper";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
}

export function ImageUpload({ value, onChange, label = "Upload Image" }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showCropper, setShowCropper] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = useCallback(async (file: File) => {
        setIsUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Upload failed");
            }

            const data = await response.json();
            onChange(data.url);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setIsUploading(false);
        }
    }, [onChange]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleUpload(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            handleUpload(file);
        } else {
            setError("Please drop an image file");
        }
    };

    const handleRemove = () => {
        onChange("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleCropComplete = (croppedUrl: string) => {
        onChange(croppedUrl);
        setShowCropper(false);
    };

    return (
        <>
            <div style={{ marginBottom: "1.5rem" }}>
                <label style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: 500,
                    color: "var(--foreground)"
                }}>
                    {label}
                </label>

                {value ? (
                    <div style={{
                        position: "relative",
                        borderRadius: "12px",
                        overflow: "hidden",
                        border: "1px solid var(--border)"
                    }}>
                        <img
                            src={value}
                            alt="Uploaded"
                            style={{
                                width: "100%",
                                maxHeight: "400px",
                                objectFit: "contain",
                                display: "block",
                                backgroundColor: "var(--hover)"
                            }}
                        />
                        <div style={{
                            position: "absolute",
                            top: "0.75rem",
                            right: "0.75rem",
                            display: "flex",
                            gap: "0.5rem"
                        }}>
                            <button
                                type="button"
                                onClick={() => setShowCropper(true)}
                                style={{
                                    padding: "0.5rem 1rem",
                                    borderRadius: "8px",
                                    border: "none",
                                    backgroundColor: "rgba(59, 130, 246, 0.9)",
                                    color: "white",
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    transition: "background-color 0.2s"
                                }}
                            >
                                ✂️ Crop
                            </button>
                            <button
                                type="button"
                                onClick={handleRemove}
                                style={{
                                    padding: "0.5rem 1rem",
                                    borderRadius: "8px",
                                    border: "none",
                                    backgroundColor: "rgba(239, 68, 68, 0.9)",
                                    color: "white",
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    transition: "background-color 0.2s"
                                }}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            padding: "3rem 2rem",
                            borderRadius: "12px",
                            border: `2px dashed ${isDragging ? "var(--foreground)" : "var(--border)"}`,
                            backgroundColor: isDragging ? "var(--hover)" : "transparent",
                            cursor: "pointer",
                            textAlign: "center",
                            transition: "all 0.2s"
                        }}
                    >
                        {isUploading ? (
                            <div style={{ color: "var(--muted)" }}>
                                <svg
                                    width="48"
                                    height="48"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    style={{ margin: "0 auto 1rem", animation: "spin 1s linear infinite" }}
                                >
                                    <path d="M21 12a9 9 0 11-6.219-8.56" />
                                </svg>
                                <p>Uploading...</p>
                            </div>
                        ) : (
                            <div style={{ color: "var(--muted)" }}>
                                <svg
                                    width="48"
                                    height="48"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{ margin: "0 auto 1rem" }}
                                >
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <polyline points="21 15 16 10 5 21" />
                                </svg>
                                <p style={{ marginBottom: "0.5rem" }}>
                                    Drag and drop an image here, or click to browse
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />

                {error && (
                    <p style={{
                        marginTop: "0.5rem",
                        color: "#ef4444",
                        fontSize: "0.875rem"
                    }}>
                        {error}
                    </p>
                )}

                <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
            </div>

            {/* Image Cropper Modal */}
            {showCropper && value && (
                <ImageCropper
                    imageSrc={value}
                    onCrop={handleCropComplete}
                    onCancel={() => setShowCropper(false)}
                />
            )}
        </>
    );
}

