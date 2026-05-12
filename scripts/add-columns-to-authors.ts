import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function addColumns() {
    console.log("Attempting to add columns to 'authors' table...");
    
    // Note: This requires a 'query' or 'exec_sql' RPC in Supabase. 
    // If it doesn't exist, this will fail.
    const { error: error1 } = await supabase.rpc('exec_sql', { 
        sql_query: "ALTER TABLE authors ADD COLUMN IF NOT EXISTS expertise TEXT;" 
    });
    
    const { error: error2 } = await supabase.rpc('exec_sql', { 
        sql_query: "ALTER TABLE authors ADD COLUMN IF NOT EXISTS expertise_areas JSONB;" 
    });

    if (error1 || error2) {
        console.log("RPC 'exec_sql' not found or failed. Please add 'expertise' (TEXT) and 'expertise_areas' (JSONB) columns to the 'authors' table manually in Supabase Dashboard.");
        console.error("Error 1:", error1);
        console.error("Error 2:", error2);
    } else {
        console.log("Columns added successfully!");
    }
}

addColumns();
