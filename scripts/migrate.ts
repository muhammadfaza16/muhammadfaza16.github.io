import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const categoryMap: Record<string, string> = {
        "AI & Automation": "AI & Tech",
        "Wealth & Leverage": "Wealth & Business",
        "Philosophy & Mental Models": "Philosophy & Psychology",
        "Peak Performance": "Productivity & Deep Work"
    }

    for (const [oldCat, newCat] of Object.entries(categoryMap)) {
        console.log(`Updating ${oldCat} -> ${newCat}...`)
        const result = await prisma.article.updateMany({
            where: { category: oldCat },
            data: { category: newCat },
        })
        console.log(`Updated ${result.count} articles.`)
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
