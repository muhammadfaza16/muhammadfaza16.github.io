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

    // Words that should remain lowercase (unless first or last)
    const lowerCaseWords = new Set([
        'a', 'an', 'the', 'and', 'but', 'for', 'at', 'by', 'from', 'in', 'into', 'of', 'on', 'to', 'with', 'is', 'as', 'via'
    ]);

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

        if (shouldCapitalize) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        } else {
            return lowerWord;
        }
    });

    return formattedWords.join(' ');
}
