import { Button } from "@/components/ui/button";
import Title from "@/components/ui/title";
import { useTheme } from "@/hooks/use-theme";
import { showAlert } from "@/lib/catch-async-api";
import { baseColors } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { updateThemeFn } from "@/services/admin/theme-service";
import { CheckIcon, Moon, Sun } from "lucide-react";

export default function AdminThemeCustomizer() {
    const { setColor, theme, color: globalColor, setTheme } = useTheme();

    const handleThemeChange = (color) => {
        updateThemeFn({ theme_color: color, theme_mod: theme })
            .then((data) => {
                setColor(color);
                showAlert(data);
            })
    };

    const handleThemeToggle = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        updateThemeFn({ theme_color: globalColor, theme_mod: newTheme })
            .then((data) => {
                setTheme(newTheme);
                showAlert(data);
            })
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <Title title="Themes" />
                <Button
                    variant="outline"
                    size="icon"
                    aria-label="Toggle theme"
                    onClick={handleThemeToggle}
                >
                    <Sun className={`h-[1.2rem] w-[1.2rem] ${theme === 'light' ? 'block' : 'hidden'}`} />
                    <Moon className={`h-[1.2rem] w-[1.2rem] ${theme === 'dark' ? 'block' : 'hidden'}`} />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
                {baseColors.map((baseColor) => {
                    const isActive = baseColor.name === globalColor;

                    return (
                        <Button
                            key={baseColor.name}
                            onClick={() => handleThemeChange(baseColor.name)}
                            variant="ghost"
                            className={cn(
                                "flex items-center justify-start border transition-colors duration-300 hover:border-primary focus:outline-none shadow-md",
                                isActive ? "border-primary ring-2 ring-offset-2 ring-primary" : "border-gray-300"
                            )}
                            aria-pressed={isActive}
                            aria-label={`Select ${baseColor.label} color`}
                        >
                            <span
                                className={cn(
                                    "flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300",
                                    isActive ? "ring-2 ring-offset-2 ring-primary" : ""
                                )}
                                style={{
                                    backgroundColor: `hsl(${baseColor.activeColor[theme]})`,
                                }}
                            >
                                {isActive && <CheckIcon className="h-5 w-5 text-white" />}
                            </span>
                            <span className="ml-2 font-medium">{baseColor.label}</span>
                        </Button>
                    );
                })}
            </div>
        </>
    );
}
