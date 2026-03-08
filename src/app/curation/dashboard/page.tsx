"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/curation/library");
    }, [router]);

    return (
        <div className="min-h-screen bg-[#fafaf8] dark:bg-black flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-zinc-200 border-t-zinc-900 animate-spin" />
        </div>
    );
}
