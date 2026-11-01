import { defineConfig } from "prisma/config";

// The Prisma CLI no longer reads .env on its own; load it when present so local
// commands work, while containers and CI pass real environment variables.
try {
	process.loadEnvFile();
} catch {}

export default defineConfig({
	schema: "prisma/schema.prisma",
	migrations: {
		path: "prisma/migrations",
		seed: "tsx prisma/seed.ts",
	},
	datasource: {
		url: process.env.DATABASE_URL ?? "",
	},
});
