import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as dotenv from 'dotenv';
import Parser from 'rss-parser';
import { chromium } from "playwright-extra";
import stealth from "puppeteer-extra-plugin-stealth";

dotenv.config({ path: '.env.local' });
chromium.use(stealth());

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const parser = new Parser();

async function rewriteWithAI(title: string, content: string) {
    const prompt = `
    ### ROLE: 
    Elite SEO Journalist. Rewrite into 3 languages: AZ, EN, RU.
    Format as JSON: { "az": { "title", "content", "slug", "seo_desc", "faqs": [{"question", "answer"}] }, "en": ..., "ru": ... }
    STRICT: No headers, use <p> tags, 3-5 internal links <a href="/tag/keyword">, generate 2-5 FAQs for schema.
    RHYTHM: Keep paragraphs short and punchy. Use frequent paragraph breaks (<p> tags) to ensure high readability and mimic a professional news source.
    SOURCE:
    Title: ${title}
    Content: ${content}
    `;

    try {
        const response = await axios.post('https://api.deepseek.com/chat/completions', {
            model: "deepseek-chat",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: 'json_object' }
        }, {
            headers: { 'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}` }
        });
        return JSON.parse(response.data.choices[0].message.content);
    } catch (err) {
        console.error('AI Rewrite Error:', err);
        throw err;
    }
}

async function uploadImageToSupabase(imageUrl: string) {
    try {
        if (!imageUrl) return null;
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const fileName = `post-${Date.now()}.webp`;
        await supabase.storage.from('posts').upload(fileName, Buffer.from(response.data), { contentType: 'image/webp' });
        return supabase.storage.from('posts').getPublicUrl(fileName).data.publicUrl;
    } catch (err) {
        return imageUrl;
    }
}

async function fetchWithViewSource(url: string) {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        console.log(`--- View-Source reading: ${url} ---`);
        await page.goto(`view-source:${url}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
        const rawHtml = await page.textContent('body');
        await browser.close();
        if (!rawHtml) return null;

        const $ = cheerio.load(rawHtml);
        const contentDiv = $('.post-detail-content-inner.resize-area');
        const pTexts = contentDiv.find('p').map((_, el) => $(el).text().trim()).get().filter(t => t);
        const breadcrumb = $('li.breadcrumb-item.active a').first();
        const catName = breadcrumb.text().trim() || "Gündəm";
        const catSlug = (breadcrumb.attr('href') || "").split('/').pop() || "news";
        const ogImage = $('meta[property="og:image"]').attr('content') || $('.post-detail-content img').first().attr('src');

        return { text: pTexts.join('\n\n'), imageUrl: ogImage, category: { name: catName, slug: catSlug } };
    } catch (err) {
        if (browser) await browser.close();
        return null;
    }
}

async function runNewsBot() {
    console.log('--- BOND AI BOT: STARTING ---');
    console.time("Action Time");
    
    const feed = await parser.parseURL('https://oxu.az/feed');
    let targetItem = null;
    for (const item of feed.items.slice(0, 5)) {
        const { data: exists } = await supabase.from('posts').select('id').eq('common_id', item.guid).limit(1);
        if (!exists || exists.length === 0) {
            targetItem = item;
            break;
        }
    }

    if (!targetItem) {
        console.log("Yeni xəbər tapılmadı.");
        return;
    }

    console.log(`Processing: ${targetItem.title}`);

    const source = await fetchWithViewSource(targetItem.link!);
    if (!source || !source.text) return;

    const [aiResult, myImageUrl] = await Promise.all([
        rewriteWithAI(targetItem.title!, source.text),
        uploadImageToSupabase(source.imageUrl!)
    ]);

    const translations = await Promise.all(['az', 'en', 'ru'].map(async (lang) => {
        const post = aiResult[lang];
        
        const { data: catData } = await supabase
            .from('categories')
            .select('name, slug')
            .eq('common_slug', source.category.slug)
            .eq('lang', lang)
            .limit(1)
            .single();

        const { data: randomAuthors } = await supabase
            .from('authors')
            .select('id, name')
            .eq('lang', lang);
        
        const selectedAuthor = randomAuthors && randomAuthors.length > 0 
            ? randomAuthors[Math.floor(Math.random() * randomAuthors.length)]
            : { id: null, name: "Admin" };

        return {
            common_id: targetItem.guid,
            lang: lang,
            title: post.title,
            slug: post.slug,
            category: catData?.name || source.category.name,
            category_slug: catData?.slug || source.category.slug,
            image: myImageUrl,
            summary: post.seo_desc,
            content: post.content,
            faqs: post.faqs,
            date: new Date().toISOString(),
            author: selectedAuthor.name,
            author_id: selectedAuthor.id,
            views: Math.floor(Math.random() * 800) + 200
        };
    }));

    const { error } = await supabase.from('posts').insert(translations);
    if (error) {
        console.error('DB Insert Error:', error);
    } else {
        console.timeEnd("Action Time");
        console.log(`--- SUCCESS: Published [${targetItem.title}] ---`);
    }
}

runNewsBot();
