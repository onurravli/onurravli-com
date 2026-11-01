"use client";

import type { SiteSettings } from "@/lib/settings";
import { saveHero } from "../actions";
import {
	SettingsField,
	SettingsForm,
	settingsInputClass,
} from "./settings-form";

type HeroValues = Pick<
	SiteSettings,
	| "name"
	| "title"
	| "description"
	| "heroPrimaryCtaText"
	| "heroPrimaryCtaHref"
	| "heroPrimaryCtaTarget"
	| "heroSecondaryCtaText"
	| "heroSecondaryCtaHref"
	| "heroSecondaryCtaTarget"
>;

function CtaFields({
	title,
	prefix,
	values,
	placeholder,
}: {
	title: string;
	prefix: "heroPrimaryCta" | "heroSecondaryCta";
	values: HeroValues;
	placeholder: { text: string; href: string };
}) {
	const id = (field: "Text" | "Href" | "Target") =>
		`${prefix}${field}` as const;

	return (
		<div className="flex flex-col gap-4 rounded-lg border border-border p-4">
			<p className="text-sm font-medium text-foreground">{title}</p>
			<SettingsField id={id("Text")} label="Text">
				<input
					id={id("Text")}
					name={id("Text")}
					type="text"
					defaultValue={values[id("Text")]}
					placeholder={placeholder.text}
					className={settingsInputClass}
				/>
			</SettingsField>
			<SettingsField id={id("Href")} label="Link">
				<input
					id={id("Href")}
					name={id("Href")}
					type="text"
					defaultValue={values[id("Href")]}
					placeholder={placeholder.href}
					className={settingsInputClass}
				/>
			</SettingsField>
			<SettingsField id={id("Target")} label="Target">
				<select
					id={id("Target")}
					name={id("Target")}
					defaultValue={values[id("Target")]}
					className={settingsInputClass}
				>
					<option value="_self">Same tab</option>
					<option value="_blank">New tab</option>
				</select>
			</SettingsField>
		</div>
	);
}

export function HeroEditor({ values }: { values: HeroValues }) {
	return (
		<SettingsForm
			action={saveHero}
			success={{
				title: "Hero text updated",
				description: "Your homepage intro was saved.",
			}}
			failure="Failed to update hero text"
		>
			<SettingsField
				id="name"
				label="Name"
				hint="your name as the page heading"
			>
				<input
					id="name"
					name="name"
					type="text"
					defaultValue={values.name}
					required
					className={settingsInputClass}
				/>
			</SettingsField>
			<SettingsField
				id="title"
				label="Title"
				hint='page title & OG image (e.g. "Full-Stack Developer")'
			>
				<input
					id="title"
					name="title"
					type="text"
					defaultValue={values.title}
					required
					className={settingsInputClass}
				/>
			</SettingsField>
			<SettingsField
				id="description"
				label="Description"
				hint="subtitle below the name"
			>
				<textarea
					id="description"
					name="description"
					defaultValue={values.description}
					required
					rows={3}
					className={`${settingsInputClass} resize-none`}
				/>
			</SettingsField>
			<div className="grid gap-4 md:grid-cols-2">
				<CtaFields
					title="Primary CTA"
					prefix="heroPrimaryCta"
					values={values}
					placeholder={{ text: "View Projects", href: "/#projects" }}
				/>
				<CtaFields
					title="Secondary CTA"
					prefix="heroSecondaryCta"
					values={values}
					placeholder={{ text: "Contact Me", href: "/#contact" }}
				/>
			</div>
		</SettingsForm>
	);
}
