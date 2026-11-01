import { z } from "zod";
import { recordHeartbeat } from "@/lib/analytics/presence";

const schema = z.object({ session_id: z.uuid() });

export async function POST(request: Request) {
	const parsed = schema.safeParse(await request.json().catch(() => null));
	if (!parsed.success) return Response.json({ ok: false }, { status: 400 });

	try {
		await recordHeartbeat(parsed.data.session_id);
		return Response.json({ ok: true });
	} catch (error) {
		console.error("[track/heartbeat]", error);
		return Response.json({ ok: false }, { status: 500 });
	}
}
