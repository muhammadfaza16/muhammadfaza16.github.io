import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const INDO_KEYWORDS = [
    "cinta", "hati", "kamu", "aku", "satu", "kita", "yang", "kau", "tuk", "ini", "esok", "seterusnya", 
    "mencintaimu", "tinggal", "duka", "hujan", "kemarin", "pesan", "terakhir", "lagu", "tentang", 
    "rindu", "melawan", "restu", "kisah", "sempurna", "menunggu", "bayang", "mimpi", "pulang",
    "bertaut", "lantas", "abadi", "sampai", "menutup", "mata", "luka", "suara", "berharap",
    "buih", "permadani", "mencari", "alasan", "gerimis", "mengundang", "sembilu", "serana",
    "kenang", "pergilah", "kasih", "melepasmu", "bersama", "bintang", "merindukanmu", "merindukan",
    "pelan", "sejauh", "mungkin", "luka", "demi", "waktu", "dalam", "asmara", "kehadiranmu",
    "betapa", "mencintaimu", "kesepian", "baik", "selamat", "tentang", "pernah", "ada",
    "jangan", "pergi", "hanya", "ingin", "tahu", "hingga", "akhir"
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
    "drive", "ipang", "sal priadi", "nadhif basalamah", "acha septriasa", "melly goeslaw", "ungu", 
    "cassandra", "eclat", "hivi", "juicy luicy", "sal priadi", "rio clappy", "batas senja", "dendi nata",
    "ipang", "raim laode", "andra and the backbone", "andra & the backbone", "vierra", "setia band",
    "last child", "virgoun", "stings", "ukays", "iklim", "exist", "exists", "slam", "spoon", "ukays",
    "lestari", "poppy mercury", "angga binandra", "astrid", "bagindas", "bondan prakoso", "daun jatuh",
    "david bayu", "drive", "element", "eren", "fredy", "geisha", "hal", "hijau daun", "jikustik", "judika",
    "kotak", "la luna", "lobow", "lyla", "maudy ayunda", "nineball", "padi", "repvblik", "samsons", "utopia"
];

async function analyze() {
    const songs = await prisma.song.findMany();
    const result: any = {
        indo: [],
        luar: [],
        uncertain: []
    };

    for (const song of songs) {
        const titleLower = song.title.toLowerCase();
        let score = 0;

        // Artist check
        if (INDO_ARTISTS.some(artist => titleLower.includes(artist))) {
            score += 10;
        }

        // Keyword check
        INDO_KEYWORDS.forEach(kw => {
            if (new RegExp(`\\b${kw}\\b`, 'i').test(titleLower)) score += 2;
        });
        LUAR_KEYWORDS.forEach(kw => {
            if (new RegExp(`\\b${kw}\\b`, 'i').test(titleLower)) score -= 2;
        });

        if (score > 1) {
            result.indo.push({ title: song.title, score });
        } else if (score < -1) {
            result.luar.push({ title: song.title, score });
        } else {
            result.uncertain.push({ title: song.title, score });
        }
    }

    // Sort by score
    result.indo.sort((a: any, b: any) => b.score - a.score);
    result.luar.sort((a: any, b: any) => a.score - b.score);

    let output = "# Proposed Song Categorization\n\n";
    output += `Total Analyzed: ${songs.length}\n`;
    output += `- Indo: ${result.indo.length}\n`;
    output += `- Luar: ${result.luar.length}\n`;
    output += `- Uncertain: ${result.uncertain.length}\n\n`;

    output += "## 🇮🇩 Indo (Proposed)\n";
    result.indo.forEach((s: any) => output += `- ${s.title}\n`);

    output += "\n## 🌐 Luar (Proposed)\n";
    result.luar.forEach((s: any) => output += `- ${s.title}\n`);

    output += "\n## ❓ Uncertain (Needs Manual Check)\n";
    result.uncertain.forEach((s: any) => output += `- ${s.title}\n`);

    fs.writeFileSync(path.join(process.cwd(), 'proposed_categories.md'), output);
    console.log("Analysis written to proposed_categories.md");
}

analyze().catch(console.error).finally(() => prisma.$disconnect());
