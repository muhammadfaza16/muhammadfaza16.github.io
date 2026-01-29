const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesToConvert = [
    'detail_lavender.png',
    'detail_leaf.png',
    'hijabi_details.png',
    'lavender_sketch.png',
    'sketch_envelope_flower_v2.png',
    'sketch_gift_box.png',
    'special_hijabi_main.png',
    'special_peony.png',
    'special_wildflowers.png',
    'watercolor_splash.png',
    'portrait_1.png',
    'portrait_2.png',
    'portrait_3.png',
    'portrait_4.png'
];

const publicDir = path.join(__dirname, '..', 'public');

async function convertToWebP() {
    console.log('Converting images to WebP...\n');

    for (const filename of imagesToConvert) {
        const inputPath = path.join(publicDir, filename);
        const outputPath = path.join(publicDir, filename.replace('.png', '.webp'));

        if (!fs.existsSync(inputPath)) {
            console.log(`⚠️  Skipping ${filename} (not found)`);
            continue;
        }

        try {
            const inputStats = fs.statSync(inputPath);
            const inputSizeKB = (inputStats.size / 1024).toFixed(1);

            await sharp(inputPath)
                .webp({ quality: 85 })
                .toFile(outputPath);

            const outputStats = fs.statSync(outputPath);
            const outputSizeKB = (outputStats.size / 1024).toFixed(1);
            const savedPercent = ((1 - outputStats.size / inputStats.size) * 100).toFixed(0);

            console.log(`✅ ${filename}`);
            console.log(`   ${inputSizeKB}KB → ${outputSizeKB}KB (${savedPercent}% smaller)\n`);
        } catch (error) {
            console.error(`❌ Error converting ${filename}:`, error.message);
        }
    }

    console.log('Done!');
}

convertToWebP();
