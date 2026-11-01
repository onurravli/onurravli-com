import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SocialLinks } from "@/components/site/social-links";
import type { ExperienceEntry, SocialLink } from "@/lib/content";
import type { SiteSettings } from "@/lib/settings";
import { cn } from "@/lib/utils";

interface Cta {
	text: string;
	href: string;
	target: string;
}

function toCta(text: string, href: string, target: string): Cta | null {
	return text && href ? { text, href, target } : null;
}

const isCvHref = (href: string) => /\/cv|\.pdf$/i.test(href);

function CtaLink({
	cta,
	variant,
	event,
}: {
	cta: Cta;
	variant: "primary" | "secondary";
	event: string;
}) {
	const external = cta.target === "_blank";
	const isCv = isCvHref(cta.href);

	return (
		<Link
			href={cta.href}
			// /cv redirects to a PDF; prefetching it as a route 404s.
			prefetch={isCv ? false : undefined}
			target={cta.target}
			rel={external ? "noopener noreferrer" : undefined}
			data-track={event}
			data-track-text={cta.text}
			data-track-href={cta.href}
			data-cv-source={isCv ? `Hero ${variant} CTA` : undefined}
			className={cn(
				"inline-flex h-10 items-center justify-center gap-1.5 rounded-md px-4 text-sm font-medium transition-colors",
				variant === "primary"
					? "bg-foreground text-background hover:bg-foreground/85"
					: "border border-border text-foreground hover:border-foreground/30 hover:bg-accent",
			)}
		>
			{cta.text}
			{external && <ArrowUpRight aria-hidden="true" className="size-3.5" />}
		</Link>
	);
}

export function Hero({
	settings,
	current,
	socialLinks,
}: {
	settings: SiteSettings;
	current?: ExperienceEntry;
	socialLinks: SocialLink[];
}) {
	const primary = toCta(
		settings.heroPrimaryCtaText,
		settings.heroPrimaryCtaHref,
		settings.heroPrimaryCtaTarget,
	);
	const secondary = toCta(
		settings.heroSecondaryCtaText,
		settings.heroSecondaryCtaHref,
		settings.heroSecondaryCtaTarget,
	);

	return (
		<section
			aria-label="Introduction"
			className="page pt-14 pb-16 sm:pt-24 sm:pb-24"
		>
			<div className="flex flex-col gap-8 sm:flex-row-reverse sm:items-start sm:justify-between sm:gap-12">
				{settings.heroShowImage && settings.imagePath && (
					<Image
						src={settings.imagePath}
						alt={settings.name}
						width={112}
						height={112}
						priority
						className="size-16 shrink-0 rounded-full border border-border object-cover sm:size-28"
					/>
				)}
				<div className="sm:mr-auto">
					<h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
						{settings.name}
					</h1>
					<p className="mt-3 text-lg text-muted-foreground">{settings.title}</p>
					<p className="mt-6 text-pretty text-[1.0625rem] leading-relaxed text-foreground/80 sm:text-lg">
						{settings.description}
					</p>

					{current && (
						<p className="mt-6 flex items-center gap-2.5 text-sm text-muted-foreground">
							<span
								aria-hidden="true"
								className="size-1.5 rounded-full bg-brand ring-4 ring-brand/15"
							/>
							<span>
								Currently {current.position} at{" "}
								{current.companyWebsite ? (
									<a
										href={current.companyWebsite}
										target="_blank"
										rel="noopener noreferrer"
										className="link text-foreground"
									>
										{current.companyName}
									</a>
								) : (
									<span className="text-foreground">{current.companyName}</span>
								)}
							</span>
						</p>
					)}

					{(primary || secondary) && (
						<div data-nosnippet className="mt-8 flex flex-wrap gap-3">
							{primary && (
								<CtaLink
									cta={primary}
									variant="primary"
									event="primary_cta_click"
								/>
							)}
							{secondary && (
								<CtaLink
									cta={secondary}
									variant="secondary"
									event="secondary_cta_click"
								/>
							)}
						</div>
					)}

					{socialLinks.length > 0 && (
						<SocialLinks links={socialLinks} className="mt-6 -ml-2.5" />
					)}
				</div>
			</div>
		</section>
	);
}
