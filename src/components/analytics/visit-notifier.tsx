"use client";

import { useEffect } from "react";
import { notifyVisit } from "@/app/actions";

const NOTIFIED_KEY = "visit_notified";
const DWELL_MS = 3000;
const INTERACTIONS = [
	"pointerdown",
	"keydown",
	"scroll",
	"mousemove",
	"touchstart",
] as const;

/**
 * Emails the owner about a visit, once per browser session and only after the
 * visitor looks human: a real interaction or ~3s of visible dwell. Together
 * with the server-side bot check this filters out most crawlers.
 */
export function VisitNotifier() {
	useEffect(() => {
		try {
			if (sessionStorage.getItem(NOTIFIED_KEY)) return;
		} catch {}

		let timer: ReturnType<typeof setTimeout> | undefined;

		const stopDwell = () => {
			clearTimeout(timer);
			timer = undefined;
		};
		const startDwell = () => {
			if (!timer && document.visibilityState === "visible") {
				timer = setTimeout(fire, DWELL_MS);
			}
		};
		const onVisibility = () =>
			document.visibilityState === "visible" ? startDwell() : stopDwell();

		const cleanup = () => {
			for (const event of INTERACTIONS) window.removeEventListener(event, fire);
			document.removeEventListener("visibilitychange", onVisibility);
			stopDwell();
		};

		function fire() {
			cleanup();
			try {
				sessionStorage.setItem(NOTIFIED_KEY, "1");
			} catch {}
			notifyVisit();
		}

		for (const event of INTERACTIONS) {
			window.addEventListener(event, fire, { passive: true });
		}
		document.addEventListener("visibilitychange", onVisibility);
		startDwell();

		return cleanup;
	}, []);

	return null;
}
