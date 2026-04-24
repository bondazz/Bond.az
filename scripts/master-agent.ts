import { chromium } from "playwright-extra";
import stealth from "puppeteer-extra-plugin-stealth";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

chromium.use(stealth());

dotenv.config({ path: ".env.local" });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function masterBot() {
    console.log("--- INITIALIZING BROWSER ---");
    const userDataDir = path.join(process.cwd(), "bot_profile");
    console.log(`Using Local AI Profile: ${userDataDir}`);
    
    const context = await chromium.launchPersistentContext(userDataDir, {
        headless: false,
        channel: "chrome",
        viewport: { width: 1440, height: 900 },
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    // Artıq açıq olan tabları götürürük
    let pages = context.pages();
    const page = pages.length > 0 ? pages[0] : await context.newPage();
    const geminiPage = await context.newPage();

    console.log("--- BROWSER STARTED ---");
    console.log("Navigating to oxu.az (Force Proceed in 15s)...");
    try {
        await Promise.race([
            page.goto("https://oxu.az", { waitUntil: "commit", timeout: 80000 }),
            page.waitForTimeout(15000)
        ]);
    } catch (e) {
        console.log("Proceeding anyway...");
    }
    
    await page.waitForTimeout(2000);
    const newsLinks = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a'))
            .map(a => a.href)
            .filter(h => h.includes('oxu.az/') && h.split('/').length >= 4)
            .slice(0, 5);
    });

    for (const link of newsLinks) {
        // DB check
        const { data: existing } = await supabase.from('posts').select('id').eq('common_id', link).limit(1);
        if (existing && existing.length > 0) continue;

        console.log(`Processing: ${link}`);
        await page.goto(link, { waitUntil: "commit", timeout: 80000 });

        const rawData = await page.evaluate(() => {
            const title = document.querySelector('h1')?.innerText || "";
            const content = Array.from(document.querySelectorAll('.post-detail-content-inner.resize-area p'))
                .map(p => (p as HTMLElement).innerText).join("\n\n");
            const imageUrl = (document.querySelector('.post-detail-content img') as HTMLImageElement)?.src || "";
            return { title, content, imageUrl };
        });

        // 2. Gemini Rewrite (Browser Automation)
        await geminiPage.goto("https://gemini.google.com/app", { waitUntil: "commit", timeout: 80000 });
        const promptText = `
        Rewrite this news into 3 languages (AZ, EN, RU). 
        Format JSON: { "az": { "title", "content", "slug", "seo_desc" }, "en": ..., "ru": ... }
        RULES: SEO Master, 8+ paragraphs, only <p> tags.
        NEWS:
        Title: ${rawData.title}
        Content: ${rawData.content}
        `;

        await geminiPage.fill('div[aria-label="Enter a prompt here"]', promptText);
        await geminiPage.click('button[aria-label="Send message"]');
        
        // Wait for response (simplified)
        console.log("Waiting for Gemini AI Response...");
        await geminiPage.waitForSelector('.message-content:last-child', { timeout: 60000 });
        const aiResponseText = await geminiPage.innerText('.message-content:last-child');
        
        // JSON Temizleme
        const jsonMatch = aiResponseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) continue;
        const aiData = JSON.parse(jsonMatch[0]);

        // 3. Artistic Image Generation (Gemini Upload & Prompter)
        console.log("Generating Artistic Image via Gemini...");
        // Burada şəkli Gemini-yə yükləmək və promt yazmaq hissəsidir (Simulyasiya)
        // Lakin şəkil yükləmək çox mürəkkəb olduğu üçün biz hələlik promt ilə davam edə bilərik
        // Və ya original şəklin linkini Gemini-yə yapışdıra bilərik
        
        const imgPrompt = `A high-end cinematic 3D visual metaphor for a news story titled: [${rawData.title}]. The image must be strictly symbolic and contain NO text. 4K, 16:9.`;
        await geminiPage.fill('div[aria-label="Enter a prompt here"]', imgPrompt);
        await geminiPage.click('button[aria-label="Send message"]');
        
        await geminiPage.waitForSelector('.image-content img', { timeout: 60000 });
        const genImageUrl = await geminiPage.getAttribute('.image-content img:last-child', 'src');

        // 4. Save to DB
        const translations = ['az', 'en', 'ru'].map(lang => {
            const post = aiData[lang];
            return {
                common_id: link,
                lang: lang,
                title: post.title,
                slug: post.slug,
                category: "Gündəm",
                category_slug: "news",
                image: genImageUrl || rawData.imageUrl,
                summary: post.seo_desc,
                content: post.content,
                date: new Date().toISOString(),
                author: "MASTER AGENT",
                views: 0, likes: 0, dislikes: 0
            };
        });

        await supabase.from('posts').insert(translations);
        console.log(`Success: ${rawData.title}`);
    }

    // await context.close();
}

masterBot().catch(console.error);
