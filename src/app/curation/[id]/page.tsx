"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

type Article = {
    id: string;
    title: string;
    content: string;
    coverImage: string | null;
    createdAt: string;
    isRead: boolean;
};

export default function CurationReaderPage() {
    const params = useParams();
    const router = useRouter();
    const [article, setArticle] = useState<Article | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!params.id) return;

        fetch(`/api/curation/${params.id}`)
            .then(res => {
                if (!res.ok) throw new Error("Article not found");
                return res.json();
            })
            .then(data => setArticle(data))
            .catch(() => router.push('/curation'))
            .finally(() => setIsLoading(false));
    }, [params.id, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-neutral-800 border-t-white rounded-full animate-spin"></div>
                    <p className="text-neutral-500 font-medium">Fetching deep dive...</p>
                </div>
            </div>
        );
    }

    if (!article) return null;

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black pb-24">
            {/* Header / Hero */}
            <div className="w-full relative bg-neutral-950 border-b border-neutral-900">
                {article.coverImage && (
                    <div className="absolute inset-0 z-0 opacity-40">
                        <img src={article.coverImage} alt="Cover" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                    </div>
                )}

                <div className="relative z-10 max-w-3xl mx-auto px-6 pt-12 pb-16 md:pt-24 md:pb-24">
                    <Link href="/curation" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8 md:mb-12 text-sm font-medium bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-neutral-800">
                        <ArrowLeft size={16} /> Back to Curation
                    </Link>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6 drop-shadow-lg">
                        {article.title}
                    </h1>

                    <div className="flex items-center gap-4 text-neutral-400 font-medium text-sm">
                        <span className="flex items-center gap-1.5 bg-neutral-900/80 px-3 py-1.5 rounded-md border border-neutral-800">
                            <Clock size={14} />
                            {new Date(article.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Markdown Content rendered via Tailwind Typography */}
            <main className="max-w-3xl mx-auto px-6 pt-12">
                <article className="prose prose-invert prose-lg md:prose-xl prose-neutral max-w-none
                    prose-headings:font-bold prose-headings:tracking-tight
                    prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-a:transition-colors
                    prose-img:rounded-2xl prose-img:border prose-img:border-neutral-800 prose-img:shadow-2xl
                    prose-hr:border-neutral-800
                    prose-blockquote:border-l-white prose-blockquote:bg-neutral-900/50 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:rounded-r-xl prose-blockquote:not-italic
                    prose-code:text-neutral-300 prose-code:bg-neutral-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                    prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800">
                    <ReactMarkdown>{article.content}</ReactMarkdown>
                </article>
            </main>
        </div>
    );
}
