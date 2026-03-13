"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export const BottomSheet = ({ isOpen, onClose, title, children, footer }: BottomSheetProps) => (
    <AnimatePresence>
        {isOpen && (
            <>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/25 z-[60] backdrop-blur-sm"
                />
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 28, stiffness: 260 }}
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={0.15}
                    onDragEnd={(_, { offset, velocity }) => {
                        if (offset.y > 100 || velocity.y > 500) onClose();
                    }}
                    className="fixed bottom-0 left-0 right-0 h-[88vh] bg-white rounded-t-[2rem] z-[70] flex flex-col shadow-[0_-8px_40px_rgba(0,0,0,0.1)] max-w-2xl mx-auto"
                >
                    <div className="w-full flex justify-center py-4 shrink-0 cursor-grab active:cursor-grabbing">
                        <div className="w-8 h-[4px] bg-zinc-200 rounded-full" />
                    </div>
                    <div className="px-6 pb-2 shrink-0">
                        <h2 className="text-[20px] font-semibold text-zinc-900 tracking-tight">{title}</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto px-6 pb-6 pt-1 flex flex-col gap-4 no-scrollbar">
                        {children}
                    </div>
                    {footer && (
                        <div className="shrink-0 px-6 pb-6 pt-4 bg-white border-t border-zinc-100">{footer}</div>
                    )}
                </motion.div>
            </>
        )}
    </AnimatePresence>
);
