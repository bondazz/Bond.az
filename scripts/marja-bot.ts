import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as dotenv from 'dotenv';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const s3Client = new S3Client({
    region: "auto",
    endpoint: "https://2b079fb369cb232d35182f81120b85b1.r2.cloudflarestorage.com",
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
});

async function rewriteWithAI(title: string, content: string) {
    console.log(`--- AI Rewriting: ${title.substring(0, 50)}... ---`);
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

async function generateHeroImage(title: string) {
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

        if (response.data && response.data.data && response.data.data[0]) {
            return response.data.data[0].url || response.data.data[0].b64_json;
        }
        return null;
    } catch (err) {
        console.error('Image Generation Failed:', err);
        return null;
    }
}

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

async function processAndUploadImage(imageData: string | null, title: string) {
    try {
        if (!imageData) {
            console.log("--- processAndUploadImage: Data is null ---");
            return null;
        }

        let buffer: Buffer;

        if (imageData.startsWith('http')) {
            console.log(`--- Fetching URL: ${imageData.substring(0, 50)}... ---`);
            const response = await axios.get(imageData, { 
                responseType: 'arraybuffer',
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            buffer = Buffer.from(response.data);
        } else if (imageData.startsWith('/') || imageData.startsWith('storage')) {
            const imageUrl = imageData.startsWith('/') ? `https://marja.az${imageData}` : `https://marja.az/${imageData}`;
            console.log(`--- Fetching Internal URL: ${imageUrl} ---`);
            const response = await axios.get(imageUrl, { 
                responseType: 'arraybuffer',
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            buffer = Buffer.from(response.data);
        } else if (imageData.length > 100) {
            console.log("--- Processing base64/raw image data ---");
            const cleanBase64 = imageData.replace(/^data:image\/\w+;base64,/, "");
            buffer = Buffer.from(cleanBase64, 'base64');
        } else {
            console.log("--- Invalid image data format ---");
            return null;
        }

        console.log(`--- Buffer received: ${buffer.length} bytes ---`);

        const compressed = await sharp(buffer)
            .resize({ width: 800, height: 450, fit: 'cover' })
            .webp({ quality: 80 })
            .toBuffer();
        console.log(`--- Sharp processing done: ${compressed.length} bytes ---`);

        const slugifiedTitle = slugifyTitle(title);
        const fileName = `storage/${slugifiedTitle}-${Date.now()}.webp`;

        await s3Client.send(new PutObjectCommand({
            Bucket: 'bond',
            Key: fileName,
            Body: compressed,
            ContentType: 'image/webp',
            CacheControl: 'public, max-age=31536000, immutable'
        }));

        const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${fileName}`;
        console.log(`--- Upload Success: ${publicUrl} ---`);
        return publicUrl;
    } catch (err: any) {
        console.error('--- processAndUploadImage ERROR ---');
        console.error('URL:', url);
        console.error('Message:', err.message);
        return null;
    }
}

async function scrapeMarja(limit = 1) {
    console.log("--- MARJA AI BOT: STARTING (AXIOS MODE) ---");

    try {
        const homeRes = await axios.get('https://marja.az/', {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
        });
        
        const $ = cheerio.load(homeRes.data);
        const links: string[] = [];
        
        $('li').each((_, el) => {
            if ($(el).find('small.mr-2').length > 0) {
                const link = $(el).find('a').attr('href');
                if (link && link.includes('marja.az') && !link.includes('advertising')) {
                    links.push(link);
                }
            }
        });

        const targetLinks = [...new Set(links)].slice(1, limit + 1);
        console.log(`--- Found ${targetLinks.length} items to check ---`);

        for (const url of targetLinks) {
            const { data: exists } = await supabase.from('posts').select('id').eq('common_id', url).limit(1);
            if (exists && exists.length > 0) {
                console.log(`[SKIP] Exists: ${url}`);
                continue;
            }

            console.log(`\n--- Fetching: ${url} ---`);
            const postRes = await axios.get(url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
            });
            const $post = cheerio.load(postRes.data);
            
            // Corrected Title Selector for Marja
            const originalTitle = $post('.news-head h2').first().text().trim() || 
                                $post('h1').first().text().trim() ||
                                $post('title').text().split('|')[0].trim();
                                
            const contentDiv = $post('.col-md-12.content-news');
            contentDiv.find('.middle-single, .text-link-underline').remove();
            
            const paragraphs = contentDiv.find('p').map((_, el) => $post(el).text().trim()).get().filter(t => t);
            const bodyText = paragraphs.join('\n\n');

            const galleryImages: string[] = [];
            // Catch main image and gallery images
            $post('.content-news img, .row.gallery img, .post-detail-content img, .main-image img').each((_, el) => {
                const src = $post(el).attr('src') || $post(el).attr('data-src');
                if (src && !src.includes('logo') && !src.includes('icon')) galleryImages.push(src);
            });

            // Extract category from breadcrumb
            const breadcrumb = $post('nav[aria-label="breadcrumb"] li.breadcrumb-item a').eq(1);
            const sourceCatName = breadcrumb.text().trim() || "İqtisadiyyat";
            const sourceCatSlug = (breadcrumb.attr('href') || "economy").split('/').pop() || "economy";

            if (!originalTitle || !bodyText) {
                console.log(`[FAILED] Title or Content empty for ${url}`);
                continue;
            }

            const [aiResult, heroUrl] = await Promise.all([
                rewriteWithAI(originalTitle, bodyText),
                generateHeroImage(originalTitle)
            ]);

            let uploadedHero = await processAndUploadImage(heroUrl || galleryImages[0], originalTitle);
            
            // Critical Fallback for Hero Image
            if (!uploadedHero && galleryImages.length > 0) {
                console.log("--- Hero upload failed, trying first gallery image ---");
                uploadedHero = await processAndUploadImage(galleryImages[0], originalTitle);
            }
            
            if (!uploadedHero) {
                console.log("--- CRITICAL: No image found, using backup asset ---");
                uploadedHero = "https://cdn.bond.az/assets/default-news.webp";
            }

            const uploadedGallery = await Promise.all(
                galleryImages.slice(1, 4).map(img => processAndUploadImage(img, originalTitle))
            );

            const galleryHtml = uploadedGallery
                .filter(u => u)
                .map(u => `<p><img src="${u}" style="width:100%; height:auto; border-radius:8px; margin-top:15px;" /></p>`)
                .join('');

            const posts = await Promise.all(['az', 'en', 'ru'].map(async (lang) => {
                const p = aiResult[lang];
                
                // Fixed Category for Marja
                let catName = "Marja";
                let catSlug = "marja";
                
                if (lang === 'en') {
                    catName = "Marja EN";
                    catSlug = "marja-en";
                } else if (lang === 'ru') {
                    catName = "Marja RU";
                    catSlug = "marja-ru";
                }

                const { data: authors } = await supabase.from('authors').select('id, name').eq('lang', lang);
                const author = authors?.[Math.floor(Math.random() * (authors?.length || 1))] || { id: null, name: "Admin" };

                return {
                    common_id: url,
                    lang: lang,
                    title: p.title,
                    slug: slugifyTitle(p.title),
                    category: catName,
                    category_slug: catSlug,
                    image: uploadedHero,
                    summary: p.seo_desc,
                    content: p.content + galleryHtml,
                    faqs: p.faqs,
                    author: author.name,
                    author_id: author.id,
                    date: new Date().toISOString(),
                    views: Math.floor(Math.random() * 500) + 100
                };
            }));

            const { error } = await supabase.from('posts').insert(posts);
            if (error) console.error('Error:', error);
            else console.log(`--- SUCCESS: Published ${originalTitle} ---`);
        }

    } catch (err) {
        console.error('Bot Error:', err);
    }
}

scrapeMarja(1);
