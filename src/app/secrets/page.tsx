"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/Container";

// Simple XOR decryption using password as key
function decrypt(encryptedText: string, password: string): string {
    try {
        const decoded = atob(encryptedText);
        const result: string[] = [];
        for (let i = 0; i < decoded.length; i++) {
            result.push(String.fromCharCode(decoded.charCodeAt(i) ^ password.charCodeAt(i % password.length)));
        }
        return result.join("");
    } catch {
        return "";
    }
}

// Check if password is correct
function verifyPassword(encryptedContent: string, password: string): boolean {
    const decrypted = decrypt(encryptedContent, password);
    return decrypted.length > 0 && /^[\x20-\x7E\u00A0-\uFFFF\s]+$/.test(decrypted);
}

interface SecretMessage {
    id: string;
    title: string;
    encryptedContent: string;
    hint?: string;
    createdAt: string;
    emoji?: string;
}

export default function SecretsPage() {
    const [secrets, setSecrets] = useState<SecretMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [unlockedMessages, setUnlockedMessages] = useState<Map<string, string>>(new Map());
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [passwordInput, setPasswordInput] = useState("");
    const [error, setError] = useState("");
    const [justUnlocked, setJustUnlocked] = useState<string | null>(null);

    // Fetch secrets from API
    useEffect(() => {
        fetch("/api/secrets")
            .then(res => res.json())
            .then(data => {
                setSecrets(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // Load unlocked messages from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("unlockedSecretsV2");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setUnlockedMessages(new Map(Object.entries(parsed)));
            } catch {
                // Invalid data, ignore
            }
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        if (unlockedMessages.size > 0) {
            const obj: Record<string, string> = {};
            unlockedMessages.forEach((content, id) => {
                obj[id] = content;
            });
            localStorage.setItem("unlockedSecretsV2", JSON.stringify(obj));
        }
    }, [unlockedMessages]);

    const handleUnlock = (messageId: string) => {
        const message = secrets.find(m => m.id === messageId);
        if (!message) return;

        const password = passwordInput.toLowerCase();

        if (verifyPassword(message.encryptedContent, password)) {
            const decryptedContent = decrypt(message.encryptedContent, password);
            const newMap = new Map(unlockedMessages);
            newMap.set(messageId, decryptedContent);
            setUnlockedMessages(newMap);
            setActiveModal(null);
            setPasswordInput("");
            setError("");
            setJustUnlocked(messageId);
            setTimeout(() => setJustUnlocked(null), 2000);
        } else {
            setError("Password salah! Coba lagi 🔐");
        }
    };

    const isUnlocked = (id: string) => unlockedMessages.has(id);
    const getDecryptedContent = (id: string) => unlockedMessages.get(id) || "";

    if (loading) {
        return (
            <Container>
                <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-secondary)" }}>
                    Loading secrets...
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div className="animate-fade-in-up" style={{ maxWidth: "50rem", marginTop: "2rem", marginBottom: "6rem" }}>

                <header style={{ marginBottom: "3rem" }}>
                    <span style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.85rem",
                        color: "var(--text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        display: "block",
                        marginBottom: "0.5rem"
                    }}>
                        Private Vault
                    </span>
                    <h1 style={{
                        fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                        fontWeight: 700,
                        color: "var(--foreground)"
                    }}>
                        <span style={{ filter: "grayscale(1)" }}>🔐</span> Secrets
                    </h1>
                    <p style={{
                        marginTop: "1rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.6,
                        maxWidth: "35rem"
                    }}>
                        Pesan-pesan rahasia yang terenkripsi. Hanya bisa dibuka dengan password yang benar.
                    </p>
                </header>

                {/* Stats */}
                <div style={{
                    display: "flex",
                    gap: "1.5rem",
                    marginBottom: "2rem",
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                    filter: "grayscale(1)"
                }}>
                    <span>📨 {secrets.length} pesan</span>
                    <span>🔓 {unlockedMessages.size} terbuka</span>
                    <span>🔒 {secrets.length - unlockedMessages.size} terkunci</span>
                </div>

                {/* Messages Grid */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    {secrets.map((message) => {
                        const unlocked = isUnlocked(message.id);
                        const wasJustUnlocked = justUnlocked === message.id;

                        return (
                            <article
                                key={message.id}
                                onClick={() => {
                                    if (!unlocked) {
                                        setActiveModal(message.id);
                                        setError("");
                                        setPasswordInput("");
                                    }
                                }}
                                style={{
                                    padding: "1.5rem",
                                    borderRadius: "16px",
                                    background: unlocked
                                        ? "linear-gradient(135deg, rgba(74, 222, 128, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)"
                                        : "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                                    border: unlocked
                                        ? "1px solid rgba(74, 222, 128, 0.3)"
                                        : "1px solid var(--border)",
                                    cursor: unlocked ? "default" : "pointer",
                                    transition: "all 0.3s ease",
                                    position: "relative",
                                    overflow: "hidden",
                                    animation: wasJustUnlocked ? "pulse 0.5s ease" : "none"
                                }}
                                className={!unlocked ? "hover:scale-[1.01]" : ""}
                            >
                                {/* Lock/Unlock Badge */}
                                <div style={{
                                    position: "absolute",
                                    top: "12px",
                                    right: "12px",
                                    padding: "0.3rem 0.6rem",
                                    borderRadius: "12px",
                                    fontSize: "0.65rem",
                                    fontWeight: 600,
                                    background: unlocked
                                        ? "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)"
                                        : "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
                                    color: "white",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em"
                                }}>
                                    {unlocked ? "🔓 Terbuka" : "🔒 Encrypted"}
                                </div>

                                {/* Header */}
                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                                    <span style={{ fontSize: "1.5rem" }}>{message.emoji || "📧"}</span>
                                    <div>
                                        <h3 style={{
                                            fontSize: "1.1rem",
                                            fontWeight: 600,
                                            color: "var(--foreground)"
                                        }}>
                                            {message.title}
                                        </h3>
                                        <span style={{
                                            fontSize: "0.75rem",
                                            color: "var(--text-secondary)",
                                            fontFamily: "var(--font-mono)"
                                        }}>
                                            {message.createdAt}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                {unlocked ? (
                                    <p style={{
                                        fontSize: "1rem",
                                        lineHeight: 1.7,
                                        color: "var(--foreground)",
                                        marginTop: "0.5rem"
                                    }}>
                                        {getDecryptedContent(message.id)}
                                    </p>
                                ) : (
                                    <div style={{
                                        padding: "1rem",
                                        background: "rgba(0,0,0,0.2)",
                                        borderRadius: "8px",
                                        textAlign: "center"
                                    }}>
                                        <p style={{
                                            fontSize: "0.7rem",
                                            color: "var(--text-secondary)",
                                            fontFamily: "var(--font-mono)",
                                            opacity: 0.5,
                                            wordBreak: "break-all"
                                        }}>
                                            {message.encryptedContent.substring(0, 40)}...
                                        </p>
                                        {message.hint && (
                                            <p style={{
                                                fontSize: "0.75rem",
                                                color: "var(--text-secondary)",
                                                marginTop: "0.75rem",
                                                opacity: 0.7
                                            }}>
                                                <span style={{ filter: "grayscale(1)" }}>💡</span> Hint: {message.hint}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </article>
                        );
                    })}
                </div>

                {/* Empty state */}
                {secrets.length === 0 && (
                    <div style={{
                        textAlign: "center",
                        padding: "4rem 2rem",
                        color: "var(--text-secondary)"
                    }}>
                        <span style={{ fontSize: "3rem", filter: "grayscale(1)" }}>🔐</span>
                        <p style={{ marginTop: "1rem" }}>Belum ada pesan rahasia.</p>
                    </div>
                )}
            </div>

            {/* Password Modal */}
            {activeModal && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.7)",
                        backdropFilter: "blur(8px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                        padding: "1rem"
                    }}
                    onClick={() => {
                        setActiveModal(null);
                        setError("");
                        setPasswordInput("");
                    }}
                >
                    <div
                        className="animate-fade-in"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: "var(--background)",
                            padding: "2rem",
                            borderRadius: "20px",
                            maxWidth: "400px",
                            width: "100%",
                            border: "1px solid var(--border)",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
                        }}
                    >
                        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                            <span style={{ fontSize: "3rem", filter: "grayscale(1)" }}>🔐</span>
                            <h2 style={{
                                fontSize: "1.25rem",
                                fontWeight: 600,
                                marginTop: "0.75rem",
                                color: "var(--foreground)"
                            }}>
                                Decrypt Message
                            </h2>
                            <p style={{
                                fontSize: "0.85rem",
                                color: "var(--text-secondary)",
                                marginTop: "0.5rem"
                            }}>
                                Masukkan password untuk decrypt
                            </p>
                        </div>

                        <input
                            type="password"
                            value={passwordInput}
                            onChange={(e) => {
                                setPasswordInput(e.target.value);
                                setError("");
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleUnlock(activeModal);
                                }
                            }}
                            placeholder="Ketik password..."
                            autoFocus
                            style={{
                                width: "100%",
                                padding: "1rem",
                                fontSize: "1rem",
                                borderRadius: "12px",
                                border: error ? "2px solid #ef4444" : "1px solid var(--border)",
                                backgroundColor: "var(--hover-bg)",
                                color: "var(--foreground)",
                                outline: "none",
                                textAlign: "center",
                                letterSpacing: "0.1em"
                            }}
                        />

                        {error && (
                            <p style={{
                                color: "#ef4444",
                                fontSize: "0.85rem",
                                textAlign: "center",
                                marginTop: "0.75rem"
                            }}>
                                {error}
                            </p>
                        )}

                        <button
                            onClick={() => handleUnlock(activeModal)}
                            style={{
                                width: "100%",
                                padding: "1rem",
                                marginTop: "1rem",
                                fontSize: "1rem",
                                fontWeight: 600,
                                borderRadius: "12px",
                                border: "none",
                                backgroundColor: "var(--foreground)",
                                color: "var(--background)",
                                cursor: "pointer"
                            }}
                        >
                            <span style={{ filter: "grayscale(1)" }}>🔓</span> Decrypt
                        </button>

                        <button
                            onClick={() => {
                                setActiveModal(null);
                                setError("");
                                setPasswordInput("");
                            }}
                            style={{
                                width: "100%",
                                padding: "0.75rem",
                                marginTop: "0.75rem",
                                fontSize: "0.9rem",
                                borderRadius: "12px",
                                border: "1px solid var(--border)",
                                backgroundColor: "transparent",
                                color: "var(--text-secondary)",
                                cursor: "pointer"
                            }}
                        >
                            Batal
                        </button>
                    </div>
                </div>
            )}
        </Container>
    );
}
