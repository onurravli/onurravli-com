"use client";

import { ShieldCheck, X } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	grantConsent,
	hasConsent,
	post,
	sessionId,
} from "@/lib/analytics/client";
import { cn } from "@/lib/utils";

const NOTICE_DISMISSED_KEY = "analytics_notice_dismissed";
const HEARTBEAT_MS = 20_000;
const UTM_KEYS = [
	"utm_source",
	"utm_medium",
	"utm_campaign",
	"utm_term",
	"utm_content",
] as const;

/** Records anonymous page views and live presence, and shows the analytics notice. */
export function VisitorTracker() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [showNotice, setShowNotice] = useState(false);

	useEffect(() => {
		setShowNotice(
			!hasConsent() && !sessionStorage.getItem(NOTICE_DISMISSED_KEY),
		);
	}, []);

	useEffect(() => {
		const referrer = document.referrer.startsWith(window.location.origin)
			? ""
			: document.referrer;
		post("/api/track", {
			session_id: sessionId(),
			path: pathname,
			referrer,
			screen_width: window.screen.width,
			screen_height: window.screen.height,
			...Object.fromEntries(
				UTM_KEYS.map((key) => [key, searchParams.get(key) ?? ""]),
			),
		});
	}, [pathname, searchParams]);

	useEffect(() => {
		const beat = () =>
			post("/api/track/heartbeat", { session_id: sessionId() });
		beat();
		const id = setInterval(beat, HEARTBEAT_MS);
		return () => clearInterval(id);
	}, []);

	if (!showNotice || pathname === "/privacy") return null;

	const accept = () => {
		grantConsent();
		setShowNotice(false);
	};
	const dismiss = () => {
		sessionStorage.setItem(NOTICE_DISMISSED_KEY, "true");
		setShowNotice(false);
	};

	return (
		<div
			className={cn(
				"animate-in fade-in slide-in-from-bottom-4 duration-300",
				"fixed bottom-6 left-1/2 -translate-x-1/2 z-60",
				"w-[calc(100%-2rem)] max-w-xl",
				"bg-background/80 backdrop-blur-md",
				"border border-border/60 rounded-xl shadow-lg",
				"px-4 py-3",
			)}
		>
			<button
				type="button"
				onClick={dismiss}
				aria-label="Dismiss"
				className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-foreground transition-colors"
			>
				<X className="size-3.5" />
			</button>

			<div className="flex items-start gap-3 pr-4">
				<ShieldCheck className="size-4 mt-0.5 shrink-0 text-muted-foreground" />
				<div className="flex flex-col gap-2.5">
					<p className="text-xs text-muted-foreground leading-relaxed">
						By using this site, you are accepting these{" "}
						<a
							href="/privacy"
							className="text-primary underline"
							target="_blank"
							rel="noopener noreferrer"
						>
							anonymous visit data collection practices
						</a>
						.
					</p>
					<div className="flex items-center gap-2">
						<Button size="sm" className="h-7 text-xs px-3" onClick={accept}>
							Accept
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
