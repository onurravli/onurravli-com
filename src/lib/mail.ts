import "server-only";
import type { ReactElement } from "react";
import { Resend } from "resend";
import { requireEnv } from "@/lib/env";

let client: Resend | undefined;

/** Sends a notification email to the site owner. */
export async function sendOwnerMail(subject: string, react: ReactElement) {
	client ??= new Resend(requireEnv("RESEND_API_KEY"));
	const { error } = await client.emails.send({
		from: `"${requireEnv("RESEND_FROM_NAME")}" <${requireEnv("RESEND_FROM_MAIL")}>`,
		to: `"${requireEnv("RESEND_TO_NAME")}" <${requireEnv("RESEND_TO_MAIL")}>`,
		subject,
		react,
	});
	if (error) throw new Error(`Resend: ${error.message}`);
}
