"use client";

import Image from "next/image";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import type { SiteSettings } from "@/lib/settings";
import { saveSiteSettings } from "../actions";
import {
	SettingsField,
	SettingsForm,
	settingsInputClass,
} from "./settings-form";

type Values = Pick<
	SiteSettings,
	"imagePath" | "heroShowImage" | "footerCopyright" | "opengraphSubtitle"
>;

export function SiteSettingsEditor({ values }: { values: Values }) {
	const [showImage, setShowImage] = useState(values.heroShowImage);

	return (
		<SettingsForm
			action={saveSiteSettings}
			success={{
				title: "Site settings updated",
				description: "Your site settings were saved.",
			}}
			failure="Failed to update site settings"
			className="gap-6"
		>
			<div className="flex flex-col gap-3">
				<h3 className="text-sm font-semibold text-foreground">Profile Image</h3>
				<div className="flex gap-4 items-start">
					<div className="flex-1">
						<SettingsField id="imagePath" label="Image URL">
							<input
								id="imagePath"
								name="imagePath"
								type="url"
								defaultValue={values.imagePath}
								required
								className={settingsInputClass}
							/>
						</SettingsField>
					</div>
					<Image
						src={values.imagePath}
						alt="Profile preview"
						width={64}
						height={64}
						className="w-16 h-16 rounded-lg object-cover border border-border mt-6 shrink-0"
					/>
				</div>
				<div className="rounded-md border border-border">
					<div className="px-3 flex items-center justify-between py-2">
						<div>
							<label
								htmlFor="heroShowImage"
								className="text-sm font-medium text-foreground"
							>
								Show on Hero
							</label>
							<p className="text-xs text-muted-foreground">
								Display the profile image in the homepage hero section
							</p>
						</div>
						<input
							type="hidden"
							name="heroShowImage"
							value={showImage ? "on" : "off"}
						/>
						<Switch
							id="heroShowImage"
							checked={showImage}
							onCheckedChange={setShowImage}
						/>
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-3">
				<h3 className="text-sm font-semibold text-foreground">Footer</h3>
				<SettingsField id="footerCopyright" label="Copyright Text">
					<input
						id="footerCopyright"
						name="footerCopyright"
						type="text"
						defaultValue={values.footerCopyright}
						required
						className={settingsInputClass}
					/>
				</SettingsField>
			</div>
			<div className="flex flex-col gap-3">
				<h3 className="text-sm font-semibold text-foreground">OpenGraph</h3>
				<SettingsField
					id="opengraphSubtitle"
					label="Subtitle Badge"
					hint='pill shown in OG image (e.g. "Available for collaboration")'
				>
					<input
						id="opengraphSubtitle"
						name="opengraphSubtitle"
						type="text"
						defaultValue={values.opengraphSubtitle}
						required
						className={settingsInputClass}
					/>
				</SettingsField>
			</div>
		</SettingsForm>
	);
}
