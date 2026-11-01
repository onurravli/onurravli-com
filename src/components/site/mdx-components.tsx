import type { serialize } from "next-mdx-remote/serialize";
import rehypePrettyCode from "rehype-pretty-code";
import { CodeBlock } from "@/components/site/code-block";

type Props<T = HTMLElement> = React.HTMLAttributes<T>;

/** Element overrides for blog posts, shared by the server renderer and the admin preview. */
export const mdxComponents = {
	h1: (props: Props<HTMLHeadingElement>) => (
		<h2
			className="mt-12 mb-4 text-2xl font-semibold tracking-tight"
			{...props}
		/>
	),
	h2: (props: Props<HTMLHeadingElement>) => (
		<h2
			className="mt-12 mb-4 text-xl font-semibold tracking-tight"
			{...props}
		/>
	),
	h3: (props: Props<HTMLHeadingElement>) => (
		<h3 className="mt-8 mb-3 text-lg font-semibold" {...props} />
	),
	p: (props: Props<HTMLParagraphElement>) => (
		<p className="my-5 leading-[1.75] text-foreground/85" {...props} />
	),
	ul: (props: Props<HTMLUListElement>) => (
		<ul
			className="my-5 ml-5 list-disc space-y-2 text-foreground/85 marker:text-muted-foreground"
			{...props}
		/>
	),
	ol: (props: Props<HTMLOListElement>) => (
		<ol
			className="my-5 ml-5 list-decimal space-y-2 text-foreground/85 marker:text-muted-foreground"
			{...props}
		/>
	),
	li: (props: Props<HTMLLIElement>) => (
		<li className="pl-1 leading-[1.75]" {...props} />
	),
	blockquote: (props: Props<HTMLQuoteElement>) => (
		<blockquote
			className="my-6 border-l-2 border-brand pl-5 text-muted-foreground italic"
			{...props}
		/>
	),
	code: ({ children, ...props }: Props) => {
		if ("data-language" in props) {
			return (
				<code className="font-mono" {...props}>
					{children}
				</code>
			);
		}
		return (
			<code
				className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.85em]"
				{...props}
			>
				{children}
			</code>
		);
	},
	pre: (props: Props<HTMLPreElement>) => <CodeBlock {...props} />,
	a: ({ href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
		const external = href?.startsWith("http");
		return (
			<a
				href={href}
				className="link text-foreground"
				{...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
				{...props}
			/>
		);
	},
	strong: (props: Props) => (
		<strong className="font-semibold text-foreground" {...props} />
	),
	hr: (props: Props<HTMLHRElement>) => (
		<hr className="my-10 border-border" {...props} />
	),
	img: ({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
		// biome-ignore lint/performance/noImgElement: arbitrary remote MDX images without known dimensions
		<img
			alt={alt ?? ""}
			loading="lazy"
			className="my-6 rounded-lg border border-border"
			{...props}
		/>
	),
};

/** Dual-theme syntax highlighting; globals.css shows the block matching the page. */
export const mdxOptions = {
	rehypePlugins: [
		[
			rehypePrettyCode,
			{
				themes: { dark: "github-dark", light: "github-light" },
				keepBackground: true,
			},
		],
	],
} satisfies NonNullable<Parameters<typeof serialize>[1]>["mdxOptions"];
