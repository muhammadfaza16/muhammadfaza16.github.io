"use client";

import { ZenHideable } from "@/components/ZenHideable";
import Link from "next/link";
import {
    Music2,
    ListMusic,
    Radio as RadioIcon,
    Settings2,
    Search,
    ChevronLeft,
    Pause,
    Play,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/components/AudioContext";
import { useRadio } from "@/components/RadioContext";
import { AtmosphericBackground } from "@/components/AtmosphericBackground";

const MENU_ITEMS = [
    { id: "songs", label: "Songs", subtitle: "All tracks", icon: Music2, href: "/playlist/all", color: "#FFD60A" },
    { id: "playlists", label: "Playlists", subtitle: "Curated sets", icon: ListMusic, href: "/playlist", color: "#0A84FF" },
    { id: "radio", label: "Radio", subtitle: "Live stations", icon: RadioIcon, href: "/music/radio", color: "#32D74B" },
];

export default function AudioHubPage() {
    const { activePlaybackMode, isPlaying: musicPlaying, activePlaylistId, currentSong, togglePlay } = useAudio();
    const { isRadioPaused, isSyncing, isBuffering, activeStationId, stations, stationsState } = useRadio();

    const isRadioPlaying = activePlaybackMode === 'radio' && !isRadioPaused && !isSyncing && !isBuffering;
    const isMusicPlaying = activePlaybackMode === 'music' && musicPlaying;
    const isAnythingPlaying = isMusicPlaying || isRadioPlaying;

    return (
        <>
            <AtmosphericBackground />

            <ZenHideable>
                <main style={{
                    minHeight: "100dvh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "2rem 1.5rem",
                    position: "relative",
                    zIndex: 1,
                }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                        style={{
                            width: "100%",
                            maxWidth: "380px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "1.25rem"
                        }}
                    >
                        {/* Header — Back + Title */}
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}>
                            <Link href="/starlight" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
                                <motion.div
                                    whileHover={{ x: -3 }}
                                    whileTap={{ scale: 0.9 }}
                                    style={{
                                        display: "flex", alignItems: "center", gap: "4px",
                                        color: "rgba(255,255,255,0.5)",
                                        fontSize: "0.75rem", fontWeight: 600,
                                        padding: "6px 10px 6px 4px",
                                        borderRadius: "10px",
                                        transition: "color 0.2s",
                                    }}
                                    className="hover:text-white"
                                >
                                    <ChevronLeft size={16} />
                                    <span>Back</span>
                                </motion.div>
                            </Link>

                            <span style={{
                                color: "rgba(255,255,255,0.5)",
                                fontSize: "0.55rem",
                                fontWeight: 800,
                                letterSpacing: "3px",
                                textTransform: "uppercase",
                            }}>
                                Audio
                            </span>

                            {/* Master settings — subtle icon */}
                            <Link href="/music/master" style={{ textDecoration: "none" }}>
                                <motion.div
                                    whileHover={{ rotate: 45 }}
                                    whileTap={{ scale: 0.9 }}
                                    style={{
                                        padding: "6px",
                                        borderRadius: "10px",
                                        color: "rgba(255,255,255,0.35)",
                                        transition: "color 0.2s",
                                    }}
                                    className="hover:text-white"
                                >
                                    <Settings2 size={16} />
                                </motion.div>
                            </Link>
                        </div>

                        {/* Now Playing Strip */}
                        <AnimatePresence>
                            {isAnythingPlaying && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    animate={{ opacity: 1, height: "auto", marginBottom: 0 }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    style={{ overflow: "hidden" }}
                                >
                                    <Link
                                        href={isMusicPlaying && activePlaylistId
                                            ? `/playlist/${activePlaylistId}`
                                            : isRadioPlaying ? "/music/radio"
                                                : "/playlist/all"
                                        }
                                        style={{ textDecoration: "none" }}
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.98 }}
                                            style={{
                                                background: "rgba(255,255,255,0.06)",
                                                backdropFilter: "blur(20px)",
                                                borderRadius: "16px",
                                                padding: "14px 16px",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "12px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            {/* Animated equalizer bars */}
                                            <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "18px", flexShrink: 0 }}>
                                                {[0, 1, 2].map(b => (
                                                    <motion.div
                                                        key={b}
                                                        style={{
                                                            width: "3px",
                                                            borderRadius: "1.5px",
                                                            background: isRadioPlaying ? "#22c55e" : "#FFD60A",
                                                        }}
                                                        animate={{ height: ["4px", `${10 + b * 4}px`, "5px", `${12 - b * 2}px`, "4px"] }}
                                                        transition={{ duration: 0.8 + b * 0.15, repeat: Infinity, ease: "easeInOut", delay: b * 0.1 }}
                                                    />
                                                ))}
                                            </div>

                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{
                                                    fontSize: "0.55rem", fontWeight: 800,
                                                    color: isRadioPlaying ? "rgba(34,197,94,0.7)" : "rgba(255,214,10,0.7)",
                                                    letterSpacing: "1.5px", textTransform: "uppercase",
                                                    marginBottom: "3px",
                                                }}>
                                                    {isRadioPlaying ? "LIVE RADIO" : "NOW PLAYING"}
                                                </div>
                                                <div style={{
                                                    fontSize: "0.85rem", fontWeight: 600,
                                                    color: "white",
                                                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                                }}>
                                                    {isMusicPlaying ? currentSong.title : (
                                                        isRadioPlaying && activeStationId ? (
                                                            stationsState[activeStationId]?.song.title
                                                            || stations.find(s => s.id === activeStationId)?.name
                                                            || "Radio"
                                                        ) : "Playing..."
                                                    )}
                                                </div>
                                            </div>

                                            {/* Play/Pause for music only */}
                                            {isMusicPlaying && (
                                                <motion.div
                                                    whileHover={{ scale: 1.15 }}
                                                    whileTap={{ scale: 0.85 }}
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); togglePlay(); }}
                                                    style={{
                                                        width: "36px", height: "36px",
                                                        borderRadius: "50%",
                                                        background: "rgba(255,255,255,0.1)",
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                        flexShrink: 0,
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    {musicPlaying
                                                        ? <Pause size={14} fill="white" color="white" />
                                                        : <Play size={14} fill="white" color="white" style={{ marginLeft: "2px" }} />
                                                    }
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Search Bar */}
                        <Link href="/playlist/all" style={{ textDecoration: "none" }}>
                            <motion.div
                                whileHover={{ scale: 1.01, borderColor: "rgba(255,255,255,0.2)" }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    height: "44px",
                                    borderRadius: "14px",
                                    background: "rgba(255,255,255,0.04)",
                                    backdropFilter: "blur(20px) saturate(140%)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "0 14px",
                                    gap: "10px",
                                    cursor: "pointer",
                                    transition: "border-color 0.2s ease",
                                }}
                            >
                                <Search size={16} color="rgba(255,255,255,0.4)" strokeWidth={2.5} />
                                <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.82rem", fontWeight: 500 }}>
                                    Search tracks...
                                </span>
                            </motion.div>
                        </Link>

                        {/* Main Navigation — 3 cards stacked vertically */}
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                        }}>
                            {MENU_ITEMS.map((item, i) => {
                                const Icon = item.icon;

                                let isItemActive = false;
                                if (item.id === "radio" && isRadioPlaying) isItemActive = true;
                                else if (item.id === "songs" && isMusicPlaying && activePlaylistId === null) isItemActive = true;
                                else if (item.id === "playlists" && isMusicPlaying && activePlaylistId !== null) isItemActive = true;

                                return (
                                    <Link key={item.id} href={item.href} style={{ textDecoration: "none" }}>
                                        <motion.div
                                            initial={{ opacity: 0, x: -15 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + i * 0.06, type: "spring", stiffness: 250, damping: 22 }}
                                            whileHover={{ scale: 1.02, x: 4 }}
                                            whileTap={{ scale: 0.97 }}
                                            style={{
                                                background: isItemActive
                                                    ? "rgba(255,255,255,0.08)"
                                                    : "rgba(255,255,255,0.03)",
                                                backdropFilter: "blur(20px) saturate(140%)",
                                                border: `1px solid ${isItemActive ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)"}`,
                                                borderRadius: "18px",
                                                padding: "16px 20px",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "16px",
                                                cursor: "pointer",
                                                position: "relative",
                                                overflow: "hidden",
                                                transition: "background 0.2s, border-color 0.2s",
                                            }}
                                        >
                                            {/* Icon circle */}
                                            <div style={{
                                                width: "44px", height: "44px",
                                                borderRadius: "14px",
                                                background: isItemActive
                                                    ? `linear-gradient(135deg, ${item.color}33 0%, ${item.color}15 100%)`
                                                    : "rgba(255,255,255,0.04)",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                flexShrink: 0,
                                                border: `1px solid ${isItemActive ? `${item.color}40` : "rgba(255,255,255,0.06)"}`,
                                                transition: "all 0.3s ease",
                                            }}>
                                                <Icon
                                                    size={20}
                                                    color={isItemActive ? item.color : "rgba(255,255,255,0.55)"}
                                                    strokeWidth={2}
                                                />
                                            </div>

                                            {/* Label + subtitle */}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{
                                                    fontSize: "0.9rem",
                                                    fontWeight: 700,
                                                    color: isItemActive ? "white" : "rgba(255,255,255,0.8)",
                                                    marginBottom: "2px",
                                                }}>
                                                    {item.label}
                                                </div>
                                                <div style={{
                                                    fontSize: "0.7rem",
                                                    fontWeight: 500,
                                                    color: "rgba(255,255,255,0.35)",
                                                }}>
                                                    {item.subtitle}
                                                </div>
                                            </div>

                                            {/* Active indicator */}
                                            {isItemActive && (
                                                <motion.div
                                                    animate={{ scale: [1, 1.3, 1] }}
                                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                                    style={{
                                                        width: "8px", height: "8px",
                                                        borderRadius: "50%",
                                                        background: item.color,
                                                        boxShadow: `0 0 8px ${item.color}80`,
                                                        flexShrink: 0,
                                                    }}
                                                />
                                            )}

                                            {/* Right chevron */}
                                            <ChevronLeft
                                                size={16}
                                                style={{
                                                    transform: "rotate(180deg)",
                                                    color: "rgba(255,255,255,0.2)",
                                                    flexShrink: 0,
                                                }}
                                            />
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.div>
                </main>
            </ZenHideable>
        </>
    );
}
