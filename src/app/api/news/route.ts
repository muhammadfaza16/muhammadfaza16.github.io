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
    { url: "https://waitbutwhy.com/feed", name: "Wait But Why", tag: "Deep Dive" },
    { url: "https://filipesilva.github.io/paulgraham-rss/feed.rss", name: "Paul Graham", tag: "Startup Essay" },
    { url: "https://fs.blog/feed/", name: "Farnam Street", tag: "Mental Models" },
    { url: "https://overreacted.io/rss.xml", name: "Dan Abramov", tag: "Frontend" },
    { url: "https://scotthyoung.com/blog/feed/", name: "Scott H. Young", tag: "Self-Improvement" },
    { url: "https://blog.pragmaticengineer.com/rss/", name: "Pragmatic Engineer", tag: "Engineering" }
];

function formatEvergreenMeta(dateOrTimestamp: number | string | undefined, tag: string): string {
    if (!dateOrTimestamp) return tag;

    const date = typeof dateOrTimestamp === 'number'
        ? new Date(dateOrTimestamp * 1000)
        : new Date(dateOrTimestamp);

    // Format to "Oct 2023"
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();

    return `${tag} · ${month} ${year}`;
}

function stripHtml(html: string): string {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, '').trim();
}

// Fisher-Yates shuffle for true randomness
function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
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

                // Parse top 15 items to get a good pool from each blog
                const parsedItems = feed.items.slice(0, 15).map(item => ({
                    title: item.title || "Untitled",
                    source: feedNode.name,
                    url: item.link || item.guid || "",
                    timeAgo: formatEvergreenMeta(item.isoDate || item.pubDate, feedNode.tag),
                    excerpt: stripHtml(item.contentSnippet || item.description || item.contentEncoded || "").substring(0, 150) + "..."
                }));

                // Shuffle this blog's pool and pick 2-3 items randomly to ensure diversity
                return shuffleArray(parsedItems).slice(0, 3);
            } catch (err) {
                console.error(`Failed to parse feed ${feedNode.name}:`, err);
                return [];
            }
        });

        const nestedItems = await Promise.all(feedPromises);

        // Flatten and entirely shuffle the multi-source pool
        const shuffledPool = shuffleArray(nestedItems.flat());

        // Grab exactly 12 items for the UI
        const articles = shuffledPool.slice(0, 12).map((item) => ({
            title: item.title,
            source: item.source,
            url: item.url,
            timeAgo: item.timeAgo,
            excerpt: item.excerpt,
        }));

        // Use a shorter cache and stale-while-revalidate to let the shuffle refresh periodically
        return NextResponse.json({ articles }, {
            headers: {
                "Cache-Control": "s-maxage=600, stale-while-revalidate=300"
            }
        });
    } catch (error) {
        console.error("Global RSS Fetch Error:", error);
        return NextResponse.json({ articles: [] });
    }
}
