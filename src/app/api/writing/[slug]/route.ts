import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { slug: string } }) {
    try {
        const post = await prisma.post.findUnique({
            where: {
                slug: params.slug,
            },
        });

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // Parse content to HTML if needed by the frontend (or let frontend handle markdown)
        return NextResponse.json(post);
    } catch (error) {
        console.error("Failed to fetch writing post:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
