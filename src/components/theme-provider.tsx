"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

export type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

/**
 * Blocking script for <head> that applies the stored theme before first paint,
 * so there is no flash. Rendered by the server layout as an inline script.
 */
export const THEME_SCRIPT = `(function(){try{var d=document.documentElement,t=localStorage.getItem("${STORAGE_KEY}")||"system",r=t==="system"?(matchMedia("${DARK_QUERY}").matches?"dark":"light"):t;d.classList.remove("light","dark");d.classList.add(r);d.style.colorScheme=r}catch(e){}})();`;

interface ThemeContextValue {
	theme: Theme;
	resolvedTheme: ResolvedTheme;
	setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolve(theme: Theme): ResolvedTheme {
	if (theme !== "system") return theme;
	return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

function apply(resolved: ResolvedTheme) {
	const root = document.documentElement;
	root.classList.remove("light", "dark");
	root.classList.add(resolved);
	root.style.colorScheme = resolved;
}

function readStored(): Theme {
	try {
		const value = localStorage.getItem(STORAGE_KEY);
		return value === "light" || value === "dark" ? value : "system";
	} catch {
		return "system";
	}
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setThemeState] = useState<Theme>("system");
	const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

	// The server can't read localStorage; pick up the stored choice after mount
	// and follow changes made in other tabs.
	useEffect(() => {
		setThemeState(readStored());
		const onStorage = (event: StorageEvent) => {
			if (event.key === STORAGE_KEY) setThemeState(readStored());
		};
		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, []);

	// Apply the theme, and track the OS setting while on "system".
	useEffect(() => {
		const update = () => {
			const resolved = resolve(theme);
			setResolvedTheme(resolved);
			apply(resolved);
		};
		update();
		if (theme !== "system") return;
		const media = window.matchMedia(DARK_QUERY);
		media.addEventListener("change", update);
		return () => media.removeEventListener("change", update);
	}, [theme]);

	const setTheme = useCallback((next: Theme) => {
		try {
			localStorage.setItem(STORAGE_KEY, next);
		} catch {}
		setThemeState(next);
	}, []);

	const value = useMemo(
		() => ({ theme, resolvedTheme, setTheme }),
		[theme, resolvedTheme, setTheme],
	);

	return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) throw new Error("useTheme must be used within ThemeProvider");
	return context;
}
