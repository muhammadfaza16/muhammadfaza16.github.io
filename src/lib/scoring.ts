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

// ─── Category Prediction (Client & Server) ───

const CATEGORY_DICTIONARY: Record<string, Record<string, number>> = {
    "AI & Tools": {
        "ai": 6, "llm": 6, "chatgpt": 5, "prompt": 4, "machine": 3, "learning": 3,
        "neural": 4, "framework": 2, "api": 2, "gpt": 5, "claude": 5, "openai": 5,
        "anthropic": 4, "agent": 4, "models": 2, "inference": 3, "rag": 4, "token": 2
    },
    "Wealth & Business": {
        "startup": 5, "saas": 5, "revenue": 4, "arr": 5, "mrr": 5, "margin": 3,
        "investment": 4, "venture": 4, "capital": 3, "business": 3, "founder": 4,
        "profit": 3, "sales": 3, "b2b": 4, "b2c": 3, "equity": 3, "bootstrapped": 5,
        "monetization": 4, "funding": 4, "valuation": 4
    },
    "Mindset & Philosophy": {
        "mindset": 6, "philosophy": 6, "stoicism": 5, "stoic": 5, "mental": 4,
        "model": 2, "clarity": 4, "wisdom": 4, "truth": 3, "perspective": 3,
        "paradigm": 4, "ego": 4, "meditation": 4, "awareness": 3, "psychology": 4
    },
    "Self-Improvement & Productivity": {
        "productivity": 6, "habit": 5, "routine": 5, "deep": 4, "work": 2,
        "focus": 5, "time": 3, "management": 2, "system": 2, "goal": 3,
        "discipline": 5, "procrastination": 5, "efficiency": 4, "optimize": 3,
        "flow": 3, "pomodoro": 4
    },
    "Career & Skills": {
        "career": 6, "resume": 5, "interview": 5, "job": 4, "hiring": 4,
        "skills": 4, "promotion": 4, "manager": 3, "leadership": 4, "senior": 3,
        "junior": 3, "portfolio": 4, "networking": 3, "salary": 5, "remote": 3
    },
    "Marketing & Growth": {
        "marketing": 6, "growth": 5, "acquisition": 5, "audience": 4, "seo": 6,
        "content": 3, "viral": 4, "conversion": 5, "funnel": 5, "brand": 4,
        "advertising": 4, "social": 2, "campaign": 4, "retention": 4, "churn": 4,
        "copywriting": 5, "ctr": 4
    },
    "Building & Design": {
        "ux": 6, "ui": 6, "frontend": 5, "backend": 5, "code": 4, "deploy": 4,
        "design": 4, "system": 2, "figma": 6, "architecture": 4, "react": 5,
        "nextjs": 5, "tailwind": 5, "database": 4, "css": 4, "html": 3, "typescript": 5,
        "dev": 3, "developer": 3, "software": 3
    },
    "Health & Lifestyle": {
        "health": 6, "lifestyle": 5, "fitness": 5, "diet": 5, "sleep": 5,
        "nutrition": 5, "workout": 4, "longevity": 5, "cardio": 4, "muscle": 4,
        "recovery": 4, "wellness": 5, "supplement": 4, "biohacking": 5
    }
};

/**
 * Predicts the category of an article based on its title and description.
 * Utilizes a weighted dictionary approach. Title hits are weighted 3x.
 */
export function predictCategory(title: string, description: string): string | null {
    const titleWords = getWords(title.toLowerCase().replace(/[^a-z0-9\s]/g, ''));
    const descWords = getWords(description.toLowerCase().replace(/[^a-z0-9\s]/g, ''));

    const scores: Record<string, number> = {};

    for (const category of Object.keys(CATEGORY_DICTIONARY)) {
        scores[category] = 0;
        const dict = CATEGORY_DICTIONARY[category];

        // Title has 3x multiplier
        for (const word of titleWords) {
            if (dict[word]) {
                scores[category] += dict[word] * 3;
            }
        }

        // Description has 1x multiplier
        for (const word of descWords) {
            if (dict[word]) {
                scores[category] += dict[word];
            }
        }
    }

    let topCategory: string | null = null;
    let maxScore = 0;

    for (const [category, score] of Object.entries(scores)) {
        if (score > maxScore) {
            maxScore = score;
            topCategory = category;
        }
    }

    // Confidence threshold, must score at least 6 points to "guess"
    if (maxScore >= 6) {
        return topCategory;
    }
    return null;
}
