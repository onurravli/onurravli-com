import { cn } from "@/lib/utils";

/** Compact controls used inside the admin list editors. */
export const inputClass =
	"rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring w-full";

export function Field({
	label,
	hint,
	className,
	children,
}: {
	label: string;
	hint?: string;
	className?: string;
	children: React.ReactNode;
}) {
	return (
		// biome-ignore lint/a11y/noLabelWithoutControl: the control is the nested child
		<label className={cn("flex flex-col gap-1", className)}>
			<span className="text-xs text-muted-foreground">
				{label}
				{hint && <span className="text-muted-foreground/60"> ({hint})</span>}
			</span>
			{children}
		</label>
	);
}

/** "a, b , c" → ["a", "b", "c"] */
export const splitCommas = (text: string) =>
	text
		.split(",")
		.map((item) => item.trim())
		.filter(Boolean);

/** One entry per non-empty line. */
export const splitLines = (text: string) =>
	text
		.split("\n")
		.map((item) => item.trim())
		.filter(Boolean);

export const buttonClass = {
	primary:
		"rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50",
	secondary:
		"rounded-md border border-border px-3 py-1 text-xs text-foreground hover:bg-muted",
	edit: "rounded px-2 py-0.5 text-xs border border-border hover:bg-muted",
	delete:
		"rounded px-2 py-0.5 text-xs border border-destructive text-destructive hover:bg-destructive/10 disabled:opacity-50",
};
