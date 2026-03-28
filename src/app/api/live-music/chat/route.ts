import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET — Fetch recent chat messages for a live session
// ?sessionId=X&after=ISO_TIMESTAMP (optional cursor for polling)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get("sessionId");
        const after = searchParams.get("after");

        if (!sessionId) {
            return NextResponse.json({ success: false, error: "sessionId is required" }, { status: 400 });
        }

        const where: any = { liveSessionId: sessionId };

        if (after) {
            // Only return messages newer than this timestamp (for polling)
            where.createdAt = { gt: new Date(after) };
        }

        const messages = await (prisma as any).liveChatMessage.findMany({
            where,
            orderBy: { createdAt: "asc" },
            take: after ? 50 : 100, // Initial load: last 100, polling: up to 50 new
            ...(after ? {} : {
                // For initial load, get the LATEST 100 then reverse
                orderBy: { createdAt: "desc" },
            }),
        });

        // If initial load (no 'after'), we fetched desc, so reverse to asc
        const sorted = after ? messages : messages.reverse();

        return NextResponse.json({
            success: true,
            messages: sorted.map((m: any) => ({
                id: m.id,
                nickname: m.nickname,
                content: m.content,
                createdAt: m.createdAt.toISOString(),
            })),
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST — Send a new chat message
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { sessionId, nickname, content } = body;

        if (!sessionId || !content) {
            return NextResponse.json({ success: false, error: "sessionId and content are required" }, { status: 400 });
        }

        // Sanitize
        const cleanContent = content.trim().slice(0, 500); // Max 500 chars
        const cleanNickname = (nickname || "Anon").trim().slice(0, 30);

        if (!cleanContent) {
            return NextResponse.json({ success: false, error: "Message cannot be empty" }, { status: 400 });
        }

        const message = await (prisma as any).liveChatMessage.create({
            data: {
                liveSessionId: sessionId,
                nickname: cleanNickname,
                content: cleanContent,
            },
        });

        return NextResponse.json({
            success: true,
            message: {
                id: message.id,
                nickname: message.nickname,
                content: message.content,
                createdAt: message.createdAt.toISOString(),
            },
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
