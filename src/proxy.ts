import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function proxy(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    // Static faylları, API sorğularını və _next qovluğunu keç
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // Admin paneli üçün qoruma
    if (pathname.startsWith('/admin')) {
        if (pathname === '/admin/login') {
            return NextResponse.next();
        }
        
        const token = request.cookies.get('admin_session')?.value;
        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        // Təhlükəsizlik Yoxlanışı (Auth + Admins Table)
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY! // RLS-i keçmək üçün Service Role istifadə edirik
        );
        
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            const response = NextResponse.redirect(new URL('/admin/login', request.url));
            response.cookies.delete('admin_session');
            return response;
        }

        // MÜTLƏQ: Admins cədvəlində yoxlanış
        const { data: adminData } = await supabase
            .from('admins')
            .select('email')
            .eq('email', user.email)
            .single();

        if (!adminData) {
            console.error(`Unauthorized access attempt: ${user.email} is not in admins table.`);
            const response = NextResponse.redirect(new URL('/admin/login', request.url));
            response.cookies.delete('admin_session');
            return response;
        }
        
        return NextResponse.next();
    }

    // Dil yönləndirmələri
    if (!pathname.startsWith('/en') && !pathname.startsWith('/ru')) {
        if (!pathname.startsWith('/az')) {
            const url = new URL(`/az${pathname}${search}`, request.url);
            const response = NextResponse.rewrite(url);
            response.headers.set('x-lang', 'az');
            return response;
        }
        const response = NextResponse.next();
        response.headers.set('x-lang', 'az');
        return response;
    }

    const lang = pathname.startsWith('/en') ? 'en' : 'ru';
    const response = NextResponse.next();
    response.headers.set('x-lang', lang);
    return response;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
