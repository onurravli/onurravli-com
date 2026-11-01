"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

/**
 * Flips between light and dark. Both icons are rendered and swapped with the
 * `.dark` class, so the button is correct on first paint without waiting for
 * hydration.
 */
export function ThemeSwitch() {
	const { resolvedTheme, setTheme } = useTheme();

	return (
		<button
			type="button"
			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
			aria-label="Toggle color theme"
			title="Toggle color theme"
			className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
		>
			<Sun className="size-4 dark:hidden" />
			<Moon className="hidden size-4 dark:block" />
		</button>
	);
}
