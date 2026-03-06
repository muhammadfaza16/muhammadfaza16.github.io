require('dotenv').config();
const { Client } = require('pg');

const CATEGORIES = [
    "AI & Tools",
    "Wealth & Business",
    "Mindset & Philosophy",
    "Self-Improvement & Productivity",
    "Career & Skills",
    "Marketing & Growth",
    "Building & Design",
    "Health & Lifestyle"
];

async function categorizeWithGemini(title, content) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY not set");

    const prompt = `
You are a content classifier. Categorize the following article into EXACTLY ONE of these categories:
${CATEGORIES.map(c => `- ${c}`).join('\n')}

Article Title: ${title}
Article Content/Notes: ${content?.substring(0, 1500) || "No content available."}

Respond ONLY with the EXACT category name from the list above. Do not include any other text, quotes, or punctuation.
`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2 } // low temp for consistency
        })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    let category = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    // Clean up potential markdown formatting or quotes
    category = category.replace(/^["'`]+|["'`]+$/g, '').trim();

    if (!CATEGORIES.includes(category)) {
        console.warn(`[WARNING] Gemini returned invalid category "${category}" for "${title}". Defaulting to "Self-Improvement & Productivity"`);
        return "Self-Improvement & Productivity";
    }
    return category;
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function main() {
    const directUrl = process.env.DIRECT_URL || "postgresql://postgres.tcvbbgttdvhuyhsbowjn:OqPJAEZ0r0fx6EXd@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true";
    const client = new Client({
        connectionString: directUrl,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        // Get ALL articles since user requested to RECATEGORIZE ALL articles.
        // Excluding __SUGGESTED__
        const res = await client.query(`SELECT id, title, content, category FROM "Article" WHERE category != '__SUGGESTED__' OR category IS NULL`);

        console.log(`Found ${res.rows.length} articles to categorize.`);

        let successCount = 0;
        for (let i = 0; i < res.rows.length; i++) {
            const article = res.rows[i];
            try {
                const newCategory = await categorizeWithGemini(article.title, article.content);
                await client.query(`UPDATE "Article" SET category = $1 WHERE id = $2`, [newCategory, article.id]);
                console.log(`[${i + 1}/${res.rows.length}] Updated "${article.title.substring(0, 30)}..." => ${newCategory}`);
                successCount++;

                // Rate limit prevention (Gemini free tier has RPM limits: 15 req/min = 4 seconds per req)
                await delay(4100);
            } catch (e) {
                console.error(`Failed to categorize "${article.title}":`, e.message);
            }
        }

        console.log(`Successfully categorized ${successCount}/${res.rows.length} articles.`);

    } catch (err) {
        console.error("Database error:", err.message);
    } finally {
        await client.end();
    }
}

main();
