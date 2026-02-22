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

walkDir('./src/app', (filePath) => {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        // Replace `initial={{ opacity: 0, ...` with `initial={{ opacity: 1, ...`
        content = content.replace(/initial=\{\{\s*opacity:\s*0\s*,?/g, 'initial={{ opacity: 1,');

        // Replace exact `initial={{ opacity: 0 }}` with `initial={{ opacity: 1 }}`
        content = content.replace(/initial=\{\{\s*opacity:\s*0\s*\}\}/g, 'initial={{ opacity: 1 }}');

        // Also fix `animate-fade-in` logic in classes
        content = content.replace(/animate-fade-in-up/g, '');
        content = content.replace(/animate-fade-in-fast/g, '');
        content = content.replace(/animate-fade-in/g, '');

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            modifiedCount++;
            console.log(`[PATCHED] Stripped opacity delay in ${filePath}`);
        }
    }
});

console.log(`Successfully neutralized ${modifiedCount} file(s) for instant rendering.`);
