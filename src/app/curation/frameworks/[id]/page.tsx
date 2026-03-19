"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Puzzle, Lightbulb, FileText, Info, Edit2, Trash2, Wrench, ScrollText } from "lucide-react";
import { FRAMEWORK_TYPES } from "@/lib/curation-config";
import type { FrameworkEntry } from "@/types/curation";
import { Toaster, toast } from "react-hot-toast";

const TYPE_COLORS: Record<string, string> = {
  "mental-model": "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  "decision-framework": "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "playbook": "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  "principle": "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
};

export default function FrameworkDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [fw, setFw] = useState<FrameworkEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/curation/frameworks/${id}`).then(r => r.json()).then(d => { if (d.data) setFw(d.data); }).catch(() => toast.error("Failed")).finally(() => setLoading(false));
  }, [id]);
  useEffect(() => { fetch("/api/auth").then(r => r.json()).then(d => { if (d.isAdmin) setIsAdmin(true); }).catch(() => {}); }, []);

  const handleDelete = async () => {
    try {
      const r = await fetch(`/api/curation/frameworks/${id}`, { method: "DELETE" });
      if ((await r.json()).success) { toast.success("Deleted"); router.push("/curation/frameworks"); }
    } catch { toast.error("Failed"); }
  };

  if (loading) return <div className="min-h-screen bg-[#fafaf8] dark:bg-[#050505] flex items-center justify-center"><div className="animate-spin w-7 h-7 border-[3px] border-zinc-200 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full" /></div>;
  if (!fw) return (
    <div className="min-h-screen bg-[#fafaf8] dark:bg-[#050505] flex flex-col items-center justify-center gap-4">
      <Puzzle size={48} className="text-zinc-300" />
      <p className="text-zinc-500">Not found</p>
      <Link href="/curation/frameworks" className="text-zinc-900 dark:text-zinc-100 font-bold underline">← Back</Link>
    </div>
  );

  const typeColor = TYPE_COLORS[fw.type] || TYPE_COLORS["mental-model"];
  const typeLabel = FRAMEWORK_TYPES.find(t => t.key === fw.type)?.label || fw.type;

  return (
    <div className="min-h-screen bg-[#fafaf8] dark:bg-[#050505]">
      <Toaster position="bottom-center" toastOptions={{ style: { background: '#1a1a1a', color: '#fff', borderRadius: '100px', fontSize: '14px', fontWeight: '600', padding: '12px 20px' } }} />

      <header className="sticky top-0 z-40 bg-[#fafaf8]/80 dark:bg-[#050505]/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-5 pt-14 pb-4">
          <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"><ArrowLeft size={20} className="text-zinc-900 dark:text-zinc-100" /></button>
          {isAdmin && (
            <button onClick={handleDelete} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 size={16} className="text-zinc-500 hover:text-red-500" /></button>
          )}
        </div>
      </header>

      <motion.main initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="px-5 pb-20">
        {/* Hero */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center mb-5 shadow-sm">
            <Wrench size={32} className="text-zinc-400 dark:text-zinc-500" />
          </div>
          <h1 className="text-[24px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight max-w-sm">{fw.name}</h1>
          <div className="flex items-center gap-2 mt-3">
            <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${typeColor}`}>{typeLabel}</span>
            {fw.category && <span className="text-[12px] font-medium text-zinc-500 dark:text-zinc-400">{fw.category}</span>}
          </div>
        </div>

        {/* Summary */}
        {fw.summary && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mb-6 bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-[0_2px_12px_rgb(0,0,0,0.04)] dark:border dark:border-zinc-800/80">
            <div className="flex items-center gap-2 mb-3"><Info size={16} className="text-blue-500" /><span className="text-[12px] font-bold uppercase tracking-wider text-zinc-400">Summary</span></div>
            <p className="text-[16px] font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">{fw.summary}</p>
          </motion.div>
        )}

        {/* When to Use */}
        {fw.whenToUse && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mb-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-5 border border-amber-200/50 dark:border-amber-800/30">
            <div className="flex items-center gap-2 mb-3"><Lightbulb size={16} className="text-amber-500" /><span className="text-[12px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">When to Use</span></div>
            <div className="text-[15px] text-zinc-700 dark:text-zinc-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: fw.whenToUse }} />
          </motion.div>
        )}

        {/* Content */}
        {fw.content && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="mb-6 bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-[0_2px_12px_rgb(0,0,0,0.04)] dark:border dark:border-zinc-800/80">
            <div className="flex items-center gap-2 mb-3"><FileText size={16} className="text-zinc-400" /><span className="text-[12px] font-bold uppercase tracking-wider text-zinc-400">Deep Dive</span></div>
            <div className="prose prose-zinc dark:prose-invert prose-sm max-w-none text-[15px] leading-relaxed" dangerouslySetInnerHTML={{ __html: fw.content }} />
          </motion.div>
        )}

        {/* Source */}
        {fw.source && (
          <div className="text-center text-[13px] text-zinc-500 dark:text-zinc-400 mt-4">
            Source: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{fw.source}</span>
          </div>
        )}
      </motion.main>
    </div>
  );
}
