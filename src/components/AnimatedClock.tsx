"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AnimatedClock() {
    const pathname = usePathname();
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Calculate rotation angles
    const seconds = time.getSeconds();
    const minutes = time.getMinutes();
    const hours = time.getHours() % 12;

    const secondDegrees = (seconds / 60) * 360;
    const minuteDegrees = (minutes / 60) * 360 + (seconds / 60) * 6;
    const hourDegrees = (hours / 12) * 360 + (minutes / 60) * 30;

    const isActive = pathname === "/time";

    return (
        <Link
            href="/time"
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
                width="32"
                height="32"
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
                        transform: `rotate(${hourDegrees}deg)`,
                        transformOrigin: "12px 12px",
                        transition: "transform 0.5s cubic-bezier(0.4, 2.3, 0.3, 1)",
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
                        transform: `rotate(${minuteDegrees}deg)`,
                        transformOrigin: "12px 12px",
                        transition: "transform 0.3s cubic-bezier(0.4, 2.3, 0.3, 1)",
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
                        transform: `rotate(${secondDegrees}deg)`,
                        transformOrigin: "12px 12px",
                        transition: "transform 0.15s cubic-bezier(0.4, 2.3, 0.3, 1)",
                    }}
                />

                {/* Center dot */}
                <circle cx="12" cy="12" r="1" fill="currentColor" />
            </svg>
        </Link>
    );
}
