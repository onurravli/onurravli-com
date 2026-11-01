import { cn } from "@/lib/utils";

/**
 * A home-page section: a small label in a left rail and content to its right
 * on wide screens, stacked on narrow ones.
 */
export function Section({
	id,
	title,
	aside,
	children,
	className,
}: {
	id: string;
	title: string;
	aside?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<section
			id={id}
			aria-labelledby={`${id}-title`}
			className={cn("scroll-mt-14 border-t border-border", className)}
		>
			<div className="page grid gap-6 py-14 sm:py-20 md:grid-cols-[9.5rem_1fr] md:gap-10">
				<div className="flex items-baseline justify-between gap-4 md:flex-col md:justify-start md:gap-2">
					<h2
						id={`${id}-title`}
						className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground md:sticky md:top-20"
					>
						{title}
					</h2>
					{aside}
				</div>
				<div className="min-w-0">{children}</div>
			</div>
		</section>
	);
}
