import { Locale } from "./translations";

export function formatPostDate(dateStr: string, lang: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    
    const isToday = date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear();

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;

    if (isToday) {
        if (lang === 'az') return `Bu gün / ${timeStr}`;
        if (lang === 'ru') return `Сегодня / ${timeStr}`;
        return `Today / ${timeStr}`;
    }

    if (isYesterday) {
        if (lang === 'az') return `Dünən / ${timeStr}`;
        if (lang === 'ru') return `Вчера / ${timeStr}`;
        return `Yesterday / ${timeStr}`;
    }

    // Default format: 2026-04-16 06:13
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day} ${timeStr}`;
}
