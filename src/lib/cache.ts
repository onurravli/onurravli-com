import "server-only";
import { redis } from "@/lib/redis";

export const CACHE_KEYS = {
	settings: "site:settings",
	socialLinks: "content:social-links",
	projectRepos: "content:project-repos",
	experiences: "content:experiences",
	skillCategories: "content:skill-categories",
	education: "content:education",
	recommendations: "content:recommendations",
	blogPosts: "content:blog-published",
	githubStats: "github:stats",
	githubProjects: "github:repos",
} as const;

export type CacheKey = (typeof CACHE_KEYS)[keyof typeof CACHE_KEYS];

/**
 * Read-through cache. A Redis outage only costs a direct read: cache errors are
 * swallowed, while loader errors propagate to the caller.
 */
export async function cached<T>(
	key: CacheKey,
	loader: () => Promise<T>,
	ttlSeconds = 3600,
): Promise<T> {
	try {
		const hit = await redis().get<T>(key);
		if (hit !== null) return hit;
	} catch {}

	const value = await loader();
	try {
		await redis().set(key, value, { ex: ttlSeconds });
	} catch {}
	return value;
}

export async function invalidate(...keys: CacheKey[]): Promise<void> {
	try {
		await redis().del(...keys);
	} catch {}
}
