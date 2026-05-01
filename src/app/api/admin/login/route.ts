import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error || !data.user) {
            return NextResponse.json({ message: error?.message || 'Giriş uğursuzdur' }, { status: 401 });
        }

        // Set session cookie
        const cookieStore = await cookies();
        cookieStore.set('admin_session', data.session?.access_token || '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ message: 'Server xətası' }, { status: 500 });
    }
}
