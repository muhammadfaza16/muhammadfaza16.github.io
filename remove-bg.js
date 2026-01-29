const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'public', 'time_capsule_icon.webp');
const outputFile = path.join(__dirname, 'public', 'time_capsule_icon_clean.webp');

async function processImage() {
    try {
        console.log(`Processing: ${inputFile}`);
        const { data, info } = await sharp(inputFile)
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        const pixelArray = new Uint8ClampedArray(data.buffer);
        let changed = 0;

        for (let i = 0; i < pixelArray.length; i += 4) {
            const r = pixelArray[i];
            const g = pixelArray[i + 1];
            const b = pixelArray[i + 2];
            const a = pixelArray[i + 3];

            // HEURISTIC: "Remove White Box"
            // If pixel is very close to white, make it transparent.
            // Using distance from white (255, 255, 255)
            const dist = Math.sqrt((255 - r) ** 2 + (255 - g) ** 2 + (255 - b) ** 2);

            // Thresholds
            // < 20: Almost pure white -> Transparent
            // 20 - 60: Off-white/Shadow -> Semi-transparent (Fade out)

            if (dist < 25) {
                // Hard cut for background
                pixelArray[i + 3] = 0;
                changed++;
            } else if (dist < 60) {
                // Smooth feathering for edges
                const opacity = (dist - 25) / 35; // 0.0 to 1.0
                pixelArray[i + 3] = Math.floor(opacity * 255);
            }
        }

        console.log(`Modified ${changed} pixels.`);

        await sharp(Buffer.from(pixelArray), {
            raw: {
                width: info.width,
                height: info.height,
                channels: 4
            }
        })
            .webp({ quality: 95 })
            .toFile(outputFile);

        console.log(`Saved transparent icon to: ${outputFile}`);

    } catch (error) {
        console.error("Error processing image:", error);
    }
}

processImage();
