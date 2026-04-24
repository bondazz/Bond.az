import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function clear() {
    const { error } = await supabase.from('posts').delete().neq('id', 0);
    if (error) console.error(error);
    else console.log('Database cleared successfully!');
}

clear();
