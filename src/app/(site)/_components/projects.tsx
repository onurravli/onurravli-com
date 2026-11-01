import { ArrowUpRight, Lock, Star } from "lucide-react";
import { Suspense } from "react";
import { Section } from "@/components/site/section";
import {
	type ContributionDay,
	type GitHubStats,
	getGitHubStats,
	getProjects,
	type Project,
	type Week,
} from "@/lib/github";
import { cn } from "@/lib/utils";

function ProjectCard({ project }: { project: Project }) {
	const [owner] = project.fullName.split("/");

	return (
		<li>
			<a
				href={project.url}
				target="_blank"
				rel="noopener noreferrer"
				data-track="project_click"
				data-track-project={project.fullName}
				className="group flex h-full flex-col rounded-lg border border-border p-5 transition-colors hover:border-foreground/25 hover:bg-card"
			>
				<div className="flex items-start justify-between gap-3">
					<div className="min-w-0">
						<h3 className="truncate font-medium text-foreground">
							{project.name}
						</h3>
						<p className="mt-0.5 font-mono text-xs text-muted-foreground">
							{owner}
						</p>
					</div>
					<ArrowUpRight
						aria-hidden="true"
						className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
					/>
				</div>
				{project.description && (
					<p className="mt-3 line-clamp-3 text-sm leading-relaxed text-foreground/75">
						{project.description}
					</p>
				)}
				<div className="mt-auto flex items-center gap-4 pt-4 font-mono text-xs text-muted-foreground">
					{project.languages.length > 0 && (
						<span className="truncate">
							{project.languages.slice(0, 3).join(" · ")}
						</span>
					)}
					{project.stars > 0 && (
						<span className="ml-auto flex shrink-0 items-center gap-1">
							<Star aria-hidden="true" className="size-3" />
							{project.stars}
							<span className="sr-only">stars</span>
						</span>
					)}
				</div>
			</a>
		</li>
	);
}

const LEVELS = [
	"bg-foreground/[0.07]",
	"bg-theme-200 dark:bg-theme-900",
	"bg-theme-400 dark:bg-theme-700",
	"bg-theme-600 dark:bg-theme-500",
	"bg-theme-800 dark:bg-theme-300",
];

function level(count: number): number {
	if (count === 0) return 0;
	if (count <= 2) return 1;
	if (count <= 5) return 2;
	if (count <= 9) return 3;
	return 4;
}

const MONTHS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

/** Month labels placed on the first week that reaches a new month. */
function monthLabels(weeks: Week[]) {
	const labels: { column: number; name: string }[] = [];
	let previous = -1;
	weeks.forEach((week, index) => {
		const last = week.contributionDays.at(-1)?.date;
		if (!last) return;
		const month = Number(last.slice(5, 7)) - 1;
		if (month !== previous) {
			const prior = labels.at(-1);
			// Skip a label that would collide with the previous one.
			if (!prior || index - prior.column >= 3) {
				labels.push({ column: index, name: MONTHS[month] });
			}
			previous = month;
		}
	});
	return labels;
}

function ContributionGraph({ weeks, total }: { weeks: Week[]; total: number }) {
	const columns = {
		gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`,
	};

	return (
		// RTL scroll container so narrow screens open on the most recent weeks.
		<div className="-mx-1 overflow-x-auto px-1 pb-1 [direction:rtl]">
			<div className="min-w-[34rem] [direction:ltr]">
				<div
					className="grid text-[0.625rem] text-muted-foreground"
					style={columns}
				>
					{monthLabels(weeks).map((label) => (
						<span
							key={`${label.column}-${label.name}`}
							className="whitespace-nowrap"
							style={{ gridColumnStart: label.column + 1 }}
						>
							{label.name}
						</span>
					))}
				</div>
				<div
					role="img"
					aria-label={`${total.toLocaleString("en-US")} contributions in the last year`}
					className="mt-1.5 grid grid-flow-col grid-rows-7 gap-[3px]"
					style={columns}
				>
					{weeks.flatMap((week, wi) => {
						// Partial first/last weeks: slot each day by weekday so rows line up.
						const slots: (ContributionDay | undefined)[] = Array(7);
						for (const day of week.contributionDays) {
							slots[new Date(day.date).getUTCDay()] = day;
						}
						return Array.from(slots, (day, di) =>
							day ? (
								<span
									key={day.date}
									title={`${day.date}: ${day.contributionCount} contribution${day.contributionCount === 1 ? "" : "s"}`}
									className={`aspect-square rounded-[2px] ${LEVELS[level(day.contributionCount)]}`}
								/>
							) : (
								// biome-ignore lint/suspicious/noArrayIndexKey: empty grid slots are positional
								<span key={`${wi}-${di}`} />
							),
						);
					})}
				</div>
			</div>
		</div>
	);
}

function GitHubSummary({
	data,
	profileUrl,
}: {
	data: GitHubStats;
	profileUrl?: string;
}) {
	const stats = [
		{ label: "Contributions", value: data.totalContributions },
		{ label: "Repositories", value: data.repos },
		{ label: "Followers", value: data.followers },
		{ label: "Following", value: data.following },
	];

	return (
		<div className="mt-8 rounded-lg border border-border">
			<div className="flex items-center justify-between gap-4 px-5 pt-4">
				<h3 className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
					GitHub
				</h3>
				{profileUrl && (
					<a
						href={profileUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="link text-sm text-muted-foreground"
					>
						View profile
					</a>
				)}
			</div>

			<dl className="mt-4 grid grid-cols-2 border-y border-border sm:grid-cols-4">
				{stats.map((stat, index) => (
					<div
						key={stat.label}
						className={cn(
							"px-5 py-4",
							index % 2 === 1 && "border-l border-border",
							index >= 2 && "border-t border-border sm:border-t-0",
							index === 2 && "sm:border-l",
						)}
					>
						<dt className="text-xs text-muted-foreground">{stat.label}</dt>
						<dd className="mt-1 text-xl font-semibold tracking-tight tabular-nums">
							{stat.value.toLocaleString("en-US")}
						</dd>
					</div>
				))}
			</dl>

			<div className="flex flex-col gap-5 p-5">
				{data.weeks.length > 0 && (
					<div>
						<ContributionGraph
							weeks={data.weeks}
							total={data.totalContributions}
						/>
						<div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
							<p>
								{data.totalContributions.toLocaleString("en-US")} contributions
								in the last year
								{data.privateContributions > 0 && (
									<span className="inline-flex items-center gap-1">
										<span aria-hidden="true" className="mx-1.5">
											·
										</span>
										<Lock aria-hidden="true" className="size-3" />
										{data.privateContributions.toLocaleString("en-US")} private
									</span>
								)}
							</p>
							<div className="flex items-center gap-1" aria-hidden="true">
								<span className="mr-1">Less</span>
								{LEVELS.map((cls) => (
									<span key={cls} className={`size-2.5 rounded-[2px] ${cls}`} />
								))}
								<span className="ml-1">More</span>
							</div>
						</div>
					</div>
				)}

				{data.topLanguages.length > 0 && (
					<div
						className={cn(
							data.weeks.length > 0 && "border-t border-border pt-5",
						)}
					>
						<p className="text-xs text-muted-foreground">Top languages</p>
						<div
							className="mt-3 flex h-1.5 gap-0.5 overflow-hidden rounded-full"
							aria-hidden="true"
						>
							{data.topLanguages.map((lang) => (
								<span
									key={lang.name}
									style={{
										width: `${lang.percentage}%`,
										backgroundColor: lang.color ?? "#8b8b8b",
									}}
								/>
							))}
						</div>
						<ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
							{data.topLanguages.map((lang) => (
								<li key={lang.name} className="flex items-center gap-1.5">
									<span
										aria-hidden="true"
										className="size-2 rounded-full"
										style={{ backgroundColor: lang.color ?? "#8b8b8b" }}
									/>
									{lang.name}
									<span className="tabular-nums text-foreground/70">
										{lang.percentage}%
									</span>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
}

async function ProjectsContent({ profileUrl }: { profileUrl?: string }) {
	const [projects, github] = await Promise.all([
		getProjects().catch((): Project[] => []),
		getGitHubStats(),
	]);

	return (
		<>
			{projects.length > 0 ? (
				<ul className="grid gap-3 sm:grid-cols-2">
					{projects.map((project) => (
						<ProjectCard key={project.id} project={project} />
					))}
				</ul>
			) : (
				<p className="text-sm text-muted-foreground">
					Projects are unavailable right now.
				</p>
			)}
			{github && <GitHubSummary data={github} profileUrl={profileUrl} />}
		</>
	);
}

function ProjectsSkeleton() {
	return (
		<ul className="grid gap-3 sm:grid-cols-2" aria-hidden="true">
			{["a", "b", "c", "d"].map((key) => (
				<li
					key={key}
					className="h-36 animate-pulse rounded-lg border border-border bg-muted/40"
				/>
			))}
		</ul>
	);
}

/** GitHub data streams in behind a skeleton so it never blocks first paint. */
export function ProjectsSection({ profileUrl }: { profileUrl?: string }) {
	return (
		<Section id="projects" title="Projects">
			<Suspense fallback={<ProjectsSkeleton />}>
				<ProjectsContent profileUrl={profileUrl} />
			</Suspense>
		</Section>
	);
}
