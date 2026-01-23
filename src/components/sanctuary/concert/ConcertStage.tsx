"use client";

import { ConcertEvent, ConcertItem } from "@/data/concert-schedule";
import { PLAYLIST } from "@/components/AudioContext";
import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, Heart, Music, Mic } from "lucide-react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export function ConcertStage({ concert }: { concert: ConcertEvent }) {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hearts, setHearts] = useState<{ id: number; x: number; color: string }[]>([]);

    // Audio Refs
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const currentItem = concert.setlist[currentIndex];

    // Helper to find audio URL for a song
    const getSongUrl = (title: string) => {
        const song = PLAYLIST.find(p => p.title === title);
        return song?.audioUrl || "";
    };

    // Heart Animation Logic
    const addHeart = () => {
        const id = Date.now();
        const startX = Math.random() * 80 + 10; // 10% to 90% width
        const colors = [concert.theme.primary, concert.theme.secondary, concert.theme.accent, "#ec4899", "#ef4444"];
        const color = colors[Math.floor(Math.random() * colors.length)];

        setHearts(prev => [...prev, { id, x: startX, color }]);
        setTimeout(() => {
            setHearts(prev => prev.filter(h => h.id !== id));
        }, 3000); // Remove after animation
    };

    // Auto-Advance Logic
    const handleEnded = useCallback(() => {
        if (currentIndex < concert.setlist.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // End of Concert
            setIsPlaying(false);
            // Maybe show an "End Screen"
        }
    }, [currentIndex, concert.setlist.length]);

    // Effect for "MC" items (Timer based)
    useEffect(() => {
        if (!isPlaying) return;

        if (currentItem.type === 'mc') {
            const timer = setTimeout(() => {
                handleEnded();
            }, currentItem.duration * 1000); // Simple timer for MC
            return () => clearTimeout(timer);
        }
    }, [currentItem, isPlaying, handleEnded]);

    // Auto-Play Effect when index changes
    useEffect(() => {
        if (isPlaying && currentItem.type === 'song' && audioRef.current) {
            audioRef.current.play().catch(e => console.error("Play error", e));
        }
    }, [currentIndex, isPlaying, currentItem]);

    // Start Button (User Interaction required first)
    if (!isPlaying && currentIndex === 0) {
        return (
            <div style={{
                position: 'fixed',
                inset: 0,
                zIndex: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.9)',
                backdropFilter: 'blur(16px)'
            }}>
                <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '28rem' }}>
                    <h2 style={{ fontSize: '1.875rem', fontFamily: "'Playfair Display', serif", color: 'white', marginBottom: '0.5rem' }}>
                        {concert.title}
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>
                        {concert.description}
                    </p>
                    <button
                        onClick={() => setIsPlaying(true)}
                        style={{
                            padding: '0.75rem 2rem',
                            borderRadius: '9999px',
                            background: 'white',
                            color: 'black',
                            fontWeight: 500,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        Start Experience
                    </button>
                    <button
                        onClick={() => router.back()}
                        style={{
                            display: 'block',
                            width: '100%',
                            marginTop: '1rem',
                            fontSize: '0.75rem',
                            color: 'rgba(255,255,255,0.4)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                    >
                        Leave Venue
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 50,
                background: `radial-gradient(circle at center, ${concert.theme.primary}20, #000000 80%)`,
                backgroundColor: 'black',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}
        >
            {/* Audio Element for Songs */}
            <audio
                ref={audioRef}
                src={currentItem.type === 'song' ? getSongUrl(currentItem.songTitle) : undefined}
                onEnded={handleEnded}
            />

            {/* Back Button (Top Left) */}
            <button
                onClick={() => router.back()}
                style={{
                    position: 'absolute',
                    top: '1.5rem',
                    left: '1.5rem',
                    zIndex: 50,
                    color: 'rgba(255,255,255,0.3)',
                    background: 'none',
                    border: 'none',
                    padding: '0.5rem',
                    cursor: 'pointer',
                    transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
            >
                <ArrowLeft style={{ width: '1.25rem', height: '1.25rem' }} />
            </button>

            {/* Stage Content */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
                position: 'relative'
            }}>

                {hearts.map(heart => (
                    <motion.div
                        key={heart.id}
                        initial={{ y: 0, opacity: 1, scale: 1 }}
                        animate={{ y: -300, opacity: 0, x: (Math.random() - 0.5) * 50 }}
                        transition={{ duration: 2.5, ease: "easeOut" }}
                        style={{ position: 'absolute', bottom: '5rem', left: `${heart.x}%`, color: heart.color, pointerEvents: 'none' }}
                    >
                        <Heart style={{ width: '1.5rem', height: '1.5rem', fill: 'currentColor' }} />
                    </motion.div>
                ))}

                <AnimatePresence mode="wait">
                    {currentItem.type === 'song' ? (
                        <motion.div
                            key="song-view"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            style={{ textAlign: 'center', maxWidth: '42rem' }}
                        >
                            {/* Visualizer Circle Placeholder */}
                            <div style={{
                                width: '12rem', height: '12rem',
                                margin: '0 auto 3rem auto',
                                borderRadius: '9999px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                position: 'relative'
                            }}>
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    borderRadius: '9999px',
                                    filter: 'blur(40px)',
                                    opacity: 0.2,
                                    background: concert.theme.accent
                                }} />
                                <Music style={{ width: '3rem', height: '3rem', color: 'rgba(255,255,255,0.5)', position: 'relative', zIndex: 10 }} />
                            </div>

                            <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)', fontFamily: "'Playfair Display', serif", color: 'white', marginBottom: '1rem', lineHeight: 1.2 }}>
                                {currentItem.songTitle.split("—")[1]?.trim() || currentItem.songTitle}
                            </h2>
                            <p style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)', color: 'rgba(255,255,255,0.6)', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
                                {currentItem.songTitle.split("—")[0]?.trim()}
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="mc-view"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            style={{ textAlign: 'center', maxWidth: '36rem' }}
                        >
                            <Mic style={{ width: '2rem', height: '2rem', color: 'var(--accent)', margin: '0 auto 1.5rem auto', opacity: 0.8 }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {currentItem.text.map((line, i) => (
                                    <p
                                        key={i}
                                        style={{ fontSize: 'clamp(1.125rem, 4vw, 1.5rem)', fontFamily: "'Playfair Display', serif", color: 'rgba(255,255,255,0.9)', lineHeight: 1.6 }}
                                    >
                                        "{line}"
                                    </p>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Interaction Bar */}
            <div style={{ paddingBottom: '3rem', paddingTop: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', position: 'relative', zIndex: 40 }}>
                <div style={{ height: '0.25rem', flex: 1, maxWidth: '20rem', background: 'rgba(255,255,255,0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <motion.div
                        style={{ height: '100%', background: 'rgba(255,255,255,0.5)' }}
                        initial={{ width: "0%" }}
                        animate={{ width: `${((currentIndex + 1) / concert.setlist.length) * 100}%` }}
                    />
                </div>

                <button
                    onClick={addHeart}
                    style={{
                        width: '3.5rem', height: '3.5rem',
                        borderRadius: '9999px',
                        background: 'rgba(255,255,255,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                >
                    <Heart style={{ width: '1.5rem', height: '1.5rem', color: '#f472b6', fill: 'rgba(244, 114, 182, 0.2)' }} />
                </button>
            </div>
        </div>
    );
}
