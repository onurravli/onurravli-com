"use server";

import { isbot } from "isbot";
import { headers } from "next/headers";
import {
	type EmailField,
	NotificationEmail,
} from "@/components/emails/notification-email";
import { sendOwnerMail } from "@/lib/mail";
import { type ContactForm, contactFormSchema } from "@/lib/schemas";

async function visitorDetails() {
	const h = await headers();
	return {
		userAgent: h.get("user-agent") ?? "Unknown",
		ip: h.get("x-forwarded-for") ?? "Unknown",
		referrer: h.get("referer"),
	};
}

async function notifyOwner(
	title: string,
	subject: string,
	fields: EmailField[],
) {
	await sendOwnerMail(subject, NotificationEmail({ title, fields }));
}

export async function sendContactMessage(
	input: ContactForm,
): Promise<{ ok: boolean }> {
	const parsed = contactFormSchema.safeParse(input);
	if (!parsed.success) return { ok: false };

	const { name, email, message } = parsed.data;
	const { ip } = await visitorDetails();
	try {
		await notifyOwner(
			"New Contact Form Submission",
			"New Contact Form Submission 📫",
			[
				{ label: "Name", value: name },
				{ label: "Email", value: email },
				{ label: "Message", value: message, multiline: true },
				{ label: "IP Address", value: ip },
			],
		);
		return { ok: true };
	} catch (error) {
		console.error("[contact]", error);
		return { ok: false };
	}
}

/**
 * Emails the owner about a visit or a CV view. Best-effort: crawlers that
 * identify themselves are dropped and failures never reach the visitor.
 */
async function notifyVisitor(
	title: string,
	subject: string,
	extra: EmailField[] = [],
	fallbackReferrer = "Unknown",
) {
	try {
		const { userAgent, ip, referrer } = await visitorDetails();
		if (isbot(userAgent)) return;
		await notifyOwner(title, subject, [
			...extra,
			{ label: "Referrer", value: referrer ?? fallbackReferrer },
			{ label: "IP Address", value: ip },
			{ label: "User Agent", value: userAgent },
			{ label: "Time", value: new Date().toISOString() },
		]);
	} catch (error) {
		console.error("[notify]", error);
	}
}

export async function notifyVisit() {
	await notifyVisitor(
		"New visitor on your site",
		"New visitor on your site 👋",
		[],
		"Direct",
	);
}

export async function notifyCvView(source: string) {
	await notifyVisitor("Someone viewed your CV", "Someone viewed your CV 👀", [
		{ label: "Source", value: String(source).slice(0, 100) },
	]);
}
