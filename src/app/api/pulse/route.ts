import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const [
            latestBook,
            latestWriting,
            latestCuration,
            latestWishlist,
        ] = await Promise.all([
            prisma.book.findMany({
                take: 1,
                orderBy: { createdAt: "desc" },
                select: { title: true, author: true, url: true, rating: true }
            }),
            prisma.post.findMany({
                where: { published: true },
                take: 1,
                orderBy: { createdAt: "desc" },
                select: { title: true, slug: true, url: true }
            }),
            prisma.article.findMany({
                take: 1,
                orderBy: { createdAt: "desc" },
                select: { title: true, url: true, isRead: true }
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
