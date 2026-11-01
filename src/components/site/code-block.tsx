"use client";

import { Check, Copy } from "lucide-react";
import { useRef, useState } from "react";

export function CodeBlock({
	children,
	...props
}: React.HTMLAttributes<HTMLPreElement>) {
	const preRef = useRef<HTMLPreElement>(null);
	const [copied, setCopied] = useState(false);
	const attrs = props as Record<string, unknown>;
	const language = attrs["data-language"] as string | undefined;
	const theme = attrs["data-theme"] as string | undefined;

	const copy = async () => {
		const text = preRef.current?.querySelector("code")?.textContent ?? "";
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// Clipboard unavailable (insecure context); nothing to do.
		}
	};

	return (
		<div
			className="my-6 overflow-hidden rounded-lg border border-border"
			data-theme={theme}
		>
			<div className="flex items-center justify-between border-b border-border bg-muted/60 px-4 py-1.5 font-mono text-xs text-muted-foreground">
				<span>{language ?? "code"}</span>
				<button
					type="button"
					onClick={copy}
					aria-label="Copy code"
					className="flex items-center gap-1.5 transition-colors hover:text-foreground"
				>
					{copied ? (
						<Check aria-hidden="true" className="size-3.5" />
					) : (
						<Copy aria-hidden="true" className="size-3.5" />
					)}
					{copied ? "Copied" : "Copy"}
				</button>
			</div>
			<pre
				ref={preRef}
				className="overflow-x-auto text-[0.8125rem] leading-relaxed [&>code]:block [&>code]:p-4"
				{...props}
			>
				{children}
			</pre>
		</div>
	);
}
