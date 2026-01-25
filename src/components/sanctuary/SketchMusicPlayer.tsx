"use client";

import { SketchCard } from "@/components/sanctuary/SketchCard";
import { Disc, PlayCircle } from "lucide-react";
import Link from "next/link";
import { CONCERT_SCHEDULE } from "@/data/concert-schedule";

export function SketchMusicPlayer() {
    return (
        <SketchCard title="TEMAN MALAMMU">
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <p style={{
                    fontFamily: "'Source Serif 4', serif",
                    fontStyle: "italic",
                    fontSize: "0.95rem"
                }}>
                    "Pilih frekuensi yang cocok dengan riuh kepalamu malam ini."
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {CONCERT_SCHEDULE.map((concert, i) => (
                        <Link
                            key={concert.id}
                            href={`/sanctuary/concerts/${concert.id}`}
                            style={{ textDecoration: "none", color: "inherit" }}
                            className="group"
                        >
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                                padding: "0.75rem",
                                borderBottom: "1px solid #000",
                                transition: "all 0.2s"
                            }} className="group-hover:pl-4">
                                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", opacity: 0.5 }}>
                                    {(i + 1).toString().padStart(2, '0')}
                                </span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: "bold", fontSize: "1rem" }}>{concert.title}</div>
                                    <div style={{ fontSize: "0.8rem", opacity: 0.7, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "200px" }}>
                                        {concert.description}
                                    </div>
                                </div>
                                <PlayCircle size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </SketchCard>
    );
}
