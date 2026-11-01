"use client";

import type { CollectionRow } from "@/lib/admin/collections";
import { Field, inputClass } from "../form-fields";
import { type FormProps, ListEditor } from "../list-editor";

type Row = CollectionRow<"socialLinks">;
type Form = Pick<Row, "label" | "href" | "iconName" | "target">;

const EMPTY: Form = { label: "", href: "", iconName: "", target: "_blank" };

function LinkForm({ form, onChange }: FormProps<Form>) {
	return (
		<div className="grid grid-cols-2 gap-2">
			<Field label="Label">
				<input
					className={inputClass}
					placeholder="GitHub"
					value={form.label}
					onChange={(e) => onChange({ label: e.target.value })}
				/>
			</Field>
			<Field label="URL">
				<input
					className={inputClass}
					placeholder="https://..."
					value={form.href}
					onChange={(e) => onChange({ href: e.target.value })}
				/>
			</Field>
			<Field label="Icon Name">
				<input
					className={inputClass}
					placeholder="github"
					value={form.iconName}
					onChange={(e) => onChange({ iconName: e.target.value })}
				/>
			</Field>
			<Field label="Target">
				<select
					className={inputClass}
					value={form.target}
					onChange={(e) => onChange({ target: e.target.value })}
				>
					<option value="_blank">_blank</option>
					<option value="_self">_self</option>
				</select>
			</Field>
		</div>
	);
}

function LinkSummary({ item }: { item: Row }) {
	return (
		<div className="flex flex-col gap-0.5">
			<span className="text-sm font-medium text-foreground">{item.label}</span>
			<span className="text-xs text-muted-foreground truncate">
				{item.href}
			</span>
			<span className="text-xs text-muted-foreground">{item.iconName}</span>
		</div>
	);
}

export function SocialLinksEditor({ items }: { items: Row[] }) {
	return (
		<ListEditor
			collection="socialLinks"
			initialItems={items}
			noun="Social link"
			plural="social links"
			addLabel="+ Add Social Link"
			newTitle="New Social Link"
			emptyForm={EMPTY}
			toForm={({ label, href, iconName, target }) => ({
				label,
				href,
				iconName,
				target,
			})}
			toInput={(form) => ({
				...form,
				target: form.target === "_self" ? "_self" : "_blank",
			})}
			canAdd={(form) => Boolean(form.label && form.href)}
			describe={(form) => form.label || form.href}
			Form={LinkForm}
			Summary={LinkSummary}
		/>
	);
}
