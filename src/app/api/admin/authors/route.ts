import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
    try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const { data, error } = await supabase
            .from('authors')
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ message: 'Xəta baş verdi' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        
        const { data, error } = await supabase
            .from('authors')
            .insert([body])
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ message: 'Yaratma xətası' }, { status: 500 });
    }
}
