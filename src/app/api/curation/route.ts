import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { title, content, coverImage } = data;

        if (!title || !content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const article = await prisma.article.create({
            data: {
                title,
                content,
                coverImage,
            },
        });

        return NextResponse.json({ success: true, article }, { status: 201 });
    } catch (error) {
        console.error("Failed to create curation article:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const articles = await prisma.article.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(articles);
    } catch (error) {
        console.error("Failed to fetch curation articles:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
