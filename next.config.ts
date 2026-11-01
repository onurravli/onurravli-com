import type { NextConfig } from "next";
import { CV_PATH } from "./src/lib/site";

const nextConfig: NextConfig = {
	output: "standalone",
	devIndicators: false,
	// The OG image routes read these fonts from disk at runtime.
	outputFileTracingIncludes: {
		"/**/opengraph-image": ["./assets/**/*"],
	},
	images: {
		// Avatars and post images can be any URL set in the admin panel.
		remotePatterns: [{ protocol: "https", hostname: "**" }],
	},
	async redirects() {
		return [
			{
				source: "/:path*",
				has: [{ type: "host", value: "onurravli.com" }],
				destination: "https://www.onurravli.com/:path*",
				permanent: true,
			},
			{ source: "/cv", destination: CV_PATH, permanent: false },
		];
	},
};

export default nextConfig;
