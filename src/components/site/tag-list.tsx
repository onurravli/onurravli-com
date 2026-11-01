import { cn } from "@/lib/utils";

export function TagList({
	tags,
	label,
	className,
}: {
	tags: string[];
	label: string;
	className?: string;
}) {
	if (tags.length === 0) return null;

	return (
		<ul className={cn("flex flex-wrap gap-1.5", className)} aria-label={label}>
			{tags.map((tag) => (
				<li
					key={tag}
					className="rounded border border-border px-1.5 py-0.5 font-mono text-[0.6875rem] text-muted-foreground"
				>
					{tag}
				</li>
			))}
		</ul>
	);
}
