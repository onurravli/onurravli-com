import {
	getEducation,
	getExperiences,
	getPublishedPosts,
	getSkillCategories,
	getSocialLinks,
} from "@/lib/content";
import { emailFromMailto } from "@/lib/format";
import { getGitHubStats, getProjects } from "@/lib/github";
import { getSettings } from "@/lib/settings";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

/** A structured, complete Markdown view of the site for AI agents and tools. */
export async function GET() {
	const [
		settings,
		socialLinks,
		experiences,
		skills,
		education,
		posts,
		projects,
		github,
	] = await Promise.all([
		getSettings(),
		getSocialLinks(),
		getExperiences(),
		getSkillCategories(),
		getEducation(),
		getPublishedPosts(),
		getProjects().catch(() => []),
		getGitHubStats(),
	]);

	const lines: string[] = [];
	const push = (...items: string[]) => lines.push(...items);
	const section = (title: string) => push(`## ${title}`, "");

	push(
		`# ${settings.name}`,
		"",
		`> ${settings.title} — ${settings.description}`,
		"",
		`This file is generated dynamically and reflects the current state of ${SITE_URL}. It is intended for AI agents, LLMs, and automated tools that want a structured, complete view of the site's content.`,
		"",
		`- [Website](${SITE_URL})`,
		`- [CV](${SITE_URL}/cv)`,
		`- Generated at: ${new Date().toISOString()}`,
		"",
	);

	section("Contact");
	for (const link of socialLinks) {
		const email = emailFromMailto(link.href);
		push(
			email
				? `- [Email](mailto:${email}): ${email}`
				: `- [${link.label}](${link.href})`,
		);
	}
	push("");

	if (github) {
		section("GitHub Stats");
		push(
			`- Public repositories: ${github.repos}`,
			`- Followers: ${github.followers}`,
			`- Following: ${github.following}`,
			`- Contributions (last year): ${github.totalContributions} (${github.privateContributions} private)`,
		);
		if (github.topLanguages.length > 0) {
			const languages = github.topLanguages.map(
				(l) => `${l.name} (${l.percentage}%)`,
			);
			push(`- Top languages: ${languages.join(", ")}`);
		}
		push("");
	}

	if (experiences.length > 0) {
		section("Experience");
		for (const exp of experiences) {
			push(
				`### ${exp.position} — ${exp.companyName} (${exp.startDate} – ${exp.endDate})`,
			);
			if (exp.companyWebsite)
				push(`- Company: [${exp.companyName}](${exp.companyWebsite})`);
			if (exp.location) push(`- Location: ${exp.location}`);
			if (exp.technologies.length > 0)
				push(`- Technologies: ${exp.technologies.join(", ")}`);
			push(...exp.notes.map((note) => `- ${note}`), "");
		}
	}

	if (skills.length > 0) {
		section("Skills");
		push(...skills.map((s) => `- ${s.title}: ${s.skills.join(", ")}`), "");
	}

	if (projects.length > 0) {
		section("Projects");
		for (const project of projects) {
			push(`### ${project.name}`);
			if (project.description) push(project.description);
			push(`- Repository: [${project.fullName}](${project.url})`);
			if (project.homepage)
				push(`- Homepage: [${project.homepage}](${project.homepage})`);
			push(`- Stars: ${project.stars} | Forks: ${project.forks}`);
			if (project.languages.length > 0)
				push(`- Languages: ${project.languages.join(", ")}`);
			if (project.topics.length > 0)
				push(`- Topics: ${project.topics.join(", ")}`);
			push("");
		}
	}

	if (education.length > 0) {
		section("Education");
		for (const edu of education) {
			push(
				`### ${edu.degree}, ${edu.department} — ${edu.school} (${edu.startDate} – ${edu.endDate})`,
			);
			if (edu.location) push(`- Location: ${edu.location}`);
			push(...edu.notes.map((note) => `- ${note}`), "");
		}
	}

	if (posts.length > 0) {
		section("Blog Posts");
		for (const post of posts) {
			push(
				`### ${post.title}`,
				`- [Read post](${SITE_URL}/blog/${post.slug})`,
				`- Date: ${post.date}`,
			);
			if (post.tags.length > 0) push(`- Tags: ${post.tags.join(", ")}`);
			if (post.description) push(`- Summary: ${post.description}`);
			if (post.content) push("", post.content.trim());
			push("");
		}
	}

	return new Response(lines.join("\n"), {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "no-store",
		},
	});
}
