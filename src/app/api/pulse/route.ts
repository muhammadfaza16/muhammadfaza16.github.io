import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const [
            bookCount,
            latestBook,
            writingCount,
            latestWriting,
            curationCount,
            unreadCurationCount,
            latestCuration,
            wishlistCount,
            highPriorityWishlist,
        ] = await Promise.all([
            prisma.book.count(),
            prisma.book.findFirst({ orderBy: { createdAt: "desc" }, select: { title: true } }),
            prisma.post.count({ where: { published: true } }),
            prisma.post.findFirst({ where: { published: true }, orderBy: { createdAt: "desc" }, select: { title: true } }),
            prisma.article.count(),
            prisma.article.count({ where: { isRead: false } }),
            prisma.article.findFirst({ orderBy: { createdAt: "desc" }, select: { title: true } }),
            prisma.wishlistItem.count(),
            prisma.wishlistItem.count({ where: { priority: "High" } }),
        ]);

        return NextResponse.json({
            books: { total: bookCount, latest: latestBook?.title || null },
            writings: { total: writingCount, latest: latestWriting?.title || null },
            curations: { total: curationCount, unread: unreadCurationCount, latest: latestCuration?.title || null },
            wishlist: { total: wishlistCount, highPriority: highPriorityWishlist },
        }, {
            headers: { "Cache-Control": "s-maxage=600, stale-while-revalidate=300" }
        });
    } catch (error) {
        console.error("Failed to fetch pulse data:", error);
        return NextResponse.json({
            books: { total: 0, latest: null },
            writings: { total: 0, latest: null },
            curations: { total: 0, unread: 0, latest: null },
            wishlist: { total: 0, highPriority: 0 },
        });
    }
}
