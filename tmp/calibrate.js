const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const prisma = new PrismaClient();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const schema = {
    type: SchemaType.OBJECT,
    properties: {
        category: {
            type: SchemaType.STRING,
            description: "Must be ONE of: 'AI & Automation', 'Wealth & Leverage', 'Philosophy & Mental Models', 'Peak Performance', 'Growth & Systems'"
        },
        summary: {
            type: SchemaType.STRING,
            description: "A very harsh and highly opinionated 3-bullet TL;DR in Indonesian. Use sharp, intellectual phrasing."
        },
        toc: {
            type: SchemaType.ARRAY,
            description: "A Table of Contents of the article, logically grouped.",
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    title: { type: SchemaType.STRING, description: "The section headline" }
                }
            }
        }
    },
    required: ["category", "summary", "toc"]
};

const CATEGORIES = [
    "AI & Automation",
    "Wealth & Leverage",
    "Philosophy & Mental Models",
    "Peak Performance",
    "Growth & Systems"
];

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
    console.log("Starting JSON metadata AI Extraction Script...");

    const dataPath = path.join(__dirname, '../src/data/curation_ai.json');
    let aiData = {};
    if (fs.existsSync(dataPath)) {
        try {
            aiData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        } catch (e) { }
    }

    const articles = await prisma.article.findMany({
        select: { id: true, title: true, content: true }
    });

    const unprocessed = articles.filter(a => !aiData[a.id]?.summary);

    console.log(`Found ${unprocessed.length} articles to process.`);

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: schema,
        }
    });

    for (let i = 0; i < unprocessed.length; i++) {
        const article = unprocessed[i];
        console.log(`[${i + 1}/${unprocessed.length}] Processing: ${article.title.substring(0, 50)}...`);

        const prompt = `Analyze this article strictly and assign the most fitting category, generate a sharp TL;DR, and create a ToC.
    
    Article Title: ${article.title}
    Article Content: ${article.content.substring(0, 8000)}`;

        try {
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const parsed = JSON.parse(text);

            let finalCategory = CATEGORIES.includes(parsed.category) ? parsed.category : "Philosophy & Mental Models";

            // Write strictly to the JSON file
            aiData[article.id] = {
                summary: parsed.summary,
                toc: parsed.toc?.length > 0 ? parsed.toc : [{ title: "Overview" }]
            };
            fs.writeFileSync(dataPath, JSON.stringify(aiData, null, 2));

            // ONLY update category in DB (schema allows this via normal SQL)
            await prisma.article.update({
                where: { id: article.id },
                data: { category: finalCategory }
            });

            console.log(`  -> Finalized as [${finalCategory}]. Data saved.`);
        } catch (e) {
            console.error(`  -> Failed for ${article.id}:`, e.message);
        }

        await sleep(5000); // Massive 5s delay to be invisible
    }

    console.log("Extraction Complete!");
    await prisma.$disconnect();
}

run().catch(console.error);
