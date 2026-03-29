import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const titlesToKeep = ['Side A', 'Melajoe']
  
  console.log(`Keeping playlists: ${titlesToKeep.join(', ')}`)
  
  const toDelete = await prisma.playlist.findMany({
    where: {
      NOT: {
        title: {
          in: titlesToKeep
        }
      }
    },
    select: {
      id: true,
      title: true
    }
  })
  
  const deleteIds = toDelete.map(p => p.id)
  
  if (deleteIds.length === 0) {
    console.log('No playlists to delete.')
    return
  }

  console.log(`Deleting dependencies for ${deleteIds.length} playlists...`)

  // Delete LiveSessions (which will cascade delete LiveChatMessages)
  const sessionDelete = await prisma.liveSession.deleteMany({
    where: {
      playlistId: {
        in: deleteIds
      }
    }
  })
  console.log(`Deleted ${sessionDelete.count} live sessions.`)

  // Delete Playlists (which will cascade delete PlaylistSongs)
  const playlistDelete = await prisma.playlist.deleteMany({
    where: {
      id: {
        in: deleteIds
      }
    }
  })
  
  console.log(`Successfully deleted ${playlistDelete.count} playlists.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
