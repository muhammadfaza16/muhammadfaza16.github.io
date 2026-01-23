"use client";

import { useSanctuary } from "@/components/sanctuary/SanctuaryContext";
import { ConcertCard } from "@/components/sanctuary/concert/ConcertCard";
import { CONCERT_SCHEDULE } from "@/data/concert-schedule";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function ConcertLobbyPage() {
    const { setMood } = useSanctuary();

    // Reset mood on enter
    useEffect(() => {
        setMood(null);
    }, [setMood]);

    return (
        <div style={{
            minHeight: "100vh",
            padding: "3rem 1.5rem",
            maxWidth: "80rem",
            margin: "0 auto",
            position: "relative",
            zIndex: 10,
            animation: "fadeIn 0.5s ease-out"
        }}>
            {/* Nav */}
            <Link
                href="/sanctuary"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '3rem',
                    transition: 'color 0.2s',
                    textDecoration: 'none'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
                <ArrowLeft style={{ width: '1rem', height: '1rem' }} />
                <span style={{ fontSize: '0.875rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Back to Sanctuary
                </span>
            </Link>

            {/* Header */}
            <header style={{ marginBottom: '4rem' }}>
                <h1 style={{
                    fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
                    fontFamily: "'Playfair Display', serif",
                    color: 'var(--foreground)',
                    marginBottom: '1rem'
                }}>
                    The Stage
                </h1>
                <p style={{
                    fontSize: '1.125rem',
                    color: 'var(--text-secondary)',
                    maxWidth: '42rem',
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: 'italic'
                }}>
                    "Tempat di mana lagu bukan cuma didengerin, tapi dirasain. Datang pas jam main, ya."
                </p>
            </header>

            {/* Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem'
            }}>
                {CONCERT_SCHEDULE.map((concert) => (
                    <ConcertCard key={concert.id} concert={concert} />
                ))}
            </div>

            {/* Empty State if needed */}
            {CONCERT_SCHEDULE.length === 0 && (
                <div style={{ textAlign: 'center', padding: '5rem 0', opacity: 0.5 }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        No scheduled events yet.
                    </p>
                </div>
            )}
        </div>
    );
}
