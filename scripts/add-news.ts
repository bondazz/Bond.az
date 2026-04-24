import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const commonId = 'azeri-light-drop-2026';
const currentDate = new Date().toISOString();

const posts = [
  {
    common_id: commonId,
    lang: 'az',
    title: "Azərbaycan nefti kəskin ucuzlaşdı: Bir barel 113 dollara düşdü",
    category: "İqtisadiyyat",
    category_slug: "economy",
    slug: "azerbaycan-nefti-keskin-ucuzlasdi-bir-barel-113-dollara-dusdu",
    image: "https://foxiz.io/justforyou/wp-content/uploads/2021/10/e4-860x478.jpg",
    summary: "Dünya bazarlarında 'Azeri Light' markalı Azərbaycan neftinin qiyməti 5,55 dollar və ya 4,68% azalaraq bir barel üçün 113,01 dollar təşkil edib.",
    content: "Dünya bazarlarında neft qiymətlərində ciddi dalğalanma müşahidə olunur. İtaliyanın Augusta limanı şərtləri ilə satılan 'Azeri Light' nefti kəskin ucuzlaşaraq 113 dollara qədər geriləyib. Eyni zamanda, Türkiyənin Ceyhan limanı vasitəsilə ixrac edilən neftin qiyməti də 4,48% azalaraq 108,93 dollara düşüb.\n\nEkspertlər bildirirlər ki, bu azalma qlobal tələbatın dəyişməsi və gələcək iqtisadi proqnozlarla bağlıdır. Lakin Azərbaycanın 2026-cı il dövlət büdcəsində neftin bir bareli 65 dollardan götürüldüyü üçün, hazırkı qiymətlər hələ də büdcə hədəflərindən kifayət qədər yüksəkdir.",
    date: currentDate,
    author: "BOND ECONOMY",
    views: 120,
    likes: 15,
    dislikes: 2
  },
  {
    common_id: commonId,
    lang: 'en',
    title: "Azerbaijani oil price drops sharply to $113 per barrel",
    category: "Economy",
    category_slug: "economy",
    slug: "azerbaijani-oil-price-drops-sharply-to-113-per-barrel",
    image: "https://foxiz.io/justforyou/wp-content/uploads/2021/10/e4-860x478.jpg",
    summary: "The price of 'Azeri Light' crude oil decreased by $5.55 or 4.68%, settling at $113.01 per barrel in global markets.",
    content: "Significant volatility is being observed in global oil prices. 'Azeri Light' crude, sold under Augusta port conditions in Italy, has dropped sharply to $113. Meanwhile, oil exported via Turkey's Ceyhan port also decreased by 4.48% to $108.93 per barrel.\n\nAnalysts suggest this decline is linked to shifting global demand and future economic projections. However, as Azerbaijan's 2026 state budget is based on an average oil price of $65 per barrel, current market prices remain well above fiscal targets.",
    date: currentDate,
    author: "BOND ECONOMY",
    views: 45,
    likes: 8,
    dislikes: 0
  },
  {
    common_id: commonId,
    lang: 'ru',
    title: "Цена на азербайджанскую нефть резко упала до 113 долларов за баррель",
    category: "Экономика",
    category_slug: "economy",
    slug: "tsena-na-azerbaydzhanskuyu-neft-rezko-upala-do-113-dollarov-za-barrel",
    image: "https://foxiz.io/justforyou/wp-content/uploads/2021/10/e4-860x478.jpg",
    summary: "Цена азербайджанской нефти марки 'Azeri Light' на мировых рынках снизилась на 5,55 доллара (4,68%), составив 113,01 доллара за баррель.",
    content: "На мировых рынках нефти наблюдается серьезная волатильность. Нефть 'Azeri Light', продаваемая на условиях порта Аугуста в Италии, резко подешевела до 113 долларов. В то же время цена нефти, экспортируемой через турецкий порт Джейхан, снизилась на 4,48% до 108,93 доллара за баррель.\n\nЭксперты отмечают, что это снижение связано с изменением глобального спроса и экономическими прогнозами. Однако, поскольку в государственном бюджете Азербайджана на 2026 год цена нефти заложена на уровне 65 долларов за баррель, текущие цены все еще значительно превышают бюджетные цели.",
    date: currentDate,
    author: "BOND ECONOMY",
    views: 89,
    likes: 12,
    dislikes: 1
  }
];

async function addNews() {
  console.log('Adding 3-language news article to Supabase...');
  const { error } = await supabase.from('posts').insert(posts);
  if (error) console.error('Error adding news:', error.message);
  else console.log('News successfully added in 3 languages!');
}

addNews();
