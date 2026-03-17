
const fs = require('fs');
const path = require('path');

const audioDir = path.join(process.cwd(), 'public', 'audio');
const files = fs.readdirSync(audioDir);

files.slice(0, 20).forEach(file => {
    let dashInfo = [];
    for (let i = 0; i < file.length; i++) {
        const char = file[i];
        if (char === '-' || char === '—' || char === '–') {
            dashInfo.push(`'${char}' (U+${char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')})`);
        }
    }
    console.log(`${file}: ${dashInfo.join(', ')}`);
});
