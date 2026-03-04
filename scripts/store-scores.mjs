/**
 * Store Quality Scores in DB
 * 
 * Reads score-results.json and upserts into ArticleScore table via API
 * Run: node scripts/store-scores.mjs
 */

import { readFileSync } from 'fs';

const SCORES = JSON.parse(readFileSync('scripts/score-results.json', 'utf8'));
const API_URL = "http://localhost:3000/api/migrate";

async function main() {
    console.log(`Storing ${SCORES.length} article scores...\n`);

    let success = 0;
    let failed = 0;

    // Process in batches of 10
    for (let i = 0; i < SCORES.length; i += 10) {
        const batch = SCORES.slice(i, i + 10);

        const promises = batch.map(async (score) => {
            try {
                const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        articleId: score.id,
                        substance: score.substance,
                        depth: score.depth,
                        structure: score.structure,
                        vocabulary: score.vocabulary,
                        readability: score.readability,
                        specificity: score.specificity,
                        actionability: score.actionability,
                        engagement: score.engagement,
                        total: score.TOTAL,
                    }),
                });
                const data = await res.json();
                if (data.success) {
                    success++;
                } else {
                    console.error(`Failed: ${score.title?.substring(0, 40)} - ${data.error}`);
                    failed++;
                }
            } catch (e) {
                console.error(`Error: ${score.title?.substring(0, 40)} - ${e.message}`);
                failed++;
            }
        });

        await Promise.all(promises);
        process.stdout.write(`\rProcessed ${Math.min(i + 10, SCORES.length)}/${SCORES.length}`);
    }

    console.log(`\n\n✅ Stored ${success} scores`);
    if (failed > 0) console.log(`❌ Failed ${failed} scores`);
}

main().catch(console.error);
