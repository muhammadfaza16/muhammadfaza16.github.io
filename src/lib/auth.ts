import { cookies } from 'next/headers';

const ADMIN_SECRET = process.env.ADMIN_SECRET || "161616";
const COOKIE_NAME = "admin_token";

/**
 * Check if the current request is from an admin.
 * Use in API routes and server actions.
 */
export async function isAdminRequest(): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME);

        if (!token?.value) return false;

        const decoded = Buffer.from(token.value, 'base64').toString();
        const [prefix, secret] = decoded.split(':');
        return prefix === 'admin' && secret === ADMIN_SECRET;
    } catch {
        return false;
    }
}
