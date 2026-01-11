"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface DigitalClockProps {
    onClick?: () => void;
}

export function DigitalClock({ onClick }: DigitalClockProps) {
    const [mounted, setMounted] = useState(false);
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        setMounted(true);
        setTime(new Date());

        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!mounted || !time) {
        return (
            <div style={{ height: "2rem" }} />
        );
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        }).replace(/\./g, ":");
    };

    return (
        <Link
            href="/time"
            onClick={onClick}
            style={{
                fontFamily: "var(--font-mono)",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--foreground)",
                marginBottom: "1rem",
                textAlign: "center",
                cursor: "pointer",
                display: "block",
                textDecoration: "none",
                transition: "opacity 0.2s ease"
            }}
            className="hover:opacity-70"
        >
            {formatTime(time)}
        </Link>
    );
}
