import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

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

const JUNK_KEYWORDS = [
    "official", "video", "lyrics", "lirik", "remastered", "indonesia", "indo version", "@", "remix", "tiktok", "clip", "mv"
];

async function deepAudit() {
    const songs = await prisma.song.findMany({ orderBy: { title: 'asc' } });
    
    const report: any = {
        swapped: [],
        junk: [],
        mislabeled: [],
        duplicates: [],
        total: songs.length
    };

    const seenTitles = new Set();

    for (const song of songs) {
        const title = song.title;
        const titleLower = title.toLowerCase();

        // 1. Detect Swaps (Artist — Title)
        const parts = title.split(' — ');
        if (parts.length === 2) {
            const first = parts[0].trim().toLowerCase();
            const second = parts[1].trim().toLowerCase();
            
            const isFirstArtist = COMMON_ARTISTS.some(a => first.includes(a.toLowerCase()));
            const isSecondArtist = COMMON_ARTISTS.some(a => second.includes(a.toLowerCase()));
            
            if (isSecondArtist && !isFirstArtist) {
                report.swapped.push({ original: title, suggestion: `${parts[1]} — ${parts[0]}` });
            }
        }

        // 2. Detect Junk
        if (JUNK_KEYWORDS.some(k => titleLower.includes(k))) {
            report.junk.push({ title, keywords: JUNK_KEYWORDS.filter(k => titleLower.includes(k)) });
        }

        // 3. Detect Mislabeling (cross-check keyword vs label)
        const hasSpedUpKeyword = /(speed up|sped up)/i.test(titleLower);
        const hasSlowedKeyword = /slowed/i.test(titleLower);
        
        if (hasSpedUpKeyword && hasSlowedKeyword) {
             report.mislabeled.push({ title, reason: "Conflicting labels (Sped vs Slowed) in same title" });
        } else if (hasSpedUpKeyword && titleLower.includes("slowed")) {
             // This is handled by above, but more specific:
             report.mislabeled.push({ title, reason: "Contains Sped Up keyword but currently has Slowed format" });
        }

        // 4. Detect Potential Duplicates (Loose check)
        const normalized = titleLower.replace(/[^a-z0-9]/g, '');
        if (seenTitles.has(normalized)) {
            report.duplicates.push(title);
        }
        seenTitles.add(normalized);
    }

    let output = "# Deep Title Audit Report\n\n";
    output += `Total Songs Audited: ${report.total}\n\n`;

    output += "## 🔄 Swapped (Artist — Titlekebalik)\n";
    if (report.swapped.length === 0) output += "- None found\n";
    report.swapped.forEach((s: any) => output += `- **${s.original}** -> Suggestion: *${s.suggestion}*\n`);

    output += "\n## ⚠️ Mislabeled (e.g. Sped Up tp Slowed/Reverb)\n";
    if (report.mislabeled.length === 0) output += "- None found\n";
    report.mislabeled.forEach((s: any) => output += `- **${s.title}**: ${s.reason}\n`);

    output += "\n## 🗑️ Junk Keywords (Official, Video, Indonesia, etc.)\n";
    if (report.junk.length === 0) output += "- None found\n";
    report.junk.forEach((s: any) => output += `- **${s.title}** (Keywords: ${s.keywords.join(', ')})\n`);

    output += "\n## 👯 Potential Duplicates\n";
    if (report.duplicates.length === 0) output += "- None found\n";
    report.duplicates.forEach((s: any) => output += `- ${s}\n`);

    fs.writeFileSync('deep_audit_report.md', output);
    console.log("Deep audit report generated: deep_audit_report.md");
}

deepAudit().catch(console.error).finally(() => prisma.$disconnect());
