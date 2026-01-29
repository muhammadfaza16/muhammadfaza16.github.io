const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const directory = 'public/images/playlists';
const files = [
    'playlist_line_up_inti_final.png',
    'playlist_menunggu_pagi_final.png',
    'playlist_teman_sunyi_final.png',
    'playlist_tentang_dia_final.png'
];

async function optimize() {
    let totalOriginalSize = 0;
    let totalNewSize = 0;
    let report = [];

    console.log("Starting optimization...\n");

    for (const file of files) {
        const inputPath = path.join(directory, file);
        const outputPath = path.join(directory, file.replace('.png', '.webp'));

        if (!fs.existsSync(inputPath)) {
            console.log(`Skipping ${file}: File not found.`);
            continue;
        }

        const originalStats = fs.statSync(inputPath);
        totalOriginalSize += originalStats.size;

        await sharp(inputPath)
            .webp({ quality: 80 })
            .toFile(outputPath);

        const newStats = fs.statSync(outputPath);
        totalNewSize += newStats.size;

        const reduction = ((originalStats.size - newStats.size) / originalStats.size * 100).toFixed(1);

        report.push({
            file: file,
            original: (originalStats.size / 1024).toFixed(2) + ' KB',
            new: (newStats.size / 1024).toFixed(2) + ' KB',
            reduction: `${reduction}%`
        });

        // Remove original file after successful conversion (optional, but requested "convert" usually implies replacing usage)
        // I will keep them for now until confirmed, but the user asked for report.
    }

    console.log("Optimization Report:");
    console.table(report);

    const totalReduction = ((totalOriginalSize - totalNewSize) / totalOriginalSize * 100).toFixed(1);
    console.log(`\nTotal Original: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Total New:      ${(totalNewSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Total Reduction: ${totalReduction}%`);
}

optimize().catch(err => console.error(err));
