"use client";

import { useCallback, useEffect, useRef } from "react";

const UNSAVED_CHANGES_MESSAGE =
	"You have unsaved blog post changes. Leave without saving?";

const isModifiedClick = (event: MouseEvent) =>
	event.button !== 0 ||
	event.metaKey ||
	event.ctrlKey ||
	event.shiftKey ||
	event.altKey;

/**
 * While `dirty`, asks for confirmation before the page is left by any route:
 * reload or close, in-app links, form submissions and the back button.
 */
export function useUnsavedChangesGuard(dirty: boolean) {
	// Set for a moment after the user confirms, so the navigation they agreed
	// to isn't intercepted a second time by another listener.
	const allowed = useRef(false);
	const allowTimer = useRef<number | undefined>(undefined);

	const allowNextNavigation = useCallback(() => {
		allowed.current = true;
		window.clearTimeout(allowTimer.current);
		allowTimer.current = window.setTimeout(() => {
			allowed.current = false;
		}, 1000);
	}, []);

	useEffect(() => () => window.clearTimeout(allowTimer.current), []);

	useEffect(() => {
		if (!dirty) return;
		const currentUrl = window.location.href;

		const confirmLeave = (event: Event) => {
			if (allowed.current || event.defaultPrevented) return;
			if (window.confirm(UNSAVED_CHANGES_MESSAGE)) {
				allowNextNavigation();
			} else {
				event.preventDefault();
				event.stopPropagation();
			}
		};

		const onBeforeUnload = (event: BeforeUnloadEvent) => {
			if (!allowed.current) event.preventDefault();
		};

		const onClick = (event: MouseEvent) => {
			if (isModifiedClick(event)) return;
			const anchor = (event.target as Element | null)?.closest("a[href]");
			if (!(anchor instanceof HTMLAnchorElement)) return;
			if (
				(anchor.target && anchor.target !== "_self") ||
				anchor.hasAttribute("download")
			) {
				return;
			}
			const next = new URL(anchor.href, window.location.href);
			const here = new URL(window.location.href);
			// Same page, or only the hash changes: nothing is lost.
			if (
				next.origin === here.origin &&
				next.pathname === here.pathname &&
				next.search === here.search
			) {
				return;
			}
			confirmLeave(event);
		};

		const onPopState = () => {
			if (allowed.current) return;
			const leave = window.confirm(UNSAVED_CHANGES_MESSAGE);
			allowNextNavigation();
			if (!leave)
				window.history.pushState(window.history.state, "", currentUrl);
		};

		window.addEventListener("beforeunload", onBeforeUnload);
		window.addEventListener("popstate", onPopState);
		document.addEventListener("click", onClick, true);
		document.addEventListener("submit", confirmLeave, true);
		return () => {
			window.removeEventListener("beforeunload", onBeforeUnload);
			window.removeEventListener("popstate", onPopState);
			document.removeEventListener("click", onClick, true);
			document.removeEventListener("submit", confirmLeave, true);
		};
	}, [dirty, allowNextNavigation]);

	/** For in-editor actions (switching posts, cancelling): true to proceed. */
	return useCallback(
		() => !dirty || window.confirm(UNSAVED_CHANGES_MESSAGE),
		[dirty],
	);
}
