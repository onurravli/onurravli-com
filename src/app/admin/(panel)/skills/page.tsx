import { collections } from "@/lib/admin/collections";
import { SkillsEditor } from "../_components/editors/skills-editor";

export default async function SkillsPage() {
	return <SkillsEditor items={await collections.skillCategories.findAll()} />;
}
