"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { DateRange as CalendarDateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { PRESET_DAYS, type PresetDays } from "@/lib/analytics/range";
import { cn } from "@/lib/utils";

const PRESET_LABELS: Record<PresetDays, string> = {
	1: "1d",
	30: "30d",
	90: "90d",
	365: "1y",
};

function parseSelectedDate(value?: string): Date | undefined {
	if (!value) return undefined;

	const date = new Date(`${value}T12:00:00`);
	return Number.isNaN(date.getTime()) ? undefined : date;
}

function formatSelectedDate(value?: string): string {
	const date = parseSelectedDate(value);
	return date ? format(date, "MMM d, yyyy") : "";
}

export function RangeSelector({
	current,
	customStart,
	customEnd,
}: {
	current: PresetDays | null;
	customStart?: string;
	customEnd?: string;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState<CalendarDateRange | undefined>({
		from: parseSelectedDate(customStart),
		to: parseSelectedDate(customEnd),
	});

	useEffect(() => {
		setSelected({
			from: parseSelectedDate(customStart),
			to: parseSelectedDate(customEnd),
		});
	}, [customEnd, customStart]);

	const customLabel =
		customStart && customEnd
			? `${formatSelectedDate(customStart)} - ${formatSelectedDate(customEnd)}`
			: "Custom";

	const navigateWithParams = (mutate: (params: URLSearchParams) => void) => {
		const params = new URLSearchParams(searchParams.toString());
		mutate(params);
		router.push(`${pathname}?${params.toString()}`);
	};

	return (
		<div className="flex flex-wrap items-center justify-end gap-1">
			{PRESET_DAYS.map((value) => (
				<button
					type="button"
					key={value}
					onClick={() => {
						setOpen(false);
						navigateWithParams((params) => {
							params.set("range", String(value));
							params.delete("start");
							params.delete("end");
						});
					}}
					className={cn(
						"px-2 py-0.5 text-xs rounded transition-colors",
						current === value
							? "bg-foreground text-background font-medium"
							: "text-muted-foreground hover:text-foreground",
					)}
				>
					{PRESET_LABELS[value]}
				</button>
			))}
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						size="sm"
						className={cn(
							"h-6 rounded px-2 text-xs font-normal shadow-none text-foreground",
							current === null &&
								"border-foreground bg-foreground text-background hover:bg-foreground hover:text-background dark:border-foreground dark:bg-foreground dark:text-background dark:hover:bg-foreground dark:hover:text-background",
						)}
					>
						<CalendarIcon className="size-3.5" />
						{customLabel}
					</Button>
				</PopoverTrigger>
				<PopoverContent align="end" className="w-auto p-0">
					<div className="border-b px-4 py-3">
						<p className="text-sm font-medium">Custom range</p>
						<p className="text-xs text-muted-foreground">
							Select a start and end date.
						</p>
					</div>
					<Calendar
						mode="range"
						defaultMonth={selected?.to ?? selected?.from}
						selected={selected}
						onSelect={setSelected}
						numberOfMonths={2}
						className="max-sm:[&_.rdp-months]:flex-col"
					/>
					<div className="flex items-center justify-between gap-3 border-t px-4 py-3">
						<div className="text-xs text-muted-foreground">
							{selected?.from && selected?.to
								? `${format(selected.from, "MMM d, yyyy")} - ${format(
										selected.to,
										"MMM d, yyyy",
									)}`
								: "Choose two dates"}
						</div>
						<div className="flex items-center gap-2">
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => {
									setSelected({
										from: parseSelectedDate(customStart),
										to: parseSelectedDate(customEnd),
									});
									setOpen(false);
								}}
							>
								Cancel
							</Button>
							<Button
								type="button"
								size="sm"
								disabled={!selected?.from || !selected?.to}
								onClick={() => {
									if (!selected?.from || !selected?.to) return;

									const start = format(selected.from, "yyyy-MM-dd");
									const end = format(selected.to, "yyyy-MM-dd");
									navigateWithParams((params) => {
										params.delete("range");
										params.set("start", start);
										params.set("end", end);
									});
									setOpen(false);
								}}
							>
								Apply
							</Button>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
