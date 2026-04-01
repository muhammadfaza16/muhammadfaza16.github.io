"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
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
    category?: string;
    coverImage?: string;
    createdAt?: string;
}

interface PlaylistModuleProps {
    addLog: (text: string, type?: "info" | "success" | "error") => void;
    isBusy: boolean;
    setIsBusy: (busy: boolean) => void;
    insetBox: any;
}

export function PlaylistModule({ addLog, isBusy, setIsBusy, insetBox }: PlaylistModuleProps) {
    const { theme } = useTheme();
    const router = useRouter();
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewingPlaylist, setViewingPlaylist] = useState<Playlist | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [visibleCount, setVisibleCount] = useState(25);
    const observerTarget = useRef<HTMLDivElement>(null);

    // Songs State
    const [currentSongs, setCurrentSongs] = useState<Song[]>([]);
    const [allSongs, setAllSongs] = useState<Song[]>([]);
    const [songSearch, setSongSearch] = useState("");
    const [sortBy, setSortBy] = useState<"latest"|"oldest"|"name"|"curated">("name");
    const [formSongSearch, setFormSongSearch] = useState("");

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
    const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);

    const autoSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const availableSongs = useMemo(() => {
        const currentIds = new Set(currentSongs.map(s => s.id));
        return allSongs.filter(s => !currentIds.has(s.id));
    }, [allSongs, currentSongs]);

    const formAvailableSongs = useMemo(() => {
        if (!formSongSearch) return allSongs;
        const q = formSongSearch.toLowerCase();
        return allSongs.filter(s => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q));
    }, [allSongs, formSongSearch]);

    const filteredSongs = useMemo(() => {
        let result = [...availableSongs];
        if (songSearch.length >= 1) {
            const query = songSearch.toLowerCase();
            result = result.filter(s => (s.title || "").toLowerCase().includes(query) || (s.artist || "").toLowerCase().includes(query));
        }

        if (sortBy === "curated") {
            result.sort((a, b) => {
                const isALokal = a.category?.toLowerCase() === 'indo';
                const isBLokal = b.category?.toLowerCase() === 'indo';
                if (isALokal && !isBLokal) return -1;
                if (!isALokal && isBLokal) return 1;
                const infoA = parseSongTitle(a.title);
                const infoB = parseSongTitle(b.title);
                const artistSort = infoA.artist.localeCompare(infoB.artist);
                if (artistSort !== 0) return artistSort;
                return infoA.cleanTitle.localeCompare(infoB.cleanTitle);
            });
        } else if (sortBy === "latest") {
            result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        } else if (sortBy === "oldest") {
            result.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
        } else if (sortBy === "name") {
            result.sort((a, b) => {
                const infoA = parseSongTitle(a.title);
                const infoB = parseSongTitle(b.title);
                const artistSort = infoA.artist.localeCompare(infoB.artist);
                if (artistSort !== 0) return artistSort;
                return infoA.cleanTitle.localeCompare(infoB.cleanTitle);
            });
        }

        return result;
    }, [availableSongs, songSearch, sortBy]);

    useEffect(() => {
        fetchPlaylists();
        fetchAllSongs();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && visibleCount < filteredSongs.length) {
                    setVisibleCount(prev => prev + 25);
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [visibleCount, filteredSongs.length]);

    // Reset visibleCount when search changes
    useEffect(() => {
        setVisibleCount(25);
    }, [songSearch]);

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
            if (data.success) {
                setCurrentSongs(data.songs);
                return data.songs;
            }
        } catch (err) {
            addLog("Failed to fetch songs", "error");
        }
        return [];
    };

    const saveAllChanges = async () => {
        const isEditing = !!viewingPlaylist;
        const currentId = viewingPlaylist?.id;

        if (!formData.title || !formData.slug) {
            addLog("Title and Slug are required", "error");
            return;
        }

        setIsBusy(true);
        try {
            const vibesArray = typeof formData.vibes === 'string' 
                ? formData.vibes.split(',').map((v: string) => v.trim()).filter(Boolean)
                : formData.vibes;

            const payload = { 
                ...formData, 
                vibes: vibesArray, 
                songIds: currentSongs.map(s => s.id) 
            };
            const body = isEditing ? { id: currentId, ...payload } : payload;
            const method = isEditing ? "PUT" : "POST";

            const res = await fetch("/api/music/master/playlists", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const data = await res.json();
            if (data.success) {
                addLog(`Playlist ${isEditing ? "updated" : "created"}: ${formData.title}`, "success");
                await fetchPlaylists();
                if (!isEditing) {
                    resetForm();
                } else {
                    // Update viewingPlaylist with new data
                    setViewingPlaylist(data.playlist);
                }
                router.refresh();
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
        if (currentSongs.some(s => s.id === songId)) {
            addLog(`Already in playlist: ${songTitle}`, "info");
            return;
        }
        setIsBusy(true);
        const targetSong = allSongs.find(s => s.id === songId);
        if (targetSong) setCurrentSongs(prev => [targetSong, ...prev]);
        try {
            const res = await fetch(`/api/music/master/playlists/${viewingPlaylist.id}/songs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ songId })
            });
            const data = await res.json();
            if (data.success) {
                addLog(`✓ Added: ${songTitle}`, "success");
            } else {
                setCurrentSongs(prev => prev.filter(s => s.id !== songId));
                addLog(data.error || "Add failed", "error");
            }
        } catch (err) {
            setCurrentSongs(prev => prev.filter(s => s.id !== songId));
            addLog("Add failed", "error");
        } finally {
            setIsBusy(false);
        }
    };

    const removeSongFromPlaylist = async (songId: string, songTitle: string) => {
        if (!viewingPlaylist) return;
        setIsBusy(true);
        const rollbackSongs = [...currentSongs];
        setCurrentSongs(prev => prev.filter(s => s.id !== songId));
        try {
            const res = await fetch(`/api/music/master/playlists/${viewingPlaylist.id}/songs?songId=${songId}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (data.success) {
                addLog(`Removed from ${viewingPlaylist.title}: ${songTitle}`, "info");
            } else {
                setCurrentSongs(rollbackSongs);
                addLog(data.error || "Remove failed", "error");
            }
        } catch (err) {
            setCurrentSongs(rollbackSongs);
            addLog("Remove failed", "error");
        } finally {
            setIsBusy(false);
        }
    };

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
        setSelectedSongIds([]);
        setIsAdding(false);
        setViewingPlaylist(null);
    };



    const openSongs = async (p: Playlist) => {
        setSongSearch("");
        setViewingPlaylist(p);
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
        await Promise.all([fetchPlaylistSongs(p.id), fetchAllSongs()]);
    };

    const closeSongs = async () => {
        setViewingPlaylist(null);
        resetForm();
        await fetchPlaylists();
    };

    const toggleSongSelection = (id: string) => {
        setSelectedSongIds(prev => 
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    if (isLoading) return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }} className="animate-pulse">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ width: "100px", height: "12px", background: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", borderRadius: "4px" }} />
                <div style={{ width: "80px", height: "24px", background: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", borderRadius: "8px" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[...Array(4)].map((_, i) => (
                    <div key={i} style={{ height: "64px", background: theme === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", borderRadius: "16px", border: theme === "dark" ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)" }} />
                ))}
            </div>
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
                                        setFormData(prev => ({ ...prev, title, slug: viewingPlaylist ? prev.slug : autoSlug(title) }));
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
                                style={{ ...getInputStyle(theme), padding: "0.5rem", resize: "none", height: "40px", fontFamily: "inherit", fontWeight: 500 }}
                                placeholder="The artistic intent..."
                            />
                        </div>

                        {/* Song Selection Area inside Form */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginTop: "0.5rem" }}>
                            <label style={{ color: theme === "dark" ? "rgba(255,255,255,0.4)" : "#555", fontSize: "0.55rem", fontWeight: 800, display: "flex", justifyContent: "space-between" }}>
                                CHOOSE SONGS ({selectedSongIds.length} SELECTED)
                                <span style={{ color: "#39ff14" }}>✓</span>
                            </label>
                            <div style={{ ...insetBox, padding: "0.4rem 0.6rem", display: "flex", alignItems: "center", gap: "8px", background: "rgba(0,0,0,0.1)" }}>
                                <Search size={12} style={{ opacity: 0.4 }} />
                                <input 
                                    value={formSongSearch} 
                                    onChange={e => setFormSongSearch(e.target.value)}
                                    placeholder="Find songs in library..."
                                    style={{ background: "none", border: "none", color: "inherit", fontSize: "0.6rem", outline: "none", flex: 1 }}
                                />
                            </div>
                            <div style={{ maxHeight: "150px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px", padding: "4px" }}>
                                {formAvailableSongs.map(song => (
                                    <div 
                                        key={song.id} 
                                        onClick={() => toggleSongSelection(song.id)}
                                        style={{ 
                                            ...insetBox, 
                                            padding: "6px 10px", 
                                            display: "flex", 
                                            justifyContent: "space-between", 
                                            alignItems: "center", 
                                            cursor: "pointer",
                                            borderColor: selectedSongIds.includes(song.id) ? "#39ff1480" : "transparent",
                                            background: selectedSongIds.includes(song.id) ? "rgba(57, 255, 20, 0.05)" : "transparent"
                                        }}
                                    >
                                        <div style={{ fontSize: "0.6rem" }}>
                                            <span style={{ fontWeight: 800 }}>{song.title}</span>
                                            <span style={{ opacity: 0.4, marginLeft: "6px" }}>{song.artist}</span>
                                        </div>
                                        {selectedSongIds.includes(song.id) && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#39ff14" }} />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "0.5rem" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                <label style={{ color: theme === "dark" ? "rgba(255,255,255,0.4)" : "#555", fontSize: "0.55rem", fontWeight: 800 }}>VIBES</label>
                                <input
                                    value={formData.vibes}
                                    onChange={e => setFormData({ ...formData, vibes: e.target.value })}
                                    style={{ ...getInputStyle(theme), padding: "0.5rem" }}
                                    placeholder="Lofi, Jazz"
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                <label style={{ color: theme === "dark" ? "rgba(255,255,255,0.4)" : "#555", fontSize: "0.55rem", fontWeight: 800 }}>COVER URL</label>
                                <input
                                    value={formData.coverImage}
                                    onChange={e => setFormData({ ...formData, coverImage: e.target.value })}
                                    style={{ ...getInputStyle(theme), padding: "0.5rem" }}
                                    placeholder="https://..."
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                <label style={{ color: theme === "dark" ? "rgba(255,255,255,0.4)" : "#555", fontSize: "0.55rem", fontWeight: 800 }}>COLOR</label>
                                <input
                                    type="color"
                                    value={formData.coverColor}
                                    onChange={e => setFormData({ ...formData, coverColor: e.target.value })}
                                    style={{ ...getInputStyle(theme), height: "32px", padding: "2px", width: "100%" }}
                                />
                            </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.5rem" }}>
                            <motion.button onClick={resetForm} whileTap={{ scale: 0.95 }} style={{ ...insetBox, padding: "8px 16px", color: theme === "dark" ? "rgba(255,255,255,0.4)" : "#555", fontSize: "0.6rem", fontWeight: 800 }}>CANCEL</motion.button>
                                <motion.button
                                onClick={saveAllChanges}
                                disabled={isBusy}
                                whileTap={{ scale: 0.95 }}
                                style={{ ...insetBox, padding: "8px 16px", color: theme === "dark" ? "#10B981" : "#059669", fontSize: "0.65rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "6px", opacity: isBusy ? 0.4 : 1, cursor: isBusy ? "not-allowed" : "pointer" }}
                            >
                                <Save size={14} /> {viewingPlaylist ? "UPDATE" : "CREATE"}
                            </motion.button>
                        </div>
                    </motion.div>
                ) : viewingPlaylist ? (
                    <motion.div
                        key="songs"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
                    >
                        {/* Global Metadata Editor Integration */}
                        <div style={{ ...insetBox, padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem", borderLeft: `4px solid ${formData.coverColor}` }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                                    <label style={{ color: theme === "dark" ? "rgba(255,255,255,0.3)" : "#777", fontSize: "0.5rem", fontWeight: 800 }}>TITLE</label>
                                    <input
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        style={{ ...getInputStyle(theme), padding: "0.4rem", fontSize: "0.65rem" }}
                                    />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                                    <label style={{ color: theme === "dark" ? "rgba(255,255,255,0.3)" : "#777", fontSize: "0.5rem", fontWeight: 800 }}>SLUG</label>
                                    <input
                                        value={formData.slug}
                                        onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                        style={{ ...getInputStyle(theme), padding: "0.4rem", fontSize: "0.65rem" }}
                                    />
                                </div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                                <label style={{ color: theme === "dark" ? "rgba(255,255,255,0.3)" : "#777", fontSize: "0.5rem", fontWeight: 800 }}>VIBES (comma separated)</label>
                                <input
                                    value={formData.vibes}
                                    onChange={e => setFormData({ ...formData, vibes: e.target.value })}
                                    style={{ ...getInputStyle(theme), padding: "0.4rem", fontSize: "0.65rem" }}
                                    placeholder="Moody, Electronic..."
                                />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 50px", gap: "0.75rem" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                                    <label style={{ color: theme === "dark" ? "rgba(255,255,255,0.3)" : "#777", fontSize: "0.5rem", fontWeight: 800 }}>COVER IMAGE URL</label>
                                    <input
                                        value={formData.coverImage}
                                        onChange={e => setFormData({ ...formData, coverImage: e.target.value })}
                                        style={{ ...getInputStyle(theme), padding: "0.4rem", fontSize: "0.65rem" }}
                                    />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                                    <label style={{ color: theme === "dark" ? "rgba(255,255,255,0.3)" : "#777", fontSize: "0.5rem", fontWeight: 800 }}>COLOR</label>
                                    <input
                                        type="color"
                                        value={formData.coverColor}
                                        onChange={e => setFormData({ ...formData, coverColor: e.target.value })}
                                        style={{ ...getInputStyle(theme), padding: "2px", height: "26px", cursor: "pointer" }}
                                    />
                                </div>
                            </div>

                            <motion.button
                                onClick={saveAllChanges}
                                disabled={isBusy}
                                whileTap={{ scale: 0.98 }}
                                style={{ 
                                    background: "#10B981", 
                                    color: "#FFF", 
                                    border: "none", 
                                    padding: "10px", 
                                    borderRadius: "12px", 
                                    fontSize: "0.7rem", 
                                    fontWeight: 900, 
                                    cursor: "pointer", 
                                    display: "flex", 
                                    alignItems: "center", 
                                    justifyContent: "center", 
                                    gap: "8px",
                                    marginTop: "4px",
                                    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)",
                                    opacity: isBusy ? 0.5 : 1
                                }}
                            >
                                <Save size={16} /> SAVE ALL CHANGES
                            </motion.button>
                        </div>

                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <div style={{ ...insetBox, padding: "0.5rem", display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                                <Search size={14} color={theme === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)"} />
                                <input
                                    value={songSearch}
                                    onChange={e => setSongSearch(e.target.value)}
                                    style={{ background: "none", border: "none", flex: 1, color: theme === "dark" ? "#FFF" : "#000", fontSize: "0.65rem", outline: "none" }}
                                    placeholder="Search library to add..."
                                />
                            </div>
                            <div style={{ ...insetBox, padding: "0.5rem", display: "flex", alignItems: "center" }}>
                                <select
                                    value={sortBy}
                                    onChange={e => setSortBy(e.target.value as any)}
                                    style={{ background: "none", border: "none", outline: "none", color: "inherit", fontSize: "0.6rem", fontWeight: 800, cursor: "pointer", WebkitAppearance: "none", paddingRight: "10px" }}
                                >
                                    <option value="name" style={{ color: "#000" }}>Sort: A-Z</option>
                                    <option value="curated" style={{ color: "#000" }}>Sort: Curated</option>
                                    <option value="latest" style={{ color: "#000" }}>Sort: Latest</option>
                                    <option value="oldest" style={{ color: "#000" }}>Sort: Oldest</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ maxHeight: "40vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.4rem", paddingRight: "4px" }}>
                            {/* Current Tracks Section */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0.2rem 0 0.2rem 0" }}>
                                <div style={{ fontSize: "0.55rem", fontWeight: 800, color: theme === "dark" ? "rgba(255,255,255,0.4)" : "#444" }}>
                                    TRACKLIST ({currentSongs.length})
                                </div>
                            </div>
                            {currentSongs.map(song => (
                                <div key={song.id} style={{ ...insetBox, padding: "0.5rem 0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                        {(() => {
                                            const { cleanTitle, labels } = parseSongTitle(song.title);
                                            return (
                                                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                                                    <div style={{ color: theme === "dark" ? "#FFF" : "#000", fontSize: "0.65rem", fontWeight: 800 }}>{cleanTitle}</div>
                                                </div>
                                            );
                                        })()}
                                        <div style={{ color: theme === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)", fontSize: "0.5rem" }}>{song.artist}</div>
                                    </div>
                                    <div style={{ display: "flex", gap: "4px" }}>
                                        <motion.button 
                                            onClick={() => {
                                                const idx = currentSongs.findIndex(s => s.id === song.id);
                                                if (idx > 0) {
                                                    const newSongs = [...currentSongs];
                                                    [newSongs[idx - 1], newSongs[idx]] = [newSongs[idx], newSongs[idx - 1]];
                                                    setCurrentSongs(newSongs);
                                                }
                                            }}
                                            whileTap={{ scale: 0.9 }} 
                                            style={{ color: theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)", padding: "4px" }}
                                            disabled={currentSongs.findIndex(s => s.id === song.id) === 0}
                                        >
                                            ▲
                                        </motion.button>
                                        <motion.button 
                                            onClick={() => {
                                                const idx = currentSongs.findIndex(s => s.id === song.id);
                                                if (idx < currentSongs.length - 1) {
                                                    const newSongs = [...currentSongs];
                                                    [newSongs[idx + 1], newSongs[idx]] = [newSongs[idx], newSongs[idx + 1]];
                                                    setCurrentSongs(newSongs);
                                                }
                                            }}
                                            whileTap={{ scale: 0.9 }} 
                                            style={{ color: theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)", padding: "4px" }}
                                            disabled={currentSongs.findIndex(s => s.id === song.id) === currentSongs.length - 1}
                                        >
                                            ▼
                                        </motion.button>
                                        <motion.button onClick={() => removeSongFromPlaylist(song.id, song.title)} whileTap={{ scale: 0.9 }} style={{ color: "#ef4444", padding: "4px" }}>
                                            <MinusCircle size={14} />
                                        </motion.button>
                                    </div>
                                </div>
                            ))}
                            <div style={{ fontSize: "0.55rem", fontWeight: 800, color: theme === "dark" ? "rgba(255,255,255,0.4)" : "#444", margin: "0.8rem 0 0.2rem 0" }}>
                                {songSearch.length > 0 ? "SEARCH RESULTS" : "ADD FROM LIBRARY"} ({filteredSongs.length})
                            </div>
                            {filteredSongs.slice(0, visibleCount).map(song => (
                                <div key={song.id} style={{ ...insetBox, padding: "0.4rem 0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: 0.8 }}>
                                    <div style={{ fontSize: "0.6rem" }}>
                                        <div style={{ fontWeight: 800 }}>{song.title}</div>
                                        <div style={{ opacity: 0.5, fontSize: "0.5rem" }}>{song.artist}</div>
                                    </div>
                                    <motion.button onClick={() => addSongToPlaylist(song.id, song.title)} whileTap={{ scale: 0.9 }} style={{ color: "#39ff14" }}>
                                        <Plus size={16} />
                                    </motion.button>
                                </div>
                            ))}
                            {/* Infinite Scroll Sentinel */}
                            {filteredSongs.length > visibleCount && (
                                <div ref={observerTarget} style={{ height: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.5rem", color: "rgba(255,255,255,0.2)" }}>
                                    Loading more...
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
                                    {p.description && (
                                        <div style={{ color: theme === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.4)", fontSize: "0.55rem", marginTop: "4px", fontStyle: "italic", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "250px" }}>
                                            "{p.description}"
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: "flex", gap: "0.25rem" }} onClick={e => e.stopPropagation()}>
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
