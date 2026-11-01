"use client";

import { Laptop, Loader2, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { type Theme, useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

const NEXT: Record<Theme, Theme> = {
	dark: "light",
	light: "system",
	system: "dark",
};
const ICONS = { dark: Moon, light: Sun, system: Laptop };

/** Cycles dark → light → system. */
export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	const Icon = mounted ? ICONS[theme] : Loader2;

	return (
		<Button
			variant="outline"
			size="icon"
			onClick={() => setTheme(NEXT[theme])}
			disabled={!mounted}
		>
			<Icon
				className={
					mounted
						? "h-[1.2rem] w-[1.2rem]"
						: "h-[1.2rem] w-[1.2rem] animate-spin"
				}
			/>
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
