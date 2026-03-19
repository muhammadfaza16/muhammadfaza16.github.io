"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface AtlasMenuItem {
  label: string;
  href: string;
}

interface AtlasMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: AtlasMenuItem[];
}

export function AtlasMenu({ isOpen, onClose, items }: AtlasMenuProps) {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-[#fafaf8]/98 dark:bg-[#050505]/98 backdrop-blur-3xl flex flex-col pt-14"
          onClick={onClose}
        >
          <nav className="flex-1 px-10 flex flex-col pt-[14vh] gap-4" onClick={(e) => e.stopPropagation()}>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 mb-10 opacity-60">
              Knowledge Archives
            </p>
            {items.map((v, i) => (
              <motion.div
                key={v.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-center gap-6 py-1">
                  <span className="text-[10px] font-bold text-zinc-300 dark:text-zinc-700 tabular-nums w-6">
                    0{i + 1}
                  </span>
                  <span
                    className="text-[28px] md:text-[40px] font-light tracking-tight text-zinc-900 dark:text-zinc-100"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {v.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
