"use client";

import { useEffect, useRef, useState } from "react";

interface ArticleContentProps {
    html: string;
}

export function ArticleContent({ html }: ArticleContentProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Add click handlers to all images
        const images = containerRef.current.querySelectorAll("img");
        images.forEach((img) => {
            img.style.cursor = "zoom-in";
            img.addEventListener("click", () => {
                setZoomedImage(img.src);
            });
        });
    }, [html]);

    // Close on escape
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

    return (
        <>
            <div
                ref={containerRef}
                className="prose-editorial drop-cap animate-fade-in animation-delay-200"
                style={{
                    fontSize: "1.1rem",
                    lineHeight: 1.85,
                }}
                dangerouslySetInnerHTML={{ __html: html }}
            />

            {/* Lightbox */}
            {zoomedImage && (
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
                    className="animate-fade-in"
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
                        className="hover:bg-white/20"
                    >
                        ×
                    </button>

                    {/* Hint text */}
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
                        Click anywhere to close
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
            )}
        </>
    );
}
