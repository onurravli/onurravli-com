import { getSettings } from "@/lib/settings";
import { SiteSettingsEditor } from "../_components/site-settings-editor";

export default async function SettingsPage() {
	return <SiteSettingsEditor values={await getSettings()} />;
}
