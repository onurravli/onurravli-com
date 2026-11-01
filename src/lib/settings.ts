import "server-only";
import type { SiteSettings as SiteSettingsRow } from "@/generated/prisma/client";
import { CACHE_KEYS, cached, invalidate } from "@/lib/cache";
import { db } from "@/lib/db";

export type SiteSettings = Omit<SiteSettingsRow, "id" | "updatedAt">;

const SETTINGS_ID = "settings";

/** Site-wide settings; the row is created with schema defaults on first read. */
export function getSettings(): Promise<SiteSettings> {
	return cached(CACHE_KEYS.settings, async () => {
		const {
			id: _,
			updatedAt: __,
			...settings
		} = await db.siteSettings.upsert({
			where: { id: SETTINGS_ID },
			create: { id: SETTINGS_ID },
			update: {},
		});
		return settings;
	});
}

export async function updateSettings(data: Partial<SiteSettings>) {
	await db.siteSettings.upsert({
		where: { id: SETTINGS_ID },
		create: { id: SETTINGS_ID, ...data },
		update: data,
	});
	await invalidate(CACHE_KEYS.settings);
}
