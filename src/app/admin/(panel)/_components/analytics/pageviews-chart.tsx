"use client";

import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import type { DayStat } from "@/lib/analytics/queries";

export function PageviewsChart({ data }: { data: DayStat[] }) {
	const formatted = data.map((day) => ({
		...day,
		date: new Date(day.date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			timeZone: "UTC",
		}),
	}));

	return (
		<ResponsiveContainer width="100%" height={220}>
			<LineChart
				data={formatted}
				margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
			>
				<CartesianGrid strokeDasharray="3 3" className="stroke-border" />
				<XAxis
					dataKey="date"
					tick={{ fontSize: 11 }}
					className="fill-muted-foreground"
					tickLine={false}
					axisLine={false}
					interval="preserveStartEnd"
				/>
				<YAxis
					tick={{ fontSize: 11 }}
					className="fill-muted-foreground"
					tickLine={false}
					axisLine={false}
					allowDecimals={false}
				/>
				<Tooltip
					contentStyle={{
						backgroundColor: "var(--card)",
						border: "1px solid var(--border)",
						borderRadius: "8px",
						fontSize: 12,
					}}
					labelStyle={{ color: "var(--foreground)" }}
				/>
				<Line
					type="monotone"
					dataKey="views"
					stroke="var(--primary)"
					strokeWidth={2}
					dot={false}
					activeDot={{ r: 4 }}
				/>
				<Line
					type="monotone"
					dataKey="sessions"
					stroke="var(--muted-foreground)"
					strokeWidth={1.5}
					dot={false}
					strokeDasharray="4 2"
					activeDot={{ r: 3 }}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
}
