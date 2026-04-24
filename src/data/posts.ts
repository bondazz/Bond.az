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
    lang: 'az' | 'en' | 'ru';
    commonId: string; // Used to link translations of the same story
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
        id: 2,
        title: "Azərbaycan Prezidenti tərəfindən yeni mətbuat katibi təyin edildi",
        slug: "azerbaycan-prezidenti-terefinden-yeni-metbuat-katibi-teyin-edildi",
        category: "Daxili",
        categorySlug: "daxili",
        image: "https://foxiz.io/justforyou/wp-content/uploads/2021/10/e2-615x410.jpg",
        summary: "Dövlət qurumlarında həyata keçirilən struktur islahatları və yeni kadr təyinatları ilə bağlı rəsmi fərmanlar qüvvəyə minib.",
        likes: 850,
        dislikes: 12,
        views: 12300,
        date: "BU GÜN / 12:30",
        lang: 'az',
        commonId: 'prezident-pres-katibi'
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
    },
    {
        id: 3,
        title: "Sosial təminat: Əlilliyi olan şəxslərə pulsuz avtomobillərin verilməsinə başlanıldı",
        slug: "sosial-teminat-elilliyi-olan-sexslere-pulsuz-avtomobillerin-verilmesine-baslanildi",
        category: "Cəmiyyət",
        categorySlug: "cemiyyet",
        image: "https://foxiz.io/justforyou/wp-content/uploads/2021/09/34-615x410.jpg",
        summary: "Vətəndaşların sosial müdafiəsinin gücləndirilməsi məqsədilə növbəti mərhələdə nəzərdə tutulan avtomobil siyahısı açıqlanıb.",
        likes: 3400,
        dislikes: 84,
        views: 89000,
        date: "12 APREL / 09:15",
        lang: 'az',
        commonId: 'sosial-teminat-avto'
    },
    {
        id: 4,
        title: "Bakıda 'Tramp Marşrutu' layihəsinin tikintisinə start verilir",
        slug: "bakida-tramp-marsrutu-layihesinin-tikintisine-start-verilir",
        category: "İqtisadiyyat",
        categorySlug: "iqtisadiyyat",
        image: "https://foxiz.io/justforyou/wp-content/uploads/2023/03/j14-420x280.jpg",
        summary: "Yeni nəqliyyat infrastrukturunun region üçün əhəmiyyəti və layihənin Azərbaycana gətirəcəyi iqtisadi mənfəətlər müzakirə olunur.",
        likes: 560,
        dislikes: 22,
        views: 7800,
        date: "BU GÜN / 15:46",
        lang: 'az',
        commonId: 'tramp-marsrutu'
    },
    {
        id: 5,
        title: "Pensiya və əməkhaqqı artımı: Yeni qaydalar rəsmi olaraq elan edildi",
        slug: "pensiya-ve-emekhaqqi-artimi-yeni-qaydalar-resmi-olaraq-elan-edildi",
        category: "İqtisadiyyat",
        categorySlug: "iqtisadiyyat",
        image: "https://foxiz.io/justforyou/wp-content/uploads/2021/09/e15-1-420x280.jpg",
        summary: "Əmək pensiyalarının minimum məbləği və dövlət sektorunda çalışanların maaş artımı ilə bağlı rəsmi açıqlamalar yer alır.",
        likes: 1560,
        dislikes: 30,
        views: 31000,
        date: "DÜN / 14:10",
        lang: 'az',
        commonId: 'pensiya-artimi'
    }
];
