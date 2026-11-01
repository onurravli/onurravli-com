import type { Metadata } from "next";
import { VisitNotifier } from "@/components/analytics/visit-notifier";
import {
	currentRole,
	getEducation,
	getExperiences,
	getPublishedPosts,
	getRecommendations,
	getSkillCategories,
	getSocialLinks,
} from "@/lib/content";
import { getSettings } from "@/lib/settings";
import { SITE_URL } from "@/lib/site";
import { BlogSection } from "./_components/blog";
import { ContactSection } from "./_components/contact";
import { EducationSection } from "./_components/education";
import { ExperienceSection } from "./_components/experience";
import { Hero } from "./_components/hero";
import { ProjectsSection } from "./_components/projects";
import { RecommendationsSection } from "./_components/recommendations";
import { SkillsSection } from "./_components/skills";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default async function HomePage() {
	const [
		settings,
		socialLinks,
		experiences,
		skillCategories,
		education,
		posts,
		recommendations,
	] = await Promise.all([
		getSettings(),
		getSocialLinks(),
		getExperiences(),
		getSkillCategories(),
		getEducation(),
		getPublishedPosts(),
		getRecommendations(),
	]);

	const current = currentRole(experiences);
	const githubUrl = socialLinks.find(
		(link) => link.iconName.toLowerCase() === "github",
	)?.href;

	// Tells search engines who the page is about.
	const personJsonLd = {
		"@context": "https://schema.org",
		"@type": "Person",
		name: settings.name,
		jobTitle: settings.title,
		description: settings.description,
		url: SITE_URL,
		image: settings.imagePath,
		...(current && {
			worksFor: {
				"@type": "Organization",
				name: current.companyName,
				...(current.companyWebsite && { url: current.companyWebsite }),
			},
		}),
		sameAs: socialLinks
			.map((link) => link.href)
			.filter((href) => href.startsWith("http")),
	};

	return (
		<>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined; "<" is escaped
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
				}}
			/>
			<VisitNotifier />
			<Hero settings={settings} current={current} socialLinks={socialLinks} />
			<ExperienceSection items={experiences} />
			<ProjectsSection profileUrl={githubUrl} />
			<SkillsSection items={skillCategories} />
			<EducationSection items={education} />
			<RecommendationsSection items={recommendations} />
			<BlogSection posts={posts} />
			<ContactSection socialLinks={socialLinks} />
		</>
	);
}
