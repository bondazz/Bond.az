import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as dotenv from 'dotenv';
import Parser from 'rss-parser';
import { chromium } from "playwright-extra";
import stealth from "puppeteer-extra-plugin-stealth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

import { google } from 'googleapis';
import * as path from 'path';

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

    ### STRICT SEO RULES FOR EACH LANGUAGE:
    1. **Title**: Must be between 20-60 characters.
    2. **H1**: Must be between 20-60 characters.
    3. **SEO Title**: Must be between 20-60 characters TOTAL (this includes the suffix " | Bond.az").
    4. **Keyword Consistency**: All three fields (Title, H1, SEO Title) MUST use the same core keywords and stay highly relevant to each other.
    5. **Uniqueness**: Content must be 100% unique and pass plagiarism/AI detectors.
    6. **Rhythm**: Paragraphs must be short and punchy using <p> tags.
    7. **Slug**: Generate a URL-friendly slug based on the title.

    ### FORMAT:
    Return ONLY a JSON object with this structure:
    {
      "az": { 
        "title", "h1", "seo_title", "slug", "content", "seo_desc", 
        "keywords": ["key1", "key2", "key3"],
        "faqs": [{"question", "answer"}] 
      },
      "en": { ... },
      "ru": { ... }
    }

    ### SOURCE TO REWRITE:
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

function slugify(text: string): string {
    const azMap: { [key: string]: string } = {
        'ə': 'e', 'ç': 'c', 'ş': 's', 'ı': 'i', 'ö': 'o', 'ğ': 'g', 'ü': 'u',
        'Ə': 'e', 'Ç': 'c', 'Ş': 's', 'İ': 'i', 'Ö': 'o', 'Ğ': 'g', 'Ü': 'u'
    };

    const ruMap: { [key: string]: string } = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
        'А': 'a', 'Б': 'b', 'В': 'v', 'Г': 'g', 'Д': 'd', 'Е': 'e', 'Ё': 'yo', 'Ж': 'zh', 'З': 'z', 'И': 'i', 'Й': 'y', 'К': 'k', 'Л': 'l', 'М': 'm', 'Н': 'n', 'О': 'o', 'П': 'p', 'Р': 'r', 'С': 's', 'Т': 't', 'У': 'u', 'Ф': 'f', 'Х': 'kh', 'Ц': 'ts', 'Ч': 'ch', 'Ш': 'sh', 'Щ': 'shch', 'Ъ': '', 'Ы': 'y', 'Ь': '', 'Э': 'e', 'Ю': 'yu', 'Я': 'ya'
    };

    let result = text.split('').map(char => {
        return azMap[char] || ruMap[char] || char;
    }).join('');

    return result
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

async function generateTagSEOContent(tagName: string, lang: string) {
    console.log(`--- Generating Deep-Dive SEO Content for Tag: [${tagName}] (${lang}) ---`);

    const homepageLink = lang === 'az' ? 'https://bond.az' : `https://bond.az/${lang}`;

    const prompt = `
    ### ROLE: 
    Elite SEO Content Architect.
    TASK: Generate a comprehensive, 300+ word deep-dive article for the tag/keyword: "${tagName}" in language: "${lang}".

    ### CONTENT REQUIREMENTS:
    1. **Length**: Minimum 300 words.
    2. **Tone**: 100% Human-like, natural, professional, and engaging.
    3. **Readability**: High (100% readability). Use short paragraphs, subheadings (h2, h3), and bullet points.
    4. **SEO Optimization**: Use high CTR keywords naturally throughout the text.
    5. **Uniqueness**: 100% original, plagiarism-free content.
    6. **Internal Link**: Include EXACTLY ONE dofollow link to the homepage (${homepageLink}) with a natural anchor text like "Bond.az" or "xəbər portalı".
    7. **Structure**: Use HTML tags (<p>, <h2>, <h3>, <ul>, <li>).

    ### SEO META REQUIREMENTS:
    - SEO Title: High-click-rate title including "${tagName}".
    - SEO Description: Compelling summary for Google.
    - OG Title & Description: Engaging for social media.
    - Schema: Professional JSON-LD Schema (Article or FAQ).

    ### FORMAT:
    Return ONLY a JSON object:
    {
      "content": "HTML_CONTENT",
      "seo_title": "...",
      "seo_desc": "...",
      "og_title": "...",
      "og_desc": "...",
      "schema_data": { ... }
    }
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
        console.error(`Tag Generation Error [${tagName}]:`, err);
        return null;
    }
}

async function generateCategorySEOContent(catName: string, lang: string) {
    console.log(`--- Generating Deep-Dive SEO Content for Category: [${catName}] (${lang}) ---`);

    const homepageLink = lang === 'az' ? 'https://bond.az' : `https://bond.az/${lang}`;

    const prompt = `
    ### ROLE: 
    Elite SEO Content Architect.
    TASK: Generate a comprehensive, 400+ word authority pillar content for the news category: "${catName}" in language: "${lang}".

    ### CONTENT REQUIREMENTS:
    1. **Length**: Minimum 400 words.
    2. **Tone**: Professional, journalistic, and authoritative.
    3. **Readability**: 100% human-like. Use h2, h3, and bullet points.
    4. **SEO Optimization**: Focus on topical authority and high CTR keywords for "${catName}".
    5. **Uniqueness**: 100% original.
    6. **Internal Link**: Include EXACTLY ONE dofollow link to the homepage (${homepageLink}).
    7. **Category Translation**: Provide the most natural translation/name for this category in "${lang}".

    ### FORMAT:
    Return ONLY a JSON object:
    {
      "translated_name": "...",
      "content": "HTML_CONTENT",
      "seo_title": "...",
      "seo_description": "...",
      "og_title": "...",
      "og_desc": "...",
      "schema_data": { ... }
    }
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
        console.error(`Category Generation Error [${catName}]:`, err);
        return null;
    }
}

async function getOrCreateCategory(sourceCatName: string, sourceCatSlug: string, lang: string) {
    try {
        // 1. Check if category exists for this language
        const { data: existingCat } = await supabase
            .from('categories')
            .select('*')
            .eq('common_slug', sourceCatSlug)
            .eq('lang', lang)
            .maybeSingle();

        if (existingCat) return existingCat;

        // 2. Generate and Insert new category
        const catData = await generateCategorySEOContent(sourceCatName, lang);
        if (catData) {
            const slug = slugify(catData.translated_name);
            const { data: newCat, error: catError } = await supabase.from('categories').insert({
                name: catData.translated_name,
                slug: slug,
                common_slug: sourceCatSlug,
                lang: lang,
                content: catData.content,
                seo_title: catData.seo_title,
                seo_description: catData.seo_description,
                og_title: catData.og_title,
                og_desc: catData.og_desc,
                schema_data: catData.schema_data
            }).select().single();

            if (catError) {
                console.error('Category Insert Error:', catError);
                return { name: sourceCatName, slug: sourceCatSlug }; // Fallback
            }
            return newCat;
        }
    } catch (err) {
        console.error(`Error in getOrCreateCategory [${sourceCatSlug}]:`, err);
    }
    return { name: sourceCatName, slug: sourceCatSlug }; // Final Fallback
}

async function processTagsAndLinkify(content: string, keywords: string[], lang: string) {
    let linkifiedContent = content;

    for (const keyword of keywords.slice(0, 3)) { // Limit to 3 keywords per article
        try {
            // 1. Check if tag exists
            const { data: existingTag } = await supabase
                .from('tags')
                .select('slug')
                .eq('name', keyword)
                .eq('lang', lang)
                .maybeSingle();

            let slug;
            if (existingTag) {
                slug = existingTag.slug;
            } else {
                // 2. Generate and Insert new tag
                const tagData = await generateTagSEOContent(keyword, lang);
                if (tagData) {
                    slug = slugify(keyword);
                    const { error: tagError } = await supabase.from('tags').insert({
                        name: keyword,
                        slug: slug,
                        lang: lang,
                        content: tagData.content,
                        seo_title: tagData.seo_title,
                        seo_desc: tagData.seo_desc,
                        og_title: tagData.og_title,
                        og_desc: tagData.og_desc,
                        schema_data: tagData.schema_data
                    });
                    if (tagError) console.error('Tag Insert Error:', tagError);
                }
            }

            // 3. Linkify keyword in content (Case-insensitive replacement for first occurrence)
            if (slug) {
                const tagUrl = lang === 'az' ? `/tag/${slug}` : `/${lang}/tag/${slug}`;
                const regex = new RegExp(`(${keyword})`, 'i');
                linkifiedContent = linkifiedContent.replace(regex, `<a href="${tagUrl}" class="internal-tag-link">$1</a>`);
            }
        } catch (err) {
            console.error(`Error processing tag [${keyword}]:`, err);
        }
    }

    return linkifiedContent;
}

async function generateImageWithOpenAI(title: string) {
    console.log(`--- Generating AI Image (AI-Chosen Palette) for: ${title.substring(0, 50)}... ---`);

    const prompt = `Create a mixed-media poster based on the following news headline: "{${title}}" 
    Requirements: 
    - Style: A mix of Wheatpaste and cut-out Collage art.
    - Visual concept: Artistic representation of the news content using paper collage elements pasted on a textured urban wall.
    - Elements: Realistic paper textures, distressed/torn edges, overlapping collage cut-outs.
    - No text, no typography, no logos.
    - Colors: Choose a sophisticated, limited color palette (2-3 colors) that perfectly matches the mood, theme, and context of the news headline. The palette should feel professional and editorial.
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
            .resize({ width: 800, height: 450, fit: 'cover' })
            .webp({ quality: 80 })
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

async function runNewsBot(limit = 5) {
    console.log(`--- BOND AI BOT: STARTING TOP-${limit} CHECK ---`);
    console.time("Total Action Time");

    try {
        const feed = await parser.parseURL('https://oxu.az/feed');
        const itemsToCheck = feed.items.slice(0, limit);
        let publishedCount = 0;

        for (const item of itemsToCheck) {
            // Check if post already exists by common_id (GUID)
            const { data: exists } = await supabase
                .from('posts')
                .select('id')
                .eq('common_id', item.guid)
                .limit(1);

            if (exists && exists.length > 0) {
                console.log(`[SKIP] Already exists: ${item.title}`);
                continue;
            }

            console.log(`\n[PROCESS] New item found: ${item.title}`);

            try {
                const source = await fetchWithViewSource(item.link!);
                if (!source || !source.text) {
                    console.log(`[FAILED] Could not extract content for: ${item.title}`);
                    continue;
                }

                // AI Processing & Image Generation in parallel
                const [aiResult, generatedImageUrl] = await Promise.all([
                    rewriteWithAI(item.title!, source.text),
                    generateImageWithOpenAI(item.title!)
                ]);

                // Upload to R2 (Fallback to original if AI generation fails)
                const myImageUrl = await uploadImageToR2(generatedImageUrl || source.imageUrl!, item.title!);

                const translations = await Promise.all(['az', 'en', 'ru'].map(async (lang) => {
                    const post = aiResult[lang];

                    // --- NEW: Process Tags & Linkify ---
                    const linkifiedContent = await processTagsAndLinkify(post.content, post.keywords || [], lang);

                    // --- NEW: Process Categories with SEO Structure ---
                    const catData = await getOrCreateCategory(source.category.name, source.category.slug, lang);

                    // Random author assignment
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
                        h1: post.h1 || post.title,
                        seo_title: post.seo_title || `${post.title} | Bond.az`,
                        slug: post.slug || slugifyTitle(post.title),
                        category: catData.name,
                        category_slug: catData.slug,
                        image: myImageUrl,
                        summary: post.seo_desc,
                        content: linkifiedContent,
                        faqs: post.faqs,
                        date: new Date().toISOString(),
                        author: selectedAuthor.name,
                        author_id: selectedAuthor.id,
                        views: Math.floor(Math.random() * 800) + 200
                    };
                }));

                const { error: insertError } = await supabase.from('posts').insert(translations);
                if (insertError) {
                    console.error('[ERROR] DB Insert Failed:', insertError);
                } else {
                    console.log(`--- SUCCESS: Published [${item.title}] ---`);
                    publishedCount++;

                    // --- PING GOOGLE INDEXING ---
                    for (const post of translations) {
                        const langPrefix = post.lang === 'az' ? '' : `/${post.lang}`;
                        const fullUrl = `https://bond.az${langPrefix}/${post.category_slug}/${post.slug}`;
                        await pingGoogleIndexing(fullUrl);
                    }
                }
            } catch (processErr) {
                console.error(`[ERROR] Processing failed for: ${item.title}`, processErr);
            }
        }

        console.log(`\n--- BOT FINISHED ---`);
        console.log(`Total Published: ${publishedCount}`);
        console.timeEnd("Total Action Time");

    } catch (feedErr) {
        console.error("CRITICAL ERROR: Failed to fetch RSS feed", feedErr);
    }
}

// --- GOOGLE INDEXING API PING ---
async function pingGoogleIndexing(url: string) {
    console.log(`--- Pinging Google Indexing API for: ${url} ---`);
    try {
        let auth;
        const envKey = process.env.GOOGLE_INDEXING_KEY;

        if (envKey) {
            // Support for Vercel/Production via Environment Variable
            const credentials = JSON.parse(envKey);
            auth = new google.auth.GoogleAuth({
                credentials,
                scopes: ['https://www.googleapis.com/auth/indexing'],
            });
        } else {
            // Fallback to local file for Development
            const keyPath = path.join(process.cwd(), 'scripts', 'google-key.json');
            auth = new google.auth.GoogleAuth({
                keyFile: keyPath,
                scopes: ['https://www.googleapis.com/auth/indexing'],
            });
        }

        const authClient = await auth.getClient();
        const indexing = google.indexing({
            version: 'v3',
            auth: authClient as any,
        });

        const res = await indexing.urlNotifications.publish({
            requestBody: {
                url: url,
                type: 'URL_UPDATED',
            },
        });
        console.log(`✅ Google Indexing Success: ${res.statusText}`);
    } catch (error: any) {
        console.error(`❌ Google Indexing Error: ${error.message}`);
    }
}

// Start with Top 5 Check
runNewsBot(2);
