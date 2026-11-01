import { collections } from "@/lib/admin/collections";
import { ProjectReposEditor } from "../_components/editors/project-repos-editor";

export default async function ProjectsPage() {
	return (
		<ProjectReposEditor items={await collections.projectRepos.findAll()} />
	);
}
