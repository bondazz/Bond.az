import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function migrate() {
    console.log("Attempting Newsroom Structure migration...");
    
    // Add columns to 'authors'
    await supabase.rpc('exec_sql', { 
        sql_query: "ALTER TABLE authors ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Reporter';" 
    });
    
    // Add columns to 'posts'
    await supabase.rpc('exec_sql', { 
        sql_query: "ALTER TABLE posts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;" 
    });
    await supabase.rpc('exec_sql', { 
        sql_query: "ALTER TABLE posts ADD COLUMN IF NOT EXISTS reviewed_by_id BIGINT REFERENCES authors(id);" 
    });

    console.log("Migration script finished. Note: If RPC 'exec_sql' is missing, please run the SQL manually in Supabase Dashboard.");
}

migrate();
