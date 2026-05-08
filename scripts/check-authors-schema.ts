import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function check() {
    const { data, error } = await supabase.rpc('get_table_info', { table_name: 'authors' });
    if (error) {
        // Fallback: try to select one row
        const { data: row } = await supabase.from('authors').select('*').limit(1);
        console.log("Sample author row:", row);
    } else {
        console.log("Table info:", data);
    }
}

check();
