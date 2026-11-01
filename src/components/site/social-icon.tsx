import { Link2, Mail } from "lucide-react";
import { brandIcons } from "@/components/site/brand-icons";
import { cn } from "@/lib/utils";

export function SocialIcon({
	name,
	className,
}: {
	name: string;
	className?: string;
}) {
	const key = name.toLowerCase();
	const brand = brandIcons[key];
	const classes = cn("size-[1.125rem] shrink-0", className);

	if (brand) {
		return (
			<svg
				viewBox={brand.viewBox}
				fill="currentColor"
				aria-hidden="true"
				className={classes}
			>
				<path d={brand.path} />
			</svg>
		);
	}
	if (key === "mail" || key === "email") {
		return <Mail aria-hidden="true" className={classes} />;
	}
	return <Link2 aria-hidden="true" className={classes} />;
}
