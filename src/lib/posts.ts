import fs from 'fs';
import path from 'path';

export interface Post {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    lastUpdated?: string;
    readingTime?: string;
    content: string;
    thumbnail?: string;
}

// Helper to calculate reading time
export function calculateReadingTime(content: string): string {
    const wordsPerMinute = 100;
    // Remove markdown/HTML tags for more accurate word count
    const plainText = content.replace(/[#*`~>\[\]]/g, '').replace(/<[^>]*>/g, '');
    const words = plainText.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
}

// Path to posts.json
const postsFilePath = path.join(process.cwd(), 'data', 'posts.json');

// Read posts from JSON file
function readPostsFromFile(): Post[] {
    try {
        if (!fs.existsSync(postsFilePath)) {
            return [];
        }
        const fileContent = fs.readFileSync(postsFilePath, 'utf-8');
        const posts: Post[] = JSON.parse(fileContent);
        // Calculate reading time for each post
        return posts.map(post => ({
            ...post,
            readingTime: calculateReadingTime(post.content)
        }));
    } catch (error) {
        console.error('Error reading posts:', error);
        return [];
    }
}

// Write posts to JSON file
export function writePostsToFile(posts: Post[]): boolean {
    try {
        // Remove readingTime before saving (it's calculated dynamically)
        const postsToSave = posts.map(({ readingTime, ...rest }) => rest);
        fs.writeFileSync(postsFilePath, JSON.stringify(postsToSave, null, 2), 'utf-8');
        return true;
    } catch (error) {
        console.error('Error writing posts:', error);
        return false;
    }
}

// Get all posts
export function getAllPosts(): Post[] {
    const posts = readPostsFromFile();
    return posts;
}

// Get post by slug
export function getPostBySlug(slug: string): Post | undefined {
    const posts = readPostsFromFile();
    return posts.find((post) => post.slug === slug);
}

// Get latest posts
export function getLatestPosts(count: number = 3): Post[] {
    return getAllPosts().slice(0, count);
}

// Get adjacent posts for navigation
export function getAdjacentPosts(slug: string): { prev: Post | null; next: Post | null } {
    const allPosts = getAllPosts();
    const currentIndex = allPosts.findIndex((post) => post.slug === slug);

    if (currentIndex === -1) {
        return { prev: null, next: null };
    }

    return {
        prev: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
        next: currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null,
    };
}

// Create a new post
export function createPost(post: Omit<Post, 'readingTime'>): Post | null {
    try {
        const posts = readPostsFromFile();

        // Check if slug already exists
        if (posts.some(p => p.slug === post.slug)) {
            return null;
        }

        const newPost: Post = {
            ...post,
            readingTime: calculateReadingTime(post.content)
        };

        posts.unshift(newPost); // Add to beginning
        writePostsToFile(posts);
        return newPost;
    } catch (error) {
        console.error('Error creating post:', error);
        return null;
    }
}

// Update an existing post
export function updatePost(slug: string, updates: Partial<Omit<Post, 'slug' | 'readingTime'>>): Post | null {
    try {
        const posts = readPostsFromFile();
        const index = posts.findIndex(p => p.slug === slug);

        if (index === -1) {
            return null;
        }

        posts[index] = {
            ...posts[index],
            ...updates,
            readingTime: calculateReadingTime(updates.content || posts[index].content)
        };

        writePostsToFile(posts);
        return posts[index];
    } catch (error) {
        console.error('Error updating post:', error);
        return null;
    }
}

// Delete a post
export function deletePost(slug: string): boolean {
    try {
        const posts = readPostsFromFile();
        const filteredPosts = posts.filter(p => p.slug !== slug);

        if (filteredPosts.length === posts.length) {
            return false; // Post not found
        }

        writePostsToFile(filteredPosts);
        return true;
    } catch (error) {
        console.error('Error deleting post:', error);
        return false;
    }
}

// Generate slug from title
export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}
