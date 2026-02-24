"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/Container";
import { useTheme } from "@/components/guest/no28/ThemeContext";

const sheets = [
    {
        title: "Sebuah Awal",
        content: [
            "Halo, Salsa.",
            "Aku harap pesan ini menemukanmu dalam kondisi yang baik.",
            "Belakangan ini, aku banyak menghabiskan waktu untuk melihat kembali cara-cara lama ku berinteraksi dengan orang-orang di sekitarku, terutama di masa-masa ketika aku belum mengenali diriku sendiri dengan baik. Dalam proses itu, aku terus kembali pada satu momen yang entah mengapa selalu terasa belum tuntas: saat kamu bersikap baik dan terbuka, tapi aku justru meresponsnya dengan dingin dan acuh."
        ]
    },
    {
        title: "Jeda yang Panjang",
        content: [
            "Aku sadar waktu sudah berlalu sangat lama sejak kita berbagi ruang yang sama. Mungkin kamu sudah melupakan detailnya, atau mungkin kamu sudah menempatkannya di kotak kenangan yang tidak perlu dibuka lagi. Aku mengerti sepenuhnya kalau pesan ini terasa datang dari waktu yang tidak jelas, terlambat bertahun-tahun, di saat hidupmu mungkin sudah sangat berbeda.",
            "Tapi aku belajar bahwa permintaan maaf yang sungguh-sungguh tidak punya tanggal kedaluwarsa, dan kesempatan untuk memperbaiki kesalahan masa lalu tidak harus selalu bertujuan mengubah masa kini, tapi sekadar memberikan penutup yang lebih adil."
        ]
    },
    {
        title: "Yang Seharusnya Terucap",
        content: [
            "Aku ingin meminta maaf atas sikapku dulu. Aku ingat betul ketika kamu menunjukkan keramahan yang tulus, namun aku justru memilih untuk menutup diri. Sikap acuh itu muncul bukan karena kamu berlebihan, tapi karena aku yang belum selesai dengan urusanku sendiri.",
            "Saat itu, aku belum memiliki kematangan untuk menghadapi kebaikan orang lain dengan cara yang pantas. Aku membawa luka atau kebingungan yang bukan tanggung jawabmu, tapi aku memperlakukan kamu seolah-olah aku berhak untuk mengabaikan sapaan atau interaksi sederhana yang kamu berikan."
        ]
    },
    {
        title: "Tentang Ketulusanmu",
        content: [
            "Aku ingin kamu tahu bahwa tidak ada yang salah dari caramu bersikap saat itu. Ketulusanmu adalah hal istimewa yang jarang kutemui, dan kegagalanku untuk meresponsnya dengan setimpal adalah murni kekuranganku saat itu, bukan karena ada yang kurang darimu.",
            "Aku khawatir diamku dulu sempat membuatmu bertanya-tanya apakah ada yang salah. Tolong ketahuilah, tidak ada yang salah sama sekali dari sikapmu. Itu murni ketidakmampuanku saat itu."
        ]
    },
    {
        title: "Setelah Ini",
        content: [
            "Aku menyampaikan ini bukan untuk membuka kembali cerita lama atau meminta tempat di hidupmu yang sekarang. Aku tidak mengharapkan balasan atau bahkan pengakuan bahwa kamu masih ingat kejadian tersebut.",
            "Aku harap, jika suatu saat kenangan itu kembali terlintas di benakmu, entah dalam momen refleksi sendiri atau ketika kamu menemukan dirimu meragukan kualitasmu sendiri, kamu tahu bahwa versi dirimu yang dulu tidak kurang dari segi apapun. Kamu adalah sosok yang sempurna. Yang salah adalah caraku menerimanya."
        ]
    },
    {
        title: "Doa Untukmu",
        content: [
            "Semoga kamu selalu dikelilingi oleh orang-orang yang mampu menghargai ketulusanmu dengan cara yang paling utuh, tanpa membuatmu harus menebak-nebak, tanpa membuatmu merasa berlebihan, dan tanpa membuatmu merasa harus meminta izin untuk menjadi dirimu sendiri.",
            "Sekali lagi, terima kasih dan maaf dari lubuk hatiku yang paling dalam.",
            "Jaga kesehatan ya, semoga ke depannya kamu selalu diberikan yang terbaik."
        ],
        signature: "Muhammad Faza"
    },
    {
        title: "Catatan Kecil",
        content: [
            "Sebenarnya, pesan ini sudah ingin kusampaikan sejak 2015, hampir sebelas tahun yang lalu. Namun, mungkin karena ketidaksiapanku saat itu, niat ini tersimpan terlalu lama dan baru menemukan jalannya sekarang.",
            "Anggaplah seluruh halaman ini sebagai cinderamata sederhana, sebuah simbol permohonan maaf atas sikapku yang dulu. Kendati demikian, kenyamananmu tetaplah yang utama. Jika ruang ini dirasa mengganggu atau membuatmu tidak berkenan, tolong beritahu aku, aku akan menghapusnya saat itu juga.",
            "Aku hanya ingin menyampaikan itikad baik yang sempat tertunda, tanpa bermaksud sedikitpun untuk mengusik ketenanganmu."
        ],
        isFootnote: true
    }
];

const AmbientPaintDrops = () => {
    const drops = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 15,
        duration: 15 + Math.random() * 10,
        size: 8 + Math.random() * 12,
        color: ["var(--wc-wash-blue-light)", "var(--wc-wash-sage-light)", "var(--wc-wash-rose-light)", "var(--wc-wash-ochre-light)"][Math.floor(Math.random() * 4)],
        blur: 1 + Math.random() * 3
    })), []);

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", overflow: "hidden" }}>
            {drops.map(drop => (
                <div
                    key={drop.id}
                    style={{
                        position: "absolute", left: drop.left, top: "-20px", width: drop.size, height: drop.size,
                        borderRadius: "50%", background: drop.color, filter: `blur(${drop.blur}px)`, opacity: 0.3,
                        animation: `wc-paint-drop ${drop.duration}s linear ${drop.delay}s infinite`,
                    }}
                />
            ))}
        </div>
    );
};

export default function LetterPage() {
    const router = useRouter();
    const { tokens, mode } = useTheme();
    const [currentPage, setCurrentPage] = useState(0);

    const nextPage = () => {
        if (currentPage < sheets.length - 1) {
            setCurrentPage((prev) => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-wc-canvas wc-scrollbar" style={{
            minHeight: "100svh",
            backgroundImage: tokens.pageBgDots,
            backgroundSize: tokens.pageBgSize,
            color: tokens.textPrimary,
            position: "relative",
            overflowX: "hidden"
        }}>
            {/* Ambient Background */}
            <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    style={{ position: "absolute", top: "10%", right: "-5%", width: "500px", height: "500px", background: "radial-gradient(circle, var(--wc-wash-blue-light) 0%, transparent 70%)", filter: "blur(80px)" }}
                />
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.35, 0.25] }}
                    transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    style={{ position: "absolute", bottom: "5%", left: "-5%", width: "600px", height: "600px", background: "radial-gradient(circle, var(--wc-wash-rose-light) 0%, transparent 70%)", filter: "blur(90px)" }}
                />
            </div>
            <AmbientPaintDrops />

            <main style={{ position: "relative", zIndex: 10, padding: "2rem 0 10rem" }}>
                <Container>
                    {/* Top Navigation */}
                    <div style={{ marginBottom: "3rem" }}>
                        <Link href="/guest/no28" className="wc-card hover-ink-bleed" style={{
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            width: "48px", height: "48px", background: tokens.cardBg,
                            borderRadius: "14px", color: tokens.textPrimary
                        }}>
                            <ArrowLeft size={24} />
                        </Link>
                    </div>

                    {/* The Letter Sheets */}
                    <div style={{ position: "relative", minHeight: "500px", display: "flex", justifyContent: "center" }}>
                        {/* Stack background papers for effect */}
                        <div style={{
                            position: "absolute", top: "10px", left: "12px", right: "-12px", bottom: "-10px",
                            background: tokens.cardBg, border: `1px solid ${tokens.cardBorder}`, borderRadius: "var(--wc-radius-organic)",
                            zIndex: 1, transform: "rotate(1.5deg)", opacity: 0.4, mixBlendMode: mode === "default" ? "multiply" : "screen"
                        }} />
                        <div style={{
                            position: "absolute", top: "-6px", left: "-8px", right: "8px", bottom: "6px",
                            background: tokens.cardBg, border: `1px solid ${tokens.cardBorder}`, borderRadius: "var(--wc-radius-organic)",
                            zIndex: 0, transform: "rotate(-2deg)", opacity: 0.2, mixBlendMode: mode === "default" ? "multiply" : "screen"
                        }} />

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentPage}
                                initial={{ opacity: 0, x: 30, rotate: 1 }}
                                animate={{ opacity: 1, x: 0, rotate: currentPage % 2 === 0 ? -0.5 : 0.5 }}
                                exit={{ opacity: 0, x: -30, rotate: -1 }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                className="wc-card"
                                style={{
                                    padding: "clamp(2rem, 8vw, 4.5rem)",
                                    maxWidth: "680px",
                                    width: "100%",
                                    position: "relative",
                                    zIndex: 10,
                                    border: `1px solid ${tokens.cardBorder}`,
                                    boxShadow: tokens.cardShadow
                                }}
                            >
                                <div className={`wc-wash-stripe wc-wash-stripe--${currentPage % 2 === 0 ? "blue" : "sage"}`} />

                                {/* Subtle vertical line like notebook paper */}
                                <div style={{
                                    position: "absolute", left: "2.5rem", top: 0, bottom: 0,
                                    width: "1px", background: tokens.dividerColor, opacity: 0.6,
                                    zIndex: 2
                                }} />

                                {sheets[currentPage].isFootnote ? (
                                    <h2 className="font-serif-display" style={{
                                        fontSize: "0.85rem", fontWeight: 700, color: tokens.textMuted,
                                        marginBottom: "2.5rem", letterSpacing: "3px", textTransform: "uppercase"
                                    }}>
                                        {sheets[currentPage].title}
                                    </h2>
                                ) : (
                                    <h2 className="font-serif-display" style={{
                                        fontSize: "2.2rem", fontWeight: 400, color: tokens.textPrimary,
                                        marginBottom: "3rem", fontStyle: "italic", opacity: 0.95
                                    }}>
                                        {sheets[currentPage].title}
                                    </h2>
                                )}

                                {sheets[currentPage].content.map((p, i) => (
                                    <p key={i} className={sheets[currentPage].isFootnote ? "font-handwriting" : "font-serif"} style={{
                                        marginBottom: "1.8rem",
                                        lineHeight: "1.8",
                                        fontSize: sheets[currentPage].isFootnote ? "1.2rem" : "1.25rem",
                                        color: sheets[currentPage].isFootnote ? tokens.textMuted : tokens.textSecondary,
                                        textAlign: "justify",
                                        opacity: sheets[currentPage].isFootnote ? 0.8 : 1
                                    }}>
                                        {p}
                                    </p>
                                ))}

                                {sheets[currentPage].signature && (
                                    <div style={{ marginTop: "5rem", textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                        <div className="font-handwriting" style={{
                                            fontSize: "1.3rem", color: tokens.textMuted,
                                            marginBottom: "0.5rem", marginRight: "1rem"
                                        }}>
                                            Tertanda,
                                        </div>
                                        <div className="font-handwriting" style={{
                                            fontSize: "2.2rem", color: tokens.textPrimary,
                                            padding: "0 1.5rem 0.5rem", borderBottom: `2px solid ${tokens.dividerColor}`,
                                            display: "inline-block", minWidth: "180px", textAlign: "center", fontStyle: "normal"
                                        }}>
                                            {sheets[currentPage].signature}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Controls */}
                    <div style={{ marginTop: "4rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "2rem" }}>
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 0}
                            className="wc-card hover-ink-bleed"
                            style={{
                                width: "56px", height: "56px", borderRadius: "16px",
                                background: tokens.cardBg, color: tokens.textPrimary,
                                cursor: currentPage === 0 ? "not-allowed" : "pointer",
                                opacity: currentPage === 0 ? 0.3 : 1,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                border: `1px solid ${tokens.cardBorder}`, transition: "all 0.3s ease"
                            }}
                        >
                            <ChevronLeft size={28} />
                        </button>

                        <div className="font-serif-display" style={{
                            fontSize: "1.1rem", fontWeight: 700, color: tokens.textAccent,
                            fontStyle: "italic", minWidth: "80px", textAlign: "center", opacity: 0.8
                        }}>
                            {currentPage + 1} / {sheets.length}
                        </div>

                        <button
                            onClick={() => {
                                if (currentPage === sheets.length - 1) {
                                    router.push('/guest/no28');
                                } else {
                                    nextPage();
                                }
                            }}
                            className="wc-card hover-ink-bleed"
                            style={{
                                width: "56px", height: "56px", borderRadius: "16px",
                                background: currentPage === sheets.length - 1 ? tokens.accent : tokens.cardBg,
                                color: currentPage === sheets.length - 1 ? "#fff" : tokens.textPrimary,
                                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                                border: `1px solid ${tokens.cardBorder}`, transition: "all 0.3s ease"
                            }}
                        >
                            {currentPage === sheets.length - 1 ? <Home size={28} /> : <ChevronRight size={28} />}
                        </button>
                    </div>

                    {/* Page Progress Dots */}
                    <div style={{ marginTop: "5rem", textAlign: "center" }}>
                        <div style={{ display: "inline-flex", gap: "0.8rem", alignItems: "center" }}>
                            {sheets.map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        width: i === currentPage ? "14px" : "8px",
                                        height: i === currentPage ? "14px" : "8px",
                                        backgroundColor: i === currentPage ? tokens.accent : tokens.dividerColor,
                                        opacity: i === currentPage ? 1 : 0.4
                                    }}
                                    style={{ borderRadius: "50%", transition: "all 0.3s ease" }}
                                />
                            ))}
                        </div>
                    </div>
                </Container>
            </main>
        </div>
    );
}
