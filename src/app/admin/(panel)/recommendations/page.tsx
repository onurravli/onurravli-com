import { collections } from "@/lib/admin/collections";
import { RecommendationsEditor } from "../_components/editors/recommendations-editor";

export default async function RecommendationsPage() {
	return (
		<RecommendationsEditor
			items={await collections.recommendations.findAll()}
		/>
	);
}
