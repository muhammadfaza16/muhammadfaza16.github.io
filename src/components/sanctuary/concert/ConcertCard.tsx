"use client";

import { ConcertEvent } from "@/data/concert-schedule";
import { GlassCard } from "@/components/sanctuary/ui/GlassCard";
import { Calendar, Clock, Ticket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function ConcertCard({ concert }: { concert: ConcertEvent }) {
    const router = useRouter();
    const [status, setStatus] = useState<'upcoming' | 'live' | 'ended'>('upcoming');
    const [timeLeft, setTimeLeft] = useState("");
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const checkStatus = () => {
            const now = new Date();
            // Parse concert date/time
            const start = new Date(`${concert.date}T${concert.window.start}:00`);
            const end = new Date(`${concert.date}T${concert.window.end}:59`);

            if (now > end) {
                setStatus('ended');
            } else if (now >= start && now <= end) {
                setStatus('live');
            } else {
                setStatus('upcoming');
                // Calculate time left if today
                const diff = start.getTime() - now.getTime();
                if (diff < 86400000 && diff > 0) { // Less than 24h
                    const hours = Math.floor(diff / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    setTimeLeft(`${hours}h ${minutes}m to start`);
                } else {
                    setTimeLeft("");
                }
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [concert]);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.5s ease',
                transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                minHeight: "300px",
                display: "flex",
                flexDirection: "column",
                border: status === 'live' ? `1px solid ${concert.theme.accent}` : '1px solid rgba(255,255,255,0.1)',
                boxShadow: status === 'live' ? `0 0 20px ${concert.theme.accent}40` : 'none',
                borderRadius: '1.5rem',
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                cursor: status === 'live' ? 'pointer' : 'default'
            }}
        >
            {/* Background Image / Gradient Placeholder */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 0,
                    opacity: isHovered ? 0.3 : 0.2,
                    transition: 'opacity 0.5s ease',
                    background: `linear-gradient(to bottom right, ${concert.theme.primary}, ${concert.theme.secondary})`
                }}
            />

            {/* Content */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                padding: '1.5rem'
            }}>
                {/* Header Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <span
                        style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontFamily: 'var(--font-mono)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            border: status === 'live' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                            background: status === 'live' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)',
                            color: status === 'live' ? '#fecaca' : 'rgba(255,255,255,0.6)',
                            animation: status === 'live' ? 'pulse 2s infinite' : 'none'
                        }}
                    >
                        {status === 'live' ? '● LIVE NOW' : status === 'ended' ? 'ARCHIVED' : 'UPCOMING'}
                    </span>

                    {timeLeft && (
                        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                            {timeLeft}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h3 style={{
                    fontSize: '1.5rem',
                    lineHeight: '2rem',
                    fontFamily: "'Playfair Display', serif",
                    color: isHovered ? 'var(--accent)' : 'var(--foreground)',
                    marginBottom: '0.5rem',
                    transition: 'color 0.3s ease'
                }}>
                    {concert.title}
                </h3>
                <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '1.5rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {concert.description}
                </p>

                {/* Footer Info */}
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>
                        <Calendar style={{ width: '12px', height: '12px' }} />
                        {new Date(concert.date).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>
                        <Clock style={{ width: '12px', height: '12px' }} />
                        {concert.window.start} - {concert.window.end}
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={() => {
                            if (status === 'live') {
                                router.push(`/sanctuary/concerts/${concert.id}`);
                            }
                        }}
                        disabled={status !== 'live'}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '0.75rem',
                            border: status === 'live' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            fontWeight: 500,
                            transition: 'all 0.3s ease',
                            background: status === 'live' ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                            color: status === 'live' ? 'white' : 'rgba(255,255,255,0.4)',
                            cursor: status === 'live' ? 'pointer' : 'not-allowed',
                            boxShadow: status === 'live' ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : 'none'
                        }}
                    >
                        <Ticket style={{ width: '16px', height: '16px' }} />
                        {status === 'live' ? 'Enter Venue' : status === 'ended' ? 'Event Ended' : 'Doors Closed'}
                    </button>
                    {status === 'upcoming' && (
                        <p style={{ fontSize: '10px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
                            Venue opens at {concert.window.start}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
