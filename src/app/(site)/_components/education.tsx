import { Section } from "@/components/site/section";
import type { EducationEntry } from "@/lib/content";
import { NoteList } from "./note-list";

export function EducationSection({ items }: { items: EducationEntry[] }) {
	if (items.length === 0) return null;

	return (
		<Section id="education" title="Education">
			<ol className="flex flex-col gap-10">
				{items.map((item) => (
					<li key={item.id}>
						<div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
							<h3 className="font-medium text-foreground">
								{item.department}
								<span className="text-muted-foreground"> · </span>
								{item.school}
							</h3>
							<p className="shrink-0 font-mono text-xs text-muted-foreground">
								{item.startDate} — {item.endDate}
							</p>
						</div>
						<p className="mt-1 text-sm text-muted-foreground">
							{[item.degree, item.location].filter(Boolean).join(", ")}
						</p>
						<NoteList notes={item.notes} />
					</li>
				))}
			</ol>
		</Section>
	);
}
