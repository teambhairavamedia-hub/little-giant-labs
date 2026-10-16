import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export default async function AdminEntryPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  redirect("/admin/dashboard");
}
