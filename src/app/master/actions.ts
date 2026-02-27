"use server";

import prisma from "@/lib/prisma";

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

export async function createToReadArticle(title: string, url: string, notes: string) {
    if (!title || !url) {
        return { success: false, error: "Title and URL are required" };
    }
    try {
        const article = await prisma.article.create({
            data: {
                title,
                coverImage: url,
                content: notes || "No notes provided.",
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

export async function deleteToReadArticle(id: string) {
    try {
        await prisma.article.delete({ where: { id } });
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
