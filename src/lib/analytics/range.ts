export const PRESET_DAYS = [1, 30, 90, 365] as const;
export type PresetDays = (typeof PRESET_DAYS)[number];

const PRESET_LABELS: Record<PresetDays, string> = {
	1: "last 24 hours",
	30: "last 30 days",
	90: "last 90 days",
	365: "last year",
};

/** A rolling preset window, or whole UTC days from `start` to `end` inclusive. */
export type AnalyticsRange =
	| { kind: "preset"; days: PresetDays }
	| { kind: "custom"; start: string; end: string; days: number };

interface ResolvedRange {
	range: AnalyticsRange;
	label: string;
}

const DAY_MS = 86_400_000;

function parseIsoDate(value: unknown): Date | null {
	if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
		return null;
	}
	const date = new Date(`${value}T00:00:00Z`);
	// Rejects overflowing dates such as 2025-02-31.
	return date.toISOString().startsWith(value) ? date : null;
}

const formatDay = (date: Date, withYear: boolean) =>
	date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		...(withYear && { year: "numeric" }),
		timeZone: "UTC",
	});

function customLabel(start: Date, end: Date): string {
	if (start.getTime() === end.getTime()) return formatDay(start, true);
	const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
	return `${formatDay(start, !sameYear)} - ${formatDay(end, true)}`;
}

/** Turns `?range=` / `?start=&end=` search params into a query range. */
export function resolveRange(params: {
	range?: unknown;
	start?: unknown;
	end?: unknown;
}): ResolvedRange {
	const start = parseIsoDate(params.start);
	const end = parseIsoDate(params.end);
	if (start && end && start <= end) {
		return {
			range: {
				kind: "custom",
				start: start.toISOString().slice(0, 10),
				end: end.toISOString().slice(0, 10),
				days: (end.getTime() - start.getTime()) / DAY_MS + 1,
			},
			label: customLabel(start, end),
		};
	}

	const requested = Number(params.range);
	const days = PRESET_DAYS.find((preset) => preset === requested) ?? 1;
	return { range: { kind: "preset", days }, label: PRESET_LABELS[days] };
}
