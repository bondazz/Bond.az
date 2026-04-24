import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function addTestAudio() {
    const { data: posts } = await supabase.from('posts').select('id').order('id', { ascending: false }).limit(1);
    if (posts && posts.length > 0) {
        const lastId = posts[0].id;
        await supabase.from('posts').update({ 
            audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' 
        }).eq('id', lastId);
        console.log(`Updated post ${lastId} with test audio.`);
    }
}

addTestAudio();
