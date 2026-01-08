import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Manifesto - Blog Pribadi';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: '#0A0A0A',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #333',
                        padding: '40px 80px',
                        borderRadius: '20px',
                        backgroundColor: '#111',
                    }}
                >
                    <h1 style={{
                        fontSize: 80,
                        fontFamily: 'serif',
                        marginBottom: 20,
                        letterSpacing: '-0.02em',
                        fontWeight: 700
                    }}>
                        Manifesto.
                    </h1>
                    <p style={{ fontSize: 32, color: '#888', textAlign: 'center', maxWidth: 600 }}>
                        Pikiran, prinsip, dan perspektif pribadi.
                    </p>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
