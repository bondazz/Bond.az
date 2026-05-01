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
        
        // Şəkli həm AVIF, həm də WebP formatında hazırlaya bilərik. 
        // Lakin yaddaş qənaəti üçün WebP (və ya istəyə uyğun AVIF) seçirik.
        // User hər ikisini dəstəkləsin dediyi üçün biz WebP-ni (çox yayılmış) 
        // və ya AVIF-i (daha modern) seçə bilərik. AVIF-ə üstünlük veririk.
        
        const fileName = `uploads/${type}/${originalName}-${timestamp}.avif`;
        
        const optimizedBuffer = await sharp(buffer)
            .resize(400, 400, { fit: 'cover' })
            .avif({ 
                quality: 40, // Aqressiv sıxılma
                effort: 9,   // Maksimum hesablama gücü ilə ən kiçik ölçü
                chromaSubsampling: '4:2:0' 
            })
            .toBuffer();

        await s3Client.send(new PutObjectCommand({
            Bucket: 'bond',
            Key: fileName,
            Body: optimizedBuffer,
            ContentType: 'image/avif',
            CacheControl: 'public, max-age=31536000, immutable'
        }));

        const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://pub-aa4d7ea2cdf4406aa95e778a75a12177.r2.dev";
        const publicUrl = `${r2PublicUrl}/${fileName}`;

        return NextResponse.json({ url: publicUrl });
    } catch (err: any) {
        console.error('Upload error:', err);
        return NextResponse.json({ error: 'Yükləmə xətası', details: err.message }, { status: 500 });
    }
}
