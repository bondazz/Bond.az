import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';
import AdSlot from '@/components/AdSlot';
import '@/components/StaticPage.css';
import '@/components/HeroSection.css';

const policyContent = {
    "az": {
        "title": "Etika Siyasəti: Jurnalistika və Redaksiya Standartları",
        "subtitle": "Ən yüksək peşəkar və etik normalara bağlılıq",
        "intro": "Bond.az olaraq, jurnalistikada dəqiqlik, dürüstlük və insan ləyaqətini əsas prinsiplər kimi qəbul edirik. Bu etika siyasəti, bütün redaksiya heyətimizin, müxbirlərimizin və əməkdaşlarımızın riayət etməli olduğu standartları müəyyən edir. Məqsədimiz oxucularımıza etibarlı, qərəzsiz və insan hüquqlarına hörmət edən xəbərlər təqdim etməkdir.",
        "sections": [
            {
                "h2": "Dəqiqlik Prinsipi",
                "content": "Dəqiqlik jurnalistikamızın təməl daşıdır. Hər bir xəbər, məlumatın mənbəyi, tarixçəsi və konteksti diqqətlə yoxlanılaraq hazırlanmalıdır. Faktların doğruluğu təsdiqlənmədən heç bir məlumat dərc edilməməlidir. Səhvlər aşkar edildikdə, dərhal və aydın şəkildə düzəldilməlidir. Hətta kiçik bir səhv belə, jurnalistikanın etibarını zədələyə bilər; buna görə də redaksiya prosesində çoxsaylı yoxlama mərhələləri tətbiq edirik. Mənbələrlə işləyərkən, onların etibarlılığı və obyektivliyi qiymətləndirilməli, şübhəli məlumatlar dərhal təkzib edilməlidir. Bond.az-ın hər bir məqaləsi, faktiki səhvlərdən azad olmaq üçün mütəxəssi rəyçilər tərəfindən yoxlanılır. Dəqiqlik prinsipi yalnız faktlarla məhdudlaşmır; həm də rəqəmlərin, statistik məlumatların və tarixi kontekstin düzgün təqdim olunmasını əhatə edir. Tərcümə edilmiş xəbərlərdə orijinal mənbəyə sadiqlik qorunmalı, mənanın itirilməsinə yol verilməməlidir."
            },
            {
                "h2": "Müstəqillik və Qərəzsizlik",
                "content": "Bond.az, heç bir siyasi, iqtisadi və ya şəxsi təsir altında olmadan fəaliyyət göstərir. Redaksiya siyasəti, maliyyə mənbələrindən asılı olmayaraq, müstəqil qərarlar qəbul etməyi tələb edir. Reklam verənlər, sponsorlar və ya digər maraq qrupları xəbər məzmununa təsir göstərə bilməz. Hər bir jurnalist, potensial maraq toqquşmalarını açıqlamalı və bu hallardan çəkinməlidir. Qərəzsizlik, xüsusilə siyasi və sosial münaqişələri əhatə edən məsələlərdə vacibdir. Bond.az, bütün tərəflərə qarşı ədalətli olmaq, onların fikirlərinə yer vermək və heç bir tərəfi qərəzli şəkildə təsvir etməmək öhdəliyi daşıyır. Redaktorlar, məqalələrin dilində və tonunda qərəzsizliyə nəzarət edir. Şəxsi rəy və dəyər mühakimələri xəbər mətnlərindən uzaq tutulmalı, analiz və şərhlər isə aydın şəkildə işarələnməlidir."
            },
            {
                "h2": "İnsan Ləyaqətinə Hörmət",
                "content": "Bond.az, insan ləyaqətini hər şeydən üstün tutur. Xəbərlərin hazırlanması və yayımlanması zamanı heç kimin şəxsi həyatına, məxfiliyinə və ya ləyaqətinə zərər verilməməlidir. Zərərçəkmişlər, qurbanlar və həssas qruplar xüsusi diqqət tələb edir. Uşaqlar, cinsi zorakılıq qurbanları və ya sağlamlıq problemləri olan şəxslər haqqında məlumat verərkən onların kimlikləri gizli saxlanılmalı, lüzumsuz detallardan qaçınılmalıdır. Bond.az, insanları alçaldan, ayrı-seçkilik yaradan və ya nifrətə təşviq edən məzmunu qəbul etmir. Hər bir xəbər, mədəni, dini və etnik fərqliliklərə hörmət çərçivəsində təqdim edilməlidir. Reportajlarda şəkillərin istifadəsi də diqqətlə seçilməli, insanların xüsusi anlarında çəkilmiş görüntülər onların razılığı olmadan yayımlanmamalıdır. İnsan ləyaqəti prinsipi, jurnalistikanın ictimai marağa xidmət etməsi ilə şəxsi hüquqlar arasında balans yaratmağı tələb edir."
            },
            {
                "h2": "Süni İntellekt İstifadəsi",
                "content": "Bond.az, süni intellekt (Sİ) texnologiyalarını jurnalistikada dəstəkləyir, lakin bu texnologiyaların istifadəsi insan nəzarəti altında olmalıdır. Sİ ilə yaradılmış məzmun, redaktorlar tərəfindən diqqətlə yoxlanılmalı və etik standartlara uyğunluğu təsdiqlənməlidir. Sİ alqoritmləri, qərəzli məlumatlarla təlim olunarsa, bu qərəzləri gücləndirə bilər; buna görə də, Bond.az Sİ-nin istifadəsində şəffaflıq prinsipinə əməl edir. Oxuculara Sİ tərəfindən yaradılmış məzmunun mənbəyi barədə məlumat verilməli, süni intellektin rolu aydın şəkildə göstərilməlidir. Sİ, insan jurnalistlərinin əvəzi deyil, köməkçi vasitə kimi istifadə olunmalıdır. Bond.az, Sİ-nin insan hüquqlarına, məxfiliyə və etik normalara zidd şəkildə istifadəsini qadağan edir. Alqoritmik qərarların izah olunması və Sİ-nin yaratdığı səhvlərə qarşı məsuliyyət daşımaq da vacibdir."
            },
            {
                "h2": "Mənbə Qorunması",
                "content": "Mənbələrin qorunması, jurnalistikanın etibarlılığının təmin edilməsində əsas rol oynayır. Bond.az, mənbələrin anonimlik tələblərinə hörmət edir və onların hüquqi təqibə məruz qalmaması üçün bütün tədbirləri görür. Mənbələrə verilən sözlər ciddi şəkildə yerinə yetirilməli, onların kimliyi yalnız məhkəmə qərarı ilə açıqlana bilər. Jurnalist, mənbənin məlumatlarının doğruluğunu yoxlamaq üçün alternativ yollar axtarmalı, lakin mənbənin məxfiliyini riskə atmamalıdır. Mənbə qorunması, həmçinin məlumatların təhrif edilməsindən qorunmasını da əhatə edir. Bond.az, mənbələrinə qarşı vicdanlı olmağı və onların təhlükəsizliyini təmin etməyi öhdəsinə götürür."
            }
        ]
    },
    "en": {
        "title": "Ethics Policy: Journalism and Editorial Standards",
        "subtitle": "Commitment to the Highest Professional and Ethical Norms",
        "intro": "At Bond.az, we uphold accuracy, integrity, and human dignity as core principles of journalism. This ethics policy defines the standards that all editorial staff, correspondents, and collaborators must adhere to. Our goal is to deliver reliable, unbiased, and human rights-respecting news to our readers.",
        "sections": [
            {
                "h2": "Accuracy Principle",
                "content": "Accuracy is the foundation of our journalism. Every news item must be carefully verified for source, background, and context before publication. No information should be published without confirming its factual correctness. When errors are discovered, they must be corrected promptly and clearly. Even a minor mistake can damage journalistic credibility; therefore, we implement multiple verification stages in the editorial process. When working with sources, their reliability and objectivity must be assessed, and dubious information must be refuted immediately. Every Bond.az article is reviewed by expert fact-checkers to ensure it is free of factual errors. The principle of accuracy extends beyond facts; it also includes the correct presentation of numbers, statistical data, and historical context. In translated news, fidelity to the original source must be maintained, and meaning should not be lost."
            },
            {
                "h2": "Independence and Impartiality",
                "content": "Bond.az operates free from any political, economic, or personal influence. The editorial policy requires independent decision-making regardless of financial sources. Advertisers, sponsors, or other interest groups cannot influence news content. Every journalist must disclose potential conflicts of interest and avoid such situations. Impartiality is especially important in covering political and social conflicts. Bond.az commits to being fair to all parties, giving space to their opinions, and not portraying any party in a biased manner. Editors monitor language and tone for impartiality in articles. Personal opinions and value judgments must be kept out of news texts, while analysis and commentary should be clearly labeled."
            },
            {
                "h2": "Respect for Human Dignity",
                "content": "Bond.az places the highest value on human dignity. The preparation and dissemination of news must not harm anyone's privacy, personal life, or dignity. Victims, the bereaved, and vulnerable groups require special attention. When reporting on children, sexual assault victims, or individuals with health issues, their identities must be protected and unnecessary details avoided. Bond.az does not accept content that degrades individuals, promotes discrimination, or incites hatred. Every news item must be presented with respect for cultural, religious, and ethnic diversity. The use of images in reports must be carefully selected; candid shots of people in vulnerable moments should not be published without their consent. The principle of human dignity requires balancing the public interest served by journalism with individual rights."
            },
            {
                "h2": "Use of Artificial Intelligence",
                "content": "Bond.az supports the use of artificial intelligence (AI) technologies in journalism, but such technologies must be used under human supervision. AI-generated content must be carefully reviewed by editors and verified for compliance with ethical standards. AI algorithms trained on biased data can reinforce biases; therefore, Bond.az adheres to the principle of transparency in AI use. Readers must be informed about the source of AI-generated content, and the role of AI must be clearly stated. AI should be used as a supplementary tool, not a replacement for human journalists. Bond.az prohibits the use of AI in ways that violate human rights, privacy, or ethical norms. Explainability of algorithmic decisions and accountability for AI-generated errors are also important."
            },
            {
                "h2": "Source Protection",
                "content": "Protecting sources is crucial for ensuring journalistic credibility. Bond.az respects the anonymity requests of sources and takes all measures to prevent their legal prosecution. Promises made to sources must be strictly fulfilled; their identity may only be disclosed by court order. Journalists should seek alternative ways to verify the accuracy of source information without risking the source's confidentiality. Source protection also includes protecting information from distortion. Bond.az commits to being honest with its sources and ensuring their safety."
            }
        ]
    },
    "ru": {
        "title": "Этическая политика: Журналистские и редакционные стандарты",
        "subtitle": "Приверженность самым высоким профессиональным и этическим нормам",
        "intro": "Bond.az считает точность, честность и человеческое достоинство основополагающими принципами журналистики. Данная этическая политика определяет стандарты, которым должны следовать все сотрудники редакции, корреспонденты и партнеры. Наша цель – предоставлять читателям достоверные, беспристрастные и уважающие права человека новости.",
        "sections": [
            {
                "h2": "Принцип точности",
                "content": "Точность является основой нашей журналистики. Каждый новостной материал должен быть тщательно проверен на предмет источника, предыстории и контекста перед публикацией. Никакая информация не должна публиковаться без подтверждения ее фактической правильности. При обнаружении ошибок они должны быть немедленно и четко исправлены. Даже незначительная ошибка может нанести ущерб журналистской достоверности; поэтому мы внедряем несколько этапов проверки в редакционный процесс. При работе с источниками необходимо оценивать их надежность и объективность, а сомнительную информацию немедленно опровергать. Каждая статья Bond.az проверяется экспертами-фактчекерами на отсутствие фактических ошибок. Принцип точности распространяется не только на факты, но и на правильное представление цифр, статистических данных и исторического контекста. В переведенных новостях должна сохраняться верность оригинальному источнику, и смысл не должен теряться."
            },
            {
                "h2": "Независимость и беспристрастность",
                "content": "Bond.az действует независимо от любого политического, экономического или личного влияния. Редакционная политика требует принятия независимых решений независимо от финансовых источников. Рекламодатели, спонсоры или другие заинтересованные группы не могут влиять на содержание новостей. Каждый журналист должен раскрывать потенциальные конфликты интересов и избегать таких ситуаций. Беспристрастность особенно важна при освещении политических и социальных конфликтов. Bond.az обязуется быть справедливым ко всем сторонам, предоставлять им возможность высказаться и не изображать какую-либо сторону предвзято. Редакторы контролируют язык и тон статей на предмет беспристрастности. Личные мнения и оценочные суждения должны быть исключены из новостных текстов, а анализ и комментарии должны быть четко обозначены."
            },
            {
                "h2": "Уважение человеческого достоинства",
                "content": "Bond.az ставит человеческое достоинство превыше всего. Подготовка и распространение новостей не должны наносить ущерба чьей-либо частной жизни, личной жизни или достоинству. Жертвы, пострадавшие и уязвимые группы требуют особого внимания. При освещении детей, жертв сексуального насилия или лиц с проблемами со здоровьем их личности должны быть защищены, а ненужные детали исключены. Bond.az не принимает контент, унижающий людей, пропагандирующий дискриминацию или разжигающий ненависть. Каждая новость должна представляться с уважением к культурному, религиозному и этническому разнообразию. Использование изображений в репортажах должно быть тщательно отобрано; откровенные снимки людей в уязвимые моменты не должны публиковаться без их согласия. Принцип человеческого достоинства требует баланса между служением общественным интересам через журналистику и индивидуальными правами."
            },
            {
                "h2": "Использование искусственного интеллекта",
                "content": "Bond.az поддерживает использование технологий искусственного интеллекта (ИИ) в журналистике, но такие технологии должны использоваться под контролем человека. Контент, созданный с помощью ИИ, должен тщательно проверяться редакторами на соответствие этическим стандартам. Алгоритмы ИИ, обученные на предвзятых данных, могут усиливать предвзятость; поэтому Bond.az придерживается принципа прозрачности в использовании ИИ. Читатели должны быть проинформированы об источнике контента, созданного ИИ, и роль ИИ должна быть четко указана. ИИ следует использовать как вспомогательный инструмент, а не замену журналистам. Bond.az запрещает использование ИИ способами, нарушающими права человека, конфиденциальность или этические нормы. Объяснимость алгоритмических решений и ответственность за ошибки, совершенные ИИ, также важны."
            },
            {
                "h2": "Защита источников",
                "content": "Защита источников имеет решающее значение для обеспечения журналистской достоверности. Bond.az уважает просьбы источников об анонимности и принимает все меры для предотвращения их судебного преследования. Обещания, данные источникам, должны строго выполняться; их личность может быть раскрыта только по решению суда. Журналисты должны искать альтернативные способы проверки точности информации источника, не подвергая риску его конфиденциальность. Защита источников также включает защиту информации от искажения. Bond.az обязуется быть честным с источниками и обеспечивать их безопасность."
            }
        ]
    }
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const content = (policyContent as any)[lang] || policyContent.az;
    return { title: `${content.title} - Bond.az`, description: content.intro };
}

export default async function EthicsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const content = (policyContent as any)[lang] || policyContent.az;

    return (
        <div className="static-page-wrapper">
            <style dangerouslySetInnerHTML={{
                __html: `
                .force-black { color: #000000 !important; }
                .dark .force-black { color: #ffffff !important; }
                .force-gray { color: #444444 !important; }
                .dark .force-gray { color: #bbbbbb !important; }
            `}} />

            <section className="hero-container max-w-[1440px] mx-auto flex gap-8 px-6 py-12">
                <aside className="side-ads left hidden xl:block w-[160px] shrink-0">
                    <div className="sticky top-32">
                        <AdSlot slotId="sidebar_left" width={160} height={600} />
                    </div>
                </aside>

                <div className="hero-mid-wrapper flex-grow max-w-[850px] mx-auto">
                    <header className="mb-10">
                        <h1 className="text-2xl md:text-3xl font-black mb-4 tracking-tight force-black">
                            {content.title}
                        </h1>
                        <p className="text-base font-bold force-gray">
                            {content.subtitle}
                        </p>
                    </header>

                    <main>
                        <div className="text-[16px] leading-relaxed mb-10 border-l-4 border-red-600 pl-8 font-medium force-black opacity-90">
                            {content.intro}
                        </div>

                        <div className="space-y-12">
                            {content.sections.map((section: any, idx: number) => (
                                <section key={idx}>
                                    <h2 className="text-xl md:text-2xl font-bold mb-4 tracking-tight force-black">
                                        {section.h2}
                                    </h2>
                                    <div className="text-[15px] leading-relaxed font-normal force-black">
                                        {section.content.split('\n\n').map((paragraph: string, pIdx: number) => (
                                            <p key={pIdx} className="mb-4">{paragraph}</p>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    </main>
                </div>

                <aside className="side-ads right hidden xl:block w-[160px] shrink-0">
                    <div className="sticky top-32">
                        <AdSlot slotId="sidebar_right" width={160} height={600} />
                    </div>
                </aside>
            </section>
        </div>
    );
}
