"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface ImageCropperProps {
    imageSrc: string;
    onCrop: (croppedImageUrl: string) => void;
    onCancel: () => void;
}

export function ImageCropper({ imageSrc, onCrop, onCancel }: ImageCropperProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const CANVAS_WIDTH = 600;
    const CANVAS_HEIGHT = 400;

    // Draw image on canvas
    const drawImage = useCallback(() => {
        const canvas = canvasRef.current;
        const image = imageRef.current;
        if (!canvas || !image || !imageLoaded) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Clear canvas
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Calculate scaled dimensions
        const scaledWidth = image.naturalWidth * scale;
        const scaledHeight = image.naturalHeight * scale;

        // Draw image centered with offset
        const x = (CANVAS_WIDTH - scaledWidth) / 2 + offset.x;
        const y = (CANVAS_HEIGHT - scaledHeight) / 2 + offset.y;

        ctx.drawImage(image, x, y, scaledWidth, scaledHeight);

        // Draw crop frame overlay
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(2, 2, CANVAS_WIDTH - 4, CANVAS_HEIGHT - 4);
    }, [scale, offset, imageLoaded]);

    useEffect(() => {
        drawImage();
    }, [drawImage]);

    // Handle mouse/touch events for panning
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setOffset({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Handle zoom
    const handleZoom = (delta: number) => {
        setScale(prev => Math.max(0.1, Math.min(3, prev + delta)));
    };

    // Handle wheel zoom
    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        handleZoom(delta);
    };

    // Save cropped image
    const handleSave = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        setIsSaving(true);
        try {
            // Convert canvas to blob
            const blob = await new Promise<Blob>((resolve, reject) => {
                canvas.toBlob((b) => {
                    if (b) resolve(b);
                    else reject(new Error("Failed to create blob"));
                }, "image/png", 0.9);
            });

            // Upload the cropped image
            const formData = new FormData();
            formData.append("file", blob, "cropped-thumbnail.png");

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Upload failed");

            const data = await response.json();
            onCrop(data.url);
        } catch (err) {
            console.error("Failed to save cropped image:", err);
            alert("Failed to save cropped image");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem"
        }}>
            {/* Header */}
            <div style={{
                position: "absolute",
                top: "1.5rem",
                left: "50%",
                transform: "translateX(-50%)",
                color: "white",
                textAlign: "center"
            }}>
                <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Crop Thumbnail</h3>
                <p style={{ fontSize: "0.875rem", opacity: 0.6 }}>
                    Drag to pan • Scroll to zoom
                </p>
            </div>

            {/* Hidden image for loading */}
            <img
                ref={imageRef}
                src={imageSrc}
                alt="Source"
                style={{ display: "none" }}
                onLoad={() => {
                    setImageLoaded(true);
                    // Auto-fit image
                    const img = imageRef.current;
                    if (img) {
                        const scaleX = CANVAS_WIDTH / img.naturalWidth;
                        const scaleY = CANVAS_HEIGHT / img.naturalHeight;
                        setScale(Math.min(scaleX, scaleY) * 0.9);
                    }
                }}
            />

            {/* Canvas */}
            <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                style={{
                    borderRadius: "12px",
                    cursor: isDragging ? "grabbing" : "grab",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                }}
            />

            {/* Zoom controls */}
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginTop: "1.5rem"
            }}>
                <button
                    onClick={() => handleZoom(-0.1)}
                    style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        border: "1px solid rgba(255,255,255,0.2)",
                        backgroundColor: "rgba(255,255,255,0.1)",
                        color: "white",
                        fontSize: "1.5rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    −
                </button>
                <span style={{
                    color: "white",
                    fontSize: "0.875rem",
                    minWidth: "60px",
                    textAlign: "center"
                }}>
                    {Math.round(scale * 100)}%
                </span>
                <button
                    onClick={() => handleZoom(0.1)}
                    style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        border: "1px solid rgba(255,255,255,0.2)",
                        backgroundColor: "rgba(255,255,255,0.1)",
                        color: "white",
                        fontSize: "1.5rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    +
                </button>
            </div>

            {/* Action buttons */}
            <div style={{
                display: "flex",
                gap: "1rem",
                marginTop: "2rem"
            }}>
                <button
                    onClick={onCancel}
                    disabled={isSaving}
                    style={{
                        padding: "0.75rem 2rem",
                        borderRadius: "8px",
                        border: "1px solid rgba(255,255,255,0.2)",
                        backgroundColor: "transparent",
                        color: "white",
                        fontSize: "1rem",
                        cursor: "pointer"
                    }}
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    disabled={isSaving || !imageLoaded}
                    style={{
                        padding: "0.75rem 2rem",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: "white",
                        color: "black",
                        fontSize: "1rem",
                        fontWeight: 500,
                        cursor: isSaving ? "wait" : "pointer",
                        opacity: isSaving ? 0.7 : 1
                    }}
                >
                    {isSaving ? "Saving..." : "Use as Thumbnail"}
                </button>
            </div>
        </div>
    );
}
