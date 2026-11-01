"use client";

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
	type ChevronProps,
	DayPicker,
	type DayPickerProps,
	getDefaultClassNames,
} from "react-day-picker";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	...props
}: DayPickerProps) {
	const defaultClassNames = getDefaultClassNames();

	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn("p-3", className)}
			classNames={{
				months: cn("flex flex-col gap-4 sm:flex-row", defaultClassNames.months),
				month: cn("space-y-4", defaultClassNames.month),
				month_caption: cn(
					"relative flex items-center justify-center pt-1",
					defaultClassNames.month_caption,
				),
				caption_label: cn(
					"text-sm font-medium",
					defaultClassNames.caption_label,
				),
				nav: cn("flex items-center gap-1", defaultClassNames.nav),
				button_previous: cn(
					buttonVariants({ variant: "ghost", size: "icon" }),
					"absolute left-1 size-7 bg-transparent p-0 opacity-70 hover:opacity-100",
					defaultClassNames.button_previous,
				),
				button_next: cn(
					buttonVariants({ variant: "ghost", size: "icon" }),
					"absolute right-1 size-7 bg-transparent p-0 opacity-70 hover:opacity-100",
					defaultClassNames.button_next,
				),
				month_grid: cn(
					"w-full border-collapse space-y-1",
					defaultClassNames.month_grid,
				),
				weekdays: cn("flex", defaultClassNames.weekdays),
				weekday: cn(
					"w-9 text-[0.8rem] font-normal text-muted-foreground",
					defaultClassNames.weekday,
				),
				week: cn("mt-2 flex w-full", defaultClassNames.week),
				day: cn(
					"relative size-9 p-0 text-center text-sm",
					"[&.rdp-range_start]:rounded-l-md [&.rdp-range_end]:rounded-r-md",
					"[&.rdp-range_start]:bg-accent [&.rdp-range_middle]:bg-accent [&.rdp-range_end]:bg-accent",
					"[&.rdp-selected:not(.rdp-range_start):not(.rdp-range_middle):not(.rdp-range_end)>button]:bg-foreground",
					"[&.rdp-selected:not(.rdp-range_start):not(.rdp-range_middle):not(.rdp-range_end)>button]:text-background",
					"[&.rdp-range_start>button]:bg-foreground [&.rdp-range_start>button]:text-background",
					"[&.rdp-range_end>button]:bg-foreground [&.rdp-range_end>button]:text-background",
					"[&.rdp-range_middle>button]:bg-transparent [&.rdp-range_middle>button]:text-accent-foreground",
					"[&.rdp-outside.rdp-selected]:bg-accent/50 [&.rdp-outside.rdp-selected>button]:text-foreground",
					defaultClassNames.day,
				),
				day_button: cn(
					buttonVariants({ variant: "ghost" }),
					"size-9 rounded-md p-0 font-normal hover:bg-transparent focus:bg-transparent aria-selected:opacity-100",
					defaultClassNames.day_button,
				),
				selected: cn(defaultClassNames.selected),
				today: cn("font-semibold text-foreground", defaultClassNames.today),
				outside: cn(
					"text-muted-foreground opacity-50",
					defaultClassNames.outside,
				),
				disabled: cn(
					"text-muted-foreground opacity-50",
					defaultClassNames.disabled,
				),
				range_start: cn(defaultClassNames.range_start),
				range_middle: cn(defaultClassNames.range_middle),
				range_end: cn(defaultClassNames.range_end),
				hidden: cn("invisible", defaultClassNames.hidden),
				...classNames,
			}}
			components={{
				Chevron: ({
					className: iconClassName,
					orientation,
					size = 16,
				}: ChevronProps) => {
					if (orientation === "left") {
						return (
							<ChevronLeft
								className={cn("size-4", iconClassName)}
								size={size}
							/>
						);
					}

					if (orientation === "right") {
						return (
							<ChevronRight
								className={cn("size-4", iconClassName)}
								size={size}
							/>
						);
					}

					return (
						<ChevronDown className={cn("size-4", iconClassName)} size={size} />
					);
				},
			}}
			{...props}
		/>
	);
}

export { Calendar };
