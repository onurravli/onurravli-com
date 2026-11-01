"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { type AccentColorKey, accentColors } from "@/lib/accent-colors";
import { cn } from "@/lib/utils";
import { saveAccentColor } from "../actions";

export function AccentColorPicker({ current }: { current: AccentColorKey }) {
	const [isPending, startTransition] = useTransition();

	function select(key: AccentColorKey) {
		if (key === current || isPending) return;
		startTransition(async () => {
			try {
				await saveAccentColor(key);
				toast.success("Accent color updated", {
					description: `${accentColors[key].name} is now active.`,
				});
			} catch {
				toast.error("Failed to update accent color", {
					description: "Please try again.",
				});
			}
		});
	}

	return (
		<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
			{(Object.keys(accentColors) as AccentColorKey[]).map((key) => {
				const color = accentColors[key];
				const isActive = key === current;
				return (
					<button
						key={key}
						type="button"
						disabled={isPending}
						onClick={() => select(key)}
						className={cn(
							"group flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed",
							isActive
								? "border-foreground shadow-md"
								: "border-border hover:border-muted-foreground",
						)}
					>
						<div
							className="h-10 w-full rounded-md"
							style={{ backgroundColor: color.colors[500] }}
						/>
						<div className="flex w-full items-center justify-between gap-1">
							<span className="truncate text-xs font-medium text-foreground">
								{color.name}
							</span>
							{isActive && (
								<span className="shrink-0 text-xs font-semibold text-muted-foreground">
									✓
								</span>
							)}
						</div>
					</button>
				);
			})}
		</div>
	);
}
