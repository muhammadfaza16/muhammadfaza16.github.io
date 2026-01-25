"use client";

import { useState } from "react";
import { SketchCard } from "@/components/sanctuary/SketchCard";
import { ChevronRight } from "lucide-react";

const LETTERS = [
    {
        title: "Kecil",
        content: "Kamu terbuat dari debu bintang. Karbon yang sama yang bikin gunung dan lautan, juga ada di dalam kamu.",
        author: "Semesta"
    },
    {
        title: "Ragu",
        content: "Aku udah lihat kamu melewati badai-badai yang bisa hancurin orang lain. Kamu kuat bukan karena nggak ngerasa sakit, tapi karena tetap jalan.",
        author: "Anonim"
    },
    {
        title: "Istirahat",
        content: "Matahari aja terbenam setiap hari. Tidur yang nyenyak, dunia bisa nunggu sampai besok.",
        author: "Malam"
    }
];

export function SketchLetter() {
    const [index, setIndex] = useState(0);

    const next = () => {
        setIndex((prev) => (prev + 1) % LETTERS.length);
    };

    return (
        <SketchCard title="CATATAN DARIKU">
            <div style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "space-between"
            }}>
                <div style={{ minHeight: "180px" }}>
                    <h3 style={{
                        fontFamily: "'Source Serif 4', serif",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        marginBottom: "1rem",
                        textDecoration: "underline",
                        textDecorationThickness: "2px"
                    }}>
                        #{LETTERS[index].title}
                    </h3>
                    <p style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.95rem",
                        lineHeight: 1.6,
                        marginBottom: "1.5rem"
                    }}>
                        {LETTERS[index].content}
                    </p>
                </div>

                <div style={{
                    borderTop: "1px dashed #000",
                    paddingTop: "1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <span style={{ fontSize: "0.8rem", fontFamily: "var(--font-mono)" }}>
                        FROM: {LETTERS[index].author.toUpperCase()}
                    </span>
                    <button
                        onClick={next}
                        style={{
                            background: "#000",
                            color: "#fff",
                            border: "none",
                            borderRadius: "0",
                            padding: "0.25rem 0.75rem",
                            cursor: "pointer",
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.8rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem"
                        }}
                    >
                        NEXT <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </SketchCard>
    );
}
