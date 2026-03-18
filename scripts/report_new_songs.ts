import * as fs from 'fs';
import * as path from 'path';

// Re-using logic from process_new_songs.ts for consistency
function cleanFileName(filename: string) {
    let name = filename.replace(/\.mp3$/i, '');
    
    // Detect special versions
    const isSlowedReverb = /(slowed|reverb)/i.test(name);
    const isSpedUp = /(speed up|sped up)/i.test(name);

    // Remove common suffixes and garbage
    name = name.replace(/\(Lyrics\)/gi, '')
               .replace(/\[lirik\]/gi, '')
               .replace(/\[lyrics\]/gi, '')
               .replace(/\(Official MV\)/gi, '')
               .replace(/\[Official MV\]/gi, '')
               .replace(/\(Official Audio\)/gi, '')
               .replace(/\(Official Music Video\)/gi, '')
               .replace(/\(Official Lyric Video\)/gi, '')
               .replace(/\(Official Video\)/gi, '')
               .replace(/\(Visualizer\)/gi, '')
               .replace(/\(Official Visualizer\)/gi, '')
               .replace(/Lirik Lagu/gi, '')
               .replace(/Lirik/gi, '')
               .replace(/#music/gi, '')
               .replace(/@[\w\d_]+/g, '')
               .replace(/  +/g, ' ')
               .trim();

    // Check if artist and title are separated by "-"
    let artist = '';
    let title = name;
    
    if (name.includes(' - ')) {
        const parts = name.split(' - ');
        artist = parts[0].trim();
        title = parts[1].trim();
    } else if (name.includes('-')) {
        const parts = name.split('-');
        artist = parts[0].trim();
        title = parts[1].trim();
    }

    // Capitalize smartly if needed (Title Case for all-caps)
    const toTitleCase = (str: string) => {
        if (str === str.toUpperCase() && str !== str.toLowerCase()) {
            return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
        }
        return str;
    };

    artist = toTitleCase(artist);
    title = toTitleCase(title);

    let finalTitleStr = artist ? `${artist} — ${title}` : title;

    
    if (isSlowedReverb) finalTitleStr += ' (Slowed & Reverb)';
    else if (isSpedUp) finalTitleStr += ' (Sped Up)';

    // Slugify
    const safeFileName = finalTitleStr
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '') + '.mp3';

    return { finalTitleStr, safeFileName };
}

// Categorization logic (re-using refined Keywords/Artists)
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
    'Hindia', 'Mangu', 'Acha', 'Melly Goeslaw', 'Astrid', 'Gigi', 'Yovie', 'Nuno'
];


function categorize(title: string) {
    const lower = title.toLowerCase();
    if (INDO_ARTISTS.some(a => lower.includes(a.toLowerCase()))) return 'Indo';
    if (INDO_KEYWORDS.some(k => lower.includes(k))) return 'Indo';
    if (lower.includes('semua tak sama')) return 'Indo';
    return 'Luar';
}


async function report() {
    const sourceDir = path.join(process.cwd(), 'public', 'audio', 'new song to populate');
    if (!fs.existsSync(sourceDir)) return;

    const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.mp3'));
    
    console.log('| Original Filename | Proposed Title | Proposed Slug | Category |');
    console.log('|-------------------|----------------|---------------|----------|');
    
    for (const file of files) {
        const { finalTitleStr, safeFileName } = cleanFileName(file);
        const category = categorize(finalTitleStr);
        console.log(`| ${file} | ${finalTitleStr} | ${safeFileName} | ${category} |`);
    }
}

report().catch(console.error);
