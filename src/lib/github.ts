import "server-only";
import { CACHE_KEYS, cached } from "@/lib/cache";
import { getProjectRepos } from "@/lib/content";
import { GITHUB_USERNAME } from "@/lib/site";

const API = "https://api.github.com";
const CACHE_TTL = 15 * 60;

export interface ContributionDay {
	date: string;
	contributionCount: number;
}

export interface Week {
	contributionDays: ContributionDay[];
}

export interface Language {
	name: string;
	color: string | null;
	percentage: number;
}

export interface GitHubStats {
	repos: number;
	followers: number;
	following: number;
	totalContributions: number;
	privateContributions: number;
	weeks: Week[];
	topLanguages: Language[];
}

export interface Project {
	id: number;
	name: string;
	fullName: string;
	description: string;
	languages: string[];
	stars: number;
	forks: number;
	url: string;
	homepage: string;
	topics: string[];
}

function headers(): HeadersInit {
	const token = process.env.GITHUB_TOKEN;
	return {
		Accept: "application/vnd.github+json",
		"Content-Type": "application/json",
		...(token && { Authorization: `Bearer ${token}` }),
	};
}

async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
	const res = await fetch(url, {
		...init,
		headers: headers(),
		cache: "no-store",
	});
	if (!res.ok) throw new Error(`GitHub ${res.status}: ${url}`);
	return res.json() as Promise<T>;
}

const STATS_QUERY = `
query($username: String!) {
  viewer {
    contributionsCollection {
      restrictedContributionsCount
      contributionCalendar {
        totalContributions
        weeks { contributionDays { contributionCount date } }
      }
    }
  }
  user(login: $username) {
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC) {
      nodes {
        languages(first: 5, orderBy: { field: SIZE, direction: DESC }) {
          edges { size node { name color } }
        }
      }
    }
  }
}`;

interface StatsResponse {
	data?: {
		viewer?: {
			contributionsCollection?: {
				restrictedContributionsCount: number;
				contributionCalendar: { totalContributions: number; weeks: Week[] };
			};
		};
		user?: {
			repositories: {
				nodes: {
					languages: {
						edges: { size: number; node: { name: string; color: string } }[];
					};
				}[];
			};
		};
	};
}

function topLanguages(
	repos: NonNullable<StatsResponse["data"]>["user"],
): Language[] {
	const totals = new Map<string, { color: string; size: number }>();
	for (const repo of repos?.repositories.nodes ?? []) {
		for (const { size, node } of repo.languages.edges) {
			const entry = totals.get(node.name) ?? { color: node.color, size: 0 };
			entry.size += size;
			totals.set(node.name, entry);
		}
	}
	const sum = [...totals.values()].reduce((acc, lang) => acc + lang.size, 0);
	return [...totals.entries()]
		.sort((a, b) => b[1].size - a[1].size)
		.slice(0, 6)
		.map(([name, { color, size }]) => ({
			name,
			color,
			percentage: Math.round((size / sum) * 100),
		}));
}

async function fetchStats(): Promise<GitHubStats> {
	const [user, graphql] = await Promise.all([
		getJson<{ public_repos: number; followers: number; following: number }>(
			`${API}/users/${GITHUB_USERNAME}`,
		),
		getJson<StatsResponse>(`${API}/graphql`, {
			method: "POST",
			body: JSON.stringify({
				query: STATS_QUERY,
				variables: { username: GITHUB_USERNAME },
			}),
		}),
	]);
	const contributions = graphql.data?.viewer?.contributionsCollection;

	return {
		repos: user.public_repos,
		followers: user.followers,
		following: user.following,
		totalContributions:
			contributions?.contributionCalendar.totalContributions ?? 0,
		privateContributions: contributions?.restrictedContributionsCount ?? 0,
		weeks: contributions?.contributionCalendar.weeks ?? [],
		topLanguages: topLanguages(graphql.data?.user),
	};
}

/** Profile numbers, contribution calendar and language mix; null if GitHub fails. */
export function getGitHubStats(): Promise<GitHubStats | null> {
	return cached(CACHE_KEYS.githubStats, fetchStats, CACHE_TTL).catch(
		() => null,
	);
}

interface RepoResponse {
	name: string;
	full_name: string;
	description: string | null;
	stargazers_count: number;
	forks_count: number;
	html_url: string;
	homepage: string | null;
	topics?: string[];
}

function parseRepoUrl(url: string) {
	const match = url.match(/github\.com\/([^/]+)\/([^/#?]+)/);
	return match ? `${match[1]}/${match[2]}` : null;
}

async function fetchProject(id: number, url: string): Promise<Project | null> {
	const slug = parseRepoUrl(url);
	if (!slug) return null;
	try {
		const [repo, languages] = await Promise.all([
			getJson<RepoResponse>(`${API}/repos/${slug}`),
			getJson<Record<string, number>>(`${API}/repos/${slug}/languages`).catch(
				() => ({}),
			),
		]);
		return {
			id,
			name: repo.name,
			fullName: repo.full_name,
			description: repo.description ?? "",
			languages: Object.keys(languages),
			stars: repo.stargazers_count,
			forks: repo.forks_count,
			url: repo.html_url,
			homepage: repo.homepage ?? "",
			topics: repo.topics ?? [],
		};
	} catch {
		return null;
	}
}

/** The repositories listed in the admin panel, enriched with live GitHub data. */
export function getProjects(): Promise<Project[]> {
	return cached(
		CACHE_KEYS.githubProjects,
		async () => {
			const repos = await getProjectRepos();
			const projects = await Promise.all(
				repos.map((repo) => fetchProject(repo.id, repo.repo)),
			);
			const available = projects.filter((project) => project !== null);
			// Don't cache an outage as "no projects".
			if (repos.length > 0 && available.length === 0) {
				throw new Error("GitHub repositories are unavailable");
			}
			return available;
		},
		CACHE_TTL,
	);
}
