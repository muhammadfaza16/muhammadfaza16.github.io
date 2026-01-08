import { getAllPosts } from "@/lib/posts";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
    const baseUrl = "https://manifesto.dev";
    const posts = getAllPosts();

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
    <channel>
        <title>Manifesto</title>
        <link>${baseUrl}</link>
        <description>Pikiran, prinsip, dan perspektif pribadi.</description>
        <language>id</language>
        ${posts
            .map(
                (post) => `
            <item>
                <title>${post.title}</title>
                <link>${baseUrl}/blog/${post.slug}</link>
                <description>${post.excerpt}</description>
                <pubDate>${new Date().toUTCString()}</pubDate>
            </item>
        `
            )
            .join("")}
    </channel>
</rss>`;

    return new NextResponse(rss, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
}
