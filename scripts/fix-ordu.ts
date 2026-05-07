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
    
    // Explicit instruction to avoid the city confusion
    const prompt = `
    ROLE: Elite SEO Content Architect.
    TASK: Generate a comprehensive, 400+ word authority pillar content for the news category: "${catName}" in language: "${lang}".
    
    ### CRITICAL INSTRUCTION:
    This category "Ordu" refers to the **MILITARY, ARMY, and DEFENSE** sector. 
    It is NOT about the city Ordu in Turkey. 
    Focus on: National defense, military technology, geopolitical security, armed forces, and global military developments.

    ### CONTENT REQUIREMENTS:
    1. **Length**: Minimum 400 words.
    2. **Tone**: Professional, journalistic, and authoritative.
    3. **Readability**: 100% human-like. Use h2, h3, and bullet points.
    4. **SEO Optimization**: Focus on topical authority and high CTR keywords for Military/Army news.
    5. **Uniqueness**: 100% original.
    6. **Internal Link**: Include EXACTLY ONE dofollow link to the homepage (${homepageLink}).
    7. **Category Translation**: Provide the most natural translation/name for "Military/Army" in "${lang}".

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

async function populateOrdu() {
    console.log("--- RE-POPULATING 'ORDU' (MILITARY) CATEGORY ---");
    
    const languages = ['az', 'en', 'ru'];
    const commonSlug = 'ordu';

    for (const lang of languages) {
        console.log(`Processing Military category for [${lang}]...`);
        
        // Find existing or create placeholder
        const { data: existing } = await supabase
            .from('categories')
            .select('*')
            .eq('common_slug', commonSlug)
            .eq('lang', lang)
            .maybeSingle();

        const data = await generateCategorySEOContent(lang === 'az' ? 'Ordu' : 'Military', lang);
        
        if (data) {
            if (existing) {
                const { error: updateError } = await supabase
                    .from('categories')
                    .update({
                        name: data.translated_name,
                        content: data.content,
                        seo_title: data.seo_title,
                        seo_description: data.seo_description,
                        og_title: data.og_title,
                        og_desc: data.og_desc,
                        schema_data: data.schema_data
                    })
                    .eq('id', existing.id);
                if (updateError) console.error(`Update Error [${lang}]:`, updateError);
                else console.log(`Successfully updated ${lang} version.`);
            } else {
                // Determine slug for new category
                const slug = lang === 'az' ? 'ordu' : lang === 'en' ? 'military' : 'armiya';
                const { error: insertError } = await supabase
                    .from('categories')
                    .insert({
                        common_slug: commonSlug,
                        lang: lang,
                        name: data.translated_name,
                        slug: slug,
                        content: data.content,
                        seo_title: data.seo_title,
                        seo_description: data.seo_description,
                        og_title: data.og_title,
                        og_desc: data.og_desc,
                        schema_data: data.schema_data
                    });
                if (insertError) console.error(`Insert Error [${lang}]:`, insertError);
                else console.log(`Successfully created ${lang} version.`);
            }
        }
    }

    console.log("--- ORDUP OPULATION FINISHED ---");
}

populateOrdu();
