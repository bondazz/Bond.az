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

        // Fetch current views and increment
        const { data: post, error: fetchError } = await supabase
            .from('posts')
            .select('views')
            .eq('id', id)
            .single();

        if (fetchError) throw fetchError;

        const { error: updateError } = await supabase
            .from('posts')
            .update({ views: (post?.views || 0) + 1 })
            .eq('id', id);

        if (updateError) throw updateError;

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
