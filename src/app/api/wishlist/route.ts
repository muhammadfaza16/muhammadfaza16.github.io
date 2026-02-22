import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const data = await request.json();
        // Re-map the generic form payload (title -> name, coverImage -> url)
        const { title, price, coverImage, priority } = data;

        if (!title) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const item = await prisma.wishlistItem.create({
            data: {
                name: title,
                price,
                url: coverImage,
                priority: priority || "Low",
            },
        });

        return NextResponse.json({ success: true, item }, { status: 201 });
    } catch (error) {
        console.error("Failed to add wishlist item:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const items = await prisma.wishlistItem.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(items);
    } catch (error) {
        console.error("Failed to fetch wishlist:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
