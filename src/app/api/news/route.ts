import { NextResponse } from "next/server";

// Google News Indonesia RSS → JSON via rss2json (free, no key, 10k/day)
const RSS_URL = "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFZxYUdjU0FtVnVHZ0pWVXlnQVAB?hl=id&gl=ID&ceid=ID:id";
const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

interface RSSItem {
    title: string;
    link: string;
    pubDate: string;
    author: string;
    description: string;
}

function timeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

export async function GET() {
    try {
        const res = await fetch(API_URL, { next: { revalidate: 600 } });
        if (!res.ok) throw new Error("RSS fetch failed");

        const data = await res.json();
        const items = (data.items || []) as RSSItem[];

        const articles = items.slice(0, 12).map((item) => {
            // Extract source from title (Google News format: "Title - Source")
            const parts = item.title.split(" - ");
            const source = parts.length > 1 ? parts.pop()! : "News";
            const title = parts.join(" - ");

            return {
                title: title.trim(),
                source: source.trim(),
                url: item.link,
                timeAgo: timeAgo(item.pubDate),
            };
        });

        return NextResponse.json({ articles });
    } catch {
        return NextResponse.json({ articles: [] });
    }
}
