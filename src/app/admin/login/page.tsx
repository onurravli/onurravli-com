import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
	title: "Sign in",
	robots: { index: false },
};

async function login(form: FormData) {
	"use server";
	try {
		await signIn("credentials", {
			username: form.get("username"),
			password: form.get("password"),
			redirectTo: "/admin",
		});
	} catch (error) {
		// signIn signals success with a redirect, which must be rethrown.
		if (error instanceof AuthError) redirect("/admin/login?error=1");
		throw error;
	}
}

const inputClass =
	"rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

export default async function LoginPage({
	searchParams,
}: {
	searchParams: Promise<{ error?: string }>;
}) {
	const { error } = await searchParams;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-background px-4">
			<div className="w-full max-w-sm space-y-6">
				<div className="rounded-lg border border-border bg-card p-6 shadow-sm">
					{error && (
						<p className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
							Invalid username or password.
						</p>
					)}
					<form action={login} className="flex flex-col gap-4">
						<div className="flex flex-col gap-1.5">
							<Label
								htmlFor="username"
								className="text-sm font-medium text-foreground"
							>
								Username
							</Label>
							<Input
								id="username"
								name="username"
								type="text"
								placeholder="Enter your username"
								required
								autoComplete="username"
								className={inputClass}
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<Label
								htmlFor="password"
								className="text-sm font-medium text-foreground"
							>
								Password
							</Label>
							<Input
								id="password"
								name="password"
								type="password"
								placeholder="Enter your password"
								required
								autoComplete="current-password"
								className={inputClass}
							/>
						</div>
						<Button type="submit">Sign in</Button>
					</form>
				</div>
			</div>
		</div>
	);
}
