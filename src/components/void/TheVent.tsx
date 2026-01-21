"use client";

import { useState, useRef, useEffect } from "react";
import { Terminal, Send } from "lucide-react";

export function TheVent() {
    const [lines, setLines] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user line
        const newLine = `user@void:~$ ${input}`;

        // Process command (fake) or just log it
        // Logic: If they type "clear" or "forget", clear logic.
        // Otherwise, just log it and eventually "fade" it.

        let response = "";
        if (input.trim() === "clear") {
            setLines([]);
            setInput("");
            return;
        } else {
            response = `> packet received. dissolving into void... [OK]`;
        }

        setLines(prev => [...prev, newLine, response]);
        setInput("");

        // Auto scroll
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    };

    return (
        <div className="bg-black p-6 rounded-xl border border-red-900/20 font-mono text-sm min-h-[400px] flex flex-col">
            <div className="flex items-center gap-2 text-red-900/50 mb-4 border-b border-red-900/10 pb-2">
                <Terminal className="w-4 h-4" />
                <span>/bin/vent_stream</span>
            </div>

            {/* Terminal Output */}
            <div className="flex-1 overflow-y-auto space-y-2 mb-4 scrollbar-hide text-red-500/80">
                <div className="opacity-50">
                    System initialized. <br />
                    Input stream ready. Use this space for unstructured dumps. <br />
                    Type 'clear' to purge memory.
                </div>

                {lines.map((line, i) => (
                    <div key={i} className={`break-words ${line.startsWith('>') ? 'opacity-30 italic' : ''}`}>
                        {line}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex gap-2">
                <span className="text-red-500 animate-pulse">$</span>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-red-500 placeholder-red-900/30"
                    placeholder="echo 'your_thoughts' > /dev/null"
                    autoFocus
                />
            </form>
        </div>
    );
}
