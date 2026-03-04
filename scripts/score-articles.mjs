/**
 * Article Quality Scoring Script v2
 * 
 * Analyzes all articles using heuristic NLP scoring.
 * Outputs JSON results for review — no DB changes.
 * 
 * Run: node scripts/score-articles.mjs
 */

import { writeFileSync } from 'fs';

const API_URL = "http://localhost:3000/api/curation";

// ─── Text Utilities ───

function stripHtml(html) {
    return html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
}

function getWords(text) {
    return text.split(/\s+/).filter(w => w.length > 0);
}

function getSentences(text) {
    return text.split(/[.!?]+/).filter(s => s.trim().length > 10);
}

function countSyllables(word) {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 2) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
}

// ─── Scoring Functions (7 craft + 1 substance) ───

// 1. DEPTH (15%)
function scoreDepth(wordCount) {
    if (wordCount < 200) return 10;
    if (wordCount < 500) return 25;
    if (wordCount < 800) return 40;
    if (wordCount < 1200) return 60;
    if (wordCount < 2000) return 80;
    if (wordCount < 3500) return 95;
    return 100;
}

// 2. STRUCTURE (10%)
function scoreStructure(html) {
    let score = 20;
    score += Math.min((html.match(/<h[1-6][^>]*>/gi) || []).length * 8, 25);
    score += Math.min((html.match(/<li[^>]*>/gi) || []).length * 3, 20);
    score += Math.min((html.match(/<p[^>]*>/gi) || []).length * 2, 15);
    score += Math.min((html.match(/<(strong|b|em|i)[^>]*>/gi) || []).length * 2, 10);
    score += Math.min((html.match(/<blockquote[^>]*>/gi) || []).length * 5, 10);
    return Math.min(score, 100);
}

// 3. VOCABULARY RICHNESS (10%)
function scoreVocabulary(words) {
    if (words.length < 50) return 20;
    const lowerWords = words.map(w => w.toLowerCase().replace(/[^a-zA-Z]/g, '')).filter(w => w.length > 2);
    const uniqueWords = new Set(lowerWords);
    const ttr = uniqueWords.size / lowerWords.length;
    if (ttr > 0.65) return 100;
    if (ttr > 0.55) return 85;
    if (ttr > 0.45) return 70;
    if (ttr > 0.35) return 50;
    if (ttr > 0.25) return 30;
    return 15;
}

// 4. READABILITY (10%)
function scoreReadability(words, sentences) {
    if (sentences.length === 0 || words.length === 0) return 30;
    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllables = words.reduce((acc, w) => acc + countSyllables(w), 0) / words.length;
    const flesch = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllables);
    if (flesch >= 40 && flesch <= 70) return 100;
    if (flesch >= 30 && flesch <= 80) return 80;
    if (flesch >= 20 && flesch <= 90) return 60;
    return 40;
}

// 5. SPECIFICITY (10%)
function scoreSpecificity(text, words) {
    if (words.length < 30) return 20;
    let score = 20;
    score += Math.min((text.match(/\d+%?/g) || []).length * 4, 25);
    score += Math.min((text.match(/(?<=\s)[A-Z][a-z]{2,}/g) || []).length * 1.5, 15);
    score += Math.min((text.match(/[""][^""]+[""]|["'][^"']+["']/g) || []).length * 5, 15);
    score += Math.min((text.match(/for example|such as|specifically|in particular|for instance|e\.g\./gi) || []).length * 6, 15);
    score += Math.min((text.match(/\b(19|20)\d{2}\b/g) || []).length * 3, 10);
    return Math.min(score, 100);
}

// 6. ACTIONABILITY (10%)
function scoreActionability(text) {
    let score = 15;
    const actionPatterns = /\b(start|stop|try|build|create|learn|practice|implement|apply|use|avoid|focus|invest|read|write|think|ask)\b/gi;
    score += Math.min((text.match(actionPatterns) || []).length * 2, 25);
    score += Math.min((text.match(/how to|step \d|first,|second,|third,|finally,|here's how|here are/gi) || []).length * 8, 30);
    score += Math.min((text.match(/\?/g) || []).length * 3, 15);
    score += Math.min((text.match(/^\d+[\.\)]/gm) || []).length * 4, 15);
    return Math.min(score, 100);
}

// 7. ENGAGEMENT HOOKS (10%)
function scoreEngagement(text, sentences) {
    let score = 20;
    if (sentences.length > 0) {
        const first = sentences[0].trim();
        if (first.includes('?')) score += 15;
        if (first.split(/\s+/).length < 12) score += 10;
        if (/\byou\b/i.test(first)) score += 10;
    }
    score += Math.min((text.match(/\b(story|experience|remember|imagine|picture this|once|years ago|happened)\b/gi) || []).length * 5, 15);
    score += Math.min((text.match(/\b(but|however|yet|instead|surprisingly|counterintuitively|paradox|actually)\b/gi) || []).length * 3, 15);
    const personalWords = (text.match(/\b(I|we|you|your|my|our)\b/g) || []).length;
    const ratio = personalWords / Math.max(text.split(/\s+/).length, 1);
    if (ratio > 0.02 && ratio < 0.08) score += 15;
    return Math.min(score, 100);
}

// 8. ★ SUBSTANCE — The secret ingredient (25%)
// Measures real-world impact potential: would this change how someone thinks or acts?
function scoreSubstance(text, words) {
    if (words.length < 50) return 15;
    let score = 0;
    const totalWords = words.length;

    // A) Paradigm-shift language — challenges assumptions
    const paradigmShift = (text.match(
        /\b(most people think|commonly believed|myth|misconception|wrong about|actually|the truth is|counterintuit|contrary to|not what you think|overlooked|underestimated|overrated|the real reason|what nobody tells|hidden|secret|uncomfortable truth|hard truth)\b/gi
    ) || []).length;
    score += Math.min(paradigmShift * 5, 20);

    // B) Framework / mental model density — portable thinking tools
    const frameworks = (text.match(
        /\b(framework|model|principle|rule|law|system|strategy|approach|method|technique|formula|playbook|pattern|mental model|heuristic|axiom|fundamental|cornerstone|pillar)\b/gi
    ) || []).length;
    score += Math.min(frameworks * 4, 18);

    // C) Cause-effect reasoning — deep analysis, not surface observation
    const causalReasoning = (text.match(
        /\b(because|therefore|thus|hence|as a result|this means|the reason|which leads to|consequently|this causes|the effect|implications|root cause|the why|underlying)\b/gi
    ) || []).length;
    // Normalize by article length — long articles naturally have more
    const causalDensity = causalReasoning / (totalWords / 500);
    score += Math.min(Math.round(causalDensity * 5), 18);

    // D) Transformation signals — lasting impact on reader
    const transformation = (text.match(
        /\b(changed|transform|shift|realize|perspective|mindset|breakthrough|epiphany|eye.?opening|game.?changer|turning point|never the same|fundamentally|rewire|rethink|redefine|unlock|level up|upgrade|evolved)\b/gi
    ) || []).length;
    score += Math.min(transformation * 4, 16);

    // E) Evidence / grounded claims — not just opinion
    const evidence = (text.match(
        /\b(research|study|studies|data|experiment|evidence|according to|found that|published|professor|university|scientist|journal|harvard|stanford|peer.?reviewed|statistic|survey|analysis|observed)\b/gi
    ) || []).length;
    score += Math.min(evidence * 5, 16);

    // F) Universal applicability — advice that works for anyone
    const universal = (text.match(
        /\b(everyone|anyone|no matter|regardless|whether you|in any|all of us|human nature|life|career|relationship|money|health|happiness|success|freedom|growth|purpose|meaning)\b/gi
    ) || []).length;
    const universalDensity = universal / (totalWords / 500);
    score += Math.min(Math.round(universalDensity * 4), 12);

    return Math.min(score, 100);
}

// ─── Composite Score ───

function scoreArticle(article) {
    const html = article.content || '';
    const plainText = stripHtml(html);
    const words = getWords(plainText);
    const sentences = getSentences(plainText);
    const wordCount = words.length;

    const scores = {
        substance: scoreSubstance(plainText, words),  // ★ 25%
        depth: scoreDepth(wordCount),                   // 15%
        structure: scoreStructure(html),                // 10%
        vocabulary: scoreVocabulary(words),              // 10%
        readability: scoreReadability(words, sentences), // 10%
        specificity: scoreSpecificity(plainText, words), // 10%
        actionability: scoreActionability(plainText),    // 10%
        engagement: scoreEngagement(plainText, sentences),// 10%
    };

    // Weighted composite — substance is the heaviest signal
    const composite = Math.round(
        scores.substance * 0.25 +
        scores.depth * 0.15 +
        scores.structure * 0.10 +
        scores.vocabulary * 0.10 +
        scores.readability * 0.10 +
        scores.specificity * 0.10 +
        scores.actionability * 0.10 +
        scores.engagement * 0.10
    );

    return { wordCount, scores, composite };
}

// ─── Main ───

async function main() {
    console.log("Fetching articles...\n");

    let allArticles = [];
    let cursor = null;

    while (true) {
        let url = `${API_URL}?limit=50`;
        if (cursor) url += `&cursor=${cursor}`;
        const res = await fetch(url);
        const data = await res.json();
        if (!data.articles || data.articles.length === 0) break;
        allArticles.push(...data.articles);
        if (!data.nextCursor) break;
        cursor = data.nextCursor;
    }

    console.log(`Found ${allArticles.length} articles.\n`);

    const results = allArticles.map(article => {
        const { wordCount, scores, composite } = scoreArticle(article);
        return {
            id: article.id,
            title: article.title,
            category: article.category || 'Uncategorized',
            words: wordCount,
            ...scores,
            TOTAL: composite,
        };
    });

    // Sort by score descending
    results.sort((a, b) => b.TOTAL - a.TOTAL);

    // Save full results as JSON
    writeFileSync('scripts/score-results.json', JSON.stringify(results, null, 2));

    // Print top 10 and bottom 10
    console.log("═══ TOP 10 ARTICLES ═══\n");
    results.slice(0, 10).forEach((r, i) => {
        console.log(`${i + 1}. [${r.TOTAL}] ${r.title.substring(0, 70)}`);
        console.log(`   Sub:${r.substance} Dep:${r.depth} Str:${r.structure} Voc:${r.vocabulary} Read:${r.readability} Spec:${r.specificity} Act:${r.actionability} Eng:${r.engagement}`);
        console.log(`   Category: ${r.category} | Words: ${r.words}`);
        console.log();
    });

    console.log("\n═══ BOTTOM 10 ARTICLES ═══\n");
    results.slice(-10).forEach((r, i) => {
        console.log(`${results.length - 9 + i}. [${r.TOTAL}] ${r.title.substring(0, 70)}`);
        console.log(`   Sub:${r.substance} Dep:${r.depth} Str:${r.structure} Voc:${r.vocabulary} Read:${r.readability} Spec:${r.specificity} Act:${r.actionability} Eng:${r.engagement}`);
        console.log(`   Category: ${r.category} | Words: ${r.words}`);
        console.log();
    });

    // Distribution
    const tier = { elite: [], high: [], mid: [], low: [] };
    results.forEach(r => {
        if (r.TOTAL >= 80) tier.elite.push(r);
        else if (r.TOTAL >= 60) tier.high.push(r);
        else if (r.TOTAL >= 40) tier.mid.push(r);
        else tier.low.push(r);
    });

    console.log("═══ DISTRIBUTION ═══");
    console.log(`⭐ Elite (80+):    ${tier.elite.length} articles`);
    console.log(`🔵 High (60-79):   ${tier.high.length} articles`);
    console.log(`🟡 Medium (40-59): ${tier.mid.length} articles`);
    console.log(`⚪ Low (<40):      ${tier.low.length} articles`);
    console.log(`\nAvg Score: ${Math.round(results.reduce((a, r) => a + r.TOTAL, 0) / results.length)}`);
    console.log(`Avg Substance: ${Math.round(results.reduce((a, r) => a + r.substance, 0) / results.length)}`);
    console.log(`\nFull results saved to scripts/score-results.json`);
}

main().catch(console.error);
