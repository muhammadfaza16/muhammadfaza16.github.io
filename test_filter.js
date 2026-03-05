const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.article.findMany({
    where: { category: 'Mindset & Philosophy' },
    select: { title: true, category: true }
})
    .then(data => console.log(JSON.stringify(data, null, 2)))
    .finally(() => prisma.$disconnect());
