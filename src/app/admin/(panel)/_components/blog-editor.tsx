"use client";

import { Check, Pencil, PlusCircle, Trash2, X } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { BlogPost } from "@/generated/prisma/client";
import type { BlogPostInput } from "@/lib/admin/schemas";
import { createPost, deletePost, updatePost } from "../actions";
import { splitCommas, splitLines } from "./form-fields";
import { MdxPreview } from "./mdx-preview";
import { useUnsavedChangesGuard } from "./use-unsaved-changes-guard";

interface PostForm {
	slug: string;
	title: string;
	description: string;
	date: string;
	tags: string;
	images: string;
	content: string;
	published: boolean;
}

const slugify = (title: string) =>
	title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");

const toForm = (post: BlogPost): PostForm => ({
	slug: post.slug,
	title: post.title,
	description: post.description,
	date: post.date,
	tags: post.tags.join(", "),
	images: post.images.join("\n"),
	content: post.content,
	published: post.published,
});

const emptyForm = (): PostForm => ({
	slug: "",
	title: "",
	description: "",
	date: new Date().toISOString().slice(0, 10),
	tags: "",
	images: "",
	content: "",
	published: true,
});

const toInput = (form: PostForm): BlogPostInput => ({
	...form,
	tags: splitCommas(form.tags),
	images: splitLines(form.images),
});

const sameForm = (a: PostForm, b: PostForm) =>
	(Object.keys(a) as (keyof PostForm)[]).every((key) => a[key] === b[key]);

function PostEditor({
	initial,
	onSave,
	onCancel,
	onDirtyChange,
	saving,
}: {
	initial: PostForm;
	onSave: (form: PostForm) => void;
	onCancel: () => void;
	onDirtyChange: (dirty: boolean) => void;
	saving: boolean;
}) {
	const [form, setForm] = useState(initial);
	const dirty = !sameForm(form, initial);

	useEffect(() => {
		onDirtyChange(dirty);
		return () => onDirtyChange(false);
	}, [dirty, onDirtyChange]);

	const set = <K extends keyof PostForm>(key: K, value: PostForm[K]) =>
		setForm((prev) => ({ ...prev, [key]: value }));

	return (
		<div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div className="space-y-1.5">
					<Label htmlFor="title">Title</Label>
					<Input
						id="title"
						value={form.title}
						onChange={(e) =>
							setForm((prev) => ({
								...prev,
								title: e.target.value,
								slug: slugify(e.target.value),
							}))
						}
						placeholder="Post title"
					/>
				</div>
				<div className="space-y-1.5">
					<Label htmlFor="slug">Slug</Label>
					<Input
						id="slug"
						value={form.slug}
						onChange={(e) => set("slug", e.target.value)}
						placeholder="post-slug"
					/>
				</div>
			</div>

			<div className="space-y-1.5">
				<Label htmlFor="description">Description</Label>
				<Input
					id="description"
					value={form.description}
					onChange={(e) => set("description", e.target.value)}
					placeholder="Short description"
				/>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div className="space-y-1.5">
					<Label htmlFor="date">Date</Label>
					<Input
						id="date"
						type="date"
						value={form.date}
						onChange={(e) => set("date", e.target.value)}
					/>
				</div>
				<div className="space-y-1.5">
					<Label htmlFor="tags">Tags (comma-separated)</Label>
					<Input
						id="tags"
						value={form.tags}
						onChange={(e) => set("tags", e.target.value)}
						placeholder="react, typescript, web"
					/>
				</div>
			</div>

			<div className="space-y-1.5">
				<Label htmlFor="images">Images (one URL per line)</Label>
				<Textarea
					id="images"
					rows={2}
					value={form.images}
					onChange={(e) => set("images", e.target.value)}
					placeholder="https://example.com/image.png"
				/>
			</div>

			<div className="space-y-1.5">
				<Label htmlFor="content">Content (Markdown)</Label>
				<Tabs defaultValue="write" className="w-full">
					<TabsList className="grid w-full grid-cols-2 sm:w-auto">
						<TabsTrigger value="write">Write</TabsTrigger>
						<TabsTrigger value="preview">Preview</TabsTrigger>
					</TabsList>
					<TabsContent value="write" className="mt-2">
						<Textarea
							id="content"
							rows={20}
							value={form.content}
							onChange={(e) => set("content", e.target.value)}
							placeholder={"# Hello World\n\nWrite your post content here..."}
							className="font-mono text-sm"
						/>
					</TabsContent>
					<TabsContent value="preview" className="mt-2">
						<div className="min-h-104 rounded-md border border-border bg-background p-4">
							{form.content.trim() ? (
								<MdxPreview content={form.content} />
							) : (
								<p className="text-sm text-muted-foreground">
									Start writing to preview your post.
								</p>
							)}
						</div>
					</TabsContent>
				</Tabs>
			</div>

			<div className="flex items-center gap-2">
				<Switch
					id="published"
					checked={form.published}
					onCheckedChange={(value) => set("published", value)}
				/>
				<Label htmlFor="published">Published</Label>
			</div>

			<div className="flex gap-2 pt-2">
				<Button size="sm" onClick={() => onSave(form)} disabled={saving}>
					<Check className="size-3.5 mr-1" />
					{saving ? "Saving..." : "Save"}
				</Button>
				<Button
					size="sm"
					variant="outline"
					onClick={onCancel}
					disabled={saving}
				>
					<X className="size-3.5 mr-1" />
					Cancel
				</Button>
			</div>
		</div>
	);
}

export function BlogEditor({ initialPosts }: { initialPosts: BlogPost[] }) {
	const [posts, setPosts] = useState(initialPosts);
	const [editing, setEditing] = useState<number | "new" | null>(null);
	const [dirty, setDirty] = useState(false);
	const [isPending, startTransition] = useTransition();
	const confirmDiscard = useUnsavedChangesGuard(dirty);

	function open(target: number | "new" | null) {
		if (!confirmDiscard()) return;
		setDirty(false);
		setEditing(target);
	}

	/** Runs a save; `action` resolves to the success toast's title and detail. */
	function run(action: () => Promise<[string, string]>, failure: string) {
		startTransition(async () => {
			try {
				const [title, description] = await action();
				setDirty(false);
				setEditing(null);
				toast.success(title, { description });
			} catch {
				toast.error(failure, { description: "Please try again." });
			}
		});
	}

	const create = (form: PostForm) =>
		run(async () => {
			const post = await createPost(toInput(form));
			setPosts((prev) => [post, ...prev]);
			return ["Blog post created", post.title || "Your new post was saved."];
		}, "Failed to create blog post");

	const update = (id: number, form: PostForm) =>
		run(async () => {
			const post = await updatePost(id, toInput(form));
			setPosts((prev) => prev.map((p) => (p.id === id ? post : p)));
			return ["Blog post updated", post.title || "Your changes were saved."];
		}, "Failed to update blog post");

	const remove = (post: BlogPost) => {
		if (!window.confirm("Delete this post?")) return;
		run(async () => {
			await deletePost(post.id);
			setPosts((prev) => prev.filter((p) => p.id !== post.id));
			return [
				"Blog post deleted",
				`${post.title || "The selected post"} was removed.`,
			];
		}, "Failed to delete blog post");
	};

	return (
		<div className="space-y-4">
			{editing === "new" ? (
				<PostEditor
					initial={emptyForm()}
					onSave={create}
					onCancel={() => open(null)}
					onDirtyChange={setDirty}
					saving={isPending}
				/>
			) : (
				<Button size="sm" onClick={() => open("new")} disabled={isPending}>
					<PlusCircle className="size-3.5 mr-1.5" />
					New Post
				</Button>
			)}

			<div className="space-y-2">
				{posts.map((post) =>
					editing === post.id ? (
						<PostEditor
							key={post.id}
							initial={toForm(post)}
							onSave={(form) => update(post.id, form)}
							onCancel={() => open(null)}
							onDirtyChange={setDirty}
							saving={isPending}
						/>
					) : (
						<div
							key={post.id}
							className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3"
						>
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2">
									<span className="text-sm font-medium truncate">
										{post.title || "(untitled)"}
									</span>
									<span
										className={
											post.published
												? "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
												: "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground"
										}
									>
										{post.published ? "Published" : "Draft"}
									</span>
								</div>
								<p className="text-xs text-muted-foreground mt-0.5">
									{post.date}
									{post.tags.length > 0 && ` · ${post.tags.join(", ")}`}
								</p>
							</div>
							<div className="flex shrink-0 gap-1">
								<Button
									size="icon"
									variant="ghost"
									className="size-7"
									aria-label={`Edit ${post.title}`}
									onClick={() => open(post.id)}
									disabled={isPending}
								>
									<Pencil className="size-3.5" />
								</Button>
								<Button
									size="icon"
									variant="ghost"
									className="size-7 text-destructive hover:text-destructive"
									aria-label={`Delete ${post.title}`}
									onClick={() => remove(post)}
									disabled={isPending}
								>
									<Trash2 className="size-3.5" />
								</Button>
							</div>
						</div>
					),
				)}

				{posts.length === 0 && editing !== "new" && (
					<p className="text-sm text-muted-foreground py-4 text-center">
						No blog posts yet. Click &quot;New Post&quot; to get started.
					</p>
				)}
			</div>
		</div>
	);
}
