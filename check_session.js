const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const session = await prisma.liveSession.findFirst({
      where: { isActive: true },
      include: { playlist: true }
    });
    console.log('ACTIVE_SESSION:', JSON.stringify(session, null, 2));
    const allSessions = await prisma.liveSession.findMany({ take: 5 });
    console.log('ALL_SESSIONS:', JSON.stringify(allSessions, null, 2));
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    await prisma.$disconnect();
  }
}
check();
