import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const song = await prisma.song.findFirst()
  console.log(Object.keys(song || {}))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
