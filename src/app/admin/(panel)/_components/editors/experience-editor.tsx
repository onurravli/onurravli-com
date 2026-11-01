"use client";

import type { CollectionRow } from "@/lib/admin/collections";
import { Field, inputClass, splitCommas, splitLines } from "../form-fields";
import { type FormProps, ListEditor } from "../list-editor";

type Row = CollectionRow<"experiences">;
type Form = Omit<Row, "id" | "sortOrder" | "notes" | "technologies"> & {
	notes: string;
	technologies: string;
};

const EMPTY: Form = {
	position: "",
	companyName: "",
	companyWebsite: "",
	location: "",
	startDate: "",
	endDate: "",
	icon: "🚀",
	notes: "",
	technologies: "",
};

function ExperienceForm({ form, onChange }: FormProps<Form>) {
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
				<Field label="Position">{text("position", "Software Developer")}</Field>
				<Field label="Company">{text("companyName", "Acme Inc.")}</Field>
				<Field label="Company Website">
					{text("companyWebsite", "https://acme.com")}
				</Field>
			</div>
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
				<Field label="Start Date">{text("startDate", "Jan 2024")}</Field>
				<Field label="End Date">{text("endDate", "Present")}</Field>
				<Field label="Location">{text("location", "Remote")}</Field>
				<Field label="Icon">{text("icon", "🚀")}</Field>
			</div>
			<Field label="Technologies" hint="comma-separated">
				{text("technologies", "TypeScript, React, Node.js")}
			</Field>
			<Field label="Notes" hint="one per line">
				<textarea
					className={`${inputClass} resize-none`}
					rows={4}
					value={form.notes}
					onChange={(e) => onChange({ notes: e.target.value })}
					placeholder="Describe your responsibilities and achievements…"
				/>
			</Field>
		</div>
	);
}

function ExperienceSummary({ item }: { item: Row }) {
	return (
		<>
			<p className="text-sm font-medium text-foreground truncate">
				{item.position}{" "}
				<span className="text-muted-foreground font-normal">
					@ {item.companyName}
				</span>
			</p>
			<p className="text-xs text-muted-foreground">
				{item.startDate} – {item.endDate} · {item.location}
			</p>
		</>
	);
}

export function ExperienceEditor({ items }: { items: Row[] }) {
	return (
		<ListEditor
			collection="experiences"
			initialItems={items}
			noun="Experience"
			plural="experience"
			addLabel="+ Add Experience"
			newTitle="New Experience"
			emptyForm={EMPTY}
			toForm={({ id: _, sortOrder: __, notes, technologies, ...row }) => ({
				...row,
				notes: notes.join("\n"),
				technologies: technologies.join(", "),
			})}
			toInput={(form) => ({
				...form,
				notes: splitLines(form.notes),
				technologies: splitCommas(form.technologies),
			})}
			canAdd={(form) => Boolean(form.position && form.companyName)}
			describe={(form) => `${form.position} @ ${form.companyName}`}
			Form={ExperienceForm}
			Summary={ExperienceSummary}
		/>
	);
}
