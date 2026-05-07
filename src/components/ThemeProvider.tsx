"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme | undefined;
  setTheme: (theme: Theme) => void;
  resolvedTheme: Theme | undefined;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme | undefined>(undefined);

  useEffect(() => {
    // 1. Check localStorage
    const savedTheme = localStorage.getItem("theme") as Theme;
    
    // 2. Check document class (set by layout.tsx script)
    const hasDarkClass = document.documentElement.classList.contains("dark");
    const hasLightClass = document.documentElement.classList.contains("light-mode");
    
    let initialTheme: Theme = "light"; // Default fallback
    
    if (savedTheme) {
      initialTheme = savedTheme;
    } else if (hasDarkClass) {
      initialTheme = "dark";
    } else if (hasLightClass) {
      initialTheme = "light";
    }
    
    setThemeState(initialTheme);
    
    // Ensure the classes are correctly applied based on the determined theme
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light-mode");
    } else {
      document.documentElement.classList.add("light-mode");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light-mode");
    } else {
      document.documentElement.classList.add("light-mode");
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme: theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
