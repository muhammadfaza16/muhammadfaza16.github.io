import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Robust title formatting utility.
 * - Enforces Title Case (capitalizes major words).
 * - Fixes common punctuation spacing (e.g., "Title :Sub" -> "Title: Sub").
 * - Trims redundant whitespace.
 */
export function formatTitle(title: string | undefined | null): string {
    if (!title) return "";

    // 1. Initial cleanup: fix punctuation spacing and trim
    let cleanTitle = title
        .replace(/\s+/g, ' ')                  // Normalize spaces
        .replace(/\s*:\s*/g, ': ')             // Fix colon spacing
        .replace(/\s*;\s*/g, '; ')             // Fix semicolon spacing
        .trim();

    const lowerCaseWords = new Set([
        'a', 'an', 'the', 'and', 'but', 'for', 'at', 'by', 'from', 'in', 'into', 'of', 'on', 'to', 'with', 'is', 'as', 'via'
    ]);

    // Technical acronyms that should preserve their casing
    const ACRONYMS: Record<string, string> = {
        'ai': 'AI',
        'llm': 'LLM',
        'saas': 'SaaS',
        'ui': 'UI',
        'ux': 'UX',
        'api': 'API',
        'seo': 'SEO',
        'url': 'URL',
        'html': 'HTML',
        'css': 'CSS',
        'js': 'JS',
        'ts': 'TS',
        'rss': 'RSS',
        'gpt': 'GPT',
        'b2b': 'B2B',
        'b2c': 'B2C',
        'tts': 'TTS',
    };

    const words = cleanTitle.split(' ');
    const formattedWords = words.map((word, index) => {
        const lowerWord = word.toLowerCase();
        
        // Always capitalize first and last word of the title
        // Also capitalize after a colon or semicolon (beginning of a subtitle)
        const prevWord = index > 0 ? words[index - 1] : "";
        const afterPunctuation = prevWord.endsWith(':') || prevWord.endsWith(';');

        const shouldCapitalize = 
            index === 0 || 
            index === words.length - 1 || 
            afterPunctuation ||
            !lowerCaseWords.has(lowerWord);

        if (ACRONYMS[lowerWord]) {
            return ACRONYMS[lowerWord];
        }

        if (shouldCapitalize) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        } else {
            return lowerWord;
        }
    });

    return formattedWords.join(' ');
}

/**
 * Formats large numbers into a compact string with a 'k' suffix.
 * Example: 1200 -> "1.2k", 850 -> "850"
 */
export function formatMetric(count?: number): string {
    if (!count) return "0";
    if (count >= 1000) {
        return (count / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    return count.toString();
}
