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
            href="/clock"
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
            className="hover:opacity-70 clock-container"
        >
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <span className="clock-time">{formatTime(time)}</span>
                <span
                    className="clock-hint"
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '0.6rem',
                        whiteSpace: 'nowrap',
                        opacity: 0,
                        transition: 'opacity 0.2s ease',
                        marginTop: '0.2rem',
                        color: 'var(--text-secondary)'
                    }}
                >
                    Memento Mori
                </span>
                <style jsx>{`
                    .clock-container:hover .clock-hint {
                        opacity: 1;
                    }
                `}</style>
            </div>
        </Link>
    );
}
