import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
                { status: 400 }
            );
        }

        // Validate file size (max 15MB)
        const maxSize = 15 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 15MB.' },
                { status: 400 }
            );
        }

        // Create unique filename
        const timestamp = Date.now();
        const ext = file.name.split('.').pop() || 'jpg';
        const filename = `${timestamp}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), 'public', 'images', 'blog');
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Write file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);

        // Return public URL
        const url = `/images/blog/${filename}`;
        return NextResponse.json({ url, filename });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
}
