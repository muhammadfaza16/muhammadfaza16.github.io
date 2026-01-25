"use client";

import { useEffect, useState } from "react";
import { SketchCard } from "@/components/sanctuary/SketchCard";

// Target Date: November 28
const BIRTH_DATE = { month: 10, day: 28 };

export function SketchCountdown() {
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    } | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const currentYear = now.getFullYear();
            let target = new Date(currentYear, BIRTH_DATE.month, BIRTH_DATE.day);

            // If passed, aim for next year
            if (now > target) {
                target = new Date(currentYear + 1, BIRTH_DATE.month, BIRTH_DATE.day);
            }

            const difference = target.getTime() - now.getTime();

            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        };

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        setTimeLeft(calculateTimeLeft());

        return () => clearInterval(timer);
    }, []);

    if (!timeLeft) return null;

    return (
        <SketchCard title="HARI SPESIALMU">
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                textAlign: "center"
            }}>
                <div style={{ border: "2px solid #000", padding: "1rem" }}>
                    <div style={{ fontSize: "2rem", fontWeight: 900, lineHeight: 1 }}>{timeLeft.days}</div>
                    <div style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", marginTop: "0.25rem" }}>HARI</div>
                </div>
                <div style={{ border: "2px solid #000", padding: "1rem" }}>
                    <div style={{ fontSize: "2rem", fontWeight: 900, lineHeight: 1 }}>{timeLeft.hours}</div>
                    <div style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", marginTop: "0.25rem" }}>JAM</div>
                </div>
                <div style={{ border: "2px solid #000", padding: "1rem" }}>
                    <div style={{ fontSize: "2rem", fontWeight: 900, lineHeight: 1 }}>{timeLeft.minutes}</div>
                    <div style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", marginTop: "0.25rem" }}>MENIT</div>
                </div>
                <div style={{ border: "2px solid #000", padding: "1rem" }}>
                    <div style={{ fontSize: "2rem", fontWeight: 900, lineHeight: 1 }}>{timeLeft.seconds}</div>
                    <div style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", marginTop: "0.25rem" }}>DETIK</div>
                </div>
            </div>

            <div style={{
                marginTop: "1.5rem",
                textAlign: "center",
                fontFamily: "'Source Serif 4', serif",
                fontStyle: "italic",
                fontSize: "0.9rem"
            }}>
                "Menghitung mundur menuju perayaan cahayamu."
            </div>
        </SketchCard>
    );
}
