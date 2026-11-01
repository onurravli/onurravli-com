import { ImageResponse } from "next/og";
import { getAccentColor } from "@/lib/accent-colors";
import { ogColors as colors, loadAvatar, loadOgFonts, ogSize } from "@/lib/og";
import { getSettings } from "@/lib/settings";
import { SITE_HOST } from "@/lib/site";

export const alt = "Onur Ravli";
export const contentType = "image/png";
export const size = ogSize;
export const dynamic = "force-dynamic";

export default async function Image() {
	const settings = await getSettings();
	const accent = getAccentColor(settings.accentColor).colors;
	const [avatar, fonts] = await Promise.all([
		settings.heroShowImage ? loadAvatar(settings.imagePath) : null,
		loadOgFonts(),
	]);

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
				padding: "72px 80px 64px",
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "flex-start",
					justifyContent: "space-between",
					gap: "48px",
				}}
			>
				<div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
					<div
						style={{
							display: "flex",
							fontSize: "96px",
							fontWeight: 600,
							lineHeight: 1,
							letterSpacing: "-3.5px",
						}}
					>
						{settings.name}
					</div>
					<div
						style={{
							display: "flex",
							marginTop: "22px",
							fontSize: "36px",
							color: colors.muted,
							letterSpacing: "-0.5px",
						}}
					>
						{settings.title}
					</div>
				</div>
				{avatar && (
					// biome-ignore lint/performance/noImgElement: Satori renders plain <img>
					<img
						src={avatar}
						alt=""
						width={152}
						height={152}
						style={{
							borderRadius: "999px",
							border: `2px solid ${colors.border}`,
							objectFit: "cover",
						}}
					/>
				)}
			</div>

			<div
				style={{
					display: "flex",
					maxWidth: "900px",
					fontSize: "32px",
					lineHeight: 1.45,
					color: colors.body,
					letterSpacing: "-0.3px",
				}}
			>
				{settings.description}
			</div>

			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					borderTop: `1px solid ${colors.border}`,
					paddingTop: "28px",
					fontFamily: "Berkeley Mono",
					fontSize: "22px",
					color: colors.muted,
				}}
			>
				<div style={{ display: "flex", letterSpacing: "1px" }}>{SITE_HOST}</div>
				{settings.opengraphSubtitle && (
					<div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
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
						<div style={{ display: "flex", color: colors.foreground }}>
							{settings.opengraphSubtitle}
						</div>
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
