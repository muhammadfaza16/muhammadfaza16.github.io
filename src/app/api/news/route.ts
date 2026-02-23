import { NextResponse } from "next/server";

const RSS_TECH = 'https://news.google.com/rss/search?q=programming+OR+"software+engineering"+OR+"artificial+intelligence"&hl=en-US&gl=US&ceid=US:en';
const RSS_FOOTBALL = 'https://news.google.com/rss/search?q="premier+league"+OR+"champions+league"+OR+"la+liga"&hl=en-US&gl=US&ceid=US:en';

const API_TECH = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_TECH)}`;
const API_FOOTBALL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_FOOTBALL)}`;

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
        const [resTech, resFootball] = await Promise.all([
            fetch(API_TECH, { next: { revalidate: 600 } }),
            fetch(API_FOOTBALL, { next: { revalidate: 600 } })
        ]);

        if (!resTech.ok || !resFootball.ok) throw new Error("RSS fetch failed");

        const dataTech = await resTech.json();
        const dataFootball = await resFootball.json();

        const itemsTech = (dataTech.items || []) as RSSItem[];
        const itemsFootball = (dataFootball.items || []) as RSSItem[];

        // Merge and sort descending by pubDate
        const mergedItems = [...itemsTech, ...itemsFootball].sort((a, b) => {
            return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
        });

        const articles = mergedItems.slice(0, 12).map((item) => {
            const parts = item.title.split(" - ");
            const source = parts.length > 1 ? parts.pop()! : "News";
            const title = parts.join(" - ");

            return {
                title: title.trim(),
                source: source.trim(),
                url: item.link,
                timeAgo: timeAgo(item.pubDate),
                excerpt: item.description ? item.description.replace(/<[^>]*>?/gm, '').substring(0, 150) + "..." : "",
            };
        });

        return NextResponse.json({ articles });
    } catch {
        return NextResponse.json({ articles: [] });
    }
}
