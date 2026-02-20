"use client";
import React from 'react';

export function MeshGradient({ timeOfDay }: { timeOfDay: 'morning' | 'afternoon' | 'evening' }) {
    // Beautiful, premium fluid mesh gradients
    const gradients = {
        morning: 'radial-gradient(at 0% 0%, hsla(347,89%,84%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(208,98%,82%,1) 0, transparent 50%), radial-gradient(at 100% 100%, hsla(43,100%,85%,1) 0, transparent 50%), radial-gradient(at 0% 100%, hsla(273,83%,84%,1) 0, transparent 50%)',
        afternoon: 'radial-gradient(at 0% 0%, hsla(213,100%,78%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(185,100%,80%,1) 0, transparent 50%), radial-gradient(at 100% 100%, hsla(263,90%,85%,1) 0, transparent 50%), radial-gradient(at 0% 100%, hsla(220,95%,75%,1) 0, transparent 50%)',
        evening: 'radial-gradient(at 0% 0%, hsla(253,88%,14%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(280,81%,20%,1) 0, transparent 50%), radial-gradient(at 100% 100%, hsla(220,100%,15%,1) 0, transparent 50%), radial-gradient(at 0% 100%, hsla(293,73%,12%,1) 0, transparent 50%)'
    };

    const baseColors = {
        morning: '#fff5f5',
        afternoon: '#f0f9ff',
        evening: '#080c14'
    };

    return (
        <div style={{
            position: "fixed",
            inset: 0,
            backgroundColor: baseColors[timeOfDay],
            backgroundImage: gradients[timeOfDay],
            transition: "all 3s ease-in-out",
            zIndex: -2,
            overflow: "hidden"
        }}>
            {/* Animated fluid overlay 1 */}
            <div
                className="animate-spin-slow"
                style={{
                    position: "absolute",
                    inset: "-50%",
                    backgroundImage: timeOfDay === 'evening'
                        ? "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 40%)"
                        : "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, transparent 40%)",
                    transition: "all 3s ease-in-out",
                }}
            />
            {/* Animated fluid overlay 2 */}
            <div
                className="animate-reverse-spin-slower"
                style={{
                    position: "absolute",
                    inset: "-50%",
                    backgroundImage: timeOfDay === 'evening'
                        ? "radial-gradient(circle at 70% 30%, rgba(138,43,226,0.15) 0%, transparent 40%)"
                        : "radial-gradient(circle at 70% 30%, rgba(255,192,203,0.4) 0%, transparent 40%)",
                    transition: "all 3s ease-in-out",
                }}
            />
            {/* Noise texture for realism (Frosted Glass base) */}
            <div style={{
                position: "absolute",
                inset: 0,
                opacity: timeOfDay === 'evening' ? 0.35 : 0.45,
                mixBlendMode: timeOfDay === 'evening' ? "soft-light" : "overlay",
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                pointerEvents: "none",
            }} />
        </div>
    );
}
