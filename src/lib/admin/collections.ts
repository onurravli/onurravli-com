import "server-only";
import type { z } from "zod";
import type {
	EducationEntry,
	ExperienceEntry,
	Prisma,
	ProjectRepo,
	RecommendationEntry,
	SkillCategory,
	SocialLink,
} from "@/generated/prisma/client";
import { CACHE_KEYS, type CacheKey } from "@/lib/cache";
import { db } from "@/lib/db";
import type { CollectionName, collectionSchemas } from "./schemas";

/** Persistence for one sortable list edited in the admin panel. */
export interface Collection<Row, Input> {
	cacheKeys: CacheKey[];
	findAll(): Promise<Row[]>;
	count(): Promise<number>;
	create(data: Input & { sortOrder: number }): Promise<Row>;
	update(id: number, data: Input): Promise<Row>;
	remove(id: number): Promise<unknown>;
	/** Batched in one transaction when reordering. */
	setOrder(id: number, sortOrder: number): Prisma.PrismaPromise<unknown>;
}

type Data<C extends CollectionName> = z.output<(typeof collectionSchemas)[C]>;
const bySortOrder = { orderBy: { sortOrder: "asc" } } as const;

export const collections = {
	socialLinks: {
		cacheKeys: [CACHE_KEYS.socialLinks],
		findAll: () => db.socialLink.findMany(bySortOrder),
		count: () => db.socialLink.count(),
		create: (data) => db.socialLink.create({ data }),
		update: (id, data) => db.socialLink.update({ where: { id }, data }),
		remove: (id) => db.socialLink.delete({ where: { id } }),
		setOrder: (id, sortOrder) =>
			db.socialLink.update({ where: { id }, data: { sortOrder } }),
	} satisfies Collection<SocialLink, Data<"socialLinks">>,

	projectRepos: {
		cacheKeys: [CACHE_KEYS.projectRepos, CACHE_KEYS.githubProjects],
		findAll: () => db.projectRepo.findMany(bySortOrder),
		count: () => db.projectRepo.count(),
		create: (data) => db.projectRepo.create({ data }),
		update: (id, data) => db.projectRepo.update({ where: { id }, data }),
		remove: (id) => db.projectRepo.delete({ where: { id } }),
		setOrder: (id, sortOrder) =>
			db.projectRepo.update({ where: { id }, data: { sortOrder } }),
	} satisfies Collection<ProjectRepo, Data<"projectRepos">>,

	experiences: {
		cacheKeys: [CACHE_KEYS.experiences],
		findAll: () => db.experienceEntry.findMany(bySortOrder),
		count: () => db.experienceEntry.count(),
		create: (data) => db.experienceEntry.create({ data }),
		update: (id, data) => db.experienceEntry.update({ where: { id }, data }),
		remove: (id) => db.experienceEntry.delete({ where: { id } }),
		setOrder: (id, sortOrder) =>
			db.experienceEntry.update({ where: { id }, data: { sortOrder } }),
	} satisfies Collection<ExperienceEntry, Data<"experiences">>,

	skillCategories: {
		cacheKeys: [CACHE_KEYS.skillCategories],
		findAll: () => db.skillCategory.findMany(bySortOrder),
		count: () => db.skillCategory.count(),
		create: (data) => db.skillCategory.create({ data }),
		update: (id, data) => db.skillCategory.update({ where: { id }, data }),
		remove: (id) => db.skillCategory.delete({ where: { id } }),
		setOrder: (id, sortOrder) =>
			db.skillCategory.update({ where: { id }, data: { sortOrder } }),
	} satisfies Collection<SkillCategory, Data<"skillCategories">>,

	education: {
		cacheKeys: [CACHE_KEYS.education],
		findAll: () => db.educationEntry.findMany(bySortOrder),
		count: () => db.educationEntry.count(),
		create: (data) => db.educationEntry.create({ data }),
		update: (id, data) => db.educationEntry.update({ where: { id }, data }),
		remove: (id) => db.educationEntry.delete({ where: { id } }),
		setOrder: (id, sortOrder) =>
			db.educationEntry.update({ where: { id }, data: { sortOrder } }),
	} satisfies Collection<EducationEntry, Data<"education">>,

	recommendations: {
		cacheKeys: [CACHE_KEYS.recommendations],
		findAll: () => db.recommendationEntry.findMany(bySortOrder),
		count: () => db.recommendationEntry.count(),
		create: (data) => db.recommendationEntry.create({ data }),
		update: (id, data) =>
			db.recommendationEntry.update({ where: { id }, data }),
		remove: (id) => db.recommendationEntry.delete({ where: { id } }),
		setOrder: (id, sortOrder) =>
			db.recommendationEntry.update({ where: { id }, data: { sortOrder } }),
	} satisfies Collection<RecommendationEntry, Data<"recommendations">>,
};

export type CollectionRow<C extends CollectionName> = Awaited<
	ReturnType<(typeof collections)[C]["findAll"]>
>[number];
