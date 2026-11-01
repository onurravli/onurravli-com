"use server";

import { revalidatePath } from "next/cache";
import { signOut } from "@/auth";
import { isAccentColorKey } from "@/lib/accent-colors";
import {
	type Collection,
	type CollectionRow,
	collections,
} from "@/lib/admin/collections";
import {
	type BlogPostInput,
	blogPostSchema,
	type CollectionInput,
	type CollectionName,
	collectionSchemas,
	heroSchema,
	siteSettingsSchema,
} from "@/lib/admin/schemas";
import { requireAdmin } from "@/lib/auth-guard";
import { CACHE_KEYS, type CacheKey, invalidate } from "@/lib/cache";
import { db } from "@/lib/db";
import { updateSettings } from "@/lib/settings";

/** Drops cached reads and refreshes every page that shows them. */
async function publish(...keys: CacheKey[]) {
	await invalidate(...keys);
	revalidatePath("/", "layout");
}

const formText = (form: FormData, key: string) => String(form.get(key) ?? "");

export async function saveHero(form: FormData) {
	await requireAdmin();
	const data = heroSchema.parse(
		Object.fromEntries(
			Object.keys(heroSchema.shape).map((key) => [key, formText(form, key)]),
		),
	);
	await updateSettings(data);
	revalidatePath("/", "layout");
}

export async function saveSiteSettings(form: FormData) {
	await requireAdmin();
	const data = siteSettingsSchema.parse({
		imagePath: formText(form, "imagePath"),
		heroShowImage: form.get("heroShowImage") === "on",
		footerCopyright: formText(form, "footerCopyright"),
		opengraphSubtitle: formText(form, "opengraphSubtitle"),
	});
	await updateSettings(data);
	revalidatePath("/", "layout");
}

export async function saveAccentColor(accentColor: string) {
	await requireAdmin();
	if (!isAccentColorKey(accentColor)) throw new Error("Unknown accent color");
	await updateSettings({ accentColor });
	revalidatePath("/", "layout");
}

// The registry entry for `name` always matches its schema; the lookup just
// can't express that per key, hence the one widening cast.
function collection<C extends CollectionName>(name: C) {
	return collections[name] as unknown as Collection<
		CollectionRow<C>,
		CollectionInput<C>
	>;
}

export async function createItem<C extends CollectionName>(
	name: C,
	input: CollectionInput<C>,
): Promise<CollectionRow<C>> {
	await requireAdmin();
	const target = collection(name);
	const data = collectionSchemas[name].parse(input) as CollectionInput<C>;
	const row = await target.create({ ...data, sortOrder: await target.count() });
	await publish(...target.cacheKeys);
	return row;
}

export async function updateItem<C extends CollectionName>(
	name: C,
	id: number,
	input: CollectionInput<C>,
): Promise<CollectionRow<C>> {
	await requireAdmin();
	const target = collection(name);
	const data = collectionSchemas[name].parse(input) as CollectionInput<C>;
	const row = await target.update(id, data);
	await publish(...target.cacheKeys);
	return row;
}

export async function deleteItem(name: CollectionName, id: number) {
	await requireAdmin();
	const target = collection(name);
	await target.remove(id);
	await publish(...target.cacheKeys);
}

export async function reorderItems(name: CollectionName, orderedIds: number[]) {
	await requireAdmin();
	const target = collection(name);
	await db.$transaction(
		orderedIds.map((id, index) => target.setOrder(id, index)),
	);
	await publish(...target.cacheKeys);
}

export async function createPost(input: BlogPostInput) {
	await requireAdmin();
	const post = await db.blogPost.create({ data: blogPostSchema.parse(input) });
	await publish(CACHE_KEYS.blogPosts);
	return post;
}

export async function updatePost(id: number, input: BlogPostInput) {
	await requireAdmin();
	const post = await db.blogPost.update({
		where: { id },
		data: blogPostSchema.parse(input),
	});
	await publish(CACHE_KEYS.blogPosts);
	return post;
}

export async function deletePost(id: number) {
	await requireAdmin();
	await db.blogPost.delete({ where: { id } });
	await publish(CACHE_KEYS.blogPosts);
}

export async function signOutAction() {
	await signOut({ redirectTo: "/admin/login" });
}
