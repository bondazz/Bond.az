import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';
import AdSlot from '@/components/AdSlot';
import '@/components/StaticPage.css';
import '@/components/HeroSection.css';

const policyContent = {
    "az": {
        "title": "Bond.az Müxtəliflik və Daxiletmə Siyasəti",
        "subtitle": "Bərabər təmsilçilik, inklüziv jurnalistika və əlçatanlıq standartlarına dair qlobal yanaşma",
        "intro": "Bond.az olaraq biz inanırıq ki, müxtəliflik redaksiyamızın, xəbər məzmunumuzun və oxucu kütləsində qurduğumuz əlaqənin gücünün mərkəzindədir. Bu sənəd müxtəlifliyi, bərabərliyi və inklüzivliyi (DEI) təmin etmək üçün fəaliyyət prinsiplərimizi, təcrübələrimizi və məsuliyyətlərimizi müəyyən edir. Siyasət iş yeri mədəniyyətimizə, mənbə seçiminə, stereotiplərə qarşı mübarizəyə, azlıqların səslərinə, gender tarazlığına və əlçatanlığa aid bütün aspektləri əhatə edir.",
        "sections": [
            {
                "h2": "1. İş Yerində Bərabərlik və İnklüziv Mədəniyyət",
                "content": "Bond.az-da biz hər bir işçinin, irqi, etnik mənsubiyyəti, cinsi, gender kimliyi, cinsi oriyentasiyası, yaşı, əlilliyi, dini inancı, siyasi baxışı və ya sosial-iqtisadi fonundan asılı olmayaraq, dəyərli olduğu və hörmət gördüyü bir iş mühiti yaradırıq. İşə qəbul, təlim, vəzifə yüksəltmə və əməkhaqqı siyasətlərimiz ayrı-seçkilikdən azaddır. Rəhbərlik komandasının müxtəlifliyi təmin etmək üçün hər il müxtəliflik auditləri keçiririk, gender tarazlığına xüsusi diqqət yetiririk. İşçilərə mədəniyyətlərarası ünsiyyət və qərəzsizlik üzrə məcburi təlimlər təşkil edilir. Həmçinin, təşəbbüskarlıqla işçi qrupları (ERG) yaradılmasını dəstəkləyirik."
            },
            {
                "h2": "2. Xəbər Məzmununda İnklüziv Təmsilçilik",
                "content": "Bond.az xəbərləri Azərbaycan cəmiyyətinin bütün təbəqələrini əks etdirməlidir. Redaksiya siyasətimizə əsasən, heç bir sosial qrup, etnik azlıq, qadın, LGBTİ+ fərdi, əlilliyi olan şəxslər və ya digər qruplar məzmunumuzda kənarlaşdırılmamalıdır. Hekayə seçimində, fotoqrafiya və qrafik elementlərdə müxtəlifliyə riayət edirik. Məsələn, iqtisadiyyat xəbərlərində qadın sahibkarların səslərinə yer verilir, kənd yerlərindən olan insanların hekayələri işıqlandırılır. Hər bir xəbər məqaləsi redaksiya tərəfindən 'inklüzivlik baxışı'ndan keçirilir."
            },
            {
                "h2": "3. Stereotiplərin Aradan Qaldırılması",
                "content": "Biz jurnalistika vasitəsilə mövcud stereotipləri gücləndirməməyi, əksinə onları dağıtmağı öhdəlik götürürük. Məsələn, gender stereotiplərindən qaçınmaq üçün qadınları yalnız ailə, gözəllik və ya məişət mövzuları ilə məhdudlaşdırmırıq; elm, texnologiya, siyasət kimi sahələrdə də onların rəy və təcrübəsinə yer veririk. Etnik azlıqlar haqqında xəbərlərdə onların yalnız problemləri deyil, uğurları da vurğulanır. Kriminal xəbərlərdə şübhəlinin etnik mənsubiyyətini qeyd etməkdən çəkinirik, çünki bu, qərəzli təsvirə səbəb ola bilər."
            },
            {
                "h2": "4. Azlıqların Səsləri",
                "content": "Bond.az Azərbaycanda yaşayan bütün etnik və dini qrupların (talışlar, ləzgilər, avarlar, tatlar, kürdlər, Rus pravoslavları, yəhudilər və s.) səslərini eşitmək üçün platforma təqdim edir. Biz müntəzəm olaraq azlıq qrupları ilə əməkdaşlıq edirik, onların öz hekayələrini izah etmələrinə imkan veririk. Xüsusi rubrikalar və layihələr vasitəsilə azlıq mədəniyyətlərinə, tarixinə və gündəlik həyatına işıq salırıq. Həmçinin, azlıq təmsilçiləri üçün məqalə yazma və redaksiya şurasında iştirak imkanları yaradırıq."
            },
            {
                "h2": "5. Mənbə Seçimində Gender Tarazlığı",
                "content": "Bond.az xəbər mənbələrində gender tarazlığını təmin etmək məqsədi daşıyır. Hər bir məqalədə ən azı bir qadın mənbəyə yer verilməsi tövsiyə olunur. Siyasi, iqtisadi, elmi mövzularda mütəxəssis qadınlardan şərh almağa üstünlük veririk. Bu məqsədlə qadın ekspertlər bazası yaradılır və jurnalistlər həvəsləndirilir. Gender balansı hər rüb yoxlanılır və nəticələr şəffaf şəkildə dərc olunur."
            },
            {
                "h2": "6. Əlçatanlıq Standartları",
                "content": "Bond.az veb-saytı və mobil tətbiqi WCAG 2.1 AA standartlarına uyğun olaraq əlçatanlıq tələblərini qarşılayır. Buraya ekran oxuyucu uyğunluğu, klaviatura naviqasiyası, rəng kontrastı, mətn ölçüsünün dəyişdirilməsi və başlıqların düzgün iyerarxiyası daxildir. Video məzmunlar üçün səsli təsvir və səssiz videolar üçün başlıqlar təmin edilir. Əlilliyi olan istifadəçilər üçün məzmun alternativ formatlarda (Audio, Braille, sadə mətn) təqdim edilir. Redaksiya əməkdaşları əlçatanlıq üzrə təlim alır."
            },
            {
                "h2": "7. Müxtəliflik Təlimi və Hesabatlılıq",
                "content": "Bütün işçilər ildə ən azı iki dəfə müxtəliflik, bərabərlik və inklüzivlik mövzusunda təlimə cəlb edilir. Təlimlərdə şüursuz qərəzlik, kültürlərarası ünsiyyət, mikrotəcavüzlər və inklüziv dil istifadəsi kimi mövzular əhatə olunur. Hər bir şöbə rəhbəri öz komandasında müxtəliflik göstəricilərinə cavabdehdir. İllik müxtəliflik hesabatı hazırlanır və ictimaiyyətlə paylaşılır. Şikayət və təkliflər üçün anonim kanal mövcuddur."
            },
            {
                "h2": "8. Tərəfdaşlıqlar və İcma Əlaqələri",
                "content": "Bond.az müxtəlifliyi təşviq edən təşkilatlarla əməkdaşlıq edir. QHT-lər, gender bərabərliyi qrupları, əlillik təşkilatları ilə birgə layihələr həyata keçirir. Azlıq icmaları ilə müntəzəm görüşlər keçirilir, onların ehtiyacları dinlənilir. Karyera yarmarkaları və təqaüd proqramları vasitəsilə az təmsil olunan qruplardan jurnalistlərin işə götürülməsi təşviq edilir."
            },
            {
                "h2": "9. Siyasətin İcrası və Monitorinq",
                "content": "Bu siyasətin icrasına nəzarət edən Müxtəliflik Şurası fəaliyyət göstərir. Şura redaksiyanın müxtəliflik göstəricilərini rüblük iclaslarda qiymətləndirir, məzmun auditləri aparır. KPI'lar arasında mənbə gender balansı, azlıq mövzularına ayrılan yer, əlçatanlıq test nəticələri və işçi məmnuniyyəti sorğuları yer alır. Siyasət hər il yenilənərək ən yaxşı təcrübələrə uyğunlaşdırılır."
            }
        ]
    },
    "en": {
        "title": "Bond.az Diversity and Inclusion Policy",
        "subtitle": "Global approach to equal representation, inclusive journalism and accessibility standards",
        "intro": "At Bond.az, we believe that diversity is at the core of the strength of our newsroom, news content and the connection we build with our readership. This document defines our principles, practices and responsibilities to ensure diversity, equity and inclusion (DEI). The policy covers all aspects of our workplace culture, source selection, combating stereotypes, minority voices, gender balance and accessibility.",
        "sections": [
            {
                "h2": "1. Workplace Equality and Inclusive Culture",
                "content": "At Bond.az, we create a work environment where every employee feels valued and respected, regardless of race, ethnicity, gender, gender identity, sexual orientation, age, disability, religion, political opinion or socio-economic background. Our recruitment, training, promotion and compensation policies are free from discrimination. We conduct annual diversity audits with a particular focus on gender balance in leadership. Employees receive mandatory training on intercultural communication and unconscious bias. We also support the formation of Employee Resource Groups (ERGs)."
            },
            {
                "h2": "2. Inclusive Representation in News Content",
                "content": "Bond.az news must reflect the full diversity of Azerbaijani society. Our editorial policy ensures that no social group, ethnic minority, women, LGBTQ+ individuals, persons with disabilities or other groups are excluded from our content. We adhere to diversity in story selection, photography and graphic elements. For example, economic stories feature female entrepreneurs, and stories from rural areas are highlighted. Each article undergoes an 'inclusivity check' by the editorial team."
            },
            {
                "h2": "3. Combating Stereotypes",
                "content": "We commit to not reinforcing stereotypes through journalism, but rather to dismantling them. For instance, to avoid gender stereotypes, women are not limited to family, beauty or domestic topics; their opinions and expertise are also sought in science, technology, politics and other fields. In stories about ethnic minorities, we emphasize not only their challenges but also their achievements. In crime reports, we avoid mentioning the suspect's ethnicity, as it can lead to biased portrayal."
            },
            {
                "h2": "4. Amplifying Minority Voices",
                "content": "Bond.az provides a platform for the voices of all ethnic and religious groups living in Azerbaijan (Talysh, Lezgins, Avars, Tats, Kurds, Russian Orthodox, Jews, etc.). We regularly collaborate with minority groups, allowing them to tell their own stories. Through special sections and projects, we shed light on minority cultures, history and daily life. We also provide opportunities for minority representatives to write articles and participate in the editorial board."
            },
            {
                "h2": "5. Gender Balance in Sourcing",
                "content": "Bond.az aims to ensure gender balance in news sources. Each article is recommended to include at least one female source. We prioritize obtaining comments from female experts in political, economic and scientific topics. To this end, a database of female experts is created and journalists are encouraged to use it. Gender balance is monitored quarterly and results are published transparently."
            },
            {
                "h2": "6. Accessibility Standards",
                "content": "Bond.az website and mobile app meet WCAG 2.1 AA accessibility standards. This includes screen reader compatibility, keyboard navigation, color contrast, text resizability and proper heading hierarchy. Audio descriptions and captions are provided for video content. Content is available in alternative formats (Audio, Braille, plain text) for users with disabilities. Editorial staff receive accessibility training."
            },
            {
                "h2": "7. Diversity Training and Accountability",
                "content": "All employees undergo diversity, equity and inclusion training at least twice a year. Training covers unconscious bias, intercultural communication, microaggressions and inclusive language. Each department head is accountable for diversity metrics within their team. An annual diversity report is prepared and shared publicly. An anonymous channel is available for complaints and suggestions."
            },
            {
                "h2": "8. Partnerships and Community Engagement",
                "content": "Bond.az partners with organizations promoting diversity. We carry out joint projects with NGOs, gender equality groups, disability organizations. Regular meetings are held with minority communities to listen to their needs. Career fairs and scholarship programs encourage recruitment of journalists from under-represented groups."
            },
            {
                "h2": "9. Implementation and Monitoring",
                "content": "A Diversity Council oversees the implementation of this policy. The council evaluates diversity metrics quarterly, conducts content audits. KPIs include source gender balance, space devoted to minority topics, accessibility test results and employee satisfaction surveys. The policy is updated annually to align with best practices."
            }
        ]
    },
    "ru": {
        "title": "Политика разнообразия и инклюзивности Bond.az",
        "subtitle": "Глобальный подход к равному представительству, инклюзивной журналистике и стандартам доступности",
        "intro": "В Bond.az мы убеждены, что разнообразие лежит в основе силы нашей редакции, новостного контента и связи с читательской аудиторией. Данный документ определяет наши принципы, практики и обязанности по обеспечению разнообразия, равенства и инклюзивности (DEI). Политика охватывает все аспекты нашей корпоративной культуры, отбора источников, борьбы со стереотипами, голосов меньшинств, гендерного баланса и доступности.",
        "sections": [
            {
                "h2": "1. Равенство на рабочем месте и инклюзивная культура",
                "content": "В Bond.az мы создаем рабочую среду, где каждый сотрудник чувствует себя ценным и уважаемым, независимо от расы, этнической принадлежности, пола, гендерной идентичности, сексуальной ориентации, возраста, инвалидности, религии, политических взглядов или социально-экономического происхождения. Наша политика найма, обучения, повышения и оплаты труда свободна от дискриминации. Мы ежегодно проводим аудит разнообразия с особым акцентом на гендерный баланс в руководстве. Сотрудники проходят обязательное обучение межкультурной коммуникации и неосознанным предубеждениям. Мы также поддерживаем создание ресурсных групп сотрудников (ERG)."
            },
            {
                "h2": "2. Инклюзивное представительство в новостях",
                "content": "Новости Bond.az должны отражать все разнообразие азербайджанского общества. Наша редакционная политика гарантирует, что ни одна социальная группа, этническое меньшинство, женщины, ЛГБТК+ лица, люди с инвалидностью или другие группы не исключаются из нашего контента. Мы придерживаемся разнообразия при выборе сюжетов, фотографий и графики. Например, экономические истории включают голоса женщин-предпринимателей, освещаются истории из сельской местности. Каждая статья проходит «проверку на инклюзивность» редакцией."
            },
            {
                "h2": "3. Преодоление стереотипов",
                "content": "Мы обязуемся не укреплять стереотипы через журналистику, а, наоборот, разрушать их. Например, чтобы избежать гендерных стереотипов, женщины не ограничиваются темами семьи, красоты или домашнего хозяйства; их мнения и экспертиза также востребованы в науке, технологиях, политике и других областях. В историях об этнических меньшинствах мы подчеркиваем не только их проблемы, но и достижения. В криминальных репортажах мы избегаем упоминания этнической принадлежности подозреваемых, так как это может привести к предвзятому изображению."
            },
            {
                "h2": "4. Усиление голосов меньшинств",
                "content": "Bond.az предоставляет платформу для голосов всех этнических и религиозных групп, проживающих в Азербайджане (талыши, лезгины, аварцы, таты, курды, русские православные, евреи и др.). Мы регулярно сотрудничаем с группами меньшинств, позволяя им рассказывать свои собственные истории. Через специальные рубрики и проекты мы освещаем культуру, историю и повседневную жизнь меньшинств. Мы также предоставляем возможности представителям меньшинств писать статьи и участвовать в редакционной коллегии."
            },
            {
                "h2": "5. Гендерный баланс в источниках",
                "content": "Bond.az стремится обеспечить гендерный баланс в новостных источниках. Рекомендуется включать как минимум один женский источник в каждую статью. Мы отдаем приоритет получению комментариев от женщин-экспертов в политических, экономических и научных темах. Для этого создается база данных женщин-экспертов, и журналистов поощряют ее использовать. Гендерный баланс отслеживается ежеквартально, результаты публикуются открыто."
            },
            {
                "h2": "6. Стандарты доступности",
                "content": "Веб-сайт и мобильное приложение Bond.az соответствуют стандартам доступности WCAG 2.1 AA. Это включает совместимость с экранными дикторами, навигацию с клавиатуры, цветовой контраст, изменение размера текста и правильную иерархию заголовков. Для видео контента предоставляются аудиоописания и субтитры. Контент доступен в альтернативных форматах (аудио, шрифт Брайля, простой текст) для пользователей с инвалидностью. Редакционные сотрудники проходят обучение по доступности."
            },
            {
                "h2": "7. Обучение разнообразию и подотчетность",
                "content": "Все сотрудники проходят обучение по вопросам разнообразия, равенства и инклюзивности не реже двух раз в год. Обучение охватывает неосознанные предубеждения, межкультурную коммуникацию, микроагрессии и инклюзивный язык. Каждый руководитель отдела несет ответственность за показатели разнообразия в своей команде. Ежегодный отчет о разнообразии готовится и публикуется. Для жалоб и предложений доступен анонимный канал."
            },
            {
                "h2": "8. Партнерства и взаимодействие с сообществом",
                "content": "Bond.az сотрудничает с организациями, продвигающими разнообразие. Мы реализуем совместные проекты с НПО, группами по гендерному равенству, организациями по инвалидности. Проводятся регулярные встречи с сообществами меньшинств для выслушивания их потребностей. Ярмарки вакансий и стипендиальные программы поощряют найм журналистов из недостаточно представленных групп."
            },
            {
                "h2": "9. Внедрение и мониторинг",
                "content": "Совет по разнообразию контролирует реализацию данной политики. Совет ежеквартально оценивает показатели разнообразия, проводит аудит контента. KPI включают гендерный баланс источников, объем освещения тем меньшинств, результаты тестирования доступности и опросы удовлетворенности сотрудников. Политика ежегодно обновляется в соответствии с лучшими практиками."
            }
        ]
    }
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const content = (policyContent as any)[lang] || policyContent.az;
    const url = `https://bond.az/${lang}/diversity`;
    return {
        title: `${content.title} — Bond.az`,
        description: content.intro,
        alternates: {
            canonical: url,
        },
        robots: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
        }
    };
}

export default async function DiversityPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const content = (policyContent as any)[lang] || policyContent.az;

    return (
        <div className="static-page-wrapper">
            <style dangerouslySetInnerHTML={{ __html: `
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
