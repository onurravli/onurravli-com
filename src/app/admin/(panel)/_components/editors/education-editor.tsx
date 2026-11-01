"use client";

import type { CollectionRow } from "@/lib/admin/collections";
import { Field, inputClass, splitLines } from "../form-fields";
import { type FormProps, ListEditor } from "../list-editor";

type Row = CollectionRow<"education">;
type Form = Omit<Row, "id" | "sortOrder" | "notes"> & { notes: string };

const EMPTY: Form = {
	school: "",
	degree: "",
	department: "",
	startDate: "",
	endDate: "",
	location: "",
	notes: "",
};

function EducationForm({ form, onChange }: FormProps<Form>) {
	const text = (key: keyof Form, placeholder: string) => (
		<input
			className={inputClass}
			value={form[key]}
			onChange={(e) => onChange({ [key]: e.target.value })}
			placeholder={placeholder}
		/>
	);

	return (
		<div className="flex flex-col gap-3">
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
				<Field label="School">{text("school", "MIT")}</Field>
				<Field label="Degree">{text("degree", "Bachelor of Science")}</Field>
				<Field label="Department">
					{text("department", "Computer Science")}
				</Field>
			</div>
			<div className="grid grid-cols-3 gap-2">
				<Field label="Start Date">{text("startDate", "2020")}</Field>
				<Field label="End Date">{text("endDate", "2024")}</Field>
				<Field label="Location">{text("location", "Cambridge, MA")}</Field>
			</div>
			<Field label="Notes" hint="one per line">
				<textarea
					className={`${inputClass} resize-none`}
					rows={3}
					value={form.notes}
					onChange={(e) => onChange({ notes: e.target.value })}
					placeholder="Dean's list, clubs, awards…"
				/>
			</Field>
		</div>
	);
}

function EducationSummary({ item }: { item: Row }) {
	return (
		<>
			<p className="text-sm font-medium text-foreground truncate">
				{item.degree}{" "}
				<span className="text-muted-foreground font-normal">
					in {item.department}
				</span>
			</p>
			<p className="text-xs text-muted-foreground">
				{item.school} · {item.startDate} – {item.endDate}
			</p>
		</>
	);
}

export function EducationEditor({ items }: { items: Row[] }) {
	return (
		<ListEditor
			collection="education"
			initialItems={items}
			noun="Education entry"
			plural="education entries"
			addLabel="+ Add Education"
			newTitle="New Education Entry"
			emptyForm={EMPTY}
			toForm={({ id: _, sortOrder: __, notes, ...row }) => ({
				...row,
				notes: notes.join("\n"),
			})}
			toInput={(form) => ({ ...form, notes: splitLines(form.notes) })}
			canAdd={(form) => Boolean(form.school && form.degree)}
			describe={(form) => `${form.degree} at ${form.school}`}
			Form={EducationForm}
			Summary={EducationSummary}
		/>
	);
}
