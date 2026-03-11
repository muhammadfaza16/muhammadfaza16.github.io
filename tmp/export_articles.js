const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
    console.log('Fetching articles...');
    const articles = await prisma.article.findMany({
        select: {
            id: true,
            title: true,
            content: true,
            url: true,
            category: true,
        }
    });

    // Basic cleanup to make the JSON more readable (strip extreme HTML if needed, but we'll preserve for best context)
    const cleanedArticles = articles.map(a => ({
        id: a.id,
        title: a.title,
        currentCategory: a.category,
        contentPreview: a.content ? a.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 2000) : ''
    }));

    fs.writeFileSync('tmp/articles_dump.json', JSON.stringify(cleanedArticles, null, 2));
    console.log(`Successfully exported ${articles.length} articles to tmp/articles_dump.json`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
