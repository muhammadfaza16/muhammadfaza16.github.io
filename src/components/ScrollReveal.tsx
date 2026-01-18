"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
    children: React.ReactNode;
    threshold?: number; // 0.1 means trigger when 10% visible
    delay?: number; // ms delay before reveal
    className?: string;
}

export function ScrollReveal({
    children,
    threshold = 0.1,
    delay = 0,
    className = ""
}: ScrollRevealProps) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const revealedOnce = useRef(false); // Only animate once

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        // Check if IntersectionObserver is supported (SSR safety)
        if (!("IntersectionObserver" in window)) {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !revealedOnce.current) {
                    revealedOnce.current = true;
                    setTimeout(() => {
                        setIsVisible(true);
                    }, delay);
                    observer.unobserve(element); // Stop observing after reveal
                }
            },
            {
                threshold: threshold,
                rootMargin: "0px 0px -50px 0px" // Trigger slightly before bottom
            }
        );

        observer.observe(element);

        return () => {
            if (element) observer.unobserve(element);
        };
    }, [threshold, delay]);

    return (
        <div
            ref={ref}
            className={`${className} transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${isVisible
                    ? "opacity-100 translate-y-0 filter-none"
                    : "opacity-0 translate-y-12 blur-sm"
                }`}
        >
            {children}
        </div>
    );
}
