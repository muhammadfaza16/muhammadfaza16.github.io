import { NextResponse } from "next/server";

// We use two primary sources for pure technical content: Hacker News and Dev.to
const HN_TOP_URL = "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty";
const DEV_TO_URL = "https://dev.to/api/articles?tag=ai,programming&top=1&per_page=10";

// Helper to fetch details for a specific HN item
async function fetchHNItem(id: number) {
    const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
    if (!res.ok) return null;
    return await res.json();
}

function timeAgo(dateOrTimestamp: number | string): string {
    const now = new Date();
    // HN provides unix timestamp (seconds), Dev.to provides ISO string
    const date = typeof dateOrTimestamp === 'number'
        ? new Date(dateOrTimestamp * 1000)
        : new Date(dateOrTimestamp);

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
        // 1. Fetch HN Top IDs and Dev.to Articles concurrently
        const [hnRes, devRes] = await Promise.all([
            fetch(HN_TOP_URL, { next: { revalidate: 600 } }),
            fetch(DEV_TO_URL, { next: { revalidate: 600 } })
        ]);

        if (!hnRes.ok || !devRes.ok) throw new Error("API fetch failed");

        const hnIds = await hnRes.json();
        const devArticlesRaw = await devRes.json();

        // 2. Fetch top 8 Hacker News items explicitly (since we only have IDs initially)
        const hnTopIds = hnIds.slice(0, 8);
        const hnItemsPromises = hnTopIds.map((id: number) => fetchHNItem(id));
        const hnItemsRaw = await Promise.all(hnItemsPromises);

        // 3. Format Hacker News Items
        const hnFormatted = hnItemsRaw.filter(item => item && item.title && item.url).map(item => ({
            title: item.title,
            source: "Hacker News",
            url: item.url,
            timeAgo: timeAgo(item.time), // Unix seconds
            pubDateMs: item.time * 1000,
            excerpt: `Score: ${item.score} | by ${item.by} | ${item.descendants} comments`,
        }));

        // 4. Format Dev.to Items
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const devFormatted = devArticlesRaw.filter((a: any) => a.title && a.url).slice(0, 8).map((item: any) => ({
            title: item.title,
            source: "Dev.to",
            url: item.url,
            timeAgo: timeAgo(item.published_at), // ISO string
            pubDateMs: new Date(item.published_at).getTime(),
            excerpt: item.description ? item.description.substring(0, 120) + "..." : `Tags: ${item.tag_list.join(', ')}`,
        }));

        // 5. Merge and sort descending by absolute time
        const mergedItems = [...hnFormatted, ...devFormatted].sort((a, b) => b.pubDateMs - a.pubDateMs);

        // Map cleanly for the frontend, removing the temporary pubDateMs sorting key
        const articles = mergedItems.slice(0, 12).map((item) => ({
            title: item.title,
            source: item.source,
            url: item.url,
            timeAgo: item.timeAgo,
            excerpt: item.excerpt,
        }));

        return NextResponse.json({ articles });
    } catch {
        return NextResponse.json({ articles: [] });
    }
}
