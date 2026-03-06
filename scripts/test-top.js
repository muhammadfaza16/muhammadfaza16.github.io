const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Adding summary column to Article table if it doesn't exist...");
    try {
        await prisma.$executeRawUnsafe('ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "summary" TEXT;');
        console.log("Successfully ensured summary column exists.");
    } catch (e) {
        console.log("Error adding column (might already exist):", e.message);
    }

    console.log("Fetching top articles...");
    const topArticles = await prisma.article.findMany({
        take: 5,
        where: {
            OR: [
                { category: null },
                { category: { not: "__SUGGESTED__" } }
            ],
            score: {
                isNot: null
            }
        },
        orderBy: {
            score: {
                socialScore: 'desc'
            }
        },
        include: {
            score: {
                select: {
                    socialScore: true,
                }
            }
        }
    });
    console.log("Result:", JSON.stringify(topArticles.map(a => ({ id: a.id, title: a.title, socialScore: a.score?.socialScore })), null, 2));

    const allScores = await prisma.articleScore.findMany({
        take: 5,
        orderBy: { socialScore: 'desc' }
    });
    console.log("Top 5 strict ArticleScores:", JSON.stringify(allScores, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
