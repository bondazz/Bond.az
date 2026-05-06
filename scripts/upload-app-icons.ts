import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const s3Client = new S3Client({
    region: "auto",
    endpoint: "https://2b079fb369cb232d35182f81120b85b1.r2.cloudflarestorage.com",
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
});

const icons = [
    { url: 'https://www.haberler.com/mstatic/assets/img/footer-icon/app-store.svg', name: 'app-store.svg' },
    { url: 'https://www.haberler.com/mstatic/assets/img/footer-icon/google-play.svg', name: 'google-play.svg' },
    { url: 'https://www.haberler.com/mstatic/assets/img/footer-icon/app-galery.svg', name: 'app-gallery.svg' }
];

async function uploadIcons() {
    for (const icon of icons) {
        try {
            console.log(`Downloading ${icon.url}...`);
            const response = await axios.get(icon.url, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data);

            const fileName = `assets/icons/${icon.name}`;
            console.log(`Uploading to R2 as ${fileName}...`);

            await s3Client.send(new PutObjectCommand({
                Bucket: 'bond',
                Key: fileName,
                Body: buffer,
                ContentType: 'image/svg+xml',
                CacheControl: 'public, max-age=31536000, immutable'
            }));

            console.log(`Successfully uploaded ${icon.name}`);
        } catch (err) {
            console.error(`Failed to process ${icon.name}:`, err);
        }
    }
}

uploadIcons();
