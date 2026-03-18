import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const INDO_KEYWORDS = [
    "cinta", "hati", "kamu", "aku", "satu", "kita", "yang", "kau", "tuk", "ini", "esok", "seterusnya", 
    "mencintaimu", "tinggal", "duka", "hujan", "kemarin", "pesan", "terakhir", "lagu", "tentang", 
    "rindu", "melawan", "restu", "kisah", "sempurna", "menunggu", "bayang", "mimpi", "pulang",
    "bertaut", "lantas", "abadi", "sampai", "menutup", "mata", "luka", "suara", "berharap",
    "buih", "permadani", "mencari", "alasan", "gerimis", "mengundang", "sembilu", "serana",
    "kenang", "pergilah", "kasih", "melepasmu", "bersama", "bintang", "merindukanmu", "merindukan",
    "pelan", "sejauh", "mungkin", "luka", "waktu", "dalam", "asmara", "kehadiranmu",
    "betapa", "kesepian", "selamat", "pernah", "ada",
    "jangan", "pergi", "hanya", "ingin", "hingga", "akhir"
];


const LUAR_KEYWORDS = [
    "love", "you", "me", "night", "stars", "hymn", "weekend", "dreams", "sky", "high", "stereo", 
    "alone", "faded", "lily", "play", "spectre", "homicide", "memories", "glimpse", "us", 
    "back", "friends", "save", "tears", "good", "bad", "liar", "sweet", "psycho", "kings", "queens", 
    "it", "will", "rain", "locked", "heaven", "talking", "moon", "shameless", "never", "same", 
    "apocalypse", "cry", "im", "blue", "rewrite", "impossible", "ghost", "somewhere", "only", 
    "we", "know", "7", "years", "chamber", "reflection", "pill", "ibiza", "happier", "way", 
    "all", "want", "there", "nothing", "holding", "back", "angel", "baby", "dynamite", "closer",
    "dont", "let", "down", "man", "who", "superheroes", "hall", "fame", "habits", "stay", "high",
    "apologize", "hurt", "tattoo", "fearless"
];

const INDO_ARTISTS = [
    "sheila on 7", "peterpan", "noah", "ungu", "tulus", "raisa", "isayana", "mahalini", "lyodra", 
    "andmesh", "virzha", "fiersa besari", "nadin amizah", "sal priadi", "naif", "nidji", "kangen band", 
    "st12", "setia band", "armada", "seventeen", "d'masiv", "dmasiv", "kerispatih", "naff", "vagetoz", 
    "drive", "ipang", "nadhif basalamah", "acha septriasa", "melly goeslaw", 
    "cassandra", "eclat", "hivi", "juicy luicy", "rio clappy", "batas senja", "dendi nata",
    "raim laode", "andra and the backbone", "andra & the backbone", "vierra", "setia band",
    "last child", "virgoun", "stings", "ukays", "iklim", "exist", "exists", "slam", "spoon",
    "lestari", "poppy mercury", "angga binandra", "bagindas", "bondan prakoso", "daun jatuh",
    "david bayu", "element", "eren", "fredy", "geisha", "hal", "hijau daun", "jikustik", "judika",
    "kotak", "la luna", "lobow", "lyla", "maudy ayunda", "nineball", "padi", "repvblik", "samsons", "utopia",
    "dewa 19", "ari lasso", "chrisye", "glenn fredly", "rossa", "afgan", "cokelat", "slank", "ada band", "letto",
    "maliq", "fourtwnty", "the changcuters", "type-x", "shaggydog", "superman is dead", "payung teduh",
    "rizky febian", "marion jola", "fatin", "gigi", "padi band", "andra backbone"
];


const SPECIFIC_INDO = [
    "Al Ghazali — Kesayanganku",
    "Desy Ratnasari — Tenda Biru",
    "Kugiran Masdo — Dinda",
    "Dygta — Tapi Tahukah Kamu",
    "Anima — Bintang",
    "Anggis Devaki — Dirimu Yang Dulu",
    "Taxxi — Hujan Kemarin",
    "Taxi — Hujan Kemarin",
    "Wali — Baik Baik Sayang",
    "The Virgins — Cinta Terlarang"
];

const SPECIFIC_LUAR = [
    "Astrid S — Hurts So Good",
    "Demi Lovato — Heart Attack",
    "Halsey — Without Me",
    "The Script — Hall Of Fame",
    "Gigi Perez — Sailor Song",
    "Janji — Heroes Tonight",
    "hoobastank", "avicii", "maroon 5"
];


async function main() {
    console.log("Fetching songs...");
    const songs = await prisma.song.findMany();
    console.log(`Analyzing ${songs.length} songs...`);
    let countIndo = 0;
    let countLuar = 0;

    const BATCH_SIZE = 10;
    for (let i = 0; i < songs.length; i += BATCH_SIZE) {
        const batch = songs.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(async (song) => {
            let category = 'Luar';
            const titleLower = song.title.toLowerCase();
            
            // Manual Override Check
            if (SPECIFIC_INDO.some(t => song.title.toLowerCase().includes(t.toLowerCase()))) {
                category = 'Indo';
            } else if (SPECIFIC_LUAR.some(t => song.title.toLowerCase().includes(t.toLowerCase()))) {
                category = 'Luar';
            } else {
                let score = 0;
                // Artist check (case insensitive)
                if (INDO_ARTISTS.some(artist => titleLower.includes(artist.toLowerCase()))) score += 10;
                
                // Keyword check
                INDO_KEYWORDS.forEach(kw => { if (new RegExp(`\\b${kw}\\b`, 'i').test(titleLower)) score += 2; });
                LUAR_KEYWORDS.forEach(kw => { if (new RegExp(`\\b${kw}\\b`, 'i').test(titleLower)) score -= 2; });
                
                if (score > 1) category = 'Indo';
            }

            // Final check for "Twenty One Pilots — Ride" (ensuring it's Luar)
            if (song.title.toLowerCase().includes("twenty one pilots — ride") || 
                song.title.toLowerCase().includes("twenty one pilots")) {
                category = 'Luar';
            }


            // Use raw SQL to bypass outdated Prisma client types
            await prisma.$executeRawUnsafe(
                `UPDATE "Song" SET category = $1 WHERE id = $2`,
                category,
                song.id
            );

            if (category === 'Indo') countIndo++; else countLuar++;
        }));
        console.log(`Processed ${Math.min(i + BATCH_SIZE, songs.length)} / ${songs.length} songs...`);
    }

    console.log(`Successfully categorized ${songs.length} songs.`);
    console.log(`- Indo: ${countIndo}`);
    console.log(`- Luar: ${countLuar}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
