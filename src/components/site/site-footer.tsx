import Link from "next/link";

const LINKS = [
	{ href: "/privacy", label: "Privacy" },
	{ href: "/#contact", label: "Contact" },
	{ href: "/llms.txt", label: "llms.txt" },
];

export function SiteFooter({
	name,
	copyright,
}: {
	name: string;
	copyright: string;
}) {
	return (
		<footer className="border-t border-border">
			<div
				data-nosnippet
				className="page flex flex-col gap-3 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"
			>
				<p>
					© {new Date().getFullYear()} {name}
					{copyright && (
						<>
							<span aria-hidden="true" className="mx-2 text-border">
								/
							</span>
							{copyright}
						</>
					)}
				</p>
				<div className="flex items-center gap-5">
					{LINKS.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="transition-colors hover:text-foreground"
						>
							{link.label}
						</Link>
					))}
				</div>
			</div>
		</footer>
	);
}
