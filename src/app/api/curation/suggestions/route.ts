import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { url, title, notes, imageUrl, category } = data;

        if (!url) {
            return NextResponse.json({ error: "Missing required URL field" }, { status: 400 });
        }

        const newSuggestion = await prisma.article.create({
            data: {
                title: title || "Suggested Article",
                content: notes || "No additional context provided.",
                url,
                imageUrl: imageUrl || null,
                category: "__SUGGESTED__",
                isRead: false,
            } as any,
            select: { id: true, title: true, url: true }
        });

        return NextResponse.json({ success: true, article: newSuggestion }, { status: 201 });
    } catch (error) {
        console.error("Failed to submit suggestion:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const suggestions = await prisma.article.findMany({
            where: { category: "__SUGGESTED__" },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                title: true,
                url: true,
                content: true,
                createdAt: true,
            },
        });
        return NextResponse.json({ success: true, data: suggestions });
    } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

