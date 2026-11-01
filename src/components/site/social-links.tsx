import { SocialIcon } from "@/components/site/social-icon";
import type { SocialLink } from "@/lib/content";

export function SocialLinks({
	links,
	className,
}: {
	links: SocialLink[];
	className?: string;
}) {
	return (
		<div data-nosnippet className={className}>
			<ul className="flex flex-wrap items-center gap-1">
				{links.map((link) => (
					<li key={link.id}>
						<a
							href={link.href}
							target={link.target}
							rel="noopener noreferrer"
							aria-label={link.label}
							title={link.label}
							data-track="social_click"
							data-track-platform={link.label}
							className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
						>
							<SocialIcon name={link.iconName} />
						</a>
					</li>
				))}
			</ul>
		</div>
	);
}
