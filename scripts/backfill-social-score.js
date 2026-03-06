const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function backfillSocialScores() {
    console.log("Starting socialScore backfill...");
    try {
        const scores = await prisma.articleScore.findMany();
        let updatedCount = 0;

        for (const score of scores) {
            const likes = score.engagement || 0;
            const reposts = score.actionability || 0;
            const replies = score.specificity || 0;

            const socialScore = (likes * 1) + (reposts * 2) + (replies * 3);

            await prisma.articleScore.update({
                where: { id: score.id },
                data: { socialScore }
            });
            updatedCount++;
        }

        console.log(`Successfully backfilled socialScore for ${updatedCount} articles.`);
    } catch (error) {
        console.error("Backfill failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

backfillSocialScores();
