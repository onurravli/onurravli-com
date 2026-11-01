/** Browser-side analytics helpers shared by the tracker components. */

const CONSENT_COOKIE = "analytics_consent";
const SESSION_KEY = "visitor_session_id";

export function hasConsent(): boolean {
	return document.cookie
		.split("; ")
		.some((cookie) => cookie === `${CONSENT_COOKIE}=true`);
}

export function grantConsent() {
	const maxAge = 60 * 60 * 24 * 365;
	// biome-ignore lint/suspicious/noDocumentCookie: a single first-party preference cookie
	document.cookie = `${CONSENT_COOKIE}=true; max-age=${maxAge}; path=/; SameSite=Lax`;
}

/** A random per-tab id linking one visit's page views; never tied to identity. */
export function sessionId(): string {
	let id = sessionStorage.getItem(SESSION_KEY);
	if (!id) {
		id = crypto.randomUUID();
		sessionStorage.setItem(SESSION_KEY, id);
	}
	return id;
}

export function post(url: string, body: unknown) {
	return fetch(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
		keepalive: true,
	}).catch(() => {});
}

/** Sends an interaction event, only with consent. */
export function trackEvent(name: string, metadata: Record<string, string>) {
	if (!hasConsent()) return;
	post("/api/track/event", {
		session_id: sessionId(),
		path: window.location.pathname,
		event_name: name,
		metadata,
	});
}
