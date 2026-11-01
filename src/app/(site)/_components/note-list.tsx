/**
 * Bullet notes. A leading "Label: rest" (as used in experience notes) renders
 * the label with emphasis so long lists stay scannable.
 */
export function NoteList({ notes }: { notes: string[] }) {
	if (notes.length === 0) return null;

	return (
		<ul className="mt-3 space-y-2 text-[0.9375rem] leading-relaxed text-foreground/80">
			{notes.map((note) => {
				const match = note.match(/^([^:.]{3,60}):\s+(.+)$/);
				return (
					<li
						key={note}
						className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2 before:bg-muted-foreground/50"
					>
						{match ? (
							<>
								<span className="font-medium text-foreground">{match[1]}.</span>{" "}
								{match[2]}
							</>
						) : (
							note
						)}
					</li>
				);
			})}
		</ul>
	);
}
