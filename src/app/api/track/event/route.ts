import { z } from "zod";
import { clickhouse } from "@/lib/clickhouse";

const schema = z.object({
	session_id: z.uuid(),
	path: z.string().max(2048),
	event_name: z.string().min(1).max(100),
	metadata: z.record(z.string(), z.string().max(500)).default({}),
});

export async function POST(request: Request) {
	const parsed = schema.safeParse(await request.json().catch(() => null));
	if (!parsed.success) return Response.json({ ok: false }, { status: 400 });

	const { metadata, ...event } = parsed.data;
	try {
		await clickhouse().insert({
			table: "events",
			values: [{ ...event, metadata: JSON.stringify(metadata) }],
			format: "JSONEachRow",
		});
		return Response.json({ ok: true });
	} catch (error) {
		console.error("[track/event]", error);
		return Response.json({ ok: false }, { status: 500 });
	}
}
