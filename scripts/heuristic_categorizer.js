const { Client } = require('pg');
const fs = require('fs');

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

function determineCategory(title) {
    const lower = title.toLowerCase();

    // AI & Tools
    if (/(ai |artificial intelligence|gpt|claude|gemini|langchain|agent|llm|opus|chatgpt|openai|anthropic|prompt|tool)/.test(lower)) return "AI & Tools";

    // Wealth & Business
    if (/(\$|money|million|rich|business|startup|retire|sell|client|agency|wealth|founder|earn|invest|profit|economy)/.test(lower)) return "Wealth & Business";

    // Career & Skills
    if (/(career|job|skill|engineer|dev|code|resume|employ|work|programmer)/.test(lower)) return "Career & Skills";

    // Marketing & Growth
    if (/(market|audience|follower|ad |ads|instagram|youtube|seo|growth|user|traffic|reddit)/.test(lower)) return "Marketing & Growth";

    // Building & Design
    if (/(design|build|app |repo|ship|product|software|ui|ux|saas)/.test(lower)) return "Building & Design";

    // Health & Lifestyle
    if (/(health|body|sleep|handsome|fit|workout|medical|brain|neuroscience)/.test(lower)) return "Health & Lifestyle";

    // Self-Improvement & Productivity
    if (/(habit|productive|time|self|focus|routine|learn|achieve|goals|motivation|success|win)/.test(lower)) return "Self-Improvement & Productivity";

    // Mindset & Philosophy
    return "Mindset & Philosophy"; // Default fallback since it fits the general vague titles
}

async function main() {
    const directUrl = "postgresql://postgres.tcvbbgttdvhuyhsbowjn:OqPJAEZ0r0fx6EXd@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true";
    const client = new Client({
        connectionString: directUrl,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        const articles = JSON.parse(fs.readFileSync('articles_dump.json', 'utf8'));
        console.log(`Loaded ${articles.length} articles`);
        let successCount = 0;

        for (const article of articles) {
            const cat = determineCategory(article.title);
            await client.query(`UPDATE "Article" SET category = $1 WHERE id = $2`, [cat, article.id]);
            successCount++;
        }

        console.log(`Successfully hard-categorized ${successCount} articles based on title heuristics.`);
    } catch (err) {
        console.error("Database error:", err.message);
    } finally {
        await client.end();
    }
}

main();
