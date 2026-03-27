const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  try {
    const latest = await prisma.liveSession.findFirst({
      orderBy: { startedAt: 'desc' }
    });
    if (latest) {
      const updated = await prisma.liveSession.update({
        where: { id: latest.id },
        data: { isActive: true }
      });
      console.log('SESSION_ACTIVATED:', updated.id);
    } else {
      console.log('NO_SESSIONS_FOUND');
    }
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    await prisma.$disconnect();
  }
}
fix();
