import type { Metadata } from "next";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { requireAdmin } from "@/lib/auth-guard";
import { getSettings } from "@/lib/settings";
import { AdminHeader } from "./_components/admin-header";
import { AdminSidebar } from "./_components/admin-sidebar";

export const metadata: Metadata = {
	title: "Admin",
	robots: { index: false },
};

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	await requireAdmin();
	const { name, imagePath } = await getSettings();

	return (
		<SidebarProvider>
			<AdminSidebar name={name} imagePath={imagePath} />
			<SidebarInset>
				<AdminHeader />
				<main className="p-6 w-full max-w-3xl mx-auto">{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
