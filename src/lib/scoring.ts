/**
 * Article Quality Scoring Utility (Server-side)
 * 
 * Heuristic NLP scoring across 8 dimensions.
 * Substance (real-world impact) is weighted heaviest at 25%.
 */

// ─── Text Utilities ───

function stripHtml(html: string): string {
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

function getWords(text: string): string[] {
    return text.split(/\s+/).filter(w => w.length > 0);
}

function getSentences(text: string): string[] {
    return text.split(/[.!?]+/).filter(s => s.trim().length > 10);
}

function countSyllables(word: string): number {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 2) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
}

// ─── Individual Scores ───

function scoreDepth(wordCount: number): number {
    if (wordCount < 200) return 10;
    if (wordCount < 500) return 25;
    if (wordCount < 800) return 40;
    if (wordCount < 1200) return 60;
    if (wordCount < 2000) return 80;
    if (wordCount < 3500) return 95;
    return 100;
}

function scoreStructure(html: string): number {
    let score = 20;
    score += Math.min((html.match(/<h[1-6][^>]*>/gi) || []).length * 8, 25);
    score += Math.min((html.match(/<li[^>]*>/gi) || []).length * 3, 20);
    score += Math.min((html.match(/<p[^>]*>/gi) || []).length * 2, 15);
    score += Math.min((html.match(/<(strong|b|em|i)[^>]*>/gi) || []).length * 2, 10);
    score += Math.min((html.match(/<blockquote[^>]*>/gi) || []).length * 5, 10);
    return Math.min(score, 100);
}

function scoreVocabulary(words: string[]): number {
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

function scoreReadability(words: string[], sentences: string[]): number {
    if (sentences.length === 0 || words.length === 0) return 30;
    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllables = words.reduce((acc, w) => acc + countSyllables(w), 0) / words.length;
    const flesch = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllables);
    if (flesch >= 40 && flesch <= 70) return 100;
    if (flesch >= 30 && flesch <= 80) return 80;
    if (flesch >= 20 && flesch <= 90) return 60;
    return 40;
}

function scoreSpecificity(text: string, words: string[]): number {
    if (words.length < 30) return 20;
    let score = 20;
    score += Math.min((text.match(/\d+%?/g) || []).length * 4, 25);
    score += Math.min((text.match(/(?<=\s)[A-Z][a-z]{2,}/g) || []).length * 1.5, 15);
    score += Math.min((text.match(/["""][^"""]+["""]|[''][^'']+['']/g) || []).length * 5, 15);
    score += Math.min((text.match(/for example|such as|specifically|in particular|for instance|e\.g\./gi) || []).length * 6, 15);
    score += Math.min((text.match(/\b(19|20)\d{2}\b/g) || []).length * 3, 10);
    return Math.min(score, 100);
}

function scoreActionability(text: string): number {
    let score = 15;
    const actionPatterns = /\b(start|stop|try|build|create|learn|practice|implement|apply|use|avoid|focus|invest|read|write|think|ask)\b/gi;
    score += Math.min((text.match(actionPatterns) || []).length * 2, 25);
    score += Math.min((text.match(/how to|step \d|first,|second,|third,|finally,|here's how|here are/gi) || []).length * 8, 30);
    score += Math.min((text.match(/\?/g) || []).length * 3, 15);
    score += Math.min((text.match(/^\d+[.)]/gm) || []).length * 4, 15);
    return Math.min(score, 100);
}

function scoreEngagement(text: string, sentences: string[]): number {
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

function scoreSubstance(text: string, words: string[]): number {
    if (words.length < 50) return 15;
    let score = 0;
    const totalWords = words.length;

    const paradigmShift = (text.match(
        /\b(most people think|commonly believed|myth|misconception|wrong about|actually|the truth is|counterintuit|contrary to|not what you think|overlooked|underestimated|overrated|the real reason|what nobody tells|hidden|secret|uncomfortable truth|hard truth)\b/gi
    ) || []).length;
    score += Math.min(paradigmShift * 5, 20);

    const frameworks = (text.match(
        /\b(framework|model|principle|rule|law|system|strategy|approach|method|technique|formula|playbook|pattern|mental model|heuristic|axiom|fundamental|cornerstone|pillar)\b/gi
    ) || []).length;
    score += Math.min(frameworks * 4, 18);

    const causalReasoning = (text.match(
        /\b(because|therefore|thus|hence|as a result|this means|the reason|which leads to|consequently|this causes|the effect|implications|root cause|the why|underlying)\b/gi
    ) || []).length;
    const causalDensity = causalReasoning / (totalWords / 500);
    score += Math.min(Math.round(causalDensity * 5), 18);

    const transformation = (text.match(
        /\b(changed|transform|shift|realize|perspective|mindset|breakthrough|epiphany|eye.?opening|game.?changer|turning point|never the same|fundamentally|rewire|rethink|redefine|unlock|level up|upgrade|evolved)\b/gi
    ) || []).length;
    score += Math.min(transformation * 4, 16);

    const evidence = (text.match(
        /\b(research|study|studies|data|experiment|evidence|according to|found that|published|professor|university|scientist|journal|harvard|stanford|peer.?reviewed|statistic|survey|analysis|observed)\b/gi
    ) || []).length;
    score += Math.min(evidence * 5, 16);

    const universal = (text.match(
        /\b(everyone|anyone|no matter|regardless|whether you|in any|all of us|human nature|life|career|relationship|money|health|happiness|success|freedom|growth|purpose|meaning)\b/gi
    ) || []).length;
    const universalDensity = universal / (totalWords / 500);
    score += Math.min(Math.round(universalDensity * 4), 12);

    return Math.min(score, 100);
}

// ─── Public API ───

export interface ArticleScores {
    substance: number;
    depth: number;
    structure: number;
    vocabulary: number;
    readability: number;
    specificity: number;
    actionability: number;
    engagement: number;
    composite: number;
    wordCount: number;
}

export function scoreArticle(title: string, content: string): ArticleScores {
    const html = content || '';
    const fullText = `${title} ${stripHtml(html)}`;
    const words = getWords(fullText);
    const sentences = getSentences(fullText);
    const wordCount = words.length;

    const scores = {
        substance: scoreSubstance(fullText, words),
        depth: scoreDepth(wordCount),
        structure: scoreStructure(html),
        vocabulary: scoreVocabulary(words),
        readability: scoreReadability(words, sentences),
        specificity: scoreSpecificity(fullText, words),
        actionability: scoreActionability(fullText),
        engagement: scoreEngagement(fullText, sentences),
    };

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

    return { ...scores, composite, wordCount };
}
