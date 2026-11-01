"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeSwitch } from "@/components/site/theme-switch";
import { CV_PATH } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Header height (h-14) plus a little slack: a section is "current" once its top passes this line. */
const ACTIVE_LINE = 56 + 24;

export interface NavItem {
	label: string;
	/** Section id on the home page, e.g. "experience". */
	section: string;
}

export function SiteHeader({
	name,
	items,
}: {
	name: string;
	items: NavItem[];
}) {
	const pathname = usePathname();
	const isHome = pathname === "/";
	const [scrolled, setScrolled] = useState(false);
	const [open, setOpen] = useState(false);
	const [active, setActive] = useState<string | null>(null);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 8);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	// Highlight the last section whose top has scrolled up to the header, so
	// nothing is active while the hero is still in view. Near the bottom of
	// the page the last section wins, since short ones never reach the header.
	useEffect(() => {
		if (!isHome) {
			setActive(null);
			return;
		}
		const sections = items
			.map((item) => document.getElementById(item.section))
			.filter((el): el is HTMLElement => el !== null);
		const update = () => {
			const atBottom =
				window.innerHeight + window.scrollY >=
				document.documentElement.scrollHeight - 2;
			let current: string | null = null;
			for (const section of sections) {
				if (section.getBoundingClientRect().top <= ACTIVE_LINE)
					current = section.id;
			}
			if (atBottom && window.scrollY > 0 && sections.length > 0) {
				current = sections[sections.length - 1].id;
			}
			setActive(current);
		};
		update();
		window.addEventListener("scroll", update, { passive: true });
		window.addEventListener("resize", update);
		return () => {
			window.removeEventListener("scroll", update);
			window.removeEventListener("resize", update);
		};
	}, [isHome, items]);

	// Close the mobile menu on navigation.
	// biome-ignore lint/correctness/useExhaustiveDependencies: run on route change
	useEffect(() => setOpen(false), [pathname]);

	const href = (section: string) => (isHome ? `#${section}` : `/#${section}`);

	return (
		<header
			className={cn(
				"sticky top-0 z-40 border-b transition-colors duration-200",
				scrolled || open
					? "border-border bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70"
					: "border-transparent bg-background",
			)}
		>
			<div
				data-nosnippet
				className="page flex h-14 items-center justify-between gap-6"
			>
				<Link
					href="/"
					className="font-medium tracking-tight text-foreground"
					onClick={(event) => {
						setOpen(false);
						// Already home (e.g. at "/#education"): Next.js treats this as the
						// same page and won't scroll, so clear the hash and scroll up here.
						if (isHome) {
							event.preventDefault();
							if (window.location.hash) window.history.pushState(null, "", "/");
							window.scrollTo({ top: 0 });
						}
					}}
				>
					{name}
				</Link>

				<nav aria-label="Primary" className="hidden sm:block">
					<ul className="flex items-center gap-1 text-sm">
						{items.map((item) => (
							<li key={item.section}>
								<a
									href={href(item.section)}
									aria-current={active === item.section ? "true" : undefined}
									className={cn(
										"rounded-md px-2.5 py-1.5 transition-colors hover:text-foreground",
										active === item.section
											? "text-foreground"
											: "text-muted-foreground",
									)}
								>
									{item.label}
								</a>
							</li>
						))}
						<li>
							<a
								href={CV_PATH}
								target="_blank"
								rel="noopener noreferrer"
								data-cv-source="Header"
								className="rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
							>
								CV
							</a>
						</li>
						<li>
							<ThemeSwitch />
						</li>
					</ul>
				</nav>

				<div className="flex items-center gap-1 sm:hidden">
					<ThemeSwitch />
					<button
						type="button"
						onClick={() => setOpen((value) => !value)}
						aria-expanded={open}
						aria-controls="mobile-nav"
						aria-label={open ? "Close menu" : "Open menu"}
						className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
					>
						{open ? <X className="size-4" /> : <Menu className="size-4" />}
					</button>
				</div>
			</div>

			{open && (
				<div data-nosnippet>
					<nav
						id="mobile-nav"
						aria-label="Primary"
						className="page animate-in fade-in slide-in-from-top-1 pb-4 duration-150 sm:hidden"
					>
						<ul className="flex flex-col border-t border-border pt-2 text-[15px]">
							{items.map((item) => (
								<li key={item.section}>
									<a
										href={href(item.section)}
										onClick={() => setOpen(false)}
										className="block py-2.5 text-muted-foreground transition-colors hover:text-foreground"
									>
										{item.label}
									</a>
								</li>
							))}
							<li>
								<a
									href={CV_PATH}
									target="_blank"
									rel="noopener noreferrer"
									data-cv-source="Header"
									className="block py-2.5 text-muted-foreground transition-colors hover:text-foreground"
								>
									CV
								</a>
							</li>
						</ul>
					</nav>
				</div>
			)}
		</header>
	);
}
