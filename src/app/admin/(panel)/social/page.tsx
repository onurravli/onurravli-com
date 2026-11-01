import { collections } from "@/lib/admin/collections";
import { SocialLinksEditor } from "../_components/editors/social-links-editor";

export default async function SocialPage() {
	return <SocialLinksEditor items={await collections.socialLinks.findAll()} />;
}
