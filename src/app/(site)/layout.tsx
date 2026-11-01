import { ClickTracker } from "@/components/analytics/click-tracker";
import { SiteFooter } from "@/components/site/site-footer";
import { type NavItem, SiteHeader } from "@/components/site/site-header";
import { getPublishedPosts } from "@/lib/content";
import { getSettings } from "@/lib/settings";

export default async function SiteLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [settings, posts] = await Promise.all([
		getSettings(),
		getPublishedPosts(),
	]);

	const navItems: NavItem[] = [
		{ label: "Experience", section: "experience" },
		{ label: "Projects", section: "projects" },
		{ label: "Skills", section: "skills" },
		{ label: "Education", section: "education" },
		...(posts.length > 0 ? [{ label: "Blog", section: "blog" }] : []),
		{ label: "Contact", section: "contact" },
	];

	return (
		<>
			<div data-nosnippet>
				<a
					href="#main"
					className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-3 focus:py-2 focus:text-sm focus:text-background"
				>
					Skip to content
				</a>
			</div>
			<SiteHeader name={settings.name} items={navItems} />
			<main id="main">{children}</main>
			<SiteFooter name={settings.name} copyright={settings.footerCopyright} />
			<ClickTracker />
		</>
	);
}
