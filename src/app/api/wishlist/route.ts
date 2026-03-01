import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const data = await request.json();
        // Re-map the generic form payload (title -> name)
        const { title, price, url, priority } = data;

        if (!title) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newItem = await prisma.wishlistItem.create({
            data: {
                name: title, // title payload maps to WishlistItem name field
                price: price || null,
                url, // url variable directly holds the former coverImage intent
                priority: priority || 1,
            },
        });

        return NextResponse.json({ success: true, newItem }, { status: 201 });
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
