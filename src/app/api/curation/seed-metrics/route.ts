import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminRequest } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const admin = await isAdminRequest();
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get all articles that do not have a score yet
        const articles = await prisma.article.findMany({
            where: { score: null },
            select: { id: true }
        });

        console.log(`Found ${articles.length} articles to seed metrics for.`);

        let updatedCount = 0;

        for (const article of articles) {
            // Generate plausible fake metrics
            // Likes: between 150 and 2000
            const likes = Math.floor(Math.random() * (2000 - 150)) + 150;
            // Reposts (RT): roughly 10% to 25% of likes
            const repostMultiplier = 0.10 + Math.random() * 0.15;
            const reposts = Math.floor(likes * repostMultiplier);
            // Replies: roughly 2% to 8% of likes
            const replyMultiplier = 0.02 + Math.random() * 0.06;
            const replies = Math.floor(likes * replyMultiplier);

            await prisma.articleScore.create({
                data: {
                    articleId: article.id,
                    engagement: likes,
                    actionability: reposts,
                    specificity: replies
                }
            });

            updatedCount++;
        }

        return NextResponse.json({
            success: true,
            message: `Successfully seeded metrics for ${updatedCount} articles.`
        });

    } catch (error) {
        console.error("Failed to seed metrics:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
