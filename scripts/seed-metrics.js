const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addColumns() {
    try {
        console.log("Executing raw SQL to add missing columns to Article...");
        await prisma.$executeRawUnsafe(`ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "likes" INTEGER NOT NULL DEFAULT 0`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "reposts" INTEGER NOT NULL DEFAULT 0`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "replies" INTEGER NOT NULL DEFAULT 0`);
        console.log("Successfully added columns using raw SQL.");
    } catch (e) {
        console.log("Columns may already exist or error:", e.message);
    }
}

async function main() {
    await addColumns();

    const articles = await prisma.article.findMany({
        where: { likes: 0 },
        select: { id: true }
    });

    console.log(`Found ${articles.length} articles to seed.`);

    let updatedCount = 0;
    for (const article of articles) {
        const likes = Math.floor(Math.random() * (1500 - 150)) + 150;
        const repostMultiplier = 0.10 + Math.random() * 0.15;
        const reposts = Math.floor(likes * repostMultiplier);
        const replyMultiplier = 0.02 + Math.random() * 0.06;
        const replies = Math.floor(likes * replyMultiplier);

        await prisma.article.update({
            where: { id: article.id },
            data: { likes, reposts, replies }
        });
        updatedCount++;
    }
    console.log(`Seeded ${updatedCount} articles.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
