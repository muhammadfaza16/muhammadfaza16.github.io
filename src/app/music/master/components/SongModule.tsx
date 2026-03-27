"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { parseSongTitle } from "@/utils/songUtils";
import { useTheme } from "@/components/ThemeProvider";
import {
    Plus,
    Trash2,
    Edit2,
    Save,
    X,
    Music,
    Search,
    Link as LinkIcon,
    Clock,
    Tag
} from "lucide-react";
import { getInputStyle } from "./sharedStyles";

interface Song {
    id: string;
    title: string;
    artist: string;
    audioUrl: string;
    source: string;
    duration: number;
    category: string;
}

interface SongModuleProps {
    addLog: (text: string, type?: "info" | "success" | "error") => void;
    isBusy: boolean;
    setIsBusy: (busy: boolean) => void;
    insetBox: any;
}

export function SongModule({ addLog, isBusy, setIsBusy, insetBox }: SongModuleProps) {
    const { theme } = useTheme();
    const [songs, setSongs] = useState<Song[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        artist: "",
        audioUrl: "",
        source: "Local",
        duration: 0,
        category: "Other"
    });

    useEffect(() => {
        fetchSongs();
    }, []);

    const fetchSongs = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/music/songs", { cache: 'no-store' });
            const data = await res.json();
            if (data.success) setSongs(data.songs);
        } catch (err) {
            addLog("Failed to fetch songs", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.title || !formData.audioUrl) {
            addLog("Title and Audio URL are required", "error");
            return;
        }
        setIsBusy(true);
        try {
            const method = editingId ? "PUT" : "POST";
            const body = editingId ? { id: editingId, ...formData } : formData;

            const res = await fetch("/api/music/songs", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const data = await res.json();
            if (data.success) {
                addLog(`Song ${editingId ? "updated" : "added"}: ${formData.title}`, "success");
                await fetchSongs();
                resetForm();
            } else {
                addLog(data.error || "Operation failed", "error");
            }
        } catch (err) {
            addLog("Connection error", "error");
        } finally {
            setIsBusy(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Permanently delete "${title}" from the entire system?`)) return;
        setIsBusy(true);
        try {
            const res = await fetch(`/api/music/songs/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                addLog(`Song deleted: ${title}`, "info");
                await fetchSongs();
            } else {
                addLog(data.error || "Delete failed", "error");
            }
        } catch (err) {
            addLog("Delete failed", "error");
        } finally {
            setIsBusy(false);
        }
    };

    const resetForm = () => {
        setFormData({ title: "", artist: "", audioUrl: "", source: "Local", duration: 0, category: "Other" });
        setEditingId(null);
        setIsAdding(false);
    };

    const startEdit = (s: Song) => {
        setFormData({
            title: s.title.includes(' — ') ? s.title.split(' — ')[1] : s.title,
            artist: s.artist || "",
            audioUrl: s.audioUrl,
            source: s.source || "Local",
            duration: s.duration || 0,
            category: s.category || "Other"
        });
        setEditingId(s.id);
        setIsAdding(true);
    };

    const filteredSongs = useMemo(() => {
        if (!searchQuery) return songs;
        const q = searchQuery.toLowerCase();
        return songs.filter(s => 
            s.title.toLowerCase().includes(q) || 
            s.artist.toLowerCase().includes(q) ||
            s.category.toLowerCase().includes(q)
        );
    }, [songs, searchQuery]);

    if (isLoading) return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }} className="animate-pulse">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ width: "120px", height: "12px", background: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", borderRadius: "4px" }} />
                <div style={{ width: "100px", height: "24px", background: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", borderRadius: "8px" }} />
            </div>
            <div style={{ height: "36px", background: theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", borderRadius: "12px", border: theme === "dark" ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[...Array(5)].map((_, i) => (
                    <div key={i} style={{ height: "56px", background: theme === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", borderRadius: "16px", border: theme === "dark" ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)" }} />
                ))}
            </div>
        </div>
    );

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ color: theme === "dark" ? "rgba(255,255,255,0.4)" : "#aaa", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                    Global Catalog ({songs.length})
                </h3>
                {!isAdding && (
                    <motion.button
                        onClick={() => setIsAdding(true)}
                        whileTap={{ scale: 0.95 }}
                        style={{ ...insetBox, padding: "4px 12px", color: theme === "dark" ? "#10B981" : "#059669", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.6rem", fontWeight: 800, cursor: "pointer" }}
                    >
                        <Plus size={12} /> ADD NEW SONG
                    </motion.button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {isAdding ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        style={{ ...insetBox, padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}
                    >
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                <label style={{ color: theme === "dark" ? "rgba(255,255,255,0.4)" : "#555", fontSize: "0.55rem", fontWeight: 800 }}>ARTIST</label>
                                <input
                                    value={formData.artist}
                                    onChange={e => setFormData({ ...formData, artist: e.target.value })}
                                    style={{ ...getInputStyle(theme), padding: "0.6rem" }}
                                    placeholder="L'Arc-en-Ciel"
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                <label style={{ color: theme === "dark" ? "rgba(255,255,255,0.4)" : "#555", fontSize: "0.55rem", fontWeight: 800 }}>SONG TITLE</label>
                                <input
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    style={{ ...getInputStyle(theme), padding: "0.6rem" }}
                                    placeholder="Honey"
                                />
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            <label style={{ color: theme === "dark" ? "rgba(255,255,255,0.4)" : "#555", fontSize: "0.55rem", fontWeight: 800 }}>AUDIO URL (Direct File Link)</label>
                            <div style={{ position: "relative" }}>
                                <input
                                    value={formData.audioUrl}
                                    onChange={e => setFormData({ ...formData, audioUrl: e.target.value })}
                                    style={{ ...getInputStyle(theme), padding: "0.6rem 0.6rem 0.6rem 2.2rem", width: "100%" }}
                                    placeholder="https://.../music.mp3"
                                />
                                <LinkIcon size={12} style={{ position: "absolute", left: "0.8rem", top: "50%", transform: "translateY(-50%)", opacity: 0.4 }} />
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                <label style={{ color: theme === "dark" ? "rgba(255,255,255,0.4)" : "#555", fontSize: "0.55rem", fontWeight: 800 }}>CATEGORY</label>
                                <input
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    style={{ ...getInputStyle(theme), padding: "0.6rem" }}
                                    placeholder="Indo, Luar, etc."
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                <label style={{ color: theme === "dark" ? "rgba(255,255,255,0.4)" : "#555", fontSize: "0.55rem", fontWeight: 800 }}>SOURCE</label>
                                <input
                                    value={formData.source}
                                    onChange={e => setFormData({ ...formData, source: e.target.value })}
                                    style={{ ...getInputStyle(theme), padding: "0.6rem" }}
                                    placeholder="Local / Cloud"
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                <label style={{ color: theme === "dark" ? "rgba(255,255,255,0.4)" : "#555", fontSize: "0.55rem", fontWeight: 800 }}>DURATION (sec)</label>
                                <input
                                    type="number"
                                    value={formData.duration}
                                    onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                                    style={{ ...getInputStyle(theme), padding: "0.6rem" }}
                                />
                            </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.5rem" }}>
                            <motion.button onClick={resetForm} whileTap={{ scale: 0.95 }} style={{ ...insetBox, padding: "8px 16px", color: theme === "dark" ? "rgba(255,255,255,0.4)" : "#555", fontSize: "0.6rem", fontWeight: 800 }}>CANCEL</motion.button>
                            <motion.button
                                onClick={handleSave}
                                disabled={isBusy}
                                whileTap={{ scale: 0.95 }}
                                style={{ ...insetBox, padding: "8px 16px", color: theme === "dark" ? "#10B981" : "#059669", fontSize: "0.65rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "6px", opacity: isBusy ? 0.4 : 1, cursor: isBusy ? "not-allowed" : "pointer" }}
                            >
                                <Save size={14} /> {editingId ? "UPDATE SONG" : "SAVE TO CATALOG"}
                            </motion.button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
                    >
                        <div style={{ ...insetBox, padding: "0.6rem 1rem", display: "flex", alignItems: "center", gap: "10px" }}>
                            <Search size={14} style={{ opacity: 0.4 }} />
                            <input 
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search title, artist, or category..."
                                style={{ background: "none", border: "none", outline: "none", color: "inherit", fontSize: "0.7rem", flex: 1, fontFamily: "inherit" }}
                            />
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "60vh", overflowY: "auto", paddingRight: "4px" }}>
                            {filteredSongs.map(song => (
                                <div
                                    key={song.id}
                                    style={{ ...insetBox, padding: "0.75rem 1rem", display: "flex", alignItems: "center", gap: "1rem" }}
                                >
                                    <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Music size={16} style={{ opacity: 0.6 }} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                                            <span style={{ fontSize: "0.75rem", fontWeight: 800, color: theme === "dark" ? "#FFF" : "#000" }}>{song.title}</span>
                                            <span style={{ fontSize: "0.5rem", fontWeight: 800, padding: "2px 6px", borderRadius: "4px", background: "rgba(99, 102, 241, 0.1)", color: "#6366F1", textTransform: "uppercase" }}>{song.category}</span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "2px" }}>
                                            <span style={{ fontSize: "0.55rem", fontWeight: 700, color: "rgba(128,128,128,0.6)" }}>{song.artist}</span>
                                            <span style={{ fontSize: "0.5rem", color: "rgba(128,128,128,0.4)" }}>•</span>
                                            <span style={{ fontSize: "0.55rem", color: "rgba(128,128,128,0.4)", display: "flex", alignItems: "center", gap: "3px" }}>
                                                <Clock size={10} /> {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: "4px" }}>
                                        <motion.button onClick={() => startEdit(song)} whileTap={{ scale: 0.9 }} style={{ padding: "8px", color: theme === "dark" ? "rgba(255,255,255,0.4)" : "#666" }}>
                                            <Edit2 size={14} />
                                        </motion.button>
                                        <motion.button onClick={() => handleDelete(song.id, song.title)} whileTap={{ scale: 0.9 }} style={{ padding: "8px", color: "#EF4444" }}>
                                            <Trash2 size={14} />
                                        </motion.button>
                                    </div>
                                </div>
                            ))}
                            {filteredSongs.length === 0 && (
                                <div style={{ padding: "2rem", textAlign: "center", opacity: 0.3, fontSize: "0.7rem" }}>No songs found in catalog.</div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
