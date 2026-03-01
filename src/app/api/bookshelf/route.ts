import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { title, author, url, content } = data; // Note: content maps to review in Prisma

        if (!title || !author) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const book = await prisma.book.create({
            data: {
                title,
                author,
                url,
                review: content, // Form sends 'content', Prisma expects 'review'
            },
        });

        return NextResponse.json({ success: true, book }, { status: 201 });
    } catch (error) {
        console.error("Failed to log book:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const books = await prisma.book.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(books);
    } catch (error) {
        console.error("Failed to fetch books:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
