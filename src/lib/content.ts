import "server-only";
import readingTime from "reading-time";
import type {
	BlogPost as BlogPostRow,
	EducationEntry,
	ExperienceEntry,
	RecommendationEntry,
	SkillCategory,
	SocialLink,
} from "@/generated/prisma/client";
import { CACHE_KEYS, cached } from "@/lib/cache";
import { db } from "@/lib/db";

export type {
	EducationEntry,
	ExperienceEntry,
	RecommendationEntry,
	SkillCategory,
	SocialLink,
};

export type BlogPost = Pick<
	BlogPostRow,
	"id" | "slug" | "title" | "description" | "date" | "tags" | "images"
> & {
	content: string;
	/** Estimated reading time in minutes. */
	readingTime: number;
};

const bySortOrder = { orderBy: { sortOrder: "asc" } } as const;

export const getSocialLinks = () =>
	cached(CACHE_KEYS.socialLinks, () => db.socialLink.findMany(bySortOrder));

export const getProjectRepos = () =>
	cached(CACHE_KEYS.projectRepos, () => db.projectRepo.findMany(bySortOrder));

export const getExperiences = () =>
	cached(CACHE_KEYS.experiences, () =>
		db.experienceEntry.findMany(bySortOrder),
	);

export const getSkillCategories = () =>
	cached(CACHE_KEYS.skillCategories, () =>
		db.skillCategory.findMany(bySortOrder),
	);

export const getEducation = () =>
	cached(CACHE_KEYS.education, () => db.educationEntry.findMany(bySortOrder));

export const getRecommendations = () =>
	cached(CACHE_KEYS.recommendations, () =>
		db.recommendationEntry.findMany(bySortOrder),
	);

/** Published posts, newest first. */
export const getPublishedPosts = () =>
	cached(CACHE_KEYS.blogPosts, async (): Promise<BlogPost[]> => {
		const rows = await db.blogPost.findMany({
			where: { published: true },
			orderBy: { date: "desc" },
			select: {
				id: true,
				slug: true,
				title: true,
				description: true,
				date: true,
				tags: true,
				images: true,
				content: true,
			},
		});
		return rows.map((row) => ({
			...row,
			readingTime: readingTime(row.content).minutes,
		}));
	});

export async function getPublishedPost(slug: string) {
	return (await getPublishedPosts()).find((post) => post.slug === slug);
}

/** The role whose end date is "Present", if any. */
export function currentRole(experiences: ExperienceEntry[]) {
	return experiences.find(
		(item) => item.endDate.trim().toLowerCase() === "present",
	);
}
