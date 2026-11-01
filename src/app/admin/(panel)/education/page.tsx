import { collections } from "@/lib/admin/collections";
import { EducationEditor } from "../_components/editors/education-editor";

export default async function EducationPage() {
	return <EducationEditor items={await collections.education.findAll()} />;
}
