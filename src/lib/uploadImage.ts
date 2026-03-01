import { getSupabase } from '@/lib/supabase';

export async function uploadImageToSupabase(file: File): Promise<string | null> {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `cms/${fileName}`;
    try {
        const client = getSupabase();
        const { error } = await client.storage.from('images').upload(filePath, file, { cacheControl: '3600', upsert: false });
        if (error) return null;
        const { data } = client.storage.from('images').getPublicUrl(filePath);
        return data.publicUrl;
    } catch (err) { return null; }
}
