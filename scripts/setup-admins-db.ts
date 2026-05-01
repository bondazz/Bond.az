import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function setupAdminsTable() {
    console.log('--- Setting up Admins Table and User ---');
    
    // Create table if not exists (using RPC or just checking if it exists)
    // Note: We'll assume the user wants us to ensure the 'admins' table has their email.
    
    const email = 'info@bond.az';

    // 1. Ensure the table exists (This is a simplified check/insert)
    // In a real scenario, you'd run SQL, but here we'll try to insert and see if it works.
    
    const { error: insertError } = await supabase
        .from('admins')
        .upsert({ email: email }, { onConflict: 'email' });

    if (insertError) {
        if (insertError.code === '42P01') { // Table does not exist
            console.log('Admins table does not exist. Please create it in Supabase SQL Editor:');
            console.log('CREATE TABLE admins (id BIGSERIAL PRIMARY KEY, email TEXT UNIQUE, created_at TIMESTAMPTZ DEFAULT NOW());');
            console.log('INSERT INTO admins (email) VALUES (\'info@bond.az\');');
        } else {
            console.error('Error inserting into admins table:', insertError);
        }
    } else {
        console.log('Admin email successfully verified/added to admins table.');
    }
}

setupAdminsTable();
