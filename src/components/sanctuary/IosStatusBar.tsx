"use client";

import React, { useState, useEffect } from "react";
import { Battery, Wifi, Signal } from "lucide-react";

export function IosStatusBar() {
    const [time, setTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            // 24h format for simplicity or standard iPhone clock usually just 9:41
            // Let's do 12h no seconds without AM/PM for that clean status bar look, or just HH:mm
            setTime(`${hours % 12 || 12}:${minutes.toString().padStart(2, '0')}`);
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "44px", // Standard iOS status bar height
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 1.5rem",
            fontSize: "14px",
            fontWeight: 600,
            fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
            color: "rgba(255, 255, 255, 0.9)",
            zIndex: 100,
            mixBlendMode: "difference", // Ensures visibility on light/dark backgrounds
        }}>
            {/* Time */}
            <div style={{ width: "60px" }}>
                {time || "9:41"}
            </div>

            {/* Dynamic Island / Notch Placeholder (Optional, just space) */}
            
            {/* Status Icons */}
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <Signal size={16} strokeWidth={2.5} />
                <Wifi size={16} strokeWidth={2.5} />
                <Battery size={20} strokeWidth={2.5} style={{ marginLeft: "2px" }} />
            </div>
        </div>
    );
}
