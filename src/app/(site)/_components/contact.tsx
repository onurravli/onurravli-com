import { Section } from "@/components/site/section";
import { SocialLinks } from "@/components/site/social-links";
import type { SocialLink } from "@/lib/content";
import { emailFromMailto } from "@/lib/format";
import { ContactForm } from "./contact-form";

export function ContactSection({ socialLinks }: { socialLinks: SocialLink[] }) {
	const email = socialLinks
		.map((link) => emailFromMailto(link.href))
		.find(Boolean);

	return (
		<Section id="contact" title="Contact">
			<div>
				<p className="text-pretty text-[1.0625rem] leading-relaxed text-foreground/80">
					Have a role, a project, or a question in mind? Send a message below
					{email ? (
						<>
							{" "}
							or write to{" "}
							<a href={`mailto:${email}`} className="link text-foreground">
								{email}
							</a>
						</>
					) : null}
					. I usually reply within a couple of days.
				</p>
				<div data-nosnippet>
					<ContactForm />
				</div>
				{socialLinks.length > 0 && (
					<SocialLinks links={socialLinks} className="mt-8 -ml-2.5" />
				)}
			</div>
		</Section>
	);
}
