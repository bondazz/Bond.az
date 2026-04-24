import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function check() {
    const { data: posts } = await supabase.from('posts').select('id, title, common_id, lang').order('id', { ascending: false }).limit(5);
    console.log(JSON.stringify(posts, null, 2));
}

check();
