import { google } from 'googleapis';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testIndexing(url: string) {
    console.log(`\n🚀 Testing Google Indexing API for: ${url}`);
    try {
        let auth;
        const envKey = process.env.GOOGLE_INDEXING_KEY;

        if (envKey) {
            console.log("Using environment variable...");
            auth = new google.auth.GoogleAuth({
                credentials: JSON.parse(envKey),
                scopes: ['https://www.googleapis.com/auth/indexing'],
            });
        } else {
            console.log("Using local google-key.json file...");
            const keyPath = path.join(process.cwd(), 'scripts', 'google-key.json');
            auth = new google.auth.GoogleAuth({
                keyFile: keyPath,
                scopes: ['https://www.googleapis.com/auth/indexing'],
            });
        }

        const authClient = await auth.getClient();
        const indexing = google.indexing({
            version: 'v3',
            auth: authClient as any,
        });

        const res = await indexing.urlNotifications.publish({
            requestBody: {
                url: url,
                type: 'URL_UPDATED',
            },
        });

        console.log(`✅ SUCCESS! Google responded with: ${res.statusText}`);
        console.log(`Response data:`, res.data);
    } catch (error: any) {
        console.error(`❌ FAILED! Error: ${error.message}`);
        if (error.response) {
            console.error(`Error details:`, error.response.data);
        }
    }
}

// Yoxlamaq istədiyiniz linkləri yoxlayırıq
async function runTests() {
    await testIndexing("https://bond.az/");
    await testIndexing("https://www.bond.az/");
}

runTests();
