import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

/** Server Functions are public endpoints: every admin one must call this first. */
export async function requireAdmin() {
	if (!(await auth())) redirect("/admin/login");
}
