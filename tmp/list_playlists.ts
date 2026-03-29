import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function main() {
  const playlists = await prisma.playlist.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      philosophy: true,
      schedule: true,
      vibes: true,
      coverColor: true,
      coverImage: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { songs: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  fs.writeFileSync(path.join('tmp', 'playlists_full.json'), JSON.stringify(playlists, null, 2))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
