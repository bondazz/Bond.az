const sharp = require('sharp');
const path = require('path');

async function processImages() {
    const images = [
        { in: 'about-hero.jpg', out: 'about-hero.webp' },
        { in: 'contact-hero.jpg', out: 'contact-hero.webp' },
        { in: 'ads-hero.jpg', out: 'ads-hero.webp' },
        { in: 'terms-hero.jpg', out: 'terms-hero.webp' }
    ];
    
    for (const img of images) {
        const input = path.join(__dirname, 'public', img.in);
        const output = path.join(__dirname, 'public', img.out);
        
        try {
            await sharp(input)
                .webp({ quality: 90 })
                .toFile(output);
            console.log(`Processed ${img.in} to ${img.out}`);
        } catch (err) {
            console.error(`Error processing ${img.in}:`, err);
        }
    }
}

processImages();
