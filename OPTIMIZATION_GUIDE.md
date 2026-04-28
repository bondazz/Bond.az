# Bond.az Performance & SEO Optimization Guide

This guide serves as the master blueprint for all current and future page development on Bond.az to ensure maximum performance, perfect SEO, and top-tier PageSpeed scores.

## 1. Image Optimization Standards

### A. Next.js Image Component
*   **Always** use the `next/image` component.
*   **Priority (LCP):** Apply `priority={true}` and `fetchPriority="high"` (via `priority` prop) to the first 1-2 images visible on any page.
*   **Lazy Loading:** Ensure images below the fold use `loading="lazy"` (default behavior).
*   **Responsive Sizes:** Always provide a `sizes` attribute to prevent the browser from downloading a 800px image for a 300px mobile container.
    *   Example: `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`
*   **Format:** Prefer WebP or AVIF. Our Sharp pipeline already converts R2 images to WebP.

### B. Local Assets
*   **Banner Ads:** Convert large PNGs/JPEGs in `public/` to WebP with high compression.
*   **Dimensions:** Ensure assets match the container size to avoid "Large image for displayed dimensions" warnings.

## 2. Technical SEO & Crawling

### A. Robots & Sitemap
*   Maintain `src/app/robots.ts` and `src/app/sitemap.ts`.
*   Ensure all dynamic routes (posts, categories) are included in the sitemap with appropriate `changeFrequency`.

### B. Metadata
*   Every page must have a `generateMetadata` function.
*   Include OpenGraph and Twitter tags.
*   Ensure `alternates.languages` covers all supported locales (AZ, EN, RU).

## 3. Security & Headers

### A. Content Security Policy (CSP)
*   **Whitelist:** Ensure all external resources (Google Fonts, Analytics, R2) are whitelisted.
*   **Directives:**
    *   `script-src`: Allow GTM/GA and 'self'.
    *   `font-src`: Must allow `https://fonts.gstatic.com`.
    *   `connect-src`: Must allow Supabase and R2 domains.

## 4. Web Accessibility (A11Y)

### A. Contrast & ARIA
*   **Logo/Text:** Maintain a contrast ratio of at least 4.5:1.
*   **ARIA Roles:** Do not use `aria-*` attributes on elements that don't support them (e.g., `div` without a role).
*   **Interactive Elements:** Ensure buttons have labels and clear states.

## 5. Network Performance

### A. Preconnecting
*   Add `<link rel="preconnect">` for critical origins like Google Fonts and R2.

### B. Minification
*   Keep `compress: true` in `next.config.ts`.
*   Avoid large inline styles/scripts.
