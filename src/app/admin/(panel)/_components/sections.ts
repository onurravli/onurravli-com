import {
	BarChart2,
	Book,
	Briefcase,
	FolderGit2,
	GraduationCap,
	Link2,
	type LucideIcon,
	Palette,
	Quote,
	Settings,
	Type,
	Wrench,
} from "lucide-react";

interface AdminSection {
	/** URL segment: /admin/<slug>. */
	slug: string;
	label: string;
	/** Page heading, when it differs from the sidebar label. */
	title?: string;
	icon: LucideIcon;
}

export const SECTION_GROUPS: { label: string; sections: AdminSection[] }[] = [
	{
		label: "Content",
		sections: [
			{ slug: "hero", label: "Hero", icon: Type },
			{ slug: "experience", label: "Experience", icon: Briefcase },
			{ slug: "skills", label: "Skills", icon: Wrench },
			{ slug: "education", label: "Education", icon: GraduationCap },
			{ slug: "blog", label: "Blog", icon: Book },
			{ slug: "recommendations", label: "Recommendations", icon: Quote },
		],
	},
	{
		label: "Links & Media",
		sections: [
			{ slug: "social", label: "Social Links", icon: Link2 },
			{
				slug: "projects",
				label: "Projects",
				title: "Project Repositories",
				icon: FolderGit2,
			},
		],
	},
	{
		label: "Appearance",
		sections: [
			{ slug: "accent", label: "Accent Color", icon: Palette },
			{ slug: "settings", label: "Site Settings", icon: Settings },
		],
	},
	{
		label: "Analytics",
		sections: [{ slug: "analytics", label: "Analytics", icon: BarChart2 }],
	},
];

export const DEFAULT_SECTION = "hero";

export function sectionFromPath(pathname: string): AdminSection | undefined {
	const slug = pathname.split("/")[2] ?? DEFAULT_SECTION;
	return SECTION_GROUPS.flatMap((group) => group.sections).find(
		(section) => section.slug === slug,
	);
}
