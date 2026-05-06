export type Locale = 'az' | 'en' | 'ru';

export const translations = {
    az: {
        home: "Ana Səhifə",
        politics: "Siyasət",
        business: "Biznes",
        economy: "İqtisadiyyat",
        travel: "Səyahət",
        more: "Daha Çox",
        notifications: "Bildirişlər",
        search: "Xəbər axtar...",
        searchLabel: "Axtarış",
        myFeed: "Mənim Lentim",
        myInterests: "Maraqlarım",
        mySaves: "Saxlanılanlar",
        history: "Tarixçə",
        blog: "Bloq",
        signIn: "Daxil ol",
        personalize: "Fərdiləşdir",
        authors: "Müəlliflərimiz",
        noAuthorsFound: "Hələlik müəllif tapılmadı.",
        breakingNews: "TƏCİLİ XƏBƏRLƏR",
        footerDesc: "Bond.az - Azərbaycan və dünyada baş verən güncəl xəbər axını.",
        allRights: "Bütün hüquqlar qorunur",
        switchToDark: "Qaranlıq rejimə keç",
        switchToLight: "İşıqlı rejimə keç",
        noPosts: "Bu kateqoriya üzrə hələlik xəbər yoxdur.",
        by: "Müəllif:",
        saveIt: "SAXLA",
        share: "Paylaş",
        lastUpdated: "Son yenilənmə",
        about: "Haqqımızda",
        contact: "Əlaqə",
        ads: "Reklam",
        terms: "İstifadə şərtləri",
        privacy: "Məxfilik siyasəti",
        madeWith: "Sevgi ilə hazırlandı",
        loading: "Yüklənir...",
        allLoaded: "Bütün xəbərlər yükləndi.",
        imageAttribution: "Foto: Bond.az tərəfindən hazırlanmışdır",
        followUs: "Bizi sosial şəbəkələrdə izləyin:",
        currencies: "Məzənnələr",
        currencyRates: "Valyuta Məzənnələri",
        buy: "Alış",
        sell: "Satış",
        officialRate: "Rəsmi Məzənnə",
        converter: "Konvertor",
        joinFamily: "Bond.az ailəsinə qoşulun",
        ogImage: "https://bond.az/og-image.jpg",
        categories: {
            dunya: { name: "Dünya", desc: "Qlobal hadisələr, beynəlxalq münasibətlər və dünyada baş verən ən son yeniliklər." },
            siyaset: { name: "Siyasət", desc: "Azərbaycan və dünya siyasətindəki ən mühüm qərarlar, diplomatik görüşlər və təhlillər." },
            daxili: { name: "Daxili", desc: "Ölkə daxilində baş verən ən mühüm hadisələr, dövlət əhəmiyyətli qərarlar və daxili xəbərlər." },
            cemiyyet: { name: "Cəmiyyət", desc: "Sosial həyat, insan hekayələri, təhsil, səhiyyə və cəmiyyəti maraqlandıran digər aktual mövzular." },
            iqtisadiyyat: { name: "Iqtisadiyyat", desc: "Maliyyə bazarları, neft qiymətləri, bank sektoru və ölkə iqtisadiyyatına dair ətraflı analizlər." },
            travel: { name: "Səyahət", desc: "Dünyanın ən maraqlı turizm marşrutları, səyahət məsləhətləri və yeni kəşflər." },
            politics: { name: "Siyasət", desc: "Siyasət dünyasından ən son xəbərlər." },
            business: { name: "Biznes", desc: "Biznes və sahibkarlıq dünyasındakı yeniliklər." },
            economy: { name: "İqtisadiyyat", desc: "İqtisadiyyat və maliyyə xəbərləri." }
        },
        static: {
            about: {
                title: "Bond.az — Haqqımızda, Missiyamız və Tariximiz",
                shortTitle: "Haqqımızda",
                subtitle: "Azərbaycanın innovativ xəbər portalı ilə tanış olun",
                mission: "Missiyamız",
                missionText: "Bond.az olaraq missiyamız Azərbaycan və dünya mediasında ən etibarlı xəbər mənbəyinə çevrilməkdir. Biz yalnız xəbər çatdırmırıq, həm də hadisələrin dərinliyini, səbəb və nəticələrini təhlil edərək oxucularımıza obyektiv mənzərə təqdim edirik.",
                vision: "Vizyonumuz",
                visionText: "Yüksək texnologiyalı və innovativ jurnalistika yanaşması ilə rəqəmsal media sahəsində lider olmaq, oxucularımıza fərdiləşdirilmiş və kəsintisiz xəbər təcrübəsi bəxş etməkdir.",
                history: "Tariximiz",
                historyText: "2024-cü ildə təsis edilən Bond.az, rəqəmsal medianın sürətlə dəyişən dinamikasına uyğun olaraq yaradılmışdır. Qısa müddət ərzində biz ölkənin ən çox oxunan və istinad edilən müstəqil xəbər resurslarından birinə çevrilmişik.",
                ethics: "Redaksiya Siyasəti",
                ethicsText: "Bizim üçün jurnalist etikası hər şeydən üstündür. Biz faktların yoxlanılması (fact-checking), tərəfsizlik və şəffaflıq prinsiplərinə sadiqik. Hər bir xəbər ən azı iki müstəqil mənbə tərəfindən təsdiqləndikdən sonra dərc olunur.",
                values: ["Operativlik", "Obyektivlik", "Dəqiqlik", "İnnovasiya", "Şəffaflıq", "Peşəkarlıq"],
                content: "Bond.az müasir medianın bütün tələblərinə cavab verən, müstəqil və peşəkar bir platformadır. Komandamız peşəkar jurnalistlərdən, analitiklərdən və texnoloji ekspertlərdən ibarətdir."
            },
            contact: {
                title: "Bizimlə Əlaqə — Bond.az Redaksiyası ilə Rabitə",
                shortTitle: "Əlaqə",
                subtitle: "Hər hansı bir sualınız üçün bizə yazın",
                content: "Hər hansı bir sualınız, təklifiniz və ya media sorğunuz varsa, bizimlə əlaqə saxlamaqdan çəkinməyin. Komandamız sizə ən qısa zamanda cavab verəcəkdir.",
                departments: [
                    { name: "Redaksiya", email: "editor@bond.az" },
                    { name: "Reklam Şöbəsi", email: "ads@bond.az" },
                    { name: "Texniki Dəstək", email: "support@bond.az" }
                ],
                formTitle: "Bizə yazın",
                namePlaceholder: "Adınız",
                emailPlaceholder: "E-poçt ünvanınız",
                subjectPlaceholder: "Mövzu",
                messagePlaceholder: "Mesajınız",
                sendBtn: "MESAJI GÖNDƏR",
                email: "info@bond.az",
                phone: "+994 (12) 555 00 00",
                address: "Bakı şəhəri, Azərbaycan prospekti 12, AF Business House, 4-cü mərtəbə."
            },
            ads: {
                title: "Reklam və Əməkdaşlıq — Bond.az Media Paketi",
                shortTitle: "Reklam",
                subtitle: "Biznesinizi Bond.az ilə böyüdün",
                content: "Bond.az ayda milyonlarla səhifə baxışı olan və yüksək alıcılıq qabiliyyətinə malik auditoriyaya malikdir. Biz reklamverənlər üçün maksimum effektivlik təmin edən həllər təklif edirik.",
                formats: [
                    { t: "Desktop Banner (970x90)", d: "Ana səhifədə və kateqoriyalarda görünən böyük formatlı reklamlar." },
                    { t: "Mobil Banner (320x100)", d: "Mobil istifadəçilər üçün optimallaşdırılmış interaktiv bannerlər." },
                    { t: "Sponsorlu Məqalə", d: "Brendiniz haqqında SEO optimallaşdırılmış və oxunaqlı PR mətnləri." },
                    { t: "Video Reklamlar", d: "Xəbər daxili və ya autoplay formatlı video çarxlar." }
                ],
                audience: [
                    { label: "Aylıq Oxucu", val: "1.2 Milyon+" },
                    { label: "Mobil Giriş", val: "85%" },
                    { label: "Bakı Auditoriyası", val: "65%" },
                    { label: "Ortalama Baxış", val: "3.5 Dəqiqə" }
                ],
                statsTitle: "Auditoriya Göstəriciləri",
                email: "ads@bond.az"
            },
            terms: {
                title: "İstifadə Şərtləri — Bond.az Hüquqi Qaydalar",
                shortTitle: "Qaydalar",
                subtitle: "Qaydalar və Hüquqi Məlumat",
                content: "Bond.az portalından istifadə edərkən siz aşağıdakı şərtləri qəbul etmiş sayılırsınız. Bu şərtlər həm saytın rəhbərliyini, həm də istifadəçilərin hüquqlarını qorumaq üçün tərtib edilmişdir.",
                sections: [
                    { h: "1. Ümumi Müddəalar", p: "Bond.az saytının materiallarından istifadə (kopyalamaq, yaymaq) yalnız Bond.az saytına aktiv hiperlink verməklə mümkündür." },
                    { h: "2. İstifadəçilərin Hüquq və Vəzifələri", p: "İstifadəçilər şərhlər bölməsində etik qaydalara riayət etməli, təhqiramiz ifadələrdən çəkinməlidirlər." },
                    { h: "3. Məxfilik Siyasəti", p: "Siz saytdan istifadə edərkən topladığımız fərdi məlumatlar (IP ünvanı, kuki və s.) üçüncü tərəfə ötürülmür." },
                    { h: "4. Məsuliyyətin Məhdudlaşdırılması", p: "Bond.az xarici mənbələrə istinadən dərc olunan materialların məzmununa görə məsuliyyət daşımır." },
                    { h: "5. Şərtlərin Dəyişdirilməsi", p: "Sayt rəhbərliyi istənilən vaxt istifadə şərtlərini əvvəlcədən xəbərdarlıq etmədən dəyişmək hüququnu özündə saxlayır." }
                ]
            },
            privacy: {
                title: "Məxfilik Siyasəti — Bond.az Şəxsi Məlumatların Mühafizəsi",
                shortTitle: "Məxfilik",
                subtitle: "Sizin məlumatlarınızın təhlükəsizliyi bizim prioritetimizdir",
                content: "Bu Məxfilik Siyasəti Xidmətdən istifadə edərkən məlumatlarınızın toplanması, istifadəsi və açıqlanması ilə bağlı Bizim siyasət və prosedurlarımızı təsvir edir.",
                sections: [
                    {
                        h: "1. Şərh və Təriflər",
                        p: "Böyük hərflə başlayan sözlər aşağıdakı şərtlərdə müəyyən edilmiş mənalara malikdir. Bu təriflər tək və ya cəm halında istifadə edilməsindən asılı olmayaraq eyni mənanı daşımalıdır."
                    },
                    {
                        h: "2. Şəxsi Məlumatların Toplanması",
                        p: "Xidmətimizdən istifadə edərkən Biz Sizdən şəxsiyyətinizi müəyyənləşdirməyə imkan verən müəyyən məlumatları (E-poçt, Ad, Soyad) təqdim etməyi xahiş edə bilərik."
                    },
                    {
                        h: "3. İstifadə Məlumatları və Cookies",
                        p: "İstifadə məlumatları Xidmətdən istifadə zamanı avtomatik olaraq toplanır (IP ünvanı, brauzer növü, səhifə baxışları). Biz həmçinin fəaliyyəti izləmək üçün Cookies texnologiyasından istifadə edirik."
                    },
                    {
                        h: "4. Məlumatların İstifadə Məqsədləri",
                        p: "Şirkət məlumatlarınızdan Xidməti saxlamaq, hesabınızı idarə etmək, Sizinlə əlaqə saxlamaq və xidmət keyfiyyətini təhlil etmək üçün istifadə edir."
                    },
                    {
                        h: "5. Məlumatların Təhlükəsizliyi",
                        p: "Şəxsi məlumatlarınızın təhlükəsizliyi Bizim üçün vacibdir, lakin internet vasitəsilə heç bir ötürmə üsulunun 100% təhlükəsiz olmadığını unutmayın."
                    },
                    {
                        h: "6. Bizimlə Əlaqə",
                        p: "Bu Məxfilik Siyasəti haqqında hər hansı sualınız varsa, editor@bond.az e-poçt ünvanı və ya +994 (12) 555 00 00 nömrəsi ilə bizimlə əlaqə saxlaya bilərsiniz."
                    }
                ],
                fullText: `
                    <p>Bu Məxfilik Siyasəti Xidmətdən istifadə edərkən məlumatlarınızın toplanması, istifadəsi və açıqlanması ilə bağlı Bizim siyasət və prosedurlarımızı təsvir edir, həmçinin məxfilik hüquqlarınız və qanunun sizi necə qoruduğu haqqında məlumat verir.</p>
                    <p>Biz Sizin Şəxsi məlumatlarınızı Xidməti təqdim etmək və təkmilləşdirmək üçün istifadə edirik. Xidmətdən istifadə etməklə, Siz bu Məxfilik Siyasətinə uyğun olaraq məlumatların toplanması və istifadəsinə razılıq verirsiniz.</p>
                    
                    <h3>Təriflər</h3>
                    <p><b>Şirkət:</b> Bond.az Media House, Bakı şəhəri, Azərbaycan prospekti 12 ünvanına aiddir.</p>
                    <p><b>Cookies:</b> Veb-sayt tərəfindən cihazınıza yerləşdirilən kiçik fayllardır.</p>
                    <p><b>Cihaz:</b> Xidmətə daxil ola bilən hər hansı bir cihazı (kompüter, mobil telefon) bildirir.</p>
                    
                    <h3>Şəxsi məlumatlarınızın toplanması</h3>
                    <p>İstifadə məlumatları Xidmətdən istifadə zamanı avtomatik olaraq toplanır. Buraya Cihazınızın IP ünvanı, brauzer növü və ziyarət etdiyiniz səhifələr daxildir.</p>
                    
                    <h3>Məxfilik Siyasətindəki dəyişikliklər</h3>
                    <p>Biz vaxtaşırı Məxfilik Siyasətimizi yeniləyə bilərik. Hər hansı dəyişiklik barədə Sizə bu səhifədə yeni Məxfilik Siyasətini yerləşdirməklə məlumat verəcəyik.</p>
                `
            }
        }
    },
    en: {
        home: "Home",
        politics: "Politics",
        business: "Business",
        economy: "Economy",
        travel: "Travel",
        more: "More",
        notifications: "Notifications",
        search: "Search news...",
        searchLabel: "Search",
        myFeed: "My Feed",
        myInterests: "My Interests",
        mySaves: "Saved Posts",
        history: "History",
        blog: "Blog",
        signIn: "Sign In",
        personalize: "Personalize",
        authors: "Our Authors",
        noAuthorsFound: "No authors found yet.",
        breakingNews: "BREAKING NEWS",
        footerDesc: "Bond.az - Current news from Azerbaijan and the world.",
        allRights: "All rights reserved",
        switchToDark: "Switch to Dark Mode",
        switchToLight: "Switch to Light Mode",
        noPosts: "No posts found in this category.",
        by: "By",
        saveIt: "SAVE IT",
        share: "Share",
        lastUpdated: "Last updated",
        about: "About Us",
        contact: "Contact",
        ads: "Advertising",
        terms: "Terms of Service",
        privacy: "Privacy Policy",
        madeWith: "Made with love",
        loading: "Loading...",
        allLoaded: "All news loaded.",
        imageAttribution: "Photo: Prepared by Bond.az",
        followUs: "Follow us on social media:",
        currencies: "Currencies",
        currencyRates: "Exchange Rates",
        buy: "Buy",
        sell: "Sell",
        officialRate: "Official Rate",
        converter: "Converter",
        joinFamily: "Join the Bond.az family",
        ogImage: "https://bond.az/og-image.jpg",
        categories: {
            world: { name: "World", desc: "Latest international news, global events and world updates." },
            politics: { name: "Politics", desc: "Updates from the world of politics, international relations and diplomacy." },
            business: { name: "Business", desc: "Latest business trends, market updates and corporate news." },
            economy: { name: "Economy", desc: "Economic analyses, financial markets and global economy news." },
            travel: { name: "Travel", desc: "Discover new destinations and get travel tips." }
        },
        static: {
            about: {
                title: "About Bond.az — Our Mission, History and Values",
                shortTitle: "About Us",
                subtitle: "Meet Azerbaijan's innovative news portal",
                mission: "Our Mission",
                missionText: "Our mission at Bond.az is to become the most trusted news source in Azerbaijani and world media. We don't just deliver news; we analyze the depth, causes, and consequences of events to provide our readers with an objective perspective.",
                vision: "Our Vision",
                visionText: "To be a leader in the digital media field with a high-tech and innovative journalistic approach, providing our readers with a personalized and seamless news experience.",
                history: "Our History",
                historyText: "Founded in 2024, Bond.az was created in response to the rapidly changing dynamics of digital media. In a short time, we have become one of the most read and referenced independent news resources in the country.",
                ethics: "Editorial Policy",
                ethicsText: "For us, journalistic ethics is above all. We are committed to the principles of fact-checking, impartiality, and transparency. Each news item is published only after being confirmed by at least two independent sources.",
                values: ["Promptness", "Objectivity", "Accuracy", "Innovation", "Transparency", "Professionalism"],
                content: "Bond.az is an independent and professional platform that meets all the requirements of modern media. Our team consists of professional journalists, analysts, and technology experts."
            },
            contact: {
                title: "Contact Us — Reach the Bond.az Editorial Team",
                shortTitle: "Contact",
                subtitle: "Write to us for any questions",
                content: "If you have any questions, suggestions, or media inquiries, don't hesitate to contact us. Our team will get back to you as soon as possible.",
                departments: [
                    { name: "Editorial", email: "editor@bond.az" },
                    { name: "Advertising", email: "ads@bond.az" },
                    { name: "Support", email: "support@bond.az" }
                ],
                formTitle: "Write to us",
                namePlaceholder: "Your Name",
                emailPlaceholder: "Your Email",
                subjectPlaceholder: "Subject",
                messagePlaceholder: "Your Message",
                sendBtn: "SEND MESSAGE",
                email: "info@bond.az",
                phone: "+994 (12) 555 00 00",
                address: "12 Azerbaijan Avenue, AF Business House, 4th Floor, Baku, Azerbaijan."
            },
            ads: {
                title: "Advertising & Partnerships — Bond.az Media Kit",
                shortTitle: "Advertising",
                subtitle: "Grow your business with Bond.az",
                content: "Bond.az has an audience with millions of page views per month and high purchasing power. We offer solutions that ensure maximum efficiency for advertisers.",
                formats: [
                    { t: "Desktop Banner (970x90)", d: "Large format advertisements visible on the home page and categories." },
                    { t: "Mobile Banner (320x100)", d: "Interactive banners optimized for mobile users." },
                    { t: "Sponsored Article", d: "SEO-optimized and readable PR texts about your brand." },
                    { t: "Video Ads", d: "In-news or autoplay format video clips." }
                ],
                audience: [
                    { label: "Monthly Readers", val: "1.2 Million+" },
                    { label: "Mobile Access", val: "85%" },
                    { label: "Baku Audience", val: "65%" },
                    { label: "Avg. Session", val: "3.5 Minutes" }
                ],
                statsTitle: "Audience Insights",
                email: "ads@bond.az"
            },
            terms: {
                title: "Terms of Service — Bond.az Legal Terms",
                shortTitle: "Terms",
                subtitle: "Rules and Legal Information",
                content: "By using the Bond.az portal, you are considered to have accepted the following terms. These terms are designed to protect both the site management and the rights of users.",
                sections: [
                    { h: "1. General Provisions", p: "The use of materials from the Bond.az site (copying, distribution) is only possible by providing an active hyperlink to the Bond.az site." },
                    { h: "2. Rights and Obligations of Users", p: "Users must adhere to ethical rules in the comments section and avoid offensive expressions." },
                    { h: "3. Privacy Policy", p: "Personal information we collect when you use the site (IP address, cookies, etc.) is not transferred to third parties." },
                    { h: "4. Limitation of Liability", p: "Bond.az is not responsible for the content of materials published referencing external sources." },
                    { h: "5. Modification of Terms", p: "The site management reserves the right to change the terms of use at any time without prior notice." }
                ]
            },
            privacy: {
                title: "Privacy Policy — Bond.az Data Protection",
                shortTitle: "Privacy",
                subtitle: "Your data security is our priority",
                content: "This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information.",
                sections: [
                    { h: "1. Definitions", p: "Words of which the initial letter is capitalized have meanings defined under the following conditions." },
                    { h: "2. Data Collection", p: "While using Our Service, We may ask You to provide Us with certain personally identifiable information." },
                    { h: "3. Usage Data", p: "Usage Data is collected automatically when using the Service." },
                    { h: "4. Security", p: "The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet is 100% secure." }
                ]
            }
        }
    },
    ru: {
        home: "Главная",
        politics: "Политика",
        business: "Бизнес",
        economy: "Экономика",
        travel: "Путешествия",
        more: "Ещё",
        notifications: "Уведомления",
        search: "Поиск новостей...",
        searchLabel: "Поиск",
        myFeed: "Моя лента",
        myInterests: "Мои интересы",
        mySaves: "Сохраненные",
        history: "История",
        blog: "Блог",
        signIn: "Войти",
        personalize: "Персонализация",
        authors: "Наши авторы",
        noAuthorsFound: "Авторы пока не найдены.",
        breakingNews: "ГОРЯЧИЕ НОВОСТИ",
        footerDesc: "Bond.az - актуальные новости Азербайджана и мира.",
        allRights: "Все права защищены",
        switchToDark: "Темная тема",
        switchToLight: "Светлая тема",
        noPosts: "В этой категории пока нет новостей.",
        by: "Автор:",
        saveIt: "СОХРАНИТЬ",
        share: "Поделиться",
        lastUpdated: "Последнее обновление",
        about: "О нас",
        contact: "Контакты",
        ads: "Реклама",
        terms: "Условия использования",
        privacy: "Политика конфиденциальности",
        madeWith: "Сделано с любовью",
        loading: "Загрузка...",
        allLoaded: "Все новости загружены.",
        imageAttribution: "Фото: Подготовлено Bond.az",
        followUs: "Следите за нами в социальных сетях:",
        currencies: "Валюты",
        currencyRates: "Курсы валют",
        buy: "Покупка",
        sell: "Продажа",
        officialRate: "Официальный курс",
        converter: "Конвертер",
        joinFamily: "Присоединяйтесь к семье Bond.az",
        ogImage: "https://bond.az/og-image.jpg",
        categories: {
            world: { name: "Мир", desc: "Последние международные новости и события в мире." },
            politics: { name: "Политика", desc: "Мировая политика, дипломатия и анализ событий." },
            business: { name: "Бизнес", desc: "Новости бизнеса и корпоративного мира." },
            economy: { name: "Экономика", desc: "Анализ экономики и финансового сектора." },
            travel: { name: "Путешествия", desc: "Открывайте новые места и планируйте путешествия." }
        },
        static: {
            about: {
                title: "О проекте Bond.az — Наша миссия, история и ценности",
                shortTitle: "О проекте",
                subtitle: "Познакомьтесь с инновационным новостным порталом Азербайджана",
                mission: "Наша миссия",
                missionText: "Наша миссия в Bond.az — стать самым надежным источником новостей в азербайджанских и мировых СМИ. Мы не просто доставляем новости; мы анализируем глубину, причины и последствия событий, чтобы предоставить нашим читателям объективную перспективу.",
                vision: "Наше видение",
                visionText: "Быть лидером в области цифровых медиа с высокотехнологичным и инновационным журналистским подходом, предоставляя нашим читателям персонализированный и бесперебойный доступ к новостям.",
                history: "Наша история",
                historyText: "Основанный в 2024 году, Bond.az был создан в ответ на быстро меняющуюся динамику цифровых медиа. За короткое время мы стали одним из самых читаемых и цитируемых независимых новостных ресурсов в стране.",
                ethics: "Редакционная политика",
                ethicsText: "Для нас журналистская этика превыше всего. Мы придерживаемся принципов проверки фактов (fact-checking), беспристрастности и прозрачности. Каждая новость публикуется только после подтверждения как минимум двумя независимыми источниками.",
                values: ["Оперативность", "Объективность", "Точность", "Инновации", "Прозрачность", "Профессионализм"],
                content: "Bond.az — это независимая и профессиональная платформа, отвечающая всем требованиям современных медиа. Наша команда состоит из профессиональных журналистов, аналитиков и экспертов в области технологий."
            },
            contact: {
                title: "Свяжитесь с нами — Редакция новостного портала Bond.az",
                shortTitle: "Контакты",
                subtitle: "Напишите нам по любому вопросу",
                content: "Если у вас есть какие-либо вопросы, предложения или запросы СМИ, не стесняйтесь обращаться к нам. Наша команда свяжется с вами в кратчайшие сроки.",
                departments: [
                    { name: "Редакция", email: "editor@bond.az" },
                    { name: "Отдел рекламы", email: "ads@bond.az" },
                    { name: "Техподдержка", email: "support@bond.az" }
                ],
                formTitle: "Напишите нам",
                namePlaceholder: "Ваше имя",
                emailPlaceholder: "Ваш Email",
                subjectPlaceholder: "Тема",
                messagePlaceholder: "Ваше сообщение",
                sendBtn: "ОТПРАВИТЬ СООБЩЕНИЕ",
                email: "info@bond.az",
                phone: "+994 (12) 555 00 00",
                address: "Баку, проспект Азербайджана 12, AF Business House, 4-й этаж."
            },
            ads: {
                title: "Реклама и сотрудничество — Медиа-кит Bond.az",
                shortTitle: "Реклама",
                subtitle: "Развивайте свой бизнес с Bond.az",
                content: "Bond.az имеет аудиторию с миллионами просмотров страниц в месяц и высокой покупательной способностью. Мы предлагаем решения, обеспечивающие максимальную эффективность для рекламодателей.",
                formats: [
                    { t: "Десктопный баннер (970x90)", d: "Широкоформатная реклама на главной странице и в категориях." },
                    { t: "Мобильный баннер (320x100)", d: "Интерактивные баннеры, оптимизированные для мобильных пользователей." },
                    { t: "Спонсорская статья", d: "SEO-оптимизированные и читабельные PR-тексты о вашем бренде." },
                    { t: "Видеореклама", d: "Видеоролики в формате внутри новостей или автовоспроизведения." }
                ],
                audience: [
                    { label: "Ежемесячные читатели", val: "1.2 Миллиона+" },
                    { label: "Мобильный доступ", val: "85%" },
                    { label: "Бакинская аудитория", val: "65%" },
                    { label: "Средняя сессия", val: "3.5 Минуты" }
                ],
                statsTitle: "Аналитика аудитории",
                email: "ads@bond.az"
            },
            terms: {
                title: "Условия использования",
                subtitle: "Правила и юридическая информация",
                content: "Используя портал Bond.az, вы считаетесь принявшими следующие условия. Эти условия разработаны для защиты как руководства сайта, так и прав пользователей.",
                sections: [
                    { h: "1. Общие положения", p: "Использование материалов сайта Bond.az (копирование, распространение) возможно только при наличии активной гиперссылки на сайт Bond.az." },
                    { h: "2. Права и обязанности пользователей", p: "Пользователи должны соблюдать этические нормы в разделе комментариев и избегать оскорбительных выражений." },
                    { h: "3. Политика конфиденциальности", p: "Персональная информация, которую мы собираем при использовании вами сайта (IP-адрес, куки и т. д.), не передается третьим лицам." },
                    { h: "4. Ограничение ответственности", p: "Bond.az не несет ответственности за содержание материалов, опубликованных со ссылкой на внешние источники." },
                    { h: "5. Изменение условий", p: "Администрация сайта оставляет за собой право изменять условия использования в любое время без предварительного уведомления." }
                ]
            },
            privacy: {
                title: "Политика конфиденциальности — Защита данных Bond.az",
                shortTitle: "Конфиденциальность",
                subtitle: "Безопасность ваших данных - наш приоритет",
                content: "Настоящая Политика конфиденциальности описывает наши правила и процедуры по сбору, использованию и раскрытию вашей информации.",
                sections: [
                    { h: "1. Определения", p: "Слова, начинающиеся с заглавной буквы, имеют значения, определенные при следующих условиях." },
                    { h: "2. Сбор данных", p: "При использовании нашего Сервиса мы можем попросить вас предоставить нам определенную личную информацию." },
                    { h: "3. Данные об использовании", p: "Данные об использовании собираются автоматически при использовании Сервиса." },
                    { h: "4. Безопасность", p: "Безопасность ваших личных данных важна для нас, но помните, что ни один метод передачи через Интернет не является на 100% безопасным." }
                ]
            }
        }
    }
};
