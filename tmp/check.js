const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    const articles = await prisma.article.findMany({
        select: { title: true, category: true },
        take: 10
    });
    console.log("=== DB CATEGORIES ===");
    articles.forEach(a => console.log(`${a.category} -> ${a.title.substring(0, 40)}`));

    const counts = await prisma.article.groupBy({
        by: ['category'],
        _count: { category: true }
    });
    console.log("\n=== CATEGORY COUNTS ===");
    console.log(counts);
}
run().finally(() => prisma.$disconnect());
