"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Trash2,
    Edit2,
    Save,
    X,
    Radio as RadioIcon,
    Loader2,
    Palette,
    Search,
    ChevronRight,
    MinusCircle
} from "lucide-react";
import { inputStyle } from "./sharedStyles";

interface Radio {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    themeColor: string;
    _count?: {
        songs: number;
    }
}

interface Song {
    id: string;
    title: string;
    artist: string;
}

interface RadioModuleProps {
    addLog: (text: string, type?: "info" | "success" | "error") => void;
    isBusy: boolean;
    setIsBusy: (busy: boolean) => void;
    insetBox: any;
}

export function RadioModule({ addLog, isBusy, setIsBusy, insetBox }: RadioModuleProps) {
    const [radios, setRadios] = useState<Radio[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [viewingRadio, setViewingRadio] = useState<Radio | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    // Songs State
    const [currentSongs, setCurrentSongs] = useState<Song[]>([]);
    const [allSongs, setAllSongs] = useState<Song[]>([]);
    const [songSearch, setSongSearch] = useState("");

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

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        themeColor: "#3b82f6"
    });

    const autoSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    useEffect(() => {
        fetchRadios();
        fetchAllSongs();
    }, []);

    const fetchRadios = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/music/master/radios", { cache: 'no-store' });
            const data = await res.json();
            if (data.success) setRadios(data.radios);
        } catch (err) {
            addLog("Failed to fetch radios", "error");
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

    const fetchRadioSongs = async (radioId: string) => {
        try {
            const res = await fetch(`/api/music/master/radios/${radioId}/songs`, { cache: 'no-store' });
            const data = await res.json();
            if (data.success) setCurrentSongs(data.songs);
        } catch (err) {
            addLog("Failed to fetch songs", "error");
        }
    };

    const handleSave = async () => {
        if (!formData.name || !formData.slug) {
            addLog("Name and Slug are required", "error");
            return;
        }
        setIsBusy(true);
        try {
            const method = editingId ? "PUT" : "POST";
            const body = editingId ? { id: editingId, ...formData } : formData;

            const res = await fetch("/api/music/master/radios", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const data = await res.json();
            if (data.success) {
                addLog(`Radio ${editingId ? "updated" : "created"}: ${formData.name}`, "success");
                await fetchRadios();
                resetForm();

                // UX Fix: If this was a NEW radio, immediately open its song view so user can add songs
                if (!editingId && data.radio) {
                    openSongs(data.radio);
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

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete radio "${name}"?`)) return;
        setIsBusy(true);
        try {
            const res = await fetch(`/api/music/master/radios?id=${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                addLog(`Radio deleted: ${name}`, "info");
                await fetchRadios();
            }
        } catch (err) {
            addLog("Delete failed", "error");
        } finally {
            setIsBusy(false);
        }
    };

    const addSongToRadio = async (songId: string, songTitle: string) => {
        if (!viewingRadio) return;

        // Issue 3: Deduplicate — prevent visual dupes
        if (currentSongs.some(s => s.id === songId)) {
            addLog(`Already in radio: ${songTitle}`, "info");
            return;
        }

        setIsBusy(true);

        const targetSong = allSongs.find(s => s.id === songId);
        if (targetSong) setCurrentSongs(prev => [targetSong, ...prev]);

        try {
            const res = await fetch(`/api/music/master/radios/${viewingRadio.id}/songs`, {
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

    const removeSongFromRadio = async (songId: string, songTitle: string) => {
        if (!viewingRadio) return;
        setIsBusy(true);

        const rollbackSongs = [...currentSongs];
        setCurrentSongs(prev => prev.filter(s => s.id !== songId));

        try {
            const res = await fetch(`/api/music/master/radios/${viewingRadio.id}/songs?songId=${songId}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (data.success) {
                addLog(`Removed from ${viewingRadio.name}: ${songTitle}`, "info");
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
        setFormData({ name: "", slug: "", description: "", themeColor: "#3b82f6" });
        setEditingId(null);
        setIsAdding(false);
    };

    const startEdit = (radio: Radio) => {
        setFormData({
            name: radio.name,
            slug: radio.slug,
            description: radio.description || "",
            themeColor: radio.themeColor
        });
        setEditingId(radio.id);
        setIsAdding(true);
    };

    const openSongs = async (radio: Radio) => {
        setSongSearch("");
        setViewingRadio(radio);
        // Issue 5: Re-fetch allSongs so newly added songs are visible
        await Promise.all([fetchRadioSongs(radio.id), fetchAllSongs()]);
    };

    // Issue 2: Refetch radios on BACK so counts are fresh
    const closeSongs = async () => {
        setViewingRadio(null);
        await fetchRadios();
    };

    if (isLoading) return (
        <div style={{ padding: "2rem", textAlign: "center", color: "#444" }}>
            <Loader2 size={24} className="animate-spin" />
        </div>
    );

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ color: "#aaa", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                    {viewingRadio ? viewingRadio.name : "Radio Stations"}
                </h3>
                {!isAdding && !viewingRadio && (
                    <motion.button
                        onClick={() => setIsAdding(true)}
                        whileTap={{ scale: 0.95 }}
                        style={{ ...insetBox, padding: "4px 8px", color: "#39ff14", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.6rem", fontWeight: 800 }}
                    >
                        <Plus size={12} /> ADD NEW
                    </motion.button>
                )}
                {viewingRadio && (
                    <motion.button
                        onClick={closeSongs}
                        whileTap={{ scale: 0.95 }}
                        style={{ ...insetBox, padding: "4px 8px", color: "#666", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.6rem", fontWeight: 800 }}
                    >
                        <ChevronRight size={12} className="rotate-180" /> BACK
                    </motion.button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {isAdding ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ ...insetBox, padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}
                    >
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                <label style={{ color: "#555", fontSize: "0.55rem", fontWeight: 800 }}>STATION NAME</label>
                                <input
                                    value={formData.name}
                                    onChange={e => {
                                        const name = e.target.value;
                                        setFormData(prev => ({ ...prev, name, slug: editingId ? prev.slug : autoSlug(name) }));
                                    }}
                                    style={{ ...inputStyle, padding: "0.5rem" }}
                                    placeholder="Starlight AM"
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                <label style={{ color: "#555", fontSize: "0.55rem", fontWeight: 800 }}>SLUG (ID)</label>
                                <input
                                    value={formData.slug}
                                    onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                    style={{ ...inputStyle, padding: "0.5rem" }}
                                    placeholder="starlight"
                                />
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            <label style={{ color: "#555", fontSize: "0.55rem", fontWeight: 800 }}>DESCRIPTION</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                style={{ ...inputStyle, padding: "0.5rem", resize: "none", height: "60px", fontFamily: "inherit", fontWeight: 500 }}
                                placeholder="Ethereal melodies..."
                            />
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", flex: 1 }}>
                                <label style={{ color: "#555", fontSize: "0.55rem", fontWeight: 800 }}>THEME COLOR</label>
                                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                    <input
                                        type="color"
                                        value={formData.themeColor}
                                        onChange={e => setFormData({ ...formData, themeColor: e.target.value })}
                                        style={{ width: "24px", height: "24px", border: "none", background: "none", cursor: "pointer" }}
                                    />
                                    <span style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "#666" }}>{formData.themeColor}</span>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <motion.button onClick={resetForm} whileTap={{ scale: 0.95 }} style={{ ...insetBox, padding: "8px", color: "#ef4444" }}><X size={14} /></motion.button>
                                <motion.button
                                    onClick={handleSave}
                                    disabled={isBusy || !formData.name || !formData.slug}
                                    whileTap={{ scale: 0.95 }}
                                    style={{ ...insetBox, padding: "8px 16px", color: "#39ff14", fontSize: "0.65rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "6px", opacity: (isBusy || !formData.name || !formData.slug) ? 0.4 : 1, cursor: (isBusy || !formData.name || !formData.slug) ? "not-allowed" : "pointer" }}
                                >
                                    <Save size={14} /> {editingId ? "UPDATE" : "CREATE"}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                ) : viewingRadio ? (
                    <motion.div
                        key="songs"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
                    >
                        <div style={{ ...insetBox, padding: "0.5rem", display: "flex", alignItems: "center", gap: "8px" }}>
                            <Search size={14} color="#333" />
                            <input
                                value={songSearch}
                                onChange={e => setSongSearch(e.target.value)}
                                style={{ background: "none", border: "none", flex: 1, color: "#aaa", fontSize: "0.65rem", outline: "none" }}
                                placeholder="Search all songs to add..."
                            />
                        </div>

                        <div style={{ maxHeight: "50vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.4rem", paddingRight: "4px" }}>
                            {/* Current Tracks Section */}
                            <div style={{ fontSize: "0.55rem", fontWeight: 800, color: "#444", margin: "0.5rem 0 0.2rem 0" }}>CURRENT TRACKS ({currentSongs.length})</div>
                            {currentSongs.map((song: Song) => (
                                <div key={song.id} style={{ ...insetBox, padding: "0.5rem 0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: `2px solid ${viewingRadio.themeColor}` }}>
                                    <div>
                                        <div style={{ color: "#aaa", fontSize: "0.65rem", fontWeight: 800 }}>{song.title}</div>
                                        <div style={{ color: "#555", fontSize: "0.5rem" }}>{song.artist}</div>
                                    </div>
                                    <motion.button onClick={() => removeSongFromRadio(song.id, song.title)} whileTap={{ scale: 0.9 }} style={{ color: "#ef4444" }}>
                                        <MinusCircle size={14} />
                                    </motion.button>
                                </div>
                            ))}
                            {currentSongs.length === 0 && (
                                <div style={{ color: "#333", fontSize: "0.6rem", textAlign: "center", padding: "1rem" }}>EMPTY RADIO STATION</div>
                            )}

                            {/* Add Songs Section — Issue 4: only shows songs NOT already in radio */}
                            <div style={{ fontSize: "0.55rem", fontWeight: 800, color: "#444", margin: "1rem 0 0.2rem 0" }}>ADD SONGS ({filteredSongs.length} available)</div>
                            {filteredSongs.length > 0 ? filteredSongs.map(song => (
                                <div key={song.id} style={{ ...insetBox, padding: "0.5rem 0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                        <div style={{ color: "#aaa", fontSize: "0.65rem", fontWeight: 800 }}>{song.title}</div>
                                        <div style={{ color: "#555", fontSize: "0.5rem" }}>{song.artist}</div>
                                    </div>
                                    <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                                        <motion.button
                                            onClick={() => addSongToRadio(song.id, song.title)}
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
                                <div style={{ color: "#333", fontSize: "0.6rem", textAlign: "center", padding: "1rem" }}>
                                    {allSongs.length === 0 ? "No songs in library. Add songs via YouTube first." : "All songs already added!"}
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
                        {radios.map(radio => (
                            <div
                                key={radio.id}
                                onClick={() => openSongs(radio)}
                                style={{ ...insetBox, padding: "0.75rem", display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}
                            >
                                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: radio.themeColor + '20', display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${radio.themeColor}40` }}>
                                    <RadioIcon size={16} color={radio.themeColor} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ color: "#aaa", fontSize: "0.7rem", fontWeight: 800 }}>{radio.name}</div>
                                    <div style={{ color: "#555", fontSize: "0.55rem", fontWeight: 500 }}>
                                        {radio.slug} • {radio._count?.songs || 0} tracks
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: "0.25rem" }} onClick={e => e.stopPropagation()}>
                                    <motion.button onClick={() => startEdit(radio)} whileTap={{ scale: 0.9 }} style={{ padding: "6px", color: "#666" }}><Edit2 size={12} /></motion.button>
                                    <motion.button onClick={() => handleDelete(radio.id, radio.name)} whileTap={{ scale: 0.9 }} style={{ padding: "6px", color: "#ef4444" }}><Trash2 size={12} /></motion.button>
                                </div>
                            </div>
                        ))}
                        {radios.length === 0 && (
                            <div style={{ ...insetBox, padding: "2rem", textAlign: "center", color: "#444", fontSize: "0.6rem", borderStyle: "dashed" }}>
                                NO STATIONS CONFIGURED
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
