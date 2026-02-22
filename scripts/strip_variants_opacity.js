const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

let modifiedCount = 0;

walkDir('./src/app/guest/no28', (filePath) => {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        // Replace `hidden: { opacity: 0 }` with `hidden: { opacity: 1 }`
        content = content.replace(/hidden:\s*\{\s*opacity:\s*0\s*\}\s*,?/g, 'hidden: { opacity: 1 },');

        // Replace `hidden: { opacity: 0, ... }` with `hidden: { opacity: 1, ... }`
        content = content.replace(/hidden:\s*\{\s*opacity:\s*0\s*,/g, 'hidden: { opacity: 1,');

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            modifiedCount++;
            console.log(`[PATCHED VARIANTS] Stripped opacity delay in ${filePath}`);
        }
    }
});

console.log(`Successfully neutralized ${modifiedCount} file(s) for instant rendering in guest/no28.`);
