"use client";

import { useEffect } from "react";
import { notifyCvView } from "@/app/actions";
import { trackEvent } from "@/lib/analytics/client";

const CV_NOTIFIED_KEY = "cv_view_notified";

/** Emails the owner about a CV view at most once per browser session. */
function notifyCvViewOnce(source: string) {
	try {
		if (sessionStorage.getItem(CV_NOTIFIED_KEY)) return;
		sessionStorage.setItem(CV_NOTIFIED_KEY, "1");
	} catch {}
	notifyCvView(source);
}

/**
 * One delegated click listener, so links can stay in server components:
 * - `data-track="event"` sends an analytics event; other `data-track-*`
 *   attributes become its metadata (`data-track-platform` → `platform`).
 * - `data-cv-source="Header"` fires the CV-view notification.
 */
export function ClickTracker() {
	useEffect(() => {
		const onClick = (event: MouseEvent) => {
			const el = (event.target as Element | null)?.closest<HTMLElement>(
				"[data-track],[data-cv-source]",
			);
			if (!el) return;

			const { track, cvSource, ...rest } = el.dataset;
			if (track) {
				const metadata: Record<string, string> = {};
				for (const [key, value] of Object.entries(rest)) {
					if (!key.startsWith("track") || value === undefined) continue;
					const field = key.slice("track".length);
					metadata[field.charAt(0).toLowerCase() + field.slice(1)] = value;
				}
				trackEvent(track, metadata);
			}
			if (cvSource) notifyCvViewOnce(cvSource);
		};

		document.addEventListener("click", onClick);
		return () => document.removeEventListener("click", onClick);
	}, []);

	return null;
}
