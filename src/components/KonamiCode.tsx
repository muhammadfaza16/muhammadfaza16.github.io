"use client";

import { useEffect, useState, useCallback } from "react";

const KONAMI_CODE = [
    "ArrowUp", "ArrowUp",
    "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight",
    "ArrowLeft", "ArrowRight",
    "KeyB", "KeyA"
];

export function KonamiCode() {
    const [keySequence, setKeySequence] = useState<string[]>([]);
    const [triggered, setTriggered] = useState(false);

    const createConfetti = useCallback(() => {
        const colors = ["#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3", "#54a0ff", "#5f27cd"];
        const container = document.createElement("div");
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            overflow: hidden;
        `;
        document.body.appendChild(container);

        // Create confetti particles
        for (let i = 0; i < 150; i++) {
            const confetti = document.createElement("div");
            const color = colors[Math.floor(Math.random() * colors.length)];
            const left = Math.random() * 100;
            const delay = Math.random() * 0.5;
            const duration = 2 + Math.random() * 2;
            const size = 8 + Math.random() * 8;

            confetti.style.cssText = `
                position: absolute;
                top: -20px;
                left: ${left}%;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
                animation: confettiFall ${duration}s ease-out ${delay}s forwards;
                transform: rotate(${Math.random() * 360}deg);
            `;
            container.appendChild(confetti);
        }

        // Add CSS animation
        const style = document.createElement("style");
        style.textContent = `
            @keyframes confettiFall {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        // Cleanup after animation
        setTimeout(() => {
            container.remove();
            style.remove();
        }, 5000);
    }, []);

    const showMessage = useCallback(() => {
        const message = document.createElement("div");
        message.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 2rem 3rem;
                border-radius: 16px;
                font-size: 1.5rem;
                font-weight: 600;
                text-align: center;
                z-index: 10000;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                animation: messagePopIn 0.5s ease-out;
            ">
                <div style="font-size: 3rem; margin-bottom: 0.5rem;">🎮</div>
                <div>You found the secret!</div>
                <div style="font-size: 0.875rem; opacity: 0.8; margin-top: 0.5rem;">
                    - The Broken Wanderer
                </div>
            </div>
        `;

        const style = document.createElement("style");
        style.textContent = `
            @keyframes messagePopIn {
                0% {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 0;
                }
                50% {
                    transform: translate(-50%, -50%) scale(1.1);
                }
                100% {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(message);

        // Remove after 3 seconds
        setTimeout(() => {
            message.style.transition = "opacity 0.5s ease-out";
            message.style.opacity = "0";
            setTimeout(() => {
                message.remove();
                style.remove();
            }, 500);
        }, 3000);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const newSequence = [...keySequence, e.code].slice(-KONAMI_CODE.length);
            setKeySequence(newSequence);

            // Check if sequence matches
            if (newSequence.length === KONAMI_CODE.length &&
                newSequence.every((key, i) => key === KONAMI_CODE[i]) &&
                !triggered) {
                setTriggered(true);
                createConfetti();
                showMessage();

                // Reset after 5 seconds to allow re-trigger
                setTimeout(() => {
                    setTriggered(false);
                    setKeySequence([]);
                }, 5000);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [keySequence, triggered, createConfetti, showMessage]);

    return null; // This component doesn't render anything
}
