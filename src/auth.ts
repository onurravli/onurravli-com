import { timingSafeEqual } from "node:crypto";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

function safeEqual(a: string, b: string) {
	const left = Buffer.from(a);
	const right = Buffer.from(b);
	return left.length === right.length && timingSafeEqual(left, right);
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Credentials({
			credentials: {
				username: { label: "Username", type: "text" },
				password: { label: "Password", type: "password" },
			},
			authorize({ username, password }) {
				const { ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;
				if (
					ADMIN_USERNAME &&
					ADMIN_PASSWORD &&
					typeof username === "string" &&
					typeof password === "string" &&
					safeEqual(username, ADMIN_USERNAME) &&
					safeEqual(password, ADMIN_PASSWORD)
				) {
					return { id: "admin", name: "Admin" };
				}
				return null;
			},
		}),
	],
	pages: { signIn: "/admin/login" },
	session: { strategy: "jwt" },
	trustHost: true,
});
