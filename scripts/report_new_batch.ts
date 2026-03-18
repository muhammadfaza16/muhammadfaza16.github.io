import * as fs from 'fs';
import * as path from 'path';

const SOURCE_DIR = path.join(process.cwd(), 'public', 'audio', 'new song to populate');

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
        /\(.*?\)/g // generic paren removal for safety
    ];

    for (const pattern of junkPatterns) {
        name = name.replace(pattern, '');
    }

    name = name.trim();

    // 2. Extract Artist and Title
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
        // Known missing artists
        if (name.toLowerCase() === 'hidup untukmu, mati tanpamu' || name.toLowerCase() === 'hidup untukmu, mati tanpamu ') {
            artist = 'Noah';
            title = 'Hidup Untukmu, Mati Tanpamu';
        } else {
            artist = 'Unknown';
            title = name;
        }
    }

    // 3. Smart Casing & Specific Formatting
    artist = toTitleCase(artist);
    title = toTitleCase(title);

    // Specific corrections
    if (artist.toLowerCase() === 'd\'masiv') artist = "D'Masiv";
    if (artist.toLowerCase() === 'st12') artist = "ST12";
    if (artist.toLowerCase() === 'naff') artist = "Naff";
    if (artist.toLowerCase() === 'kangen band') artist = "Kangen Band";
    if (artist.toLowerCase() === 'sheila on 7') artist = "Sheila On 7";

    // Reconstruct final title
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

    const files = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.mp3'));
    
    let md = '# Normalization Report: 69 New Songs\n\n';
    md += 'I have automatically cleaned the filenames, removed junk tags like "Official Music Video", and applied smart capitalization.\n\n';
    md += '| Original File | Proposed Final Title | Proposed Slug |\n';
    md += '| :--- | :--- | :--- |\n';

    for (const file of files) {
        const { finalTitle, slug } = cleanTitle(file);
        md += `| \`${file}\` | **${finalTitle}** | \`${slug}\` |\n`;
    }

    md += '\n## Next Steps\n';
    md += 'If this looks perfect, approve it and I will ingest them directly into the "Indo Hits" playlist!\n';

    const reportPath = path.join(process.cwd(), 'new_batch_report.md');
    fs.writeFileSync(reportPath, md);
    console.log('Report generated at', reportPath);
}

main().catch(console.error);
