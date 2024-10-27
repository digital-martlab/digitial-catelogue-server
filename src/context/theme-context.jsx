import { createContext, useEffect, useMemo, useState } from "react";
import { baseColors } from "@/lib/colors";
import { defaultTheme } from "@/lib/constants";

export const ThemeContext = createContext();

export function ThemeProvider({ children, ...props }) {
    const [color, setColor] = useState(defaultTheme.color);
    const [theme, setTheme] = useState(defaultTheme.mod);

    const styles = useMemo(() => {
        const selectedColor = baseColors.find((c) => c.name === color);
        const cssVars = selectedColor?.cssVars[theme] || {};

        return {
            "--background": cssVars.background,
            "--foreground": cssVars.foreground,
            "--card": cssVars.card,
            "--card-foreground": cssVars["card-foreground"],
            "--popover": cssVars.popover,
            "--popover-foreground": cssVars["popover-foreground"],
            "--primary": cssVars.primary,
            "--primary-foreground": cssVars["primary-foreground"],
            "--secondary": cssVars.secondary,
            "--secondary-foreground": cssVars["secondary-foreground"],
            "--muted": cssVars.muted,
            "--muted-foreground": cssVars["muted-foreground"],
            "--accent": cssVars.accent,
            "--accent-foreground": cssVars["accent-foreground"],
            "--destructive": cssVars.destructive,
            "--destructive-foreground": cssVars["destructive-foreground"],
            "--border": cssVars.border,
            "--input": cssVars.input,
            "--ring": cssVars.ring,
            "--chart-1": cssVars["chart-1"],
            "--chart-2": cssVars["chart-2"],
            "--chart-3": cssVars["chart-3"],
            "--chart-4": cssVars["chart-4"],
            "--chart-5": cssVars["chart-5"],
        };
    }, [color, theme]);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
    }, [theme]);

    const value = {
        theme,
        color,
        setTheme,
        setColor,
    };

    return (
        <ThemeContext.Provider value={value} {...props}>
            <main style={styles}>
                {children}
            </main>
        </ThemeContext.Provider>
    );
}
