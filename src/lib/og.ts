import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const ogSize = { width: 1200, height: 630 };

// Satori can't read woff2, so the OG cards load the site's TTFs from assets/.
// The literal paths let output tracing bundle them (see next.config.ts).
const fontFiles = Promise.all([
	readFile(path.join(process.cwd(), "assets/geist/Geist-Regular.ttf")),
	readFile(path.join(process.cwd(), "assets/geist/Geist-SemiBold.ttf")),
	readFile(path.join(process.cwd(), "assets/Berkeley-Mono.ttf")),
]);

export async function loadOgFonts() {
	const [regular, semiBold, mono] = await fontFiles;
	return [
		{ name: "Geist", data: regular, weight: 400 as const },
		{ name: "Geist", data: semiBold, weight: 600 as const },
		{ name: "Berkeley Mono", data: mono, weight: 400 as const },
	];
}

/** Light-theme tokens from globals.css, as hex for Satori. */
export const ogColors = {
	background: "#fcfcfb",
	foreground: "#1b1c20",
	body: "#3d3f46",
	muted: "#6b6d75",
	border: "#e6e5e1",
};

/** Inlines the avatar so a slow or failing image host can't break the card. */
export async function loadAvatar(src: string): Promise<string | null> {
	try {
		const res = await fetch(src, { next: { revalidate: 60 * 60 * 24 } });
		const type = res.headers.get("content-type") ?? "";
		if (!res.ok || !type.startsWith("image/")) return null;
		const data = Buffer.from(await res.arrayBuffer()).toString("base64");
		return `data:${type};base64,${data}`;
	} catch {
		return null;
	}
}
