"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { usePathname } from "next/navigation";

interface StandardBackButtonProps {
    href?: string;
    label?: string; // Optional label (e.g. "Back") but usually icon-only for this style
    className?: string;
}

export function StandardBackButton({ href, label, className = "" }: StandardBackButtonProps) {
    const pathname = usePathname();

    // Default fallback: if in a sub-page of starlight, go back to starlight
    // If href is provided, use it.
    const targetHref = href || "/starlight";

    return (
        <div style={{
            position: "fixed",
            top: "24px",
            left: "24px",
            zIndex: 50 // High z-index to sit above content
        }} className={className}>
            <Link
                href={targetHref}
                aria-label="Go Back"
                style={{
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(12px)",
                    borderRadius: "50%",
                    color: "white",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    textDecoration: "none"
                }}
                className="hover:scale-110 active:scale-95 group hover:bg-white/10"
            >
                <ChevronLeft size={22} className="group-hover:-translate-x-0.5 transition-transform" />
            </Link>
        </div>
    );
}
