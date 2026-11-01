import {
	Activity,
	Globe,
	Monitor,
	MousePointerClick,
	TrendingUp,
	Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	getBrowsers,
	getCountries,
	getDevices,
	getEvents,
	getNavClicks,
	getOverview,
	getTimeseries,
	getTopPages,
	getTopReferrers,
	getUtmSources,
} from "@/lib/analytics/queries";
import { resolveRange } from "@/lib/analytics/range";
import { BarList } from "../_components/analytics/bar-list";
import { LiveCounter } from "../_components/analytics/live-counter";
import { PageviewsChart } from "../_components/analytics/pageviews-chart";
import { RangeSelector } from "../_components/analytics/range-selector";

export default async function AnalyticsPage({
	searchParams,
}: {
	searchParams: Promise<{ range?: string; start?: string; end?: string }>;
}) {
	const { range, label } = resolveRange(await searchParams);

	const [
		overview,
		timeseries,
		topPages,
		referrers,
		utmSources,
		countries,
		browsers,
		devices,
		events,
		navClicks,
	] = await Promise.all([
		getOverview(range),
		getTimeseries(range),
		getTopPages(range),
		getTopReferrers(range),
		getUtmSources(range),
		getCountries(range),
		getBrowsers(range),
		getDevices(range),
		getEvents(range),
		getNavClicks(range),
	]);

	const statCards = [
		{ label: "Page Views", value: overview.views, icon: Activity },
		{ label: "Unique Sessions", value: overview.sessions, icon: Users },
		{
			label: "Avg Daily Views",
			value: overview.avgDailyViews,
			icon: TrendingUp,
		},
	];

	return (
		<div>
			<div className="mb-8 flex items-start justify-between gap-4">
				<p className="text-sm text-muted-foreground">
					{label} · anonymous data only
				</p>
				<RangeSelector
					current={range.kind === "preset" ? range.days : null}
					customStart={range.kind === "custom" ? range.start : undefined}
					customEnd={range.kind === "custom" ? range.end : undefined}
				/>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
				{statCards.map(({ label: title, value, icon: Icon }) => (
					<Card key={title}>
						<CardHeader className="pb-2 pt-5 px-5">
							<div className="flex items-center justify-between">
								<CardTitle className="text-sm font-medium text-muted-foreground">
									{title}
								</CardTitle>
								<Icon className="size-4 text-muted-foreground" />
							</div>
						</CardHeader>
						<CardContent className="px-5 pb-5">
							<p className="text-3xl font-bold">{value.toLocaleString()}</p>
							<p className="text-xs text-muted-foreground mt-1">{label}</p>
						</CardContent>
					</Card>
				))}
				<LiveCounter />
			</div>
			<Card className="mb-6">
				<CardHeader className="px-5 pt-5 pb-2">
					<CardTitle className="text-sm font-medium">
						Page Views Over Time
					</CardTitle>
					<p className="text-xs text-muted-foreground">
						<span className="inline-flex items-center gap-1">
							<span className="w-4 h-0.5 bg-primary inline-block" /> views
						</span>
						<span className="inline-flex items-center gap-1 ml-3">
							<span className="w-4 h-0.5 bg-muted-foreground inline-block border-dashed border-t" />{" "}
							sessions
						</span>
					</p>
				</CardHeader>
				<CardContent className="px-5 pb-5">
					<PageviewsChart data={timeseries} />
				</CardContent>
			</Card>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				<Card>
					<CardHeader className="px-5 pt-5 pb-3">
						<div className="flex items-center gap-2">
							<Globe className="size-4 text-muted-foreground" />
							<CardTitle className="text-sm font-medium">Top Pages</CardTitle>
						</div>
					</CardHeader>
					<CardContent className="px-5 pb-5">
						<div className="flex flex-col gap-1.5 text-sm">
							<div className="flex text-xs text-muted-foreground mb-1 px-1">
								<span className="flex-1">Path</span>
								<span>Views</span>
								<span className="ml-4">Sessions</span>
							</div>
							{topPages.map((p) => (
								<div
									key={p.path}
									className="flex items-center gap-2 px-1 py-1 rounded hover:bg-muted/50 transition-colors"
								>
									<span className="flex-1 truncate font-mono text-xs">
										{p.path}
									</span>
									<span className="text-xs text-foreground font-medium w-10 text-right">
										{p.views.toLocaleString()}
									</span>
									<span className="text-xs text-muted-foreground w-14 text-right">
										{p.sessions.toLocaleString()}
									</span>
								</div>
							))}
							{topPages.length === 0 && (
								<p className="text-xs text-muted-foreground text-center py-4">
									No data yet
								</p>
							)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="px-5 pt-5 pb-3">
						<div className="flex items-center gap-2">
							<MousePointerClick className="size-4 text-muted-foreground" />
							<CardTitle className="text-sm font-medium">Events</CardTitle>
						</div>
					</CardHeader>
					<CardContent className="px-5 pb-5 space-y-5">
						<BarList rows={events} valueLabel="events" />
						{navClicks.length > 0 && (
							<>
								<p className="text-xs font-medium text-muted-foreground pt-2 border-t border-border">
									Nav clicks by section
								</p>
								<BarList rows={navClicks} valueLabel="clicks" />
							</>
						)}
					</CardContent>
				</Card>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				<Card>
					<CardHeader className="px-5 pt-5 pb-3">
						<CardTitle className="text-sm font-medium">Top Referrers</CardTitle>
					</CardHeader>
					<CardContent className="px-5 pb-5">
						<BarList rows={referrers} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="px-5 pt-5 pb-3">
						<CardTitle className="text-sm font-medium">UTM Sources</CardTitle>
					</CardHeader>
					<CardContent className="px-5 pb-5">
						<BarList rows={utmSources} />
					</CardContent>
				</Card>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
				<Card>
					<CardHeader className="px-5 pt-5 pb-3">
						<div className="flex items-center gap-2">
							<Globe className="size-4 text-muted-foreground" />
							<CardTitle className="text-sm font-medium">Countries</CardTitle>
						</div>
					</CardHeader>
					<CardContent className="px-5 pb-5">
						<BarList rows={countries} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="px-5 pt-5 pb-3">
						<div className="flex items-center gap-2">
							<Monitor className="size-4 text-muted-foreground" />
							<CardTitle className="text-sm font-medium">Browsers</CardTitle>
						</div>
					</CardHeader>
					<CardContent className="px-5 pb-5">
						<BarList rows={browsers} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="px-5 pt-5 pb-3">
						<div className="flex items-center gap-2">
							<Monitor className="size-4 text-muted-foreground" />
							<CardTitle className="text-sm font-medium">Devices</CardTitle>
						</div>
					</CardHeader>
					<CardContent className="px-5 pb-5">
						<BarList rows={devices} />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
