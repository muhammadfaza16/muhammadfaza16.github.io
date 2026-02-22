import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const hour = parseInt(searchParams.get("hour") || "12");

    try {
        // Find the oldest unread article to recommend
        const oldestUnread = await prisma.article.findFirst({
            where: { isRead: false },
            orderBy: { createdAt: 'asc' },
            select: { id: true, title: true }
        });

        // Count total unread to show the scale of the backlog
        const unreadCount = await prisma.article.count({
            where: { isRead: false }
        });

        if (!oldestUnread) {
            return NextResponse.json({ active: false });
        }

        // Scheduling Heuristic: Only show the reminder during evening/night hours (when people usually have time to read long-form)
        // Or if the backlog is getting huge (> 5 articles)
        const isEvening = hour >= 19 && hour <= 23;
        const isBigBacklog = unreadCount >= 5;

        if (isEvening || isBigBacklog) {
            return NextResponse.json({
                active: true,
                count: unreadCount,
                article: oldestUnread,
                message: isBigBacklog
                    ? `You have a backlog of ${unreadCount} deep dives. Start catching up.`
                    : `It's evening. Perfect time to read pending articles.`
            });
        }

        return NextResponse.json({ active: false });

    } catch (error) {
        console.error("Failed to fetch reminder:", error);
        return NextResponse.json({ active: false }, { status: 500 });
    }
}
