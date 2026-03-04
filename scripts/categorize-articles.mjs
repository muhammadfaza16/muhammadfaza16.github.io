/**
 * Auto-categorize articles that have no category.
 * Uses keyword matching against title + content.
 * Run via: node scripts/categorize-articles.mjs
 */

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const CATEGORIES = [
    {
        name: "AI & Tools",
        keywords: [
            'ai', 'artificial intelligence', 'gpt', 'chatgpt', 'openai', 'llm', 'machine learning',
            'deep learning', 'neural', 'automation', 'api', 'saas', 'tool', 'software', 'app',
            'tech', 'technology', 'code', 'coding', 'programming', 'developer', 'claude', 'gemini',
            'copilot', 'prompt', 'transformer', 'model', 'algorithm', 'data science', 'robot',
        ],
    },
    {
        name: "Wealth & Business",
        keywords: [
            'money', 'wealth', 'invest', 'investment', 'stock', 'crypto', 'bitcoin', 'finance',
            'financial', 'business', 'entrepreneur', 'startup', 'revenue', 'profit', 'income',
            'passive income', 'real estate', 'economy', 'market', 'trading', 'portfolio',
            'compound', 'capital', 'fund', 'rich', 'millionaire', 'billion', 'asset',
        ],
    },
    {
        name: "Mindset & Philosophy",
        keywords: [
            'mindset', 'philosophy', 'stoic', 'stoicism', 'wisdom', 'think', 'thinking',
            'mental model', 'perspective', 'consciousness', 'meaning', 'purpose', 'existential',
            'belief', 'psychology', 'cognitive', 'bias', 'perception', 'truth', 'reality',
            'meditation', 'zen', 'awareness', 'contemplat', 'reflect', 'introspect',
        ],
    },
    {
        name: "Self-Improvement & Productivity",
        keywords: [
            'habit', 'productivity', 'routine', 'discipline', 'focus', 'goal', 'motivation',
            'self-improvement', 'self-help', 'growth', 'improve', 'optimize', 'efficiency',
            'time management', 'morning routine', 'journal', 'track', 'system', 'framework',
            'procrastinat', 'willpower', 'energy', 'perform', 'output', 'deep work',
        ],
    },
    {
        name: "Career & Skills",
        keywords: [
            'career', 'job', 'skill', 'resume', 'interview', 'salary', 'negotiate',
            'leadership', 'management', 'team', 'hire', 'hiring', 'workplace', 'professional',
            'mentor', 'networking', 'promotion', 'freelance', 'remote work', 'communication',
            'public speaking', 'writing skill', 'learn', 'education', 'course',
        ],
    },
    {
        name: "Marketing & Growth",
        keywords: [
            'marketing', 'growth', 'audience', 'brand', 'content', 'social media', 'seo',
            'viral', 'engagement', 'funnel', 'conversion', 'copywriting', 'email',
            'newsletter', 'subscriber', 'influencer', 'twitter', 'youtube', 'tiktok',
            'distribution', 'launch', 'acquisition', 'retention',
        ],
    },
    {
        name: "Building & Design",
        keywords: [
            'design', 'build', 'create', 'product', 'ux', 'ui', 'user experience',
            'interface', 'prototype', 'mvp', 'ship', 'architecture', 'engineer', 'craft',
            'aesthetic', 'visual', 'creative', 'innovation', 'maker', 'indie', 'bootstrap',
        ],
    },
    {
        name: "Health & Lifestyle",
        keywords: [
            'health', 'fitness', 'exercise', 'workout', 'sleep', 'nutrition', 'diet',
            'mental health', 'stress', 'anxiety', 'wellbeing', 'wellness', 'lifestyle',
            'longevity', 'aging', 'brain', 'body', 'relationship', 'social', 'happiness',
            'gratitude', 'nature', 'travel', 'adventure', 'balance',
        ],
    },
];

function categorize(title, content) {
    const text = `${title} ${(content || '').replace(/<[^>]+>/g, ' ')}`.toLowerCase();
    const scores = {};

    for (const cat of CATEGORIES) {
        let score = 0;
        for (const kw of cat.keywords) {
            const regex = new RegExp(`\\b${kw}`, 'gi');
            const matches = text.match(regex);
            if (matches) {
                // Title matches weigh 3x
                const titleMatches = title.toLowerCase().match(regex);
                score += (titleMatches ? titleMatches.length * 3 : 0) + matches.length;
            }
        }
        if (score > 0) scores[cat.name] = score;
    }

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : null;
}

async function main() {
    const articles = await prisma.article.findMany({
        where: { category: null },
        select: { id: true, title: true, content: true },
    });

    console.log(`Found ${articles.length} articles without category.\n`);

    let updated = 0;
    for (const article of articles) {
        const category = categorize(article.title, article.content);
        if (category) {
            await prisma.article.update({
                where: { id: article.id },
                data: { category },
            });
            console.log(`✅ "${article.title.substring(0, 60)}..." → ${category}`);
            updated++;
        } else {
            console.log(`⚠️  "${article.title.substring(0, 60)}..." → No match`);
        }
    }

    console.log(`\nDone: ${updated}/${articles.length} articles categorized.`);
    await prisma.$disconnect();
}

main().catch(console.error);
