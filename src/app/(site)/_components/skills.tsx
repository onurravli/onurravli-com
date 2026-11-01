import { Section } from "@/components/site/section";
import type { SkillCategory } from "@/lib/content";

export function SkillsSection({ items }: { items: SkillCategory[] }) {
	if (items.length === 0) return null;

	return (
		<Section id="skills" title="Skills">
			<dl className="divide-y divide-border border-y border-border">
				{items.map((category) => (
					<div
						key={category.id}
						className="grid gap-1 py-3.5 sm:grid-cols-[11rem_1fr] sm:gap-6"
					>
						<dt className="text-sm text-muted-foreground">{category.title}</dt>
						<dd className="text-[0.9375rem] text-foreground">
							{category.skills.join(", ")}
						</dd>
					</div>
				))}
			</dl>
		</Section>
	);
}
