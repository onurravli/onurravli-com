/** Coarse browser / OS / device classification for analytics breakdowns. */
export function parseUserAgent(ua: string) {
	return {
		browser: firstMatch(ua, [
			[/Edg\//, "Edge"],
			[/OPR\/|Opera/, "Opera"],
			[/Chrome\//, "Chrome"],
			[/Firefox\//, "Firefox"],
			[/Safari\//, "Safari"],
		]),
		os: firstMatch(ua, [
			[/Windows/, "Windows"],
			[/Android/, "Android"],
			[/iPhone|iPad/, "iOS"],
			[/Mac OS X/, "macOS"],
			[/Linux/, "Linux"],
		]),
		device_type: /Mobile|Android|iPhone/.test(ua)
			? "mobile"
			: /iPad|Tablet/.test(ua)
				? "tablet"
				: "desktop",
	};
}

function firstMatch(ua: string, rules: [RegExp, string][]) {
	return rules.find(([pattern]) => pattern.test(ua))?.[1] ?? "Other";
}
