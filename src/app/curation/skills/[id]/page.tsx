"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Swords, ExternalLink, Edit2, Trash2 } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { DIFFICULTY_LEVELS } from "@/lib/curation-config";
import type { SkillEntry } from "@/types/curation";
import { Toaster, toast } from "react-hot-toast";

const DIFF_COLORS: Record<string, string> = {
  beginner: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  intermediate: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  advanced: "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
};

export default function SkillDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [skill, setSkill] = useState<SkillEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/curation/skills/${id}`).then(r => r.json()).then(d => { if (d.data) setSkill(d.data); }).catch(() => toast.error("Failed")).finally(() => setLoading(false));
  }, [id]);
  useEffect(() => { fetch("/api/auth").then(r => r.json()).then(d => { if (d.isAdmin) setIsAdmin(true); }).catch(() => {}); }, []);

  const handleDelete = async () => {
    try {
      const r = await fetch(`/api/curation/skills/${id}`, { method: "DELETE" });
      if ((await r.json()).success) { toast.success("Deleted"); router.push("/curation/skills"); }
    } catch { toast.error("Failed"); }
  };

  if (loading) return <div className="min-h-screen bg-[#fafaf8] dark:bg-[#050505] flex items-center justify-center"><div className="animate-spin w-7 h-7 border-[3px] border-zinc-200 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full" /></div>;
  if (!skill) return <div className="min-h-screen bg-[#fafaf8] dark:bg-[#050505] flex flex-col items-center justify-center gap-4"><Swords size={48} className="text-zinc-300" /><p className="text-zinc-500">Not found</p></div>;

  const readTime = skill.content ? Math.max(1, Math.ceil(skill.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200)) : null;

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
        {skill.imageUrl && (
          <div className="w-full aspect-video rounded-2xl overflow-hidden mb-6 shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={skill.imageUrl} alt={skill.title} className="w-full h-full object-cover" />
          </div>
        )}

        <h1 className="text-[24px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight mb-3">{skill.title}</h1>

        <div className="flex items-center gap-2 flex-wrap mb-6">
          {skill.difficulty && <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${DIFF_COLORS[skill.difficulty] || "bg-zinc-100 text-zinc-500"}`}>{skill.difficulty}</span>}
          {skill.sourceType && <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">{skill.sourceType}</span>}
          {skill.category && <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">{skill.category}</span>}
          {readTime && <span className="text-[11px] text-zinc-400">· {readTime} min read</span>}
        </div>

        {skill.source && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-zinc-100/80 dark:bg-zinc-800/50 text-[13px] text-zinc-500 dark:text-zinc-400">
            Source: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{skill.source}</span>
          </div>
        )}

        {skill.content && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-[0_2px_12px_rgb(0,0,0,0.04)] dark:border dark:border-zinc-800/80">
            <div className="prose prose-zinc dark:prose-invert prose-sm max-w-none text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300"
              dangerouslySetInnerHTML={{ __html: skill.content }} />
          </div>
        )}

        {skill.url && (
          <a href={skill.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-4 mt-6 text-[14px] font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            <ExternalLink size={16} /> View original source
          </a>
        )}
      </motion.main>
    </div>
  );
}
