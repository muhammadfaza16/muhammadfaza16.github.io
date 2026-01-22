"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Check, Info, AlertCircle, Sparkles } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utility ---
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// --- Types ---
export type ToastType = "success" | "error" | "info" | "cosmic";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    toast: (message: string, type?: ToastType) => void;
}

// --- Context ---
const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}

// --- Provider ---
export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback((message: string, type: ToastType = "info") => {
        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto dismiss
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((t) => (
                        <ToastItem key={t.id} toast={t} onDismiss={removeToast} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

// --- Component ---
function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
    const icons = {
        success: <Check size={18} className="text-emerald-400" />,
        error: <X size={18} className="text-rose-400" />,
        info: <Info size={18} className="text-blue-400" />,
        cosmic: <Sparkles size={18} className="text-amber-300 animate-pulse" />,
    };

    const styles = {
        success: "from-emerald-950/90 to-emerald-900/90 border-emerald-500/20 shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]",
        error: "from-rose-950/90 to-rose-900/90 border-rose-500/20 shadow-[0_0_30px_-5px_rgba(244,63,94,0.3)]",
        info: "from-slate-900/90 to-slate-800/90 border-slate-500/20 shadow-[0_0_30px_-5px_rgba(100,116,139,0.3)]",
        cosmic: "from-indigo-950/90 via-purple-900/90 to-rose-900/90 border-amber-500/30 shadow-[0_0_40px_-10px_rgba(251,191,36,0.4)]",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
            layout
            className={cn(
                "pointer-events-auto relative flex items-center gap-4 px-6 py-4 rounded-2xl border backdrop-blur-md bg-gradient-to-br min-w-[300px] max-w-sm",
                styles[toast.type]
            )}
        >
            <div className="shrink-0 p-2 rounded-full bg-white/5 border border-white/5">
                {icons[toast.type]}
            </div>
            <p className="flex-1 font-serif text-sm text-white/90 leading-relaxed font-light">
                {toast.message}
            </p>
            <button
                onClick={() => onDismiss(toast.id)}
                className="shrink-0 p-1 rounded-full text-white/20 hover:text-white hover:bg-white/10 transition-colors"
            >
                <X size={14} />
            </button>
        </motion.div>
    );
}
