/**
 * Fills an empty database with the site's initial content. Each table is only
 * seeded while it is empty, and blog posts are matched by slug, so running the
 * seed again never overwrites edits made in the admin panel.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import matter from "gray-matter";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
	adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const socialLinks = [
	{ label: "GitHub", href: "https://github.com/onurravli", iconName: "github" },
	{
		label: "LinkedIn",
		href: "https://www.linkedin.com/in/onurravli/",
		iconName: "linkedin",
	},
	{
		label: "BlueSky",
		href: "https://bsky.app/profile/onurravli.com",
		iconName: "bluesky",
	},
	{ label: "Twitter", href: "https://x.com/onurravli", iconName: "twitter" },
	{
		label: "Instagram",
		href: "https://www.instagram.com/onurravli/",
		iconName: "instagram",
	},
	{
		label: "Mail",
		href: "mailto:onur@onurravli.com?subject=Hello Onur!",
		iconName: "mail",
	},
];

const projectRepos = [
	"https://github.com/onurravli/onurravli-com",
	"https://github.com/libresuite/libresuite",
	"https://github.com/onurravli/flottant",
	"https://github.com/onurravli/resume",
	"https://github.com/onurravli/SelfDeck",
];

const experiences = [
	{
		companyName: "Insider One",
		companyWebsite: "https://insiderone.com",
		position: "Software Developer",
		location: "Remote",
		startDate: "July 2025",
		endDate: "Present",
		icon: "🚀",
		notes: [
			"Task Development and System Contribution: I am responsible for Optimus task development and actively contribute to system development efforts",
			"Code Reviews and Outsourced Task Support: I conduct code reviews and provide essential support for tasks that are outsourced",
			"Project Participation: I participate as a developer in various Optimus projects",
			"Meeting Attendance: I attend all required Optimus meetings, including daily stand-ups, retrospectives, reviews, and training sessions. I also participate in broader Insider One meetings such as Strategy, Oasis, Tech Talks, and Dev Talks",
			"Personal Development: Continuous personal development is a key aspect of my role",
			"Support and Follow-up: I provide buddy support to colleagues and ensure follow-up on the Kanban board to maintain workflow efficiency",
			"Question Hours: I attend PST Question Hours to address and resolve technical queries",
		],
		technologies: [
			"Node.js",
			"TypeScript",
			"Go",
			"JavaScript",
			"React.js",
			"TailwindCSS",
			"PostgreSQL",
		],
	},
	{
		companyName: "Jotform",
		companyWebsite: "https://jotform.com",
		position: "Summer Intern",
		location: "Ankara, Türkiye 🇹🇷 (Remote)",
		startDate: "August 2023",
		endDate: "September 2023",
		icon: "📝",
		notes: [
			"Development of a revision history system for their product, Jotform Approvals, with my team, Jr. Source, as an internship project using Node.js, React.js, SCSS, PHP, and MySQL.",
		],
		technologies: [
			"JavaScript",
			"TypeScript",
			"React.js",
			"Node.js",
			"PostgreSQL",
			"Tailwind CSS",
			"SCSS",
			"PHP",
			"MySQL",
		],
	},
	{
		companyName: "Üstünova Engineering",
		companyWebsite: "https://www.ustunova.com.tr/",
		position: "Summer Intern",
		location: "Ankara, Türkiye 🇹🇷 (On-site)",
		startDate: "July 2023",
		endDate: "August 2023",
		icon: "⚡",
		notes: [
			"Frontend development of a dashboard and a control panel for an EV charging station software, Electr-INN, using Next.js, Node.js, and Django.",
		],
		technologies: [
			"JavaScript",
			"TypeScript",
			"React.js",
			"Node.js",
			"Tailwind CSS",
			"Next.js",
			"Django",
		],
	},
];

const skillCategories = [
	{
		title: "Programming Languages",
		skills: ["JavaScript", "Go", "TypeScript", "Python", "Java"],
	},
	{
		title: "Backend Tools",
		skills: [
			"Node.js",
			"Express.js",
			"Nest.js",
			"Django",
			"Spring Boot",
			"Flask",
		],
	},
	{
		title: "Frontend Tools",
		skills: [
			"React.js",
			"React Native",
			"Next.js",
			"TailwindCSS",
			"Electron",
			"SCSS",
		],
	},
	{ title: "Databases", skills: ["MongoDB", "PostgreSQL", "MySQL", "Redis"] },
	{
		title: "DevOps",
		skills: [
			"Github Actions",
			"Docker",
			"Docker Compose",
			"AWS EC2",
			"AWS Lambda",
			"AWS S3",
			"Bash",
		],
	},
	{
		title: "Other Tools",
		skills: [
			"Git",
			"GraphQL",
			"Jest",
			"Postman",
			"Swagger",
			"Jira",
			"Slack",
			"Notion",
		],
	},
	{ title: "Design", skills: ["Figma", "Photoshop", "Illustrator", "XD"] },
	{ title: "Languages", skills: ["English", "Turkish"] },
];

const education = [
	{
		school: "Konya Technical University",
		degree: "Bachelor of Science",
		department: "Computer Engineering",
		startDate: "2022",
		endDate: "2026 (Expected)",
		location: "Konya, Türkiye",
		notes: ["Chamber of Computer Engineers of Turkey"],
	},
	{
		school: "Konya Technical University",
		degree: "Bachelor of Science",
		department: "Electrical and Electronics Engineering",
		startDate: "2020",
		endDate: "2022 (Undergraduate Transfer)",
		location: "Konya, Türkiye",
		notes: [
			"Artificial Intelligence and Image Processing Society",
			"Chamber of Electrical Engineers of Turkey",
		],
	},
];

const withOrder = <T>(rows: T[]) =>
	rows.map((row, sortOrder) => ({ ...row, sortOrder }));

async function readBlogPosts() {
	const dir = path.join(import.meta.dirname, "../content/blog");
	const files = (await readdir(dir)).filter((file) => file.endsWith(".mdx"));
	return Promise.all(
		files.map(async (file) => {
			const { data, content } = matter(await readFile(path.join(dir, file)));
			return {
				slug: file.replace(/\.mdx$/, ""),
				title: String(data.title),
				description: String(data.description ?? ""),
				date: String(data.date),
				tags: (data.tags as string[] | undefined) ?? [],
				images: (data.images as string[] | undefined) ?? [],
				content: content.trim(),
			};
		}),
	);
}

async function seedIfEmpty(
	count: () => Promise<number>,
	create: () => Promise<unknown>,
) {
	if ((await count()) === 0) await create();
}

async function main() {
	await prisma.siteSettings.upsert({
		where: { id: "settings" },
		create: {},
		update: {},
	});

	await seedIfEmpty(
		() => prisma.socialLink.count(),
		() => prisma.socialLink.createMany({ data: withOrder(socialLinks) }),
	);
	await seedIfEmpty(
		() => prisma.projectRepo.count(),
		() =>
			prisma.projectRepo.createMany({
				data: withOrder(projectRepos.map((repo) => ({ repo }))),
			}),
	);
	await seedIfEmpty(
		() => prisma.experienceEntry.count(),
		() => prisma.experienceEntry.createMany({ data: withOrder(experiences) }),
	);
	await seedIfEmpty(
		() => prisma.skillCategory.count(),
		() => prisma.skillCategory.createMany({ data: withOrder(skillCategories) }),
	);
	await seedIfEmpty(
		() => prisma.educationEntry.count(),
		() => prisma.educationEntry.createMany({ data: withOrder(education) }),
	);
	await prisma.blogPost.createMany({
		data: await readBlogPosts(),
		skipDuplicates: true,
	});
}

main()
	.catch((error) => {
		console.error(error);
		process.exitCode = 1;
	})
	.finally(() => prisma.$disconnect());
