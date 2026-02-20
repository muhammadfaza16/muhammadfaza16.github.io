"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AnimatedClockProps {
    size?: number;
    onClick?: () => void;
}

export function AnimatedClock({ size = 24, onClick }: AnimatedClockProps) {
    const pathname = usePathname();
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

    // Calculate rotation angles - use 0 for SSR
    const seconds = time?.getSeconds() ?? 0;
    const minutes = time?.getMinutes() ?? 0;
    const hours = (time?.getHours() ?? 0) % 12;

    const secondDegrees = (seconds / 60) * 360;
    const minuteDegrees = (minutes / 60) * 360 + (seconds / 60) * 6;
    const hourDegrees = (hours / 12) * 360 + (minutes / 60) * 30;

    const isActive = pathname === "/clock";

    // Don't animate until mounted to avoid hydration mismatch
    const shouldAnimate = mounted;

    return (
        <Link
            href="/clock"
            onClick={onClick}
            style={{
                opacity: isActive ? 1 : 0.6,
                transition: "opacity 0.3s ease, transform 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
            className="hover:opacity-100 hover:scale-110"
            title="Time"
        >
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                    filter: isActive ? "drop-shadow(0 0 6px currentColor)" : "none",
                }}
            >
                {/* Clock face */}
                <circle cx="12" cy="12" r="10" />

                {/* Hour markers */}
                <circle cx="12" cy="4" r="0.5" fill="currentColor" stroke="none" />
                <circle cx="20" cy="12" r="0.5" fill="currentColor" stroke="none" />
                <circle cx="12" cy="20" r="0.5" fill="currentColor" stroke="none" />
                <circle cx="4" cy="12" r="0.5" fill="currentColor" stroke="none" />

                {/* Hour hand */}
                <line
                    x1="12"
                    y1="12"
                    x2="12"
                    y2="7.5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{
                        transform: shouldAnimate ? `rotate(${hourDegrees}deg)` : "rotate(0deg)",
                        transformOrigin: "12px 12px",
                        transition: shouldAnimate ? "transform 0.5s cubic-bezier(0.4, 2.3, 0.3, 1)" : "none",
                    }}
                />

                {/* Minute hand */}
                <line
                    x1="12"
                    y1="12"
                    x2="12"
                    y2="5"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    style={{
                        transform: shouldAnimate ? `rotate(${minuteDegrees}deg)` : "rotate(0deg)",
                        transformOrigin: "12px 12px",
                        transition: shouldAnimate ? "transform 0.3s cubic-bezier(0.4, 2.3, 0.3, 1)" : "none",
                    }}
                />

                {/* Second hand */}
                <line
                    x1="12"
                    y1="12"
                    x2="12"
                    y2="4"
                    strokeWidth="0.75"
                    strokeLinecap="round"
                    stroke="var(--accent, #3b82f6)"
                    style={{
                        transform: shouldAnimate ? `rotate(${secondDegrees}deg)` : "rotate(0deg)",
                        transformOrigin: "12px 12px",
                        transition: shouldAnimate ? "transform 0.15s cubic-bezier(0.4, 2.3, 0.3, 1)" : "none",
                    }}
                />

                {/* Center dot */}
                <circle cx="12" cy="12" r="1" fill="currentColor" />
            </svg>
        </Link>
    );
}
