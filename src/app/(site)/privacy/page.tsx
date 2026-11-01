import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Privacy Policy",
	alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
	return (
		<article className="page pt-10 pb-20 sm:pt-16">
			<div className="flex flex-col gap-8">
				<div className="flex flex-col gap-2">
					<h1 className="text-3xl font-semibold tracking-tight">
						Privacy Policy
					</h1>
					<p className="text-sm text-muted-foreground">
						Last updated: March 2026
					</p>
				</div>

				<div className="flex flex-col gap-6 text-sm text-muted-foreground leading-relaxed">
					<div className="flex flex-col gap-2">
						<h2 className="text-base font-medium text-foreground">Overview</h2>
						<p>
							This site collects anonymous visit data to understand how traffic
							flows. No account is required to visit, and no personally
							identifying information is collected through analytics.
						</p>
					</div>

					<div className="flex flex-col gap-2">
						<h2 className="text-base font-medium text-foreground">
							What is collected (analytics)
						</h2>
						<p>
							Analytics data is only collected if you accept the consent banner.
							If you decline, nothing is tracked. The following data is recorded
							per page visit:
						</p>
						<ul className="list-disc list-inside flex flex-col gap-1 pl-2">
							<li>Page path (e.g. /projects, /blog)</li>
							<li>Referrer domain (where you came from)</li>
							<li>
								Country and city (derived from your IP, not stored directly)
							</li>
							<li>Browser, operating system, and device type</li>
							<li>Screen dimensions</li>
							<li>UTM parameters (e.g. utm_source, utm_campaign)</li>
							<li>
								A temporary session ID — a random identifier that links your
								page views within a single browser session. It is not tied to
								your identity and is discarded when you close the tab.
							</li>
						</ul>
						<p className="mt-1">
							Interaction events are also recorded with consent: navigation
							clicks, button clicks, and other UI interactions. These are linked
							to the same session ID.
						</p>
					</div>

					<div className="flex flex-col gap-2">
						<h2 className="text-base font-medium text-foreground">
							What is not collected
						</h2>
						<ul className="list-disc list-inside flex flex-col gap-1 pl-2">
							<li>Your IP address is never stored in the analytics database</li>
							<li>No name, email, or account information</li>
							<li>No cross-site tracking or third-party advertising</li>
							<li>No cookies other than the consent preference cookie</li>
						</ul>
					</div>

					<div className="flex flex-col gap-2">
						<h2 className="text-base font-medium text-foreground">
							Contact form
						</h2>
						<p>
							If you submit the contact form, the following information is
							collected and sent to me via email: your name, email address,
							message, and IP address. This data is used solely to respond to
							your inquiry and is not stored in any database.
						</p>
					</div>

					<div className="flex flex-col gap-2">
						<h2 className="text-base font-medium text-foreground">
							Data storage
						</h2>
						<p>
							Analytics data is stored in a self-hosted ClickHouse database and
							is automatically deleted after 2 years. No data is sold or shared
							with third parties.
						</p>
					</div>

					<div className="flex flex-col gap-2">
						<h2 className="text-base font-medium text-foreground">
							Your choices
						</h2>
						<p>
							You can decline analytics collection at any time via the consent
							banner. Your preference is stored as a cookie for 365 days. To
							withdraw consent, clear your cookies or contact me directly.
						</p>
					</div>

					<div className="flex flex-col gap-2">
						<h2 className="text-base font-medium text-foreground">Contact</h2>
						<p>
							For any privacy-related questions, reach out via the{" "}
							<Link href="/#contact" className="link text-foreground">
								contact form
							</Link>
							.
						</p>
					</div>
				</div>
			</div>
		</article>
	);
}
