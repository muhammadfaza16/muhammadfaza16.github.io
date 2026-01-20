const fs = require('fs');
const path = require('path');

const audioDir = 'd:\\proyek-opus-4.5\\personal-page\\public\\audio';
const audioContextPath = 'd:\\proyek-opus-4.5\\personal-page\\src\\components\\AudioContext.tsx';

const files = fs.readdirSync(audioDir);
const audioContextContent = fs.readFileSync(audioContextPath, 'utf8');

// Extract URLs from AudioContext
const playlistRegex = /audioUrl:\s*["']([^"']+)["']/g;
const playlistUrls = [];
let match;
while ((match = playlistRegex.exec(audioContextContent)) !== null) {
    // Decode URI component and remove /audio/ prefix
    const decoded = decodeURIComponent(match[1]).replace(/^\/audio\//, '');
    playlistUrls.push(decoded);
}

console.log('Total files in directory:', files.length);
console.log('Total entries in playlist:', playlistUrls.length);

const orphanFiles = files.filter(file => !playlistUrls.includes(file));

console.log('Orphan files (not in playlist):');
orphanFiles.forEach(f => console.log(f));
