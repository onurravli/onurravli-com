"use client";

import type { CollectionRow } from "@/lib/admin/collections";
import { Field, inputClass } from "../form-fields";
import { type FormProps, ListEditor } from "../list-editor";

type Row = CollectionRow<"recommendations">;
type Form = Omit<Row, "id" | "sortOrder">;

const EMPTY: Form = {
	personName: "",
	personTitle: "",
	personCompany: "",
	personAvatarUrl: "",
	body: "",
	date: "",
};

const EXCERPT_LENGTH = 60;

function RecommendationForm({ form, onChange }: FormProps<Form>) {
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
				<Field label="Name">{text("personName", "Jane Smith")}</Field>
				<Field label="Title">{text("personTitle", "Senior Engineer")}</Field>
				<Field label="Company">{text("personCompany", "Acme Inc.")}</Field>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
				<Field label="Avatar URL" hint="optional">
					{text("personAvatarUrl", "https://...")}
				</Field>
				<Field label="Date" hint="optional">
					{text("date", "Jan 2025")}
				</Field>
			</div>
			<Field label="Recommendation">
				<textarea
					className={`${inputClass} resize-none`}
					rows={4}
					value={form.body}
					onChange={(e) => onChange({ body: e.target.value })}
					placeholder="Write what this person said about working with you…"
				/>
			</Field>
		</div>
	);
}

function RecommendationSummary({ item }: { item: Row }) {
	return (
		<>
			<p className="text-sm font-medium text-foreground truncate">
				{item.personName}{" "}
				{item.personTitle && (
					<span className="text-muted-foreground font-normal">
						· {item.personTitle}
					</span>
				)}
			</p>
			<p className="text-xs text-muted-foreground truncate">
				{item.personCompany && `${item.personCompany} · `}
				{item.body.slice(0, EXCERPT_LENGTH)}
				{item.body.length > EXCERPT_LENGTH ? "…" : ""}
			</p>
		</>
	);
}

export function RecommendationsEditor({ items }: { items: Row[] }) {
	return (
		<ListEditor
			collection="recommendations"
			initialItems={items}
			noun="Recommendation"
			plural="recommendations"
			addLabel="+ Add Recommendation"
			newTitle="New Recommendation"
			emptyForm={EMPTY}
			toForm={({ id: _, sortOrder: __, ...row }) => row}
			toInput={(form) => form}
			canAdd={(form) => Boolean(form.personName && form.body)}
			describe={(form) => form.personName}
			Form={RecommendationForm}
			Summary={RecommendationSummary}
		/>
	);
}
