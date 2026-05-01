import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const slugify = (text: string) => {
    const charMap: { [key: string]: string } = {
        'ə': 'e', 'ğ': 'g', 'ö': 'o', 'ı': 'i', 'ş': 's', 'ü': 'u',
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
        'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
        'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts',
        'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
        ' ': '-', '.': '', ',': '', '/': '-', '_': '-'
    };
    return text.split('').map(c => charMap[c.toLowerCase()] || c.toLowerCase()).join('').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');
};

async function updateSlugs() {
    console.log('--- Updating Author Slugs (Transliteration) ---');
    
    const { data: authors, error } = await supabase.from('authors').select('id, name');
    if (error) {
        console.error('Error fetching authors:', error);
        return;
    }

    for (const author of authors) {
        const newSlug = slugify(author.name);
        console.log(`Updating [${author.name}] -> [${newSlug}]`);
        
        await supabase
            .from('authors')
            .update({ slug: newSlug })
            .eq('id', author.id);
    }

    console.log('--- Done ---');
}

updateSlugs();
