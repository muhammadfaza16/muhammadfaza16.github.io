"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useAudio } from "./AudioContext";
import { cn } from "../lib/utils";
import { X, Copy, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

interface LyricsRecorderProps {
    onClose: () => void;
    initialLyrics?: string; // Raw text to start with
}

export function LyricsRecorder({ onClose, initialLyrics = "" }: LyricsRecorderProps) {
    const { audioRef, isPlaying, togglePlay, currentSong } = useAudio();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // State
    const [rawText, setRawText] = useState(initialLyrics);
    const [lines, setLines] = useState<string[]>([]);
    const [recordedLines, setRecordedLines] = useState<{ time: number; text: string }[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [correctionOffset, setCorrectionOffset] = useState(-0.2); // Default -200ms human reaction comp
    const [flash, setFlash] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    // Parse raw text into lines on mount/change
    useEffect(() => {
        const parsed = rawText.split("\n").map(l => l.trim()).filter(l => l.length > 0);
        if (parsed.length > 0) setLines(parsed);
    }, [rawText]);

    // Auto-load existing lyrics if available
    useEffect(() => {
        async function fetchExisting() {
            try {
                const res = await fetch(`/lyrics/${encodeURIComponent(currentSong.title)}.json`);
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        // Extract text from JSON
                        const extractLines = data.map((item: any) => item.text);
                        setLines(extractLines);
                        // Convert back to raw text for the input box
                        setRawText(extractLines.join("\n"));
                    }
                }
            } catch (e) {
                console.log("No existing lyrics found to auto-load");
            }
        }
        fetchExisting();
    }, [currentSong]);

    // Refs for optimization (to avoid re-binding listeners)
    const stateRef = useRef({
        lines: [] as string[],
        recordedLines: [] as { time: number; text: string }[],
        currentIndex: 0,
        correctionOffset: -0.2,
        isPlaying: false,
        audioRef: null as HTMLAudioElement | null
    });

    // Update refs whenever state changes
    useEffect(() => {
        stateRef.current.lines = lines;
        stateRef.current.recordedLines = recordedLines;
        stateRef.current.currentIndex = currentIndex;
        stateRef.current.correctionOffset = correctionOffset;
        stateRef.current.isPlaying = isPlaying;
        stateRef.current.audioRef = audioRef.current;
    }, [lines, recordedLines, currentIndex, correctionOffset, isPlaying, audioRef]);

    const handleUndo = useCallback(() => {
        const { currentIndex, audioRef } = stateRef.current;
        if (currentIndex > 0) {
            setRecordedLines(prev => prev.slice(0, -1));
            setCurrentIndex(prev => prev - 1);
            // Rewind 2 seconds
            if (audioRef) {
                audioRef.currentTime = Math.max(0, audioRef.currentTime - 2);
            }
        }
    }, []);

    const recordTimestamp = useCallback(() => {
        const { audioRef, currentIndex, lines, correctionOffset, isPlaying } = stateRef.current;

        if (!audioRef || currentIndex >= lines.length) return;

        const currentTime = audioRef.currentTime;
        const adjustedTime = Math.max(0, currentTime + correctionOffset);

        const newLine = {
            time: Number(adjustedTime.toFixed(2)),
            text: lines[currentIndex]
        };

        setRecordedLines(prev => [...prev, newLine]);
        setCurrentIndex(prev => prev + 1);

        // Visual Feedback
        setFlash(true);
        setTimeout(() => setFlash(false), 100);

        // Check completion
        if (currentIndex === lines.length - 1) {
            setIsComplete(true);
            if (isPlaying) togglePlay();
        }

    }, [togglePlay]); // togglePlay is stable hopefully, or we can use ref for it too

    // Keyboard Listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const { isPlaying, currentIndex } = stateRef.current;

            if (e.code === "Space") {
                e.preventDefault();
                if (!isPlaying && currentIndex === 0) {
                    togglePlay();
                    return;
                }
                if (!isPlaying) togglePlay();
                recordTimestamp();
            }
            if (e.key === "Backspace") {
                e.preventDefault();
                handleUndo();
            }
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose, togglePlay, handleUndo, recordTimestamp]);

    const handleCopy = () => {
        const json = JSON.stringify(recordedLines, null, 2);
        navigator.clipboard.writeText(json);
        alert("JSON copied to clipboard!");
    };

    const handleReset = () => {
        setRecordedLines([]);
        setCurrentIndex(0);
        setIsComplete(false);
        if (audioRef.current) audioRef.current.currentTime = 0;
    };

    const content = (
        <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="fixed top-0 left-0 bottom-0 w-[400px] flex flex-col bg-background/95 backdrop-blur-md border-r border-white/10 shadow-2xl p-6 font-mono text-sm z-[9999]"
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-6 border-b border-border pb-4">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                        <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        REC MODE
                    </h2>
                    <p className="text-muted-foreground text-xs leading-relaxed opacity-80">
                        Hit <b className="text-foreground">[SPACE]</b> to sync line.<br />
                        Hit <b className="text-foreground">[BACKSPACE]</b> to undo.
                    </p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-muted rounded text-muted-foreground hover:text-foreground">
                    <X size={20} />
                </button>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-black/20 p-3 rounded space-y-1">
                    <span className="text-[10px] uppercase text-muted-foreground font-bold">Offset</span>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            step="0.1"
                            value={correctionOffset}
                            onChange={e => setCorrectionOffset(Number(e.target.value))}
                            className="w-full bg-transparent border-b border-muted text-foreground font-mono"
                        />
                        <span className="text-xs">s</span>
                    </div>
                </div>
                <div className="bg-black/20 p-3 rounded space-y-1">
                    <span className="text-[10px] uppercase text-muted-foreground font-bold">Time</span>
                    <div className="font-mono text-lg text-accent">
                        {audioRef.current?.currentTime.toFixed(2) || "0.00"}
                    </div>
                </div>
            </div>

            {/* Active Line Display */}
            <div className="flex-1 flex flex-col justify-center mb-8 relative">
                {/* Previous */}
                <p className="text-muted-foreground/30 text-sm mb-4 transition-all line-clamp-1">
                    {currentIndex > 0 ? lines[currentIndex - 1] : "..."}
                </p>

                {/* Current */}
                <div className="relative">
                    <div className={cn("absolute -left-4 top-0 bottom-0 w-1 bg-accent transition-opacity duration-100", flash ? "opacity-100" : "opacity-0")} />
                    <p className={cn(
                        "text-2xl font-serif font-bold text-foreground transition-all duration-100",
                        flash ? "scale-105 pl-2" : "scale-100"
                    )}>
                        {currentIndex < lines.length ? lines[currentIndex] : "END of TRACK"}
                    </p>
                </div>

                {/* Next */}
                <p className="text-muted-foreground/50 text-base mt-4 transition-all line-clamp-2">
                    {currentIndex + 1 < lines.length ? lines[currentIndex + 1] : ""}
                </p>
            </div>

            {/* Tools (Input / Output) */}
            <div className="space-y-4">
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground">Recorded JSON</label>
                        <div className="flex gap-2">
                            <button onClick={handleReset} className="text-[10px] hover:text-accent flex items-center gap-1"><RotateCcw size={10} /> RESET</button>
                            <button onClick={handleCopy} className="text-[10px] hover:text-accent flex items-center gap-1 font-bold"><Copy size={10} /> COPY</button>
                        </div>
                    </div>
                    <textarea
                        readOnly
                        value={JSON.stringify(recordedLines, null, 2)}
                        className="h-24 bg-black/5 p-3 rounded text-[10px] font-mono resize-none focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Manual Input</label>
                    <textarea
                        value={rawText}
                        onChange={(e) => setRawText(e.target.value)}
                        placeholder="Paste lyrics here..."
                        className="h-24 bg-black/5 p-3 rounded text-[10px] font-mono resize-none focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                </div>
            </div>
        </motion.div>
    );

    if (!mounted) return null;
    return createPortal(content, document.body);
}
