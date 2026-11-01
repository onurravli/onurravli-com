"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface SortableItemProps {
	id: number;
	children: React.ReactNode;
}

export function SortableItem({ id, children }: SortableItemProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		setActivatorNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="rounded-md border border-border bg-background"
		>
			<div className="flex items-center gap-2">
				<button
					ref={setActivatorNodeRef}
					type="button"
					className="ml-2 shrink-0 cursor-grab active:cursor-grabbing touch-none text-muted-foreground hover:text-foreground"
					{...attributes}
					{...listeners}
					aria-label="Drag to reorder"
				>
					<GripVertical size={16} />
				</button>
				<div className="flex-1 min-w-0 py-3 pr-3">{children}</div>
			</div>
		</div>
	);
}
