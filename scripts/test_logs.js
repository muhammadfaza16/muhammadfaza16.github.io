const { PrismaClient } = require('../src/generated/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const count = await prisma.musicAccessLog.count();
    console.log('Total access logs:', count);
    const logs = await prisma.musicAccessLog.findMany({ take: 5 });
    console.log('Sample logs:', JSON.stringify(logs, null, 2));
  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
