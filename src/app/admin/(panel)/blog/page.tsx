import { db } from "@/lib/db";
import { BlogEditor } from "../_components/blog-editor";

export default async function BlogPage() {
	const posts = await db.blogPost.findMany({ orderBy: { date: "desc" } });
	return <BlogEditor initialPosts={posts} />;
}
