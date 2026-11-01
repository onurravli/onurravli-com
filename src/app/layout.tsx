import { Analytics } from "@vercel/analytics/next";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import { VisitorTracker } from "@/components/analytics/visitor-tracker";
import { THEME_SCRIPT, ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { getAccentColor } from "@/lib/accent-colors";
import { getSettings } from "@/lib/settings";
import { SITE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";
import "./globals.css";

// Content comes from the database and is edited live in the admin panel, so
// pages render per request (backed by the Redis cache) instead of at build time.
export const dynamic = "force-dynamic";

const berkeleyMono = localFont({
	src: "../../assets/Berkeley-Mono.ttf",
	variable: "--font-mono-face",
	display: "swap",
	preload: false,
});

export async function generateMetadata(): Promise<Metadata> {
	const { name, title, description } = await getSettings();
	const fullTitle = `${name} — ${title}`;

	return {
		metadataBase: new URL(SITE_URL),
		title: { default: fullTitle, template: `%s — ${name}` },
		description,
		category: "technology",
		authors: [{ name, url: SITE_URL }],
		openGraph: {
			title: fullTitle,
			description,
			type: "website",
			url: SITE_URL,
			siteName: name,
		},
		twitter: { card: "summary_large_image", title: fullTitle, description },
		robots: { index: true },
	};
}

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#fcfcfb" },
		{ media: "(prefers-color-scheme: dark)", color: "#141518" },
	],
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { accentColor } = await getSettings();
	// Resolving the accent on the server makes the first paint already on-brand.
	const accentVars = Object.fromEntries(
		Object.entries(getAccentColor(accentColor).colors).map(([shade, value]) => [
			`--color-theme-${shade}`,
			value,
		]),
	) as React.CSSProperties;

	return (
		<html
			lang="en"
			suppressHydrationWarning
			// Lets Next.js pause smooth scrolling on navigation, so new pages start
			// at the very top instead of just below the sticky header.
			data-scroll-behavior="smooth"
			className={cn(GeistSans.variable, berkeleyMono.variable)}
			style={accentVars}
		>
			<head>
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: blocking anti-flash theme script
					dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
				/>
			</head>
			<body>
				<ThemeProvider>
					{children}
					<Suspense>
						<VisitorTracker />
					</Suspense>
					<Toaster />
					<Analytics />
					{process.env.PREPROD_INDICATOR === "true" && (
						<div className="pointer-events-none fixed right-0 top-0 z-9999 overflow-hidden w-36 h-36">
							<div className="absolute top-[26px] right-[-38px] w-[160px] rotate-45 bg-yellow-400 text-yellow-900 text-xs font-bold uppercase tracking-wider shadow-md py-1 text-center">
								PRE-PROD
							</div>
						</div>
					)}
				</ThemeProvider>
			</body>
		</html>
	);
}
