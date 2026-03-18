import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const SOURCE_DIR = path.join(__dirname, '../public/audio/new song to populate');
const DEST_DIR = path.join(__dirname, '../public/audio');

function cleanFileName(filename: string) {
    let name = filename.replace(/\.mp3$/i, '');
    
    // Detect special versions
    const isSlowedReverb = /(slowed|reverb)/i.test(name);
    const isSpedUp = /(speed up|sped up)/i.test(name);

    // Remove common suffixes and garbage
    name = name.replace(/\(Lyrics\)/gi, '')
               .replace(/\[lirik\]/gi, '')
               .replace(/\[lyrics\]/gi, '')
               .replace(/Lagu pop Indonesia terbaru 2023/gi, '')
               .replace(/\[Official MV\]/gi, '')
               .replace(/\[ Lagu Lirik \]/gi, '')
               .replace(/\(Video Clip\)/gi, '')
               .replace(/\[.*?\]/g, '') // Remove brackets like YouTube IDs
               .replace(/\(Official Audio\)/gi, '')
               .replace(/\(Official Music Video\)/gi, '')
               .replace(/\(Lirik\)/gi, '')
               .replace(/\(Lirik Video\)/gi, '')
               .replace(/Lirik Lagu/gi, '')
               .replace(/Lirik/gi, '')
               .replace(/LAGU NOSTALGIA TERBAIK #lyrics/gi, '')
                .replace(/SlowedReverb/gi, '')
                .replace(/Tiktok.*$/gi, '')
                .replace(/@[\w\d_]+/g, '')
               .replace(/slowed\s*(&|\+|and)?\s*reverb/gi, '')
               .replace(/slowed version/gi, '')
               .replace(/slowed/gi, '')
               .replace(/sped upunderwater/gi, '')
               .replace(/speed up - tiktok version/gi, '')
               .replace(/\(\s*\)/g, '')
               .replace(/  +/g, ' ')
               .trim();

    // Specific Fixes for filenames before splitting
    if (name.includes('Ada Apa Dengan Cinta (feat. Eric Erlangga)')) {
        name = 'Melly Goeslaw - Ada Apa Dengan Cinta (feat. Eric Erlangga)';
    }
    if (name.includes('Hari ini,Esok dan SeterusnyaHES')) {
        name = 'Acha Septriasa - Hari Ini Esok Dan Seterusnya';
    }
    if (name.includes('Sampai Menutup Mata') && !name.toLowerCase().includes('acha')) {
        name = 'Acha Septriasa - Sampai Menutup Mata';
    }
    if (name.includes('Meskipun engkau telah pergi Mungkin takkan kembaliMengejar Mimpi')) {
        name = 'Yovie & Nuno - Mengejar Mimpi';
    }
    if (name.includes('CINTA YANG LAIN UNGU')) {
        name = 'Ungu - Cinta Yang Lain';
    }
    if (name.includes('Bahagia Lagi')) {
        name = 'Piche Kota - Bahagia Lagi';
    }
    if (name.includes('Jangan Paksa Rindu (Beda)')) {
        name = 'Ifan 17 - Jangan Paksa Rindu (Beda)';
    }
    if (name.includes('Mangu')) {
        name = 'Hindia - Mangu';
    }
    if (name.includes('Semua Tak Sama') && !name.toLowerCase().includes('padi')) {
        name = 'Padi - Semua Tak Sama';
    }



    // Medley detection (x separator)
    const isMedley = name.includes(' x ') || name.includes(' X ') || name.includes(' x ');

    // Check if artist and title are separated by "-"
    let artist = '';
    let title = name;
    
    if (isMedley) {
        artist = 'Medley';
        title = name.replace(/medley/gi, '').trim();
    } else if (name.includes('-')) {
        const splitStr = name.includes(' - ') ? ' - ' : '-';
        const parts = name.split(splitStr);
        if (parts.length >= 2) {
            // Heuristic Check: Is it Title - Artist?
            // "Anima - Bintang" -> Artist - Title (Standard)
            // "Aku Lelakimu - Virzha" -> Title - Artist (Wrong)
            const p1 = parts[0].trim();
            const p2 = parts[1].trim();
            
            const commonWrongOrder = ['Virzha', 'Cassandra', 'Nidji', 'Fiersa Besari', 'Seventeen'];
            const isWrongOrder = commonWrongOrder.some(a => p2.toLowerCase() === a.toLowerCase() || p2.toLowerCase().includes(a.toLowerCase()));
            
            if (isWrongOrder) {
                artist = p2;
                title = p1;
            } else {
                artist = p1;
                title = p2;
            }
        }
    }

    // Capitalize smartly if it's all lowercase
    if (artist === artist.toLowerCase()) {
        artist = artist.replace(/\b\w/g, c => c.toUpperCase());
    }
    if (title === title.toLowerCase()) {
        title = title.replace(/\b\w/g, c => c.toUpperCase());
    }

    let finalTitleStr = artist ? `${artist} — ${title}` : title;
    
    if (isSlowedReverb) {
        finalTitleStr += ' (Slowed & Reverb)';
    } else if (isSpedUp) {
        finalTitleStr += ' (Sped Up)';
    }

    // Fix specific labels/naming inconsistencies
    finalTitleStr = finalTitleStr
        .replace(/Acha Septriasa — Acha Septriasa/gi, 'Acha Septriasa')
        .replace(/Acha —/gi, 'Acha Septriasa —');

    // Fix some known weird ones
    if (finalTitleStr.includes("Aku Lelakimu — Virzha")) {
        finalTitleStr = "Virzha — Aku Lelakimu";
    }
    if (finalTitleStr.includes("Hujan Kemarin — Taxi Band")) {
        finalTitleStr = "Taxi Band — Hujan Kemarin";
    }

    // Sanitize file name for URL (Slugify)
    const safeFileName = finalTitleStr
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '') + '.mp3';

    return { finalTitleStr, safeFileName };
}

function categorize(title: string) {
    const INDO_KEYWORDS = [
        'cinta', 'rindu', 'hati', 'kasih', 'sayang', 'jangan', 'kau', 'aku', 'kita', 'kami', 'mereka',
        'bintang', 'langit', 'bumi', 'malam', 'pagi', 'siang', 'sore', 'resah', 'luka', 'sepuh', 'sempurna',
        'terbaik', 'bahagia', 'sedih', 'berjalan', 'pulang', 'pergi', 'kembali', 'menunggu', 'tetap', 'usai'
    ];

    const INDO_ARTISTS = [
        'Sheila on 7', 'Noah', 'Ungu', 'Samsons', 'D\'masiv', 'St12', 'Hijau Daun', 'Vagetoz', 
        'Vierra', 'Virgoun', 'Virzha', 'Wali', 'Slam', 'Exists', 'Exist', 'Spoon', 'Screen', 'Ukays', 
        'Ella', 'Stings', 'Taxi', 'Taxi Band', 'Utopia', 'Last Child', 'Lyodra', 'Andra', 'Dewa', 
        'Tulus', 'Risalah', 'Andmesh', 'Bernadya', 'Budi Doremi', 'Daun Jatuh', 'Feast', 'Firman', 
        'Ghea Indrawari', 'Keisya Levronka', 'Mahen', 'Nadhif Basalamah', 'Padi', 'Pamungkas', 
        'Panji Sakti', 'Peterpan', 'The Lantis', 'Barasuara', 'Lobow', 'Feby Putri', 'Fiersa Besari',
        'Hindia', 'Mangu', 'Acha', 'Melly Goeslaw', 'Astrid', 'Gigi', 'Yovie', 'Nuno', 'Ifan 17', 'Piche Kota'
    ];

    const lower = title.toLowerCase();
    if (INDO_ARTISTS.some(a => lower.includes(a.toLowerCase()))) return 'Indo';
    if (INDO_KEYWORDS.some(k => lower.includes(k))) return 'Indo';
    return 'Luar';
}


async function main() {
    if (!fs.existsSync(SOURCE_DIR)) {
        console.error("Source directory not found:", SOURCE_DIR);
        return;
    }

    const files = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.mp3'));
    console.log(`Found ${files.length} mp3 files to process.`);

    for (const file of files) {
        const oldPath = path.join(SOURCE_DIR, file);
        const { finalTitleStr, safeFileName } = cleanFileName(file);
        const newPath = path.join(DEST_DIR, safeFileName);

        console.log(`Processing: "${file}"`);
        console.log(`  -> Title: ${finalTitleStr}`);
        console.log(`  -> File : ${safeFileName}`);

        // Move/rename file
        if (!fs.existsSync(newPath)) {
            fs.renameSync(oldPath, newPath);
        } else {
            console.log(`  -> File already exists at destination, replacing/skipping.`);
            fs.renameSync(oldPath, newPath); // overwrite
        }

        const audioUrl = `/audio/${safeFileName}`; 
        const category = categorize(finalTitleStr);

        // Upsert into DB
        const songRecord = await prisma.song.findFirst({
            where: { audioUrl }
        });

        if (!songRecord) {
            await prisma.song.create({
                data: {
                    title: finalTitleStr,
                    audioUrl: audioUrl,
                    source: "local",
                    category: category
                }
            });
            console.log(`  -> Added to database (${category}).`);
        } else {
            await prisma.song.update({
                where: { id: songRecord.id },
                data: { 
                    title: finalTitleStr,
                    category: category
                }
            });
            console.log(`  -> Updated database record (${category}).`);
        }

    }

    console.log("Done processing all songs.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
