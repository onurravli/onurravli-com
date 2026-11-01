import { z } from "zod";
import { parseUserAgent } from "@/lib/analytics/user-agent";
import { clickhouse } from "@/lib/clickhouse";

const text = (max: number) => z.string().max(max).default("");
const dimension = z.number().int().min(0).max(65_535).default(0);

const schema = z.object({
	session_id: z.uuid(),
	path: z.string().min(1).max(2048),
	referrer: text(2048),
	utm_source: text(200),
	utm_medium: text(200),
	utm_campaign: text(200),
	utm_term: text(200),
	utm_content: text(200),
	screen_width: dimension,
	screen_height: dimension,
});

/** Records a page view. Location comes from the hosting edge, never the raw IP. */
export async function POST(request: Request) {
	const parsed = schema.safeParse(await request.json().catch(() => null));
	if (!parsed.success) return Response.json({ ok: false }, { status: 400 });

	const h = request.headers;
	const city = h.get("x-vercel-ip-city") ?? h.get("cf-ipcity") ?? "";
	try {
		await clickhouse().insert({
			table: "page_views",
			values: [
				{
					...parsed.data,
					...parseUserAgent(h.get("user-agent") ?? ""),
					country: h.get("x-vercel-ip-country") ?? h.get("cf-ipcountry") ?? "",
					city: decodeURIComponent(city),
				},
			],
			format: "JSONEachRow",
		});
		return Response.json({ ok: true });
	} catch (error) {
		console.error("[track]", error);
		return Response.json({ ok: false }, { status: 500 });
	}
}
