import {
	DEFAULT_ACCENT,
	getAccentColor,
	isAccentColorKey,
} from "@/lib/accent-colors";
import { getSettings } from "@/lib/settings";
import { AccentColorPicker } from "../_components/accent-color-picker";

export default async function AccentPage() {
	const { accentColor } = await getSettings();
	const current = isAccentColorKey(accentColor) ? accentColor : DEFAULT_ACCENT;
	const color = getAccentColor(current);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-3">
				<div className="flex items-center gap-2 rounded-full border border-border px-3 py-1">
					<div
						className="h-3 w-3 rounded-full"
						style={{ backgroundColor: color.colors[500] }}
					/>
					<span className="text-xs text-muted-foreground">{color.name}</span>
				</div>
			</div>
			<AccentColorPicker current={current} />
		</div>
	);
}
