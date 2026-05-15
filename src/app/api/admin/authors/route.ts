import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const generateEmail = (name: string) => {
    const charMap: { [key: string]: string } = {
        'ə': 'e', 'ğ': 'g', 'ö': 'o', 'ı': 'i', 'ş': 's', 'ü': 'u',
        'Ə': 'e', 'Ğ': 'g', 'Ö': 'o', 'İ': 'i', 'Ş': 's', 'Ü': 'u',
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
        'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
        'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts',
        'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
        ' ': '_', '-': '_'
    };
    const cleanName = name.split('').map(c => charMap[c.toLowerCase()] || c.toLowerCase()).join('').replace(/[^a-z0-9_]/g, '');
    return `${cleanName}@bond.az`;
};

export async function GET() {
    try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const { data, error } = await supabase
            .from('authors')
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ message: 'Xəta baş verdi' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        
        // Auto-generate email based on name
        const finalData = {
            ...body,
            email: generateEmail(body.name)
        };

        const { data, error } = await supabase
            .from('authors')
            .insert([finalData])
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ message: 'Yaratma xətası' }, { status: 500 });
    }
}
