"use client";

import { useState, useEffect, useMemo } from "react";

export function formatTime(date: Date): string {
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

// Helper component for typewriter effect
export function TypewriterText({
    text,
    texts,
    speed = 60,
    deleteSpeed = 30,
    pauseDuration = 2000
}: {
    text?: string;
    texts?: string[];
    speed?: number;
    deleteSpeed?: number;
    pauseDuration?: number
}) {
    const [displayedText, setDisplayedText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [isTypo, setIsTypo] = useState(false);
    const [textIndex, setTextIndex] = useState(0);

    // Normalize input to array
    const textQueue = useMemo(() => texts || (text ? [text] : []), [text, texts]);
    const currentFullText = textQueue[textIndex % textQueue.length] || "";

    // Cursor blinking effect
    const [isCursorVisible, setIsCursorVisible] = useState(true);
    useEffect(() => {
        const cursorTimer = setInterval(() => {
            setIsCursorVisible((prev) => !prev);
        }, 500);
        return () => clearInterval(cursorTimer);
    }, []);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const currentSpeed = isDeleting
            ? deleteSpeed
            : speed + (Math.random() * (speed * 0.5)); // fast variance

        if (isDeleting) {
            // Deleting Phase
            setIsTypo(false);
            if (displayedText.length > 0) {
                timeout = setTimeout(() => {
                    setDisplayedText(currentFullText.substring(0, displayedText.length - 1));
                }, deleteSpeed);
            } else {
                // Done deleting, switch text and restart
                timeout = setTimeout(() => {
                    setIsDeleting(false);
                    setTextIndex((prev) => prev + 1);
                }, 800);
            }
        } else {
            // Typing Phase
            if (isTypo) {
                // Reaction time to realize typo
                timeout = setTimeout(() => {
                    setDisplayedText((prev) => prev.slice(0, -1));
                    setIsTypo(false);
                }, 400);
            } else if (displayedText.length < currentFullText.length) {
                // Chance to make a typo (5%)
                const shouldTypo = Math.random() < 0.05 && displayedText.length > 2 && displayedText.length < currentFullText.length - 3;

                if (shouldTypo) {
                    const keyboard = "abcdefghijklmnopqrstuvwxyz";
                    const randomChar = keyboard.charAt(Math.floor(Math.random() * keyboard.length));
                    timeout = setTimeout(() => {
                        setDisplayedText((prev) => prev + randomChar);
                        setIsTypo(true);
                    }, currentSpeed);
                } else {
                    // Type correct char
                    timeout = setTimeout(() => {
                        setDisplayedText(currentFullText.substring(0, displayedText.length + 1));
                    }, currentSpeed);
                }
            } else {
                // Done typing, wait before deleting
                timeout = setTimeout(() => {
                    setIsDeleting(true);
                }, pauseDuration);
            }
        }

        return () => clearTimeout(timeout);
    }, [displayedText, isDeleting, isTypo, textIndex, textQueue, currentFullText, speed, deleteSpeed, pauseDuration]);

    return (
        <span>
            {displayedText}
            <span style={{
                display: "inline-block",
                width: "2px",
                height: "1em",
                backgroundColor: "currentColor",
                marginLeft: "2px",
                verticalAlign: "middle",
                opacity: isCursorVisible ? 1 : 0,
                transition: "opacity 0.1s"
            }} />
        </span>
    );
}

// Smooth text transition component
// Text component with fixed width constraint to prevent layout shifts
export function FixedWidthText({ text, width, className }: { text: string; width: string; className?: string }) {
    const [displayText, setDisplayText] = useState(text);
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        if (text === displayText) return;

        setOpacity(0);

        const timer = setTimeout(() => {
            setDisplayText(text);
            setOpacity(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [text, displayText]);

    return (
        <span
            className={className}
            style={{
                display: "inline-block",
                width: width,
                minWidth: width,
                maxWidth: width,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                transition: "opacity 0.5s ease-in-out",
                opacity: opacity,
                verticalAlign: "middle",
                textAlign: "left"
            }}
        >
            {displayText}
        </span>
    );
}
