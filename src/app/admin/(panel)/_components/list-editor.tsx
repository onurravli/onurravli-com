"use client";

import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { CollectionRow } from "@/lib/admin/collections";
import type { CollectionInput, CollectionName } from "@/lib/admin/schemas";
import { cn } from "@/lib/utils";
import { createItem, deleteItem, reorderItems, updateItem } from "../actions";
import { buttonClass } from "./form-fields";
import { SortableItem } from "./sortable-item";

export interface FormProps<F> {
	form: F;
	onChange: (patch: Partial<F>) => void;
}

interface ListEditorProps<C extends CollectionName, F> {
	collection: C;
	initialItems: CollectionRow<C>[];
	/** Sentence-case singular, e.g. "Social link". */
	noun: string;
	/** Lower-case plural, e.g. "social links". */
	plural: string;
	addLabel: string;
	newTitle?: string;
	emptyForm: F;
	toForm: (item: CollectionRow<C>) => F;
	toInput: (form: F) => CollectionInput<C>;
	canAdd: (form: F) => boolean;
	/** Toast detail for an item, e.g. its title. */
	describe: (form: F) => string;
	Form: (props: FormProps<F>) => React.ReactNode;
	Summary: (props: { item: CollectionRow<C> }) => React.ReactNode;
	/** Render the form and its buttons on one row (single-field lists). */
	inline?: boolean;
}

/** A drag-to-reorder list with inline edit, delete and add, saved via Server Functions. */
export function ListEditor<C extends CollectionName, F>({
	collection,
	initialItems,
	noun,
	plural,
	addLabel,
	newTitle,
	emptyForm,
	toForm,
	toInput,
	canAdd,
	describe,
	Form,
	Summary,
	inline = false,
}: ListEditorProps<C, F>) {
	const [items, setItems] = useState(initialItems);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [editForm, setEditForm] = useState(emptyForm);
	const [addForm, setAddForm] = useState(emptyForm);
	const [adding, setAdding] = useState(false);
	const [isPending, startTransition] = useTransition();
	const sensors = useSensors(useSensor(PointerSensor));

	function run(action: () => Promise<void>, failure: string) {
		startTransition(async () => {
			try {
				await action();
			} catch {
				toast.error(failure, { description: "Please try again." });
			}
		});
	}

	function onDragEnd({ active, over }: DragEndEvent) {
		if (!over || active.id === over.id) return;
		const reordered = arrayMove(
			items,
			items.findIndex((item) => item.id === active.id),
			items.findIndex((item) => item.id === over.id),
		);
		setItems(reordered);
		run(async () => {
			await reorderItems(
				collection,
				reordered.map((item) => item.id),
			);
			toast.success(`${noun} order updated`);
		}, `Failed to reorder ${plural}`);
	}

	function save(id: number) {
		const input = toInput(editForm);
		run(async () => {
			const updated = await updateItem(collection, id, input);
			setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
			setEditingId(null);
			toast.success(`${noun} updated`, { description: describe(editForm) });
		}, `Failed to update ${noun.toLowerCase()}`);
	}

	function remove(item: CollectionRow<C>) {
		run(async () => {
			await deleteItem(collection, item.id);
			setItems((prev) => prev.filter((other) => other.id !== item.id));
			toast.success(`${noun} deleted`, { description: describe(toForm(item)) });
		}, `Failed to delete ${noun.toLowerCase()}`);
	}

	function add() {
		const input = toInput(addForm);
		run(async () => {
			const created = await createItem(collection, input);
			setItems((prev) => [...prev, created]);
			setAddForm(emptyForm);
			setAdding(false);
			toast.success(`${noun} added`, { description: describe(addForm) });
		}, `Failed to add ${noun.toLowerCase()}`);
	}

	const actions = (
		onCancel: () => void,
		onSave: () => void,
		label: string,
		disabled: boolean,
	) => (
		<div className="flex gap-2 justify-end">
			<button
				type="button"
				onClick={onCancel}
				className={buttonClass.secondary}
			>
				Cancel
			</button>
			<button
				type="button"
				disabled={disabled}
				onClick={onSave}
				className={buttonClass.primary}
			>
				{label}
			</button>
		</div>
	);

	const layout = inline ? "flex gap-2 items-center" : "flex flex-col gap-3";

	return (
		<div className="rounded-lg border border-border bg-card p-5 flex flex-col gap-4">
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={onDragEnd}
			>
				<SortableContext
					items={items.map((item) => item.id)}
					strategy={verticalListSortingStrategy}
				>
					<div className="flex flex-col gap-2">
						{items.map((item) => (
							<SortableItem key={item.id} id={item.id}>
								{editingId === item.id ? (
									<div className={layout}>
										<Form
											form={editForm}
											onChange={(patch) =>
												setEditForm((form) => ({ ...form, ...patch }))
											}
										/>
										{actions(
											() => setEditingId(null),
											() => save(item.id),
											"Save",
											isPending,
										)}
									</div>
								) : (
									<div className="flex items-center gap-3">
										<div className="flex-1 min-w-0">
											<Summary item={item} />
										</div>
										<div className="flex items-center gap-1 shrink-0">
											<button
												type="button"
												onClick={() => {
													setEditingId(item.id);
													setEditForm(toForm(item));
												}}
												className={buttonClass.edit}
											>
												Edit
											</button>
											<button
												type="button"
												disabled={isPending}
												onClick={() => remove(item)}
												className={buttonClass.delete}
											>
												Delete
											</button>
										</div>
									</div>
								)}
							</SortableItem>
						))}
					</div>
				</SortableContext>
			</DndContext>

			{adding ? (
				<div
					className={cn(
						layout,
						!inline && "rounded-md border border-border bg-background p-3",
					)}
				>
					{newTitle && (
						<p className="text-xs font-medium text-muted-foreground">
							{newTitle}
						</p>
					)}
					<Form
						form={addForm}
						onChange={(patch) => setAddForm((form) => ({ ...form, ...patch }))}
					/>
					{actions(
						() => {
							setAdding(false);
							setAddForm(emptyForm);
						},
						add,
						"Add",
						isPending || !canAdd(addForm),
					)}
				</div>
			) : (
				<button
					type="button"
					onClick={() => setAdding(true)}
					className="rounded-md border border-dashed border-border px-4 py-2 text-sm text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
				>
					{addLabel}
				</button>
			)}
		</div>
	);
}
