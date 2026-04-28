import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as dotenv from 'dotenv';
import Parser from 'rss-parser';
import { chromium } from "playwright-extra";
import stealth from "puppeteer-extra-plugin-stealth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

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
    Elite SEO Journalist and Creative Content Writer. 
    TASK: Rewrite the following news article into 3 languages: AZ, EN, RU.
    CRITICAL: 
    - The content MUST be 100% unique and pass all plagiarism checkers (Google, etc.). 
    - The writing style MUST be 100% human-like (humanized) to bypass all AI content detectors and search engine filters.
    - You MUST completely change the news title to something more engaging and SEO-friendly while maintaining the core meaning. 
    - Do not simply translate; rewrite the entire narrative structure to be original.
    
    Format as JSON: { "az": { "title", "content", "slug", "seo_desc", "faqs": [{"question", "answer"}] }, "en": ..., "ru": ... }
    STRICT: No headers, use <p> tags, 3-5 internal links <a href="/tag/keyword">, generate 2-5 FAQs for schema.
    RHYTHM: Keep paragraphs short and punchy. Use frequent paragraph breaks (<p> tags) to ensure high readability.
    
    SOURCE TO REWRITE:
    Original Title: ${title}
    Original Content: ${content}
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

async function generateImageWithOpenAI(title: string) {
    console.log(`--- Generating AI Image with GPT Image 2 (ULTRA LOW COST: $0.005) for: ${title} ---`);
    const prompt = `Create a single wheatpaste-style poster image based on the following news headline: "{${title}}" 
    Requirements: 
    - Style: Wheatpaste street poster aesthetic, urban wall background, realistic paper texture, slightly distressed, torn edges.
    - Visual concept: Symbolic representation of the news content, strong central focus.
    - No text, no typography, no logos.
    - Colors: Limited palette (red, black, off-white), slightly gritty.
    - Lighting: Soft cinematic lighting.`;

    try {
        const response = await axios.post('https://api.openai.com/v1/images/generations', {
            model: "gpt-image-2",
            prompt: prompt,
            n: 1,
            size: "1536x1024",
            quality: "low"
        }, {
            headers: { 
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'OpenAI-Organization': process.env.OPENAI_ORG_ID,
                'Content-Type': 'application/json'
            }
        });
        
        // Debugging the new model's response structure
        if (response.data && response.data.data && response.data.data[0]) {
            const imageUrl = response.data.data[0].url || response.data.data[0].b64_json;
            console.log(`--- Image Generated Successfully via GPT Image 2 ---`);
            return imageUrl;
        } else {
            console.log('--- Unexpected Response Structure:', JSON.stringify(response.data));
            return null;
        }
    } catch (err: any) {
        console.error('CRITICAL ERROR: GPT Image 2 call failed!');
        if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Error Details:', JSON.stringify(err.response.data));
        }
        return null;
    }
}

const s3Client = new S3Client({
    region: "auto",
    endpoint: "https://2b079fb369cb232d35182f81120b85b1.r2.cloudflarestorage.com",
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
});

function slugifyTitle(title: string) {
    const map: { [key: string]: string } = {
        'ə': 'e', 'ö': 'o', 'ü': 'u', 'ş': 's', 'ç': 'c', 'ğ': 'g', 'ı': 'i',
        'Ə': 'E', 'Ö': 'O', 'Ü': 'U', 'Ş': 'S', 'Ç': 'C', 'Ğ': 'G', 'I': 'I',
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
        'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
        'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts',
        'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
        'А': 'a', 'Б': 'b', 'В': 'v', 'Г': 'g', 'Д': 'd', 'Е': 'e', 'Ё': 'e', 'Ж': 'zh',
        'З': 'z', 'И': 'i', 'Й': 'y', 'К': 'k', 'Л': 'l', 'М': 'm', 'Н': 'n', 'О': 'o',
        'П': 'p', 'Р': 'r', 'С': 's', 'Т': 't', 'У': 'u', 'Ф': 'f', 'Х': 'h', 'Ц': 'ts',
        'Ч': 'ch', 'Ш': 'sh', 'Щ': 'sch', 'Ъ': '', 'Ы': 'y', 'Ь': '', 'Э': 'e', 'Ю': 'yu', 'Я': 'ya'
    };
    const mapped = title.split('').map(char => map[char] !== undefined ? map[char] : char).join('');
    const slug = mapped.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return slug || `post-${Date.now()}`;
}

async function uploadImageToR2(imageData: string | null, title: string) {
    try {
        if (!imageData) return null;
        
        let originalBuffer: Buffer;

        if (imageData.startsWith('http')) {
            console.log(`--- Fetching image from URL for R2: ${imageData.substring(0, 50)}... ---`);
            const response = await axios.get(imageData, { responseType: 'arraybuffer' });
            originalBuffer = Buffer.from(response.data);
        } else if (imageData.length > 100) {
            console.log('--- Processing base64/raw image data for R2 ---');
            const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
            originalBuffer = Buffer.from(base64Data, 'base64');
        } else {
            return imageData;
        }

        console.log('--- Compressing and Resizing image with sharp... ---');
        const compressedBuffer = await sharp(originalBuffer)
            .resize({ width: 1200, withoutEnlargement: true })
            .webp({ quality: 75 })
            .toBuffer();

        const slugifiedTitle = slugifyTitle(title);
        const fileName = `storage/${slugifiedTitle}.webp`;

        console.log(`--- Uploading to Cloudflare R2 bucket 'bond' as ${fileName} ---`);
        await s3Client.send(new PutObjectCommand({
            Bucket: 'bond',
            Key: fileName,
            Body: compressedBuffer,
            ContentType: 'image/webp',
            CacheControl: 'public, max-age=31536000, immutable'
        }));

        const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://pub-2b079fb369cb232d35182f81120b85b1.r2.dev";
        const publicUrl = `${r2PublicUrl}/${fileName}`;
        console.log(`--- Image Uploaded Successfully to R2: ${publicUrl} ---`);
        return publicUrl;
    } catch (err) {
        console.error('R2 Image Upload Process Failed:', err);
        return null;
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

async function runNewsBot(count = 2) {
    console.log(`--- BOND AI BOT: STARTING (Target: ${count} posts) ---`);
    console.time("Total Action Time");
    
    const feed = await parser.parseURL('https://oxu.az/feed');
    let processedCount = 0;

    for (const item of feed.items) {
        if (processedCount >= count) break;

        const { data: exists } = await supabase.from('posts').select('id').eq('common_id', item.guid).limit(1);
        if (exists && exists.length > 0) continue;

        console.log(`\n[${processedCount + 1}/${count}] Processing: ${item.title}`);
        
        try {
            const source = await fetchWithViewSource(item.link!);
            if (!source || !source.text) continue;

            const [aiResult, generatedImageUrl] = await Promise.all([
                rewriteWithAI(item.title!, source.text),
                generateImageWithOpenAI(item.title!)
            ]);

            const myImageUrl = await uploadImageToR2(generatedImageUrl || source.imageUrl!, item.title!);

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
                    common_id: item.guid,
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
                console.log(`--- SUCCESS: Published [${item.title}] ---`);
                processedCount++;
            }
        } catch (err) {
            console.error(`Failed to process item: ${item.title}`, err);
        }
    }

    console.timeEnd("Total Action Time");
    if (processedCount === 0) console.log("Yeni xəbər tapılmadı.");
}

runNewsBot();
