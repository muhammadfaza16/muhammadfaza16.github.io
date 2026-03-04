import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Starting Master Data Migration ---');

    // 1. Migrate Radio Stations
    const radioPath = path.join(process.cwd(), 'src', 'data', 'radioStations.json');
    const radioData = JSON.parse(fs.readFileSync(radioPath, 'utf8'));

    console.log(`Found ${radioData.length} radio stations. Migrating...`);
    for (const radio of radioData) {
        await prisma.radio.upsert({
            where: { slug: radio.id },
            update: {
                name: radio.name,
                description: radio.description,
                themeColor: radio.themeColor,
            },
            create: {
                slug: radio.id,
                name: radio.name,
                description: radio.description,
                themeColor: radio.themeColor,
            },
        });
    }

    // 2. Migrate Playlists
    // We'll parse the playlists.ts content since it's a TS file
    // Strategy: We already have the songs in the DB from the previous migration.
    // We just need to create the Playlist records and link them.

    // Note: Since I can't easily import TS in a script without setup, 
    // I'll hardcode the migration logic based on the file I viewed earlier.

    const playlistCategories = [
        {
            id: "teman-sunyi",
            title: "Teman Sunyi",
            description: "Melodies for the sleepless nights under the stars.",
            philosophy: "In the silence of the night, we find the answers we were too loud to hear during the day.",
            schedule: "11 PM - 3 AM",
            vibes: ["Melancholic", "Space", "Introspective"],
            coverColor: "#1e3a8a",
            coverImage: "/images/playlists/playlist_teman_sunyi_final.webp",
            songTitles: [
                "Cigarettes After Sex — Apocalypse",
                "Cigarettes After Sex — Cry",
                "Beach House — Space Song",
                "Coldplay — Hymn For The Weekend",
                "Lord Huron — The Night We Met",
                "Joji — Glimpse of Us",
                "Mac DeMarco — Chamber Of Reflection",
                "Sombr — Back to Friends",
                "d4vd — Romantic Homicide",
                "Yot Club — YKWIM?",
                "Arctic Monkeys — I Wanna Be Yours"
            ]
        },
        {
            id: "line-up-inti",
            title: "Line Up Inti",
            description: "A cosmic mix of everything that moves the soul.",
            philosophy: "The soundtracks of our main character moments; the energy that drives the stars.",
            schedule: "Anytime",
            vibes: ["Epic", "Main Character", "Energy"],
            coverColor: "#7c3aed",
            coverImage: "/images/playlists/playlist_line_up_inti_final.webp",
            songTitles: [
                "Alan Walker — Faded",
                "Alan Walker — Darkside",
                "Imagine Dragons — Believer",
                "The Chainsmokers — Closer",
                "Martin Garrix & Bebe Rexha — In The Name Of Love",
                "One Direction — Story of My Life",
                "Bruno Mars — Locked Out Of Heaven",
                "Justin Bieber — Ghost",
                "Ed Sheeran — Perfect",
                "James Arthur — Rewrite The Stars",
                "The Script — Hall Of Fame"
            ]
        },
        {
            id: "menunggu-pagi",
            title: "Menunggu Pagi",
            description: "Start your day with a sunrise of sound.",
            philosophy: "Every sunrise is an invitation to brighten someone's day.",
            schedule: "5 AM - 9 AM",
            vibes: ["Hopeful", "Morning", "Pop"],
            coverColor: "#f59e0b",
            coverImage: "/images/playlists/playlist_menunggu_pagi_final.webp",
            songTitles: [
                "Surfaces — Sunday Best",
                "Harry Styles — As It Was",
                "Lauv — I Like Me Better",
                "Pamungkas — To The Bone",
                "Tulus — Hati-Hati di Jalan",
                "Bruno Mars — The Lazy Song",
                "Maroon 5 — Sugar",
                "Pharrell Williams — Happy",
                "American Authors — Best Day of My Life",
                "Coldplay — Viva La Vida"
            ]
        },
        {
            id: "tentang-dia",
            title: "Tentang Dia",
            description: "Echoes of memory and the feeling of home.",
            philosophy: "Memory is a way of holding on to the things you love, the things you are, the things you never want to lose.",
            schedule: "Late Night / Rainy",
            vibes: ["Nostalgic", "Love", "Acoustic"],
            coverColor: "#be185d",
            coverImage: "/images/playlists/playlist_tentang_dia_final.webp",
            songTitles: [
                "Lewis Capaldi — Someone You Loved",
                "Olivia Rodrigo — Happier",
                "Conan Gray — Memories",
                "James Arthur — Impossible",
                "NaFF — Terendap Laraku",
                "Sheila On 7 — Dan",
                "Kerispatih — Tapi Bukan Aku",
                "The Script — The Man Who...",
                "Lewis Capaldi — Before You Go",
                "Harry Styles — Sign of the Times"
            ]
        }
    ];

    console.log(`Found ${playlistCategories.length} playlists. Migrating...`);

    for (const pl of playlistCategories) {
        const playlist = await prisma.playlist.upsert({
            where: { slug: pl.id },
            update: {
                title: pl.title,
                description: pl.description,
                philosophy: pl.philosophy,
                schedule: pl.schedule,
                vibes: pl.vibes,
                coverColor: pl.coverColor,
                coverImage: pl.coverImage,
            },
            create: {
                slug: pl.id,
                title: pl.title,
                description: pl.description,
                philosophy: pl.philosophy,
                schedule: pl.schedule,
                vibes: pl.vibes,
                coverColor: pl.coverColor,
                coverImage: pl.coverImage,
            },
        });

        // Link songs
        console.log(`Linking songs for playlist: ${pl.title}...`);
        for (const songTitle of pl.songTitles) {
            const song = await prisma.song.findFirst({
                where: { title: { contains: songTitle, mode: 'insensitive' } }
            });

            if (song) {
                await prisma.playlistSong.upsert({
                    where: {
                        playlistId_songId: {
                            playlistId: playlist.id,
                            songId: song.id,
                        },
                    },
                    update: {},
                    create: {
                        playlistId: playlist.id,
                        songId: song.id,
                    },
                });
            } else {
                console.warn(`[WARN] Song not found in DB: ${songTitle}`);
            }
        }
    }

    console.log('--- Migration Completed Successfully ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
