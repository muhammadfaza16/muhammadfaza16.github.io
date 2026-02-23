import { NextResponse } from "next/server";

// We use two queries to grab a wider net of pure technical topics
const RSS_SWE = 'https://news.google.com/rss/search?q="software+engineering"+OR+"web+development"+OR+"programming"+-smartphone+-gadget&hl=en-US&gl=US&ceid=US:en';
const RSS_AI = 'https://news.google.com/rss/search?q="artificial+intelligence"+OR+"machine+learning"+OR+"cloud+computing"+-smartphone+-gadget&hl=en-US&gl=US&ceid=US:en';

const API_SWE = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_SWE)}`;
const API_AI = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_AI)}`;

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
        const [resSwe, resAi] = await Promise.all([
            fetch(API_SWE, { next: { revalidate: 600 } }),
            fetch(API_AI, { next: { revalidate: 600 } })
        ]);

        if (!resSwe.ok || !resAi.ok) throw new Error("RSS fetch failed");

        const dataSwe = await resSwe.json();
        const dataAi = await resAi.json();

        const itemsSwe = (dataSwe.items || []) as RSSItem[];
        const itemsAi = (dataAi.items || []) as RSSItem[];

        // Merge and sort descending by pubDate
        const mergedItems = [...itemsSwe, ...itemsAi].sort((a, b) => {
            return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
        });

        // Filter out obvious non-technical fluff if any slipped through the RSS query
        const techKeywords = ['code', 'software', 'developer', 'ai', 'cloud', 'architecture', 'programming', 'model', 'api', 'framework'];
        const filteredItems = mergedItems.filter(item => {
            const lowerTitle = item.title.toLowerCase();
            return techKeywords.some(keyword => lowerTitle.includes(keyword));
        });

        // Fallback to mergedItems if filter is too aggressive
        const finalItems = filteredItems.length >= 6 ? filteredItems : mergedItems;

        const articles = finalItems.slice(0, 12).map((item) => {
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
