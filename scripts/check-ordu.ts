import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function check() {
    const { data, error } = await supabase.from('categories').select('*').or('common_slug.eq.ordu,slug.eq.ordu');
    if (error) console.error(error);
    else console.log(JSON.stringify(data, null, 2));
}

check();
