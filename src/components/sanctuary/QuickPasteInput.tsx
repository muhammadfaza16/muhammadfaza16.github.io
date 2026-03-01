"use client";

import React from "react";
import { Clipboard } from "lucide-react";
import { toast } from "react-hot-toast";

const INPUT_CLASS = "w-full bg-gray-50 rounded-2xl h-13 px-5 py-3.5 text-[16px] font-semibold text-zinc-900 border border-transparent outline-none focus:bg-white focus:border-zinc-200 focus:shadow-sm transition-all placeholder:text-zinc-400 placeholder:font-medium";

interface QuickPasteInputProps {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    type?: string;
}

export const QuickPasteInput = ({ value, onChange, placeholder, type = "text" }: QuickPasteInputProps) => {
    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) { onChange(text); toast.success("Pasted", { icon: "📋", duration: 1500 }); }
            else toast.error("Clipboard is empty");
        } catch (err) { toast.error("Clipboard access denied"); }
    };
    return (
        <div className="relative w-full">
            <input value={value} onChange={e => onChange(e.target.value)} type={type} placeholder={placeholder} className={`${INPUT_CLASS} pr-12`} />
            <button type="button" onClick={handlePaste} tabIndex={-1} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 active:scale-90 transition-all rounded-lg" title="Paste from clipboard">
                <Clipboard size={18} strokeWidth={2.5} />
            </button>
        </div>
    );
};
