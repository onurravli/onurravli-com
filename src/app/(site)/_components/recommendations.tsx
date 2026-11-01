import Image from "next/image";
import { Section } from "@/components/site/section";
import type { RecommendationEntry } from "@/lib/content";

export function RecommendationsSection({
	items,
}: {
	items: RecommendationEntry[];
}) {
	if (items.length === 0) return null;

	return (
		<Section id="recommendations" title="Recommendations">
			<ul className="grid gap-8">
				{items.map((item) => (
					<li key={item.id}>
						<figure>
							<blockquote className="text-pretty text-[0.9375rem] leading-relaxed text-foreground/85">
								“{item.body}”
							</blockquote>
							<figcaption className="mt-4 flex items-center gap-3 text-sm">
								{item.personAvatarUrl && (
									<Image
										src={item.personAvatarUrl}
										alt=""
										width={32}
										height={32}
										className="size-8 rounded-full border border-border object-cover"
									/>
								)}
								<span>
									<span className="font-medium text-foreground">
										{item.personName}
									</span>
									{(item.personTitle || item.personCompany) && (
										<span className="text-muted-foreground">
											{" "}
											·{" "}
											{[item.personTitle, item.personCompany]
												.filter(Boolean)
												.join(", ")}
										</span>
									)}
								</span>
							</figcaption>
						</figure>
					</li>
				))}
			</ul>
		</Section>
	);
}
