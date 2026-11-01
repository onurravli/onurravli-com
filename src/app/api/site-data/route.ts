import { getAccentColor } from "@/lib/accent-colors";
import {
	getEducation,
	getExperiences,
	getPublishedPosts,
	getSkillCategories,
	getSocialLinks,
} from "@/lib/content";
import { getProjects } from "@/lib/github";
import { getSettings } from "@/lib/settings";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

/** The site's content as JSON, consumed by the SSH portfolio (onurravli/ssh-server). */
export async function GET() {
	const [
		settings,
		socialLinks,
		experiences,
		skills,
		education,
		posts,
		projects,
	] = await Promise.all([
		getSettings(),
		getSocialLinks(),
		getExperiences(),
		getSkillCategories(),
		getEducation(),
		getPublishedPosts(),
		getProjects().catch(() => []),
	]);

	return Response.json({
		accentColor: getAccentColor(settings.accentColor).colors[400],
		personal: {
			name: settings.name,
			title: settings.title,
			description: settings.description,
			url: SITE_URL,
		},
		socialLinks: socialLinks.map(({ label, href }) => ({ label, href })),
		experience: experiences.map((e) => ({
			icon: e.icon,
			company: e.companyName,
			website: e.companyWebsite,
			position: e.position,
			location: e.location,
			startDate: e.startDate,
			endDate: e.endDate,
			notes: e.notes,
			technologies: e.technologies,
		})),
		skills: skills.map(({ title, skills }) => ({ title, skills })),
		education: education.map(({ id: _, sortOrder: __, ...entry }) => entry),
		projects,
		blog: posts,
	});
}
