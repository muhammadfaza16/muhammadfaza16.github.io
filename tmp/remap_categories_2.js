const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    const categoryMap = {
        "Mindset & Philosophy": "Philosophy & Mental Models",
        "Self-Improvement & Productivity": "Peak Performance",
        "Health & Lifestyle": "Peak Performance",
        "Career & Skills": "Growth & Systems",
        "Marketing & Growth": "Growth & Systems",
        "Building & Design": "Growth & Systems"
    };

    console.log("Starting bulk category migration...");

    for (const [oldCat, newCat] of Object.entries(categoryMap)) {
        try {
            const result = await prisma.article.updateMany({
                where: { category: oldCat },
                data: { category: newCat }
            });
            console.log(`Updated ${result.count} articles from "${oldCat}" to "${newCat}"`);
        } catch (err) {
            console.error(`Failed to update "${oldCat}": ${err.message}`);
        }
    }

    console.log("Migration complete!");
}

run().catch(console.error).finally(() => prisma.$disconnect());
