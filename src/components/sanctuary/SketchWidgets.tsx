"use client";

import { SketchCard } from "@/components/sanctuary/SketchCard";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const WIDGETS = [
    { label: "Library of Thought", href: "/sanctuary/inner-orbit", desc: "Arsip pikiran random" },
    { label: "Did You Know", href: "/sanctuary/chronosphere", desc: "Kumpulan fakta unik" },
    { label: "Memory Lane", href: "/sanctuary/chronosphere", desc: "Jalan kenangan" }
];

export function SketchWidgets() {
    return (
        <SketchCard title="TEMAN SENGGANGMU">
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {WIDGETS.map((widget, i) => (
                    <Link
                        key={i}
                        href={widget.href}
                        className="group"
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <div style={{
                            border: "1px solid #000",
                            padding: "1rem",
                            transition: "all 0.2s ease",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            background: "#fff"
                        }} className="hover:bg-black hover:text-white">
                            <div>
                                <div style={{ fontWeight: "bold", fontFamily: "var(--font-mono)" }}>{widget.label}</div>
                                <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>{widget.desc}</div>
                            </div>
                            <ArrowUpRight size={16} />
                        </div>
                    </Link>
                ))}
            </div>
        </SketchCard>
    );
}
