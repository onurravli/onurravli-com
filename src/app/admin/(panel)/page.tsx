import { redirect } from "next/navigation";
import { DEFAULT_SECTION } from "./_components/sections";

export default function AdminIndex() {
	redirect(`/admin/${DEFAULT_SECTION}`);
}
