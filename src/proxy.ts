import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    const { pathname, search } = request.nextUrl

    // Static faylları, API sorğularını və _next qovluğunu keç
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // Əgər /en və ya /ru ilə BAŞLAMIRSA, deməli Azərbaycan dilidir
    if (!pathname.startsWith('/en') && !pathname.startsWith('/ru')) {
        // Amma əgər artıq /az ilə başlayırsa (bu da ola bilər), toxunma
        if (!pathname.startsWith('/az')) {
            // Daxildə /az prefiksi ilə REWRITE et (URL-də görünməyəcək)
            const url = new URL(`/az${pathname}${search}`, request.url);
            const response = NextResponse.rewrite(url);
            response.headers.set('x-lang', 'az');
            return response;
        }
        
        const response = NextResponse.next();
        response.headers.set('x-lang', 'az');
        return response;
    }

    // Digər diller üçün dili 'x-lang' olaraq header-ə yaz
    const lang = pathname.startsWith('/en') ? 'en' : 'ru';
    const response = NextResponse.next();
    response.headers.set('x-lang', lang);
    return response;
}

export const config = {
    matcher: [
        /*
         * Aşağıdakı fayllar xaric bütün linkləri tut:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
