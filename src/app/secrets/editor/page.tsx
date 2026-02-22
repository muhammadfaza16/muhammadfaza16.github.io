"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/Container";

// XOR encryption function
function encrypt(text: string, password: string): string {
    const result: number[] = [];
    for (let i = 0; i < text.length; i++) {
        result.push(text.charCodeAt(i) ^ password.charCodeAt(i % password.length));
    }
    return btoa(String.fromCharCode(...result));
}

const ADMIN_PASSWORD = "faza123"; // Ganti dengan password kamu

interface SecretMessage {
    id: string;
    title: string;
    encryptedContent: string;
    hint?: string;
    createdAt: string;
    emoji?: string;
}

export default function SecretsEditorPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminPassword, setAdminPassword] = useState("");
    const [authError, setAuthError] = useState("");

    // Existing secrets
    const [secrets, setSecrets] = useState<SecretMessage[]>([]);

    // Form states
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [password, setPassword] = useState("");
    const [hint, setHint] = useState("");
    const [emoji, setEmoji] = useState("💌");

    // Status
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    // Load existing secrets
    useEffect(() => {
        if (isAuthenticated) {
            fetch("/api/secrets")
                .then(res => res.json())
                .then(data => setSecrets(data))
                .catch(() => { });
        }
    }, [isAuthenticated]);

    const handleAuth = () => {
        if (adminPassword === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            setAuthError("");
        } else {
            setAuthError("Password salah!");
        }
    };

    const handleSubmit = async () => {
        if (!title || !content || !password) {
            setMessage("❌ Title, content, dan password harus diisi!");
            return;
        }

        setSaving(true);
        setMessage("");

        const encryptedContent = encrypt(content, password.toLowerCase());
        const id = `msg-${Date.now().toString(36)}`;
        const date = new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });

        const newSecret: SecretMessage = {
            id,
            title,
            encryptedContent,
            hint: hint || undefined,
            createdAt: date,
            emoji: emoji || "💌"
        };

        try {
            const res = await fetch("/api/secrets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    adminPassword: ADMIN_PASSWORD,
                    secret: newSecret
                })
            });

            if (res.ok) {
                setMessage("✅ Secret berhasil disimpan!");
                setSecrets([...secrets, newSecret]);
                // Clear form
                setTitle("");
                setContent("");
                setPassword("");
                setHint("");
                setEmoji("💌");
            } else {
                setMessage("❌ Gagal menyimpan secret");
            }
        } catch {
            setMessage("❌ Error: Tidak bisa connect ke server");
        }

        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin mau hapus secret ini?")) return;

        try {
            const res = await fetch("/api/secrets", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ adminPassword: ADMIN_PASSWORD, id })
            });

            if (res.ok) {
                setSecrets(secrets.filter(s => s.id !== id));
                setMessage("✅ Secret dihapus!");
            }
        } catch {
            setMessage("❌ Gagal menghapus");
        }
    };

    // Auth gate
    if (!isAuthenticated) {
        return (
            <Container>
                <div className="" style={{
                    maxWidth: "400px",
                    margin: "4rem auto",
                    textAlign: "center"
                }}>
                    <span style={{ fontSize: "4rem" }}>🔐</span>
                    <h1 style={{
                        fontSize: "1.5rem",
                        fontWeight: 700,
                        marginTop: "1rem",
                        color: "var(--foreground)"
                    }}>
                        Secrets Editor
                    </h1>
                    <p style={{
                        color: "var(--text-secondary)",
                        marginTop: "0.5rem",
                        marginBottom: "2rem"
                    }}>
                        Masukkan admin password untuk akses
                    </p>

                    <input
                        type="password"
                        value={adminPassword}
                        onChange={(e) => {
                            setAdminPassword(e.target.value);
                            setAuthError("");
                        }}
                        onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                        placeholder="Admin password..."
                        style={{
                            width: "100%",
                            padding: "1rem",
                            fontSize: "1rem",
                            borderRadius: "12px",
                            border: authError ? "2px solid #ef4444" : "1px solid var(--border)",
                            backgroundColor: "var(--hover-bg)",
                            color: "var(--foreground)",
                            textAlign: "center"
                        }}
                    />

                    {authError && (
                        <p style={{ color: "#ef4444", marginTop: "0.5rem", fontSize: "0.85rem" }}>
                            {authError}
                        </p>
                    )}

                    <button
                        onClick={handleAuth}
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
                        Masuk
                    </button>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div className="" style={{ maxWidth: "50rem", marginTop: "2rem", marginBottom: "6rem" }}>

                <header style={{ marginBottom: "2rem" }}>
                    <span style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.85rem",
                        color: "var(--text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em"
                    }}>
                        Admin Tool
                    </span>
                    <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--foreground)" }}>
                        ✏️ Secrets Editor
                    </h1>
                    <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
                        Tambah dan kelola pesan rahasia. Auto-save ke server!
                    </p>
                </header>

                {/* Status Message */}
                {message && (
                    <div style={{
                        padding: "1rem",
                        marginBottom: "1.5rem",
                        borderRadius: "12px",
                        backgroundColor: message.includes("✅") ? "rgba(74, 222, 128, 0.1)" : "rgba(239, 68, 68, 0.1)",
                        border: `1px solid ${message.includes("✅") ? "rgba(74, 222, 128, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                        color: "var(--foreground)"
                    }}>
                        {message}
                    </div>
                )}

                {/* Form */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem",
                    padding: "1.5rem",
                    borderRadius: "16px",
                    backgroundColor: "var(--card-bg)",
                    border: "1px solid var(--border)",
                    marginBottom: "2rem"
                }}>
                    <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--foreground)" }}>
                        ➕ Tambah Secret Baru
                    </h2>

                    <div style={{ display: "flex", gap: "1rem" }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.5rem", display: "block" }}>
                                Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Judul pesan..."
                                style={{
                                    width: "100%",
                                    padding: "0.75rem",
                                    borderRadius: "8px",
                                    border: "1px solid var(--border)",
                                    backgroundColor: "var(--hover-bg)",
                                    color: "var(--foreground)"
                                }}
                            />
                        </div>
                        <div style={{ width: "80px" }}>
                            <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.5rem", display: "block" }}>
                                Emoji
                            </label>
                            <input
                                type="text"
                                value={emoji}
                                onChange={(e) => setEmoji(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "0.75rem",
                                    borderRadius: "8px",
                                    border: "1px solid var(--border)",
                                    backgroundColor: "var(--hover-bg)",
                                    color: "var(--foreground)",
                                    textAlign: "center",
                                    fontSize: "1.25rem"
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.5rem", display: "block" }}>
                            Content (Pesan Rahasia)
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Tulis pesan rahasia kamu di sini..."
                            rows={4}
                            style={{
                                width: "100%",
                                padding: "0.75rem",
                                borderRadius: "8px",
                                border: "1px solid var(--border)",
                                backgroundColor: "var(--hover-bg)",
                                color: "var(--foreground)",
                                resize: "vertical"
                            }}
                        />
                    </div>

                    <div style={{ display: "flex", gap: "1rem" }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.5rem", display: "block" }}>
                                🔑 Password (untuk decrypt)
                            </label>
                            <input
                                type="text"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password unik..."
                                style={{
                                    width: "100%",
                                    padding: "0.75rem",
                                    borderRadius: "8px",
                                    border: "1px solid var(--border)",
                                    backgroundColor: "var(--hover-bg)",
                                    color: "var(--foreground)"
                                }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.5rem", display: "block" }}>
                                <span>💡</span> Hint (opsional)
                            </label>
                            <input
                                type="text"
                                value={hint}
                                onChange={(e) => setHint(e.target.value)}
                                placeholder="Petunjuk password..."
                                style={{
                                    width: "100%",
                                    padding: "0.75rem",
                                    borderRadius: "8px",
                                    border: "1px solid var(--border)",
                                    backgroundColor: "var(--hover-bg)",
                                    color: "var(--foreground)"
                                }}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        style={{
                            padding: "1rem",
                            fontSize: "1rem",
                            fontWeight: 600,
                            borderRadius: "12px",
                            border: "none",
                            background: saving ? "#6b7280" : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                            color: "white",
                            cursor: saving ? "not-allowed" : "pointer"
                        }}
                    >
                        {saving ? <span>⏳ Menyimpan...</span> : <span>💾 Simpan Secret</span>}
                    </button>
                </div>

                {/* Existing Secrets */}
                <div>
                    <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "1rem" }}>
                        <span>📋</span> Daftar Secrets ({secrets.length})
                    </h2>

                    {secrets.length === 0 ? (
                        <p style={{ color: "var(--text-secondary)" }}>Belum ada secrets.</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {secrets.map((secret) => (
                                <div
                                    key={secret.id}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "1rem",
                                        borderRadius: "12px",
                                        backgroundColor: "var(--hover-bg)",
                                        border: "1px solid var(--border)"
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                        <span style={{ fontSize: "1.25rem" }}>{secret.emoji}</span>
                                        <div>
                                            <strong style={{ color: "var(--foreground)" }}>{secret.title}</strong>
                                            <span style={{
                                                fontSize: "0.75rem",
                                                color: "var(--text-secondary)",
                                                marginLeft: "0.5rem",
                                                fontFamily: "var(--font-mono)"
                                            }}>
                                                {secret.createdAt}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(secret.id)}
                                        style={{
                                            padding: "0.5rem 1rem",
                                            fontSize: "0.8rem",
                                            borderRadius: "8px",
                                            border: "1px solid rgba(239, 68, 68, 0.3)",
                                            backgroundColor: "rgba(239, 68, 68, 0.1)",
                                            color: "#ef4444",
                                            cursor: "pointer"
                                        }}
                                    >
                                        <span>🗑️</span> Hapus
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </Container>
    );
}
