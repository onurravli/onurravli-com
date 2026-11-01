/** "2025-03-14" → "Mar 14, 2025"; anything unparseable is returned as-is. */
export function formatPostDate(date: string): string {
	const parsed = new Date(date);
	if (Number.isNaN(parsed.getTime())) return date;
	return parsed.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		timeZone: "UTC",
	});
}

/** Whole minutes, never below one. */
export function formatReadingTime(minutes: number): string {
	return `${Math.max(1, Math.round(minutes))} min read`;
}

/** `mailto:me@x.com?subject=…` → `me@x.com`. */
export function emailFromMailto(href: string): string | undefined {
	if (!href.toLowerCase().startsWith("mailto:")) return undefined;
	return href.slice("mailto:".length).split("?")[0];
}
