"use client";

import React, { useRef, useState } from "react";
import { Camera, X, Clipboard } from "lucide-react";
import { toast } from "react-hot-toast";

const LABEL_CLASS = "text-[11px] font-semibold uppercase tracking-wider text-zinc-400/80 ml-1";

interface ImagePickerProps {
    preview: string | null;
    onSelect: (file: File) => void;
    onClear: () => void;
}

export const ImagePicker = ({ preview, onSelect, onClear }: ImagePickerProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    const handlePaste = (e: React.ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                if (file) { onSelect(file); e.preventDefault(); return; }
            }
        }
    };

    const handleQuickPasteImage = async () => {
        try {
            const items = await navigator.clipboard.read();
            for (const item of items) {
                if (item.types.some(type => type.startsWith('image/'))) {
                    const typeToGet = item.types.includes('image/png') ? 'image/png' : item.types.find(t => t.startsWith('image/'));
                    if (typeToGet) {
                        const blob = await item.getType(typeToGet);
                        const file = new File([blob], `pasted-image-${Date.now()}.${typeToGet.split('/')[1]}`, { type: typeToGet });
                        onSelect(file); toast.success("Image pasted from clipboard"); return;
                    }
                }
            }
            toast.error("No image found in clipboard");
        } catch (err) { toast.error("Clipboard access denied or nothing to paste"); }
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            <label className={LABEL_CLASS}>Cover Image</label>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onSelect(f); e.target.value = ''; }} />
            {preview ? (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                    <button onClick={onClear} className="absolute top-3 right-3 w-9 h-9 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"><X size={16} /></button>
                    <button onClick={() => inputRef.current?.click()} className="absolute bottom-3 right-3 px-4 py-2.5 bg-black/50 backdrop-blur-md rounded-full text-white text-[13px] font-semibold active:scale-95 flex items-center gap-1.5"><Camera size={14} /> Replace</button>
                </div>
            ) : (
                <div tabIndex={0} onPaste={handlePaste} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} className={`w-full aspect-video rounded-2xl border-2 border-dashed bg-gray-50/50 flex items-center justify-center gap-4 transition-all outline-none ${isFocused ? 'border-blue-400 bg-blue-50/30' : 'border-gray-200'}`}>
                    <button onClick={() => inputRef.current?.click()} className="flex flex-col items-center justify-center gap-2 group active:scale-95 transition-transform">
                        <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-zinc-100 flex items-center justify-center group-hover:border-blue-200 group-hover:bg-blue-50 transition-colors"><Camera size={20} className="text-zinc-400 group-hover:text-blue-500" /></div>
                        <span className="text-[12px] font-semibold text-zinc-400">Browse</span>
                    </button>
                    <div className="w-[1px] h-10 bg-zinc-200/60 rounded-full" />
                    <button onClick={handleQuickPasteImage} className="flex flex-col items-center justify-center gap-2 group active:scale-95 transition-transform">
                        <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-zinc-100 flex items-center justify-center group-hover:border-purple-200 group-hover:bg-purple-50 transition-colors"><Clipboard size={20} className="text-zinc-400 group-hover:text-purple-500" /></div>
                        <span className="text-[12px] font-semibold text-zinc-400">Paste Image</span>
                    </button>
                </div>
            )}
        </div>
    );
};
