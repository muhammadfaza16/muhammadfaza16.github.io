"use client";

import { ZenHideable } from "@/components/ZenHideable";
import Link from "next/link";
import {
    Music2,
    ListMusic,
    Radio as RadioIcon,
    Settings2,
    Search,
    Grid3X3,
    Power
} from "lucide-react";
import { motion } from "framer-motion";

const MENU_ITEMS = [
    { id: "songs", label: "Songs", icon: Music2, href: "/playlist/all" },
    { id: "playlists", label: "Playlists", icon: ListMusic, href: "/playlist" },
    { id: "radio", label: "Radio", icon: RadioIcon, href: "/music/radio" },
    { id: "master", label: "Master", icon: Settings2, href: "/music/master" },
];

const TOOLBAR = [
    { icon: Grid3X3, href: "/starlight" },
    { icon: Power, href: "/" },
];

import { useAudio } from "@/components/AudioContext";
import { useRadio } from "@/components/RadioContext";
import { AtmosphericBackground } from "@/components/AtmosphericBackground";
import { ChevronLeft, Pause, Play } from "lucide-react";

export default function AudioHubPage() {
    const { activePlaybackMode, isPlaying: musicPlaying, activePlaylistId, currentSong, togglePlay } = useAudio();
    const { isRadioPaused, isSyncing, isBuffering, activeStationId, stations, stationsState } = useRadio();

    const isRadioPlaying = activePlaybackMode === 'radio' && !isRadioPaused && !isSyncing && !isBuffering;
    const isMusicPlaying = activePlaybackMode === 'music' && musicPlaying;

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
                    padding: "2rem",
                    position: "relative",
                    zIndex: 1,
                }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                        style={{
                            width: "100%",
                            maxWidth: "360px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "1.5rem"
                        }}
                    >
                        {/* Status Bar */}
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: "1rem"
                        }}>
                            <span style={{
                                color: "rgba(255,255,255,0.7)",
                                fontSize: "0.6rem",
                                fontWeight: 800,
                                letterSpacing: "4px",
                                textTransform: "uppercase",
                                textShadow: "0 2px 8px rgba(0,0,0,0.5)"
                            }}>
                                Audio Engine
                            </span>
                        </div>

                        {/* UX-8: Now Playing Strip */}
                        {(isMusicPlaying || isRadioPlaying) && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    background: "rgba(255,255,255,0.06)",
                                    backdropFilter: "blur(20px)",
                                    borderRadius: "14px",
                                    padding: "12px 16px",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    cursor: "pointer"
                                }}
                                onClick={isMusicPlaying ? togglePlay : undefined}
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.3, 1] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", flexShrink: 0, boxShadow: "0 0 8px rgba(34,197,94,0.6)" }}
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: "0.6rem", fontWeight: 800, color: "rgba(255,255,255,0.5)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "2px" }}>
                                        NOW PLAYING
                                    </div>
                                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {isMusicPlaying ? currentSong.title : (
                                            isRadioPlaying && activeStationId ? (
                                                stationsState[activeStationId]?.song.title || stations.find(s => s.id === activeStationId)?.name || "Radio"
                                            ) : "Playing..."
                                        )}
                                    </div>
                                </div>
                                {isMusicPlaying && (
                                    <div style={{ color: "white", opacity: 0.7 }}>
                                        {musicPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Back to Starlight */}
                        <Link href="/starlight" style={{ textDecoration: "none" }}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                                    padding: "10px",
                                    borderRadius: "12px",
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    color: "rgba(255,255,255,0.4)",
                                    fontSize: "0.7rem",
                                    fontWeight: 700,
                                    letterSpacing: "1px",
                                    textTransform: "uppercase" as const
                                }}
                            >
                                <ChevronLeft size={14} />
                                Back to Starlight
                            </motion.div>
                        </Link>

                        {/* Search Bar - Glassmorphic */}
                        <Link href="/playlist/all" style={{ textDecoration: "none" }}>
                            <motion.div
                                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    height: "48px",
                                    borderRadius: "16px",
                                    background: "rgba(255,255,255,0.04)",
                                    backdropFilter: "blur(20px) saturate(140%)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderTop: "1px solid rgba(255,255,255,0.2)",
                                    borderLeft: "1px solid rgba(255,255,255,0.15)",
                                    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "0 16px",
                                    gap: "12px",
                                    cursor: "pointer"
                                }}
                            >
                                <Search size={18} color="rgba(255,255,255,0.5)" strokeWidth={2.5} />
                                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", fontWeight: 500 }}>
                                    Search tracks...
                                </span>
                            </motion.div>
                        </Link>

                        {/* 2x2 Glass Grid */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gap: "12px",
                        }}>
                            {MENU_ITEMS.map((item, i) => {
                                const Icon = item.icon;

                                // Determine if active
                                let isItemActive = false;
                                if (item.id === "radio" && isRadioPlaying) {
                                    isItemActive = true;
                                } else if (item.id === "songs" && isMusicPlaying && activePlaylistId === null) {
                                    isItemActive = true;
                                } else if (item.id === "playlists" && isMusicPlaying && activePlaylistId !== null) {
                                    isItemActive = true;
                                }

                                return (
                                    <Link key={item.id} href={item.href} style={{ textDecoration: "none" }}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 + i * 0.05, type: "spring", stiffness: 250, damping: 22 }}
                                            whileHover={{ scale: 1.03, backgroundColor: isItemActive ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)" }}
                                            whileTap={{ scale: 0.95 }}
                                            style={{
                                                aspectRatio: "1/1",
                                                background: isItemActive
                                                    ? "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 100%)"
                                                    : "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
                                                backdropFilter: "blur(24px) saturate(140%)",
                                                border: "1px solid rgba(255,255,255,0.08)",
                                                borderTop: `1px solid ${isItemActive ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.2)"}`,
                                                borderLeft: `1px solid ${isItemActive ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)"}`,
                                                borderRadius: "24px",
                                                padding: "1.25rem",
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                gap: "12px",
                                                cursor: "pointer",
                                                boxShadow: isItemActive
                                                    ? "0 10px 40px rgba(255,255,255,0.1)"
                                                    : "0 10px 30px rgba(0,0,0,0.2)",
                                                overflow: "hidden",
                                                position: "relative"
                                            }}
                                        >
                                            <Icon
                                                size={32}
                                                color={isItemActive ? "#fff" : "rgba(255,255,255,0.6)"}
                                                strokeWidth={isItemActive ? 2.5 : 2}
                                            />
                                            <span style={{
                                                color: isItemActive ? "#fff" : "rgba(255,255,255,0.7)",
                                                fontSize: "0.8rem",
                                                fontWeight: 700,
                                                letterSpacing: "0.5px"
                                            }}>
                                                {item.label}
                                            </span>

                                            {/* Suble glow behind icon if active */}
                                            {isItemActive && (
                                                <div style={{
                                                    position: "absolute",
                                                    top: "50%",
                                                    left: "50%",
                                                    transform: "translate(-50%, -50%)",
                                                    width: "50px",
                                                    height: "50px",
                                                    background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)",
                                                    filter: "blur(10px)",
                                                    pointerEvents: "none"
                                                }} />
                                            )}
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Toolbar Glass */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "2.5rem",
                                padding: "1rem 1.5rem",
                                borderRadius: "20px",
                                background: "rgba(0,0,0,0.2)",
                                backdropFilter: "blur(16px)",
                                border: "1px solid rgba(255,255,255,0.05)",
                                marginTop: "1rem"
                            }}
                        >
                            {TOOLBAR.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                                        <motion.div
                                            whileHover={{ scale: 1.1, y: -2 }}
                                            whileTap={{ scale: 0.9 }}
                                            style={{
                                                cursor: "pointer",
                                                display: "flex",
                                            }}
                                        >
                                            <Icon size={22} color="rgba(255,255,255,0.5)" strokeWidth={2} />
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </motion.div>
                    </motion.div>
                </main>
            </ZenHideable>
        </>
    );
}
