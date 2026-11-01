import { getSettings } from "@/lib/settings";
import { HeroEditor } from "../_components/hero-editor";

export default async function HeroPage() {
	return <HeroEditor values={await getSettings()} />;
}
