export interface Post {
    id: number;
    title: string;
    category: string;
    categorySlug: string;
    slug: string;
    image: string;
    summary: string;
    content?: string;
    likes: number;
    dislikes: number;
    views: number;
    date: string;
    author?: string;
    authorAvatar?: string;
    authorJobTitle?: string;
    authorId?: number;
    authorSlug?: string;
    lang: 'az' | 'en' | 'ru';
    commonId: string;
    audio_url?: string;
}

export const posts: Post[] = [
    {
        id: 0,
        title: "ABŞ-ın maliyyə nazirindən dolların zəifləyəcəyi iddialarına cavab",
        slug: "abs-nin-maliyye-nazirinden-dollarin-zeifleyeceyi-iddialarina-cavab",
        category: "Dünya",
        categorySlug: "dunya",
        image: "/janet_yellen_news.png",
        summary: "ABŞ Maliyyə naziri Canet Yellen dolların qlobal ehtiyat valyutası kimi statusunun sarsılmaz olduğunu bəyan edib.",
        content: "Maliyyə naziri xüsusi olaraq vurğulayıb ki, ABŞ iqtisadiyyatının gücü və maliyyə bazarlarının dərinliyi dolların lideliyini təmin edən əsas amillərdir...",
        likes: 2450,
        dislikes: 120,
        views: 67000,
        date: "BU GÜN / 10:15",
        author: "DÜNYA XƏBƏRLƏRİ",
        lang: 'az',
        commonId: 'yellen-dollar'
    }
    // Note: Other posts can be truncated for now if needed, but I'll try to keep some structure
];
