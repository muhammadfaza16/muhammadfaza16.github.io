"use client";

import { useState, useEffect } from "react";

interface ImageZoomProps {
    src: string;
    alt: string;
}

export function ImageZoom({ src, alt }: ImageZoomProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    return (
        <>
            {/* Thumbnail */}
            <img
                src={src}
                alt={alt}
                onClick={() => setIsOpen(true)}
                style={{
                    width: "100%",
                    borderRadius: "12px",
                    margin: "2rem 0",
                    cursor: "zoom-in",
                    transition: "opacity 0.2s ease"
                }}
                className="hover:opacity-90"
            />

            {/* Lightbox */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.9)",
                        zIndex: 9999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "2rem",
                        cursor: "zoom-out",
                        animation: "fadeIn 0.2s ease"
                    }}
                >
                    {/* Close button */}
                    <button
                        onClick={() => setIsOpen(false)}
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
                        className="hover:bg-white/20"
                    >
                        ×
                    </button>

                    {/* Zoomed image */}
                    <img
                        src={src}
                        alt={alt}
                        style={{
                            maxWidth: "90vw",
                            maxHeight: "90vh",
                            objectFit: "contain",
                            borderRadius: "8px",
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />

                    {/* Caption */}
                    {alt && alt !== "Image" && (
                        <p style={{
                            position: "absolute",
                            bottom: "1.5rem",
                            left: "50%",
                            transform: "translateX(-50%)",
                            color: "rgba(255,255,255,0.7)",
                            fontSize: "0.875rem",
                            textAlign: "center"
                        }}>
                            {alt}
                        </p>
                    )}
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </>
    );
}
