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
    ListMusic,
    Palette,
    Music,
    Search,
    ChevronRight,
    MinusCircle
} from "lucide-react";
import { getInputStyle } from "./sharedStyles";

interface Playlist {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    philosophy: string | null;
    schedule: string | null;
    vibes: string[];
    coverImage: string | null;
    coverColor: string;
    _count?: {
        songs: number;
    };
}

interface Song {
    id: string;
    title: string;
    artist: string;
}

interface PlaylistModuleProps {
    addLog: (text: string, type?: "info" | "success" | "error") => void;
    isBusy: boolean;
    setIsBusy: (busy: boolean) => void;
    insetBox: any;
}

export function PlaylistModule({ addLog, isBusy, setIsBusy, insetBox }: PlaylistModuleProps) {
    const { theme } = useTheme();
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [viewingPlaylist, setViewingPlaylist] = useState<Playlist | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    // Songs in current playlist
    const [currentSongs, setCurrentSongs] = useState<Song[]>([]);
    const [allSongs, setAllSongs] = useState<Song[]>([]);
    const [songSearch, setSongSearch] = useState("");

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        description: "",
        philosophy: "",
        schedule: "",
        vibes: "",
        coverImage: "",
        coverColor: "#3b82f6"
    });

    const autoSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Issue 4: Exclude already-added songs from the add list
    const availableSongs = useMemo(() => {
        const currentIds = new Set(currentSongs.map(s => s.id));
        return allSongs.filter(s => !currentIds.has(s.id));
    }, [allSongs, currentSongs]);

    // Issue 1: Remove hard cap — show all, search filters when query ≥ 2 chars
    const filteredSongs = useMemo(() => {
        if (songSearch.length < 2) return availableSongs;
        const query = songSearch.toLowerCase();
        return availableSongs
            .filter(s => (s.title || "").toLowerCase().includes(query) || (s.artist || "").toLowerCase().includes(query));
    }, [availableSongs, songSearch]);

    useEffect(() => {
        fetchPlaylists();
        fetchAllSongs();
    }, []);

    const fetchPlaylists = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/music/master/playlists", { cache: 'no-store' });
            const data = await res.json();
            if (data.success) setPlaylists(data.playlists);
        } catch (err) {
            addLog("Failed to fetch playlists", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAllSongs = async () => {
        try {
            const res = await fetch("/api/music/songs", { cache: 'no-store' });
            const data = await res.json();
            if (data.success) setAllSongs(data.songs);
        } catch (err) { }
    };

    const fetchPlaylistSongs = async (playlistId: string) => {
        try {
            const res = await fetch(`/api/music/master/playlists/${playlistId}/songs`, { cache: 'no-store' });
            const data = await res.json();
            if (data.success) setCurrentSongs(data.songs);
        } catch (err) {
            addLog("Failed to fetch songs", "error");
        }
    };

    const handleSave = async () => {
        if (!formData.title || !formData.slug) {
            addLog("Title and Slug are required", "error");
            return;
        }
        setIsBusy(true);
        try {
            const method = editingId ? "PUT" : "POST";
            // Issue 7: Convert vibes string to array before sending
            const vibesArray = formData.vibes
                ? formData.vibes.split(',').map((v: string) => v.trim()).filter(Boolean)
                : [];
            const payload = { ...formData, vibes: vibesArray };
            const body = editingId ? { id: editingId, ...payload } : payload;

            const res = await fetch("/api/music/master/playlists", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const data = await res.json();
            if (data.success) {
                addLog(`Playlist ${editingId ? "updated" : "created"}: ${formData.title}`, "success");
                await fetchPlaylists();
                resetForm();

                // UX Fix: If this was a NEW playlist, immediately open its song view so user can add songs
                if (!editingId && data.playlist) {
                    openSongs(data.playlist);
                }
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
        if (!confirm(`Delete playlist "${title}"?`)) return;
        setIsBusy(true);
        try {
            const res = await fetch(`/api/music/master/playlists?id=${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                addLog(`Playlist deleted: ${title}`, "info");
                await fetchPlaylists();
            }
        } catch (err) {
            addLog("Delete failed", "error");
        } finally {
            setIsBusy(false);
        }
    };

    const addSongToPlaylist = async (songId: string, songTitle: string) => {
        if (!viewingPlaylist) return;

        // Issue 3: Deduplicate — prevent visual dupes
        if (currentSongs.some(s => s.id === songId)) {
            addLog(`Already in playlist: ${songTitle}`, "info");
            return;
        }

        setIsBusy(true);

        // Optimistic UI Update
        const targetSong = allSongs.find(s => s.id === songId);
        if (targetSong) setCurrentSongs(prev => [targetSong, ...prev]);

        console.log("Adding song to playlist:", viewingPlaylist.id, "Song ID:", songId);
        try {
            const res = await fetch(`/api/music/master/playlists/${viewingPlaylist.id}/songs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ songId })
            });
            const data = await res.json();
            console.log("Add song response:", data);

            if (data.success) {
                addLog(`✓ Added: ${songTitle}`, "success");
            } else {
                setCurrentSongs(prev => prev.filter(s => s.id !== songId)); // Revert
                addLog(data.error || "Add failed", "error");
            }
        } catch (err) {
            console.error("Add song error:", err);
            setCurrentSongs(prev => prev.filter(s => s.id !== songId)); // Revert
            addLog("Add failed", "error");
        } finally {
            setIsBusy(false);
        }
    };

    const removeSongFromPlaylist = async (songId: string, songTitle: string) => {
        if (!viewingPlaylist) return;
        setIsBusy(true);

        const rollbackSongs = [...currentSongs]; // Copy for revert
        setCurrentSongs(prev => prev.filter(s => s.id !== songId)); // Optimistic UI Update

        try {
            const res = await fetch(`/api/music/master/playlists/${viewingPlaylist.id}/songs?songId=${songId}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (data.success) {
                addLog(`Removed from ${viewingPlaylist.title}: ${songTitle}`, "info");
            } else {
                setCurrentSongs(rollbackSongs); // Revert
                addLog(data.error || "Remove failed", "error");
            }
        } catch (err) {
            setCurrentSongs(rollbackSongs); // Revert
            addLog("Remove failed", "error");
        } finally {
            setIsBusy(false);
        }
    };

    // Issue 6: Delete song from global library
    const deleteSongFromLibrary = async (songId: string, songTitle: string) => {
        if (!confirm(`Delete "${songTitle}" from library? This removes it from ALL playlists and radios.`)) return;
        setIsBusy(true);
        try {
            const res = await fetch(`/api/music/songs/${songId}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                addLog(`Deleted from library: ${songTitle}`, "info");
                setAllSongs(prev => prev.filter(s => s.id !== songId));
                setCurrentSongs(prev => prev.filter(s => s.id !== songId));
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
        setFormData({ title: "", slug: "", description: "", philosophy: "", schedule: "", vibes: "", coverImage: "", coverColor: "#3b82f6" });
        setEditingId(null);
        setIsAdding(false);
    };

    const startEdit = (p: Playlist) => {
        setFormData({
            title: p.title,
            slug: p.slug,
            description: p.description || "",
            philosophy: p.philosophy || "",
            schedule: p.schedule || "",
            vibes: p.vibes && p.vibes.length > 0 ? p.vibes.join(', ') : "",
            coverImage: p.coverImage || "",
            coverColor: p.coverColor || "#3b82f6"
        });
        setEditingId(p.id);
        setIsAdding(true);
    };

    const openSongs = async (p: Playlist) => {
        setSongSearch("");
        setViewingPlaylist(p);
        // Issue 5: Re-fetch allSongs so newly added songs are visible
        await Promise.all([fetchPlaylistSongs(p.id), fetchAllSongs()]);
    };

    // Issue 2: Refetch playlists on BACK so counts are fresh
    const closeSongs = async () => {
        setViewingPlaylist(null);
        await fetchPlaylists();
    };

    if (isLoading) return (
        <div style={{ padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }} className="animate-pulse">
            <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)" }} />
            <div style={{ width: "60px", height: "6px", borderRadius: "3px", background: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)" }} />
        </div>
    );

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ color: theme === "dark" ? "rgba(255,255,255,0.4)" : "#aaa", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                    {viewingPlaylist ? viewingPlaylist.title : "Playlists"}
                </h3>
                {!isAdding && !viewingPlaylist && (
                    <motion.button
                        onClick={() => setIsAdding(true)}
                        whileTap={{ scale: 0.95 }}
                        style={{ ...insetBox, padding: "4px 12px", color: theme === "dark" ? "#10B981" : "#059669", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.6rem", fontWeight: 800, cursor: "pointer" }}
                    >
                        <Plus size={12} /> NEW LIST
                    </motion.button>
                )}
                {viewingPlaylist && (
                    <motion.button
                        onClick={closeSongs}
                        whileTap={{ scale: 0.95 }}
                        style={{ ...insetBox, padding: "4px 12px", color: theme === "dark" ? "rgba(255,255,255,0.4)" : "#666", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.6rem", fontWeight: 800, cursor: "pointer" }}
                    >
                        <ChevronRight size={12} className="rotate-180" /> BACK
                    </motion.button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {isAdding ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        style={{ ...insetBox, padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}
                    >
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                <label style={{ color: theme === "dark" ? "rgba(255,255,255,0.4)" : "#555", fontSize: "0.55rem", fontWeight: 800 }}>TITLE</label>
                                <input
                                    value={formData.title}
                                    onChange={e => {
                                        const title = e.target.value;
                                        setFormData(prev => ({ ...prev, title, slug: editingId ? prev.slug : autoSlug(title) }));
                                    }}
                                    style={{ ...getInputStyle(theme), padding: "0.5rem" }}
                                    placeholder="Late Night Drives"
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                <label style={{ color: theme === "dark" ? "rgba(255,255,255,0.4)" : "#555", fontSize: "0.55rem", fontWeight: 800 }}>SLUG</label>
                                <input
                                    value={formData.slug}
                                    onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                    style={{ ...getInputStyle(theme), padding: "0.5rem" }}
                                    placeholder="late-night"
                                />
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            <label style={{ color: theme === "dark" ? "rgba(255,255,255,0.4)" : "#555", fontSize: "0.55rem", fontWeight: 800 }}>DESCRIPTION</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                style={{ ...getInputStyle(theme), padding: "0.5rem", resize: "none", height: "50px", fontFamily: "inherit", fontWeight: 500 }}
                                placeholder="The artistic intent..."
                            />
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            <label style={{ color: theme === "dark" ? "rgba(255,255,255,0.4)" : "#555", fontSize: "0.55rem", fontWeight: 800 }}>PHILOSOPHY</label>
                            <textarea
                                value={formData.philosophy}
                                onChange={e => setFormData({ ...formData, philosophy: e.target.value })}
                                style={{ ...getInputStyle(theme), padding: "0.5rem", resize: "none", height: "50px", fontFamily: "inherit", fontWeight: 500 }}
                                placeholder="The deeper meaning..."
                            />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                <label style={{ color: theme === "dark" ? "rgba(255,255,255,0.4)" : "#555", fontSize: "0.55rem", fontWeight: 800 }}>VIBES (comma separated)</label>
                                <input
                                    value={formData.vibes}
                                    onChange={e => setFormData({ ...formData, vibes: e.target.value })}
                                    style={{ ...getInputStyle(theme), padding: "0.5rem" }}
                                    placeholder="Lofi, Jazz, Rain"
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                <label style={{ color: theme === "dark" ? "rgba(255,255,255,0.4)" : "#555", fontSize: "0.55rem", fontWeight: 800 }}>SCHEDULE</label>
                                <input
                                    value={formData.schedule}
                                    onChange={e => setFormData({ ...formData, schedule: e.target.value })}
                                    style={{ ...getInputStyle(theme), padding: "0.5rem" }}
                                    placeholder="11 PM - 3 AM"
                                />
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "0.75rem", alignItems: "end" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                <label style={{ color: theme === "dark" ? "rgba(255,255,255,0.4)" : "#555", fontSize: "0.55rem", fontWeight: 800 }}>COVER IMAGE PATH</label>
                                <input
                                    value={formData.coverImage}
                                    onChange={e => setFormData({ ...formData, coverImage: e.target.value })}
                                    style={{ ...getInputStyle(theme), padding: "0.5rem" }}
                                    placeholder="/images/playlists/..."
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                <label style={{ color: theme === "dark" ? "rgba(255,255,255,0.4)" : "#555", fontSize: "0.55rem", fontWeight: 800 }}>COLOR</label>
                                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", background: theme === "dark" ? "rgba(0,0,0,0.3)" : "#f0f0f0", border: theme === "dark" ? "1px solid rgba(255,255,255,0.05)" : "1.5px solid #ddd", borderRadius: "6px", padding: "0.3rem 0.6rem" }}>
                                    <input
                                        type="color"
                                        value={formData.coverColor}
                                        onChange={e => setFormData({ ...formData, coverColor: e.target.value })}
                                        style={{ width: "20px", height: "20px", border: "none", background: "none", cursor: "pointer", padding: 0 }}
                                    />
                                    <span style={{ fontFamily: "monospace", fontSize: "0.6rem", color: theme === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>{formData.coverColor}</span>
                                </div>
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
                                <Save size={14} /> {editingId ? "UPDATE" : "CREATE"}
                            </motion.button>
                        </div>
                    </motion.div>
                ) : viewingPlaylist ? (
                    <motion.div
                        key="songs"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
                    >
                        <div style={{ ...insetBox, padding: "0.5rem", display: "flex", alignItems: "center", gap: "8px" }}>
                            <Search size={14} color={theme === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)"} />
                            <input
                                value={songSearch}
                                onChange={e => setSongSearch(e.target.value)}
                                style={{ background: "none", border: "none", flex: 1, color: theme === "dark" ? "#FFF" : "#000", fontSize: "0.65rem", outline: "none" }}
                                placeholder="Search all songs to add..."
                            />
                        </div>

                        <div style={{ maxHeight: "50vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.4rem", paddingRight: "4px" }}>
                            {/* Current Tracks Section */}
                            <div style={{ fontSize: "0.55rem", fontWeight: 800, color: theme === "dark" ? "rgba(255,255,255,0.4)" : "#444", margin: "0.5rem 0 0.2rem 0" }}>CURRENT TRACKS ({currentSongs.length})</div>
                            {currentSongs.map(song => (
                                <div key={song.id} style={{ ...insetBox, padding: "0.5rem 0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: `2px solid ${viewingPlaylist.coverColor}` }}>
                                    <div>
                                        {(() => {
                                            const { cleanTitle, labels } = parseSongTitle(song.title);
                                            return (
                                                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                                                    <div style={{ color: theme === "dark" ? "#FFF" : "#000", fontSize: "0.65rem", fontWeight: 800 }}>{cleanTitle}</div>
                                                    {labels.map(label => (
                                                        <span key={label} style={{
                                                            fontSize: "0.55rem",
                                                            fontFamily: "var(--font-sans)",
                                                            fontWeight: 800,
                                                            backgroundColor: theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
                                                            color: theme === "dark" ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.5)",
                                                            padding: "2.5px 8px",
                                                            borderRadius: "100px",
                                                            letterSpacing: "0.05em",
                                                            textTransform: "uppercase",
                                                            border: "1px solid " + (theme === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.06)"),
                                                            flexShrink: 0
                                                        }}>{label}</span>
                                                    ))}
                                                </div>
                                            );
                                        })()}
                                        <div style={{ color: theme === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)", fontSize: "0.5rem" }}>{song.artist}</div>
                                    </div>
                                    <motion.button onClick={() => removeSongFromPlaylist(song.id, song.title)} whileTap={{ scale: 0.9 }} style={{ color: "#ef4444" }}>
                                        <MinusCircle size={14} />
                                    </motion.button>
                                </div>
                            ))}
                            {currentSongs.length === 0 && (
                                <div style={{ color: theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.3)", fontSize: "0.6rem", textAlign: "center", padding: "1rem" }}>PLAYLIST MASIH KOSONG</div>
                            )}

                            {/* Add Songs Section — Issue 4: only shows songs NOT already in playlist */}
                            <div style={{ fontSize: "0.55rem", fontWeight: 800, color: theme === "dark" ? "rgba(255,255,255,0.4)" : "#444", margin: "1rem 0 0.2rem 0" }}>ADD SONGS ({filteredSongs.length} available)</div>
                            {filteredSongs.length > 0 ? filteredSongs.map(song => (
                                <div key={song.id} style={{ ...insetBox, padding: "0.5rem 0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                        {(() => {
                                            const { cleanTitle, labels } = parseSongTitle(song.title);
                                            return (
                                                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                                                    <div style={{ color: theme === "dark" ? "#FFF" : "#000", fontSize: "0.65rem", fontWeight: 800 }}>{cleanTitle}</div>
                                                    {labels.map(label => (
                                                        <span key={label} style={{
                                                            fontSize: "0.55rem",
                                                            fontFamily: "var(--font-sans)",
                                                            fontWeight: 800,
                                                            backgroundColor: theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
                                                            color: theme === "dark" ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.5)",
                                                            padding: "2.5px 8px",
                                                            borderRadius: "100px",
                                                            letterSpacing: "0.05em",
                                                            textTransform: "uppercase",
                                                            border: "1px solid " + (theme === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.06)"),
                                                            flexShrink: 0
                                                        }}>{label}</span>
                                                    ))}
                                                </div>
                                            );
                                        })()}
                                        <div style={{ color: theme === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)", fontSize: "0.5rem" }}>{song.artist}</div>
                                    </div>
                                    <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                                        <motion.button
                                            onClick={() => addSongToPlaylist(song.id, song.title)}
                                            whileTap={{ scale: 0.9 }}
                                            style={{ color: "#39ff14", fontSize: "0.55rem", fontWeight: 800 }}
                                        >
                                            <Plus size={16} />
                                        </motion.button>
                                        <motion.button
                                            onClick={(e) => { e.stopPropagation(); deleteSongFromLibrary(song.id, song.title); }}
                                            whileTap={{ scale: 0.9 }}
                                            style={{ color: "#ef444480", padding: "2px" }}
                                        >
                                            <Trash2 size={12} />
                                        </motion.button>
                                    </div>
                                </div>
                            )) : (
                                <div style={{ color: theme === "dark" ? "rgba(255,255,255,0.2)" : "#333", fontSize: "0.6rem", textAlign: "center", padding: "1rem", lineHeight: 1.4 }}>
                                    {allSongs.length === 0 ? "Gak ada lagu di library. Tambahin lagu via web desktop panel dulu gih." : "Semua lagu udah ditambahin ke playlist ini!"}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
                    >
                        {playlists.map(p => (
                            <div
                                key={p.id}
                                onClick={() => openSongs(p)}
                                style={{ ...insetBox, padding: "0.75rem", display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}
                            >
                                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: p.coverColor + '20', display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px solid ${p.coverColor}40` }}>
                                    <ListMusic size={18} color={p.coverColor} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ color: theme === "dark" ? "#FFF" : "#000", fontSize: "0.75rem", fontWeight: 800 }}>{p.title}</div>
                                    <div style={{ color: theme === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)", fontSize: "0.55rem", display: "flex", gap: "8px" }}>
                                        <span>{p._count?.songs || 0} tracks</span>
                                        {p.vibes && p.vibes.length > 0 && <span>• {p.vibes.join(', ')}</span>}
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: "0.25rem" }} onClick={e => e.stopPropagation()}>
                                    <motion.button onClick={() => startEdit(p)} whileTap={{ scale: 0.9 }} style={{ padding: "8px", color: theme === "dark" ? "rgba(255,255,255,0.4)" : "#666" }}><Edit2 size={14} /></motion.button>
                                    <motion.button onClick={() => handleDelete(p.id, p.title)} whileTap={{ scale: 0.9 }} style={{ padding: "8px", color: "#ef4444" }}><Trash2 size={14} /></motion.button>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
