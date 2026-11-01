import Link from "next/link";
import { Section } from "@/components/site/section";
import type { BlogPost } from "@/lib/content";
import { formatPostDate } from "@/lib/format";

export function BlogSection({ posts }: { posts: BlogPost[] }) {
	if (posts.length === 0) return null;

	return (
		<Section id="blog" title="Blog">
			<ul className="-my-4">
				{posts.slice(0, 5).map((post) => (
					<li key={post.id}>
						<Link
							href={`/blog/${post.slug}`}
							data-track="blog_open"
							data-track-title={post.title}
							className="group grid gap-1 py-4 sm:grid-cols-[1fr_auto] sm:gap-6"
						>
							<div className="min-w-0">
								<h3 className="font-medium text-foreground transition-colors group-hover:text-brand">
									{post.title}
								</h3>
								{post.description && (
									<p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
										{post.description}
									</p>
								)}
							</div>
							<time
								dateTime={post.date}
								className="order-first font-mono text-xs text-muted-foreground sm:order-none sm:pt-1"
							>
								{formatPostDate(post.date)}
							</time>
						</Link>
					</li>
				))}
			</ul>
		</Section>
	);
}
