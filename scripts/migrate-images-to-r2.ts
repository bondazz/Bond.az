import { createClient } from '@supabase/supabase-js';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const s3Client = new S3Client({
    region: "auto",
    endpoint: "https://2b079fb369cb232d35182f81120b85b1.r2.cloudflarestorage.com",
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
});

function slugifyTitle(title: string) {
    const map: { [key: string]: string } = {
        'ə': 'e', 'ö': 'o', 'ü': 'u', 'ş': 's', 'ç': 'c', 'ğ': 'g', 'ı': 'i',
        'Ə': 'E', 'Ö': 'O', 'Ü': 'U', 'Ş': 'S', 'Ç': 'C', 'Ğ': 'G', 'I': 'I',
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
        'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
        'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts',
        'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
        'А': 'a', 'Б': 'b', 'В': 'v', 'Г': 'g', 'Д': 'd', 'Е': 'e', 'Ё': 'e', 'Ж': 'zh',
        'З': 'z', 'И': 'i', 'Й': 'y', 'К': 'k', 'Л': 'l', 'М': 'm', 'Н': 'n', 'О': 'o',
        'П': 'p', 'Р': 'r', 'С': 's', 'Т': 't', 'У': 'u', 'Ф': 'f', 'Х': 'h', 'Ц': 'ts',
        'Ч': 'ch', 'Ш': 'sh', 'Щ': 'sch', 'Ъ': '', 'Ы': 'y', 'Ь': '', 'Э': 'e', 'Ю': 'yu', 'Я': 'ya'
    };
    const mapped = title.split('').map(char => map[char] !== undefined ? map[char] : char).join('');
    const slug = mapped.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return slug || `post-${Date.now()}`;
}

async function processImages() {
    console.log("--- Starting Image Migration to R2 ---");
    
    // Get all posts
    const { data: posts, error } = await supabase
        .from('posts')
        .select('id, title, image');
        
    if (error) {
        console.error("Error fetching posts:", error);
        return;
    }

    console.log(`Found ${posts.length} posts to process.`);

    for (const post of posts) {
        if (!post.image) continue;
        
        // Force re-process all images to apply resize and Cache-Control
        // (Skip logic removed temporarily)

        console.log(`\nProcessing post ID ${post.id}: ${post.title}`);
        
        try {
            let originalBuffer: Buffer;
            
            // Download image
            if (post.image.startsWith('http')) {
                const response = await axios.get(post.image, { responseType: 'arraybuffer' });
                originalBuffer = Buffer.from(response.data);
            } else if (post.image.startsWith('data:image')) {
                const base64Data = post.image.replace(/^data:image\/\w+;base64,/, "");
                originalBuffer = Buffer.from(base64Data, 'base64');
            } else {
                console.log(`Unsupported image format for post ID ${post.id}`);
                continue;
            }

            console.log('Compressing and Resizing with sharp...');
            const compressedBuffer = await sharp(originalBuffer)
                .resize({ width: 1200, withoutEnlargement: true })
                .webp({ quality: 75 })
                .toBuffer();

            // Create new filename based on title
            const slugifiedTitle = slugifyTitle(post.title);
            // Some long titles might be too long, keeping the first 100 chars to be safe.
            const shortSlug = slugifiedTitle.substring(0, 100);
            const fileName = `storage/${shortSlug}.webp`;

            console.log(`Uploading to R2: ${fileName}`);
            await s3Client.send(new PutObjectCommand({
                Bucket: 'bond',
                Key: fileName,
                Body: compressedBuffer,
                ContentType: 'image/webp',
                CacheControl: 'public, max-age=31536000, immutable'
            }));

            const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://pub-aa4d7ea2cdf4406aa95e778a75a12177.r2.dev";
            const newImageUrl = `${r2PublicUrl}/${fileName}`;

            // Update Supabase
            console.log(`Updating DB for post ID ${post.id}...`);
            const { error: updateError } = await supabase
                .from('posts')
                .update({ image: newImageUrl })
                .eq('id', post.id);

            if (updateError) {
                console.error(`Failed to update DB for post ID ${post.id}:`, updateError);
            } else {
                console.log(`Successfully migrated image for post ID ${post.id}`);
            }

        } catch (err: any) {
            console.error(`Failed to process post ID ${post.id}:`, err.message);
        }
    }
    
    console.log("\n--- Migration Complete ---");
}

processImages();
