import "server-only";
import { redis } from "@/lib/redis";

const KEY = "analytics:live";
/** A session counts as live while its heartbeats are at most this old. */
const WINDOW_MS = 35_000;

/** Records a heartbeat; sessions live in a sorted set scored by last-seen time. */
export async function recordHeartbeat(sessionId: string) {
	await redis().zadd(KEY, { score: Date.now(), member: sessionId });
}

export async function countLiveSessions(): Promise<number> {
	const cutoff = Date.now() - WINDOW_MS;
	await redis().zremrangebyscore(KEY, 0, cutoff);
	return redis().zcard(KEY);
}
