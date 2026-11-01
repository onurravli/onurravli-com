import { z } from "zod";

/** Input schemas for admin edits, shared by the forms and the Server Functions. */

const text = z.string().trim();
const required = text.min(1);
const list = z.array(required);
const target = z.enum(["_self", "_blank"]);

export const heroSchema = z.object({
	name: required,
	title: required,
	description: required,
	heroPrimaryCtaText: text,
	heroPrimaryCtaHref: text,
	heroPrimaryCtaTarget: target,
	heroSecondaryCtaText: text,
	heroSecondaryCtaHref: text,
	heroSecondaryCtaTarget: target,
});

export const siteSettingsSchema = z.object({
	imagePath: z.url(),
	heroShowImage: z.boolean(),
	footerCopyright: required,
	opengraphSubtitle: required,
});

export const collectionSchemas = {
	socialLinks: z.object({
		label: required,
		href: required,
		iconName: text,
		target,
	}),
	projectRepos: z.object({
		repo: z
			.url()
			.regex(/github\.com\/[^/]+\/[^/]+/, "Must be a GitHub repository URL"),
	}),
	experiences: z.object({
		position: required,
		companyName: required,
		companyWebsite: text,
		location: text,
		startDate: text,
		endDate: text,
		icon: text,
		notes: list,
		technologies: list,
	}),
	skillCategories: z.object({
		title: required,
		skills: list,
	}),
	education: z.object({
		school: required,
		degree: required,
		department: text,
		startDate: text,
		endDate: text,
		location: text,
		notes: list,
	}),
	recommendations: z.object({
		personName: required,
		personTitle: text,
		personCompany: text,
		personAvatarUrl: text,
		body: required,
		date: text,
	}),
};

export type CollectionName = keyof typeof collectionSchemas;
export type CollectionInput<C extends CollectionName> = z.input<
	(typeof collectionSchemas)[C]
>;

export const blogPostSchema = z.object({
	slug: required.regex(
		/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
		"Use lowercase words separated by dashes",
	),
	title: required,
	description: text,
	date: z.iso.date(),
	tags: list,
	images: list,
	content: z.string(),
	published: z.boolean(),
});

export type BlogPostInput = z.input<typeof blogPostSchema>;
