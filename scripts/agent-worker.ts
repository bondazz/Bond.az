import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import * as cheerio from "cheerio";
import Together from "together-ai";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

async function rewriteWithGemini(originalTitle: string, fullContent: string) {
    console.log('--- Gemini 1.5 Pro: Deep SEO Analytics Started ---');
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-pro",
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
    TASK: Professional SEO Master Journalist. Rewrite into 3 languages: AZ, EN, RU.
    STRICT RULES:
    1. NO INTERNAL HEADERS (Conclusion, Intro, etc). Use clean, long paragraphs (8+).
    2. SEO: Title/Slug max 60 chars. Meta max 170 chars. Slug must match English title.
    3. STRUCTURE: First paragraph must start with the main headline.
    4. HTML: 3-5 internal links to /tag/[word] format. Use only <p> tags.
    
    Format JSON: { "az": { "title", "content", "slug", "seo_desc" }, "en": ..., "ru": ... }
    
    Original News:
    Title: ${originalTitle}
    Content: ${fullContent}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
}

async function generateArtisticImage(title: string) {
    console.log('--- Generating Premium 3D Visual Metaphor ---');
    const prompt = `A high-end cinematic 3D visual metaphor for a news story titled: [${title}]. The image must be strictly symbolic and contain NO text, letters, or words. Create a unique central composition using premium 3D textures (such as liquid metal, translucent glass, glowing obsidian, or carved stone) that best represents the news mood. Use a dark, atmospheric environment with dramatic 'Chiaroscuro' lighting (strong contrast between deep shadows and vibrant glows). Add subtle floating particles or blurred abstract elements in the background to enhance depth. Each render must be a unique artistic interpretation of the headline. 4K resolution, ultra-modern aesthetic, 16:9 aspect ratio.`;

    try {
        const response = await together.images.generate({
            model: "stabilityai/stable-diffusion-3-medium",
            prompt: prompt,
            //@ts-ignore
            response_format: "b64_json"
        });
        //@ts-ignore
        const buffer = Buffer.from(response.data[0].b64_json, 'base64');
        const fileName = `agent-v-${Date.now()}.webp`;
        await supabase.storage.from('posts').upload(fileName, buffer, { contentType: 'image/webp' });
        const { data: { publicUrl } } = supabase.storage.from('posts').getPublicUrl(fileName);
        return publicUrl;
    } catch (err) {
        console.error("Image gen failed:", err);
        return null;
    }
}

async function scrapeOxuAz() {
    console.log('--- Agent: Scanning oxu.az homepage ---');
    const { data } = await axios.get('https://oxu.az', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(data);
    const newsLinks: string[] = [];

    // Oxu.az link strukturu adətən kateqoriya/slug formasındadır
    $('a').each((_, el) => {
        const href = $(el).attr('href');
        if (href && href.split('/').length >= 3 && !href.includes('about') && !href.includes('contact')) {
            const fullUrl = href.startsWith('http') ? href : `https://oxu.az${href}`;
            if (fullUrl.includes('oxu.az/') && !newsLinks.includes(fullUrl)) {
                newsLinks.push(fullUrl);
            }
        }
    });

    console.log(`Found ${newsLinks.length} target links.`);
    return newsLinks.slice(0, 3); // Test üçün ilk 3-ü götürək
}

async function scrapePostContent(url: string) {
    try {
        console.log(`Deep-Scraping: ${url}`);
        const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const $ = cheerio.load(data);
        const title = $('h1').text().trim();
        let content = '';
        $('.post-detail-content-inner.resize-area p').each((_, el) => {
            content += $(el).text() + '\n\n';
        });
        return { title, content };
    } catch { return null; }
}

async function main() {
    const links = await scrapeOxuAz();

    for (const link of links) {
        // DB-də var mı yoxla (Common ID kimi linkdən istifadə edirik)
        const { data: existing } = await supabase.from('posts').select('id').eq('common_id', link).limit(1);
        if (existing && existing.length > 0) {
            console.log(`Skipping: Already processed.`);
            continue;
        }

        const rawData = await scrapePostContent(link);
        if (!rawData || !rawData.content) continue;

        try {
            const aiData = await rewriteWithGemini(rawData.title, rawData.content);
            const imageUrl = await generateArtisticImage(rawData.title);

            const translations = ['az', 'en', 'ru'].map(lang => {
                const post = aiData[lang];
                return {
                    common_id: link,
                    lang: lang,
                    title: post.title,
                    slug: post.slug,
                    category: "Gündəm",
                    category_slug: "news",
                    image: imageUrl || "https://bond.az/placeholder.png",
                    summary: post.seo_desc,
                    content: post.content,
                    date: new Date().toISOString(),
                    author: "BOND AGENT PRO",
                    views: 0, likes: 0, dislikes: 0
                };
            });

            await supabase.from('posts').insert(translations);
            console.log(`SUCCESS: Published [${rawData.title}] in 3 languages.`);
        } catch (err) {
            console.error(`ERROR processing ${link}:`, err);
        }
    }
}

main();
