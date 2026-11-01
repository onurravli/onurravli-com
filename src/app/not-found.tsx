import Link from "next/link";

export default function NotFound() {
	return (
		<main className="page flex min-h-svh flex-col items-start justify-center gap-4">
			<p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
				404
			</p>
			<h1 className="text-3xl font-semibold tracking-tight">
				This page doesn’t exist.
			</h1>
			<p className="text-muted-foreground">
				The link may be broken, or the page may have moved.
			</p>
			<Link
				href="/"
				className="mt-4 inline-flex h-10 items-center rounded-md bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/85"
			>
				Back to home
			</Link>
		</main>
	);
}
