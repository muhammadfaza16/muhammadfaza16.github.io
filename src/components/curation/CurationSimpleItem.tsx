"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface CurationSimpleItemProps {
    title: string;
    subtitle: string;
    href: string;
    index: number;
    year?: string;
}

export function CurationSimpleItem({ title, subtitle, href, index, year = "2024" }: CurationSimpleItemProps) {
    return (
        <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: 0.5,
                delay: index * 0.05,
                ease: "easeOut"
            }}
            style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                padding: "1.5rem 0",
                borderBottom: "1px solid var(--glass-border, rgba(255, 255, 255, 0.1))",
                textDecoration: "none",
                color: "inherit",
                cursor: "pointer",
                width: "100%"
            }}
            className="group"
        >
            <div style={{ paddingRight: "1rem" }}>
                <span style={{
                    display: "block",
                    fontSize: "0.75rem",
                    color: "var(--ink-muted, rgba(255, 255, 255, 0.5))",
                    marginBottom: "0.25rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    fontFamily: "var(--font-mono)"
                }}>
                    {subtitle}
                </span>
                <h3 style={{
                    fontSize: "clamp(1.1rem, 3vw, 1.25rem)",
                    fontWeight: 400,
                    margin: 0,
                    lineHeight: 1.4,
                    color: "var(--ink-primary, rgba(255, 255, 255, 0.9))",
                    fontFamily: "var(--font-sans)"
                }} className="group-hover:text-white transition-colors">
                    {title}
                </h3>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
                {year && (
                    <span style={{
                        fontSize: "0.85rem",
                        color: "var(--ink-muted, rgba(255, 255, 255, 0.3))",
                        fontFamily: "var(--font-mono)",
                        display: "none" // Hidden on smallest mobile, shown on larger
                    }} className="md:block">
                        {year}
                    </span>
                )}
                <ArrowUpRight
                    size={18}
                    color="var(--ink-muted, rgba(255,255,255,0.4))"
                    style={{ transition: "transform 0.2s ease, opacity 0.2s ease" }}
                    className="group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white"
                />
            </div>

            {/* Global style for hiding year on mobile if needed (using Tailwind usually, but inline fallback here) */}
            <style jsx>{`
                @media (min-width: 640px) {
                    .md\\:block { display: block !important; }
                }
            `}</style>
        </motion.a>
    );
}
