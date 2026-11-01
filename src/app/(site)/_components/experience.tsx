import { Section } from "@/components/site/section";
import { TagList } from "@/components/site/tag-list";
import type { ExperienceEntry } from "@/lib/content";
import { NoteList } from "./note-list";

export function ExperienceSection({ items }: { items: ExperienceEntry[] }) {
	if (items.length === 0) return null;

	return (
		<Section id="experience" title="Experience">
			<ol className="flex flex-col gap-12">
				{items.map((item) => (
					<li key={item.id}>
						<div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
							<h3 className="font-medium text-foreground">
								{item.position}
								<span className="text-muted-foreground"> · </span>
								{item.companyWebsite ? (
									<a
										href={item.companyWebsite}
										target="_blank"
										rel="noopener noreferrer"
										className="link"
									>
										{item.companyName}
									</a>
								) : (
									item.companyName
								)}
							</h3>
							<p className="shrink-0 font-mono text-xs text-muted-foreground">
								{item.startDate} — {item.endDate}
							</p>
						</div>
						{item.location && (
							<p className="mt-1 text-sm text-muted-foreground">
								{item.location}
							</p>
						)}
						<NoteList notes={item.notes} />
						<TagList
							tags={item.technologies}
							label="Technologies"
							className="mt-4"
						/>
					</li>
				))}
			</ol>
		</Section>
	);
}
