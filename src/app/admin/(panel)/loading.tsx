import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-col gap-2">
				<Skeleton className="h-5 w-40" />
				<Skeleton className="h-3 w-64 opacity-60" />
			</div>
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-24 w-full" />
			<Skeleton className="h-10 w-full" />
			<div className="flex justify-end">
				<Skeleton className="h-9 w-20 rounded-md" />
			</div>
		</div>
	);
}
