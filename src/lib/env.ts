import "server-only";

/** Reads a required server environment variable, failing loudly when unset. */
export function requireEnv(name: string): string {
	const value = process.env[name];
	if (!value) throw new Error(`Missing environment variable: ${name}`);
	return value;
}
