import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';
import AdSlot from '@/components/AdSlot';
import '@/components/StaticPage.css';
import '@/components/HeroSection.css';

const policyContent = {
    "az": {
        "title": "Bond.az Düzəliş Siyasəti: Şəffaflıq, Məsuliyyət və Etimad",
        "subtitle": "Obyektiv jurnalistikanın təməl daşı",
        "intro": "Bond.az olaraq, məlumatların dəqiqliyinin jurnalist etimadının əsası olduğuna inanırıq. Biz səhvlərimizi qəbul etmək, onları düzəltmək və oxucularımıza şəffaf şəkildə açıqlamaq öhdəliyini daşıyırıq. Bu sənəd düzəliş prosesimizi, redaksiya redaktələrini, oxucuların məlumatlandırılması standartlarını, sosial mediada korreksiyaları və tarixi məsuliyyəti ətraflı təsvir edir. Məqsədimiz hər bir düzəlişin etimadı gücləndirməsini təmin etməkdir.",
        "sections": [
            {
                "h2": "1. Səhvin Etirafı və Düzəliş Prosesi",
                "content": "Bond.az-da hər bir məzmun parçası dərc edilməzdən əvvəl ciddi yoxlamadan keçir. Lakin, insan səhvi qaçılmazdır. Səhv aşkar edildikdə, redaksiya heyəti dərhal işə başlayır: səhvin düzgünlüyünü təsdiqləyir, düzəlişi hazırlayır və dərc edir. Hər bir düzəliş üç mərhələdən ibarətdir: səhvin müəyyənləşdirilməsi, düzəlişin hazırlanması (orijinal xəta ilə yanaşı, kontekstin də düzəldilməsi) və düzəlişin dərci. Düzəliş mətnin sonunda, 'Düzəliş' notifikasiyası ilə qeyd olunur. Xətanın tarixi, növü (faktiki, qrafik, rəqəmsal, şərh) və düzəlişin mahiyyəti qeyd edilir. Ciddi xətalar (məsələn, yanlış ad, tarix, ya rəqəm) üçün məqaləyə ayrıca düzəliş qeydi əlavə olunur."
            },
            {
                "h2": "2. Redaksiya Redaktələrinin Şəffaflığı",
                "content": "Oxucuların redaktə prosesini başa düşməsi vacibdir. Biz məqalələrə dərc edildikdən sonra edilən hər hansı bir redaktəni (kiçik yazı səhvləri, format dəyişiklikləri və ya faktiki düzəlişlər) 'Redaktə qeydi' ilə işarələyirik. Redaktə qeydi mətnin altında, tarix və saatla birlikdə göstərilir. Məzmunun mənasını dəyişən düzəlişlər xüsusi qeyd olunur. Oxucular həmçinin, 'Versiya Tarixçəsi' səhifəsindən məqalənin bütün versiyalarını görə bilərlər. Bu, redaktənin nə vaxt və niyə edildiyini izləməyə imkan verir. Redaktorlar hər bir dəyişikliyi əsaslandırmalıdır."
            },
            {
                "h2": "3. Oxucuların Məlumatlandırılması Standartları",
                "content": "Səhv aşkar edildikdə, oxucuları məlumatlandırmaq üçün bir neçə kanaldan istifadə edirik: 1) Məqalənin özündə görünən düzəliş qeydi; 2) Bond.az-ın ana səhifəsində 'Düzəlişlər' bölməsi; 3) Xəbər bülletenlərində qısa bildiriş; 4) Sosial mediada yazı (aşağıya bax). Düzəlişin əhəmiyyətindən asılı olaraq, oxuculara e-poçt vasitəsilə də məlumat verilə bilər. Hər bir düzəliş qeydində səhvin qısa təsviri, düzəlişin təfərrüatları və üzr istəmə ifadəsi yer alır. Məsələn: 'Əvvəlki versiyada deyilirdi ki,... lakin dəqiq məlumat... Biz bu səhvə görə üzr istəyirik.'"
            },
            {
                "h2": "4. Sosial Mediada Düzəlişlərin İdarə Edilməsi",
                "content": "Sosial media platformaları (Facebook, Twitter, Instagram, LinkedIn) Bond.az məzmununun geniş yayılması üçün vacibdir. Səhv bir sosial media postunda aşkar edildikdə, post dərhal silinir (əgər düzəliş qeydi əlavə etmək mümkün deyilsə) və ya mövcud posta redaktə edilmiş versiyası ilə şərh əlavə olunur. Düzəliş Twitter-də '📝 Düzəliş:' qeydi ilə retweet edilir; Facebook-da orijinal post redaktə olunur və düzəliş haqqında izahat verilir. Həmçinin, hekayələrdə (Stories) səhv varsa, yeni hekayədə düzəliş qeydi paylaşılır. Linkli məzmun üçün, məqalənin özündəki düzəliş qeydinə istinad edilir. Oxucular səhv bildirdikdə, onlara sosial media vasitəsilə təşəkkür edilir və düzəlişin edildiyi bildirilir."
            },
            {
                "h2": "5. Tarixi Məsuliyyət və Arxiv Düzəlişləri",
                "content": "Arxivdəki məqalələr də düzəliş siyasətimizə tabedir. Tarixi məqalələrdə səhv aşkar edildikdə, məqaləyə düzəliş qeydi əlavə olunur, lakin orijinal mətn (səhv daxil olmaqla) 'tarixi versiya' kimi arxivdə saxlanılır. Bu, şəffaflığı təmin edir – oxucular nəyin dəyişdirildiyini görə bilər. Ciddi tarixi səhvlər (məsələn, ictimai şəxsin həyatına təsir edən) üçün ayrıca bir 'Tarixi düzəliş' bəyanatı dərc edilir. Bond.az həmçinin, iddiaların sonradan yalan çıxdığı hallarda, məqalənin əvvəlində 'Xəbərdarlıq' qeydi əlavə edir. Məqsəd, səhvlərin gələcəkdə təkrarlanmaması üçün dərs çıxarmaq və ictimaiyyət qarşısında hesabatlı olmaqdır."
            }
        ]
    },
    "en": {
        "title": "Bond.az Corrections Policy: Transparency, Accountability, Trust",
        "subtitle": "The foundation of objective journalism",
        "intro": "At Bond.az, we believe that accuracy is the bedrock of journalistic credibility. We are committed to acknowledging our mistakes, correcting them transparently, and informing our readers. This document details our correction process, editorial transparency, reader notification standards, handling of social media corrections, and historical accountability. Our goal is to ensure that every correction reinforces trust.",
        "sections": [
            {
                "h2": "1. Error Acknowledgment and Correction Process",
                "content": "At Bond.az, every piece of content undergoes rigorous verification before publication. However, human error is inevitable. When an error is identified, the editorial team acts promptly: verifying the error, preparing the correction, and publishing it. Each correction involves three phases: error identification, preparation (correcting the original mistake along with context), and publication. Corrections are flagged with a 'Correction' note at the end of the text, specifying the date, type (factual, graphic, numerical, interpretive), and nature of the correction. For significant errors (e.g., wrong name, date, or figure), a separate correction notice is appended to the article."
            },
            {
                "h2": "2. Transparency in Editorial Edits",
                "content": "It is essential that readers understand the editorial process. Any post-publication edit (minor typos, formatting changes, or factual corrections) is marked with an 'Edit note' indicating the date and time. Edits that alter the meaning of the content are specifically highlighted. Readers can also view the full version history of an article on a dedicated 'Version History' page, tracking when and why changes were made. Editors must justify each modification."
            },
            {
                "h2": "3. Reader Notification Standards",
                "content": "When an error is discovered, we notify readers through multiple channels: 1) a visible correction note in the article itself; 2) a 'Corrections' section on the Bond.az homepage; 3) a brief notice in newsletters; 4) a post on social media (see below). Depending on the severity, readers may also be notified via email. Each correction note includes a brief description of the error, details of the correction, and an apology statement. For example: 'An earlier version stated that... but the accurate information is... We apologize for this error.'"
            },
            {
                "h2": "4. Handling Corrections on Social Media",
                "content": "Social media platforms (Facebook, Twitter, Instagram, LinkedIn) are vital for the dissemination of Bond.az content. When an error is found in a social post, the post is immediately deleted (if correction annotation is not possible) or edited with a comment linking to the corrected version. On Twitter, a correction is retweeted with '📝 Correction:'; on Facebook, the original post is edited with an explanation of the correction. For Stories, a new story with a correction note is posted. For linked content, the correction note in the article itself is referenced. Readers who report errors are thanked via social media and informed of the correction."
            },
            {
                "h2": "5. Historical Accountability and Archival Corrections",
                "content": "Archived articles are subject to the same correction policy. When an error is found in a historical piece, a correction note is added to the article, but the original text (including the error) is preserved as a 'historical version' in the archive. This ensures transparency – readers can see what has changed. For serious historical errors (e.g., affecting a public figure's life), a separate 'Historical Correction' statement is published. Bond.az also adds a 'Warning' note at the top of an article if claims later prove false. The aim is to learn from mistakes and remain publicly accountable."
            }
        ]
    },
    "ru": {
        "title": "Политика исправлений Bond.az: Прозрачность, Ответственность, Доверие",
        "subtitle": "Основа объективной журналистики",
        "intro": "В Bond.az мы верим, что точность является основой журналистского доверия. Мы обязуемся признавать наши ошибки, исправлять их прозрачно и информировать читателей. Этот документ подробно описывает процесс исправлений, прозрачность редакционных правок, стандарты уведомления читателей, работу с исправлениями в социальных сетях и историческую ответственность. Наша цель — чтобы каждое исправление укрепляло доверие.",
        "sections": [
            {
                "h2": "1. Признание ошибки и процесс исправления",
                "content": "В Bond.az любой контент перед публикацией проходит тщательную проверку. Однако человеческие ошибки неизбежны. Когда ошибка обнаружена, редакция действует оперативно: подтверждает ошибку, готовит исправление и публикует его. Каждое исправление состоит из трех этапов: выявление ошибки, подготовка (исправление исходной ошибки с учетом контекста) и публикация. Исправления отмечаются пометкой «Исправление» в конце текста с указанием даты, типа (фактическая, графическая, числовая, интерпретационная) и сути исправления. Для серьезных ошибок (например, неверное имя, дата или цифра) к статье добавляется отдельное уведомление об исправлении."
            },
            {
                "h2": "2. Прозрачность редакционных правок",
                "content": "Читатели должны понимать редакционный процесс. Любая правка после публикации (незначительные опечатки, изменения форматирования или фактические исправления) отмечается как «Правка» с указанием даты и времени. Правки, меняющие смысл контента, выделяются особо. Читатели также могут просмотреть полную историю версий статьи на специальной странице, отслеживая, когда и почему были внесены изменения. Редакторы должны обосновывать каждое изменение."
            },
            {
                "h2": "3. Стандарты уведомления читателей",
                "content": "При обнаружении ошибки мы уведомляем читателей по нескольким каналам: 1) видимая пометка об исправлении в самой статье; 2) раздел «Исправления» на главной странице Bond.az; 3) краткое уведомление в рассылках; 4) публикация в социальных сетях (см. ниже). В зависимости от серьезности читатели могут быть уведомлены по электронной почте. Каждая пометка об исправлении содержит краткое описание ошибки, подробности исправления и извинения. Например: «В предыдущей версии утверждалось, что... но точная информация... Приносим извинения за эту ошибку»."
            },
            {
                "h2": "4. Работа с исправлениями в социальных сетях",
                "content": "Платформы социальных сетей (Facebook, Twitter, Instagram, LinkedIn) важны для распространения контента Bond.az. Если ошибка обнаружена в посте, он немедленно удаляется (если невозможно добавить исправление) или редактируется с комментарием, ведущим к исправленной версии. В Twitter исправление распространяется как ретвит с пометкой «📝 Исправление:»; в Facebook исходный пост редактируется с объяснением исправления. Для Stories публикуется новая история с пометкой об исправлении. Для контента со ссылкой используется пометка в самой статье. Читателям, сообщившим об ошибке, благодарят в соцсетях и сообщают об исправлении."
            },
            {
                "h2": "5. Историческая ответственность и архивные исправления",
                "content": "Архивные статьи подчиняются той же политике исправлений. При обнаружении ошибки в исторической статье к ней добавляется пометка об исправлении, но исходный текст (включая ошибку) сохраняется как «историческая версия» в архиве. Это обеспечивает прозрачность – читатели видят, что было изменено. Для серьезных исторических ошибок (например, затрагивающих жизнь публичного лица) публикуется отдельное заявление об «Историческом исправлении». Bond.az также добавляет предупреждение в начале статьи, если утверждения впоследствии оказались ложными. Цель – учиться на ошибках и оставаться подотчетными общественности."
            }
        ]
    }
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const content = (policyContent as any)[lang] || policyContent.az;
    const url = `https://bond.az/${lang}/corrections`;
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

export default async function CorrectionsPage({ params }: { params: Promise<{ lang: string }> }) {
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
