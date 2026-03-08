"use client";

import React from "react";
import { Hammer } from "lucide-react";

export function DevPlaceholder() {
    return (
        <div className="w-full p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col items-center text-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center text-zinc-400 border border-zinc-100 dark:border-zinc-700/50">
                <Hammer size={18} strokeWidth={1.5} />
            </div>
            <div>
                <h3 className="text-[14px] font-medium text-zinc-900 dark:text-zinc-100 mb-1">Dalam Pengembangan</h3>
                <p className="text-[12px] text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[280px]">
                    Fitur ini sedang dalam proses pengerjaan. Akan segera hadir secepat mungkin.
                </p>
            </div>
        </div>
    );
}
