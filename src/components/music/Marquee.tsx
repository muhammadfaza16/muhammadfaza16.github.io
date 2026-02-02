"use client";

import React, { memo, useRef, useEffect } from "react";
import { FixedWidthText } from "./helpers";

// Individual Marquee Item with Visibility Tracking (Memoized)
export const MarqueeItem = memo(function MarqueeItem({ item, id, onVisibilityChange }: {
    item: { icon: React.ReactNode; label: string; text: string; width?: string; labelWidth?: string; onClick?: () => void; className?: string };
    id: string;
    onVisibilityChange: (id: string, isVisible: boolean) => void;
}) {
    const itemRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Only observe "Checking in" items
        if (item.label !== "Checking in") return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                onVisibilityChange(id, entry.isIntersecting);
            },
            { threshold: 0 }
        );

        if (itemRef.current) {
            observer.observe(itemRef.current);
        }

        return () => observer.disconnect();
    }, [id, item.label, onVisibilityChange]);

    return (
        <div
            ref={itemRef}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                userSelect: "none",
                cursor: item.onClick ? "pointer" : "default",
                opacity: 0.9,
                transition: "opacity 0.2s"
            }}
            onClick={item.onClick}
            className={item.className}
        >
            <span style={{ color: "var(--accent)" }}>{item.icon}</span>
            <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                opacity: 0.7,
                display: "inline-block", // Required for width
                width: item.labelWidth || "auto", // Fixed label width
                textAlign: "left"
            }}>
                {item.label}:
            </span>
            <FixedWidthText
                text={item.text}
                width={item.width || "auto"}
                className={item.className}
            />
        </div >
    );
});

// Helper for the continuous marquee (Memoized)
export const ContinuousMarquee = memo(function ContinuousMarquee({ items, onVisibilityChange }: {
    items: { icon: React.ReactNode; label: string; text: string; width?: string; labelWidth?: string; onClick?: () => void; className?: string }[];
    onVisibilityChange: (id: string, isVisible: boolean) => void;
    narrativeText?: string; // Trigger update on text change
}) {
    // Force re-render/animate when narrativeText changes if needed.
    // Since 'items' will change, this is handled by React defaut.
    return (
        <div style={{
            display: "flex",
            overflow: "hidden",
            width: "100%",
            maskImage: "linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)"
        }}>
            {[0, 1].map((key) => ( // Reduced from 4 to 2 for performance (minimum for seamless loop)
                <div
                    key={key}
                    style={{
                        display: "flex",
                        gap: "1.25rem",
                        animation: "marquee 25s linear infinite",
                        paddingRight: "1.25rem",
                        flexShrink: 0,
                        transform: "translate3d(0, 0, 0)",
                        willChange: "transform",
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden"
                    }}
                >
                    {items.map((item, i) => (
                        <MarqueeItem
                            key={`${key}-${i}`}
                            id={`${key}-${i}`}
                            item={item}
                            onVisibilityChange={onVisibilityChange}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
});
