"use client";

import { useTheme } from "next-themes";
import * as LucideIcons from "lucide-react";

// Fallback to Lucide if DIcons is not working as expected or missing in the env
const SunIcon = LucideIcons.Sun;
const MoonIcon = LucideIcons.Moon;
const ArrowUpIcon = LucideIcons.ArrowUp;

function handleScrollTop() {
    window.scroll({
        top: 0,
        behavior: "smooth",
    });
}

const ThemeToggle = () => {
    const { setTheme } = useTheme();

    return (
        <div className="flex items-center justify-center">
            <div className="flex items-center rounded-full border border-dotted border-slate-300 dark:border-slate-700 p-1">
                <button
                    onClick={() => setTheme("light")}
                    className="bg-black mr-3 rounded-full p-2 text-white dark:bg-slate-800 dark:text-white hover:opacity-80 transition-opacity"
                >
                    <SunIcon className="h-5 w-5" strokeWidth={1.5} />
                    <span className="sr-only">Light</span>
                </button>

                <button
                    type="button"
                    onClick={handleScrollTop}
                    className="hover:scale-110 transition-transform"
                >
                    <ArrowUpIcon className="h-4 w-4" />
                    <span className="sr-only">Top</span>
                </button>

                <button
                    onClick={() => setTheme("dark")}
                    className="dark:bg-black ml-3 rounded-full p-2 text-black dark:text-white border border-transparent dark:border-slate-700 hover:opacity-80 transition-opacity"
                >
                    <MoonIcon className="h-5 w-5" strokeWidth={1.5} />
                    <span className="sr-only">Dark</span>
                </button>
            </div>
        </div>
    );
};

export default ThemeToggle;
