import { exec } from 'child_process';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(): Promise<NextResponse> {
    return await new Promise<NextResponse>((resolve) => {
        console.log('--- Triggering News Bot from Admin Panel ---');
        
        // Use tsx to run the script
        const scriptPath = path.join(process.cwd(), 'scripts', 'news-bot.ts');
        
        exec(`npx tsx ${scriptPath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Bot Exec Error: ${error}`);
                resolve(NextResponse.json({ message: 'Bot xətası', error: error.message }, { status: 500 }));
                return;
            }
            console.log(`Bot Output: ${stdout}`);
            resolve(NextResponse.json({ success: true, output: stdout }));
        });
    });
}
