import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const [
            latestBook,
            latestWriting,
            latestCuration,
            latestWishlist,
        ] = await Promise.all([
            prisma.book.findFirst({
                orderBy: { createdAt: "desc" },
                select: { title: true, author: true, coverImage: true, rating: true }
            }),
            prisma.post.findFirst({
                where: { published: true },
                orderBy: { createdAt: "desc" },
                select: { title: true, slug: true, coverImage: true }
            }),
            prisma.article.findFirst({
                orderBy: { createdAt: "desc" },
                select: { title: true, coverImage: true, isRead: true }
            }),
            prisma.wishlistItem.findFirst({
                orderBy: { createdAt: "desc" },
                select: { name: true, price: true, url: true, priority: true }
            }),
        ]);

        return NextResponse.json({
            book: latestBook,
            post: latestWriting,
            article: latestCuration,
            wishlist: latestWishlist,
        }, {
            headers: { "Cache-Control": "s-maxage=600, stale-while-revalidate=300" }
        });
    } catch (error) {
        console.error("Failed to fetch pulse data:", error);
        return NextResponse.json({
            book: null,
            post: null,
            article: null,
            wishlist: null,
        });
    }
}
