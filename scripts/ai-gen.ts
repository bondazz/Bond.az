import axios from 'axios';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

interface GenerationOptions {
    topic: string;
    targetPage: 'ethics' | 'corrections' | 'fact-checking' | 'diversity';
    wordCount?: number;
}

async function generateWithDeepSeek(prompt: string) {
    if (!DEEPSEEK_API_KEY) throw new Error('DEEPSEEK_API_KEY is missing');

    try {
        const response = await axios.post(API_URL, {
            model: 'deepseek-chat',
            messages: [
                { role: 'system', content: 'You are a professional editorial standard expert for a premium news agency like Reuters. Provide content in JSON format with keys "az", "en", "ru". Each should have "title", "subtitle", "intro", and a list of "sections" (each with "h2" and "content").' },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' }
        }, {
            headers: {
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return JSON.parse(response.data.choices[0].message.content);
    } catch (error: any) {
        console.error('DeepSeek Error:', error.response?.data || error.message);
        throw error;
    }
}

export async function updatePolicyPage(options: GenerationOptions) {
    const { topic, targetPage, wordCount = 800 } = options;
    
    console.log(`🚀 Generating content for ${targetPage} using DeepSeek...`);
    
    const prompt = `Generate a comprehensive ${targetPage} policy for Bond.az news portal about "${topic}". 
    The content must be professional, Reuters-grade, minimum ${wordCount} words.
    Structure it for AZ, EN, and RU languages.
    Return ONLY a JSON object.`;

    const aiContent = await generateWithDeepSeek(prompt);
    
    const filePath = path.join(process.cwd(), 'src', 'app', '[lang]', targetPage, 'page.tsx');
    
    // Read the current file to preserve imports and structure
    let currentContent = fs.readFileSync(filePath, 'utf8');
    
    // Replace the policyContent object
    const newPolicyContentStr = `const policyContent = ${JSON.stringify(aiContent, null, 4)};`;
    
    const updatedContent = currentContent.replace(/const policyContent = \{[\s\S]+?\};/, newPolicyContentStr);
    
    fs.writeFileSync(filePath, updatedContent);
    
    console.log(`✅ ${targetPage} page updated successfully with AI content!`);
}

// Example usage if run directly
if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length >= 2) {
        updatePolicyPage({
            targetPage: args[0] as any,
            topic: args[1],
            wordCount: args[2] ? parseInt(args[2]) : 800
        });
    }
}
