"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { scoreArticle } from "@/lib/scoring";

// ==========================================
// TO READ (Article Model)
// ==========================================
const SAFE_ARTICLE_SELECT = { id: true, title: true, content: true, url: true, imageUrl: true, category: true, isRead: true, isBookmarked: true, createdAt: true, updatedAt: true, scheduledFor: true };
export async function getToReadArticles() {
    try {
        const articles = await prisma.article.findMany({
            where: {
                OR: [
                    { category: null },
                    { category: { not: "__SUGGESTED__" } }
                ]
            },
            orderBy: { createdAt: "desc" },
            select: SAFE_ARTICLE_SELECT
        });
        return { success: true, data: articles };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function getSuggestedArticles() {
    try {
        const articles = await prisma.article.findMany({
            where: { category: "__SUGGESTED__" },
            orderBy: { createdAt: "desc" },
            select: SAFE_ARTICLE_SELECT
        });
        return { success: true, data: articles };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function approveSuggestedArticle(id: string) {
    try {
        const article = await prisma.article.update({
            where: { id },
            data: { category: null },
            select: SAFE_ARTICLE_SELECT
        });

        // Run heuristic scoring on approval
        let autoScores = { substance: 0, depth: 0, structure: 0, vocabulary: 0, readability: 0, composite: 0 };
        try {
            autoScores = scoreArticle(article.title || "", article.content || "");
        } catch (e) { console.error("Auto-scoring failed on approval:", e); }

        // Start with 0 social metrics since it's fresh
        await prisma.articleScore.upsert({
            where: { articleId: id },
            create: {
                articleId: id,
                substance: autoScores.substance,
                depth: autoScores.depth,
                structure: autoScores.structure,
                vocabulary: autoScores.vocabulary,
                readability: autoScores.readability,
                total: autoScores.composite,
                engagement: 0,
                actionability: 0,
                specificity: 0,
                socialScore: 0
            },
            update: {
                // Keep existing social metrics if they somehow exist
                substance: autoScores.substance,
                depth: autoScores.depth,
                structure: autoScores.structure,
                vocabulary: autoScores.vocabulary,
                readability: autoScores.readability,
                total: autoScores.composite
            }
        });
        revalidatePath('/curation');
        return { success: true, data: article };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function createToReadArticle(title: string, url: string, notes: string, imageUrl?: string, category?: string, createdAt?: string, likes: number = 0, reposts: number = 0, replies: number = 0) {
    if (!title || !url) {
        return { success: false, error: "Title and URL are required" };
    }
    try {
        const dataPayload: any = {
            title,
            url,
            content: notes || "No notes provided.",
            imageUrl: imageUrl || null,
            category: category || null,
        };

        if (createdAt) {
            const parsedDate = new Date(createdAt);
            if (!isNaN(parsedDate.getTime())) {
                dataPayload.createdAt = parsedDate;
            }
        }

        const article = await prisma.article.create({
            data: dataPayload,
            select: SAFE_ARTICLE_SELECT
        });

        let autoScores = { substance: 0, depth: 0, structure: 0, vocabulary: 0, readability: 0, composite: 0 };
        try {
            autoScores = scoreArticle(title, dataPayload.content);
        } catch (e) { console.error("Auto-scoring failed:", e); }

        const computedSocialScore = (likes * 1) + (reposts * 2) + (replies * 3);

        await prisma.articleScore.upsert({
            where: { articleId: article.id },
            create: {
                articleId: article.id,
                substance: autoScores.substance,
                depth: autoScores.depth,
                structure: autoScores.structure,
                vocabulary: autoScores.vocabulary,
                readability: autoScores.readability,
                total: autoScores.composite,
                engagement: likes,
                actionability: reposts,
                specificity: replies,
                socialScore: computedSocialScore
            },
            update: {
                substance: autoScores.substance,
                depth: autoScores.depth,
                structure: autoScores.structure,
                vocabulary: autoScores.vocabulary,
                readability: autoScores.readability,
                total: autoScores.composite,
                engagement: likes,
                actionability: reposts,
                specificity: replies,
                socialScore: computedSocialScore
            }
        });

        revalidatePath('/curation');
        return { success: true, data: { ...article, likes, reposts, replies } };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function toggleReadStatus(id: string, currentStatus: boolean) {
    try {
        const article = await prisma.article.update({
            where: { id },
            data: { isRead: !currentStatus },
            select: SAFE_ARTICLE_SELECT
        });
        revalidatePath('/curation');
        return { success: true, data: article };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function toggleBookmarkStatus(id: string, currentStatus: boolean) {
    try {
        const article = await prisma.article.update({
            where: { id },
            data: { isBookmarked: !currentStatus } as any,
            select: SAFE_ARTICLE_SELECT
        });
        revalidatePath('/curation');
        return { success: true, data: article };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function updateToReadArticle(id: string, title: string, url: string, notes: string, imageUrl?: string, category?: string, createdAt?: string, likes: number = 0, reposts: number = 0, replies: number = 0) {
    if (!title || !url) return { success: false, error: "Title and URL are required" };
    try {
        const dataPayload: any = {
            title, url, content: notes || "No notes provided.", imageUrl: imageUrl || null
        };
        if (category !== undefined) {
            dataPayload.category = category === "" ? null : category;
        }
        if (createdAt) {
            const parsedDate = new Date(createdAt);
            if (!isNaN(parsedDate.getTime())) {
                dataPayload.createdAt = parsedDate;
            }
        }
        const article = await prisma.article.update({
            where: { id },
            data: dataPayload,
            select: SAFE_ARTICLE_SELECT
        });

        let autoScores = { substance: 0, depth: 0, structure: 0, vocabulary: 0, readability: 0, composite: 0 };
        try {
            autoScores = scoreArticle(title, dataPayload.content);
        } catch (e) { console.error("Auto-scoring failed:", e); }

        const computedSocialScore = (likes * 1) + (reposts * 2) + (replies * 3);

        await prisma.articleScore.upsert({
            where: { articleId: id },
            create: {
                articleId: id,
                substance: autoScores.substance,
                depth: autoScores.depth,
                structure: autoScores.structure,
                vocabulary: autoScores.vocabulary,
                readability: autoScores.readability,
                total: autoScores.composite,
                engagement: likes,
                actionability: reposts,
                specificity: replies,
                socialScore: computedSocialScore
            },
            update: {
                substance: autoScores.substance,
                depth: autoScores.depth,
                structure: autoScores.structure,
                vocabulary: autoScores.vocabulary,
                readability: autoScores.readability,
                total: autoScores.composite,
                engagement: likes,
                actionability: reposts,
                specificity: replies,
                socialScore: computedSocialScore
            }
        });

        revalidatePath('/curation');
        return { success: true, data: { ...article, likes, reposts, replies } };
    } catch (e: any) { return { success: false, error: e.message }; }
}

export async function deleteToReadArticle(id: string) {
    try {
        await prisma.article.delete({ where: { id }, select: SAFE_ARTICLE_SELECT });
        revalidatePath('/curation');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

// ==========================================
// WRITING (Post Model)
// ==========================================
export async function getWritingArticles() {
    try {
        const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
        return { success: true, data: posts };
    } catch (e: any) { return { success: false, error: e.message }; }
}

export async function createWritingArticle(title: string, content: string, url: string, imageUrl?: string) {
    if (!title) return { success: false, error: "Title is required" };
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    try {
        const post = await prisma.post.create({
            data: { title, slug, content: content || "", url, imageUrl: imageUrl || null }
        });
        return { success: true, data: post };
    } catch (e: any) { return { success: false, error: e.message }; }
}

export async function togglePublishStatus(id: string, currentStatus: boolean) {
    try {
        const post = await prisma.post.update({
            where: { id },
            data: { published: !currentStatus }
        });
        return { success: true, data: post };
    } catch (e: any) { return { success: false, error: e.message }; }
}

export async function updateWritingArticle(id: string, title: string, content: string, url: string, imageUrl?: string) {
    if (!title) return { success: false, error: "Title is required" };
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    try {
        const post = await prisma.post.update({
            where: { id },
            data: { title, slug, content: content || "", url, imageUrl: imageUrl || null }
        });
        return { success: true, data: post };
    } catch (e: any) { return { success: false, error: e.message }; }
}

export async function deleteWritingArticle(id: string) {
    try { await prisma.post.delete({ where: { id } }); return { success: true }; }
    catch (e: any) { return { success: false, error: e.message }; }
}

// ==========================================
// BOOKS (Book Model)
// ==========================================
export async function getBooks(options?: { category?: string; status?: string; sortBy?: string }) {
    try {
        const where: any = {};
        if (options?.category) where.category = options.category;
        if (options?.status) where.status = options.status;

        const orderBy = options?.sortBy === 'rating'
            ? { rating: 'desc' as const }
            : { createdAt: 'desc' as const };

        const books = await prisma.book.findMany({ where, orderBy });
        return { success: true, data: books };
    } catch (e: any) { return { success: false, error: e.message }; }
}

export async function getBookById(id: string) {
    try {
        const book = await prisma.book.findUnique({ where: { id } });
        if (!book) return { success: false, error: "Book not found" };
        return { success: true, data: book };
    } catch (e: any) { return { success: false, error: e.message }; }
}

export async function createBook(data: {
    title: string; author: string; url?: string; review?: string;
    imageUrl?: string; status?: string; verdict?: string;
    takeaways?: string; category?: string; rating?: number;
    finishedAt?: string;
}) {
    if (!data.title || !data.author) return { success: false, error: "Title and author required" };
    try {
        const book = await prisma.book.create({
            data: {
                title: data.title,
                author: data.author,
                url: data.url || null,
                review: data.review || null,
                imageUrl: data.imageUrl || null,
                status: data.status || 'want-to-read',
                verdict: data.verdict || null,
                takeaways: data.takeaways || null,
                category: data.category || null,
                rating: data.rating || 0,
                finishedAt: data.finishedAt ? new Date(data.finishedAt) : null,
            }
        });
        revalidatePath('/curation/books');
        return { success: true, data: book };
    } catch (e: any) { return { success: false, error: e.message }; }
}

export async function updateBook(id: string, data: {
    title?: string; author?: string; url?: string; review?: string;
    imageUrl?: string; status?: string; verdict?: string;
    takeaways?: string; category?: string; rating?: number;
    finishedAt?: string;
}) {
    try {
        const payload: any = { ...data };
        if (data.finishedAt) payload.finishedAt = new Date(data.finishedAt);
        else if (data.finishedAt === null) payload.finishedAt = null;
        delete payload.finishedAt;
        if (data.finishedAt) payload.finishedAt = new Date(data.finishedAt);

        const book = await prisma.book.update({ where: { id }, data: payload });
        revalidatePath('/curation/books');
        return { success: true, data: book };
    } catch (e: any) { return { success: false, error: e.message }; }
}

export async function deleteBook(id: string) {
    try {
        await prisma.book.delete({ where: { id } });
        revalidatePath('/curation/books');
        return { success: true };
    }
    catch (e: any) { return { success: false, error: e.message }; }
}

// ==========================================
// COURSES / SKILLS LAB (Course Model)
// ==========================================
export async function getCourses(options?: { category?: string; difficulty?: string }) {
    try {
        const where: any = {};
        if (options?.category) where.category = options.category;
        if (options?.difficulty) where.difficulty = options.difficulty;

        const courses = await prisma.course.findMany({ where, orderBy: { createdAt: 'desc' } });
        return { success: true, data: courses };
    } catch (e: any) { return { success: false, error: e.message }; }
}

export async function getCourseById(id: string) {
    try {
        const course = await prisma.course.findUnique({ where: { id } });
        if (!course) return { success: false, error: "Course not found" };
        return { success: true, data: course };
    } catch (e: any) { return { success: false, error: e.message }; }
}

export async function createCourse(data: {
    title: string; content?: string; source?: string; sourceType?: string;
    category?: string; difficulty?: string; imageUrl?: string; url?: string;
}) {
    if (!data.title) return { success: false, error: "Title is required" };
    try {
        const course = await prisma.course.create({
            data: {
                title: data.title,
                content: data.content || null,
                source: data.source || null,
                sourceType: data.sourceType || null,
                category: data.category || null,
                difficulty: data.difficulty || null,
                imageUrl: data.imageUrl || null,
                url: data.url || null,
            }
        });
        revalidatePath('/curation/skills');
        return { success: true, data: course };
    } catch (e: any) { return { success: false, error: e.message }; }
}

export async function updateCourse(id: string, data: {
    title?: string; content?: string; source?: string; sourceType?: string;
    category?: string; difficulty?: string; imageUrl?: string; url?: string;
}) {
    try {
        const course = await prisma.course.update({ where: { id }, data });
        revalidatePath('/curation/skills');
        return { success: true, data: course };
    } catch (e: any) { return { success: false, error: e.message }; }
}

export async function deleteCourse(id: string) {
    try {
        await prisma.course.delete({ where: { id } });
        revalidatePath('/curation/skills');
        return { success: true };
    } catch (e: any) { return { success: false, error: e.message }; }
}

// ==========================================
// FRAMEWORKS (Framework Model)
// ==========================================
export async function getFrameworks(options?: { category?: string; type?: string }) {
    try {
        const where: any = {};
        if (options?.category) where.category = options.category;
        if (options?.type) where.type = options.type;

        const frameworks = await prisma.framework.findMany({ where, orderBy: { createdAt: 'desc' } });
        return { success: true, data: frameworks };
    } catch (e: any) { return { success: false, error: e.message }; }
}

export async function getFrameworkById(id: string) {
    try {
        const framework = await prisma.framework.findUnique({ where: { id } });
        if (!framework) return { success: false, error: "Framework not found" };
        return { success: true, data: framework };
    } catch (e: any) { return { success: false, error: e.message }; }
}

export async function createFramework(data: {
    name: string; type?: string; summary?: string; content?: string;
    source?: string; whenToUse?: string; category?: string; imageUrl?: string;
}) {
    if (!data.name) return { success: false, error: "Name is required" };
    try {
        const framework = await prisma.framework.create({
            data: {
                name: data.name,
                type: data.type || 'mental-model',
                summary: data.summary || null,
                content: data.content || null,
                source: data.source || null,
                whenToUse: data.whenToUse || null,
                category: data.category || null,
                imageUrl: data.imageUrl || null,
            }
        });
        revalidatePath('/curation/frameworks');
        return { success: true, data: framework };
    } catch (e: any) { return { success: false, error: e.message }; }
}

export async function updateFramework(id: string, data: {
    name?: string; type?: string; summary?: string; content?: string;
    source?: string; whenToUse?: string; category?: string; imageUrl?: string;
}) {
    try {
        const framework = await prisma.framework.update({ where: { id }, data });
        revalidatePath('/curation/frameworks');
        return { success: true, data: framework };
    } catch (e: any) { return { success: false, error: e.message }; }
}

export async function deleteFramework(id: string) {
    try {
        await prisma.framework.delete({ where: { id } });
        revalidatePath('/curation/frameworks');
        return { success: true };
    } catch (e: any) { return { success: false, error: e.message }; }
}

// ==========================================
// CODEX (Codex Model)
// ==========================================
export async function getCodexEntries(options?: { category?: string; domain?: string }) {
    try {
        const where: any = {};
        if (options?.category) where.category = options.category;
        if (options?.domain) where.domain = options.domain;

        const entries = await prisma.codex.findMany({ where, orderBy: { createdAt: 'desc' } });
        return { success: true, data: entries };
    } catch (e: any) { return { success: false, error: e.message }; }
}

export async function getCodexById(id: string) {
    try {
        const entry = await prisma.codex.findUnique({ where: { id } });
        if (!entry) return { success: false, error: "Codex entry not found" };
        return { success: true, data: entry };
    } catch (e: any) { return { success: false, error: e.message }; }
}

export async function createCodexEntry(data: {
    title: string; domain?: string; content?: string;
    conviction?: string; status?: string; category?: string;
}) {
    if (!data.title) return { success: false, error: "Title is required" };
    try {
        const entry = await prisma.codex.create({
            data: {
                title: data.title,
                domain: data.domain || null,
                content: data.content || null,
                conviction: data.conviction || null,
                status: data.status || 'evolving',
                category: data.category || null,
            }
        });
        revalidatePath('/curation/codex');
        return { success: true, data: entry };
    } catch (e: any) { return { success: false, error: e.message }; }
}

export async function updateCodexEntry(id: string, data: {
    title?: string; domain?: string; content?: string;
    conviction?: string; status?: string; category?: string;
}) {
    try {
        const entry = await prisma.codex.update({ where: { id }, data });
        revalidatePath('/curation/codex');
        return { success: true, data: entry };
    } catch (e: any) { return { success: false, error: e.message }; }
}

export async function deleteCodexEntry(id: string) {
    try {
        await prisma.codex.delete({ where: { id } });
        revalidatePath('/curation/codex');
        return { success: true };
    } catch (e: any) { return { success: false, error: e.message }; }
}

// ==========================================
// WISHLIST (WishlistItem Model)
// ==========================================
export async function getWishlistItems() {
    try {
        const items = await prisma.wishlistItem.findMany({ orderBy: { createdAt: "desc" } });
        return { success: true, data: items };
    } catch (e: any) { return { success: false, error: e.message }; }
}

export async function createWishlistItem(name: string, price: string, url: string, imageUrl?: string) {
    if (!name) return { success: false, error: "Name is required" };
    try {
        const item = await prisma.wishlistItem.create({
            data: { name, price: price || "", url, imageUrl: imageUrl || null }
        });
        return { success: true, data: item };
    } catch (e: any) { return { success: false, error: e.message }; }
}

export async function updateWishlistItem(id: string, name: string, price: string, url: string, imageUrl?: string) {
    if (!name) return { success: false, error: "Name is required" };
    try {
        const item = await prisma.wishlistItem.update({
            where: { id },
            data: { name, price: price || "", url, imageUrl: imageUrl || null }
        });
        return { success: true, data: item };
    } catch (e: any) { return { success: false, error: e.message }; }
}

export async function deleteWishlistItem(id: string) {
    try { await prisma.wishlistItem.delete({ where: { id } }); return { success: true }; }
    catch (e: any) { return { success: false, error: e.message }; }
}
