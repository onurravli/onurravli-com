import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mdx } from "@/components/site/mdx";
import { TagList } from "@/components/site/tag-list";
import { getPublishedPost } from "@/lib/content";
import { formatPostDate, formatReadingTime } from "@/lib/format";
import { getSettings } from "@/lib/settings";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const post = await getPublishedPost((await params).slug);
	if (!post) return {};

	return {
		title: post.title,
		description: post.description,
		alternates: { canonical: `/blog/${post.slug}` },
		openGraph: {
			type: "article",
			title: post.title,
			description: post.description,
			url: `/blog/${post.slug}`,
			publishedTime: post.date,
			tags: post.tags,
		},
		twitter: {
			card: "summary_large_image",
			title: post.title,
			description: post.description,
		},
	};
}

export default async function BlogPostPage({ params }: Props) {
	const [post, settings] = await Promise.all([
		getPublishedPost((await params).slug),
		getSettings(),
	]);
	if (!post) notFound();

	const [cover, ...gallery] = post.images;

	return (
		<article className="page pt-10 pb-20 sm:pt-16">
			<Link
				href="/#blog"
				className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
			>
				<ArrowLeft aria-hidden="true" className="size-3.5" />
				All posts
			</Link>

			<header className="mt-10">
				<p className="font-mono text-xs text-muted-foreground">
					<time dateTime={post.date}>{formatPostDate(post.date)}</time>
					<span aria-hidden="true"> · </span>
					{formatReadingTime(post.readingTime)}
				</p>
				<h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
					{post.title}
				</h1>
				{post.description && (
					<p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
						{post.description}
					</p>
				)}
			</header>

			{cover && (
				<div className="relative mt-10 aspect-[2/1] overflow-hidden rounded-lg border border-border">
					<Image
						src={cover}
						alt=""
						fill
						priority
						sizes="(max-width: 768px) 100vw, 672px"
						className="object-cover"
					/>
				</div>
			)}

			<div className="mt-10 text-[1.0625rem]">
				{post.content ? (
					<Mdx source={post.content} />
				) : (
					<p className="text-muted-foreground">This post has no content yet.</p>
				)}
			</div>

			{gallery.length > 0 && (
				<div className="mt-12 grid gap-3 sm:grid-cols-2">
					{gallery.map((image, index) => (
						<div
							key={image}
							className="relative aspect-video overflow-hidden rounded-lg border border-border"
						>
							<Image
								src={image}
								alt={`${post.title} — image ${index + 2}`}
								fill
								sizes="(max-width: 640px) 100vw, 336px"
								className="object-cover"
							/>
						</div>
					))}
				</div>
			)}

			<footer className="mt-16 flex flex-col gap-6 border-t border-border pt-8 sm:justify-between">
				<div className="flex items-center gap-3">
					<Image
						src={settings.imagePath}
						alt=""
						width={40}
						height={40}
						className="size-10 rounded-full border border-border object-cover"
					/>
					<div className="text-sm">
						<p className="font-medium text-foreground">{settings.name}</p>
						<p className="text-muted-foreground">{settings.title}</p>
					</div>
				</div>
				<TagList tags={post.tags} label="Tags" />
			</footer>
		</article>
	);
}
