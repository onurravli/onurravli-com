import type { CountRow } from "@/lib/analytics/queries";

export function BarList({
	rows,
	valueLabel = "views",
}: {
	rows: CountRow[];
	valueLabel?: string;
}) {
	const max = Math.max(...rows.map((row) => row.count), 1);

	return (
		<div className="flex flex-col gap-2">
			{rows.map((row) => (
				<div key={row.label || "—"} className="flex items-center gap-3 text-sm">
					<div className="flex-1 min-w-0">
						<div className="flex items-center justify-between gap-2 mb-1">
							<span className="truncate text-foreground font-medium text-xs">
								{row.label || "—"}
							</span>
							<span className="text-xs text-muted-foreground shrink-0">
								{row.count} {valueLabel}
							</span>
						</div>
						<div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
							<div
								className="h-full rounded-full bg-primary/70 transition-all duration-500"
								style={{ width: `${(row.count / max) * 100}%` }}
							/>
						</div>
					</div>
				</div>
			))}
			{rows.length === 0 && (
				<p className="text-xs text-muted-foreground text-center py-4">
					No data yet
				</p>
			)}
		</div>
	);
}
