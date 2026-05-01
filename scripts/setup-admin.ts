import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function setupAdmin() {
    console.log('--- Setting up Admin User ---');
    const email = 'info@bond.az';
    const password = 'Samir_1155!';

    // Check if user already exists
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
        console.error('Error listing users:', listError);
        return;
    }

    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
        console.log('Admin user already exists. Updating password...');
        const { error: updateError } = await supabase.auth.admin.updateUserById(
            existingUser.id,
            { password: password }
        );
        if (updateError) console.error('Error updating password:', updateError);
        else console.log('Password updated successfully.');
    } else {
        console.log('Creating new admin user...');
        const { data, error: createError } = await supabase.auth.admin.createUser({
            email: email,
            password: password,
            email_confirm: true
        });
        if (createError) console.error('Error creating user:', createError);
        else console.log('Admin user created successfully:', data.user?.id);
    }
}

setupAdmin();
