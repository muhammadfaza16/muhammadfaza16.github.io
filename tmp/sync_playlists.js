const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PLAYLIST_CATEGORIES = [
    {
        slug: "teman-sunyi",
        title: "Western Classic",
        description: "Melodi pelan buat nemenin malam-malam tanpa tidur di bawah bintang.",
        philosophy: "Dalam sunyinya malam, kadang kita ktemu jawaban yang nggak bisa didengar pas siangnya lagi berisik.",
        schedule: "11 PM - 3 AM",
        vibes: ["Melancholic", "Space", "Introspective"],
        coverColor: "#1e3a8a", 
        coverImage: "/images/playlists/playlist_teman_sunyi_final.webp",
    },
    {
        slug: "line-up-inti",
        title: "Alexandria",
        description: "Campuran lagu-lagu epik yang bakal naikin adrenalin dan ngisi energi jiwa.",
        philosophy: "Soundtrack buat momen-momen main character kamu. Energi yang bikin bintang tetep bersinar.",
        schedule: "Anytime",
        vibes: ["Epic", "Main Character", "Energy"],
        coverColor: "#7c3aed", 
        coverImage: "/images/playlists/playlist_line_up_inti_final.webp",
    },
    {
        slug: "menunggu-pagi",
        title: "Malay Josjis",
        description: "Mulai harimu ditemenin sama lagu-lagu hangat layaknya matahari terbit.",
        philosophy: "Setiap sunrise itu kayak undangan buatikin harinya seseorang jadi lebih cerah.",
        schedule: "5 AM - 9 AM",
        vibes: ["Hopeful", "Morning", "Pop"],
        coverColor: "#f59e0b", 
        coverImage: "/images/playlists/playlist_menunggu_pagi_final.webp",
    },
    {
        slug: "tentang-dia",
        title: "Nanteska",
        description: "Gema kenangan lama sama perasaan kangen pengen pulang.",
        philosophy: "Kenangan itu cara kita megang erat hal-hal yang kita cinta, tentang siapa kita, dan hal yang nggak pengen kita lepasin.",
        schedule: "Late Night / Rainy",
        vibes: ["Nostalgic", "Love", "Acoustic"],
        coverColor: "#be185d", 
        coverImage: "/images/playlists/playlist_tentang_dia_final.webp",
    },
    {
        slug: "indo-hits",
        title: "Indo Hits",
        description: "Koleksi lagu-lagu terbaik dari tanah air dan sekitarnya.",
        philosophy: "Nada-nada yang kental sama rasa bangga dan memori lokal.",
        schedule: "Relaxing",
        vibes: ["Indo", "Pop", "Local"],
        coverColor: "#991b1b",
        coverImage: "/images/playlists/playlist_indo_hits.webp",
    },
    {
        slug: "international-favorites",
        title: "International Favorites",
        description: "Top global tracks that define the current era.",
        philosophy: "Music is a universal language, connecting us across borders.",
        schedule: "Anytime",
        vibes: ["International", "Global", "Hits"],
        coverColor: "#1d4ed8", 
        coverImage: "/images/playlists/playlist_international.webp",
    }
];

async function main() {
  for (const p of PLAYLIST_CATEGORIES) {
    const existing = await prisma.playlist.findUnique({ where: { slug: p.slug } });
    if (existing) {
      await prisma.playlist.update({
        where: { slug: p.slug },
        data: {
          title: p.title,
          description: p.description,
          philosophy: p.philosophy,
          schedule: p.schedule,
          vibes: p.vibes,
          coverColor: p.coverColor,
          coverImage: p.coverImage
        }
      });
      console.log(`Updated metadata for ${p.slug} WITHOUT deleting songs!`);
    } else {
      await prisma.playlist.create({
        data: {
          slug: p.slug,
          title: p.title,
          description: p.description,
          philosophy: p.philosophy,
          schedule: p.schedule,
          vibes: p.vibes,
          coverColor: p.coverColor,
          coverImage: p.coverImage
        }
      });
      console.log(`Created new empty playlist for ${p.slug}!`);
    }
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
