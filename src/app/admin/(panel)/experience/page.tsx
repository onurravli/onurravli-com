import { collections } from "@/lib/admin/collections";
import { ExperienceEditor } from "../_components/editors/experience-editor";

export default async function ExperiencePage() {
	return <ExperienceEditor items={await collections.experiences.findAll()} />;
}
