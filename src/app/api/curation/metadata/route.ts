import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const targetUrlRaw = searchParams.get("url");

    if (!targetUrlRaw) {
        return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    try {
        let urlObject: URL;
        try {
            urlObject = new URL(targetUrlRaw);
        } catch (e) {
            // Give it a http prefix if it's missing (e.g. google.com)
            urlObject = new URL(`https://${targetUrlRaw}`);
        }

        // --- TWITTER/X DOMAIN REWRITE ---
        // Twitter blocking HTML scraping. But vxtwitter has an open JSON API.
        const hostname = urlObject.hostname.replace('www.', '');
        if (hostname === "twitter.com" || hostname === "x.com") {
            // e.g. https://api.fxtwitter.com/Tim_Denning/status/2027684690027802688
            const apiUrl = `https://api.fxtwitter.com${urlObject.pathname}`;
            const response = await fetch(apiUrl, { signal: AbortSignal.timeout(6000) });

            if (response.ok) {
                const json = await response.json();
                const data = json.tweet || json; // fxtwitter wraps in { tweet: {...} }

                let image = "";
                if (data.media?.photos && data.media.photos.length > 0) image = data.media.photos[0].url;
                else if (data.media?.mosaic?.formats?.jpeg) image = data.media.mosaic.formats.jpeg;
                else if (data.article?.cover_media?.media_info?.original_img_url) image = data.article.cover_media.media_info.original_img_url;

                let desc = data.text || "";
                let title = `${data.author?.name || "X User"} (@${data.author?.screen_name || "unknown"}) on X`;
                let publishedTime = data.article?.created_at || data.created_at || "";

                if (data.article) {
                    if (data.article.title) title = data.article.title;
                    if (!desc && data.article.preview_text) desc = data.article.preview_text;
                    // Also attempt to get full blocks if available, fxtwitter exposes them
                    if (data.article.content?.blocks) {
                        desc = parseDraftJsBlocksToHtml(
                            data.article.content.blocks,
                            data.article.content.entityMap,
                            data.article.media_entities
                        );
                    }
                }

                return NextResponse.json({
                    success: true,
                    data: { title, description: desc, image, publishedTime }
                }, { status: 200 });
            }
        }

        const fetchUrl = urlObject.toString();
        const response = await fetch(fetchUrl, {
            headers: {
                // Add a user agent to mimic a real browser to avoid 403s on strict servers
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
            },
            // Don't hang forever if the site is slow
            signal: AbortSignal.timeout(6000),
        });

        if (!response.ok) {
            console.warn(`[Link Preview] Failed to fetch ${fetchUrl} - Status: ${response.status}`);
            return NextResponse.json({ error: "Failed to fetch URL" }, { status: response.status });
        }

        // We only care about the text content (HTML)
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("text/html")) {
            return NextResponse.json({ error: "URL is not an HTML page" }, { status: 400 });
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // --- METADATA EXTRACTION ---

        // 1. Title Extraction
        let title = $('meta[property="og:title"]').attr("content") ||
            $('meta[name="twitter:title"]').attr("content") ||
            $('title').text() ||
            "";

        // 2. Description Extraction
        let description = $('meta[property="og:description"]').attr("content") ||
            $('meta[name="twitter:description"]').attr("content") ||
            $('meta[name="description"]').attr("content") ||
            "";

        // 3. Image Extraction
        let image = $('meta[property="og:image"]').attr("content") ||
            $('meta[name="twitter:image"]').attr("content") ||
            $('link[rel="image_src"]').attr("href") ||
            "";

        // 4. Publish Date Extraction
        let publishedTime = $('meta[property="article:published_time"]').attr("content") ||
            $('meta[name="pubdate"]').attr("content") ||
            $('meta[name="date"]').attr("content") ||
            "";

        // Clean up text
        title = title.trim();
        description = description.trim();

        // Ensure image is an absolute URL if it exists
        if (image && !image.startsWith("http")) {
            // Handle root relative or path relative images
            try {
                image = new URL(image, urlObject.origin).toString();
            } catch (e) {
                image = ""; // Ignore invalid relative URLs
            }
        }

        return NextResponse.json({
            success: true,
            data: { title, description, image, publishedTime }
        }, { status: 200 });

    } catch (error: any) {
        console.error("[Link Preview] Error extracting metadata:", error);
        return NextResponse.json({
            error: "Failed to extract metadata",
            details: error.message
        }, { status: 500 });
    }
}

// Helper to convert Draft.js blocks (from fxtwitter API) to HTML
function parseDraftJsBlocksToHtml(blocks: any[], entityMap: any = {}, mediaEntities: any[] = []): string {
    if (!blocks || !Array.isArray(blocks)) return "";

    let html = "";
    let inUlist = false;
    let inOlist = false;

    blocks.forEach((block) => {
        let text = block.text || "";

        // Inline Styles (Bold, Italic)
        if (block.inlineStyleRanges && block.inlineStyleRanges.length > 0) {
            const events: Record<number, string[]> = {};
            block.inlineStyleRanges.forEach((range: any) => {
                const start = range.offset;
                const end = range.offset + range.length;
                let tag = "";
                if (range.style === "Bold") tag = "strong";
                else if (range.style === "Italic") tag = "em";
                else if (range.style === "Underline") tag = "u";
                else if (range.style === "CODE") tag = "code";

                if (tag) {
                    if (!events[start]) events[start] = [];
                    events[start].push(`<${tag}>`);
                    if (!events[end]) events[end] = [];
                    events[end].unshift(`</${tag}>`);
                }
            });

            let formattedText = "";
            for (let i = 0; i <= text.length; i++) {
                if (events[i]) formattedText += events[i].join("");
                if (i < text.length) formattedText += text[i];
            }
            text = formattedText;
        }

        // Entity Ranges (Images/Links)
        if (block.entityRanges && block.entityRanges.length > 0) {
            block.entityRanges.forEach((range: any) => {
                let entity;
                // fxtwitter often returns entityMap as an array of {key, value} pairs
                if (Array.isArray(entityMap)) {
                    const match = entityMap.find((e: any) => e.key == range.key);
                    entity = match ? match.value : null;
                } else {
                    // Standard Draft.js format
                    entity = entityMap[range.key];
                }

                // FxTwitter entity type is often "MEDIA" and links to a localMediaId/mediaId inside data.mediaItems
                if (entity && (entity.type === "IMAGE" || entity.type === "MEDIA")) {
                    const mediaItems = entity.data?.mediaItems || [];
                    if (mediaItems.length > 0) {
                        const mediaId = mediaItems[0].mediaId;
                        // Look up the mediaId in the article's media_entities array
                        const mediaEntity = mediaEntities?.find((m: any) => m.media_id === mediaId);
                        if (mediaEntity && mediaEntity.media_info?.original_img_url) {
                            text = `<img src="${mediaEntity.media_info.original_img_url}" alt="Embedded Image" />`;
                        }
                    }
                }
            });
        }

        // Block Wrappers
        if (block.type === "unordered-list-item") {
            if (!inUlist) { html += "<ul>"; inUlist = true; }
            html += `<li>${text}</li>`;
        } else {
            if (inUlist) { html += "</ul>"; inUlist = false; }
        }

        if (block.type === "ordered-list-item") {
            if (!inOlist) { html += "<ol>"; inOlist = true; }
            html += `<li>${text}</li>`;
        } else {
            if (inOlist) { html += "</ol>"; inOlist = false; }
        }

        if (block.type === "unstyled") {
            if (text.trim()) html += `<p>${text}</p>`;
        }
        else if (block.type === "header-one") html += `<h1>${text}</h1>`;
        else if (block.type === "header-two") html += `<h2>${text}</h2>`;
        else if (block.type === "header-three") html += `<h3>${text}</h3>`;
        else if (block.type === "header-four") html += `<h4>${text}</h4>`;
        else if (block.type === "header-five") html += `<h5>${text}</h5>`;
        else if (block.type === "header-six") html += `<h6>${text}</h6>`;
        else if (block.type === "blockquote") html += `<blockquote>${text}</blockquote>`;
        else if (block.type === "code-block") html += `<pre><code>${text}</code></pre>`;
        else if (block.type === "atomic") {
            if (text && text.includes("<img")) html += text; // If entity handler caught it
            else html += `<p>${text}</p>`; // fallback
        }
    });

    if (inUlist) html += "</ul>";
    if (inOlist) html += "</ol>";

    return html;
}

