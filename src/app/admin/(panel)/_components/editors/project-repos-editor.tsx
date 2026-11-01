"use client";

import type { CollectionRow } from "@/lib/admin/collections";
import { inputClass } from "../form-fields";
import { type FormProps, ListEditor } from "../list-editor";

type Row = CollectionRow<"projectRepos">;
type Form = { repo: string };

function RepoForm({ form, onChange }: FormProps<Form>) {
	return (
		<input
			className={`${inputClass} flex-1`}
			placeholder="https://github.com/owner/repo"
			value={form.repo}
			onChange={(e) => onChange({ repo: e.target.value })}
		/>
	);
}

function RepoSummary({ item }: { item: Row }) {
	return <p className="text-sm text-foreground truncate">{item.repo}</p>;
}

export function ProjectReposEditor({ items }: { items: Row[] }) {
	return (
		<ListEditor
			collection="projectRepos"
			initialItems={items}
			noun="Repository"
			plural="repositories"
			addLabel="+ Add Repository"
			emptyForm={{ repo: "" }}
			toForm={({ repo }) => ({ repo })}
			toInput={({ repo }) => ({ repo: repo.trim() })}
			canAdd={(form) => Boolean(form.repo.trim())}
			describe={(form) => form.repo}
			Form={RepoForm}
			Summary={RepoSummary}
			inline
		/>
	);
}
