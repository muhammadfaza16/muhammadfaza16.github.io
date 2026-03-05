const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.article.findMany({
    select: { title: true, category: true },
    take: 30
}).then(data => {
    console.log(JSON.stringify(data, null, 2));
}).finally(() => prisma.$disconnect());
