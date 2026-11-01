import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const now = new Date();
	const posts = await getPublishedPosts();

	return [
		{
			url: SITE_URL,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 1,
		},
		...posts.map((post) => {
			const date = new Date(post.date);
			return {
				url: `${SITE_URL}/blog/${post.slug}`,
				lastModified: Number.isNaN(date.getTime()) ? now : date,
				changeFrequency: "yearly" as const,
				priority: 0.7,
			};
		}),
		{
			url: `${SITE_URL}/cv`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${SITE_URL}/llms.txt`,
			lastModified: now,
			changeFrequency: "always",
			priority: 0.5,
		},
	];
}
