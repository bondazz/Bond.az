import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import sharp from "sharp";

const s3Client = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT || "https://2b079fb369cb232d35182f81120b85b1.r2.cloudflarestorage.com",
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
});

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const type = formData.get('type') as string || 'author'; // 'author' or 'post'

        if (!file) {
            return NextResponse.json({ error: 'Fayl seçilməyib' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const timestamp = Date.now();
        const originalName = file.name.split('.')[0].toLowerCase().replace(/[^a-z0-9]/g, '-');
        const isGif = file.type === 'image/gif' || file.name.endsWith('.gif');
        
        const extension = isGif ? 'webp' : 'avif';
        const fileName = `uploads/${type}/${originalName}-${timestamp}.${extension}`;
        
        let sharpInstance = sharp(buffer, { animated: isGif });

        // Reklamlar üçün artıq kvadrata məcbur etmirik, 
        // sadəcə çox böyükdürsə maksimal 1200px hündürlük/en limiti qoyuruq ki, 
        // orijinal forması (uzunsov və ya kvadrat) pozulmasın.
        if (type === 'ad') {
            sharpInstance = sharpInstance.resize(800, 1200, { 
                fit: 'inside', 
                withoutEnlargement: true 
            });
        } else {
            sharpInstance = sharpInstance.resize(400, 400, { fit: 'cover' });
        }

        let optimizedBuffer;
        if (isGif) {
            optimizedBuffer = await sharpInstance
                .webp({ 
                    animated: true,
                    quality: 70,
                    lossless: false
                })
                .toBuffer();
        } else {
            optimizedBuffer = await sharpInstance
                .avif({ 
                    quality: 60,
                    effort: 9
                })
                .toBuffer();
        }

        await s3Client.send(new PutObjectCommand({
            Bucket: 'bond',
            Key: fileName,
            Body: optimizedBuffer,
            ContentType: isGif ? 'image/webp' : 'image/avif',
            CacheControl: 'public, max-age=31536000, immutable'
        }));

        const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://cdn.bond.az";
        const publicUrl = `${r2PublicUrl}/${fileName}`;

        return NextResponse.json({ url: publicUrl });
    } catch (err: any) {
        console.error('Upload error:', err);
        return NextResponse.json({ error: 'Yükləmə xətası', details: err.message }, { status: 500 });
    }
}
