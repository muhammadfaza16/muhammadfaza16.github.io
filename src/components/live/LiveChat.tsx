"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, X, ChevronDown } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

interface ChatMessage {
    id: string;
    nickname: string;
    content: string;
    createdAt: string;
}

const POLL_INTERVAL = 4000; // 4s polling — balanced between UX and load
const ANON_ANIMALS = [
    "Fox", "Wolf", "Bear", "Owl", "Deer", "Lynx", "Hare", "Crow",
    "Swan", "Hawk", "Dove", "Seal", "Cat", "Moth", "Wren", "Bat"
];

function getOrCreateNickname(): string {
    if (typeof window === "undefined") return "Anon";
    const key = "live_chat_nickname";
    let nick = sessionStorage.getItem(key);
    if (!nick) {
        const animal = ANON_ANIMALS[Math.floor(Math.random() * ANON_ANIMALS.length)];
        const num = Math.floor(Math.random() * 999) + 1;
        nick = `${animal}${num}`;
        sessionStorage.setItem(key, nick);
    }
    return nick;
}

function timeAgo(iso: string): string {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return "now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
}

// Generate a stable hue from nickname for avatar color
function nicknameHue(name: string): number {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % 360;
}

export function LiveChat({ 
    sessionId, 
    isVisible, 
    onClose 
}: { 
    sessionId: string; 
    isVisible: boolean; 
    onClose: () => void;
}) {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const headerFont = "var(--font-display), system-ui, sans-serif";
    const monoFont = "var(--font-mono), monospace";

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [nickname] = useState(() => getOrCreateNickname());
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [hasNewMessages, setHasNewMessages] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const lastMessageTimeRef = useRef<string | null>(null);
    const pollTimerRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // ─── Fetch messages ──────────────────────────────────────────────
    const fetchMessages = useCallback(async (isInitial = false) => {
        try {
            const params = new URLSearchParams({ sessionId });
            if (!isInitial && lastMessageTimeRef.current) {
                params.set("after", lastMessageTimeRef.current);
            }

            const res = await fetch(`/api/live-music/chat?${params}`);
            if (!res.ok) return;
            
            const data = await res.json();
            if (!data.success || !data.messages?.length) return;

            if (isInitial) {
                setMessages(data.messages);
            } else {
                setMessages(prev => [...prev, ...data.messages]);
                if (!isAtBottom) {
                    setHasNewMessages(true);
                }
            }

            // Update cursor
            const lastMsg = data.messages[data.messages.length - 1];
            if (lastMsg) {
                lastMessageTimeRef.current = lastMsg.createdAt;
            }
        } catch (e) {
            // Silently fail — chat is non-critical
        }
    }, [sessionId, isAtBottom]);

    // ─── Initial load + polling ──────────────────────────────────────
    useEffect(() => {
        if (!isVisible || !sessionId) return;

        // Initial fetch
        fetchMessages(true);

        // Start polling
        pollTimerRef.current = setInterval(() => {
            fetchMessages(false);
        }, POLL_INTERVAL);

        return () => {
            if (pollTimerRef.current) clearInterval(pollTimerRef.current);
        };
    }, [isVisible, sessionId, fetchMessages]);

    // ─── Auto-scroll to bottom ───────────────────────────────────────
    useEffect(() => {
        if (isAtBottom && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isAtBottom]);

    // ─── Track scroll position ───────────────────────────────────────
    const handleScroll = useCallback(() => {
        if (!scrollRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const atBottom = scrollHeight - scrollTop - clientHeight < 60;
        setIsAtBottom(atBottom);
        if (atBottom) setHasNewMessages(false);
    }, []);

    const scrollToBottom = useCallback(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
            setHasNewMessages(false);
        }
    }, []);

    // ─── Send message ────────────────────────────────────────────────
    const sendMessage = useCallback(async () => {
        const content = inputValue.trim();
        if (!content || isSending) return;

        setIsSending(true);
        setInputValue("");

        try {
            const res = await fetch("/api/live-music/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId, nickname, content }),
            });

            const data = await res.json();
            if (data.success && data.message) {
                setMessages(prev => [...prev, data.message]);
                lastMessageTimeRef.current = data.message.createdAt;
                setIsAtBottom(true); // Force scroll to own message
            }
        } catch (e) {
            // Silently fail
        } finally {
            setIsSending(false);
            inputRef.current?.focus();
        }
    }, [inputValue, isSending, sessionId, nickname]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }, [sendMessage]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 30, stiffness: 350 }}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 999999,
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: isDark ? "#0A0A0A" : "#F8F5F2",
                        color: isDark ? "#FFF" : "#1A1A1A",
                    }}
                >
                    {/* Header */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "calc(env(safe-area-inset-top) + 16px) 20px 16px",
                        borderBottom: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.05)",
                        background: isDark ? "rgba(10,10,10,0.95)" : "rgba(248,245,242,0.95)",
                        backdropFilter: "blur(20px)",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <MessageCircle size={18} color="#EF4444" />
                            <span style={{ fontFamily: headerFont, fontWeight: 900, fontSize: "1rem", letterSpacing: "-0.01em" }}>
                                Live Chat
                            </span>
                            <span style={{
                                fontFamily: monoFont, fontSize: "0.55rem", fontWeight: 800,
                                backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                                padding: "2px 8px", borderRadius: "100px",
                                color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
                                border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
                            }}>
                                {nickname}
                            </span>
                        </div>
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={onClose}
                            style={{
                                width: "36px", height: "36px", borderRadius: "100px",
                                background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                                border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", color: "inherit",
                            }}
                        >
                            <X size={18} />
                        </motion.button>
                    </div>

                    {/* Messages */}
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        style={{
                            flex: 1,
                            overflowY: "auto",
                            padding: "16px 20px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                            WebkitOverflowScrolling: "touch",
                            overscrollBehaviorY: "contain",
                        }}
                    >
                        {messages.length === 0 && (
                            <div style={{
                                flex: 1, display: "flex", flexDirection: "column",
                                alignItems: "center", justifyContent: "center", gap: "12px",
                                opacity: 0.4,
                            }}>
                                <MessageCircle size={40} />
                                <span style={{ fontFamily: headerFont, fontWeight: 700, fontSize: "0.85rem" }}>
                                    No messages yet
                                </span>
                                <span style={{ fontFamily: headerFont, fontWeight: 500, fontSize: "0.75rem" }}>
                                    Be the first to say something!
                                </span>
                            </div>
                        )}

                        {messages.map((msg) => {
                            const isOwn = msg.nickname === nickname;
                            const hue = nicknameHue(msg.nickname);
                            const avatarBg = `hsl(${hue}, 60%, ${isDark ? 25 : 85}%)`;
                            const avatarColor = `hsl(${hue}, 70%, ${isDark ? 75 : 35}%)`;

                            return (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: "10px",
                                        flexDirection: isOwn ? "row-reverse" : "row",
                                    }}
                                >
                                    {/* Avatar */}
                                    <div style={{
                                        width: "28px", height: "28px", borderRadius: "100px",
                                        background: avatarBg,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        flexShrink: 0,
                                        fontSize: "0.6rem", fontFamily: headerFont, fontWeight: 900,
                                        color: avatarColor, textTransform: "uppercase",
                                    }}>
                                        {msg.nickname.slice(0, 2)}
                                    </div>

                                    {/* Bubble */}
                                    <div style={{
                                        maxWidth: "75%",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "4px",
                                        alignItems: isOwn ? "flex-end" : "flex-start",
                                    }}>
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            flexDirection: isOwn ? "row-reverse" : "row",
                                        }}>
                                            <span style={{
                                                fontFamily: headerFont, fontWeight: 800,
                                                fontSize: "0.65rem", color: avatarColor,
                                            }}>
                                                {msg.nickname}
                                            </span>
                                            <span style={{
                                                fontFamily: monoFont, fontSize: "0.5rem", fontWeight: 700,
                                                color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
                                            }}>
                                                {timeAgo(msg.createdAt)}
                                            </span>
                                        </div>
                                        <div style={{
                                            padding: "10px 14px",
                                            borderRadius: isOwn ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                                            background: isOwn
                                                ? (isDark ? "rgba(99, 102, 241, 0.2)" : "rgba(99, 102, 241, 0.1)")
                                                : (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"),
                                            border: isOwn
                                                ? (isDark ? "1px solid rgba(99, 102, 241, 0.3)" : "1px solid rgba(99, 102, 241, 0.15)")
                                                : (isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.05)"),
                                            fontFamily: headerFont, fontWeight: 600,
                                            fontSize: "0.82rem", lineHeight: 1.5,
                                            wordBreak: "break-word",
                                        }}>
                                            {msg.content}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* New Messages Indicator */}
                    <AnimatePresence>
                        {hasNewMessages && (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                onClick={scrollToBottom}
                                style={{
                                    position: "absolute",
                                    bottom: "90px",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    padding: "6px 16px",
                                    borderRadius: "100px",
                                    background: "#6366F1",
                                    color: "#FFF",
                                    border: "none",
                                    cursor: "pointer",
                                    fontFamily: headerFont,
                                    fontWeight: 800,
                                    fontSize: "0.65rem",
                                    letterSpacing: "0.05em",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    boxShadow: "0 8px 20px rgba(99, 102, 241, 0.4)",
                                    zIndex: 10,
                                }}
                            >
                                <ChevronDown size={14} />
                                New messages
                            </motion.button>
                        )}
                    </AnimatePresence>

                    {/* Input */}
                    <div style={{
                        padding: "12px 20px calc(env(safe-area-inset-bottom) + 12px)",
                        borderTop: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.05)",
                        background: isDark ? "rgba(10,10,10,0.95)" : "rgba(248,245,242,0.95)",
                        backdropFilter: "blur(20px)",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Say something..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            maxLength={500}
                            style={{
                                flex: 1,
                                height: "44px",
                                borderRadius: "100px",
                                padding: "0 18px",
                                backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                                border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
                                color: "inherit",
                                fontSize: "0.85rem",
                                fontFamily: headerFont,
                                fontWeight: 600,
                                outline: "none",
                            }}
                        />
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={sendMessage}
                            disabled={!inputValue.trim() || isSending}
                            style={{
                                width: "44px", height: "44px", borderRadius: "100px",
                                background: inputValue.trim()
                                    ? "#6366F1"
                                    : (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"),
                                border: "none",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: inputValue.trim() ? "pointer" : "default",
                                color: inputValue.trim() ? "#FFF" : (isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"),
                                transition: "all 0.2s ease",
                                boxShadow: inputValue.trim() ? "0 8px 20px rgba(99, 102, 241, 0.3)" : "none",
                            }}
                        >
                            <Send size={18} />
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
