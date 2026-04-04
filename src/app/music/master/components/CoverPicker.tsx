"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";
import {
    Image as ImageIcon,
    Upload,
    X,
    Check,
    Loader2,
    ChevronDown,
    Trash2
} from "lucide-react";

interface CoverPickerProps {
    value: string;
    onChange: (url: string) => void;
    insetBox: any;
    compact?: boolean;
}

export function CoverPicker({ value, onChange, insetBox, compact = false }: CoverPickerProps) {
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [covers, setCovers] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const fetchCovers = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/music/master/assets/playlist-covers", { cache: "no-store" });
            const data = await res.json();
            if (data.success) setCovers(data.covers);
        } catch { } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen && covers.length === 0) fetchCovers();
    }, [isOpen, covers.length, fetchCovers]);

    // Close on outside click
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [isOpen]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadError("");
        setIsUploading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/music/master/assets/playlist-covers", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                onChange(data.url);
                await fetchCovers();
            } else {
                setUploadError(data.error || "Upload failed");
            }
        } catch {
            setUploadError("Upload failed");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const selectCover = (filename: string) => {
        onChange(`/images/playlist/${filename}`);
        setIsOpen(false);
    };

    const clearCover = () => {
        onChange("");
        setIsOpen(false);
    };

    const currentFilename = value ? value.split("/").pop() : null;
    const isDark = theme === "dark";

    const labelStyle: React.CSSProperties = {
        color: isDark ? "rgba(255,255,255,0.3)" : "#777",
        fontSize: "0.5rem",
        fontWeight: 800
    };

    const triggerStyle: React.CSSProperties = {
        ...insetBox,
        padding: compact ? "4px 8px" : "6px 10px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
        minHeight: compact ? "28px" : "34px",
        position: "relative",
        transition: "border-color 0.2s",
        borderColor: isOpen
            ? (isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)")
            : undefined
    };

    const dropdownStyle: React.CSSProperties = {
        borderRadius: "12px",
        boxShadow: isDark
            ? "0 20px 50px rgba(0,0,0,0.8)"
            : "0 20px 50px rgba(0,0,0,0.2)",
        overflow: "hidden",
        minWidth: "280px",
        zIndex: 1000,
        top: "calc(100% + 8px)",
        ...(compact ? { left: 0 } : { right: 0 }),
        position: "absolute",
        background: isDark ? "rgba(15,15,20,0.98)" : "rgba(255,255,255,0.98)",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
        marginTop: 0
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", position: "relative" }} ref={containerRef}>
            {!compact && <label style={labelStyle}>COVER IMAGE</label>}

            {/* Trigger Button */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={triggerStyle}
            >
                {/* Preview thumbnail */}
                {value ? (
                    <div style={{
                        width: compact ? "20px" : "24px",
                        height: compact ? "20px" : "24px",
                        borderRadius: "6px",
                        overflow: "hidden",
                        flexShrink: 0,
                        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)"
                    }}>
                        <img
                            src={value}
                            alt="Cover"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </div>
                ) : (
                    <ImageIcon size={compact ? 12 : 14} style={{ opacity: 0.4, flexShrink: 0 }} />
                )}

                {/* Filename */}
                <span style={{
                    flex: 1,
                    fontSize: compact ? "0.55rem" : "0.6rem",
                    fontWeight: 600,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    opacity: value ? 1 : 0.4
                }}>
                    {currentFilename || "Choose cover..."}
                </span>

                <ChevronDown
                    size={12}
                    style={{
                        opacity: 0.4,
                        flexShrink: 0,
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s"
                    }}
                />
            </div>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        style={{ ...dropdownStyle, marginTop: "0" }}
                    >
                        {/* Upload Section */}
                        <div style={{
                            padding: "10px 12px",
                            borderBottom: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
                            display: "flex",
                            gap: "8px",
                            alignItems: "center"
                        }}>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                                onChange={handleUpload}
                                style={{ display: "none" }}
                            />
                            <motion.button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "6px",
                                    padding: "8px 12px",
                                    borderRadius: "8px",
                                    border: isDark ? "1px dashed rgba(255,255,255,0.15)" : "1px dashed rgba(0,0,0,0.15)",
                                    background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                                    color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
                                    fontSize: "0.55rem",
                                    fontWeight: 800,
                                    cursor: isUploading ? "not-allowed" : "pointer",
                                    opacity: isUploading ? 0.5 : 1,
                                    transition: "all 0.2s"
                                }}
                            >
                                {isUploading ? (
                                    <Loader2 size={12} className="animate-spin" />
                                ) : (
                                    <Upload size={12} />
                                )}
                                {isUploading ? "UPLOADING..." : "UPLOAD FROM DEVICE"}
                            </motion.button>

                            {value && (
                                <motion.button
                                    onClick={clearCover}
                                    whileTap={{ scale: 0.9 }}
                                    style={{
                                        padding: "8px",
                                        borderRadius: "8px",
                                        border: "1px solid rgba(239,68,68,0.2)",
                                        background: "rgba(239,68,68,0.05)",
                                        color: "#ef4444",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center"
                                    }}
                                    title="Remove cover"
                                >
                                    <Trash2 size={12} />
                                </motion.button>
                            )}
                        </div>

                        {uploadError && (
                            <div style={{
                                padding: "6px 12px",
                                fontSize: "0.5rem",
                                color: "#ef4444",
                                fontWeight: 700,
                                background: "rgba(239,68,68,0.05)"
                            }}>
                                ✗ {uploadError}
                            </div>
                        )}

                        {/* Gallery label */}
                        <div style={{
                            padding: "8px 12px 4px",
                            fontSize: "0.45rem",
                            fontWeight: 800,
                            letterSpacing: "1px",
                            color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
                            textTransform: "uppercase"
                        }}>
                            Available Covers ({covers.length})
                        </div>

                        {/* Gallery Grid */}
                        <div style={{
                            padding: "6px 10px 10px",
                            maxHeight: "180px", // Slightly shorter to avoid overflow
                            overflowY: "auto",
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 1fr)",
                            gap: "6px"
                        }}>
                            {isLoading ? (
                                <div style={{
                                    gridColumn: "1 / -1",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "20px",
                                    color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"
                                }}>
                                    <Loader2 size={16} className="animate-spin" />
                                </div>
                            ) : covers.length === 0 ? (
                                <div style={{
                                    gridColumn: "1 / -1",
                                    textAlign: "center",
                                    padding: "20px",
                                    fontSize: "0.55rem",
                                    color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"
                                }}>
                                    No covers yet. Upload one!
                                </div>
                            ) : (
                                covers.map(filename => {
                                    const url = `/images/playlist/${filename}`;
                                    const isSelected = value === url;

                                    return (
                                        <motion.div
                                            key={filename}
                                            onClick={() => selectCover(filename)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            style={{
                                                position: "relative",
                                                aspectRatio: "1",
                                                borderRadius: "8px",
                                                overflow: "hidden",
                                                cursor: "pointer",
                                                border: isSelected
                                                    ? "2px solid #10B981"
                                                    : isDark
                                                        ? "1px solid rgba(255,255,255,0.08)"
                                                        : "1px solid rgba(0,0,0,0.08)",
                                                boxShadow: isSelected ? "0 0 12px rgba(16,185,129,0.3)" : "none",
                                                transition: "border-color 0.2s, box-shadow 0.2s"
                                            }}
                                        >
                                            <img
                                                src={url}
                                                alt={filename}
                                                loading="lazy"
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                    display: "block"
                                                }}
                                            />

                                            {/* Selected indicator */}
                                            {isSelected && (
                                                <div style={{
                                                    position: "absolute",
                                                    inset: 0,
                                                    background: "rgba(16,185,129,0.2)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}>
                                                    <div style={{
                                                        width: "20px",
                                                        height: "20px",
                                                        borderRadius: "50%",
                                                        background: "#10B981",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
                                                    }}>
                                                        <Check size={12} color="#FFF" strokeWidth={3} />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Filename tooltip on hover */}
                                            <div style={{
                                                position: "absolute",
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                padding: "12px 4px 3px",
                                                background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                                                fontSize: "0.4rem",
                                                color: "#fff",
                                                fontWeight: 700,
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                textAlign: "center"
                                            }}>
                                                {filename}
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
