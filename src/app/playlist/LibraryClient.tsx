"use client";

import React, { useState, useMemo } from "react";
import { Search, Disc, Shuffle, ChevronLeft } from "lucide-react";
import { useAudio } from "@/components/AudioContext";
import { motion } from "framer-motion";
import { PLAYLIST_CATEGORIES } from "@/data/playlists";
import Link from "next/link";

export default function LibraryClient({ songCount }: { songCount: number }) {
    const { isPlaying, activePlaylistId } = useAudio();
    const [searchQuery, setSearchQuery] = useState("");

    const triggerHaptic = () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(10);
        }
    };

    const filteredCategories = useMemo(() => {
        return PLAYLIST_CATEGORIES.filter(p =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.vibes.some(v => v.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery]);

    const borderStyle = "2px solid #000";
    const shadowStyle = "4px 4px 0 #000";

    return (
        <main style={{
            position: "relative",
            zIndex: 10,
            minHeight: "100svh",
            padding: "16px 16px 120px 16px",
            maxWidth: "600px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            backgroundColor: "#F5F0EB",
            color: "#000"
        }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: "16px" }}>
                <div style={{ width: "44px" }} /> {/* spacer */}
            </div>


            <div>
                <h1 style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontSize: "2.8rem",
                    fontWeight: 900,
                    color: "#000",
                    margin: 0,
                    textTransform: "uppercase",
                    lineHeight: 1,
                    letterSpacing: "-0.04em"
                }}>
                    Library
                </h1>
            </div>

            <div style={{
                width: "100%",
                height: "56px",
                backgroundColor: "#fff",
                display: "flex",
                alignItems: "center",
                padding: "0 16px",
                border: borderStyle,
                boxShadow: shadowStyle
            }}>
                <Search size={20} color="#000" />
                <input
                    type="text"
                    placeholder="Search playlists or vibes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        flex: 1,
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        color: "#000",
                        fontSize: "1rem",
                        marginLeft: "12px",
                        fontFamily: "monospace",
                        fontWeight: 700
                    }}
                />
            </div>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                gap: "16px"
            }}>
                {filteredCategories.map((playlist) => {
                    const isNowPlaying = activePlaylistId === playlist.id;

                    return (
                        <Link
                            key={playlist.id}
                            href={`/playlist/${playlist.id}`}
                            onClick={triggerHaptic}
                            style={{ textDecoration: "none" }}
                        >
                            <motion.div
                                whileHover={{ y: -2 }}
                                whileTap={{ y: 2, x: 2, boxShadow: "2px 2px 0 #000" }}
                                style={{
                                    position: "relative",
                                    aspectRatio: "1/1",
                                    backgroundColor: playlist.coverColor || "#fff",
                                    border: borderStyle,
                                    boxShadow: shadowStyle,
                                    overflow: "hidden",
                                    display: "flex",
                                    flexDirection: "column"
                                }}
                            >
                                <img
                                    src={playlist.coverImage}
                                    alt={playlist.title}
                                    style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0, zIndex: 0, opacity: 0.8 }}
                                    className="mix-blend-multiply" 
                                />
                                <div style={{
                                    position: "absolute",
                                    inset: 0,
                                    background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 80%)",
                                    zIndex: 1
                                }} />
                                
                                <div style={{
                                    position: "absolute",
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    padding: "16px",
                                    zIndex: 2,
                                    display: "flex",
                                    flexDirection: "column"
                                }}>
                                    <div style={{ color: "#fff", fontWeight: 900, fontSize: "1.1rem", fontFamily: "system-ui, -apple-system, sans-serif", textTransform: "uppercase", letterSpacing: "-0.04em" }}>
                                        {playlist.title}
                                    </div>
                                    <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", marginTop: "4px", fontFamily: "monospace", fontWeight: 700 }}>
                                        {playlist.songTitles.length} TRACKS
                                    </div>
                                </div>

                                {isNowPlaying && isPlaying && (
                                    <div style={{
                                        position: "absolute",
                                        top: "12px",
                                        right: "12px",
                                        background: "#000",
                                        padding: "6px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        border: "2px solid #fff",
                                        zIndex: 3
                                    }}>
                                        <Disc size={16} color="#fff" className="animate-spin" />
                                    </div>
                                )}
                            </motion.div>
                        </Link>
                    );
                })}

                <Link
                    href="/playlist/all"
                    onClick={triggerHaptic}
                    style={{ textDecoration: "none" }}
                >
                    <motion.div
                        whileHover={{ y: -2 }}
                        whileTap={{ y: 2, x: 2, boxShadow: "2px 2px 0 #000" }}
                        style={{
                            position: "relative",
                            aspectRatio: "1/1",
                            background: "#fff",
                            border: borderStyle,
                            boxShadow: shadowStyle,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            padding: "20px"
                        }}
                    >
                        <Shuffle size={32} color="#000" style={{ marginBottom: "12px" }} />
                        <div style={{ color: "#000", fontWeight: 900, fontSize: "1.2rem", fontFamily: "system-ui, -apple-system, sans-serif", letterSpacing: "-0.04em" }}>ALL SONGS</div>
                        <div style={{ color: "#666", fontSize: "0.85rem", fontWeight: 700, fontFamily: "monospace", marginTop: "4px" }}>{songCount || "--"} TRACKS</div>
                    </motion.div>
                </Link>
            </div>
        </main>
    );
}
