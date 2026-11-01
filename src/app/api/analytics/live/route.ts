import { auth } from "@/auth";
import { countLiveSessions } from "@/lib/analytics/presence";

export const dynamic = "force-dynamic";

export async function GET() {
	if (!(await auth())) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}
	const count = await countLiveSessions().catch(() => 0);
	return Response.json({ count });
}
