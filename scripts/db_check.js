const { PrismaClient } = require('../src/generated/client');
const prisma = new PrismaClient();

async function check() {
  try {
    console.log('Attempting to connect with custom client...');
    const logs = await prisma.musicAccessLog.findMany({ take: 5 });
    console.log('Successfully fetched logs:', logs.length);
  } catch (err) {
    console.error('DATABASE_CHECK_FAILED');
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
