import { NextResponse } from "next/server";
import { auth } from "@/auth";

const LOGIN = "/admin/login";

/**
 * Keeps signed-out visitors out of the admin area. Every admin Server Function
 * and route handler checks the session again; this only handles redirects.
 */
export default auth((req) => {
	const { pathname } = req.nextUrl;
	const signedIn = Boolean(req.auth);

	if (pathname.startsWith("/api/")) {
		return signedIn
			? NextResponse.next()
			: NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	if (pathname === LOGIN) {
		return signedIn
			? NextResponse.redirect(new URL("/admin", req.url))
			: NextResponse.next();
	}
	return signedIn
		? NextResponse.next()
		: NextResponse.redirect(new URL(LOGIN, req.url));
});

export const config = {
	matcher: ["/admin/:path*", "/api/analytics/:path*"],
};
