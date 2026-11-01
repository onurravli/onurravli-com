import { z } from "zod";

export const CONTACT_MESSAGE_MAX = 1000;

export const contactFormSchema = z.object({
	name: z.string().trim().min(2, "Name must be at least 2 characters long"),
	email: z.email("Invalid email address"),
	message: z
		.string()
		.trim()
		.min(10, "Message must be at least 10 characters long")
		.max(CONTACT_MESSAGE_MAX),
});

export type ContactForm = z.infer<typeof contactFormSchema>;
