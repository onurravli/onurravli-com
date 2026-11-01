"use client";

import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { useEffect, useState } from "react";
import { mdxComponents, mdxOptions } from "@/components/site/mdx-components";

type State =
	| { status: "loading" }
	| { status: "error" }
	| { status: "ready"; source: MDXRemoteSerializeResult };

/** Live preview for the blog editor, rendered with the same elements as published posts. */
export function MdxPreview({ content }: { content: string }) {
	const [state, setState] = useState<State>({ status: "loading" });

	useEffect(() => {
		let cancelled = false;
		setState({ status: "loading" });
		serialize(content, { mdxOptions })
			.then((source) => !cancelled && setState({ status: "ready", source }))
			.catch(() => !cancelled && setState({ status: "error" }));
		return () => {
			cancelled = true;
		};
	}, [content]);

	if (state.status === "loading") {
		return (
			<div className="animate-pulse">
				<div className="h-8 bg-muted mb-4" />
				<div className="h-4 bg-muted mb-2" />
				<div className="h-4 bg-muted mb-2" />
				<div className="h-4 bg-muted mb-4 w-3/4" />
			</div>
		);
	}
	if (state.status === "error") {
		return <p className="text-sm text-destructive">Failed to render content</p>;
	}
	return (
		<div className="text-[1.0625rem]">
			<MDXRemote {...state.source} components={mdxComponents} />
		</div>
	);
}
