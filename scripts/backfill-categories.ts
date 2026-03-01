import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const categories = {
    "AI & Tools": [10, 11, 14, 15, 16, 22, 23, 35, 36, 43, 44, 50, 55, 63, 67, 69, 72, 73, 80, 82, 83, 88, 90, 91, 97, 98, 102, 106, 111, 112, 113, 119, 121, 123, 132, 133, 135, 137, 140, 143, 144],
    "Wealth & Business": [2, 4, 8, 21, 33, 40, 42, 47, 49, 52, 54, 62, 71, 76, 87, 95, 100, 105, 109, 110, 114, 127, 134, 136],
    "Mindset & Philosophy": [1, 12, 25, 39, 48, 51, 56, 58, 59, 60, 61, 64, 65, 70, 74, 75, 79, 81, 86, 92, 93, 94, 99, 116, 117, 128, 131, 138, 139, 141],
    "Self-Improvement & Productivity": [3, 5, 24, 27, 28, 29, 31, 38, 53, 84, 85, 101, 104, 107, 108, 115, 124, 129, 130],
    "Career & Skills": [6, 7, 9, 13, 30, 34, 41, 57, 78, 122, 126],
    "Marketing & Growth": [17, 18, 45, 46, 66, 77, 118],
    "Building & Design": [32],
    "Health & Lifestyle": [19, 20, 26, 37, 68, 89, 96, 103, 120, 125, 142]
};

async function main() {
    // 1. Fetch all articles ordered by date descending (same as how we dumped them)
    const articles = await prisma.article.findMany({
        orderBy: { createdAt: "desc" },
    });

    console.log(`Found ${articles.length} articles.`);

    let updatedCount = 0;

    // 2. Map through categories and assign
    for (const [categoryName, indices] of Object.entries(categories)) {
        for (const index of indices) {
            const article = articles[index - 1]; // 1-based index to 0-based
            if (article) {
                await prisma.article.update({
                    where: { id: article.id },
                    data: { category: categoryName }
                });
                updatedCount++;
            } else {
                console.log(`Article at index ${index} not found!`);
            }
        }
    }

    console.log(`Successfully updated ${updatedCount} articles with categories!`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
