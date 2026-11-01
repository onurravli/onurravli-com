"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { sendContactMessage } from "@/app/actions";
import { CONTACT_MESSAGE_MAX, contactFormSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;

const inputClass =
	"w-full rounded-md border border-input bg-background px-3 py-2 text-[0.9375rem] text-foreground shadow-xs transition-colors placeholder:text-muted-foreground/70 hover:border-foreground/25 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/20 aria-invalid:border-destructive";

function FieldError({ id, message }: { id: string; message?: string }) {
	if (!message) return null;
	return (
		<p id={id} className="mt-1.5 text-xs text-destructive">
			{message}
		</p>
	);
}

export function ContactForm() {
	const [pending, setPending] = useState(false);
	const [errors, setErrors] = useState<Errors>({});
	const [chars, setChars] = useState(0);

	async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = event.currentTarget;
		const parsed = contactFormSchema.safeParse(
			Object.fromEntries(new FormData(form)),
		);
		if (!parsed.success) {
			const next: Errors = {};
			for (const issue of parsed.error.issues) {
				const field = issue.path[0] as Field;
				next[field] ??= issue.message;
			}
			setErrors(next);
			const first = parsed.error.issues[0]?.path[0];
			if (typeof first === "string") {
				(form.elements.namedItem(first) as HTMLElement | null)?.focus();
			}
			return;
		}

		setErrors({});
		setPending(true);
		const { ok } = await sendContactMessage(parsed.data).catch(() => ({
			ok: false,
		}));
		setPending(false);

		if (ok) {
			toast.success("Message sent", {
				description: "Thanks for reaching out — I'll get back to you soon.",
			});
			form.reset();
			setChars(0);
		} else {
			toast.error("Couldn't send your message", {
				description: "Please try again, or use email instead.",
			});
		}
	}

	const clearError = (field: Field) =>
		errors[field] && setErrors((prev) => ({ ...prev, [field]: undefined }));

	return (
		<form onSubmit={onSubmit} noValidate className="mt-8 flex flex-col gap-4">
			<div className="grid gap-4 sm:grid-cols-2">
				<div>
					<label htmlFor="contact-name" className="mb-1.5 block text-sm">
						Name
					</label>
					<input
						id="contact-name"
						name="name"
						autoComplete="name"
						required
						aria-invalid={!!errors.name}
						aria-describedby={errors.name ? "contact-name-error" : undefined}
						onChange={() => clearError("name")}
						className={inputClass}
					/>
					<FieldError id="contact-name-error" message={errors.name} />
				</div>
				<div>
					<label htmlFor="contact-email" className="mb-1.5 block text-sm">
						Email
					</label>
					<input
						id="contact-email"
						name="email"
						type="email"
						autoComplete="email"
						required
						aria-invalid={!!errors.email}
						aria-describedby={errors.email ? "contact-email-error" : undefined}
						onChange={() => clearError("email")}
						className={inputClass}
					/>
					<FieldError id="contact-email-error" message={errors.email} />
				</div>
			</div>
			<div>
				<div className="mb-1.5 flex items-baseline justify-between">
					<label htmlFor="contact-message" className="text-sm">
						Message
					</label>
					<span
						className={cn(
							"font-mono text-xs tabular-nums text-muted-foreground",
							chars >= CONTACT_MESSAGE_MAX && "text-destructive",
						)}
					>
						{chars}/{CONTACT_MESSAGE_MAX}
					</span>
				</div>
				<textarea
					id="contact-message"
					name="message"
					rows={6}
					maxLength={CONTACT_MESSAGE_MAX}
					required
					aria-invalid={!!errors.message}
					aria-describedby={
						errors.message ? "contact-message-error" : undefined
					}
					onChange={(e) => {
						setChars(e.target.value.length);
						clearError("message");
					}}
					className={cn(inputClass, "min-h-36 resize-y")}
				/>
				<FieldError id="contact-message-error" message={errors.message} />
			</div>
			<div>
				<button
					type="submit"
					disabled={pending}
					className="inline-flex h-10 min-w-32 items-center justify-center gap-2 rounded-md bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-foreground/85 disabled:opacity-60"
				>
					{pending ? (
						<>
							<Loader2 aria-hidden="true" className="size-4 animate-spin" />
							Sending…
						</>
					) : (
						"Send message"
					)}
				</button>
			</div>
		</form>
	);
}
