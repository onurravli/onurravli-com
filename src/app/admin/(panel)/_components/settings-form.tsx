"use client";

import { useTransition } from "react";
import { toast } from "sonner";

/**
 * Card form that submits to a Server Function and reports the outcome in a
 * toast. Fields are uncontrolled and read from the FormData.
 */
export function SettingsForm({
	action,
	success,
	failure,
	className = "gap-4",
	children,
}: {
	action: (form: FormData) => Promise<void>;
	success: { title: string; description: string };
	failure: string;
	className?: string;
	children: React.ReactNode;
}) {
	const [isPending, startTransition] = useTransition();

	function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		startTransition(async () => {
			try {
				await action(form);
				toast.success(success.title, { description: success.description });
			} catch {
				toast.error(failure, { description: "Please try again." });
			}
		});
	}

	return (
		<form
			onSubmit={onSubmit}
			className={`rounded-lg border border-border bg-card p-5 flex flex-col ${className}`}
		>
			{children}
			<div className="flex items-center justify-between">
				<p className="text-xs text-muted-foreground">
					{isPending ? "Saving…" : "Changes are applied live on the site."}
				</p>
				<button
					type="submit"
					disabled={isPending}
					className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Save
				</button>
			</div>
		</form>
	);
}

export const settingsInputClass =
	"rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

export function SettingsField({
	id,
	label,
	hint,
	children,
}: {
	id: string;
	label: string;
	hint?: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-1.5">
			<label htmlFor={id} className="text-sm font-medium text-foreground">
				{label}
				{hint && (
					<>
						{" "}
						<span className="text-xs text-muted-foreground font-normal">
							— {hint}
						</span>
					</>
				)}
			</label>
			{children}
		</div>
	);
}
