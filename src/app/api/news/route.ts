import { NextResponse } from "next/server";
import Parser from "rss-parser";

const parser = new Parser({
    customFields: {
        item: [
            ['content:encoded', 'contentEncoded'],
            ['description', 'description']
        ]
    }
});

const CURATED_FEEDS = [
    { url: "https://waitbutwhy.com/feed", name: "Wait But Why" },
    { url: "https://hackernoon.com/feed", name: "HackerNoon" },
    { url: "https://fs.blog/feed/", name: "Farnam Street" },
    { url: "https://overreacted.io/rss.xml", name: "Dan Abramov" },
    { url: "https://scotthyoung.com/blog/feed/", name: "Scott H. Young" },
    { url: "https://blog.pragmaticengineer.com/rss/", name: "Pragmatic Engineer" }
];

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

function stripHtml(html: string): string {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, '').trim();
}

export async function GET() {
    try {
        const feedPromises = CURATED_FEEDS.map(async (feedNode) => {
            try {
                // We use fetch with user-agent to bypass basic anti-bot blockers (e.g., Farnam Street)
                const response = await fetch(feedNode.url, {
                    next: { revalidate: 3600 },
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
                        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
                    }
                });
                const xml = await response.text();
                const feed = await parser.parseString(xml);

                return feed.items.slice(0, 5).map(item => ({
                    title: item.title || "Untitled",
                    source: feedNode.name,
                    url: item.link || item.guid || "",
                    timeAgo: item.isoDate ? timeAgo(item.isoDate) : item.pubDate ? timeAgo(item.pubDate) : "Recent",
                    pubDateMs: item.isoDate ? new Date(item.isoDate).getTime() : item.pubDate ? new Date(item.pubDate).getTime() : 0,
                    excerpt: stripHtml(item.contentSnippet || item.description || item.contentEncoded || "").substring(0, 150) + "..."
                }));
            } catch (err) {
                console.error(`Failed to parse feed ${feedNode.name}:`, err);
                return [];
            }
        });

        const nestedItems = await Promise.all(feedPromises);
        const mergedItems = nestedItems.flat().sort((a, b) => b.pubDateMs - a.pubDateMs);

        const articles = mergedItems.slice(0, 12).map((item) => ({
            title: item.title,
            source: item.source,
            url: item.url,
            timeAgo: item.timeAgo,
            excerpt: item.excerpt,
        }));

        return NextResponse.json({ articles }, {
            headers: {
                "Cache-Control": "s-maxage=3600, stale-while-revalidate=1800"
            }
        });
    } catch (error) {
        console.error("Global RSS Fetch Error:", error);
        return NextResponse.json({ articles: [] });
    }
}
