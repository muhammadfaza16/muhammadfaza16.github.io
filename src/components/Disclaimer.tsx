import React from "react";
import { Info } from "lucide-react";

interface DisclaimerProps {
    title?: string;
    children: React.ReactNode;
}

export function Disclaimer({ title = "Disclaimer", children }: DisclaimerProps) {
    return (
        <div className="flex gap-4 p-5 rounded-xl bg-amber-50/50 border border-amber-200/60 text-amber-900/80">
            <div className="shrink-0 mt-0.5">
                <Info size={20} strokeWidth={2} className="text-amber-600/80" />
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700/70 font-mono">
                    {title}
                </span>
                <p className="font-serif text-lg leading-relaxed opacity-90">
                    {children}
                </p>
            </div>
        </div>
    );
}
