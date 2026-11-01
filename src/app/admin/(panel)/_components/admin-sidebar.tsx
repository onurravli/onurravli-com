"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
} from "@/components/ui/sidebar";
import { signOutAction } from "../actions";
import { SECTION_GROUPS, sectionFromPath } from "./sections";

export function AdminSidebar({
	name,
	imagePath,
}: {
	name: string;
	imagePath: string;
}) {
	const active = sectionFromPath(usePathname())?.slug;

	return (
		<Sidebar>
			<SidebarHeader className="border-b border-sidebar-border">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<Link href="/">
								<ArrowLeft className="size-4" />
								<span>Back to website</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				{SECTION_GROUPS.map((group, index) => (
					<SidebarGroup key={group.label}>
						{index > 0 && <SidebarSeparator />}
						<SidebarGroupLabel>{group.label}</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{group.sections.map(({ slug, label, icon: Icon }) => (
									<SidebarMenuItem key={slug}>
										<SidebarMenuButton asChild isActive={active === slug}>
											<Link href={`/admin/${slug}`}>
												<Icon className="size-4" />
												<span>{label}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>

			<SidebarFooter className="border-t border-sidebar-border p-3">
				<div className="flex items-center gap-2">
					<Image
						src={imagePath}
						alt={`${name} profile`}
						width={28}
						height={28}
						className="h-7 w-7 rounded-md border border-sidebar-border object-cover shrink-0"
					/>
					<span className="flex-1 text-xs text-sidebar-foreground/70 truncate">
						{name}
					</span>
					<form action={signOutAction}>
						<button
							type="submit"
							className="rounded px-2 py-1 text-xs text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
						>
							Sign out
						</button>
					</form>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
