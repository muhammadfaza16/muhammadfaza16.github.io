import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const AUDIO_DIR = path.join(process.cwd(), 'public/audio');

const COMMON_ARTISTS = [
    "Sheila On 7", "Peterpan", "Noah", "Ungu", "Tulus", "Raisa", "Isyana", "Mahalini", "Lyodra", 
    "Andmesh", "Virzha", "Fiersa Besari", "Nadin Amizah", "Sal Priadi", "Naif", "Nidji", "Kangen Band", 
    "ST12", "Setia Band", "Armada", "Seventeen", "D'masiv", "Kerispatih", "Naff", "Vagetoz", 
    "Drive", "Ipang", "Sal Priadi", "Nadhif Basalamah", "Acha Septriasa", "Melly Goeslaw", 
    "Cassandra", "Eclat", "Hivi!", "Juicy Luicy", "Rio Clappy", "Batas Senja", "Dendi Nata",
    "Raim Laode", "Andra & The Backbone", "Vierra", "Last Child", "Virgoun", "Stings", "Ukays", 
    "Iklim", "Exist", "Exists", "Slam", "Spoon", "Lestari", "Poppy Mercury", "Astrid", "Bagindas", 
    "Bondan Prakoso", "Daun Jatuh", "David Bayu", "Element", "Eren", "Fredy", "Geisha", "Hal", 
    "Hijau Daun", "Jikustik", "Judika", "Kotak", "La Luna", "Lobow", "Lyla", "Maudy Ayunda", 
    "Nineball", "Padi", "Repvblik", "Samsons", "Utopia", "Twenty One Pilots", "Alan Walker",
    "Bruno Mars", "The Weeknd", "Coldplay", "Imagine Dragons", "Justin Bieber", "Selena Gomez",
    "Ariana Grande", "Ed Sheeran", "Lewis Capaldi", "Harry Styles", "One Direction", "The Script"
];

const JUNK_PATTERNS = [
    /\(?Official Music Video\)?/gi,
    /\(?Official Audio\)?/gi,
    /\(?Official Lyric Video\)?/gi,
    /\(?Official Video\)?/gi,
    /\(?video official\)?/gi,
    /\(?Video Clip\)?/gi,
    /\(?Lirik Video\)?/gi,
    /\(?video lyrics\)?/gi,
    /\(?Lirik\)?/gi,
    /\(?Lyrics\)?/gi,
    /\(?Video\s*\s*\)?/gi,
    /\[Official MV\]/gi,
    /\[Lyrics\]/gi,
    /with lyrics/gi,
    /\(?OST\..*?\)?/gi,
    /\(?Indo Version\)?/gi,
    /\(?Remastered.*?\)?/gi,
    /Indonesia$/gi,
    /TikTok Version/gi,
    /@[\w\d_]+/g,
    /underwater/gi,
    /underwater/gi
];

function smartTitleCase(str: string) {
    const special: { [key: string]: string } = {
        "st12": "ST12",
        "hivi": "HIVI!",
        "d'masiv": "d'Masiv",
        "dmasiv": "d'Masiv",
        "ost": "OST"
    };
    
    return str.toLowerCase().split(' ').map(word => {
        if (special[word]) return special[word];
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
}

function cleanTitleAdvanced(fullTitle: string) {
    let text = fullTitle;
    
    // 0. Manual Swap Overrides (Hardcoded for confirmed errors)
    if (text.toLowerCase().includes("jauh mimpiku — peterpan")) text = "Peterpan — Jauh Mimpiku";
    if (text.toLowerCase().includes("sephia — sheila on 7")) text = "Sheila On 7 — Sephia";
    if (text.toLowerCase().includes("tapi tahukah kamu_ — dygta ft. kamasean")) text = "Dygta — Tapi Tahukah Kamu (feat. Kamasean)";
    if (text.toLowerCase().includes("ride — twenty one pilots")) text = "Twenty One Pilots — Ride";
    if (text.toLowerCase().includes("the — weeknd ariana grande save your tears")) text = "The Weeknd & Ariana Grande — Save Your Tears";
    if (text.toLowerCase().includes("lovarian — perpisahan termanis x samsons - kenangan terindah")) text = "Samsons & Lovarian — Kenangan Terindah X Perpisahan Termanis";

    // 1. Identify Labels first
    const isSpedUp = /(speed up|sped up)/i.test(text);
    // Only set slowed/reverb if NOT sped up (to avoid mislabeling sped up as slowed)
    const isSlowed = !isSpedUp && /slowed/i.test(text);
    const isReverb = !isSpedUp && /reverb/i.test(text);
    
    // 2. Initial Junk Removal (Standard keywords)
    JUNK_PATTERNS.forEach(p => text = text.replace(p, ''));
    
    // 3. Remove "Slowed", "Reverb", "Sped up" from the clean title string
    text = text.replace(/(slowed|reverb|speed up|sped up)/gi, '');
    
    // 4. Handle Artist — Title Split
    let artist = "Unknown Artist";
    let title = text;
    
    const separators = [" — ", " - ", " —", "— ", "—"];
    for (const sep of separators) {
        if (text.includes(sep)) {
            const parts = text.split(sep);
            artist = parts[0].trim();
            title = parts.slice(1).join(sep).trim();
            break;
        }
    }
    
    // 5. Artist-Title Swap Heuristic (secondary check)
    const artistLower = artist.toLowerCase();
    const titleLower = title.toLowerCase();
    const isArtistKnown = COMMON_ARTISTS.some(a => artistLower.includes(a.toLowerCase()));
    const isTitleKnown = COMMON_ARTISTS.some(a => titleLower.includes(a.toLowerCase()));
    
    if (isTitleKnown && !isArtistKnown) {
        [artist, title] = [title, artist];
    }
    
    // 6. Cleanup Junk from Artist and Title specifically
    const cleanFn = (s: string) => {
        let res = s;
        JUNK_PATTERNS.forEach(p => res = res.replace(p, ''));
        res = res.replace(/\(.*?\)/g, '').replace(/\[.*?\]/g, '').replace(/\{.*?\}/g, '');
        res = res.replace(/_$/, '').replace(/  +/g, ' ').trim();
        return res;
    };

    artist = cleanFn(artist);
    title = cleanFn(title);

    // 7. Cleanup remaining bits (like "X" at end or start)
    artist = artist.replace(/^[xX]\s+/, '').replace(/\s+[xX]$/, '');
    title = title.replace(/^[xX]\s+/, '').replace(/\s+[xX]$/, '');

    // 8. Smart Casing
    artist = smartTitleCase(artist);
    title = smartTitleCase(title).replace(/\bTo\b/g, 'to');

    // 9. Reconstruct Labels (Label Guard)
    let labels = [];
    if (isSpedUp) {
        labels.push("Sped Up");
    } else {
        if (isSlowed && isReverb) labels.push("Slowed & Reverb");
        else if (isSlowed) labels.push("Slowed");
        else if (isReverb) labels.push("Reverb");
    }

    const labelStr = labels.length > 0 ? ` (${labels.join(', ')})` : "";

    return `${artist} — ${title}${labelStr}`;
}

function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '') + '.mp3';
}

async function fixV2() {
    console.log("--- Starting Library Fix V2 ---");
    const songs = await prisma.song.findMany();
    const filesOnDisk = fs.readdirSync(AUDIO_DIR).filter(f => f.endsWith('.mp3'));
    const filesOnDiskSet = new Set(filesOnDisk);
    
    const seen = new Set();
    const toDelete = [];

    for (const song of songs) {
        let newTitle = cleanTitleAdvanced(song.title);
        
        // Deduplication Logic
        if (seen.has(newTitle)) {
            console.log(`[DUP] Deleting duplicate: ${newTitle}`);
            toDelete.push(song.id);
            continue;
        }
        seen.add(newTitle);

        // Check if file match exists for the new title (slug)
        const expectedSlug = slugify(newTitle);
        let newAudioUrl = song.audioUrl;

        if (filesOnDiskSet.has(expectedSlug)) {
            newAudioUrl = `/audio/${expectedSlug}`;
        }

        if (newTitle !== song.title || newAudioUrl !== song.audioUrl) {
            console.log(`[FIX] Title: ${song.title} -> ${newTitle} | URL: ${song.audioUrl} -> ${newAudioUrl}`);
            await prisma.song.update({
                where: { id: song.id },
                data: { 
                    title: newTitle,
                    audioUrl: newAudioUrl
                }
            });
        }
    }

    // Process deletions
    if (toDelete.length > 0) {
        await prisma.song.deleteMany({
            where: { id: { in: toDelete } }
        });
    }

    console.log("--- Library Fix V2 Finished ---");
}

fixV2()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
