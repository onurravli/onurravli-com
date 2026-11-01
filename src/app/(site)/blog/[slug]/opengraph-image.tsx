import { ImageResponse } from "next/og";
import { getAccentColor } from "@/lib/accent-colors";
import { getPublishedPost } from "@/lib/content";
import { formatPostDate, formatReadingTime } from "@/lib/format";
import { ogColors as colors, loadAvatar, loadOgFonts, ogSize } from "@/lib/og";
import { getSettings } from "@/lib/settings";
import { SITE_HOST } from "@/lib/site";

export const alt = "A post on Onur Ravli's blog";
export const contentType = "image/png";
export const size = ogSize;

/** Long titles step down so they still fit in three lines. */
function titleSize(title: string): number {
	if (title.length <= 32) return 80;
	if (title.length <= 60) return 68;
	return 56;
}

export default async function Image({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const [post, settings, fonts] = await Promise.all([
		getPublishedPost(slug),
		getSettings(),
		loadOgFonts(),
	]);
	const accent = getAccentColor(settings.accentColor).colors;
	const avatar = await loadAvatar(settings.imagePath);
	const title = post?.title ?? settings.name;
	const fontSize = titleSize(title);
	const meta = post
		? `${formatPostDate(post.date)} · ${formatReadingTime(post.readingTime)}`
		: null;

	return new ImageResponse(
		<div
			style={{
				height: "100%",
				width: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				backgroundColor: colors.background,
				color: colors.foreground,
				fontFamily: "Geist",
				padding: "64px 80px 56px",
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "14px",
					fontFamily: "Berkeley Mono",
					fontSize: "22px",
					color: colors.muted,
					letterSpacing: "1px",
				}}
			>
				<div
					style={{
						display: "flex",
						width: "12px",
						height: "12px",
						borderRadius: "999px",
						backgroundColor: accent[600],
						boxShadow: `0 0 0 6px ${accent[100]}`,
					}}
				/>
				<div style={{ display: "flex", marginLeft: "6px" }}>
					{SITE_HOST}/blog
				</div>
			</div>

			<div style={{ display: "flex", flexDirection: "column" }}>
				<div
					style={{
						display: "flex",
						maxHeight: `${fontSize * 1.08 * 3}px`,
						overflow: "hidden",
						fontSize: `${fontSize}px`,
						fontWeight: 600,
						lineHeight: 1.08,
						letterSpacing: `${-fontSize * 0.035}px`,
					}}
				>
					{title}
				</div>
				{post?.description && (
					<div
						style={{
							display: "flex",
							marginTop: "28px",
							maxWidth: "960px",
							maxHeight: `${28 * 1.45 * 2}px`,
							overflow: "hidden",
							fontSize: "28px",
							lineHeight: 1.45,
							color: colors.body,
							letterSpacing: "-0.3px",
						}}
					>
						{post.description}
					</div>
				)}
			</div>

			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					borderTop: `1px solid ${colors.border}`,
					paddingTop: "26px",
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
					{avatar && (
						// biome-ignore lint/performance/noImgElement: Satori renders plain <img>
						<img
							src={avatar}
							alt=""
							width={48}
							height={48}
							style={{
								borderRadius: "999px",
								border: `1px solid ${colors.border}`,
								objectFit: "cover",
							}}
						/>
					)}
					<div style={{ display: "flex", fontSize: "26px", fontWeight: 600 }}>
						{settings.name}
					</div>
				</div>
				{meta && (
					<div
						style={{
							display: "flex",
							fontFamily: "Berkeley Mono",
							fontSize: "22px",
							color: colors.muted,
						}}
					>
						{meta}
					</div>
				)}
			</div>
		</div>,
		{
			...size,
			fonts,
		},
	);
}
