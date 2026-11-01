"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const REFRESH_MS = 20_000;

export function LiveCounter() {
	const [count, setCount] = useState<number | null>(null);

	useEffect(() => {
		const load = () =>
			fetch("/api/analytics/live")
				.then((res) => res.json())
				.then((data: { count?: number }) => setCount(data.count ?? 0))
				.catch(() => {});
		load();
		const id = setInterval(load, REFRESH_MS);
		return () => clearInterval(id);
	}, []);

	return (
		<Card>
			<CardHeader className="pb-2 pt-5 px-5">
				<div className="flex items-center justify-between">
					<CardTitle className="text-sm font-medium text-muted-foreground">
						Live Users
					</CardTitle>
					<span className="relative flex size-2">
						<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
						<span className="relative inline-flex rounded-full size-2 bg-green-500" />
					</span>
				</div>
			</CardHeader>
			<CardContent className="px-5 pb-5">
				<p className="text-3xl font-bold">{count === null ? "—" : count}</p>
				<p className="text-xs text-muted-foreground mt-1">online now</p>
			</CardContent>
		</Card>
	);
}
