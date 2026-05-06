import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { type } = await request.json(); // 'like' or 'dislike'

        if (type !== 'like' && type !== 'dislike') {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }

        const column = type === 'like' ? 'likes' : 'dislikes';

        // Direct increment
        const { data: post } = await supabase.from('posts').select(column).eq('id', id).single() as any;
        const currentCount = (post?.[column] || 0);

        const { error } = await supabase
            .from('posts')
            .update({ [column]: currentCount + 1 })
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true, count: currentCount + 1 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
