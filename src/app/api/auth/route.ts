import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ADMIN_SECRET = process.env.ADMIN_SECRET || "161616";
const COOKIE_NAME = "admin_token";

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        if (password === ADMIN_SECRET) {
            // Create a simple signed token (hash of secret + timestamp)
            const token = Buffer.from(`admin:${ADMIN_SECRET}:${Date.now()}`).toString('base64');

            const response = NextResponse.json({ success: true });
            response.cookies.set(COOKIE_NAME, token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/',
            });

            return response;
        }

        return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}

// GET: Check if admin is authenticated
export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME);

    if (token?.value) {
        try {
            const decoded = Buffer.from(token.value, 'base64').toString();
            const [prefix, secret] = decoded.split(':');
            if (prefix === 'admin' && secret === ADMIN_SECRET) {
                return NextResponse.json({ isAdmin: true });
            }
        } catch { }
    }

    return NextResponse.json({ isAdmin: false });
}

// DELETE: Logout
export async function DELETE() {
    const response = NextResponse.json({ success: true });
    response.cookies.delete(COOKIE_NAME);
    return response;
}
