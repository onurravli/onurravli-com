import "server-only";
import { type ClickHouseClient, createClient } from "@clickhouse/client";
import { requireEnv } from "@/lib/env";

let client: ClickHouseClient | undefined;

export function clickhouse(): ClickHouseClient {
	client ??= createClient({
		url: requireEnv("CLICKHOUSE_HOST"),
		username: process.env.CLICKHOUSE_USERNAME ?? "default",
		password: process.env.CLICKHOUSE_PASSWORD ?? "",
		database: process.env.CLICKHOUSE_DATABASE ?? "analytics",
	});
	return client;
}
