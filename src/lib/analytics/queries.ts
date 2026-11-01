import "server-only";
import { clickhouse } from "@/lib/clickhouse";
import type { AnalyticsRange } from "./range";

export interface DayStat {
	date: string;
	views: number;
	sessions: number;
}

interface TopPage {
	path: string;
	views: number;
	sessions: number;
}

export interface CountRow {
	label: string;
	count: number;
}

interface Overview {
	views: number;
	sessions: number;
	avgDailyViews: number;
}

/** WHERE clause for the range; values are bound as query parameters. */
function rangeFilter(range: AnalyticsRange) {
	return range.kind === "preset"
		? {
				sql: "timestamp >= now() - INTERVAL {days:UInt32} DAY",
				params: { days: range.days },
			}
		: {
				sql: "timestamp >= toDateTime({start:Date}) AND timestamp < toDateTime({end:Date}) + INTERVAL 1 DAY",
				params: { start: range.start, end: range.end },
			};
}

async function select<T>(
	range: AnalyticsRange,
	build: (where: string) => string,
): Promise<T[]> {
	const filter = rangeFilter(range);
	const result = await clickhouse().query({
		query: build(filter.sql),
		query_params: filter.params,
		format: "JSONEachRow",
		// Return 64-bit integers as JSON numbers instead of strings.
		clickhouse_settings: { output_format_json_quote_64bit_integers: 0 },
	});
	return result.json<T>();
}

export async function getOverview(range: AnalyticsRange): Promise<Overview> {
	const [row] = await select<{ views: number; sessions: number }>(
		range,
		(where) => `
      SELECT count() AS views, uniq(session_id) AS sessions
      FROM page_views WHERE ${where}`,
	);
	return {
		views: row.views,
		sessions: row.sessions,
		avgDailyViews: Math.round(row.views / range.days),
	};
}

export const getTimeseries = (range: AnalyticsRange) =>
	select<DayStat>(
		range,
		(where) => `
      SELECT toString(toDate(timestamp)) AS date, count() AS views, uniq(session_id) AS sessions
      FROM page_views WHERE ${where}
      GROUP BY date ORDER BY date`,
	);

export const getTopPages = (range: AnalyticsRange) =>
	select<TopPage>(
		range,
		(where) => `
      SELECT path, count() AS views, uniq(session_id) AS sessions
      FROM page_views WHERE ${where}
      GROUP BY path ORDER BY views DESC LIMIT 10`,
	);

export const getTopReferrers = (range: AnalyticsRange) =>
	select<CountRow>(
		range,
		(where) => `
      SELECT domain(referrer) AS label, count() AS count
      FROM page_views WHERE referrer != '' AND ${where}
      GROUP BY label HAVING label != '' ORDER BY count DESC LIMIT 10`,
	);

export const getUtmSources = (range: AnalyticsRange) =>
	select<CountRow>(
		range,
		(where) => `
      SELECT utm_source AS label, count() AS count
      FROM page_views WHERE utm_source != '' AND ${where}
      GROUP BY label ORDER BY count DESC LIMIT 10`,
	);

export const getCountries = (range: AnalyticsRange) =>
	select<CountRow>(
		range,
		(where) => `
      SELECT if(country = '', 'Unknown', country) AS label, count() AS count
      FROM page_views WHERE ${where}
      GROUP BY label ORDER BY count DESC LIMIT 10`,
	);

export const getBrowsers = (range: AnalyticsRange) =>
	select<CountRow>(
		range,
		(where) => `
      SELECT browser AS label, count() AS count
      FROM page_views WHERE ${where}
      GROUP BY label ORDER BY count DESC`,
	);

export const getDevices = (range: AnalyticsRange) =>
	select<CountRow>(
		range,
		(where) => `
      SELECT device_type AS label, count() AS count
      FROM page_views WHERE ${where}
      GROUP BY label ORDER BY count DESC`,
	);

export const getEvents = (range: AnalyticsRange) =>
	select<CountRow>(
		range,
		(where) => `
      SELECT event_name AS label, count() AS count
      FROM events WHERE ${where}
      GROUP BY label ORDER BY count DESC`,
	);

export const getNavClicks = (range: AnalyticsRange) =>
	select<CountRow>(
		range,
		(where) => `
      SELECT JSONExtractString(metadata, 'section') AS label, count() AS count
      FROM events WHERE event_name = 'nav_click' AND ${where}
      GROUP BY label ORDER BY count DESC`,
	);
