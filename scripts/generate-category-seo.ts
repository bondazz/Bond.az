import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

async function generateCategorySEO(categoryName: string, lang: string) {
    console.log(`🚀 Generating SEO content for category: ${categoryName} (${lang})...`);
    
    const prompt = `Act as a senior SEO expert. Generate an IN-DEPTH, professional SEO-optimized article for a news category called "${categoryName}" in ${lang} language.
    Requirement:
    1. Minimum 1200 words.
    2. Focus on historical context, current importance, future trends, and why readers should follow this category on Bond.az.
    3. Generate 5 Frequently Asked Questions (FAQ) with detailed answers.
    4. Structure the response as a JSON object with keys: "content" (HTML string with <h2>, <p>, <ul> tags) and "faq" (array of {question, answer} objects).
    5. Tone: Authoritative, premium, human-like. No plagiarism.`;

    try {
        const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
            model: 'deepseek-chat',
            messages: [
                { role: 'system', content: 'You are a professional SEO and editorial specialist.' },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' }
        }, {
            headers: { 'Authorization': `Bearer ${DEEPSEEK_API_KEY}`, 'Content-Type': 'application/json' }
        });

        return JSON.parse(response.data.choices[0].message.content);
    } catch (error: any) {
        console.error('DeepSeek Error:', error.response?.data || error.message);
        return null;
    }
}

export async function processCategory(slug: string) {
    const langs = ['az', 'en', 'ru'];
    
    for (const lang of langs) {
        const { data: category } = await supabase
            .from('categories')
            .select('name')
            .eq('slug', slug)
            .eq('lang', lang)
            .single();

        if (category) {
            const aiData = await generateCategorySEO(category.name, lang);
            if (aiData) {
                await supabase
                    .from('categories')
                    .update({
                        content: aiData.content,
                        faq_data: aiData.faq // Assuming you added this column
                    })
                    .eq('slug', slug)
                    .eq('lang', lang);
                console.log(`✅ Updated ${slug} in ${lang}`);
            }
        }
    }
}

// Run for a specific category if needed
if (require.main === module) {
    const categorySlug = process.argv[2];
    if (categorySlug) {
        processCategory(categorySlug);
    }
}
