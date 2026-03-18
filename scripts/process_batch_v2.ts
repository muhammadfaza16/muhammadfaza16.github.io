import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const SOURCE_DIR = path.join(process.cwd(), 'public', 'audio', 'new song to populate');
const TARGET_DIR = path.join(process.cwd(), 'public', 'audio');

function toTitleCase(str: string): string {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

function cleanTitle(filename: string): { artist: string, title: string, finalTitle: string, slug: string } {
    let name = filename.replace(/\.mp3$/i, '');

    // 1. Remove Junk Words (Longest first)
    const junkPatterns = [
        /\(Official Music Video NAGASWARA\)/gi,
        /\(Official Music Video\)/gi,
        /Official Music Video/gi,
        /\(Official Video Clip\)/gi,
        /Official Video Clip/gi,
        /\(Official Lyric Video\)/gi,
        /Official Lyric Video/gi,
        /\(Official Video\)/gi,
        /Official Video/gi,
        /\(Official Audio\)/gi,
        /Official Audio/gi,
        /\(Video Clip\)/gi,
        /Video Clip/gi,
        /\(Lirik\)/gi,
        /Lirik/gi,
        /Official 4K Remastered Video/gi,
        /VC Trinity/gi,
        /UNGUofficial/gi,
        /NAGASWARA/gi,
        /#music/gi,
        /\[.*?\]/g,
        /\(.*?\)/g
    ];

    for (const pattern of junkPatterns) {
        name = name.replace(pattern, '');
    }

    name = name.trim();

    let artist = '';
    let title = '';

    if (name.includes(' - ')) {
        const parts = name.split(' - ');
        artist = parts[0].trim();
        title = parts.slice(1).join(' - ').trim();
    } else if (name.includes('-')) {
        const parts = name.split('-');
        artist = parts[0].trim();
        title = parts.slice(1).join('-').trim();
    } else {
        if (name.toLowerCase() === 'hidup untukmu, mati tanpamu' || name.toLowerCase() === 'hidup untukmu, mati tanpamu ') {
            artist = 'Noah';
            title = 'Hidup Untukmu, Mati Tanpamu';
        } else {
            artist = 'Unknown';
            title = name;
        }
    }

    artist = toTitleCase(artist);
    title = toTitleCase(title);

    if (artist.toLowerCase() === 'd\'masiv') artist = "D'Masiv";
    if (artist.toLowerCase() === 'st12') artist = "ST12";
    if (artist.toLowerCase() === 'naff') artist = "Naff";
    if (artist.toLowerCase() === 'kangen band') artist = "Kangen Band";
    if (artist.toLowerCase() === 'sheila on 7') artist = "Sheila On 7";

    const finalTitle = `${artist} — ${title}`.trim().replace(/\s+/g, ' ');

    const slug = finalTitle
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '') + '.mp3';

    return { artist, title, finalTitle, slug };
}

async function main() {
    if (!fs.existsSync(SOURCE_DIR)) {
        console.error("Directory not found:", SOURCE_DIR);
        return;
    }
    if (!fs.existsSync(TARGET_DIR)) {
        fs.mkdirSync(TARGET_DIR, { recursive: true });
    }

    const files = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.mp3'));

    for (const file of files) {
        const { finalTitle, slug } = cleanTitle(file);
        const sourcePath = path.join(SOURCE_DIR, file);
        const targetPath = path.join(TARGET_DIR, slug);
        const dbUrl = `/audio/${slug}`;

        console.log(`Processing: "${file}"`);
        console.log(`  -> Title: ${finalTitle}`);
        console.log(`  -> File : ${slug}`);

        fs.renameSync(sourcePath, targetPath);

        const songRecord = await prisma.song.findFirst({
            where: { audioUrl: dbUrl }
        });

        if (!songRecord) {
            await prisma.song.create({
                data: {
                    title: finalTitle,
                    audioUrl: dbUrl,
                    source: "local",
                    category: 'Indo' // All newly added are Indo
                }
            });
            console.log(`  -> Added to DB (Indo)`);
        } else {
            await prisma.song.update({
                where: { id: songRecord.id },
                data: {
                    title: finalTitle,
                    category: 'Indo'
                }
            });
            console.log(`  -> Updated DB (Indo)`);
        }
    }

    console.log(`\nSuccessfully ingested ${files.length} songs.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
