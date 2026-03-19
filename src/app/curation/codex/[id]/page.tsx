"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ScrollText, FileText, Trash2, Calendar } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { CODEX_STATUSES } from "@/lib/curation-config";
import type { CodexEntry } from "@/types/curation";
import { Toaster, toast } from "react-hot-toast";

const STATUS_STYLE: Record<string, { color: string }> = {
  evolving: { color: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  solidified: { color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
  deprecated: { color: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400" },
};

export default function CodexDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [entry, setEntry] = useState<CodexEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/curation/codex/${id}`).then(r => r.json()).then(d => { if (d.data) setEntry(d.data); }).catch(() => toast.error("Failed")).finally(() => setLoading(false));
  }, [id]);
  useEffect(() => { fetch("/api/auth").then(r => r.json()).then(d => { if (d.isAdmin) setIsAdmin(true); }).catch(() => {}); }, []);

  const handleDelete = async () => {
    try {
      const r = await fetch(`/api/curation/codex/${id}`, { method: "DELETE" });
      if ((await r.json()).success) { toast.success("Deleted"); router.push("/curation/codex"); }
    } catch { toast.error("Failed"); }
  };

  if (loading) return <div className="min-h-screen bg-[#fafaf8] dark:bg-[#050505] flex items-center justify-center"><div className="animate-spin w-7 h-7 border-[3px] border-zinc-200 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full" /></div>;
  if (!entry) return <div className="min-h-screen bg-[#fafaf8] dark:bg-[#050505] flex flex-col items-center justify-center gap-4"><ScrollText size={48} className="text-zinc-300" /><p className="text-zinc-500">Not found</p></div>;

  const ss = STATUS_STYLE[entry.status] || STATUS_STYLE.evolving;
  const statusLabel = CODEX_STATUSES.find(s => s.key === entry.status)?.label || entry.status;
  const createdDate = new Date(entry.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

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
          <div className="w-16 h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center mb-4 border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <ScrollText size={32} className="text-zinc-400" />
          </div>
          <h1 className="text-[26px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight max-w-sm">{entry.title}</h1>

          <div className="flex items-center gap-2 mt-4">
            <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${ss.color}`}>{statusLabel}</span>
            {entry.domain && <span className="text-[12px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{entry.domain}</span>}
          </div>

          {entry.category && (
            <span className="mt-2 text-[12px] text-zinc-500 dark:text-zinc-400">{entry.category}</span>
          )}
        </div>

        {/* Conviction Statement — the hero element */}
        {entry.conviction && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-100 dark:to-zinc-200 rounded-2xl" />
            <div className="relative p-6 text-center">
              <p className="text-[18px] font-bold text-white dark:text-zinc-900 leading-relaxed italic">
                &ldquo;{entry.conviction}&rdquo;
              </p>
            </div>
          </motion.div>
        )}

        {/* Full Doctrine */}
        {entry.content && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="mb-6 bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-[0_2px_12px_rgb(0,0,0,0.04)] dark:border dark:border-zinc-800/80">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={16} className="text-zinc-400" />
              <span className="text-[12px] font-bold uppercase tracking-wider text-zinc-400">Doctrine</span>
            </div>
            <div className="prose prose-zinc dark:prose-invert prose-sm max-w-none text-[15px] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: entry.content }} />
          </motion.div>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-center gap-1.5 text-[13px] text-zinc-400 dark:text-zinc-500 mt-6">
          <Calendar size={14} />
          <span>Inscribed {createdDate}</span>
        </div>
      </motion.main>
    </div>
  );
}
