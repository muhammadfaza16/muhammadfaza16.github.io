"use server";

import prisma from "@/lib/prisma";

// ==========================================
// TO READ (Article Model)
// ==========================================
export async function getToReadArticles() {
    try {
        const articles = await prisma.article.findMany({
            orderBy: { createdAt: "desc" },
        });
        return { success: true, data: articles };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function createToReadArticle(title: string, url: string, notes: string, imageUrl?: string) {
    if (!title || !url) {
        return { success: false, error: "Title and URL are required" };
    }
    try {
        const article = await prisma.article.create({
            data: {
                title,
                coverImage: url,
                content: notes || "No notes provided.",
                imageUrl: imageUrl || null,
            }
        });
        return { success: true, data: article };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function toggleReadStatus(id: string, currentStatus: boolean) {
    try {
        const article = await prisma.article.update({
            where: { id },
            data: { isRead: !currentStatus }
        });
        return { success: true, data: article };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function updateToReadArticle(id: string, title: string, url: string, notes: string, imageUrl?: string) {
    if (!title || !url) return { success: false, error: "Title and URL are required" };
    try {
        const article = await prisma.article.update({
            where: { id },
            data: { title, coverImage: url, content: notes || "No notes provided.", imageUrl: imageUrl || null }
        });
        return { success: true, data: article };
    } catch (e: any) { return { success: false, error: e.message }; }
}

export async function deleteToReadArticle(id: string) {
    try {
        await prisma.article.delete({ where: { id } });
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

export async function createWritingArticle(title: string, content: string, coverImage: string, imageUrl?: string) {
    if (!title) return { success: false, error: "Title is required" };
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    try {
        const post = await prisma.post.create({
            data: { title, slug, content: content || "", coverImage, imageUrl: imageUrl || null }
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

export async function updateWritingArticle(id: string, title: string, content: string, coverImage: string, imageUrl?: string) {
    if (!title) return { success: false, error: "Title is required" };
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    try {
        const post = await prisma.post.update({
            where: { id },
            data: { title, slug, content: content || "", coverImage, imageUrl: imageUrl || null }
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
export async function getBooks() {
    try {
        const books = await prisma.book.findMany({ orderBy: { createdAt: "desc" } });
        return { success: true, data: books };
    } catch (e: any) { return { success: false, error: e.message }; }
}

export async function createBook(title: string, author: string, coverImage: string, review: string, imageUrl?: string) {
    if (!title || !author) return { success: false, error: "Title and author required" };
    try {
        const book = await prisma.book.create({
            data: { title, author, coverImage, review: review || "", imageUrl: imageUrl || null }
        });
        return { success: true, data: book };
    } catch (e: any) { return { success: false, error: e.message }; }
}

export async function updateBook(id: string, title: string, author: string, coverImage: string, review: string, imageUrl?: string) {
    if (!title || !author) return { success: false, error: "Title and author required" };
    try {
        const book = await prisma.book.update({
            where: { id },
            data: { title, author, coverImage, review: review || "", imageUrl: imageUrl || null }
        });
        return { success: true, data: book };
    } catch (e: any) { return { success: false, error: e.message }; }
}

export async function deleteBook(id: string) {
    try { await prisma.book.delete({ where: { id } }); return { success: true }; }
    catch (e: any) { return { success: false, error: e.message }; }
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
