import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await req.json();
    
    // 1. Get current category to check if slug is changing
    const { data: oldCategory } = await supabase
        .from('categories')
        .select('slug, lang')
        .eq('id', id)
        .single();

    // 2. Update the category itself
    const { data: updatedCategory, error } = await supabase
        .from('categories')
        .update(body)
        .eq('id', id)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // 3. If slug has changed, update all posts in that language with the new slug
    if (oldCategory && body.slug && oldCategory.slug !== body.slug) {
        const { error: postError } = await supabase
            .from('posts')
            .update({ category_slug: body.slug })
            .eq('category_slug', oldCategory.slug)
            .eq('lang', oldCategory.lang);
        
        if (postError) {
            console.error('Xəbərlər yenilənərkən xəta:', postError);
        }
    }

    return NextResponse.json(updatedCategory);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
