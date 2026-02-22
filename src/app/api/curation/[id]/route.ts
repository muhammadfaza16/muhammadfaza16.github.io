import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id;
        const article = await prisma.article.findUnique({
            where: { id }
        });

        if (!article) {
            return NextResponse.json({ error: "Article not found" }, { status: 404 });
        }

        // Auto-mark as read when fetched (if it was unread)
        // We do this asynchronously so it doesn't block the GET response
        if (!article.isRead) {
            prisma.article.update({
                where: { id },
                data: { isRead: true }
            }).catch(e => console.error("Failed to mark as read:", e));
        }

        return NextResponse.json(article);
    } catch (error) {
        console.error("Failed to fetch article:", error);
        return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
    }
}
