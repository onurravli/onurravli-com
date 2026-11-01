import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents, mdxOptions } from "@/components/site/mdx-components";

/** Renders a post on the server: no MDX compiler or highlighter reaches the browser. */
export function Mdx({ source }: { source: string }) {
	return (
		<MDXRemote
			source={source}
			components={mdxComponents}
			options={{ mdxOptions }}
		/>
	);
}
