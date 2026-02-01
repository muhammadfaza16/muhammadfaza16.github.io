"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/Container";

const sheets = [
    {
        title: "Sebuah Awal",
        content: [
            "Halo, Salsa.",
            "Aku harap pesan ini menemukanmu dalam kondisi yang baik.",
            "Belakangan ini, aku banyak menghabiskan waktu untuk melihat kembali cara-cara lama ku berinteraksi dengan orang-orang di sekitarku, terutama di masa-masa ketika aku belum mengenali diriku sendiri dengan baik. Dalam proses itu, aku terus kembali pada satu momen yang entah mengapa selalu terasa belum tuntas: saat kamu hadir dengan cara yang tulus, dan aku justru merespons dengan ketidakhadiran yang dingin."
        ]
    },
    {
        title: "Jeda yang Panjang",
        content: [
            "Aku sadar waktu sudah berlalu cukup lama sejak kita berbagi ruang yang sama. Mungkin kamu sudah melupakan detailnya, atau mungkin kamu sudah menempatkannya di kotak kenangan yang tidak perlu dibuka lagi. Aku mengerti sepenuhnya kalau pesan ini terasa datang dari waktu yang tidak jelas, terlambat bertahun-tahun, di saat hidupmu mungkin sudah sangat berbeda.",
            "Tapi aku belajar bahwa permintaan maaf yang sungguh-sungguh tidak punya tanggal kedaluwarsa, dan kesempatan untuk memperbaiki kesalahan masa lalu tidak harus selalu bertujuan mengubah masa kini, tapi sekadar memberikan penutup yang lebih adil."
        ]
    },
    {
        title: "Yang Seharusnya Terucap",
        content: [
            "Jadi ini yang ingin kusampaikan. Aku minta maaf atas sikapku yang dulu. Aku ingat betul ketika kamu mencoba mendekat dengan cara yang hangat dan terbuka, namun aku justru memilih untuk menarik diri dan membekukanmu dengan sikap acuh yang tidak sepantasnya kamu terima.",
            "Saat itu, aku belum memiliki kematangan untuk menghadapi kebaikan orang lain dengan cara yang pantas. Aku membawa luka atau kebingungan yang bukan tanggung jawabmu, tapi aku memperlakukan kamu seolah-olah aku berhak untuk mengabaikan perhatian dan kehangatan yang kamu tunjukkan."
        ]
    },
    {
        title: "Tentang Ketulusanmu",
        content: [
            "Aku ingin kamu tahu bahwa tidak ada yang salah dari caramu bersikap saat itu. Ketulusanmu adalah hal istimewa yang jarang kutemui, dan kegagalanku untuk meresponsnya dengan setimpal adalah murni kekuranganku saat itu, bukan karena ada yang kurang darimu.",
            "Jika ada bagian dari dirimu yang sempat meragukan apakah kamu sudah cukup baik, cukup hangat, atau cukup pantas saat itu, biarkan keraguan itu terhapus. Kamu sudah cukup. Bahkan lebih dari cukup. Aku saja yang belum memiliki kematangan untuk melihat dan membalasnya dengan cara yang seharusnya."
        ]
    },
    {
        title: "Tanpa Tuntutan",
        content: [
            "Aku menyampaikan ini bukan untuk membuka kembali cerita lama atau meminta tempat di hidupmu yang sekarang. Aku tidak mengharapkan balasan atau bahkan pengakuan bahwa kamu masih ingat kejadian tersebut.",
            "Aku harap, jika suatu saat kenangan itu kembali terlintas di benakmu, entah dalam momen refleksi sendiri atau ketika kamu menemukan dirimu meragukan kualitasmu sendiri, kamu tahu bahwa versi dirimu yang dulu tidak kurang dari segi apapun. Kamu adalah sosok yang sempurna. Yang salah adalah caraku menerimanya."
        ]
    },
    {
        title: "Doa Baik",
        content: [
            "Semoga kamu selalu dikelilingi oleh orang-orang yang mampu menghargai ketulusanmu dengan cara yang paling utuh, tanpa membuatmu harus menebak-nebak, tanpa membuatmu merasa berlebihan, dan tanpa membuatmu merasa harus meminta izin untuk menjadi dirimu sendiri, seperti yang mungkin aku lakukan dulu.",
            "Terima kasih sudah memberikan ruang untuk membaca ini. Aku berharap apapun yang terbaik dalam hidup dan masa depan yang sedang kamu perjuangkan saat ini akan menemukan jalannya kepadamu, Salsa."
        ],
        signature: "MF"
    },
    {
        title: "Satu Hal Terakhir",
        content: [
            "Aku tahu, diamku dulu mungkin sempat membuatmu merasa tidak dianggap atau merasa kecil. Itulah alasan kenapa aku menyiapkan sisa ruang di halaman ini. Aku ingin ada sesuatu yang secara jujur mencatat dan merayakan hari-harimu.",
            "Anggap saja ini sebagai caraku mengakui bahwa setiap detik yang kamu jalani itu nyata, penting, dan sangat berharga."
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
                                    <div style={{ marginTop: "4rem", textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                            style={{ fontFamily: "'Crimson Pro', serif", fontSize: "1.1rem", color: "#8a7058", fontStyle: "italic", marginBottom: "-10px", marginRight: "10px" }}
                                        >
                                            Tertanda,
                                        </motion.div>
                                        <svg width="150" height="80" viewBox="0 0 150 80" style={{ overflow: "visible", maxWidth: "100%" }}>
                                            {/* Abstract Flowing Signature "MF" */}
                                            <motion.path
                                                d="M20,50 C20,50 30,10 40,40 C50,70 60,30 70,60 C80,20 90,20 80,50 M70,40 L90,40"
                                                fill="transparent"
                                                stroke="#5a5a5a"
                                                strokeWidth="2.5"
                                                strokeLinecap="round"
                                                initial={{ pathLength: 0, opacity: 0 }}
                                                whileInView={{ pathLength: 1, opacity: 1 }}
                                                viewport={{ once: true, margin: "-50px" }}
                                                transition={{ duration: 2.5, ease: "easeInOut" }}
                                            />
                                            {/* Underline for emphasis */}
                                            <motion.path
                                                d="M10,70 Q75,85 140,60"
                                                fill="transparent"
                                                stroke="#5a5a5a"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                initial={{ pathLength: 0, opacity: 0 }}
                                                whileInView={{ pathLength: 1, opacity: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1, delay: 2, ease: "easeOut" }}
                                            />
                                        </svg>
                                    </div>
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
