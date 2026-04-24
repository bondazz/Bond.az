import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const authors = {
    az: [
        "Qədir Seyidov", "Samir Məmmədov", "Leyla Əliyeva", "Günel Kərimova", "Anar Quliyev", 
        "Elçin Abaslı", "Nigar Hüseynova", "Rauf Əliyev", "Səbinə Rəhimova", "Fuad İbrahimov",
        "Arzu Qasımova", "Tural Məlikov", "Fidan Bağırova", "Aydın Nəbiyev", "Nərmin Vəliyeva",
        "Vüqar Həsənli", "Aysel Quliyeva", "Rəşad Əhmədov", "Sevinc İsmayılova", "Emin Orucov",
        "İlkin Cavadov", "Xəyalə Məmmədova", "Orxan Sultanov", "Dəniz Yusifli", "Kamran Səfərov",
        "Gülnar Abbasova", "Rasim Bayramov", "Elnur Tağıyev", "Zemfira Rəsulova", "Murad Qafarov"
    ],
    en: [
        "Julianne Alice", "John Smith", "Sarah Johnson", "Michael Brown", "Emily Davis", 
        "David Wilson", "Olivia Taylor", "Robert Moore", "Sophia Anderson", "William Thomas",
        "Isabella Martinez", "James Taylor", "Charlotte Hernandez", "Benjamin Moore", "Mia Lopez",
        "Lucas Garcia", "Evelyn Lee", "Alexander Gonzalez", "Harper Clark", "Daniel Rodriguez",
        "Grace Lewis", "Henry Walker", "Chloe Hall", "Sebastian Young", "Zoe Allen",
        "Matthew King", "Aria Wright", "Jack Scott", "Luna Torres", "Samuel Nguyen"
    ],
    ru: [
        "Александр Исаев", "Елена Петрова", "Дмитрий Соколов", "Ирина Волкова", "Сергей Морозов", 
        "Наталья Кузнецова", "Артем Павлов", "Ольга Новикова", "Игорь Федоров", "Марина Козлова",
        "Андрей Белов", "Светлана Титова", "Максим Степанов", "Юлия Полякова", "Николай Зайцев",
        "Татьяна Васильева", "Виктор Семенов", "Анна Романова", "Константин Егоров", "Дарья Сорокина",
        "Олег Воробьев", "Людмила Лебедева", "Михаил Кузьмин", "Альбина Крылова", "Станислав Борисов",
        "Вероника Тарасова", "Денис Богданов", "Алиса Фомина", "Павел Медведев", "Ксения Антонова"
    ]
};

async function seed() {
    console.log("Seeding authors...");
    for (const [lang, names] of Object.entries(authors)) {
        const insertData = names.map(name => ({ name, lang, job_title: 'Senior Editor' }));
        const { error } = await supabase.from('authors').insert(insertData);
        if (error) console.error(`Error inserting ${lang} authors:`, error);
        else console.log(`Inserted ${names.length} authors for ${lang}`);
    }
    console.log("Done!");
}

seed();
