"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { sectionFromPath } from "./sections";
import { ThemeToggle } from "./theme-toggle";

export function AdminHeader() {
	const section = sectionFromPath(usePathname());

	return (
		<header className="flex h-16 items-center gap-3 border-border bg-background px-4">
			<SidebarTrigger className="-ml-1" />
			<div className="h-4 w-px bg-border" />
			<h1 className="text-sm font-medium text-foreground">
				{section ? (section.title ?? section.label) : "Admin Panel"}
			</h1>
			<div className="ml-auto">
				<ThemeToggle />
			</div>
		</header>
	);
}
