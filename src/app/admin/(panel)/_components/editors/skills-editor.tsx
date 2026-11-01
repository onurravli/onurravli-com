"use client";

import type { CollectionRow } from "@/lib/admin/collections";
import { Field, inputClass, splitCommas } from "../form-fields";
import { type FormProps, ListEditor } from "../list-editor";

type Row = CollectionRow<"skillCategories">;
type Form = { title: string; skills: string };

const PREVIEW_COUNT = 5;

function CategoryForm({ form, onChange }: FormProps<Form>) {
	return (
		<div className="flex flex-col gap-3">
			<Field label="Title">
				<input
					className={inputClass}
					value={form.title}
					onChange={(e) => onChange({ title: e.target.value })}
					placeholder="Programming Languages"
				/>
			</Field>
			<Field label="Skills" hint="comma-separated">
				<input
					className={inputClass}
					value={form.skills}
					onChange={(e) => onChange({ skills: e.target.value })}
					placeholder="JavaScript, TypeScript, Python"
				/>
			</Field>
		</div>
	);
}

function CategorySummary({ item }: { item: Row }) {
	const hidden = item.skills.length - PREVIEW_COUNT;
	return (
		<>
			<p className="text-sm font-medium text-foreground">{item.title}</p>
			<p className="text-xs text-muted-foreground truncate">
				{item.skills.slice(0, PREVIEW_COUNT).join(", ")}
				{hidden > 0 && ` +${hidden} more`}
			</p>
		</>
	);
}

export function SkillsEditor({ items }: { items: Row[] }) {
	return (
		<ListEditor
			collection="skillCategories"
			initialItems={items}
			noun="Skill category"
			plural="skill categories"
			addLabel="+ Add Category"
			newTitle="New Category"
			emptyForm={{ title: "", skills: "" }}
			toForm={({ title, skills }) => ({ title, skills: skills.join(", ") })}
			toInput={(form) => ({
				title: form.title,
				skills: splitCommas(form.skills),
			})}
			canAdd={(form) => Boolean(form.title)}
			describe={(form) => form.title}
			Form={CategoryForm}
			Summary={CategorySummary}
		/>
	);
}
