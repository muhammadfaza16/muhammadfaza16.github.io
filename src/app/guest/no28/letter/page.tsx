"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/Container";

const sheets = [
    {
        title: "Sebuah Catatan Pembuka",
        content: [
            "Aku sadar waktu punya cara yang sangat efektif untuk mengaburkan ingatan. Kemungkinan paling besar adalah kamu sudah lupa, baik tentang kejadian bertahun-tahun lalu, atau bahkan tentang siapa aku. Itu adalah hal yang sangat wajar dan sebenarnya, aku mengharapkan itu.",
            "Jika kamu bertanya-tanya kenapa pesan ini ada sekarang, jawabannya sederhana: ini bukan tentang menghidupkan kembali apa yang sudah mati, tapi tentang menyelesaikan apa yang pernah tertunda. Dalam perjalanan hidup, aku belajar bahwa ada \"lingkaran yang tidak tuntas\" yang perlu ditutup agar kita bisa melangkah dengan lebih ringan. Menulis ini adalah caraku untuk bertanggung jawab atas sikapku di masa lalu, terlepas dari apakah hal itu masih membekas di ingatanmu atau tidak.",
            "Jadi, jika bagian ini terasa asing bagimu, anggap saja ini sebagai sebuah pesan dari masa lalu yang akhirnya sampai ke alamat yang benar; hanya untuk sekadar diletakkan, bukan untuk dibawa pulang."
        ]
    },
    {
        title: "Kejujuran & Permintaan Maaf",
        content: [
            "Aku menulis ini untuk mengembalikan sebuah kejernihan yang seharusnya sudah aku sampaikan sejak lama. Aku minta maaf.",
            "Bertahun-tahun lalu, aku menyadari ada perhatian yang kamu berikan. Namun, pada saat itu, aku gagal memberikan respons yang layak. Aku memilih untuk menutup diri dan mengabaikanmu begitu saja. Aku menyadari sekarang bahwa diamku mungkin telah membuatmu merasa tidak dianggap atau merasa kecil, seolah-olah keberadaanmu tidak terlihat. Itu adalah kesalahan besar dalam caraku bersikap, dan aku menyadari sepenuhnya sekarang bahwa keputusan itu keliru.",
            "Satu hal yang perlu kamu simpan dengan yakin: kamu tidak melakukan kesalahan apa pun. Akulah yang tidak cukup dewasa untuk mengelola situasi tersebut. Diamnya aku sepenuhnya adalah kegagalanku, dan bukan cerminan dari siapa kamu."
        ]
    },
    {
        title: "Tentang Jarak dan Penundaan",
        content: [
            "Penundaan ini bukan karena aku baru tersadar hari ini. Kegelisahan ini sudah ada sejak lama, bahkan sesaat setelah kita tidak lagi berada di lingkungan yang sama. Aku sudah lama ingin bicara, tapi aku membiarkan jarak dan perbedaan hidup kita membuatku terus menunda.",
            "Sebenarnya, ada rasa hormat dan kagum yang tetap aku simpan dengan baik. Aku melihat duniamu sudah tumbuh ke arah yang berbeda, dan aku merasa tenang melihatnya. Namun, rasa bersalah karena pernah membuatmu merasa tidak berharga selalu lebih besar daripada keberanianku untuk jujur. Aku membiarkan rasa ragu itu menang, sampai akhirnya penundaan ini menjadi pembiaran selama bertahun-tahun."
        ]
    },
    {
        title: "Penutup",
        content: [
            "Biarkan ini menjadi doa tanpa suara yang menyertai langkahmu ke depan. Aku senang mengetahui bahwa hidup telah membawamu ke tempat yang lebih baik hari ini, dan aku sangat menghargai privasi serta kebahagiaan yang kamu miliki sekarang.",
            "Aku sudah selesai dengan beban masa laluku, dan aku ingin kamu pun melangkah tanpa sedikit pun keraguan tentang betapa hebatnya dirimu. Sederhananya: aku yang salah, dan kamu tidak.",
            "Terima kasih sudah pernah menjadi bagian dari ceritaku. Tetaplah bersinar dengan caramu sendiri."
        ],
        signature: "MF"
    },
    {
        title: "Satu Hal Terakhir",
        content: [
            "Aku tahu, diamku dulu mungkin sempat membuatmu merasa tidak dianggap atau merasa kecil. Itulah alasan kenapa aku menyiapkan sisa ruang di halaman ini. Aku ingin ada sesuatu yang secara jujur mencatat dan merayakan hari-harimu.",
            "Anggap saja ini sebagai caraku mengakui bahwa setiap detik yang kamu jalani itu nyata, penting, dan sangat berharga, tidak pernah sekecil apa yang mungkin aku buat kamu rasakan dulu."
        ],
        isFootnote: true
    }
];

export default function LetterPage() {
    const router = useRouter();
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
        <div style={{
            background: "#fdf8f1",
            backgroundImage: "radial-gradient(#e5e0d8 1.5px, transparent 0)",
            backgroundSize: "30px 30px",
            minHeight: "100svh",
            color: "#444",
            fontFamily: "'Crimson Pro', serif, -apple-system",
            position: "relative",
            overflowX: "hidden"
        }}>
            {/* Texture Overlay */}
            <div style={{
                position: "fixed",
                inset: 0,
                opacity: 0.4,
                pointerEvents: "none",
                backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')",
                zIndex: 1
            }} />

            <main style={{ position: "relative", zIndex: 10, padding: "2rem 0 10rem" }}>
                <Container>
                    {/* Top Navigation */}
                    <div style={{ marginBottom: "3rem" }}>
                        <Link href="/guest/no28" style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "44px",
                            height: "44px",
                            background: "#fff",
                            border: "2px solid #5a5a5a",
                            boxShadow: "2px 2px 0px #5a5a5a",
                            borderRadius: "12px",
                            color: "#5a5a5a",
                            transition: "all 0.2s ease"
                        }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = "translate(-1px, -1px)";
                                e.currentTarget.style.boxShadow = "4px 4px 0px #5a5a5a";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = "translate(0, 0)";
                                e.currentTarget.style.boxShadow = "2px 2px 0px #5a5a5a";
                            }}
                        >
                            <Home size={22} strokeWidth={2} />
                        </Link>
                    </div>

                    {/* The Letter Sheets */}
                    <div style={{ position: "relative", minHeight: "500px", display: "flex", justifyContent: "center" }}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentPage}
                                initial={{ opacity: 0, x: 50, rotate: 2 }}
                                animate={{ opacity: 1, x: 0, rotate: currentPage % 2 === 0 ? -0.5 : 0.5 }}
                                exit={{ opacity: 0, x: -50, rotate: -2 }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                style={{
                                    background: "#fff",
                                    border: "2px solid #5a5a5a",
                                    boxShadow: "0px 10px 30px rgba(0,0,0,0.05), 8px 8px 0px #5a5a5a",
                                    padding: "clamp(2rem, 8vw, 4rem)",
                                    maxWidth: "650px",
                                    width: "100%",
                                    position: "relative",
                                    zIndex: 10
                                }}
                            >
                                {/* Paper Decoration */}
                                <div style={{
                                    position: "absolute",
                                    left: "2rem", top: 0, bottom: 0,
                                    width: "1px", background: "rgba(200, 0, 0, 0.08)",
                                    zIndex: 2
                                }} />

                                {sheets[currentPage].isFootnote ? (
                                    <h2 style={{
                                        fontFamily: "'Crimson Pro', serif",
                                        fontSize: "1.2rem",
                                        fontWeight: 600,
                                        color: "#a0907d",
                                        marginBottom: "2rem",
                                        letterSpacing: "0.1em",
                                        textTransform: "uppercase"
                                    }}>
                                        {sheets[currentPage].title}
                                    </h2>
                                ) : (
                                    <h2 style={{
                                        fontFamily: "'Crimson Pro', serif",
                                        fontSize: "1.75rem",
                                        fontWeight: 700,
                                        color: "#d2691e",
                                        marginBottom: "2.5rem",
                                        fontStyle: "italic"
                                    }}>
                                        {sheets[currentPage].title}
                                    </h2>
                                )}

                                {sheets[currentPage].content.map((p, i) => (
                                    <p key={i} style={{
                                        marginBottom: "1.5rem",
                                        lineHeight: "1.8",
                                        fontSize: sheets[currentPage].isFootnote ? "1.05rem" : "1.15rem",
                                        color: sheets[currentPage].isFootnote ? "#777" : "#333",
                                        textAlign: "justify",
                                        fontStyle: sheets[currentPage].isFootnote ? "italic" : "normal"
                                    }}>
                                        {p}
                                    </p>
                                ))}

                                {sheets[currentPage].signature && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1 }}
                                        style={{
                                            marginTop: "3rem",
                                            textAlign: "right",
                                            fontFamily: "cursive, 'Brush Script MT', 'Dancing Script'",
                                            fontSize: "1.8rem",
                                            color: "#5a5a5a"
                                        }}
                                    >
                                        — {sheets[currentPage].signature}
                                    </motion.div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Stack background papers for effect */}
                        <div style={{
                            position: "absolute",
                            top: "10px", left: "10px", right: "-10px", bottom: "-10px",
                            background: "#fff", border: "2px solid #5a5a5a",
                            zIndex: 1, transform: "rotate(1deg)", opacity: 0.5
                        }} />
                        <div style={{
                            position: "absolute",
                            top: "-5px", left: "-5px", right: "5px", bottom: "5px",
                            background: "#fff", border: "2px solid #5a5a5a",
                            zIndex: 0, transform: "rotate(-1.5deg)", opacity: 0.3
                        }} />
                    </div>

                    {/* Bottom Navigation Buttons */}
                    <div style={{
                        marginTop: "3rem",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "1.5rem"
                    }}>
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 0}
                            style={{
                                width: "50px", height: "50px",
                                borderRadius: "15px", border: "2px solid #5a5a5a",
                                background: "#fff", color: "#5a5a5a",
                                cursor: currentPage === 0 ? "not-allowed" : "pointer",
                                opacity: currentPage === 0 ? 0.3 : 1,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "3px 3px 0px #5a5a5a",
                                transition: "all 0.2s ease"
                            }}
                            onMouseOver={(e) => {
                                if (currentPage !== 0) {
                                    e.currentTarget.style.transform = "translate(-1px, -1px)";
                                    e.currentTarget.style.boxShadow = "5px 5px 0px #5a5a5a";
                                }
                            }}
                            onMouseOut={(e) => {
                                if (currentPage !== 0) {
                                    e.currentTarget.style.transform = "translate(0, 0)";
                                    e.currentTarget.style.boxShadow = "3px 3px 0px #5a5a5a";
                                }
                            }}
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <div style={{
                            fontSize: "1rem",
                            fontWeight: 700,
                            color: "#d2691e",
                            fontFamily: "'Crimson Pro', serif",
                            fontStyle: "italic",
                            minWidth: "60px",
                            textAlign: "center"
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
                            style={{
                                width: "50px", height: "50px",
                                borderRadius: "15px", border: "2px solid #5a5a5a",
                                background: currentPage === sheets.length - 1 ? "#d2691e" : "#fff",
                                color: currentPage === sheets.length - 1 ? "#fff" : "#5a5a5a",
                                cursor: "pointer",
                                opacity: 1,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "3px 3px 0px #5a5a5a",
                                transition: "all 0.2s ease"
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = "translate(-1px, -1px)";
                                e.currentTarget.style.boxShadow = "5px 5px 0px #5a5a5a";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = "translate(0, 0)";
                                e.currentTarget.style.boxShadow = "3px 3px 0px #5a5a5a";
                            }}
                        >
                            {currentPage === sheets.length - 1 ? <Home size={24} /> : <ChevronRight size={24} />}
                        </button>
                    </div>

                    {/* Progress Indicator */}
                    <div style={{ marginTop: "4rem", textAlign: "center", opacity: 0.5 }}>
                        <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                            {sheets.map((_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: i === currentPage ? "12px" : "8px",
                                        height: i === currentPage ? "12px" : "8px",
                                        borderRadius: "50%",
                                        background: i === currentPage ? "#d2691e" : "#5a5a5a",
                                        transition: "all 0.3s ease"
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </Container>
            </main>
        </div>
    );
}
