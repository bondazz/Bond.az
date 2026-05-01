"use client";

import React from 'react';
import { translations, Locale } from '@/utils/translations';
import Script from 'next/script';
import './StaticPage.css';

interface StaticPageProps {
    lang: string;
    pageKey: 'about' | 'contact' | 'ads' | 'terms';
}

const StaticPageContent = ({ lang, pageKey }: StaticPageProps) => {
    const t = translations[lang as Locale] || translations.az;
    const pageData = (t as any).static[pageKey];

    const url = `https://bond.az/${lang}/${pageKey}`;
    const schema = {
        "@context": "https://schema.org",
        "@type": pageKey === 'about' ? "AboutPage" : pageKey === 'contact' ? "ContactPage" : "WebPage",
        "name": pageData.title,
        "description": pageData.content,
        "url": url,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": url
        },
        "publisher": {
            "@type": "Organization",
            "name": "Bond.az",
            "logo": {
                "@type": "ImageObject",
                "url": "https://bond.az/bond_logo_black.webp"
            }
        }
    };

    return (
        <div className="static-page-wrapper">
            <Script
                id="static-page-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />

            <header className="static-hero">
                <div className="hero-content">
                    <span className="hero-tag">Bond.az</span>
                    <h1 className="hero-title">{pageData.shortTitle}</h1>
                    <p className="hero-subtitle">{pageData.subtitle}</p>
                </div>
            </header>

            <main className="static-body-container">
                
                {/* ABOUT US CONTENT */}
                {pageKey === 'about' && (
                    <div className="about-rich-content">
                        <section className="about-intro-section">
                            <div className="section-icon">📰</div>
                            <p className="lead-text">{pageData.content}</p>
                        </section>

                        <div className="mission-vision-grid">
                            <div className="mv-card">
                                <div className="card-badge">Target</div>
                                <h3>{pageData.mission}</h3>
                                <p>{pageData.missionText}</p>
                            </div>
                            <div className="mv-card accent">
                                <div className="card-badge">Future</div>
                                <h3>{pageData.vision}</h3>
                                <p>{pageData.visionText}</p>
                            </div>
                        </div>

                        <div className="info-block-grid">
                            <div className="info-block">
                                <h3>{pageData.history}</h3>
                                <p>{pageData.historyText}</p>
                            </div>
                            <div className="info-block">
                                <h3>{pageData.ethics}</h3>
                                <p>{pageData.ethicsText}</p>
                            </div>
                        </div>

                        <div className="values-wrapper">
                            <h3 className="section-title">{lang === 'az' ? 'Dəyərlərimiz' : lang === 'ru' ? 'Наши ценности' : 'Our Values'}</h3>
                            <div className="values-section">
                                {pageData.values.map((v: string, i: number) => (
                                    <div key={i} className="value-badge">
                                        <span className="dot"></span> {v}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* CONTACT CONTENT */}
                {pageKey === 'contact' && (
                    <div className="contact-rich-layout">
                        <div className="contact-grid">
                            <div className="contact-info-side">
                                <h2>{pageData.subtitle}</h2>
                                <p className="lead-text">{pageData.content}</p>
                                
                                <div className="departments-grid">
                                    {pageData.departments.map((d: any, i: number) => (
                                        <div key={i} className="dept-card">
                                            <strong>{d.name}</strong>
                                            <a href={`mailto:${d.email}`}>{d.email}</a>
                                        </div>
                                    ))}
                                </div>

                                <div className="contact-methods-v2">
                                    <div className="method-pill">
                                        <span className="m-icon">📞</span>
                                        <span>{pageData.phone}</span>
                                    </div>
                                    <div className="method-pill">
                                        <span className="m-icon">📍</span>
                                        <span>{pageData.address}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="contact-form-side">
                                <div className="contact-form-card premium">
                                    <h3>{pageData.formTitle}</h3>
                                    <form className="static-form" onSubmit={(e) => e.preventDefault()}>
                                        <div className="input-group">
                                            <input type="text" placeholder={pageData.namePlaceholder} required />
                                        </div>
                                        <div className="input-group">
                                            <input type="email" placeholder={pageData.emailPlaceholder} required />
                                        </div>
                                        <div className="input-group">
                                            <input type="text" placeholder={pageData.subjectPlaceholder} />
                                        </div>
                                        <textarea placeholder={pageData.messagePlaceholder} required></textarea>
                                        <button className="form-submit-btn-v2">
                                            {pageData.sendBtn}
                                            <span className="btn-arrow">→</span>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ADVERTISING CONTENT */}
                {pageKey === 'ads' && (
                    <div className="ads-rich-layout">
                        <section className="ads-hero-text">
                            <p className="lead-text">{pageData.content}</p>
                        </section>

                        <h3 className="sub-section-title">{lang === 'az' ? 'Reklam Formatları' : 'Advertising Formats'}</h3>
                        <div className="ads-formats-grid">
                            {pageData.formats.map((f: any, i: number) => (
                                <div key={i} className="format-card">
                                    <div className="format-icon">✦</div>
                                    <h4>{f.t}</h4>
                                    <p>{f.d}</p>
                                </div>
                            ))}
                        </div>

                        <div className="ads-analytics-section">
                            <h3 className="sub-section-title">{pageData.statsTitle}</h3>
                            <div className="analytics-grid">
                                {pageData.audience.map((a: any, i: number) => (
                                    <div key={i} className="analytics-card">
                                        <span className="a-val">{a.val}</span>
                                        <span className="a-label">{a.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="ads-final-cta">
                            <div className="cta-content">
                                <h2>{lang === 'az' ? 'Kampaniyanıza bu gün başlayın' : 'Start your campaign today'}</h2>
                                <p>{lang === 'az' ? 'Ekspertlərimiz sizə ən uyğun paketi seçməkdə kömək edəcək.' : 'Our experts will help you choose the best package.'}</p>
                                <a href={`mailto:${pageData.email}`} className="cta-email-btn">{pageData.email}</a>
                            </div>
                        </div>
                    </div>
                )}

                {/* TERMS CONTENT */}
                {pageKey === 'terms' && (
                    <div className="terms-rich-layout">
                        <div className="terms-container">
                            <p className="terms-intro-v2">{pageData.content}</p>
                            <div className="terms-accordion">
                                {pageData.sections.map((s: any, i: number) => (
                                    <div key={i} className="terms-item-v2">
                                        <div className="terms-h-row">
                                            <span className="t-num">0{i+1}</span>
                                            <h4>{s.h}</h4>
                                        </div>
                                        <div className="terms-p-content">
                                            <p>{s.p}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default StaticPageContent;
