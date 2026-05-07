import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function generateCategorySEOContent(catName: string, lang: string) {
    const homepageLink = "https://bond.az" + (lang === 'az' ? '' : `/${lang}`);
    
    const prompt = `
    ROLE: Elite SEO Content Architect.
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
      "schema_data": { 
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "...",
          "description": "..."
      }
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
        console.error(`Generation Error [${catName}]:`, err);
        return null;
    }
}

async function populate() {
    console.log("--- STARTING CATEGORY SEO POPULATION ---");
    
    // Target common_slug: dunya
    const { data: cats, error } = await supabase
        .from('categories')
        .select('*')
        .eq('common_slug', 'dunya');

    if (error) {
        console.error("Fetch Error:", error);
        return;
    }

    for (const cat of cats) {
        console.log(`Processing: ${cat.name} (${cat.lang})...`);
        const data = await generateCategorySEOContent(cat.name, cat.lang);
        
        if (data) {
            const { error: updateError } = await supabase
                .from('categories')
                .update({
                    content: data.content,
                    seo_title: data.seo_title,
                    seo_description: data.seo_description,
                    og_title: data.og_title,
                    og_desc: data.og_desc,
                    schema_data: data.schema_data,
                    name: data.translated_name // Keep name updated too
                })
                .eq('id', cat.id);

            if (updateError) console.error(`Update Error [${cat.lang}]:`, updateError);
            else console.log(`Successfully updated ${cat.lang} version.`);
        }
    }

    console.log("--- POPULATION FINISHED ---");
}

populate();
