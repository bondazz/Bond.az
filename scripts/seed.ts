import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const posts = [
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
    },
    {
        id: 1,
        title: "Tramp Hörmüz boğazı ilə bağlı xəbərdarlıq etdi: “Blokadanı yarmağa çalışan hər gəmi məhv ediləcək”",
        slug: "hormuz-bogazi-etrafinda-gerginlik-artir-iran-ordusu-herekete-kecdi",
        category: "Siyasət",
        categorySlug: "siyaset",
        image: "https://foxiz.io/justforyou/wp-content/uploads/2021/10/e1-860x478.jpg",
        summary: "ABŞ Prezidenti Donald Tramp Hörmüz boğazının blokadası ilə bağlı kəskin xəbərdarlıq edərək, hər hansı təxribatın amansızcasına qarşısının alınacağını bildirib.",
        content: "...",
        likes: 1205,
        dislikes: 45,
        views: 45200,
        date: "BU GÜN / 15:46",
        author: "BOND ADMIN",
        lang: 'az',
        commonId: 'trump-hormuz'
    },
    {
        id: 100,
        title: "US Treasury Secretary responds to claims of a weakening dollar",
        slug: "us-treasury-secretary-responds-to-claims-of-a-weakening-dollar",
        category: "World",
        categorySlug: "world",
        image: "/janet_yellen_news.png",
        summary: "US Treasury Secretary Janet Yellen stated that the status of the dollar as a global reserve currency is unshakable.",
        likes: 310,
        dislikes: 10,
        views: 4500,
        date: "TODAY / 10:15",
        lang: 'en',
        commonId: 'yellen-dollar'
    },
    {
        id: 200,
        title: "Министр финансов США ответила на заявления об ослаблении доллара",
        slug: "ministr-finansov-ssha-otvetila-na-zayavleniya-ob-oslablenii-dollara",
        category: "Мир",
        categorySlug: "world",
        image: "/janet_yellen_news.png",
        summary: "Министр финансов США Джанет Йеллен заявила, что статус доллара как мировой резервной валюты непоколебим.",
        likes: 150,
        dislikes: 5,
        views: 2300,
        date: "СЕГОДНЯ / 10:15",
        lang: 'ru',
        commonId: 'yellen-dollar'
    }
];

async function seed() {
    console.log('Migrating posts to Supabase...');

    const dbPosts = posts.map(p => ({
        common_id: p.commonId,
        lang: p.lang,
        title: p.title,
        category: p.category,
        category_slug: p.categorySlug,
        slug: p.slug,
        image: p.image,
        summary: p.summary,
        content: p.content || '',
        likes: p.likes,
        dislikes: p.dislikes,
        views: p.views,
        date: p.date,
        author: p.author || 'Bond.az'
    }));

    const { error } = await supabase.from('posts').insert(dbPosts);

    if (error) {
        console.error('Error seeding posts:', error.message);
    } else {
        console.log('Posts successfully migrated to Supabase!');
    }
}

seed();
