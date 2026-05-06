import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    const { data, error } = await supabase
        .from('ads')
        .select('*')
        .order('slot_id');
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const body = await request.json();
    const { slot_id, type, content, link_url, is_active } = body;

    const { data, error } = await supabase
        .from('ads')
        .upsert({ 
            slot_id, 
            type, 
            content, 
            link_url, 
            is_active,
            updated_at: new Date().toISOString()
        }, { onConflict: 'slot_id' })
        .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data[0]);
}
